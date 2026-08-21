const jwt = require('jsonwebtoken');
const userServices = require('../services/userServices');

const verifyToken = (req, res, next) => {
  if (!req.headers.authorization) {
    return res.status(401).send({ message: 'unauthorized access' });
  }

  const token = req.headers.authorization.split(' ')[1];
  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, async (error, decoded) => {
    if (error) {
      return res.status(401).send({ message: 'unauthorized access' });
    }

    const user = await userServices.getUserByEmail(decoded.email);
    if (user?.status === 'banned') {
      return res.status(403).send({ message: 'this account has been banned' });
    }

    req.decoded = decoded;
    next();
  });
};

module.exports = verifyToken;