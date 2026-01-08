# Finance Tracker v1

A full-stack application to track and visualize personal finance - spendings, debits, and credits. This application allows you to upload transaction and account statements from CSV files and visualize them through interactive tables and charts.

## Features

- 📊 **Dashboard**: View financial overview with charts and statistics
- 💰 **Transaction Management**: Upload and view transaction statements with filtering options
- 🏦 **Account Management**: Upload and manage account statements
- 📈 **Data Visualization**: Interactive charts using Recharts library
- 📁 **CSV Import**: Easy CSV file upload for both transactions and accounts
- 🗄️ **MySQL Backend**: Persistent data storage using MySQL database

## Tech Stack

### Backend
- Node.js
- Express.js
- MySQL (mysql2)
- Multer (file upload)
- CSV Parser
- CORS
- dotenv

### Frontend
- React 18
- React Router DOM
- Axios
- Recharts (charts/graphs)
- CSS3

## Prerequisites

Before running this application, make sure you have:

- Node.js (v14 or higher)
- MySQL (v5.7 or higher)
- npm or yarn package manager

## Installation

### 1. Clone the repository
```bash
git clone https://github.com/soham6790/finance-tracker-v1.git
cd finance-tracker-v1
```

### 2. Set up MySQL Database
Create a MySQL database:
```sql
CREATE DATABASE finance_tracker;
```

### 3. Set up Backend

```bash
cd backend
npm install
```

Create a `.env` file in the backend directory:
```bash
cp .env.example .env
```

Edit `.env` with your database credentials:
```
PORT=5000
DB_HOST=localhost
DB_USER=your_mysql_username
DB_PASSWORD=your_mysql_password
DB_NAME=finance_tracker
```

### 4. Set up Frontend

```bash
cd ../frontend
npm install
```

## Running the Application

### Start Backend Server
```bash
cd backend
npm start
```

The backend server will run on `http://localhost:5000`

### Start Frontend Development Server
```bash
cd frontend
npm start
```

The frontend will run on `http://localhost:3000`

## CSV File Format

### Transactions CSV Format
The transaction CSV file should have the following columns:
```
date,description,amount,type,category
```

Example:
```csv
date,description,amount,type,category
2024-01-15,Salary Deposit,5000.00,credit,Income
2024-01-16,Grocery Shopping,150.50,debit,Food
2024-01-17,Electric Bill,85.00,debit,Utilities
```

**Note**: `type` should be either "credit" or "debit"

### Accounts CSV Format
The account CSV file should have the following columns:
```
account_name,account_number,statement_date,balance,account_type
```

Example:
```csv
account_name,account_number,statement_date,balance,account_type
Chase Checking,****1234,2024-01-31,5250.75,Checking
Wells Fargo Savings,****5678,2024-01-31,12500.00,Savings
```

## Sample CSV Files

Sample CSV files are included in the repository:
- `sample-transactions.csv` - Sample transaction data
- `sample-accounts.csv` - Sample account data

## API Endpoints

### Transactions
- `GET /api/transactions` - Get all transactions
- `POST /api/transactions/upload` - Upload transaction CSV
- `GET /api/transactions/stats` - Get transaction statistics

### Accounts
- `GET /api/accounts` - Get all accounts
- `POST /api/accounts/upload` - Upload account CSV
- `GET /api/accounts/summary` - Get account summary

## Project Structure

```
finance-tracker-v1/
├── backend/
│   ├── config/
│   │   └── db.js
│   ├── controllers/
│   │   ├── accountController.js
│   │   └── transactionController.js
│   ├── routes/
│   │   ├── accounts.js
│   │   └── transactions.js
│   ├── uploads/
│   ├── .env.example
│   ├── package.json
│   └── server.js
├── frontend/
│   ├── public/
│   │   └── index.html
│   ├── src/
│   │   ├── components/
│   │   │   ├── FileUpload.js
│   │   │   ├── FileUpload.css
│   │   │   ├── Navbar.js
│   │   │   └── Navbar.css
│   │   ├── pages/
│   │   │   ├── Dashboard.js
│   │   │   ├── Dashboard.css
│   │   │   ├── Transactions.js
│   │   │   ├── Transactions.css
│   │   │   ├── Accounts.js
│   │   │   └── Accounts.css
│   │   ├── services/
│   │   │   └── api.js
│   │   ├── App.js
│   │   ├── App.css
│   │   ├── index.js
│   │   └── index.css
│   └── package.json
├── sample-accounts.csv
├── sample-transactions.csv
└── README.md
```

## Usage

1. **Start both backend and frontend servers**
2. **Navigate to** `http://localhost:3000` in your browser
3. **Upload CSV files**:
   - Go to the Transactions page and upload a transaction CSV
   - Go to the Accounts page and upload an account CSV
4. **View your data**:
   - Dashboard: See overall statistics and charts
   - Transactions: View and filter all transactions
   - Accounts: View all account statements

## Features in Detail

### Dashboard
- Total Credits, Debits, and Balance overview
- Pie chart showing transactions by category
- Bar chart showing account balances by type

### Transactions Page
- Tabular view of all transactions
- Filter by transaction type (All/Credit/Debit)
- CSV upload functionality
- Color-coded transaction types

### Accounts Page
- Tabular view of all account statements
- Total balance across all accounts
- CSV upload functionality
- Account type categorization

## License

This project is licensed under the ISC License.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
