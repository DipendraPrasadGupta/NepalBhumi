export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePhone = (phone) => {
  const phoneRegex = /^\+?[1-9]\d{1,14}$/;
  return phoneRegex.test(phone.replace(/\D/g, ''));
};

export const validatePassword = (password) => {
  // At least 8 characters, 1 uppercase, 1 lowercase, 1 number
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{8,}$/;
  return passwordRegex.test(password);
};

export const validatePrice = (price) => {
  return !isNaN(price) && price > 0;
};

export const validateCoordinates = (lat, lng) => {
  return lat >= -90 && lat <= 90 && lng >= -180 && lng <= 180;
};
