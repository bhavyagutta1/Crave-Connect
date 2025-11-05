const mongoose = require('mongoose');

const recipeSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Recipe title is required'],
    trim: true,
    maxlength: [100, 'Title cannot exceed 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
    maxlength: [1000, 'Description cannot exceed 1000 characters']
  },
  image: {
    type: String,
    required: [true, 'Recipe image is required']
  },
  cuisine: {
    type: String,
    required: [true, 'Cuisine type is required'],
    enum: ['Italian', 'Chinese', 'Indian', 'Mexican', 'Japanese', 'Thai', 'French', 'Mediterranean', 'American', 'Korean', 'Other']
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
    enum: ['Breakfast', 'Lunch', 'Dinner', 'Dessert', 'Snack', 'Appetizer', 'Beverage', 'Salad', 'Soup']
  },
  ingredients: [{
    name: {
      type: String,
      required: true
    },
    quantity: {
      type: String,
      required: true
    }
  }],
  instructions: [{
    step: {
      type: Number,
      required: true
    },
    description: {
      type: String,
      required: true
    }
  }],
  prepTime: {
    type: Number,
    required: [true, 'Preparation time is required']
  },
  cookTime: {
    type: Number,
    required: [true, 'Cooking time is required']
  },
  servings: {
    type: Number,
    required: [true, 'Number of servings is required'],
    min: 1
  },
  difficulty: {
    type: String,
    enum: ['Easy', 'Medium', 'Hard'],
    default: 'Medium'
  },
  chef: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  likes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  ratings: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    rating: {
      type: Number,
      min: 1,
      max: 5,
      required: true
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  }],
  averageRating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5
  },
  totalRatings: {
    type: Number,
    default: 0
  },
  views: {
    type: Number,
    default: 0
  },
  isTrending: {
    type: Boolean,
    default: false
  },
  isFeatured: {
    type: Boolean,
    default: false
  },
  isApproved: {
    type: Boolean,
    default: true
  },
  tags: [String]
}, {
  timestamps: true
});

// Calculate average rating
recipeSchema.methods.calculateAverageRating = function() {
  if (this.ratings.length === 0) {
    this.averageRating = 0;
    this.totalRatings = 0;
  } else {
    const sum = this.ratings.reduce((acc, curr) => acc + curr.rating, 0);
    this.averageRating = (sum / this.ratings.length).toFixed(1);
    this.totalRatings = this.ratings.length;
  }
};

// Index for search
recipeSchema.index({ title: 'text', description: 'text', cuisine: 'text' });

module.exports = mongoose.model('Recipe', recipeSchema);
