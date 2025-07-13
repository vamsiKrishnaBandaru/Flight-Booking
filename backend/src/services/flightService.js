const FlightController = require('../controllers/flightController');

const flightService = {};

flightService.searchFlights = async (searchParams) => {
  const flightController = new FlightController();
  // The controller now returns the flat array directly
  return await flightController.searchFlights(searchParams);
};

flightService.getAllFlights = async (options) => {
  const flightController = new FlightController();
  const results = await flightController.getAllFlights(options);

  return {
    data: results.flights,
  };
};

flightService.getFlightDetails = async (flightId) => {
  const flightController = new FlightController();
  const flight = await flightController.getFlightById(flightId);

  if (!flight) {
    const error = new Error('Flight not found');
    error.status = 404;
    throw error;
  }

  return flight;
};

flightService.getAvailableRoutes = async () => {
  const flightController = new FlightController();
  return await flightController.getAvailableRoutes();
};

flightService.getAvailableAirlines = async () => {
  const flightController = new FlightController();
  return await flightController.getAvailableAirlines();
};

module.exports = flightService;
