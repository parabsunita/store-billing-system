const express = require('express');
const router = express.Router();

router.use('/merchants', require('../modules/merchant/merchant_routes'));
router.use('/vendors', require('../modules/vendor/vendor_routes'));
router.use('/materials', require('../modules/material/material_routes'));
router.use('/bills', require('../modules/bill/bill_routes'));
router.use('/stock-logs', require('../modules/stocklog/stocklog_routes'));
router.use('/reports', require('../modules/report/report_routes'));

module.exports = router;
