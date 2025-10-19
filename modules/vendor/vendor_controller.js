const db = require('../../config/db');

// Create Vendor
exports.createVendor = (req, res) => {
  const { merchant_id, vendor_name, contact, address, gst_no } = req.body;

  db.query(
    'INSERT INTO vendors (merchant_id, vendor_name, contact, address, gst_no) VALUES (?,?,?,?,?)',
    [merchant_id, vendor_name, contact, address, gst_no],
    (err, result) => {
      if (err) return res.status(500).json({ error: err.message });
      res.status(201).json({ id: result.insertId, vendor_name });
    }
  );
};

// List Vendors by Merchant
exports.listVendors = (req, res) => {
  const { merchant_id } = req.query;

  db.query(
    'SELECT id, vendor_name, contact, address, gst_no FROM vendors WHERE merchant_id=?',
    [merchant_id],
    (err, results) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json(results);
    }
  );
};
