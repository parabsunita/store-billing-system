const db = require('../../config/db');

// Create Material
exports.createMaterial = (req, res) => {
  const { merchant_id, vendor_id, material_name, quantity, price } = req.body;
  const total_cost = quantity * price;

  db.query(
    'INSERT INTO materials (merchant_id, vendor_id, material_name, quantity, price, total_cost) VALUES (?,?,?,?,?,?)',
    [merchant_id, vendor_id, material_name, quantity, price, total_cost],
    (err, result) => {
      if (err) return res.status(500).json({ error: err.message });
      res.status(201).json({ id: result.insertId, material_name });
    }
  );
};

// Update Material
exports.updateMaterial = (req, res) => {
  const { id } = req.params;
  const { material_name, quantity, price } = req.body;

  // Get current material to calculate total_cost
  db.query('SELECT quantity, price FROM materials WHERE id=?', [id], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!results.length) return res.status(404).json({ message: 'Material not found' });

    const oldData = results[0];
    const newQuantity = quantity !== undefined ? quantity : oldData.quantity;
    const newPrice = price !== undefined ? price : oldData.price;
    const total_cost = newQuantity * newPrice;

    db.query(
      'UPDATE materials SET material_name=?, quantity=?, price=?, total_cost=? WHERE id=?',
      [material_name || oldData.material_name, newQuantity, newPrice, total_cost, id],
      (err) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: 'Material updated successfully' });
      }
    );
  });
};

// List Materials by Merchant
exports.listMaterials = (req, res) => {
  const { merchant_id } = req.query;
  db.query(
    'SELECT id, vendor_id, material_name, quantity, price, total_cost, created_at FROM materials WHERE merchant_id=?',
    [merchant_id],
    (err, results) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json(results);
    }
  );
};
