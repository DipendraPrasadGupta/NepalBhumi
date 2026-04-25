import Message from '../models/Message.js';
import User from '../models/User.js';

// Send a message
export const sendMessage = async (req, res) => {
  try {
    const { recipientId, recipientEmail, recipientName, message, senderRole } = req.body;
    const senderId = req.user.userId; // JWT uses 'userId' not '_id'

    // Fetch sender details
    const sender = await User.findById(senderId);
    if (!sender) {
      return res.status(401).json({
        success: false,
        message: 'Sender user not found'
      });
    }
    const senderName = sender.name;

    // Validate recipient exists
    const recipient = await User.findById(recipientId);
    if (!recipient) {
      return res.status(404).json({
        success: false,
        message: 'Recipient user not found'
      });
    }

    // Create message
    const newMessage = new Message({
      senderId,
      senderName,
      senderRole: senderRole || 'user',
      recipientId,
      recipientEmail: recipientEmail || recipient.email,
      recipientName: recipientName || recipient.name,
      message
    });

    const savedMessage = await newMessage.save();

    res.status(201).json({
      success: true,
      message: 'Message sent successfully',
      data: savedMessage
    });
  } catch (error) {
    console.error('Error sending message:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to send message'
    });
  }
};

// Get messages for logged-in user (received messages)
export const getMessages = async (req, res) => {
  try {
    const userId = req.user.userId;
    
    // Fetch all messages received by the user
    const messages = await Message.find({ recipientId: userId })
      .populate('senderId', 'name email')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      message: 'Messages retrieved successfully',
      data: messages
    });
  } catch (error) {
    console.error('Error fetching messages:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to fetch messages'
    });
  }
};

// Reply to a message
export const replyToMessage = async (req, res) => {
  try {
    const { id } = req.params;
    const { reply } = req.body;
    const userId = req.user.userId;

    // Find message and verify user is recipient
    const message = await Message.findById(id);
    if (!message) {
      return res.status(404).json({
        success: false,
        message: 'Message not found'
      });
    }

    if (message.recipientId.toString() !== userId.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to reply to this message'
      });
    }

    // Update message with reply
    message.reply = reply;
    message.replyAt = new Date();
    const updatedMessage = await message.save();

    res.status(200).json({
      success: true,
      message: 'Reply sent successfully',
      data: updatedMessage
    });
  } catch (error) {
    console.error('Error replying to message:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to send reply'
    });
  }
};

// Get sent messages (for admin viewing messages they sent)
export const getSentMessages = async (req, res) => {
  try {
    const userId = req.user.userId;
    
    // Fetch all messages sent by the user
    const messages = await Message.find({ senderId: userId })
      .populate('recipientId', 'name email')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      message: 'Sent messages retrieved successfully',
      data: messages
    });
  } catch (error) {
    console.error('Error fetching sent messages:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to fetch sent messages'
    });
  }
};

// Mark message as read
export const markAsRead = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.userId;

    const message = await Message.findById(id);
    if (!message) {
      return res.status(404).json({
        success: false,
        message: 'Message not found'
      });
    }

    if (message.recipientId.toString() !== userId.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to mark this message'
      });
    }

    message.isRead = true;
    message.readAt = new Date();
    const updatedMessage = await message.save();

    res.status(200).json({
      success: true,
      message: 'Message marked as read',
      data: updatedMessage
    });
  } catch (error) {
    console.error('Error marking message as read:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to mark message as read'
    });
  }
};
// Delete a message (admin only)
export const deleteMessage = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.userId;

    // Find message
    const message = await Message.findById(id);
    if (!message) {
      return res.status(404).json({
        success: false,
        message: 'Message not found'
      });
    }

    // Check if user is sender or recipient (both can delete)
    if (message.senderId.toString() !== userId.toString() && message.recipientId.toString() !== userId.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this message'
      });
    }

    // Delete the message
    await Message.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: 'Message deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting message:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to delete message'
    });
  }
};

// Update/Edit a message
export const updateMessage = async (req, res) => {
  try {
    const { id } = req.params;
    const { message: newMessage } = req.body;
    const userId = req.user.userId;

    // Validate input
    if (!newMessage || !newMessage.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Message content cannot be empty'
      });
    }

    // Find message
    const message = await Message.findById(id);
    if (!message) {
      return res.status(404).json({
        success: false,
        message: 'Message not found'
      });
    }

    // Check if user is sender (only sender can edit)
    if (message.senderId.toString() !== userId.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Only the sender can edit this message'
      });
    }

    // Update message
    message.message = newMessage.trim();
    message.updatedAt = new Date();
    const updatedMessage = await message.save();

    res.status(200).json({
      success: true,
      message: 'Message updated successfully',
      data: updatedMessage
    });
  } catch (error) {
    console.error('Error updating message:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to update message'
    });
  }
};