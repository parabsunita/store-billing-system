const { body, query, param } = require('express-validator');

exports.createMaterialValidation = [
  body('merchant_id').isInt().withMessage('merchant_id must be integer'),
  body('vendor_id').isInt().withMessage('vendor_id must be integer'),
  body('material_name').notEmpty().withMessage('material_name is required'),
  body('quantity').isFloat({ min: 0 }).withMessage('quantity must be non-negative'),
  body('price').isFloat({ gt: 0 }).withMessage('price must be positive')
];

exports.updateMaterialValidation = [
  param('id').isInt().withMessage('Material ID must be integer'),
  body('material_name').optional().notEmpty(),
  body('quantity').optional().isFloat({ min: 0 }),
  body('price').optional().isFloat({ gt: 0 })
];

exports.listMaterialsValidation = [
  query('merchant_id').isInt().withMessage('merchant_id query param must be integer')
];
