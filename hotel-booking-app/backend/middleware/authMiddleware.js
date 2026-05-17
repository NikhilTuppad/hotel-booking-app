const jwt = require('jsonwebtoken');

const jwtSecret = process.env.JWT_SECRET || 'vguhjhgsrttf2554gh78vhg5fxvb8gdftxb3';

function getUserDataFromReq(req) {
  return new Promise((resolve, reject) => {
    if (!req.cookies.token) {
      return reject('No token');
    }

    jwt.verify(req.cookies.token, jwtSecret, {}, (err, userData) => {
      if (err) return reject(err);
      resolve(userData);
    });
  });
}

module.exports = {
  getUserDataFromReq,
  jwtSecret
};
