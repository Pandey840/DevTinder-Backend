const formatDate = (isoDate) => {
  const options = {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  };
  const dateObj = new Date(isoDate);
  return dateObj.toLocaleString('en-US', options);
};

module.exports = {formatDate};
