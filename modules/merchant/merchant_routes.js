const express = require('express');
const router = express.Router();
const merchantController = require('./merchant_controller');
const { registerValidation, loginValidation } = require('./merchant_validator');
const { verifyToken } = require('../../middleware/authMiddleware');
const { validationResult } = require('express-validator');

// Validation middleware
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
  next();
};

// Public
router.post('/register', registerValidation, validate, merchantController.registerMerchant);
router.post('/login', loginValidation, validate, merchantController.loginMerchant);

// Protected (example)
router.get('/:id', verifyToken, merchantController.getMerchantProfile);

module.exports = router;
