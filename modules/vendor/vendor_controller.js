const { sql, poolPromise } = require('../../config/db');

// Create Vendor
exports.createVendor = async (req, res) => {
  const { merchant_id, vendor_name, contact, address, gst_no } = req.body;

  try {
    const pool = await poolPromise;

    const result = await pool.request()
      .input('merchant_id', sql.Int, merchant_id)
      .input('vendor_name', sql.NVarChar, vendor_name)
      .input('contact', sql.NVarChar, contact)
      .input('address', sql.NVarChar, address)
      .input('gst_no', sql.NVarChar, gst_no)
      .query(`
        INSERT INTO vendors (merchant_id, vendor_name, contact, address, gst_no)
        OUTPUT inserted.id
        VALUES (@merchant_id, @vendor_name, @contact, @address, @gst_no)
      `);

    const insertedId = result.recordset[0].id;
    res.status(201).json({ id: insertedId, vendor_name });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};

// List Vendors by Merchant
exports.listVendors = async (req, res) => {
  const { merchant_id } = req.query;

  try {
    const pool = await poolPromise;

    const result = await pool.request()
      .input('merchant_id', sql.Int, merchant_id)
      .query(`
        SELECT id, vendor_name, contact, address, gst_no
        FROM vendors
        WHERE merchant_id = @merchant_id
      `);

    res.json(result.recordset);

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};
