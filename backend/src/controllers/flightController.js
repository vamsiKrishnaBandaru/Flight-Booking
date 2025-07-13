const { supabase } = require('../../config/supabase');

// Search flights - POST endpoint that accepts originId/destinationId
const searchFlights = async (req, res) => {
  const supabase = req.supabase;
  try {
    const { originId, destinationId, departureDate, returnDate, passengers, tripType } = req.body;

    if (!originId || !destinationId || !departureDate) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields: originId, destinationId, departureDate'
      });
    }

    const totalPassengers = (passengers?.adults || 1) + (passengers?.children || 0);

    const buildFlightQuery = (oId, dId, date) => {
      return supabase
        .from('Flights')
        .select(`
          *,
          origin:Airports!originId (id, code, name, city, country),
          destination:Airports!destinationId (id, code, name, city, country)
        `)
        .eq('originId', oId)
        .eq('destinationId', dId)
        .gte('departureTime', date)
        .gte('availableSeats', totalPassengers)
        .order('departureTime', { ascending: true });
    };

    // Search outbound flights
    const { data: outboundFlights, error: outboundError } = await buildFlightQuery(originId, destinationId, departureDate);

    if (outboundError) {
      return res.status(500).json({
        success: false,
        message: `Failed to search outbound flights: ${outboundError.message}`,
      });
    }

    const allFlights = outboundFlights.map(f => ({ ...f, flightDirection: 'outbound' }));

    // Search return flights if round trip
    if (tripType === 'round-trip' && returnDate) {
      const { data: returnFlights, error: returnError } = await buildFlightQuery(destinationId, originId, returnDate);

      if (returnError) {
        return res.status(500).json({
          success: false,
          message: `Failed to search return flights: ${returnError.message}`,
        });
      }
      allFlights.push(...returnFlights.map(f => ({ ...f, flightDirection: 'return' })));
    }

    res.json({
      success: true,
      data: allFlights,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
};

// Get all flights
const getAllFlights = async (req, res) => {
  try {
    const { page = 1, limit = 20 } = req.query;
    const offset = (page - 1) * limit;

    const { data: flights, error } = await supabase
      .from('Flights')
      .select(`
        *,
        origin:Airports!originId (id, code, name, city, country),
        destination:Airports!destinationId (id, code, name, city, country)
      `)
      .order('departureTime', { ascending: true })
      .range(offset, offset + limit - 1);

    if (error) {
      return res.status(500).json({
        success: false,
        message: `Failed to fetch flights: ${error.message}`,
      });
    }

    res.json({
      success: true,
      data: flights || [],
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
};

// Get flight by ID
const getFlightById = async (req, res) => {
  try {
    const { id } = req.params;

    const { data: flight, error } = await supabase
      .from('Flights')
      .select(`
        *,
        origin:Airports!originId (id, code, name, city, country),
        destination:Airports!destinationId (id, code, name, city, country)
      `)
      .eq('id', parseInt(id))
      .single();

    if (error) {
      return res.status(500).json({
        success: false,
        message: `Failed to fetch flight: ${error.message}`,
      });
    }

    if (!flight) {
      return res.status(404).json({
        success: false,
        message: 'Flight not found'
      });
    }

    res.json({
      success: true,
      data: flight,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
};

module.exports = {
  searchFlights,
  getAllFlights,
  getFlightById
};
