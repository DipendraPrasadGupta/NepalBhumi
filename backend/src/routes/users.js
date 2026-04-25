import express from 'express';
import { protect } from '../middleware/auth.js';
import {
  getUserProfile,
  getUserPublicProfile,
  getAgentListings,
  updateUserProfile,
  getMyListings,
  uploadKYC,
  changePassword,
  deleteAccount,
  getAgents,
} from '../controllers/userController.js';
import { uploadProfileImage, uploadKYCDocs } from '../middleware/upload.js';


const router = express.Router();

router.get('/agents', getAgents); // Public route to fetch agents
router.get('/profile/:id', getUserPublicProfile); // Public route to fetch any user's profile
router.get('/:userId/listings', getAgentListings); // Public route to fetch any agent's listings
router.get('/profile', protect, getUserProfile);
router.put('/profile', protect, uploadProfileImage, updateUserProfile);
router.get('/listings', protect, getMyListings);
router.post('/kyc', protect, uploadKYCDocs, uploadKYC);
router.post('/change-password', protect, changePassword);
router.delete('/delete-account', protect, deleteAccount);

export default router;
