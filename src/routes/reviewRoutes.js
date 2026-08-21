const express = require('express');
const verifyToken = require('../middlewares/verifyToken.js');
const { createReview, getTutorReviews } = require('../controllers/reviewController.js');

const router = express.Router();

router.post('/', verifyToken, createReview);
router.get('/tutor/:email', getTutorReviews);

module.exports = router;
