const { body } = require('express-validator');

exports.registerValidation = [
  body('store_name').notEmpty().withMessage('Store name is required'),
  body('owner_name').notEmpty().withMessage('Owner name is required'),
  body('email').isEmail().withMessage('Valid email is required'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 chars')
];

exports.loginValidation = [
  body('email').isEmail().withMessage('Valid email is required'),
  body('password').notEmpty().withMessage('Password is required')
];
