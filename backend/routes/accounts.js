const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const { getAccounts, uploadAccountCSV, getAccountSummary } = require('../controllers/accountController');

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, `account-${Date.now()}${path.extname(file.originalname)}`);
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
router.get('/', getAccounts);
router.post('/upload', upload.single('file'), uploadAccountCSV);
router.get('/summary', getAccountSummary);

module.exports = router;
