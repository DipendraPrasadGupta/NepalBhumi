import express from 'express';
import { protect, admin } from '../middleware/auth.js';
import {
  submitReport,
  getAllReports,
  getReportDetails,
  updateReportStatus,
  deleteReport,
  getUserReports,
} from '../controllers/reportsController.js';

const router = express.Router();

// Public route - submit a report (anyone can report)
router.post('/', submitReport);

// Admin only routes
router.get('/', protect, admin, getAllReports);
router.get('/:reportId', protect, admin, getReportDetails);
router.put('/:reportId', protect, admin, updateReportStatus);
router.delete('/:reportId', protect, admin, deleteReport);
router.get('/user/:userId', protect, admin, getUserReports);

export default router;
