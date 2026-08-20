const express = require('express');
const verifyToken = require('../middlewares/verifyToken.js');
const {createBooking,getMyBookings,updateBookingStatus} = require('../controllers/bookingController.js');

const router = express.Router();

router.post('/', verifyToken, createBooking);
router.get('/', verifyToken, getMyBookings);
router.patch('/:id/status', verifyToken, updateBookingStatus);

module.exports = router;
