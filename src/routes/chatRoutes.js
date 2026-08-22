const express = require('express');
const { sendMessage } = require('../controllers/chatController.js');

const router = express.Router();

router.post('/', sendMessage);

module.exports = router;
