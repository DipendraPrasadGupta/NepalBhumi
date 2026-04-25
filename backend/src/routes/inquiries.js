import express from 'express';
import { protect } from '../middleware/auth.js';
import {
  createInquiry,
  getInquiries,
  getInquiryById,
  sendMessage,
  closeInquiry,
} from '../controllers/inquiryController.js';

const router = express.Router();

router.post('/', protect, createInquiry);
router.get('/', protect, getInquiries);
router.get('/:id', protect, getInquiryById);
router.post('/:id/message', protect, sendMessage);
router.post('/:id/close', protect, closeInquiry);

export default router;
