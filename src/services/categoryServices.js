const { client, isValidObjectId } = require('../../config/db');
const { ObjectId } = require('mongodb');

const categoriesCollection = () => client.db('tutorNestDB').collection('categories');

const toSlug = (name) => name.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

const getAllCategories = async () => {
  return categoriesCollection().find().toArray();
};

const createCategory = async ({ name, description }) => {
  const category = {
    name,
    slug: toSlug(name),
    description: description || '',
    createdAt: new Date(),
  };
  return categoriesCollection().insertOne(category);
};

const updateCategory = async (id, { name, description }) => {
  if (!isValidObjectId(id)) {
    return null;
  }
  const update = { description: description || '' };
  if (name) {
    update.name = name;
    update.slug = toSlug(name);
  }
  return categoriesCollection().updateOne({ _id: new ObjectId(id) }, { $set: update });
};

const deleteCategory = async (id) => {
  if (!isValidObjectId(id)) {
    return null;
  }
  return categoriesCollection().deleteOne({ _id: new ObjectId(id) });
};

module.exports = {
  getAllCategories,
  createCategory,
  updateCategory,
  deleteCategory,
};
