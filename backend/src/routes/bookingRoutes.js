const express = require('express');
const router = express.Router();
const { createBooking, getAllBookings, getBooking } = require('../controllers/bookingController');

// Create a new booking
router.post('/', createBooking);

// Get all bookings for a user
router.get('/', getAllBookings);

// Get a specific booking by ID
router.get('/:id', getBooking);

module.exports = router;
