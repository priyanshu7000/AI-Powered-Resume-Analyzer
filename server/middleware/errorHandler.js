export const errorHandler = (err, req, res, next) => {
  const error = { ...err };
  error.message = err.message;

  // Log error for development
  console.error(err);

  // Check if custom error has statusCode (AppError)
  if (err.statusCode) {
    error.statusCode = err.statusCode;
  }

  // Mongoose bad ObjectId
  if (err.name === 'CastError') {
    const message = `Resource not found`;
    error.statusCode = 404;
  }

  // Mongoose duplicate key
  if (err.code === 11000) {
    const message = `Duplicate field value entered`;
    error.statusCode = 400;
  }

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    const message = Object.values(err.errors)
      .map((val) => val.message)
      .join(', ');
    error.statusCode = 400;
    error.message = message;
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    error.statusCode = 401;
    error.message = 'Token is invalid';
  }

  if (err.name === 'TokenExpiredError') {
    error.statusCode = 401;
    error.message = 'Token expired';
  }

  res.status(error.statusCode || 500).json({
    success: false,
    message: error.message || 'Server error',
    ...(process.env.NODE_ENV === 'development' && { error: err }),
  });
};

export const asyncHandler = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);
