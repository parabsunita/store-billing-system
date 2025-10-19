const db = require('../../config/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Register Merchant
exports.registerMerchant = async (req, res) => {
  const { store_name, owner_name, email, password, contact, address } = req.body;
  db.query('SELECT id FROM merchants WHERE email=?', [email], async (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    if (result.length) return res.status(409).json({ message: 'Email exists' });

    const hashedPassword = await bcrypt.hash(password, 10);
    db.query(
      'INSERT INTO merchants (store_name, owner_name, email, password, contact, address) VALUES (?,?,?,?,?,?)',
      [store_name, owner_name, email, hashedPassword, contact, address],
      (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.status(201).json({ id: result.insertId, store_name, email });
      }
    );
  });
};

// Login Merchant
exports.loginMerchant = (req, res) => {
  const { email, password } = req.body;
  db.query('SELECT * FROM merchants WHERE email=?', [email], async (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!result.length) return res.status(401).json({ message: 'Invalid credentials' });

    const merchant = result[0];
    const match = await bcrypt.compare(password, merchant.password);
    if (!match) return res.status(401).json({ message: 'Invalid credentials' });

    const token = jwt.sign(
      { id: merchant.id, email: merchant.email },
      process.env.JWT_SECRET,
      { expiresIn: process.env.TOKEN_EXPIRE || '1d' }
    );
    res.json({ token });
  });
};

// Get Merchant Profile
exports.getMerchantProfile = (req, res) => {
  const { id } = req.params;
  db.query(
    'SELECT id, store_name, owner_name, email, contact, address FROM merchants WHERE id=?',
    [id],
    (err, result) => {
      if (err) return res.status(500).json({ error: err.message });
      if (!result.length) return res.status(404).json({ message: 'Merchant not found' });
      res.json(result[0]);
    }
  );
};
