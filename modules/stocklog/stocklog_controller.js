const { sql, poolPromise } = require('../../config/db');

// Create Stock Log
exports.createStockLog = async (req, res) => {
  const { merchant_id, material_id, change_type, quantity_change } = req.body;

  try {
    const pool = await poolPromise;

    // 1️⃣ Update material quantity
    const operator = change_type === 'ADD' ? '+' : '-';

    const updateQuery = `
      UPDATE materials
      SET quantity = quantity ${operator} @quantity_change
      WHERE id = @material_id AND merchant_id = @merchant_id
    `;

    const updateResult = await pool.request()
      .input('quantity_change', sql.Decimal(10,2), quantity_change)
      .input('material_id', sql.Int, material_id)
      .input('merchant_id', sql.Int, merchant_id)
      .query(updateQuery);

    if (updateResult.rowsAffected[0] === 0) {
      return res.status(404).json({ message: 'Material not found' });
    }

    // 2️⃣ Insert into stock_logs
    await pool.request()
      .input('merchant_id', sql.Int, merchant_id)
      .input('material_id', sql.Int, material_id)
      .input('change_type', sql.NVarChar, change_type)
      .input('quantity_change', sql.Decimal(10,2), quantity_change)
      .query(`
        INSERT INTO stock_logs (merchant_id, material_id, change_type, quantity_change)
        VALUES (@merchant_id, @material_id, @change_type, @quantity_change)
      `);

    res.status(201).json({ message: 'Stock log created successfully' });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};

// List Stock Logs
exports.listStockLogs = async (req, res) => {
  const { merchant_id } = req.query;

  try {
    const pool = await poolPromise;

    const result = await pool.request()
      .input('merchant_id', sql.Int, merchant_id)
      .query(`
        SELECT id, material_id, change_type, quantity_change, created_at
        FROM stock_logs
        WHERE merchant_id = @merchant_id
        ORDER BY created_at DESC
      `);

    res.json(result.recordset);

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};
