const { client, isValidObjectId } = require('../../config/db');
const { ObjectId } = require('mongodb');

const profilesCollection = () => client.db('tutorNestDB').collection('tutorProfiles');

const enrichPipeline = (matchStage) => [
  ...(matchStage ? [{ $match: matchStage }] : []),
  {
    $lookup: {
      from: 'users',
      localField: 'userEmail',
      foreignField: 'email',
      as: 'user',
    },
  },
  { $unwind: { path: '$user', preserveNullAndEmptyArrays: true } },
  {
    $addFields: {
      categoryObjectId: {
        $cond: [
          { $eq: [{ $strLenCP: { $ifNull: ['$categoryId', ''] } }, 24] },
          { $toObjectId: '$categoryId' },
          null,
        ],
      },
    },
  },
  {
    $lookup: {
      from: 'categories',
      localField: 'categoryObjectId',
      foreignField: '_id',
      as: 'category',
    },
  },
  { $unwind: { path: '$category', preserveNullAndEmptyArrays: true } },
  {
    $project: {
      userEmail: 1,
      categoryId: 1,
      subjects: 1,
      bio: 1,
      hourlyRate: 1,
      availability: 1,
      createdAt: 1,
      updatedAt: 1,
      name: '$user.name',
      photo: '$user.photo',
      categoryName: '$category.name',
    },
  },
];

const getAllProfiles = async ({ categoryId } = {}) => {
  const match = categoryId ? { categoryId } : null;
  return profilesCollection().aggregate(enrichPipeline(match)).toArray();
};

const getProfileById = async (id) => {
  if (!isValidObjectId(id)) {
    return null;
  }
  const [profile] = await profilesCollection()
    .aggregate(enrichPipeline({ _id: new ObjectId(id) }))
    .toArray();
  return profile || null;
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
  getProfileById,
  getProfileByEmail,
  upsertProfile,
};
