const { pool } = require('../config/db');
const fs = require('fs');
const csv = require('csv-parser');
const path = require('path');

// Helper function to convert date to MySQL format (YYYY-MM-DD)
const convertToMySQLDate = (dateString) => {
  if (!dateString) return null;
  
  // If already in YYYY-MM-DD format, return as is
  if (/^\d{4}-\d{2}-\d{2}$/.test(dateString)) {
    return dateString;
  }
  
  // Handle MM/DD/YYYY or M/D/YYYY format
  const dateMatch = dateString.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
  if (dateMatch) {
    const [, month, day, year] = dateMatch;
    const paddedMonth = month.padStart(2, '0');
    const paddedDay = day.padStart(2, '0');
    return `${year}-${paddedMonth}-${paddedDay}`;
  }
  
  // Try to parse as Date object and format
  const date = new Date(dateString);
  if (!isNaN(date.getTime())) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }
  
  console.warn(`Unable to parse date: ${dateString}`);
  return null;
};

// Helper function to parse currency amount (removes $ and commas)
const parseAmount = (amountString) => {
  if (!amountString) return 0;
  // Remove $, commas, and whitespace, then parse
  const cleaned = String(amountString).replace(/[$,\s]/g, '');
  return parseFloat(cleaned) || 0;
};

// Helper function to detect CSV format
const detectCSVFormat = (row) => {
  // Check if it's DCU format (has DATE, TRANSACTION TYPE, CURRENT BALANCE columns)
  if (row['DATE'] || row['TRANSACTION TYPE'] || row['CURRENT BALANCE']) {
    return 'DCU';
  }
  // Check if it's standard format (has account_name, account_number, etc.)
  if (row.account_name || row.account_number) {
    return 'STANDARD';
  }
  return 'UNKNOWN';
};

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
    const fileName = req.file.originalname || path.basename(filePath);
    
    // Extract account name from filename (e.g., "DCU_Checking_2025.csv" -> "DCU Checking")
    const accountNameFromFile = fileName
      .replace(/\.csv$/i, '')
      .replace(/_/g, ' ')
      .replace(/\d{4}/g, '')
      .trim() || 'Unknown Account';
    
    let csvFormat = null;
    let latestDate = null;

    fs.createReadStream(filePath)
      .pipe(csv())
      .on('data', (row) => {
        // Detect format on first row
        if (!csvFormat) {
          csvFormat = detectCSVFormat(row);
        }

        if (csvFormat === 'DCU') {
          // DCU CSV format: DATE, TRANSACTION TYPE, DESCRIPTION, AMOUNT, CURRENT BALANCE
          const transactionDate = convertToMySQLDate(row.DATE);
          const description = row.DESCRIPTION || '';
          const amount = parseAmount(row.AMOUNT);
          const currentBalance = parseAmount(row['CURRENT BALANCE']);
          const transactionType = row['TRANSACTION TYPE'] || '';
          
          // Track latest date for statement_date
          if (transactionDate && (!latestDate || transactionDate > latestDate)) {
            latestDate = transactionDate;
          }

          accounts.push({
            account_name: accountNameFromFile,
            account_number: null, // Not available in DCU format
            statement_date: null, // Will be set to latestDate in 'end' handler
            transaction_date: transactionDate,
            description: description,
            amount: amount,
            balance: currentBalance,
            account_type: 'Checking' // Default, can be overridden
          });
        } else if (csvFormat === 'STANDARD') {
          // Standard CSV format: account_name, account_number, statement_date, balance, account_type
          accounts.push({
            account_name: row.account_name,
            account_number: row.account_number,
            statement_date: row.statement_date,
            balance: parseFloat(row.balance) || parseFloat(row['Current Balance']) || parseFloat(row['Running Bal.']),
            transaction_date: row.date ? convertToMySQLDate(row.date) : null,
            description: row.description || '',
            amount: row.amount ? parseAmount(row.amount) : null,
            account_type: row.account_type || 'Checking'
          });
        } else {
          console.warn('Unknown CSV format, skipping row:', row);
        }
      })
      .on('end', async () => {
        try {
          if (accounts.length === 0) {
            fs.unlinkSync(filePath);
            return res.status(400).json({ 
              success: false, 
              message: 'No valid data found in CSV file' 
            });
          }

          // Update statement_date for DCU format accounts with the latest date
          if (csvFormat === 'DCU') {
            // Use latest date, or first transaction date, or current date as fallback
            const statementDate = latestDate || 
                                 accounts.find(a => a.transaction_date)?.transaction_date || 
                                 new Date().toISOString().split('T')[0];
            accounts.forEach(account => {
              account.statement_date = statementDate;
            });
          }

          // Insert accounts into database
          for (const account of accounts) {
            await pool.query(
              'INSERT INTO accounts (account_name, account_number, statement_date, transaction_date, description, amount, balance, account_type) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
              [
                account.account_name, 
                account.account_number, 
                account.statement_date, 
                account.transaction_date, 
                account.description, 
                account.amount, 
                account.balance, 
                account.account_type
              ]
            );
          }

          // Delete uploaded file
          fs.unlinkSync(filePath);

          res.json({ 
            success: true, 
            message: `Successfully imported ${accounts.length} account transactions`,
            count: accounts.length,
            format: csvFormat
          });
        } catch (error) {
          console.error('Error inserting accounts:', error);
          fs.unlinkSync(filePath);
          res.status(500).json({ success: false, message: 'Error saving accounts to database', error: error.message });
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
