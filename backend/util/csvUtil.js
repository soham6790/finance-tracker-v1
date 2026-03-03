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

  // Check if it's BOFA format (has Date and Running Bal. columns)
  const hasBofaDate = row.Date || row['Date'];
  const hasBofaRunningBal = row['Running Bal.'] || row['Running Bal'];
  if (hasBofaDate && hasBofaRunningBal) {
    return 'BOFA';
  }

  // Check if it's standard format (has account_name, account_number, etc.)
  if (row.account_name || row.account_number) {
    return 'STANDARD';
  }

  return 'UNKNOWN';
};

module.exports = {
  convertToMySQLDate,
  parseAmount,
  detectCSVFormat
};
