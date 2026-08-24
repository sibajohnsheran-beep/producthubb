/**
 * Centralized Error Handling Middleware
 * Catches any unhandled errors, logs them internally, and sends clean JSON error responses.
 */

function errorHandler(err, req, res, next) {
  // Log error internally for debugging
  console.error('[SERVER ERROR]:', err.stack || err.message || err);

  const statusCode = err.statusCode || err.status || 500;
  const message = statusCode === 500 
    ? 'Internal server error' 
    : (err.message || 'An unexpected error occurred');

  res.status(statusCode).json({
    success: false,
    message: message,
    ...(err.errors ? { errors: err.errors } : {})
  });
}

module.exports = errorHandler;
