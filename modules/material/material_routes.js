const express = require('express');
const router = express.Router();
const materialController = require('./material_controller');
const { createMaterialValidation, updateMaterialValidation, listMaterialsValidation } = require('./material_validator');
const { verifyToken } = require('../../middleware/authMiddleware');
const { validationResult } = require('express-validator');

// Validation middleware
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
  next();
};

// Routes
router.post('/', verifyToken, createMaterialValidation, validate, materialController.createMaterial);
router.put('/:id', verifyToken, updateMaterialValidation, validate, materialController.updateMaterial);
router.get('/', verifyToken, listMaterialsValidation, validate, materialController.listMaterials);

module.exports = router;
