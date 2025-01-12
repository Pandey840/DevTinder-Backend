const methodNotAllowedHandler = (req, res, next) => {
  const error = new Error(
    `Method ${req.method} not allowed on ${req.originalUrl}`,
  );
  error.status = 405;
  next(error);
};

module.exports = {
  methodNotAllowedHandler,
};
