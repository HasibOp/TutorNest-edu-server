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

const getUserStats = async () => {
  const [total, students, tutors, admins, banned] = await Promise.all([
    usersCollection().countDocuments(),
    usersCollection().countDocuments({ role: 'student' }),
    usersCollection().countDocuments({ role: 'tutor' }),
    usersCollection().countDocuments({ role: 'admin' }),
    usersCollection().countDocuments({ status: 'banned' }),
  ]);
  return { total, students, tutors, admins, banned };
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
  getUserStats,
  updateUserStatus,
};
