import React, { useState, useEffect } from 'react';
import { getTransactions, uploadTransactionCSV } from '../services/api';
import FileUpload from '../components/FileUpload';
import './Transactions.css';

function Transactions() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 50,
    total: 0,
    totalPages: 0,
    hasNextPage: false,
    hasPrevPage: false
  });

  useEffect(() => {
    fetchTransactions();
  }, [currentPage]);

  const fetchTransactions = async () => {
    try {
      setLoading(true);
      const response = await getTransactions(currentPage, 50);
      setTransactions(response.data.data);
      if (response.data.pagination) {
        setPagination(response.data.pagination);
      }
    } catch (error) {
      console.error('Error fetching transactions:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpload = async (file) => {
    await uploadTransactionCSV(file);
    // Reset to first page after upload
    setCurrentPage(1);
    fetchTransactions();
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= pagination.totalPages) {
      setCurrentPage(newPage);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
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
          <option value="Sale">Sale</option>
          <option value="Return">Return</option>
          <option value="Payment">Payment</option>
          <option value="Fee">Fee</option>
          <option value="Adjustment">Adjustment</option>
          <option value="BoFa">BoFa</option>
        </select>
      </div>

      {loading ? (
        <div className="loading">Loading transactions...</div>
      ) : (
        <>
          <div className="table-container">
            <table className="transactions-table">
              <thead>
                <tr>
                  <th>Transaction Date</th>
                  <th>Post Date</th>
                  <th>Description</th>
                  <th>Category</th>
                  <th>Type</th>
                  <th>Amount</th>
                  <th>Memo</th>
                  <th>Reference Number</th>
                </tr>
              </thead>
              <tbody>
                {filteredTransactions.length > 0 ? (
                  filteredTransactions.map((transaction) => (
                    <tr key={transaction.id}>
                      <td>{formatDate(transaction.transaction_date)}</td>
                      <td>{formatDate(transaction.post_date)}</td>
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
                      <td>{transaction.memo}</td>
                      <td>{transaction.reference_number}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="no-data">
                      No transactions found. Upload a CSV file to get started.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination Controls */}
          {pagination.totalPages > 1 && (
            <div className="pagination">
              <button 
                className="pagination-btn"
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={!pagination.hasPrevPage}
              >
                Previous
              </button>
              <span className="pagination-info">
                Page {pagination.page} of {pagination.totalPages} 
                {' '}({pagination.total} total transactions)
              </span>
              <button 
                className="pagination-btn"
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={!pagination.hasNextPage}
              >
                Next
              </button>
            </div>
          )}
        </>
      )}

      <div className="csv-format-info">
        <h3>CSV Format</h3>
        <p>Expected columns: <code>Transaction Date, Post Date, Description, Amount, Type, Category</code></p>
        <p>Type : "Sale", "Return", "Payment", "Fee", "Adjustment"</p>
      </div>
    </div>
  );
}

export default Transactions;
