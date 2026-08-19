const userServices = require('../services/userServices');

const getAllUsers = async (req, res) => {
  try {
    const users = await userServices.getAllUsers();
    res.send(users);
  } catch (error) {
    res.status(500).send({ message: 'failed to fetch users' });
  }
};

const createUser = async (req, res) => {
  try {
    const result = await userServices.createUser(req.body);
    res.send(result);
  } catch (error) {
    res.status(500).send({ message: 'failed to create user' });
  }
};

const getUserRole = async (req, res) => {
  try {
    if (req.params.email !== req.decoded.email) {
      return res.status(403).send({ message: 'forbidden access' });
    }
    const user = await userServices.getUserByEmail(req.params.email);
    res.send({ role: user?.role || null, admin: user?.role === 'admin' });
  } catch (error) {
    res.status(500).send({ message: 'failed to fetch user role' });
  }
};

module.exports = {
  getAllUsers,
  createUser,
  getUserRole,
};
