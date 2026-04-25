export const generateVerificationCode = () => {
  return Math.random().toString(36).substring(2, 8).toUpperCase();
};

export const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371; // Earth's radius in km
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) *
      Math.cos(lat2 * (Math.PI / 180)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

export const formatPrice = (price, currency = 'NPR') => {
  const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
  });
  return formatter.format(price);
};

export const paginationParams = (page, limit) => {
  const pageNumber = Math.max(1, parseInt(page) || 1);
  const pageLimit = Math.min(100, Math.max(1, parseInt(limit) || 10));
  const skip = (pageNumber - 1) * pageLimit;
  return { skip, limit: pageLimit, page: pageNumber };
};
