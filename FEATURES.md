# Application Screenshots and Features

## Overview
Finance Tracker v1 is a complete full-stack application with a clean, modern interface for managing personal finances.

## Features Implemented

### 1. Dashboard Page
- **URL**: `/`
- **Features**:
  - Summary cards showing Total Credits, Total Debits, and Balance
  - Pie chart displaying transactions by category
  - Bar chart showing account balances by type
  - Real-time data visualization using Recharts
  - Color-coded financial metrics (green for credits, red for debits)

### 2. Transactions Page
- **URL**: `/transactions`
- **Features**:
  - CSV file upload for transaction data
  - Tabular view of all transactions with columns:
    - Date (formatted)
    - Description
    - Category
    - Type (color-coded badges: credit/debit)
    - Amount (color-coded)
  - Filter by transaction type (All/Credit/Debit)
  - CSV format information panel
  - Real-time updates after upload
  - Responsive table design

### 3. Accounts Page
- **URL**: `/accounts`
- **Features**:
  - CSV file upload for account statements
  - Total balance display across all accounts
  - Tabular view of all accounts with columns:
    - Account Name
    - Account Number
    - Statement Date
    - Account Type (with badges)
    - Balance
  - CSV format information panel
  - Real-time updates after upload

### 4. Navigation
- Clean navigation bar with:
  - Finance Tracker branding
  - Dashboard, Transactions, and Accounts links
  - Active state highlighting
  - Responsive design

## Technical Implementation

### Backend APIs
- `GET /api/transactions` - Fetch all transactions
- `POST /api/transactions/upload` - Upload transaction CSV
- `GET /api/transactions/stats` - Get transaction statistics
- `GET /api/accounts` - Fetch all accounts
- `POST /api/accounts/upload` - Upload account CSV
- `GET /api/accounts/summary` - Get account summary

### Security Features
- Rate limiting on all API endpoints (100 requests per 15 minutes)
- Stricter rate limiting on upload endpoints (10 uploads per 15 minutes)
- CSV file type validation
- Input sanitization through parameterized queries
- CORS enabled for frontend-backend communication

### Database Schema
- **transactions** table: id, transaction_date, description, amount, type, category, created_at
- **accounts** table: id, account_name, account_number, statement_date, balance, account_type, created_at

## CSV File Formats

### Transactions CSV
```csv
date,description,amount,type,category
2024-01-15,Salary Deposit,5000.00,credit,Income
2024-01-16,Grocery Shopping,150.50,debit,Food
```

### Accounts CSV
```csv
account_name,account_number,statement_date,balance,account_type
Chase Checking,****1234,2024-01-31,5250.75,Checking
Wells Fargo Savings,****5678,2024-01-31,12500.00,Savings
```

## Color Scheme
- Primary: #2c3e50 (Dark Blue-Gray)
- Success/Credit: #2ecc71 (Green)
- Danger/Debit: #e74c3c (Red)
- Info: #3498db (Blue)
- Background: #f5f6fa (Light Gray)
- White cards with subtle shadows for content

## Responsive Design
- Mobile-friendly interface
- Responsive grid layouts
- Flexible table displays
- Touch-friendly navigation

## Browser Compatibility
- Modern browsers (Chrome, Firefox, Safari, Edge)
- ES6+ JavaScript support required
- CSS Grid and Flexbox support

## Future Enhancement Ideas
- User authentication and authorization
- Multiple user support
- Data export functionality
- Advanced filtering and search
- Budget tracking and alerts
- Recurring transaction management
- Mobile app version
