import React, { useState, useEffect } from 'react';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { getTransactionStats, getAccountSummary } from '../services/api';
import './Dashboard.css';

const COLORS = ['#3498db', '#e74c3c', '#2ecc71', '#f39c12', '#9b59b6', '#1abc9c'];

function Dashboard() {
  const [transactionStats, setTransactionStats] = useState(null);
  const [accountSummary, setAccountSummary] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [transRes, accRes] = await Promise.all([
        getTransactionStats(),
        getAccountSummary()
      ]);
      setTransactionStats(transRes.data.data);
      setAccountSummary(accRes.data.data);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="loading">Loading dashboard...</div>;
  }

  const categoryData = transactionStats?.categoryStats?.map(stat => ({
    name: stat.category,
    value: parseFloat(stat.total),
    type: stat.type
  })) || [];

  const accountData = accountSummary.map(acc => ({
    name: acc.account_type,
    balance: parseFloat(acc.total_balance),
    count: acc.count
  }));

  return (
    <div className="dashboard">
      <h1>Financial Dashboard</h1>
      
      <div className="stats-grid">
        <div className="stat-card">
          <h3>Total Credits</h3>
          <p className="stat-value credit">${(parseFloat(transactionStats?.totalCredit) || 0).toFixed(2)}</p>
        </div>
        <div className="stat-card">
          <h3>Total Debits</h3>
          <p className="stat-value debit">${(parseFloat(transactionStats?.totalDebit) || 0).toFixed(2)}</p>
        </div>
        <div className="stat-card">
          <h3>Balance</h3>
          <p className={`stat-value ${(parseFloat(transactionStats?.balance) || 0) >= 0 ? 'credit' : 'debit'}`}>
            ${(parseFloat(transactionStats?.balance) || 0).toFixed(2)}
          </p>
        </div>
      </div>

      <div className="charts-grid">
        <div className="chart-container">
          <h2>Transactions by Category</h2>
          {categoryData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={entry => `${entry.name}: $${entry.value.toFixed(2)}`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <p className="no-data">No transaction data available</p>
          )}
        </div>

        <div className="chart-container">
          <h2>Account Balances</h2>
          {accountData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={accountData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="balance" fill="#3498db" name="Balance ($)" />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <p className="no-data">No account data available</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
