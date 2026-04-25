import Inquiry from '../models/Inquiry.js';
import Property from '../models/Property.js';
import User from '../models/User.js';
import { sendNewInquiryEmail } from '../services/mailService.js';

export const createInquiry = async (req, res) => {
  try {
    const { propertyId, message } = req.body;

    if (!propertyId || !message) {
      return res.status(400).json({ message: 'Please provide all required fields' });
    }

    const property = await Property.findById(propertyId);
    if (!property) {
      return res.status(404).json({ message: 'Property not found' });
    }

    let inquiry = await Inquiry.findOne({
      propertyId,
      participants: { $all: [req.user.userId, property.ownerId] },
    });

    if (!inquiry) {
      inquiry = await Inquiry.create({
        propertyId,
        participants: [req.user.userId, property.ownerId],
        messages: [
          {
            fromId: req.user.userId,
            message,
          },
        ],
      });
    } else {
      inquiry.messages.push({
        fromId: req.user.userId,
        message,
      });
      await inquiry.save();
    }

    // Send email to property owner
    const owner = await User.findById(property.ownerId);
    const buyer = await User.findById(req.user.userId);
    await sendNewInquiryEmail(owner.email, property.title, buyer.name);

    res.status(201).json({
      success: true,
      message: 'Inquiry created successfully',
      data: inquiry,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getInquiries = async (req, res) => {
  try {
    const { page, limit } = req.query;
    const pageNumber = parseInt(page) || 1;
    const pageLimit = parseInt(limit) || 10;
    const skip = (pageNumber - 1) * pageLimit;

    const inquiries = await Inquiry.find({
      participants: req.user.userId,
    })
      .populate('propertyId')
      .populate('participants', 'name email phone avatarUrl')
      .skip(skip)
      .limit(pageLimit)
      .sort({ updatedAt: -1 });

    const total = await Inquiry.countDocuments({ participants: req.user.userId });

    res.status(200).json({
      success: true,
      data: inquiries,
      pagination: {
        page: pageNumber,
        limit: pageLimit,
        total,
        pages: Math.ceil(total / pageLimit),
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getInquiryById = async (req, res) => {
  try {
    const inquiry = await Inquiry.findById(req.params.id)
      .populate('propertyId')
      .populate('participants', 'name email phone avatarUrl');

    if (!inquiry) {
      return res.status(404).json({ message: 'Inquiry not found' });
    }

    if (!inquiry.participants.some((p) => p._id.toString() === req.user.userId)) {
      return res.status(403).json({ message: 'Not authorized to view this inquiry' });
    }

    res.status(200).json({
      success: true,
      data: inquiry,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const sendMessage = async (req, res) => {
  try {
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({ message: 'Please provide a message' });
    }

    const inquiry = await Inquiry.findById(req.params.id);

    if (!inquiry) {
      return res.status(404).json({ message: 'Inquiry not found' });
    }

    if (!inquiry.participants.some((p) => p.toString() === req.user.userId)) {
      return res.status(403).json({ message: 'Not authorized to send message in this inquiry' });
    }

    inquiry.messages.push({
      fromId: req.user.userId,
      message,
    });

    await inquiry.save();

    res.status(200).json({
      success: true,
      message: 'Message sent successfully',
      data: inquiry,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const closeInquiry = async (req, res) => {
  try {
    const inquiry = await Inquiry.findById(req.params.id);

    if (!inquiry) {
      return res.status(404).json({ message: 'Inquiry not found' });
    }

    if (!inquiry.participants.some((p) => p.toString() === req.user.userId)) {
      return res.status(403).json({ message: 'Not authorized to close this inquiry' });
    }

    inquiry.status = 'closed';
    inquiry.closedAt = new Date();
    await inquiry.save();

    res.status(200).json({
      success: true,
      message: 'Inquiry closed successfully',
      data: inquiry,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
