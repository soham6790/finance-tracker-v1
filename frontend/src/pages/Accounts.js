import React, { useState, useEffect } from 'react';
import { getAccounts, uploadAccountCSV } from '../services/api';
import FileUpload from '../components/FileUpload';
import './Accounts.css';

function Accounts() {
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterName, setFilterName] = useState('All');
  const [accountNames, setAccountNames] = useState([]);

  useEffect(() => {
    fetchAccounts();
  }, []);

  const fetchAccounts = async () => {
    try {
      const response = await getAccounts();
      const data = response.data.data || [];
      setAccounts(data);

      // populate unique account names for the filter dropdown
      const names = Array.from(new Set(data.map((a) => a.account_name).filter(Boolean))).sort();
      setAccountNames(names);
    } catch (error) {
      console.error('Error fetching accounts:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpload = async (file) => {
    await uploadAccountCSV(file);
    fetchAccounts();
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  };

  // compute filtered accounts based on selected account name
  const filteredAccounts = filterName === 'All'
    ? accounts
    : accounts.filter((a) => a.account_name === filterName);

  const getTotalBalance = () => {
    // group filteredAccounts by account_name
    const groups = filteredAccounts.reduce((acc, row) => {
      const name = row.account_name || 'Unknown';
      if (!acc[name]) acc[name] = [];
      acc[name].push(row);
      return acc;
    }, {});

    // for each group pick the row with the latest transaction_date
    const latestRows = Object.values(groups).map((rows) =>
      rows.reduce((latest, row) => {
        const latestDate = new Date(latest.transaction_date || 0);
        const rowDate = new Date(row.transaction_date || 0);
        return rowDate >= latestDate ? row : latest;
      })
    );

    return latestRows.reduce((sum, row) => {
      const val = parseFloat(row.balance);
      return sum + (isNaN(val) ? 0 : val);
    }, 0);
  };

  const totalBalanceLabel = filterName === 'All'
    ? 'Total Balance Across All Accounts'
    : `Latest Balance — ${filterName}`;

  const handleFilterChange = (e) => {
    setFilterName(e.target.value);
  };

  return (
    <div className="accounts-page">
      <h1>Account Statements</h1>
      
      <FileUpload 
        onUpload={handleUpload}
        uploadType="Account"
      />

      {/* Filter dropdown */}
      <div className="filter-row" style={{ marginTop: '12px', marginBottom: '12px' }}>
        <label htmlFor="account-filter" style={{ marginRight: '8px' }}>Filter by Account Name:</label>
        <select id="account-filter" value={filterName} onChange={handleFilterChange}>
          <option value="All">All Accounts</option>
          {accountNames.map((name) => (
            <option key={name} value={name}>{name}</option>
          ))}
        </select>
      </div>

      {loading ? (
        <div className="loading">Loading accounts...</div>
      ) : (
        <>
          <div className="total-balance">
            <h2>{totalBalanceLabel}</h2>
            <p className="balance-amount">${getTotalBalance().toFixed(2)}</p>
          </div>

          <div className="table-container">
            <table className="accounts-table">
              <thead>
                <tr>
                  <th>Account Name</th>
                  <th>Account Number</th>
                  <th>Statement Date</th>
                  <th>Transaction Date</th>
                  <th>Description</th>
                  <th>Amount</th>
                  <th>Account Type</th>
                  <th>Balance</th>
                </tr>
              </thead>
              <tbody>
                {filteredAccounts.length > 0 ? (
                  filteredAccounts.map((account) => (
                    <tr key={account.id}>
                      <td>{account.account_name}</td>
                      <td>{account.account_number || 'N/A'}</td>
                      <td>{formatDate(account.statement_date)}</td>
                      <td>{account.transaction_date ? formatDate(account.transaction_date) : 'N/A'}</td>
                      <td className="description-cell" title={account.description || ''}>
                        {account.description || 'N/A'}
                      </td>
                      <td className={account.amount !== null && account.amount !== undefined 
                        ? (parseFloat(account.amount) >= 0 ? 'amount credit' : 'amount debit')
                        : 'amount'}>
                        {account.amount !== null && account.amount !== undefined 
                          ? `$${parseFloat(account.amount).toFixed(2)}`
                          : 'N/A'}
                      </td>
                      <td>
                        <span className="account-type-badge">
                          {account.account_type}
                        </span>
                      </td>
                      <td className="balance">
                        ${parseFloat(account.balance).toFixed(2)}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="8" className="no-data">
                      No account statements found. Upload a CSV file to get started.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </>
      )}

      <div className="csv-format-info">
        <h3>CSV Format</h3>
        <div className="format-section">
          <h4>Standard Format:</h4>
          <p>Expected columns: <code>account_name, account_number, statement_date, balance, account_type</code></p>
          <p>Balance should be a numeric value</p>
        </div>
        <div className="format-section">
          <h4>DCU Format (Bank Statements):</h4>
          <p>Expected columns: <code>DATE, TRANSACTION TYPE, DESCRIPTION, AMOUNT, CURRENT BALANCE, STATUS</code></p>
          <p>Account name will be extracted from the filename (e.g., "DCU_Checking_2025.csv" → "DCU Checking")</p>
          <p>Each row represents a transaction with its balance at that point in time</p>
        </div>
      </div>
    </div>
  );
}

export default Accounts;
