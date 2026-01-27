-- Finance Tracker Database Setup Script
-- Run this script in your MySQL database to set up the required database and tables

-- Create database
CREATE DATABASE IF NOT EXISTS finance_tracker;

-- Use the database
USE finance_tracker;

-- Create transactions table
CREATE TABLE IF NOT EXISTS transactions (
  id INT AUTO_INCREMENT PRIMARY KEY,
  transaction_date DATE NOT NULL,
  post_date DATE NOT NULL,
  description VARCHAR(255),
  amount DECIMAL(10, 2) NOT NULL,
  type ENUM('Sale', 'Return', 'Payment','Fee','Adjustment') NOT NULL,
  category VARCHAR(100),
  memo VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_transaction_date (transaction_date),
  INDEX idx_type (type),
  INDEX idx_category (category)
);

-- Create accounts table
CREATE TABLE IF NOT EXISTS accounts (
  id INT AUTO_INCREMENT PRIMARY KEY,
  account_name VARCHAR(255) NOT NULL,
  account_number VARCHAR(50),
  statement_date DATE NOT NULL,
  balance DECIMAL(10, 2) NOT NULL,
  account_type VARCHAR(50),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_account_name (account_name),
  INDEX idx_statement_date (statement_date),
  INDEX idx_account_type (account_type)
);

-- Display success message
SELECT 'Database and tables created successfully!' AS Status;
