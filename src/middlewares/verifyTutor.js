const userServices = require('../services/userServices');

const verifyTutor = async (req, res, next) => {
  const email = req.decoded?.email;
  const user = await userServices.getUserByEmail(email);

  if (!user || user.role !== 'tutor') {
    return res.status(403).send({ message: 'forbidden access' });
  }

  next();
};

module.exports = verifyTutor;
