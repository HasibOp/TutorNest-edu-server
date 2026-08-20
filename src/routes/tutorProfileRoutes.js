const express = require('express');
const verifyToken = require('../middlewares/verifyToken.js');
const verifyTutor = require('../middlewares/verifyTutor.js');
const {getAllProfiles, getProfile, getMyProfile, upsertMyProfile} = require('../controllers/tutorProfileController.js');

const router = express.Router();

router.get('/', getAllProfiles);
router.get('/me', verifyToken, verifyTutor, getMyProfile);
router.put('/me', verifyToken, verifyTutor, upsertMyProfile);
router.get('/:id', getProfile);

module.exports = router;
