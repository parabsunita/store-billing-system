const express = require('express');
const router = express.Router();
const stockLogController = require('./stocklog_controller');
const { createStockLogValidation, listStockLogsValidation } = require('./stocklog_validator');
const { verifyToken } = require('../../middleware/authMiddleware');
const { validationResult } = require('express-validator');

// Validation middleware
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
  next();
};

// Routes
router.post('/', verifyToken, createStockLogValidation, validate, stockLogController.createStockLog);
router.get('/', verifyToken, listStockLogsValidation, validate, stockLogController.listStockLogs);

module.exports = router;
