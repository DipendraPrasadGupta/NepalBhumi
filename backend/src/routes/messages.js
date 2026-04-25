import express from 'express';
import { 
  sendMessage, 
  getMessages, 
  replyToMessage, 
  getSentMessages,
  markAsRead,
  deleteMessage,
  updateMessage
} from '../controllers/messageController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// All routes require authentication
router.use(protect);

// Send a message
router.post('/', sendMessage);

// Get sent messages (MUST be before /:id routes to avoid matching 'sent' as an ID)
router.get('/sent', getSentMessages);

// Get received messages
router.get('/', getMessages);

// Reply to a message (MUST be before generic /:id route)
router.put('/:id/reply', replyToMessage);

// Mark message as read (MUST be before generic /:id route)
router.put('/:id/read', markAsRead);

// Delete a message
router.delete('/:id', deleteMessage);

// Update/Edit a message (MUST be last among /:id routes)
router.put('/:id', updateMessage);

export default router;
