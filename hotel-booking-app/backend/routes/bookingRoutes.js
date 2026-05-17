const express = require('express');
const router = express.Router();
const { getBookingsByPlace, createBooking, getBookings, cancelBooking } = require('../controllers/bookingController');

router.get('/bookings-by-place/:placeId', getBookingsByPlace);
router.post('/bookings', createBooking);
router.get('/bookings', getBookings);
router.put('/bookings/:id/cancel', cancelBooking);

module.exports = router;
