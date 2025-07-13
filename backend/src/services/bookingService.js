const BookingController = require('../controllers/bookingController');
const { supabase } = require('../../config/supabase');

const bookingService = {};

/**
 * Get all bookings with pagination
 * @param {object} query - Query parameters
 * @returns {Promise<object>}
 */
bookingService.getAllBookings = async (query) => {
  try {
    const { data, error } = await supabase
      .from('Bookings')
      .select(
        `
        *,
        flight:Flights(*),
        user:auth.users(id, email)
      `,
      )
      .order('createdAt', { ascending: false });

    if (error) throw error;

    return { data };
  } catch (err) {
    console.error('Error fetching all bookings:', err);
    throw new Error('Database query failed while fetching all bookings.');
  }
};

bookingService.createBooking = async (bookingData, user, token) => {
  const bookingController = new BookingController();
  const booking = await bookingController.createBooking(
    bookingData,
    user,
    token,
  );

  return booking;
};

bookingService.getUserBookings = async (userId, options = {}) => {
  const bookingController = new BookingController();
  const results = await bookingController.getUserBookings(userId, options);

  return {
    data: results.bookings,
    meta: {
      count: results.total,
      page: parseInt(options.page) || 1,
      limit: parseInt(options.limit) || 10,
    },
  };
};

bookingService.getBookingDetails = async (bookingId, userId = null) => {
  const bookingController = new BookingController();
  const booking = await bookingController.getBookingById(bookingId, userId);

  if (!booking) {
    const error = new Error('Booking not found');
    error.status = 404;
    throw error;
  }

  return booking;
};

bookingService.updateBooking = async (bookingId, updateData, userId = null) => {
  const bookingController = new BookingController();
  const booking = await bookingController.updateBooking(
    bookingId,
    updateData,
    userId,
  );

  return booking;
};

bookingService.cancelBooking = async (bookingId, userId = null) => {
  const bookingController = new BookingController();
  const result = await bookingController.cancelBooking(bookingId, userId);

  return result;
};

module.exports = bookingService;
