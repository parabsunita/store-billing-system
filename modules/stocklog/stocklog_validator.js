const { body, query } = require('express-validator');

exports.createStockLogValidation = [
  body('merchant_id').isInt().withMessage('merchant_id must be integer'),
  body('material_id').isInt().withMessage('material_id must be integer'),
  body('change_type').isIn(['ADD','SALE']).withMessage('change_type must be ADD or SALE'),
  body('quantity_change').isFloat({ gt: 0 }).withMessage('quantity_change must be positive')
];

exports.listStockLogsValidation = [
  query('merchant_id').isInt().withMessage('merchant_id must be integer')
];
