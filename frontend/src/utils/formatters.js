export const formatPrice = (price) => {
  const numericPrice = Number(price);
  if (isNaN(numericPrice)) {
    return '$0.00';
  }
  return numericPrice.toLocaleString('en-US', {
    style: 'currency',
    currency: 'USD',
  });
};

export const formatDate = (dateValue) => {
  if (!dateValue) return 'N/A';

  const date = dateValue instanceof Date ? dateValue : new Date(dateValue);

  if (isNaN(date.getTime())) {
    return 'Invalid Date';
  }

  return date.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  });
};

export const formatTime = (timeValue) => {
  if (!timeValue) return 'Invalid Time';

  // The 'new Date()' constructor can handle ISO strings directly.
  const date = new Date(timeValue);

  if (isNaN(date.getTime())) {
    return 'Invalid Time';
  }

  return date.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  });
};

export const formatDuration = (startTime, endTime) => {
  if (!startTime || !endTime) return '';

  const startDate = startTime instanceof Date ? startTime : new Date(startTime);
  const endDate = endTime instanceof Date ? endTime : new Date(endTime);

  if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
    return 'N/A';
  }

  const diffMs = endDate - startDate;
  const diffHrs = Math.floor(diffMs / 3600000);
  const diffMins = Math.round((diffMs % 3600000) / 60000);

  return `${diffHrs}h ${diffMins}m`;
};

export const formatCabinClass = (cabinClass) => {
  if (!cabinClass) return 'Economy';

  const classMap = {
    economy: 'Economy',
    'premium-economy': 'Premium Economy',
    business: 'Business',
    first: 'First Class',
  };

  return classMap[cabinClass.toLowerCase()] || cabinClass;
};

export const formatAirportCode = (airport) => {
  if (!airport) return '';

  if (airport.includes(' - ')) {
    return airport;
  }

  return airport.toUpperCase();
};
