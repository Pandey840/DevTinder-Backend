const errorHandler = (err, req, res, next) => {
  if (err.name === 'ValidationError') {
    const errorMessages = Object.values(err.errors)
      .map((e) => e.message)
      .join(', ');

    return res.status(400).json({
      message: errorMessages, // Only show the validation error message
    });
  }

  // If it's not a ValidationError, handle it as a general error
  const statusCode = err.status || 500;
  const message =
    process.env.NODE_ENV === 'production'
      ? 'Something went wrong!'
      : err.message || 'Internal Server Error';

  res.status(statusCode).json({
    success: false,
    message,
    stack: process.env.NODE_ENV === 'production' ? null : err.stack,
  });
};

module.exports = errorHandler;
