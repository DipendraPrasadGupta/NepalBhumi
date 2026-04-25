import express from 'express';
import { protect, authorize } from '../middleware/auth.js';
import { uploadPropertyImages } from '../middleware/upload.js';
import {
  getDashboardStats,
  getAllPropertiesAdmin,
  createPropertyAdmin,
  updatePropertyAdmin,
  deletePropertyAdmin,
  deletePropertyImage,
  updatePropertyStatus,
  bulkUploadProperties,
  getAllUsers,
  updateUser,
  deleteUser,
  banUser,
  unbanUser,
} from '../controllers/adminController.js';

const router = express.Router();

router.use(protect, authorize('admin'));

// Dashboard statistics
router.get('/stats', getDashboardStats);

// Users management
router.get('/users', getAllUsers);
router.put('/users/:id', updateUser);
router.delete('/users/:id', deleteUser);
router.patch('/users/:id/ban', banUser);
router.patch('/users/:id/unban', unbanUser);

// Property management routes
router.get('/properties', getAllPropertiesAdmin);

// Bulk operations (must come before /:id routes)
router.post('/properties/bulk/upload', bulkUploadProperties);

// Individual property routes
router.post('/properties', uploadPropertyImages, createPropertyAdmin);
router.put('/properties/:id', uploadPropertyImages, updatePropertyAdmin);
router.delete('/properties/:id', deletePropertyAdmin);
router.patch('/properties/:id/status', updatePropertyStatus);
router.delete('/properties/:propertyId/images/:imageId', deletePropertyImage);

export default router;

