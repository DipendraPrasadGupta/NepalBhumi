import express from 'express';
import {
  createProperty,
  getProperties,
  getPropertyById,
  updateProperty,
  deleteProperty,
  saveProperty,
  getSavedProperties,
} from '../controllers/propertyController.js';
import { protect } from '../middleware/auth.js';
import { uploadPropertyImages } from '../middleware/upload.js';

const router = express.Router();

router.post('/', protect, uploadPropertyImages, createProperty);
router.get('/', getProperties);
router.get('/saved', protect, getSavedProperties);
router.get('/:id', getPropertyById);
router.put('/:id', protect, uploadPropertyImages, updateProperty);
router.delete('/:id', protect, deleteProperty);
router.post('/:id/save', protect, saveProperty);

export default router;
