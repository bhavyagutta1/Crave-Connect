import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, Star, Clock, Users, Eye } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { recipeAPI } from '../utils/api';
import toast from 'react-hot-toast';

const RecipeCard = ({ recipe, onLikeUpdate }) => {
  const { user, isAuthenticated } = useAuth();
  const [isLiked, setIsLiked] = React.useState(
    recipe.likes?.includes(user?._id) || false
  );
  const [likesCount, setLikesCount] = React.useState(recipe.likes?.length || 0);

  const handleLike = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      toast.error('Please login to like recipes');
      return;
    }

    try {
      const response = await recipeAPI.like(recipe._id);
      setIsLiked(!isLiked);
      setLikesCount(response.data.data.length);
      if (onLikeUpdate) onLikeUpdate(recipe._id, response.data.data);
      toast.success(isLiked ? 'Removed from likes' : 'Added to likes');
    } catch (error) {
      toast.error('Failed to update like');
    }
  };

  return (
    <Link 
      to={`/recipes/${recipe._id}`}
      className="group bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 card-hover"
    >
      {/* Image */}
      <div className="relative h-48 overflow-hidden">
        <img 
          src={recipe.image} 
          alt={recipe.title}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
        />
        {recipe.isFeatured && (
          <div className="absolute top-3 left-3 bg-gradient-to-r from-accent-500 to-primary-500 text-white px-3 py-1 rounded-full text-xs font-semibold">
            ⭐ Featured
          </div>
        )}
        {recipe.isTrending && (
          <div className="absolute top-3 right-3 bg-soft-500 text-white px-3 py-1 rounded-full text-xs font-semibold">
            🔥 Trending
          </div>
        )}
        <button
          onClick={handleLike}
          className="absolute bottom-3 right-3 bg-white dark:bg-gray-800 p-2 rounded-full shadow-lg hover:scale-110 transition-transform"
        >
          <Heart 
            size={20} 
            className={isLiked ? 'fill-primary-500 text-primary-500' : 'text-gray-600 dark:text-gray-400'}
          />
        </button>
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Title */}
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 line-clamp-2 group-hover:text-primary-500 transition">
          {recipe.title}
        </h3>

        {/* Chef Info */}
        <div className="flex items-center space-x-2 mb-3">
          <img 
            src={recipe.chef?.avatar} 
            alt={recipe.chef?.username}
            className="w-6 h-6 rounded-full"
          />
          <span className="text-sm text-gray-600 dark:text-gray-400">
            by {recipe.chef?.username}
          </span>
          {recipe.chef?.role === 'Chef' && (
            <span className="text-xs">👨‍🍳</span>
          )}
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-2 mb-3">
          <span className="px-2 py-1 bg-primary-100 dark:bg-primary-900 text-primary-600 dark:text-primary-300 text-xs rounded-full">
            {recipe.cuisine}
          </span>
          <span className="px-2 py-1 bg-accent-100 dark:bg-accent-900 text-accent-600 dark:text-accent-300 text-xs rounded-full">
            {recipe.category}
          </span>
          <span className="px-2 py-1 bg-soft-100 dark:bg-soft-900 text-soft-600 dark:text-soft-300 text-xs rounded-full">
            {recipe.difficulty}
          </span>
        </div>

        {/* Stats */}
        <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-1">
              <Heart size={16} />
              <span>{likesCount}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Star size={16} className="fill-yellow-400 text-yellow-400" />
              <span>{recipe.averageRating || 0}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Eye size={16} />
              <span>{recipe.views}</span>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-1">
              <Clock size={16} />
              <span>{recipe.prepTime + recipe.cookTime}m</span>
            </div>
            <div className="flex items-center space-x-1">
              <Users size={16} />
              <span>{recipe.servings}</span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default RecipeCard;
