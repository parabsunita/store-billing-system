const { sql, poolPromise } = require('../../config/db');

// Create Bill
exports.createBill = async (req, res) => {
  const { merchant_id, bill_no, customer_name, payment_mode, items } = req.body;
  console.log("======================================================")
  try {
    const pool = await poolPromise;

    // Calculate total_amount
    const total_amount = items.reduce((sum, item) => sum + item.quantity * item.price, 0);

    // 1️⃣ Insert bill
    const billResult = await pool.request()
      .input('merchant_id', sql.Int, merchant_id)
      .input('bill_no', sql.NVarChar, bill_no)
      .input('customer_name', sql.NVarChar, customer_name)
      .input('payment_mode', sql.NVarChar, payment_mode || 'CASH')
      .input('total_amount', sql.Decimal(10, 2), total_amount)
      .query(`
        INSERT INTO bills (merchant_id, bill_no, customer_name, payment_mode, total_amount)
        OUTPUT inserted.id
        VALUES (@merchant_id, @bill_no, @customer_name, @payment_mode, @total_amount)
      `);

    const bill_id = billResult.recordset[0].id;

    // 2️⃣ Insert bill items
    for (const item of items) {
      await pool.request()
        .input('bill_id', sql.Int, bill_id)
        .input('material_id', sql.Int, item.material_id)
        .input('quantity', sql.Decimal(10, 2), item.quantity)
        .input('price', sql.Decimal(10, 2), item.price)
        .input('subtotal', sql.Decimal(10, 2), item.quantity * item.price)
        .query(`
          INSERT INTO bill_items (bill_id, material_id, quantity, price, subtotal)
          VALUES (@bill_id, @material_id, @quantity, @price, @subtotal)
        `);
    }

    res.status(201).json({ id: bill_id, bill_no, total_amount });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};

// Get Bill Details
exports.getBillDetails = async (req, res) => {
  const { id } = req.params;

  try {
    const pool = await poolPromise;

    const billResult = await pool.request()
      .input('id', sql.Int, id)
      .query('SELECT * FROM bills WHERE id = @id');

    if (billResult.recordset.length === 0) {
      return res.status(404).json({ message: 'Bill not found' });
    }

    const itemsResult = await pool.request()
      .input('bill_id', sql.Int, id)
      .query('SELECT material_id, quantity, price, subtotal FROM bill_items WHERE bill_id = @bill_id');

    const bill = billResult.recordset[0];
    bill.items = itemsResult.recordset;

    res.json(bill);

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};

// List Bills
exports.listBills = async (req, res) => {
  const { merchant_id, from_date, to_date } = req.query;

  try {
    const pool = await poolPromise;
    let query = `
      SELECT id, bill_no, customer_name, total_amount, date
      FROM bills
      WHERE merchant_id = @merchant_id
    `;

    const request = pool.request().input('merchant_id', sql.Int, merchant_id);

    if (from_date && to_date) {
      query += ' AND date BETWEEN @from_date AND @to_date';
      request.input('from_date', sql.DateTime, new Date(from_date));
      request.input('to_date', sql.DateTime, new Date(to_date));
    }

    const result = await request.query(query);
    res.json(result.recordset);

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};
