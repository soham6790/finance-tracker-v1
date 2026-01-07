const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const { getTransactions, uploadTransactionCSV, getTransactionStats } = require('../controllers/transactionController');

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, `transaction-${Date.now()}${path.extname(file.originalname)}`);
  }
});

const upload = multer({ 
  storage,
  fileFilter: (req, file, cb) => {
    if (path.extname(file.originalname).toLowerCase() === '.csv') {
      cb(null, true);
    } else {
      cb(new Error('Only CSV files are allowed'));
    }
  }
});

// Routes
router.get('/', getTransactions);
router.post('/upload', upload.single('file'), uploadTransactionCSV);
router.get('/stats', getTransactionStats);

module.exports = router;
