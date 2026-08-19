const categoryServices = require('../services/categoryServices');

const getAllCategories = async (req, res) => {
  try {
    const categories = await categoryServices.getAllCategories();
    res.send(categories);
  } catch (error) {
    res.status(500).send({ message: 'failed to fetch categories' });
  }
};

const createCategory = async (req, res) => {
  try {
    const { name } = req.body;
    if (!name) {
      return res.status(400).send({ message: 'name is required' });
    }
    const result = await categoryServices.createCategory(req.body);
    res.send(result);
  } catch (error) {
    res.status(500).send({ message: 'failed to create category' });
  }
};

const updateCategory = async (req, res) => {
  try {
    const result = await categoryServices.updateCategory(req.params.id, req.body);
    if (!result) {
      return res.status(400).send({ message: 'invalid category id' });
    }
    res.send(result);
  } catch (error) {
    res.status(500).send({ message: 'failed to update category' });
  }
};

const deleteCategory = async (req, res) => {
  try {
    const result = await categoryServices.deleteCategory(req.params.id);
    if (!result) {
      return res.status(400).send({ message: 'invalid category id' });
    }
    res.send(result);
  } catch (error) {
    res.status(500).send({ message: 'failed to delete category' });
  }
};

module.exports = {
  getAllCategories,
  createCategory,
  updateCategory,
  deleteCategory,
};
