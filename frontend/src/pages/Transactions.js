import React, { useState, useEffect } from 'react';
import { getTransactions, uploadTransactionCSV } from '../services/api';
import FileUpload from '../components/FileUpload';
import './Transactions.css';

function Transactions() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    try {
      const response = await getTransactions();
      setTransactions(response.data.data);
    } catch (error) {
      console.error('Error fetching transactions:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpload = async (file) => {
    await uploadTransactionCSV(file);
    fetchTransactions();
  };

  const filteredTransactions = transactions.filter(t => {
    if (filter === 'all') return true;
    return t.type === filter;
  });

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  };

  return (
    <div className="transactions-page">
      <h1>Transactions</h1>
      
      <FileUpload 
        onUpload={handleUpload}
        uploadType="Transaction"
      />

      <div className="filter-section">
        <label>Filter by Type: </label>
        <select value={filter} onChange={(e) => setFilter(e.target.value)}>
          <option value="all">All</option>
          <option value="credit">Credit</option>
          <option value="debit">Debit</option>
        </select>
      </div>

      {loading ? (
        <div className="loading">Loading transactions...</div>
      ) : (
        <div className="table-container">
          <table className="transactions-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Description</th>
                <th>Category</th>
                <th>Type</th>
                <th>Amount</th>
              </tr>
            </thead>
            <tbody>
              {filteredTransactions.length > 0 ? (
                filteredTransactions.map((transaction) => (
                  <tr key={transaction.id}>
                    <td>{formatDate(transaction.transaction_date)}</td>
                    <td>{transaction.description}</td>
                    <td>{transaction.category}</td>
                    <td>
                      <span className={`type-badge ${transaction.type}`}>
                        {transaction.type}
                      </span>
                    </td>
                    <td className={`amount ${transaction.type}`}>
                      ${parseFloat(transaction.amount).toFixed(2)}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="no-data">
                    No transactions found. Upload a CSV file to get started.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      <div className="csv-format-info">
        <h3>CSV Format</h3>
        <p>Expected columns: <code>date, description, amount, type, category</code></p>
        <p>Type should be either "credit" or "debit"</p>
      </div>
    </div>
  );
}

export default Transactions;
