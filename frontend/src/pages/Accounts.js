import React, { useState, useEffect } from 'react';
import { getAccounts, uploadAccountCSV } from '../services/api';
import FileUpload from '../components/FileUpload';
import './Accounts.css';

function Accounts() {
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAccounts();
  }, []);

  const fetchAccounts = async () => {
    try {
      const response = await getAccounts();
      setAccounts(response.data.data);
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

  const getTotalBalance = () => {
    return accounts.reduce((sum, account) => sum + parseFloat(account.balance), 0);
  };

  return (
    <div className="accounts-page">
      <h1>Account Statements</h1>
      
      <FileUpload 
        onUpload={handleUpload}
        uploadType="Account"
      />

      {loading ? (
        <div className="loading">Loading accounts...</div>
      ) : (
        <>
          <div className="total-balance">
            <h2>Total Balance Across All Accounts</h2>
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
                {accounts.length > 0 ? (
                  accounts.map((account) => (
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
