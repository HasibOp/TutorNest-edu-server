const express = require('express');
const verifyToken = require('../middlewares/verifyToken.js');
const verifyAdmin = require('../middlewares/verifyAdmin.js');
const {getAllCategories, createCategory, updateCategory, deleteCategory} = require('../controllers/categoryController.js');

const router = express.Router();

router.get('/', getAllCategories);
router.post('/', verifyToken, verifyAdmin, createCategory);
router.patch('/:id', verifyToken, verifyAdmin, updateCategory);
router.delete('/:id', verifyToken, verifyAdmin, deleteCategory);

module.exports = router;
