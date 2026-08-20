const express = require('express');
const verifyToken = require('../middlewares/verifyToken.js');
const verifyAdmin = require('../middlewares/verifyAdmin.js');
const {getAllUsers, createUser, getUserRole, setRole, updateUserStatus, getAdminStats} = require('../controllers/userController.js');

const router = express.Router();

router.get('/', verifyToken, verifyAdmin, getAllUsers);
router.get('/stats', verifyToken, verifyAdmin, getAdminStats);
router.get('/admin/:email', verifyToken, getUserRole);
router.post('/', createUser);
router.patch('/role', verifyToken, setRole);
router.patch('/:id/status', verifyToken, verifyAdmin, updateUserStatus);

module.exports = router;
