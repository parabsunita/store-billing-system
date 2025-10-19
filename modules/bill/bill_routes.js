const express = require('express');
const router = express.Router();
const billController = require('./bill_controller');
const { createBillValidation, billIdValidation, listBillsValidation } = require('./bill_validator');
const { verifyToken } = require('../../middleware/authMiddleware');
const { validationResult } = require('express-validator');

// Validation middleware
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
  next();
};

// Routes
router.post('/', verifyToken, createBillValidation, validate, billController.createBill);
router.get('/:id', verifyToken, billIdValidation, validate, billController.getBillDetails);
router.get('/', verifyToken, listBillsValidation, validate, billController.listBills);

module.exports = router;
