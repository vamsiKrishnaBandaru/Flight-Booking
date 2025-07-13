// Create a new booking
const createBooking = async (req, res) => {
  const supabase = req.supabase; // Use the request-specific client
  
  try {
    const { flightId, passengers, totalAmount, bookingStatus = 'confirmed' } = req.body;

    // Get user from the authenticated client
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return res.status(401).json({
        success: false,
        message: 'Unauthorized: Could not retrieve user from token.'
      });
    }

    // Validate required fields
    if (!flightId || !passengers || !totalAmount) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields: flightId, passengers, totalAmount'
      });
    }

    if (!Array.isArray(passengers) || passengers.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Passengers must be a non-empty array'
      });
    }

    // --- New logic: Check for flight availability BEFORE creating the booking ---
    const { data: flight, error: flightError } = await supabase
      .from('Flights')
      .select('availableSeats')
      .eq('id', parseInt(flightId))
      .single();

    if (flightError || !flight) {
      return res.status(404).json({
        success: false,
        message: 'Flight not found or could not be retrieved.',
      });
    }

    if (flight.availableSeats < passengers.length) {
      return res.status(400).json({
        success: false,
        message: `Not enough available seats. Only ${flight.availableSeats} left.`,
      });
    }
    // --- End of new logic ---

    // Create booking. The `userId` will be correctly matched by the RLS policy.
    const { data: booking, error: bookingError } = await supabase
      .from('Bookings')
      .insert([
        {
          userId: user.id, // Securely use user.id from the session token
          flightId: parseInt(flightId),
          totalAmount: parseFloat(totalAmount),
          passengerCount: passengers.length,
          status: bookingStatus
        }
      ])
      .select()
      .single();

    if (bookingError) {
      return res.status(500).json({
        success: false,
        message: `Failed to create booking: ${bookingError.message}`,
      });
    }

    // Create passengers
    const passengerData = passengers.map(passenger => ({
      bookingId: booking.id,
      fullName: `${passenger.firstName} ${passenger.lastName}`,
      dateOfBirth: passenger.dateOfBirth
    }));

    const { data: createdPassengers, error: passengersError } = await supabase
      .from('Passengers')
      .insert(passengerData)
      .select();

    if (passengersError) {
      // Rollback booking if passengers creation fails
      await supabase.from('Bookings').delete().eq('id', booking.id);
      return res.status(500).json({
        success: false,
        message: `Failed to create passengers: ${passengersError.message}`,
      });
    }

    // Update flight available seats with the new calculated value
    const newSeatCount = flight.availableSeats - passengers.length;
    const { error: updateError } = await supabase
      .from('Flights')
      .update({ availableSeats: newSeatCount })
      .eq('id', parseInt(flightId));

    if (updateError) {
      // This is not a critical failure, but should be logged for monitoring in a real system.
      // For this project, we'll fail silently in production.
    }

    res.status(201).json({
      success: true,
      message: 'Booking created successfully',
      data: {
        booking,
        passengers: createdPassengers
      }
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
};

// Get all bookings for a user
const getAllBookings = async (req, res) => {
  const supabase = req.supabase; // Use the request-specific client
  try {
    // Get user ID from auth token
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return res.status(401).json({
        success: false,
        message: 'Unauthorized'
      });
    }

    const { data: bookings, error } = await supabase
      .from('Bookings')
      .select(`
        *,
        flight:Flights (
          *,
          origin:Airports!originId(id, code, name, city, country),
          destination:Airports!destinationId(id, code, name, city, country)
        ),
        passengers:Passengers (*)
      `)
      .eq('userId', user.id)
      .order('createdAt', { ascending: false });

    if (error) {
      return res.status(500).json({
        success: false,
        message: `Failed to fetch bookings: ${error.message}`,
      });
    }

    res.json({
      success: true,
      data: bookings
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
};

// Get a specific booking
const getBooking = async (req, res) => {
  const supabase = req.supabase; // Use the request-specific client
  try {
    const { id } = req.params;

    // Get user ID from auth token
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return res.status(401).json({
        success: false,
        message: 'Unauthorized'
      });
    }

    const { data: booking, error } = await supabase
      .from('Bookings')
      .select(`
        *,
        flight:Flights (
          *,
          origin:Airports!originId(id, code, name, city, country),
          destination:Airports!destinationId(id, code, name, city, country)
        ),
        passengers:Passengers (*)
      `)
      .eq('id', parseInt(id))
      .eq('userId', user.id)
      .single();

    if (error) {
      return res.status(500).json({
        success: false,
        message: `Failed to fetch booking: ${error.message}`,
      });
    }

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    res.json({
      success: true,
      data: booking
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
};

module.exports = {
  createBooking,
  getAllBookings,
  getBooking
};
