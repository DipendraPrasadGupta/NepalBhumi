import api from './axiosInstance.js';

// Auth APIs
export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  logout: () => api.post('/auth/logout'),
};

// Property APIs
export const propertyAPI = {
  createProperty: (data) => api.post('/properties', data, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }),
  getProperties: (params) => api.get('/properties', { params }),
  getPropertyById: (id) => api.get(`/properties/${id}`),
  getUserProperties: (params) => api.get('/users/listings', { params }),
  updateProperty: (id, data) => api.put(`/properties/${id}`, data, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }),
  deleteProperty: (id) => api.delete(`/properties/${id}`),
  saveProperty: (id) => api.post(`/properties/${id}/save`),
  getSavedProperties: (params) => api.get('/properties/saved', { params }),
};

// User APIs
export const userAPI = {
  getProfile: () => api.get('/users/profile'),
  getPublicProfile: (id) => api.get(`/users/profile/${id}`),
  getAgents: (params) => api.get('/users/agents', { params }),
  getAgentListings: (userId, params) => api.get(`/users/${userId}/listings`, { params }),
  updateProfile: (data) => api.put('/users/profile', data, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }),
  getMyListings: (params) => api.get('/users/listings', { params }),
  uploadKYC: (data) => api.post('/users/kyc', data, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }),
  changePassword: (data) => api.post('/users/change-password', data),
  deleteAccount: (data) => api.delete('/users/delete-account', { data }),
  toggleSaveAgent: (id) => api.post(`/users/agents/${id}/save`),
  getSavedAgents: () => api.get('/users/saved-agents'),
};

// Inquiry APIs
export const inquiryAPI = {
  createInquiry: (data) => api.post('/inquiries', data),
  getInquiries: (params) => api.get('/inquiries', { params }),
  getInquiryById: (id) => api.get(`/inquiries/${id}`),
  sendMessage: (id, data) => api.post(`/inquiries/${id}/message`, data),
  closeInquiry: (id) => api.post(`/inquiries/${id}/close`),
};

// Message APIs
export const messageAPI = {
  getReceivedMessages: () => api.get('/messages'),
  getSentMessages: () => api.get('/messages/sent'),
  sendMessage: (data) => api.post('/messages', data),
  replyToMessage: (id, data) => api.put(`/messages/${id}/reply`, data),
};

// Admin APIs
export const adminAPI = {
  getDashboardStats: () => api.get('/admin/stats'),
  getPendingProperties: (params) => api.get('/admin/properties/pending', { params }),
  approveProperty: (id) => api.post(`/admin/properties/${id}/approve`),
  rejectProperty: (id, data) => api.post(`/admin/properties/${id}/reject`, data),
  getUsers: (params) => api.get('/admin/users', { params }),
  banUser: (id) => api.post(`/admin/users/${id}/ban`),
  unbanUser: (id) => api.post(`/admin/users/${id}/unban`),
};

// Report APIs
export const reportAPI = {
  submitReport: (data) => api.post('/admin/reports', data),
  getAllReports: (params) => api.get('/admin/reports', { params }),
  getReportDetails: (id) => api.get(`/admin/reports/${id}`),
  updateReportStatus: (id, data) => api.put(`/admin/reports/${id}`, data),
  deleteReport: (id) => api.delete(`/admin/reports/${id}`),
  getUserReports: (userId, params) => api.get(`/admin/reports/user/${userId}`, { params }),
};
