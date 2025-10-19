const db = require('../../config/db');

// Sales Report
exports.generateSalesReport = (req, res) => {
  const { merchant_id, from_date, to_date } = req.query;

  // Total sales and total bills
  const salesQuery = `
    SELECT COUNT(*) AS total_bills, SUM(total_amount) AS total_sales 
    FROM bills 
    WHERE merchant_id=? AND date BETWEEN ? AND ?`;

  db.query(salesQuery, [merchant_id, from_date, to_date], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });

    const totals = result[0];

    // Items sold
    const itemsQuery = `
      SELECT bi.material_id, m.material_name, SUM(bi.quantity) AS quantity_sold
      FROM bill_items bi
      JOIN materials m ON bi.material_id = m.id
      JOIN bills b ON bi.bill_id = b.id
      WHERE b.merchant_id=? AND b.date BETWEEN ? AND ?
      GROUP BY bi.material_id, m.material_name`;

    db.query(itemsQuery, [merchant_id, from_date, to_date], (err, items) => {
      if (err) return res.status(500).json({ error: err.message });

      res.json({
        total_sales: totals.total_sales || 0,
        total_bills: totals.total_bills || 0,
        items_sold: items
      });
    });
  });
};

// Inventory Report
exports.generateInventoryReport = (req, res) => {
  const { merchant_id } = req.query;

  const query = `
    SELECT id AS material_id, material_name, quantity, total_cost
    FROM materials
    WHERE merchant_id=?`;

  db.query(query, [merchant_id], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
};
