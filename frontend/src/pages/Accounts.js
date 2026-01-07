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
                  <th>Account Type</th>
                  <th>Balance</th>
                </tr>
              </thead>
              <tbody>
                {accounts.length > 0 ? (
                  accounts.map((account) => (
                    <tr key={account.id}>
                      <td>{account.account_name}</td>
                      <td>{account.account_number}</td>
                      <td>{formatDate(account.statement_date)}</td>
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
                    <td colSpan="5" className="no-data">
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
        <p>Expected columns: <code>account_name, account_number, statement_date, balance, account_type</code></p>
        <p>Balance should be a numeric value</p>
      </div>
    </div>
  );
}

export default Accounts;
