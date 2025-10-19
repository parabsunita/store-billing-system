const db = require('../../config/db');

// Create Stock Log
exports.createStockLog = (req, res) => {
  const { merchant_id, material_id, change_type, quantity_change } = req.body;

  // Update material quantity
  const operator = change_type === 'ADD' ? '+' : '-';
  const updateQuery = `UPDATE materials SET quantity = quantity ${operator} ? WHERE id = ? AND merchant_id = ?`;

  db.query(updateQuery, [quantity_change, material_id, merchant_id], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    if (result.affectedRows === 0) return res.status(404).json({ message: 'Material not found' });

    // Insert into stock_logs
    db.query(
      'INSERT INTO stock_logs (merchant_id, material_id, change_type, quantity_change) VALUES (?,?,?,?)',
      [merchant_id, material_id, change_type, quantity_change],
      (err) => {
        if (err) return res.status(500).json({ error: err.message });
        res.status(201).json({ message: 'Stock log created successfully' });
      }
    );
  });
};

// List Stock Logs
exports.listStockLogs = (req, res) => {
  const { merchant_id } = req.query;
  db.query(
    'SELECT id, material_id, change_type, quantity_change, created_at FROM stock_logs WHERE merchant_id=? ORDER BY created_at DESC',
    [merchant_id],
    (err, results) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json(results);
    }
  );
};
