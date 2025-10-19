const express = require('express');
const router = express.Router();
const vendorController = require('./vendor_controller');
const { createVendorValidation, listVendorsValidation } = require('./vendor_validator');
const { verifyToken } = require('../../middleware/authMiddleware');
const { validationResult } = require('express-validator');

// Validation middleware
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
  next();
};

// Protected Routes
router.post('/', verifyToken, createVendorValidation, validate, vendorController.createVendor);
router.get('/', verifyToken, listVendorsValidation, validate, vendorController.listVendors);

module.exports = router;
