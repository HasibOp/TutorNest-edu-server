const userServices = require('../services/userServices');

const verifyAdmin = async (req, res, next) => {
  const email = req.decoded?.email;
  const user = await userServices.getUserByEmail(email);

  if (!user || user.role !== 'admin') {
    return res.status(403).send({ message: 'forbidden access' });
  }

  next();
};

module.exports = verifyAdmin;
