# Development Guide

This guide is for developers who want to understand, modify, or contribute to the Finance Tracker application.

## Project Architecture

```
finance-tracker-v1/
├── backend/               # Node.js + Express backend
│   ├── config/           # Database configuration
│   ├── controllers/      # Business logic
│   ├── routes/           # API route definitions
│   ├── uploads/          # Temporary file uploads
│   └── server.js         # Entry point
├── frontend/             # React frontend
│   ├── public/          # Static assets
│   └── src/
│       ├── components/  # Reusable components
│       ├── pages/       # Page components
│       ├── services/    # API service layer
│       └── App.js       # Main app component
└── sample-*.csv         # Sample data files
```

## Technology Stack

### Backend
- **Express.js**: Web framework
- **MySQL2**: Database driver with promise support
- **Multer v2**: File upload handling
- **CSV-Parser**: Parse CSV files
- **Express-Rate-Limit**: API rate limiting
- **CORS**: Cross-origin resource sharing
- **dotenv**: Environment variable management

### Frontend
- **React 18**: UI library
- **React Router DOM**: Client-side routing
- **Axios**: HTTP client
- **Recharts**: Data visualization
- **CSS3**: Styling (no framework)

## Development Setup

### Prerequisites
- Node.js v14+
- MySQL v5.7+
- Git

### Initial Setup
```bash
# Clone repository
git clone https://github.com/soham6790/finance-tracker-v1.git
cd finance-tracker-v1

# Install all dependencies
npm run install-all

# Set up database
mysql -u root -p < setup.sql

# Configure environment
cd backend
cp .env.example .env
# Edit .env with your settings
```

### Running in Development Mode

**Backend with auto-reload:**
```bash
cd backend
npm run dev
```

**Frontend with hot reload:**
```bash
cd frontend
npm start
```

## Code Structure

### Backend Flow
1. **server.js** → Initialize Express app, middleware, routes
2. **routes/** → Define endpoints and apply middleware
3. **controllers/** → Handle business logic
4. **config/db.js** → Database connection and initialization

### Frontend Flow
1. **index.js** → App entry point
2. **App.js** → Router setup
3. **pages/** → Route-specific components
4. **components/** → Shared UI components
5. **services/api.js** → Centralized API calls

## API Endpoints

### Transactions
- `GET /api/transactions` - List all transactions
- `POST /api/transactions/upload` - Upload CSV file
- `GET /api/transactions/stats` - Get statistics

### Accounts
- `GET /api/accounts` - List all accounts
- `POST /api/accounts/upload` - Upload CSV file
- `GET /api/accounts/summary` - Get summary

## Database Schema

### Transactions Table
```sql
CREATE TABLE transactions (
  id INT AUTO_INCREMENT PRIMARY KEY,
  transaction_date DATE NOT NULL,
  description VARCHAR(255),
  amount DECIMAL(10, 2) NOT NULL,
  type ENUM('debit', 'credit') NOT NULL,
  category VARCHAR(100),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Accounts Table
```sql
CREATE TABLE accounts (
  id INT AUTO_INCREMENT PRIMARY KEY,
  account_name VARCHAR(255) NOT NULL,
  account_number VARCHAR(50),
  statement_date DATE NOT NULL,
  balance DECIMAL(10, 2) NOT NULL,
  account_type VARCHAR(50),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## Adding New Features

### Adding a New API Endpoint

1. **Create Controller Function** (e.g., `backend/controllers/transactionController.js`):
```javascript
const getTransactionById = async (req, res) => {
  try {
    const { id } = req.params;
    const [rows] = await pool.query('SELECT * FROM transactions WHERE id = ?', [id]);
    res.json({ success: true, data: rows[0] });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { getTransactionById };
```

2. **Add Route** (e.g., `backend/routes/transactions.js`):
```javascript
const { getTransactionById } = require('../controllers/transactionController');
router.get('/:id', getTransactionById);
```

### Adding a New Frontend Page

1. **Create Page Component** (`frontend/src/pages/NewPage.js`):
```javascript
import React from 'react';
import './NewPage.css';

function NewPage() {
  return <div>New Page Content</div>;
}

export default NewPage;
```

2. **Add Route** (`frontend/src/App.js`):
```javascript
import NewPage from './pages/NewPage';
// ...
<Route path="/new-page" element={<NewPage />} />
```

3. **Add Navigation Link** (`frontend/src/components/Navbar.js`):
```javascript
<Link to="/new-page">New Page</Link>
```

## Code Style Guidelines

### JavaScript
- Use ES6+ features
- Async/await for asynchronous operations
- Descriptive variable and function names
- Add error handling for all async operations

### React
- Functional components with hooks
- Use state for component-level data
- Props for component communication
- CSS modules or separate CSS files per component

### Database
- Use parameterized queries to prevent SQL injection
- Add indexes for frequently queried columns
- Use transactions for multi-step operations

## Security Best Practices

1. **Never commit sensitive data** (.env files, credentials)
2. **Use parameterized queries** to prevent SQL injection
3. **Validate all inputs** on both client and server
4. **Rate limit API endpoints** to prevent abuse
5. **Sanitize file uploads** (check file type, size)
6. **Use HTTPS** in production
7. **Keep dependencies updated** regularly

## Testing

### Backend Testing
```bash
cd backend
# Add your test commands here
# Example: npm test
```

### Frontend Testing
```bash
cd frontend
npm test
```

## Building for Production

### Backend
```bash
cd backend
npm start
# Consider using PM2 or similar for production
```

### Frontend
```bash
cd frontend
npm run build
# Serve the build folder with a static server
```

## Common Development Tasks

### Reset Database
```bash
mysql -u root -p
DROP DATABASE finance_tracker;
CREATE DATABASE finance_tracker;
```

### Clear Uploaded Files
```bash
cd backend
rm -rf uploads/*
```

### View Backend Logs
```bash
cd backend
npm start
# Logs will appear in terminal
```

## Debugging Tips

### Backend Debugging
- Use `console.log()` for quick debugging
- Check MySQL query logs
- Use Postman/curl to test API endpoints directly
- Check `.env` file is properly configured

### Frontend Debugging
- Use React Developer Tools browser extension
- Check browser console for errors
- Use Network tab to inspect API calls
- Verify proxy configuration in package.json

## Performance Optimization

### Backend
- Add database indexes for frequently queried fields
- Implement caching for repeated queries
- Use connection pooling (already implemented)
- Optimize CSV parsing for large files

### Frontend
- Lazy load routes with React.lazy()
- Memoize expensive calculations
- Optimize chart rendering for large datasets
- Implement virtual scrolling for large tables

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Make your changes
4. Test thoroughly
5. Commit: `git commit -m "Add feature"`
6. Push: `git push origin feature-name`
7. Create a Pull Request

## License

ISC License - See LICENSE file for details
