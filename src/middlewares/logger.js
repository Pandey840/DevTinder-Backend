const logger = (req, res, next) => {
  const now = new Date();
  const formattedDate = now.toLocaleString('en-US', {
    hour: 'numeric',
    minute: 'numeric',
    hour12: true,
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });

  console.log(`[${formattedDate}] ${req.method} ${req.originalUrl}`);
  next();
};

module.exports = logger;
