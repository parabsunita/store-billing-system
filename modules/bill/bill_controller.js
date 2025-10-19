const db = require('../../config/db');

// Create Bill
exports.createBill = (req, res) => {
  const { merchant_id, bill_no, customer_name, payment_mode, items } = req.body;

  // Calculate total_amount
  let total_amount = items.reduce((sum, item) => sum + item.quantity * item.price, 0);

  // Insert bill
  db.query(
    'INSERT INTO bills (merchant_id, bill_no, customer_name, payment_mode, total_amount) VALUES (?,?,?,?,?)',
    [merchant_id, bill_no, customer_name, payment_mode || 'CASH', total_amount],
    (err, result) => {
      if (err) return res.status(500).json({ error: err.message });
      const bill_id = result.insertId;

      // Insert bill items
      const billItemsData = items.map(item => [bill_id, item.material_id, item.quantity, item.price, item.quantity * item.price]);
      const sqlItems = 'INSERT INTO bill_items (bill_id, material_id, quantity, price, subtotal) VALUES ?';
      db.query(sqlItems, [billItemsData], (err) => {
        if (err) return res.status(500).json({ error: err.message });
        res.status(201).json({ id: bill_id, bill_no, total_amount });
      });
    }
  );
};

// Get Bill Details
exports.getBillDetails = (req, res) => {
  const { id } = req.params;

  db.query('SELECT * FROM bills WHERE id=?', [id], (err, bills) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!bills.length) return res.status(404).json({ message: 'Bill not found' });

    db.query('SELECT material_id, quantity, price, subtotal FROM bill_items WHERE bill_id=?', [id], (err, items) => {
      if (err) return res.status(500).json({ error: err.message });
      const bill = bills[0];
      bill.items = items;
      res.json(bill);
    });
  });
};

// List Bills
exports.listBills = (req, res) => {
  const { merchant_id, from_date, to_date } = req.query;

  let query = 'SELECT id, bill_no, customer_name, total_amount, date FROM bills WHERE merchant_id=?';
  const params = [merchant_id];

  if (from_date && to_date) {
    query += ' AND date BETWEEN ? AND ?';
    params.push(from_date, to_date);
  }

  db.query(query, params, (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
};
