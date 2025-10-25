const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { sql, poolPromise } = require('../../config/db');

// Register Merchant
exports.registerMerchant = async (req, res) => {
  const { store_name, owner_name, email, password, contact, address } = req.body;

  try {
    const pool = await poolPromise;

    // 1️⃣ Check if email exists
    const checkEmail = await pool.request()
      .input('email', sql.NVarChar, email)
      .query('SELECT id FROM merchants WHERE email = @email');

    if (checkEmail.recordset.length > 0) {
      return res.status(409).json({ message: 'Email already exists' });
    }

    // 2️⃣ Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // 3️⃣ Insert merchant
    const insert = await pool.request()
      .input('store_name', sql.NVarChar, store_name)
      .input('owner_name', sql.NVarChar, owner_name)
      .input('email', sql.NVarChar, email)
      .input('password', sql.NVarChar, hashedPassword)
      .input('contact', sql.NVarChar, contact)
      .input('address', sql.NVarChar, address)
      .query(`
        INSERT INTO merchants (store_name, owner_name, email, password, contact, address)
        OUTPUT inserted.id
        VALUES (@store_name, @owner_name, @email, @password, @contact, @address)
      `);

    const insertedId = insert.recordset[0].id;

    res.status(201).json({ id: insertedId, store_name, email });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};

// Login Merchant
exports.loginMerchant = async (req, res) => {
  const { email, password } = req.body;

  try {
    const pool = await poolPromise;

    const result = await pool.request()
      .input('email', sql.NVarChar, email)
      .query('SELECT * FROM merchants WHERE email = @email');

    if (result.recordset.length === 0) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const merchant = result.recordset[0];
    const match = await bcrypt.compare(password, merchant.password);

    if (!match) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { id: merchant.id, email: merchant.email },
      process.env.JWT_SECRET,
      { expiresIn: process.env.TOKEN_EXPIRE || '1d' }
    );

    res.json({ token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};

// Get Merchant Profile
exports.getMerchantProfile = async (req, res) => {
  const { id } = req.params;

  try {
    const pool = await poolPromise;

    const result = await pool.request()
      .input('id', sql.Int, id)
      .query('SELECT id, store_name, owner_name, email, contact, address FROM merchants WHERE id = @id');

    if (result.recordset.length === 0) {
      return res.status(404).json({ message: 'Merchant not found' });
    }

    res.json(result.recordset[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};
