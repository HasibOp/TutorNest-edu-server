const { client } = require('../../config/db');

const profilesCollection = () => client.db('tutorNestDB').collection('tutorProfiles');

const getAllProfiles = async () => {
  return profilesCollection().find().toArray();
};

const getProfileByEmail = async (email) => {
  return profilesCollection().findOne({ userEmail: email });
};

const upsertProfile = async (email, { categoryId, subjects, bio, hourlyRate, availability }) => {
  const profile = {
    userEmail: email,
    categoryId: categoryId || '',
    subjects: Array.isArray(subjects) ? subjects : [],
    bio: bio || '',
    hourlyRate: Number(hourlyRate) || 0,
    availability: Array.isArray(availability) ? availability : [],
    updatedAt: new Date(),
  };

  return profilesCollection().updateOne(
    { userEmail: email },
    {
      $set: profile,
      $setOnInsert: { createdAt: new Date() },
    },
    { upsert: true }
  );
};

module.exports = {
  getAllProfiles,
  getProfileByEmail,
  upsertProfile,
};
