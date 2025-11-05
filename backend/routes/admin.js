const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Recipe = require('../models/Recipe');
const Comment = require('../models/Comment');
const CookOff = require('../models/CookOff');
const { protect, authorize } = require('../middleware/auth');

// All routes are protected and require Admin role
router.use(protect);
router.use(authorize('Admin'));

// @route   GET /api/admin/stats
// @desc    Get dashboard statistics
// @access  Private/Admin
router.get('/stats', async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalRecipes = await Recipe.countDocuments();
    const totalComments = await Comment.countDocuments();
    const pendingRecipes = await Recipe.countDocuments({ isApproved: false });
    const pendingComments = await Comment.countDocuments({ isApproved: false });

    const recentUsers = await User.find()
      .sort('-createdAt')
      .limit(5)
      .select('username email role createdAt');

    res.json({
      success: true,
      data: {
        totalUsers,
        totalRecipes,
        totalComments,
        pendingRecipes,
        pendingComments,
        recentUsers
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// @route   GET /api/admin/users
// @desc    Get all users
// @access  Private/Admin
router.get('/users', async (req, res) => {
  try {
    const { page = 1, limit = 20, role, search } = req.query;
    let query = {};

    if (role) query.role = role;
    if (search) {
      query.$or = [
        { username: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }

    const users = await User.find(query)
      .select('-password')
      .sort('-createdAt')
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const count = await User.countDocuments(query);

    res.json({
      success: true,
      data: users,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: count,
        pages: Math.ceil(count / limit)
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// @route   PUT /api/admin/users/:id/role
// @desc    Update user role
// @access  Private/Admin
router.put('/users/:id/role', async (req, res) => {
  try {
    const { role } = req.body;

    if (!['Foodie', 'Chef', 'Admin'].includes(role)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid role'
      });
    }

    const user = await User.findByIdAndUpdate(
      req.params.id,
      { role },
      { new: true }
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

// @route   DELETE /api/admin/users/:id
// @desc    Delete user
// @access  Private/Admin
router.delete('/users/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Delete user's recipes
    await Recipe.deleteMany({ chef: req.params.id });

    // Delete user's comments
    await Comment.deleteMany({ user: req.params.id });

    await user.deleteOne();

    res.json({
      success: true,
      message: 'User and associated data deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// @route   GET /api/admin/recipes/pending
// @desc    Get pending recipes
// @access  Private/Admin
router.get('/recipes/pending', async (req, res) => {
  try {
    const recipes = await Recipe.find({ isApproved: false })
      .populate('chef', 'username email avatar')
      .sort('-createdAt');

    res.json({
      success: true,
      data: recipes
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// @route   PUT /api/admin/recipes/:id/approve
// @desc    Approve/Reject recipe
// @access  Private/Admin
router.put('/recipes/:id/approve', async (req, res) => {
  try {
    const { isApproved } = req.body;

    const recipe = await Recipe.findByIdAndUpdate(
      req.params.id,
      { isApproved },
      { new: true }
    ).populate('chef', 'username avatar');

    res.json({
      success: true,
      data: recipe
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// @route   PUT /api/admin/recipes/:id/feature
// @desc    Feature/Unfeature recipe
// @access  Private/Admin
router.put('/recipes/:id/feature', async (req, res) => {
  try {
    const { isFeatured } = req.body;

    const recipe = await Recipe.findByIdAndUpdate(
      req.params.id,
      { isFeatured },
      { new: true }
    );

    res.json({
      success: true,
      data: recipe
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// @route   GET /api/admin/comments
// @desc    Get all comments
// @access  Private/Admin
router.get('/comments', async (req, res) => {
  try {
    const { page = 1, limit = 20, pending } = req.query;
    let query = {};

    if (pending === 'true') {
      query.isApproved = false;
    }

    const comments = await Comment.find(query)
      .populate('user', 'username avatar')
      .populate('recipe', 'title')
      .sort('-createdAt')
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const count = await Comment.countDocuments(query);

    res.json({
      success: true,
      data: comments,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: count,
        pages: Math.ceil(count / limit)
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// @route   DELETE /api/admin/comments/:id
// @desc    Delete comment
// @access  Private/Admin
router.delete('/comments/:id', async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id);

    if (!comment) {
      return res.status(404).json({
        success: false,
        message: 'Comment not found'
      });
    }

    await comment.deleteOne();

    res.json({
      success: true,
      message: 'Comment deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// @route   POST /api/admin/cookoff
// @desc    Create a Cook-Off challenge
// @access  Private/Admin
router.post('/cookoff', async (req, res) => {
  try {
    const cookOff = await CookOff.create(req.body);

    res.status(201).json({
      success: true,
      data: cookOff
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// @route   GET /api/admin/cookoff
// @desc    Get all Cook-Off challenges
// @access  Private/Admin
router.get('/cookoff', async (req, res) => {
  try {
    const cookOffs = await CookOff.find()
      .populate('participants.user', 'username avatar')
      .populate('participants.recipe', 'title image')
      .populate('winner', 'username avatar')
      .sort('-createdAt');

    res.json({
      success: true,
      data: cookOffs
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// @route   POST /api/admin/reset-weekly-points
// @desc    Reset weekly points for all users
// @access  Private/Admin
router.post('/reset-weekly-points', async (req, res) => {
  try {
    await User.updateMany({}, { weeklyPoints: 0 });

    res.json({
      success: true,
      message: 'Weekly points reset successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

module.exports = router;
