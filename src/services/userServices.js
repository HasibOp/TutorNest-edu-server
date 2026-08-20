const { client, isValidObjectId } = require('../../config/db');
const { ObjectId } = require('mongodb');

const usersCollection = () => client.db('tutorNestDB').collection('users');

const getAllUsers = async () => {
  return usersCollection().find().toArray();
};

const createUser = async (user) => {
  const existing = await usersCollection().findOne({ email: user.email });
  if (existing) {
    return { insertedId: null, alreadyExists: true };
  }
  const result = await usersCollection().insertOne({ ...user, status: 'active' });
  return { ...result, alreadyExists: false };
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

const setInitialRole = async (email, role) => {
  return usersCollection().updateOne(
    { email, role: null },
    { $set: { role } }
  );
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
  setInitialRole,
  updateUserStatus,
};
