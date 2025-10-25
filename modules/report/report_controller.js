const { sql, poolPromise } = require('../../config/db');

// Sales Report
exports.generateSalesReport = async (req, res) => {
  const { merchant_id, from_date, to_date } = req.query;

  try {
    const pool = await poolPromise;

    // 1️⃣ Total sales and total bills
    const salesResult = await pool.request()
      .input('merchant_id', sql.Int, merchant_id)
      .input('from_date', sql.DateTime, new Date(from_date))
      .input('to_date', sql.DateTime, new Date(to_date))
      .query(`
        SELECT COUNT(*) AS total_bills, SUM(total_amount) AS total_sales 
        FROM bills 
        WHERE merchant_id = @merchant_id AND date BETWEEN @from_date AND @to_date
      `);

    const totals = salesResult.recordset[0];

    // 2️⃣ Items sold
    const itemsResult = await pool.request()
      .input('merchant_id', sql.Int, merchant_id)
      .input('from_date', sql.DateTime, new Date(from_date))
      .input('to_date', sql.DateTime, new Date(to_date))
      .query(`
        SELECT bi.material_id, m.material_name, SUM(bi.quantity) AS quantity_sold
        FROM bill_items bi
        JOIN materials m ON bi.material_id = m.id
        JOIN bills b ON bi.bill_id = b.id
        WHERE b.merchant_id = @merchant_id AND b.date BETWEEN @from_date AND @to_date
        GROUP BY bi.material_id, m.material_name
      `);

    res.json({
      total_sales: totals.total_sales || 0,
      total_bills: totals.total_bills || 0,
      items_sold: itemsResult.recordset
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};

// Inventory Report
exports.generateInventoryReport = async (req, res) => {
  const { merchant_id } = req.query;

  try {
    const pool = await poolPromise;

    const result = await pool.request()
      .input('merchant_id', sql.Int, merchant_id)
      .query(`
        SELECT id AS material_id, material_name, quantity, total_cost
        FROM materials
        WHERE merchant_id = @merchant_id
      `);

    res.json(result.recordset);

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};
