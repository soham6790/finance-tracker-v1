const { pool } = require('../config/db');
const fs = require('fs');
const csv = require('csv-parser');

// Get all accounts
const getAccounts = async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM accounts ORDER BY statement_date DESC');
    res.json({ success: true, data: rows });
  } catch (error) {
    console.error('Error fetching accounts:', error);
    res.status(500).json({ success: false, message: 'Error fetching accounts' });
  }
};

// Upload and parse account CSV
const uploadAccountCSV = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No file uploaded' });
    }

    const accounts = [];
    const filePath = req.file.path;

    fs.createReadStream(filePath)
      .pipe(csv())
      .on('data', (row) => {
        // Expected CSV format: account_name, account_number, statement_date, balance, account_type
        accounts.push({
          account_name: row.account_name,
          account_number: row.account_number,
          statement_date: row.statement_date,
          balance: parseFloat(row['Current Balance']) || parseFloat(row['Running Bal.']),
          transaction_date: row.date,
          description: row.description,
          amount: parseFloat(row.amount),
          account_type: row.account_type || 'Checking'
        });
      })
      .on('end', async () => {
        try {
          // Insert accounts into database
          for (const account of accounts) {
            await pool.query(
              'INSERT INTO accounts (account_name, account_number, statement_date, transaction_date, description, amount, balance, account_type) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
              [account.account_name, account.account_number, account.statement_date, account.transaction_date, account.description, account.amount, account.balance, account.account_type]
            );
          }

          // Delete uploaded file
          fs.unlinkSync(filePath);

          res.json({ 
            success: true, 
            message: `Successfully imported ${accounts.length} account statements`,
            count: accounts.length
          });
        } catch (error) {
          console.error('Error inserting accounts:', error);
          fs.unlinkSync(filePath);
          res.status(500).json({ success: false, message: 'Error saving accounts to database' });
        }
      })
      .on('error', (error) => {
        console.error('Error parsing CSV:', error);
        fs.unlinkSync(filePath);
        res.status(500).json({ success: false, message: 'Error parsing CSV file' });
      });
  } catch (error) {
    console.error('Error uploading account CSV:', error);
    res.status(500).json({ success: false, message: 'Error uploading file' });
  }
};

// Get account summary
const getAccountSummary = async (req, res) => {
  try {
    const [summary] = await pool.query(
      "SELECT account_type, COUNT(*) as count, SUM(balance) as total_balance FROM accounts GROUP BY account_type"
    );

    res.json({
      success: true,
      data: summary
    });
  } catch (error) {
    console.error('Error fetching account summary:', error);
    res.status(500).json({ success: false, message: 'Error fetching account summary' });
  }
};

module.exports = {
  getAccounts,
  uploadAccountCSV,
  getAccountSummary
};
