const { client } = require('../../config/db');

const usersCollection = () => client.db('tutorNestDB').collection('users');

const getAllUsers = async () => {
  return usersCollection().find().toArray();
};

const createUser = async (user) => {
  return usersCollection().insertOne(user);
};

const getUserByEmail = async (email) => {
  return usersCollection().findOne({ email });
};

module.exports = {
  getAllUsers,
  createUser,
  getUserByEmail,
};
