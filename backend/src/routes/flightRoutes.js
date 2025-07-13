const express = require('express');
const router = express.Router();
const { searchFlights, getAllFlights, getFlightById } = require('../controllers/flightController');

// Search flights - POST endpoint (main)
router.post('/search', searchFlights);

// Get all flights
router.get('/', getAllFlights);

// Get flight by ID
router.get('/:id', getFlightById);

module.exports = router;
