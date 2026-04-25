import Report from '../models/Report.js';

// Submit a new report
export const submitReport = async (req, res) => {
  try {
    const { reportedUserId, reason, details, reporterEmail } = req.body;

    // Validation
    if (!reportedUserId || !reason || !details) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields: reportedUserId, reason, details',
      });
    }

    if (!['fake_account', 'spam', 'inappropriate_content', 'harassment', 'fraud', 'illegal_activity', 'other'].includes(reason)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid reason provided',
      });
    }

    if (details.length > 500) {
      return res.status(400).json({
        success: false,
        message: 'Details cannot exceed 500 characters',
      });
    }

    // Create new report
    const report = new Report({
      reportedUserId,
      reason,
      details,
      reporterEmail: reporterEmail || 'anonymous',
      reporterId: req.user?._id || null,
    });

    await report.save();

    res.status(201).json({
      success: true,
      message: 'Report submitted successfully',
      data: report,
    });
  } catch (error) {
    console.error('Error submitting report:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to submit report',
      error: error.message,
    });
  }
};

// Get all reports (admin only)
export const getAllReports = async (req, res) => {
  try {
    const { status, page = 1, limit = 10, sortBy = 'createdAt' } = req.query;

    let query = {};
    if (status) {
      query.status = status;
    }

    const skip = (page - 1) * limit;

    const reports = await Report.find(query)
      .populate('reportedUserId', 'name email phone role')
      .populate('reporterId', 'name email')
      .populate('resolvedBy', 'name email')
      .sort({ [sortBy]: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Report.countDocuments(query);

    res.status(200).json({
      success: true,
      data: reports,
      pagination: {
        total,
        pages: Math.ceil(total / limit),
        currentPage: parseInt(page),
        limit: parseInt(limit),
      },
    });
  } catch (error) {
    console.error('Error fetching reports:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch reports',
      error: error.message,
    });
  }
};

// Get single report details (admin only)
export const getReportDetails = async (req, res) => {
  try {
    const { reportId } = req.params;

    const report = await Report.findById(reportId)
      .populate('reportedUserId', 'name email phone role location description')
      .populate('reporterId', 'name email')
      .populate('resolvedBy', 'name email');

    if (!report) {
      return res.status(404).json({
        success: false,
        message: 'Report not found',
      });
    }

    res.status(200).json({
      success: true,
      data: report,
    });
  } catch (error) {
    console.error('Error fetching report details:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch report details',
      error: error.message,
    });
  }
};

// Update report status (admin only)
export const updateReportStatus = async (req, res) => {
  try {
    const { reportId } = req.params;
    const { status, adminNotes } = req.body;

    if (!['pending', 'reviewed', 'resolved', 'dismissed'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status',
      });
    }

    const report = await Report.findByIdAndUpdate(
      reportId,
      {
        status,
        adminNotes: adminNotes || undefined,
        resolvedAt: ['resolved', 'dismissed'].includes(status) ? new Date() : undefined,
        resolvedBy: ['resolved', 'dismissed'].includes(status) ? req.user._id : undefined,
      },
      { new: true }
    );

    if (!report) {
      return res.status(404).json({
        success: false,
        message: 'Report not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Report status updated successfully',
      data: report,
    });
  } catch (error) {
    console.error('Error updating report status:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update report status',
      error: error.message,
    });
  }
};

// Delete report (admin only)
export const deleteReport = async (req, res) => {
  try {
    const { reportId } = req.params;

    const report = await Report.findByIdAndDelete(reportId);

    if (!report) {
      return res.status(404).json({
        success: false,
        message: 'Report not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Report deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting report:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete report',
      error: error.message,
    });
  }
};

// Get reports against a specific user
export const getUserReports = async (req, res) => {
  try {
    const { userId } = req.params;
    const { page = 1, limit = 10 } = req.query;

    const skip = (page - 1) * limit;

    const reports = await Report.find({ reportedUserId: userId })
      .populate('reporterId', 'name email')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Report.countDocuments({ reportedUserId: userId });

    res.status(200).json({
      success: true,
      data: reports,
      pagination: {
        total,
        pages: Math.ceil(total / limit),
        currentPage: parseInt(page),
        limit: parseInt(limit),
      },
    });
  } catch (error) {
    console.error('Error fetching user reports:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch user reports',
      error: error.message,
    });
  }
};
