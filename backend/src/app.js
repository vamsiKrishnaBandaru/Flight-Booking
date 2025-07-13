const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const createSupabaseClient = require('./middleware/supabaseClient');

const app = express();

// Middleware
app.use(helmet());
app.use(cors());
app.use(morgan('combined'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(createSupabaseClient); // Apply Supabase client middleware to all routes

// Routes
const authRoutes = require('./routes/authRoutes');
const flightRoutes = require('./routes/flightRoutes');
const bookingRoutes = require('./routes/bookingRoutes');
const airportRoutes = require('./routes/airportRoutes');

app.use('/api/auth', authRoutes);
app.use('/api/flights', flightRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/airports', airportRoutes);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Error handling middleware
app.use((err, req, res, next) => {
  // In a real production app, you'd use a robust logger like Winston or Pino
  process.exit(1);
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  });
});

const PORT = process.env.PORT || 3000;

// Centralized Error Handling
app.use(errorHandler);

// Global unhandled rejection and exception handlers
process.on('unhandledRejection', (reason, promise) => {
  throw reason; // Will be caught by 'uncaughtException'
});

process.on('uncaughtException', (error) => {
  // In a real production app, you'd use a robust logger like Winston or Pino
  process.exit(1);
});

// Start the server
const server = app.listen(PORT, () => {});

module.exports = { app, server };
