const express = require('express');
const verifyToken = require('../middlewares/verifyToken.js');
const verifyAdmin = require('../middlewares/verifyAdmin.js');
const {getAllUsers, createUser, getUserRole} = require('../controllers/userController.js');

const router = express.Router();

router.get('/', verifyToken, verifyAdmin, getAllUsers);
router.get('/admin/:email', verifyToken, getUserRole);
router.post('/', createUser);

module.exports = router;
