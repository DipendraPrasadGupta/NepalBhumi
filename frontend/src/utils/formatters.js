export const formatPrice = (price, currency = 'NPR') => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
  }).format(price);
};

export const formatDate = (date) => {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

export const formatDateTime = (date) => {
  return new Date(date).toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

export const truncateText = (text, length = 100) => {
  return text.length > length ? text.substring(0, length) + '...' : text;
};

export const slugify = (text) => {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-');
};
