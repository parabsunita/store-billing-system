const { body, query } = require('express-validator');

exports.createVendorValidation = [
  body('merchant_id').isInt().withMessage('merchant_id must be an integer'),
  body('vendor_name').notEmpty().withMessage('vendor_name is required'),
  body('contact').optional().isString(),
  body('address').optional().isString(),
  body('gst_no').optional().isString()
];

exports.listVendorsValidation = [
  query('merchant_id').isInt().withMessage('merchant_id query param must be integer')
];
