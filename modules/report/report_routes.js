const express = require('express');
const router = express.Router();
const reportController = require('./report_controller');
const { salesReportValidation, inventoryReportValidation } = require('./report_validator');
const { verifyToken } = require('../../middleware/authMiddleware');
const { validationResult } = require('express-validator');

// Validation middleware
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
  next();
};

// Routes
router.get('/sales', verifyToken, salesReportValidation, validate, reportController.generateSalesReport);
router.get('/inventory', verifyToken, inventoryReportValidation, validate, reportController.generateInventoryReport);

module.exports = router;
