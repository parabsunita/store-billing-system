const db = require('../../config/db');

// Create Material
exports.createMaterial = (req, res) => {
  const { merchant_id, vendor_id, material_name, quantity, price } = req.body;

  db.query(
    'INSERT INTO materials (merchant_id, vendor_id, material_name, quantity, price) VALUES (?, ?, ?, ?, ?)',
    [merchant_id, vendor_id, material_name, quantity, price],
    (err, result) => {
      if (err) return res.status(500).json({ error: err.message });
      res.status(201).json({
        id: result.insertId,
        material_name,
        message: 'Material created successfully'
      });
    }
  );
};


// Update Material
exports.updateMaterial = (req, res) => {
  const { id } = req.params;
  const { material_name, quantity, price } = req.body;

  // Get current material details
  db.query('SELECT material_name, quantity, price FROM materials WHERE id=?', [id], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!results.length) return res.status(404).json({ message: 'Material not found' });

    const oldData = results[0];
    const newMaterialName = material_name || oldData.material_name;
    const newQuantity = quantity !== undefined ? quantity : oldData.quantity;
    const newPrice = price !== undefined ? price : oldData.price;

    // total_cost will auto-update in MySQL
    db.query(
      'UPDATE materials SET material_name=?, quantity=?, price=? WHERE id=?',
      [newMaterialName, newQuantity, newPrice, id],
      (err) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({
          message: 'Material updated successfully',
          updated: {
            id,
            material_name: newMaterialName,
            quantity: newQuantity,
            price: newPrice,
            total_cost: newQuantity * newPrice // optional, just for response display
          }
        });
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
