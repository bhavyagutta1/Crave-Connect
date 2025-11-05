const express = require('express');
const router = express.Router();
const ChatMessage = require('../models/ChatMessage');
const { protect } = require('../middleware/auth');

// @route   GET /api/chat/messages
// @desc    Get chat messages
// @access  Private
router.get('/messages', protect, async (req, res) => {
  try {
    const { room = 'general', limit = 50 } = req.query;

    const messages = await ChatMessage.find({ 
      room,
      isDeleted: false 
    })
      .sort('-createdAt')
      .limit(parseInt(limit))
      .populate('user', 'username avatar role');

    res.json({
      success: true,
      data: messages.reverse()
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// @route   POST /api/chat/messages
// @desc    Send a chat message
// @access  Private
router.post('/messages', protect, async (req, res) => {
  try {
    const { message, room = 'general' } = req.body;

    const chatMessage = await ChatMessage.create({
      user: req.user.id,
      username: req.user.username,
      avatar: req.user.avatar,
      message,
      room
    });

    await chatMessage.populate('user', 'username avatar role');

    res.status(201).json({
      success: true,
      data: chatMessage
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// @route   DELETE /api/chat/messages/:id
// @desc    Delete a chat message
// @access  Private
router.delete('/messages/:id', protect, async (req, res) => {
  try {
    const message = await ChatMessage.findById(req.params.id);

    if (!message) {
      return res.status(404).json({
        success: false,
        message: 'Message not found'
      });
    }

    // Only message owner or admin can delete
    if (message.user.toString() !== req.user.id && req.user.role !== 'Admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this message'
      });
    }

    message.isDeleted = true;
    await message.save();

    res.json({
      success: true,
      message: 'Message deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

module.exports = router;
