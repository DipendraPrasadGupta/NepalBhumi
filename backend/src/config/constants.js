export const USER_ROLES = {
  USER: 'user',
  AGENT: 'agent',
  ADMIN: 'admin',
};

export const PROPERTY_TYPES = {
  HOUSE: 'house',
  FLAT: 'flat',
  LAND: 'land',
  COMMERCIAL: 'commercial',
};

export const PROPERTY_PURPOSE = {
  RENT: 'rent',
  SALE: 'sale',
};

export const PROPERTY_STATUS = {
  PENDING: 'pending',
  ACTIVE: 'active',
  ARCHIVED: 'archived',
  REJECTED: 'rejected',
};

export const VERIFICATION_STATUS = {
  VERIFIED: 'verified',
  PENDING: 'pending',
  REJECTED: 'rejected',
};

export const BOOKING_STATUS = {
  PENDING: 'pending',
  PAID: 'paid',
  ACCEPTED: 'accepted',
  REJECTED: 'rejected',
  CANCELLED: 'cancelled',
};

export const TRANSACTION_STATUS = {
  PENDING: 'pending',
  COMPLETED: 'completed',
  FAILED: 'failed',
  REFUNDED: 'refunded',
};

export const AMENITIES = [
  'parking',
  'security',
  'garden',
  'gym',
  'pool',
  'balcony',
  'kitchen',
  'dining',
  'laundry',
  'elevator',
  'wifi',
  'water-supply',
];

export const MESSAGE_STATUS = {
  SENT: 'sent',
  SEEN: 'seen',
  UNSEEN: 'unseen',
};

export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 10,
  MAX_LIMIT: 100,
};

export const TOKEN_EXPIRY = {
  ACCESS: 7 * 24 * 60 * 60, // 7 days in seconds
  REFRESH: 30 * 24 * 60 * 60, // 30 days in seconds
};
