const parseTimeInSec = (expiryString) => {
  const units = {d: 86400, h: 3600, m: 60, s: 1}; // Unit conversions to seconds
  const timeUnit = expiryString.slice(-1); // Last character (unit)
  const timeValue = parseInt(expiryString.slice(0, -1), 10); // Remaining characters (value)

  if (!units[timeUnit] || isNaN(timeValue)) {
    throw new Error(`Invalid expiry format: ${expiryString}`);
  }

  return timeValue * units[timeUnit]; // Convert to seconds
};

module.exports = parseTimeInSec;
