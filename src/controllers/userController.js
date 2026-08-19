const userServices = require('../services/userServices');
const categoryServices = require('../services/categoryServices');

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

const updateUserStatus = async (req, res) => {
  try {
    const { status } = req.body;
    if (!['active', 'banned'].includes(status)) {
      return res.status(400).send({ message: 'invalid status' });
    }
    const result = await userServices.updateUserStatus(req.params.id, status);
    if (!result) {
      return res.status(400).send({ message: 'invalid user id' });
    }
    res.send(result);
  } catch (error) {
    res.status(500).send({ message: 'failed to update user status' });
  }
};

const getAdminStats = async (req, res) => {
  try {
    const [userStats, categories] = await Promise.all([
      userServices.getUserStats(),
      categoryServices.getAllCategories(),
    ]);
    res.send({ ...userStats, categories: categories.length });
  } catch (error) {
    res.status(500).send({ message: 'failed to fetch admin stats' });
  }
};

module.exports = {
  getAllUsers,
  createUser,
  getUserRole,
  updateUserStatus,
  getAdminStats,
};
