const express = require('express');
const { tokenIssue } = require('../controllers/authController');

const router = express.Router();

router.post('/jwt', tokenIssue);

module.exports = router;