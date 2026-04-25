import express from 'express';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// Placeholder for booking routes
router.get('/', protect, (req, res) => {
  res.json({ message: 'Booking routes coming soon' });
});

export default router;
