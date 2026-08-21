const express = require('express');
const verifyToken = require('../middlewares/verifyToken.js');
const verifyAdmin = require('../middlewares/verifyAdmin.js');
const {createBooking,getMyBookings,getAllBookings,updateBookingStatus} = require('../controllers/bookingController.js');

const router = express.Router();

router.post('/', verifyToken, createBooking);
router.get('/', verifyToken, getMyBookings);
router.get('/admin', verifyToken, verifyAdmin, getAllBookings);
router.patch('/:id/status', verifyToken, updateBookingStatus);

module.exports = router;
