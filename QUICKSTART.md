# Quick Start Guide

This guide will help you get the Finance Tracker application up and running in under 10 minutes.

## Prerequisites Check

Before starting, ensure you have:
- [ ] Node.js (v14 or higher) installed - Check with `node --version`
- [ ] MySQL (v5.7 or higher) installed and running - Check with `mysql --version`
- [ ] npm installed - Check with `npm --version`

## Step-by-Step Setup

### 1. Database Setup (2 minutes)

Open your MySQL client and run:
```bash
mysql -u root -p < setup.sql
```

Or manually create the database:
```sql
CREATE DATABASE finance_tracker;
```

The application will auto-create tables on first run.

### 2. Backend Setup (3 minutes)

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Create .env file (copy from example)
cp .env.example .env

# Edit .env with your MySQL credentials
# Use your text editor to update DB_USER and DB_PASSWORD

# Start the backend server
npm start
```

The backend server should now be running at `http://localhost:5000`

### 3. Frontend Setup (3 minutes)

Open a new terminal window:

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Start the development server
npm start
```

The application will automatically open in your browser at `http://localhost:3000`

## Testing with Sample Data

1. Open the application at `http://localhost:3000`
2. Navigate to the **Transactions** page
3. Click "Choose File" and select `sample-transactions.csv` from the root directory
4. Click "Upload" - you should see a success message
5. Navigate to the **Accounts** page
6. Upload `sample-accounts.csv`
7. Go back to the **Dashboard** to see your data visualized!

## Troubleshooting

### Backend won't start
- **Error: "Cannot connect to MySQL"**
  - Solution: Check that MySQL is running and credentials in `.env` are correct
  - Try: `mysql -u root -p` to test your credentials

- **Error: "Port 5000 already in use"**
  - Solution: Change PORT in `backend/.env` to another port (e.g., 5001)

### Frontend won't start
- **Error: "Port 3000 already in use"**
  - Solution: The terminal will ask if you want to use another port - type 'Y'

- **Error: "Cannot connect to backend"**
  - Solution: Make sure backend is running on port 5000
  - Check: Open `http://localhost:5000/api/health` in your browser

### CSV Upload Issues
- **Error: "Only CSV files are allowed"**
  - Solution: Ensure your file has a `.csv` extension

- **Error: "Error parsing CSV file"**
  - Solution: Check that your CSV has the correct column headers
  - See README.md for the expected format

## Common Commands

### Backend
```bash
cd backend
npm start          # Start server
npm run dev        # Start with auto-reload (if nodemon installed)
```

### Frontend
```bash
cd frontend
npm start          # Start development server
npm run build      # Create production build
```

### Both (from root directory)
```bash
npm run install-all      # Install all dependencies
npm run start-backend    # Start backend
npm run start-frontend   # Start frontend
npm run build-frontend   # Build frontend for production
```

## What's Next?

- Upload your own transaction and account CSV files
- Explore the dashboard to see your financial overview
- Filter transactions by type
- Check account balances and summaries

## Need Help?

- Check the main [README.md](README.md) for detailed documentation
- Review [FEATURES.md](FEATURES.md) for complete feature list
- Ensure your CSV files match the expected format (see README.md)

## Security Notes

- Never commit the `.env` file to version control
- Change default MySQL credentials for production use
- The application includes rate limiting to prevent abuse
- Consider adding authentication before deploying to production
