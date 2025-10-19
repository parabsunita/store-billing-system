const { query } = require('express-validator');

exports.salesReportValidation = [
  query('merchant_id').isInt().withMessage('merchant_id query param must be integer'),
  query('from_date').isISO8601().withMessage('from_date must be a valid date'),
  query('to_date').isISO8601().withMessage('to_date must be a valid date')
];

exports.inventoryReportValidation = [
  query('merchant_id').isInt().withMessage('merchant_id query param must be integer')
];
