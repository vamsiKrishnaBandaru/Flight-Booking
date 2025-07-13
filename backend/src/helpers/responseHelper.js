/**
 * @description Sends a success response
 * @param {object} res - The response object
 * @param {number} statusCode - The status code
 * @param {object} data - The data to send
 */
const sendSuccess = (res, statusCode, data) => {
  res.status(statusCode).json({
    success: true,
    data,
  });
};

/**
 * @description Sends an error response
 * @param {object} res - The response object
 * @param {number} statusCode - The status code
 * @param {string} message - The error message
 */
const sendError = (res, statusCode, message) => {
  res.status(statusCode).json({
    success: false,
    message,
  });
};

module.exports = {
  sendSuccess,
  sendError,
}; 