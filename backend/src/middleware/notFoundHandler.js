const responseHelper = require('../helpers/responseHelper');

/**
 * 404 Not Found Handler Middleware
 * Handles requests to non-existent routes
 */
function notFoundHandler(req, res, next) {
  res.status(404).json({
    success: false,
    message: `The requested URL ${req.originalUrl} was not found on this server.`,
  });
}

module.exports = notFoundHandler;
