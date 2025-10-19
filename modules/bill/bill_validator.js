const { body, query, param } = require('express-validator');

exports.createBillValidation = [
  body('merchant_id').isInt().withMessage('merchant_id must be integer'),
  body('bill_no').notEmpty().withMessage('bill_no is required'),
  body('customer_name').notEmpty().withMessage('customer_name is required'),
  body('payment_mode').optional().isString(),
  body('items').isArray({ min: 1 }).withMessage('items must be a non-empty array'),
  body('items.*.material_id').isInt().withMessage('material_id must be integer'),
  body('items.*.quantity').isFloat({ gt: 0 }).withMessage('quantity must be positive'),
  body('items.*.price').isFloat({ gt: 0 }).withMessage('price must be positive')
];

exports.billIdValidation = [
  param('id').isInt().withMessage('Bill ID must be integer')
];

exports.listBillsValidation = [
  query('merchant_id').isInt().withMessage('merchant_id must be integer'),
  query('from_date').optional().isISO8601().toDate(),
  query('to_date').optional().isISO8601().toDate()
];
