const jwt = require('jsonwebtoken');
require('dotenv').config();

exports.generateToken = (payload) => {
  return jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: process.env.TOKEN_EXPIRE || '1d',
  });
};
