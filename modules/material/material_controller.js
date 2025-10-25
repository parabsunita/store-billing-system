const { sql, poolPromise } = require('../../config/db');

// Create Material
exports.createMaterial = async (req, res) => {
  const { merchant_id, vendor_id, material_name, quantity, price } = req.body;

  try {
    const pool = await poolPromise;

    const result = await pool.request()
      .input('merchant_id', sql.Int, merchant_id)
      .input('vendor_id', sql.Int, vendor_id)
      .input('material_name', sql.NVarChar, material_name)
      .input('quantity', sql.Decimal(10,2), quantity)
      .input('price', sql.Decimal(10,2), price)
      .query(`
        INSERT INTO materials (merchant_id, vendor_id, material_name, quantity, price)
        OUTPUT inserted.id
        VALUES (@merchant_id, @vendor_id, @material_name, @quantity, @price)
      `);

    const insertedId = result.recordset[0].id;

    res.status(201).json({
      id: insertedId,
      material_name,
      message: 'Material created successfully'
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};

// Update Material
exports.updateMaterial = async (req, res) => {
  const { id } = req.params;
  const { material_name, quantity, price } = req.body;

  try {
    const pool = await poolPromise;

    // 1️⃣ Get current material details
    const current = await pool.request()
      .input('id', sql.Int, id)
      .query('SELECT material_name, quantity, price FROM materials WHERE id = @id');

    if (current.recordset.length === 0) {
      return res.status(404).json({ message: 'Material not found' });
    }

    const oldData = current.recordset[0];
    const newMaterialName = material_name || oldData.material_name;
    const newQuantity = quantity !== undefined ? quantity : oldData.quantity;
    const newPrice = price !== undefined ? price : oldData.price;

    // 2️⃣ Update material
    await pool.request()
      .input('id', sql.Int, id)
      .input('material_name', sql.NVarChar, newMaterialName)
      .input('quantity', sql.Decimal(10,2), newQuantity)
      .input('price', sql.Decimal(10,2), newPrice)
      .query('UPDATE materials SET material_name=@material_name, quantity=@quantity, price=@price WHERE id=@id');

    res.json({
      message: 'Material updated successfully',
      updated: {
        id,
        material_name: newMaterialName,
        quantity: newQuantity,
        price: newPrice,
        total_cost: newQuantity * newPrice
      }
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};

// List Materials by Merchant
exports.listMaterials = async (req, res) => {
  const { merchant_id } = req.query;

  try {
    const pool = await poolPromise;

    const result = await pool.request()
      .input('merchant_id', sql.Int, merchant_id)
      .query(`
        SELECT id, vendor_id, material_name, quantity, price, total_cost, created_at
        FROM materials
        WHERE merchant_id = @merchant_id
      `);

    res.json(result.recordset);

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};
