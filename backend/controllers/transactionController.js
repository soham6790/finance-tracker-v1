const { pool } = require('../config/db');
const fs = require('fs');
const csv = require('csv-parser');
const { convertToMySQLDate } = require('../util/dateUtil');

// Get all transactions with pagination
const getTransactions = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 50;
    const offset = (page - 1) * limit;

    // Get total count for pagination metadata
    const [countResult] = await pool.query('SELECT COUNT(*) as total FROM transactions');
    const total = countResult[0].total;
    const totalPages = Math.ceil(total / limit);

    // Get paginated transactions
    const [rows] = await pool.query(
      'SELECT * FROM transactions ORDER BY transaction_date DESC LIMIT ? OFFSET ?',
      [limit, offset]
    );

    res.json({ 
      success: true, 
      data: rows,
      pagination: {
        page,
        limit,
        total,
        totalPages,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1
      }
    });
  } catch (error) {
    console.error('Error fetching transactions:', error);
    res.status(500).json({ success: false, message: 'Error fetching transactions' });
  }
};

// Upload and parse transaction CSV
const uploadTransactionCSV = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No file uploaded' });
    }

    const transactions = [];
    const filePath = req.file.path;

    fs.createReadStream(filePath)
      .pipe(csv())
      .on('data', (row) => {
        let transactionDate = convertToMySQLDate(row['Transaction Date']);
        let postDate = convertToMySQLDate(row['Post Date'] || row['Posted Date']);
        // Use post_date as fallback if transaction_date is missing (for BoFa)
        if (!transactionDate) {
          transactionDate = postDate;
        }
        // If still null, skip this transaction
        if (!transactionDate) {
          console.log('Skipping transaction with no dates:', row);
          return; // Skip rows with no dates at all
        }
        transactions.push({
          transaction_date: transactionDate,
          post_date: postDate,
          description: row.Description || row['Payee'],
          amount: parseFloat(row.Amount),
          type: !(row.Type) ? 'BoFa' : row.Type,
          category: row.Category || 'Uncategorized',
          memo: row.Memo || row['Address'],
          reference_number: row['Reference Number']
        });
      })
      .on('end', async () => {
        try {
          // Insert transactions into database
          for (const transaction of transactions) {
            await pool.query(
              'INSERT INTO transactions (transaction_date, post_date, description, amount, type, category, memo, reference_number) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
              [transaction.transaction_date, transaction.post_date, transaction.description, transaction.amount, transaction.type, transaction.category, transaction.memo, transaction.reference_number]
            );
          }

          // Delete uploaded file
          fs.unlinkSync(filePath);

          res.json({ 
            success: true, 
            message: `Successfully imported ${transactions.length} transactions`,
            count: transactions.length
          });
        } catch (error) {
          console.error('Error inserting transactions:', error);
          fs.unlinkSync(filePath);
          res.status(500).json({ success: false, message: 'Error saving transactions to database' });
        }
      })
      .on('error', (error) => {
        console.error('Error parsing CSV:', error);
        fs.unlinkSync(filePath);
        res.status(500).json({ success: false, message: 'Error parsing CSV file' });
      });
  } catch (error) {
    console.error('Error uploading transaction CSV:', error);
    res.status(500).json({ success: false, message: 'Error uploading file' });
  }
};

// Get transaction statistics
const getTransactionStats = async (req, res) => {
  try {
    const [totalCredit] = await pool.query(
      "SELECT COALESCE(SUM(amount), 0) as total FROM transactions WHERE type = 'credit'"
    );
    const [totalDebit] = await pool.query(
      "SELECT COALESCE(SUM(amount), 0) as total FROM transactions WHERE type = 'debit'"
    );
    const [categoryStats] = await pool.query(
      "SELECT category, type, SUM(amount) as total FROM transactions GROUP BY category, type"
    );

    res.json({
      success: true,
      data: {
        totalCredit: totalCredit[0].total,
        totalDebit: totalDebit[0].total,
        balance: totalCredit[0].total - totalDebit[0].total,
        categoryStats
      }
    });
  } catch (error) {
    console.error('Error fetching transaction stats:', error);
    res.status(500).json({ success: false, message: 'Error fetching statistics' });
  }
};

module.exports = {
  getTransactions,
  uploadTransactionCSV,
  getTransactionStats
};
