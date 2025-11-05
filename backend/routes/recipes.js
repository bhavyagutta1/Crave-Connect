const express = require('express');
const router = express.Router();
const Recipe = require('../models/Recipe');
const Comment = require('../models/Comment');
const Notification = require('../models/Notification');
const { protect, optionalAuth, authorize } = require('../middleware/auth');

// @route   GET /api/recipes
// @desc    Get all recipes with filters
// @access  Public
router.get('/', optionalAuth, async (req, res) => {
  try {
    const { 
      cuisine, 
      category, 
      difficulty, 
      search, 
      chef,
      ingredient,
      sort = '-createdAt',
      page = 1,
      limit = 12
    } = req.query;

    let query = { isApproved: true };

    // Filters
    if (cuisine) query.cuisine = cuisine;
    if (category) query.category = category;
    if (difficulty) query.difficulty = difficulty;
    if (chef) query.chef = chef;
    
    // Search by title, description, or text index
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { tags: { $in: [new RegExp(search, 'i')] } }
      ];
    }

    // Search by ingredient
    if (ingredient) {
      query['ingredients.name'] = { $regex: ingredient, $options: 'i' };
    }

    const recipes = await Recipe.find(query)
      .populate('chef', 'username avatar role')
      .sort(sort)
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .lean();

    const count = await Recipe.countDocuments(query);

    res.json({
      success: true,
      data: recipes,
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

// @route   GET /api/recipes/trending
// @desc    Get trending recipes
// @access  Public
router.get('/trending', async (req, res) => {
  try {
    const recipes = await Recipe.find({ isApproved: true, isTrending: true })
      .populate('chef', 'username avatar role')
      .sort('-views -likes')
      .limit(10);

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

// @route   GET /api/recipes/featured
// @desc    Get featured recipes
// @access  Public
router.get('/featured', async (req, res) => {
  try {
    const recipes = await Recipe.find({ isApproved: true, isFeatured: true })
      .populate('chef', 'username avatar role')
      .sort('-averageRating')
      .limit(6);

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

// @route   GET /api/recipes/:id
// @desc    Get single recipe
// @access  Public
router.get('/:id', optionalAuth, async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id)
      .populate('chef', 'username avatar role bio followers')
      .populate({
        path: 'ratings.user',
        select: 'username avatar'
      });

    if (!recipe) {
      return res.status(404).json({
        success: false,
        message: 'Recipe not found'
      });
    }

    // Increment views
    recipe.views += 1;
    await recipe.save();

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

// @route   POST /api/recipes
// @desc    Create a recipe
// @access  Private (Chef, Admin)
router.post('/', protect, authorize('Chef', 'Admin'), async (req, res) => {
  try {
    const recipeData = {
      ...req.body,
      chef: req.user.id
    };

    const recipe = await Recipe.create(recipeData);
    await recipe.populate('chef', 'username avatar role');

    // Award points to chef
    req.user.weeklyPoints += 10;
    req.user.totalPoints += 10;
    await req.user.save();

    res.status(201).json({
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

// @route   PUT /api/recipes/:id
// @desc    Update recipe
// @access  Private (Owner, Admin)
router.put('/:id', protect, async (req, res) => {
  try {
    let recipe = await Recipe.findById(req.params.id);

    if (!recipe) {
      return res.status(404).json({
        success: false,
        message: 'Recipe not found'
      });
    }

    // Check ownership
    if (recipe.chef.toString() !== req.user.id && req.user.role !== 'Admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this recipe'
      });
    }

    recipe = await Recipe.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    }).populate('chef', 'username avatar role');

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

// @route   DELETE /api/recipes/:id
// @desc    Delete recipe
// @access  Private (Owner, Admin)
router.delete('/:id', protect, async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id);

    if (!recipe) {
      return res.status(404).json({
        success: false,
        message: 'Recipe not found'
      });
    }

    // Check ownership
    if (recipe.chef.toString() !== req.user.id && req.user.role !== 'Admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this recipe'
      });
    }

    await recipe.deleteOne();

    res.json({
      success: true,
      message: 'Recipe deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// @route   POST /api/recipes/:id/like
// @desc    Like/Unlike a recipe
// @access  Private
router.post('/:id/like', protect, async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id);

    if (!recipe) {
      return res.status(404).json({
        success: false,
        message: 'Recipe not found'
      });
    }

    const likeIndex = recipe.likes.indexOf(req.user.id);

    if (likeIndex > -1) {
      // Unlike
      recipe.likes.splice(likeIndex, 1);
    } else {
      // Like
      recipe.likes.push(req.user.id);

      // Create notification
      if (recipe.chef.toString() !== req.user.id) {
        await Notification.create({
          recipient: recipe.chef,
          sender: req.user.id,
          type: 'like',
          message: `${req.user.username} liked your recipe "${recipe.title}"`,
          link: `/recipes/${recipe._id}`
        });
      }
    }

    await recipe.save();

    res.json({
      success: true,
      data: recipe.likes
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// @route   POST /api/recipes/:id/rate
// @desc    Rate a recipe
// @access  Private
router.post('/:id/rate', protect, async (req, res) => {
  try {
    const { rating } = req.body;
    const recipe = await Recipe.findById(req.params.id);

    if (!recipe) {
      return res.status(404).json({
        success: false,
        message: 'Recipe not found'
      });
    }

    if (rating < 1 || rating > 5) {
      return res.status(400).json({
        success: false,
        message: 'Rating must be between 1 and 5'
      });
    }

    // Check if user already rated
    const existingRating = recipe.ratings.find(
      r => r.user.toString() === req.user.id
    );

    if (existingRating) {
      existingRating.rating = rating;
    } else {
      recipe.ratings.push({
        user: req.user.id,
        rating
      });

      // Create notification
      if (recipe.chef.toString() !== req.user.id) {
        await Notification.create({
          recipient: recipe.chef,
          sender: req.user.id,
          type: 'rating',
          message: `${req.user.username} rated your recipe "${recipe.title}" ${rating} stars`,
          link: `/recipes/${recipe._id}`
        });
      }
    }

    recipe.calculateAverageRating();
    await recipe.save();

    res.json({
      success: true,
      data: {
        averageRating: recipe.averageRating,
        totalRatings: recipe.totalRatings
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// @route   GET /api/recipes/:id/comments
// @desc    Get recipe comments
// @access  Public
router.get('/:id/comments', async (req, res) => {
  try {
    const comments = await Comment.find({ 
      recipe: req.params.id,
      isApproved: true 
    })
      .populate('user', 'username avatar role')
      .sort('-createdAt');

    res.json({
      success: true,
      data: comments
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// @route   POST /api/recipes/:id/comments
// @desc    Add a comment to recipe
// @access  Private
router.post('/:id/comments', protect, async (req, res) => {
  try {
    const { text } = req.body;
    const recipe = await Recipe.findById(req.params.id);

    if (!recipe) {
      return res.status(404).json({
        success: false,
        message: 'Recipe not found'
      });
    }

    const comment = await Comment.create({
      recipe: req.params.id,
      user: req.user.id,
      text
    });

    await comment.populate('user', 'username avatar role');

    // Create notification
    if (recipe.chef.toString() !== req.user.id) {
      await Notification.create({
        recipient: recipe.chef,
        sender: req.user.id,
        type: 'comment',
        message: `${req.user.username} commented on your recipe "${recipe.title}"`,
        link: `/recipes/${recipe._id}`
      });
    }

    res.status(201).json({
      success: true,
      data: comment
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

module.exports = router;
