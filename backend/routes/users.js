const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Recipe = require('../models/Recipe');
const Notification = require('../models/Notification');
const { protect, authorize } = require('../middleware/auth');

// @route   GET /api/users/top-chefs
// @desc    Get top chefs leaderboard
// @access  Public
router.get('/top-chefs', async (req, res) => {
  try {
    const chefs = await User.find({ 
      role: { $in: ['Chef', 'Admin'] }
    })
      .select('username avatar role weeklyPoints totalPoints badges followers')
      .sort('-weeklyPoints -totalPoints')
      .limit(20);

    res.json({
      success: true,
      data: chefs
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// @route   GET /api/users/:id
// @desc    Get user profile
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
      .select('-password')
      .populate('followers', 'username avatar')
      .populate('following', 'username avatar')
      .populate('bookmarks');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Get user's recipes
    const recipes = await Recipe.find({ chef: req.params.id, isApproved: true })
      .sort('-createdAt')
      .limit(12);

    res.json({
      success: true,
      data: {
        user,
        recipes
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// @route   PUT /api/users/:id
// @desc    Update user profile
// @access  Private (Owner)
router.put('/:id', protect, async (req, res) => {
  try {
    if (req.params.id !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this profile'
      });
    }

    const { username, bio, avatar } = req.body;
    const updateData = {};
    
    if (username) updateData.username = username;
    if (bio) updateData.bio = bio;
    if (avatar) updateData.avatar = avatar;

    const user = await User.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    ).select('-password');

    res.json({
      success: true,
      data: user
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// @route   POST /api/users/:id/follow
// @desc    Follow/Unfollow a user
// @access  Private
router.post('/:id/follow', protect, async (req, res) => {
  try {
    if (req.params.id === req.user.id) {
      return res.status(400).json({
        success: false,
        message: 'You cannot follow yourself'
      });
    }

    const userToFollow = await User.findById(req.params.id);
    const currentUser = await User.findById(req.user.id);

    if (!userToFollow) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    const isFollowing = currentUser.following.includes(req.params.id);

    if (isFollowing) {
      // Unfollow
      currentUser.following = currentUser.following.filter(
        id => id.toString() !== req.params.id
      );
      userToFollow.followers = userToFollow.followers.filter(
        id => id.toString() !== req.user.id
      );
    } else {
      // Follow
      currentUser.following.push(req.params.id);
      userToFollow.followers.push(req.user.id);

      // Create notification
      await Notification.create({
        recipient: req.params.id,
        sender: req.user.id,
        type: 'follow',
        message: `${req.user.username} started following you`,
        link: `/profile/${req.user.id}`
      });
    }

    await currentUser.save();
    await userToFollow.save();

    res.json({
      success: true,
      data: {
        following: currentUser.following,
        followers: userToFollow.followers
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// @route   POST /api/users/bookmark/:recipeId
// @desc    Bookmark/Unbookmark a recipe
// @access  Private
router.post('/bookmark/:recipeId', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    const recipe = await Recipe.findById(req.params.recipeId);

    if (!recipe) {
      return res.status(404).json({
        success: false,
        message: 'Recipe not found'
      });
    }

    const bookmarkIndex = user.bookmarks.indexOf(req.params.recipeId);

    if (bookmarkIndex > -1) {
      // Remove bookmark
      user.bookmarks.splice(bookmarkIndex, 1);
    } else {
      // Add bookmark
      user.bookmarks.push(req.params.recipeId);
    }

    await user.save();

    res.json({
      success: true,
      data: user.bookmarks
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// @route   GET /api/users/:id/bookmarks
// @desc    Get user's bookmarked recipes
// @access  Private
router.get('/:id/bookmarks', protect, async (req, res) => {
  try {
    if (req.params.id !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to view these bookmarks'
      });
    }

    const user = await User.findById(req.params.id).populate({
      path: 'bookmarks',
      populate: {
        path: 'chef',
        select: 'username avatar'
      }
    });

    res.json({
      success: true,
      data: user.bookmarks
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// @route   GET /api/users/:id/notifications
// @desc    Get user notifications
// @access  Private
router.get('/:id/notifications', protect, async (req, res) => {
  try {
    if (req.params.id !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized'
      });
    }

    const notifications = await Notification.find({ recipient: req.params.id })
      .populate('sender', 'username avatar')
      .sort('-createdAt')
      .limit(50);

    res.json({
      success: true,
      data: notifications
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// @route   PUT /api/users/notifications/:id/read
// @desc    Mark notification as read
// @access  Private
router.put('/notifications/:id/read', protect, async (req, res) => {
  try {
    const notification = await Notification.findById(req.params.id);

    if (!notification) {
      return res.status(404).json({
        success: false,
        message: 'Notification not found'
      });
    }

    if (notification.recipient.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized'
      });
    }

    notification.isRead = true;
    await notification.save();

    res.json({
      success: true,
      data: notification
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

module.exports = router;
