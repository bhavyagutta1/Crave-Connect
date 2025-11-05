import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { recipeAPI } from '../utils/api';
import { useAuth } from '../context/AuthContext';
import LoadingSpinner from '../components/LoadingSpinner';
import toast from 'react-hot-toast';
import { 
  Heart, Star, Clock, Users, Eye, ChefHat, 
  MessageCircle, Send, Trash2, Edit, BookMarked 
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

const RecipeDetail = () => {
  const { id } = useParams();
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [recipe, setRecipe] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [userRating, setUserRating] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRecipe();
    fetchComments();
  }, [id]);

  const fetchRecipe = async () => {
    try {
      const response = await recipeAPI.getById(id);
      setRecipe(response.data.data);
      
      // Check if user has rated
      if (user) {
        const rating = response.data.data.ratings.find(r => r.user._id === user._id);
        if (rating) setUserRating(rating.rating);
      }
    } catch (error) {
      console.error('Error fetching recipe:', error);
      toast.error('Recipe not found');
      navigate('/recipes');
    } finally {
      setLoading(false);
    }
  };

  const fetchComments = async () => {
    try {
      const response = await recipeAPI.getComments(id);
      setComments(response.data.data);
    } catch (error) {
      console.error('Error fetching comments:', error);
    }
  };

  const handleLike = async () => {
    if (!isAuthenticated) {
      toast.error('Please login to like recipes');
      return;
    }

    try {
      const response = await recipeAPI.like(id);
      setRecipe({ ...recipe, likes: response.data.data });
      toast.success('Updated!');
    } catch (error) {
      toast.error('Failed to update like');
    }
  };

  const handleRate = async (rating) => {
    if (!isAuthenticated) {
      toast.error('Please login to rate recipes');
      return;
    }

    try {
      const response = await recipeAPI.rate(id, rating);
      setUserRating(rating);
      setRecipe({ 
        ...recipe, 
        averageRating: response.data.data.averageRating,
        totalRatings: response.data.data.totalRatings
      });
      toast.success('Rating submitted!');
    } catch (error) {
      toast.error('Failed to submit rating');
    }
  };

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      toast.error('Please login to comment');
      return;
    }

    if (!newComment.trim()) return;

    try {
      const response = await recipeAPI.addComment(id, newComment);
      setComments([response.data.data, ...comments]);
      setNewComment('');
      toast.success('Comment added!');
    } catch (error) {
      toast.error('Failed to add comment');
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this recipe?')) {
      try {
        await recipeAPI.delete(id);
        toast.success('Recipe deleted');
        navigate('/recipes');
      } catch (error) {
        toast.error('Failed to delete recipe');
      }
    }
  };

  if (loading) return <LoadingSpinner fullScreen />;
  if (!recipe) return null;

  const isOwner = user && recipe.chef._id === user._id;
  const isLiked = user && recipe.likes.includes(user._id);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hero Image */}
        <div className="relative h-96 rounded-3xl overflow-hidden mb-8 shadow-2xl">
          <img 
            src={recipe.image} 
            alt={recipe.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
          <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
            <div className="flex items-center space-x-3 mb-4">
              {recipe.isFeatured && (
                <span className="px-3 py-1 bg-accent-500 rounded-full text-sm font-semibold">
                  ⭐ Featured
                </span>
              )}
              {recipe.isTrending && (
                <span className="px-3 py-1 bg-soft-500 rounded-full text-sm font-semibold">
                  🔥 Trending
                </span>
              )}
            </div>
            <h1 className="text-4xl md:text-5xl font-display font-bold mb-4">
              {recipe.title}
            </h1>
            <p className="text-lg text-white/90 max-w-3xl">
              {recipe.description}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Stats & Actions */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-md">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center space-x-6">
                  <button
                    onClick={handleLike}
                    className="flex items-center space-x-2 hover:scale-110 transition"
                  >
                    <Heart 
                      size={24} 
                      className={isLiked ? 'fill-primary-500 text-primary-500' : 'text-gray-600 dark:text-gray-400'}
                    />
                    <span className="text-lg font-semibold">{recipe.likes.length}</span>
                  </button>
                  <div className="flex items-center space-x-2">
                    <Star size={24} className="fill-yellow-400 text-yellow-400" />
                    <span className="text-lg font-semibold">{recipe.averageRating || 0}</span>
                    <span className="text-gray-600 dark:text-gray-400">({recipe.totalRatings})</span>
                  </div>
                  <div className="flex items-center space-x-2 text-gray-600 dark:text-gray-400">
                    <Eye size={24} />
                    <span>{recipe.views}</span>
                  </div>
                </div>
                {isOwner && (
                  <div className="flex items-center space-x-3">
                    <button
                      onClick={() => navigate(`/recipes/${id}/edit`)}
                      className="flex items-center space-x-2 px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition"
                    >
                      <Edit size={18} />
                      <span>Edit</span>
                    </button>
                    <button
                      onClick={handleDelete}
                      className="flex items-center space-x-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
                    >
                      <Trash2 size={18} />
                      <span>Delete</span>
                    </button>
                  </div>
                )}
              </div>

              {/* Rate Recipe */}
              {isAuthenticated && !isOwner && (
                <div className="mt-6 pt-6 border-t dark:border-gray-700">
                  <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                    Rate this recipe:
                  </p>
                  <div className="flex items-center space-x-2">
                    {[1, 2, 3, 4, 5].map((rating) => (
                      <button
                        key={rating}
                        onClick={() => handleRate(rating)}
                        className="hover:scale-125 transition"
                      >
                        <Star 
                          size={28}
                          className={rating <= userRating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300 dark:text-gray-600'}
                        />
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Recipe Info */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-md">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center p-4 bg-primary-50 dark:bg-primary-900/20 rounded-xl">
                  <Clock className="mx-auto mb-2 text-primary-500" size={24} />
                  <p className="text-sm text-gray-600 dark:text-gray-400">Prep Time</p>
                  <p className="text-lg font-semibold text-gray-900 dark:text-white">{recipe.prepTime}m</p>
                </div>
                <div className="text-center p-4 bg-accent-50 dark:bg-accent-900/20 rounded-xl">
                  <Clock className="mx-auto mb-2 text-accent-500" size={24} />
                  <p className="text-sm text-gray-600 dark:text-gray-400">Cook Time</p>
                  <p className="text-lg font-semibold text-gray-900 dark:text-white">{recipe.cookTime}m</p>
                </div>
                <div className="text-center p-4 bg-soft-50 dark:bg-soft-900/20 rounded-xl">
                  <Users className="mx-auto mb-2 text-soft-500" size={24} />
                  <p className="text-sm text-gray-600 dark:text-gray-400">Servings</p>
                  <p className="text-lg font-semibold text-gray-900 dark:text-white">{recipe.servings}</p>
                </div>
                <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-xl">
                  <ChefHat className="mx-auto mb-2 text-green-500" size={24} />
                  <p className="text-sm text-gray-600 dark:text-gray-400">Difficulty</p>
                  <p className="text-lg font-semibold text-gray-900 dark:text-white">{recipe.difficulty}</p>
                </div>
              </div>
            </div>

            {/* Ingredients */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-md">
              <h2 className="text-2xl font-display font-bold text-gray-900 dark:text-white mb-4">
                Ingredients
              </h2>
              <ul className="space-y-3">
                {recipe.ingredients.map((ingredient, index) => (
                  <li key={index} className="flex items-start space-x-3">
                    <span className="text-primary-500 mt-1">•</span>
                    <span className="text-gray-700 dark:text-gray-300">
                      <span className="font-semibold">{ingredient.quantity}</span> {ingredient.name}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Instructions */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-md">
              <h2 className="text-2xl font-display font-bold text-gray-900 dark:text-white mb-4">
                Instructions
              </h2>
              <ol className="space-y-4">
                {recipe.instructions.sort((a, b) => a.step - b.step).map((instruction) => (
                  <li key={instruction.step} className="flex space-x-4">
                    <span className="flex-shrink-0 w-8 h-8 bg-primary-500 text-white rounded-full flex items-center justify-center font-semibold">
                      {instruction.step}
                    </span>
                    <p className="text-gray-700 dark:text-gray-300 pt-1">
                      {instruction.description}
                    </p>
                  </li>
                ))}
              </ol>
            </div>

            {/* Comments */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-md">
              <h2 className="text-2xl font-display font-bold text-gray-900 dark:text-white mb-6 flex items-center space-x-2">
                <MessageCircle size={28} />
                <span>Comments ({comments.length})</span>
              </h2>

              {/* Add Comment */}
              {isAuthenticated && (
                <form onSubmit={handleAddComment} className="mb-6">
                  <div className="flex space-x-3">
                    <img 
                      src={user.avatar} 
                      alt={user.username}
                      className="w-10 h-10 rounded-full"
                    />
                    <div className="flex-1">
                      <textarea
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        placeholder="Share your thoughts..."
                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white resize-none"
                        rows="3"
                      />
                      <button
                        type="submit"
                        className="mt-2 flex items-center space-x-2 px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition"
                      >
                        <Send size={18} />
                        <span>Post Comment</span>
                      </button>
                    </div>
                  </div>
                </form>
              )}

              {/* Comments List */}
              <div className="space-y-4">
                {comments.map((comment) => (
                  <div key={comment._id} className="flex space-x-3 p-4 bg-gray-50 dark:bg-gray-700 rounded-xl">
                    <img 
                      src={comment.user.avatar} 
                      alt={comment.user.username}
                      className="w-10 h-10 rounded-full"
                    />
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <span className="font-semibold text-gray-900 dark:text-white">
                          {comment.user.username}
                        </span>
                        {comment.user.role === 'Chef' && <span>👨‍🍳</span>}
                        <span className="text-sm text-gray-500">
                          {formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true })}
                        </span>
                      </div>
                      <p className="text-gray-700 dark:text-gray-300">{comment.text}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Chef Info */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-md">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Recipe by
              </h3>
              <Link to={`/profile/${recipe.chef._id}`} className="block group">
                <div className="flex items-center space-x-3 mb-4">
                  <img 
                    src={recipe.chef.avatar} 
                    alt={recipe.chef.username}
                    className="w-16 h-16 rounded-full border-4 border-primary-500"
                  />
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white group-hover:text-primary-500 transition">
                      {recipe.chef.username}
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {recipe.chef.role}
                    </p>
                  </div>
                </div>
                {recipe.chef.bio && (
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                    {recipe.chef.bio}
                  </p>
                )}
                <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-400">
                  <span>{recipe.chef.followers?.length || 0} Followers</span>
                </div>
              </Link>
            </div>

            {/* Tags */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-md">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Tags
              </h3>
              <div className="flex flex-wrap gap-2">
                <span className="px-3 py-1 bg-primary-100 dark:bg-primary-900 text-primary-600 dark:text-primary-300 rounded-full text-sm">
                  {recipe.cuisine}
                </span>
                <span className="px-3 py-1 bg-accent-100 dark:bg-accent-900 text-accent-600 dark:text-accent-300 rounded-full text-sm">
                  {recipe.category}
                </span>
                {recipe.tags?.map((tag, index) => (
                  <span 
                    key={index}
                    className="px-3 py-1 bg-soft-100 dark:bg-soft-900 text-soft-600 dark:text-soft-300 rounded-full text-sm"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecipeDetail;
