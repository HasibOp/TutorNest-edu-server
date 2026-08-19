const { client, isValidObjectId } = require('../../config/db');
const { ObjectId } = require('mongodb');

const usersCollection = () => client.db('tutorNestDB').collection('users');

const getAllUsers = async () => {
  return usersCollection().find().toArray();
};

const createUser = async (user) => {
  return usersCollection().insertOne({ status: 'active', ...user });
};

const getUserByEmail = async (email) => {
  return usersCollection().findOne({ email });
};

const updateUserStatus = async (id, status) => {
  if (!isValidObjectId(id)) {
    return null;
  }
  return usersCollection().updateOne(
    { _id: new ObjectId(id) },
    { $set: { status } }
  );
};

module.exports = {
  getAllUsers,
  createUser,
  getUserByEmail,
  updateUserStatus,
};
