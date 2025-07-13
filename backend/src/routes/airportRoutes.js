const express = require('express');
const router = express.Router();
const { getAllAirports, searchAirports, getAirportById } = require('../controllers/airportController');

// Get all airports
router.get('/', getAllAirports);

// Search airports
router.get('/search', searchAirports);

// Get airport by ID
router.get('/:id', getAirportById);

module.exports = router;
