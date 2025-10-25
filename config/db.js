const sql = require('mssql');
const dotenv = require('dotenv');
dotenv.config();

const config = {
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  server: process.env.DB_HOST, // sql.bsite.net
  database: process.env.DB_NAME, // magicvorks_
  port: parseInt(process.env.DB_PORT) || 1433,
  options: {
    encrypt: true,
    trustServerCertificate: true,
    instanceName: process.env.DB_INSTANCE // MSSQL2016
  }
};

const poolPromise = new sql.ConnectionPool(config)
  .connect()
  .then(pool => {
    console.log('✅ Connected to MSSQL Server');
    return pool;
  })
  .catch(err => {
    console.error('❌ DB connection failed:', err.message);
  });

module.exports = { sql, poolPromise };
