import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { recipeAPI } from '../utils/api';
import RecipeCard from '../components/RecipeCard';
import LoadingSpinner from '../components/LoadingSpinner';
import { Search, Filter, X } from 'lucide-react';

const AllRecipes = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    search: searchParams.get('search') || '',
    cuisine: searchParams.get('cuisine') || '',
    category: searchParams.get('category') || '',
    difficulty: searchParams.get('difficulty') || '',
    ingredient: searchParams.get('ingredient') || ''
  });
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    fetchRecipes();
  }, [searchParams]);

  const fetchRecipes = async () => {
    setLoading(true);
    try {
      const params = Object.fromEntries(searchParams);
      const response = await recipeAPI.getAll(params);
      setRecipes(response.data.data);
    } catch (error) {
      console.error('Error fetching recipes:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (key, value) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    
    const params = {};
    Object.keys(newFilters).forEach(k => {
      if (newFilters[k]) params[k] = newFilters[k];
    });
    setSearchParams(params);
  };

  const clearFilters = () => {
    setFilters({
      search: '',
      cuisine: '',
      category: '',
      difficulty: '',
      ingredient: ''
    });
    setSearchParams({});
  };

  const cuisines = ['Italian', 'Chinese', 'Indian', 'Mexican', 'Japanese', 'Thai', 'French', 'Mediterranean', 'American', 'Korean'];
  const categories = ['Breakfast', 'Lunch', 'Dinner', 'Dessert', 'Snack', 'Appetizer', 'Beverage', 'Salad', 'Soup'];
  const difficulties = ['Easy', 'Medium', 'Hard'];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-display font-bold text-gray-900 dark:text-white mb-4">
            Discover Recipes
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Explore thousands of delicious recipes from our community
          </p>
        </div>

        {/* Search Bar */}
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              value={filters.search}
              onChange={(e) => handleFilterChange('search', e.target.value)}
              placeholder="Search recipes by name, description, or tags..."
              className="w-full pl-12 pr-4 py-4 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition"
            />
          </div>
        </div>

        {/* Filter Toggle Button */}
        <div className="mb-6 flex items-center justify-between">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center space-x-2 px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg hover:shadow-md transition"
          >
            <Filter size={20} />
            <span>Filters</span>
          </button>
          {Object.values(filters).some(v => v) && (
            <button
              onClick={clearFilters}
              className="flex items-center space-x-2 px-4 py-2 text-primary-500 hover:text-primary-600"
            >
              <X size={20} />
              <span>Clear All</span>
            </button>
          )}
        </div>

        {/* Filters */}
        {showFilters && (
          <div className="mb-8 p-6 bg-white dark:bg-gray-800 rounded-xl shadow-md">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Cuisine */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Cuisine
                </label>
                <select
                  value={filters.cuisine}
                  onChange={(e) => handleFilterChange('cuisine', e.target.value)}
                  className="w-full px-4 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500"
                >
                  <option value="">All Cuisines</option>
                  {cuisines.map(c => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>

              {/* Category */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Category
                </label>
                <select
                  value={filters.category}
                  onChange={(e) => handleFilterChange('category', e.target.value)}
                  className="w-full px-4 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500"
                >
                  <option value="">All Categories</option>
                  {categories.map(c => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>

              {/* Difficulty */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Difficulty
                </label>
                <select
                  value={filters.difficulty}
                  onChange={(e) => handleFilterChange('difficulty', e.target.value)}
                  className="w-full px-4 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500"
                >
                  <option value="">All Levels</option>
                  {difficulties.map(d => (
                    <option key={d} value={d}>{d}</option>
                  ))}
                </select>
              </div>

              {/* Ingredient */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Ingredient
                </label>
                <input
                  type="text"
                  value={filters.ingredient}
                  onChange={(e) => handleFilterChange('ingredient', e.target.value)}
                  placeholder="e.g., chicken, tomato"
                  className="w-full px-4 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500"
                />
              </div>
            </div>
          </div>
        )}

        {/* Results */}
        {loading ? (
          <LoadingSpinner />
        ) : recipes.length > 0 ? (
          <>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Found {recipes.length} recipe{recipes.length !== 1 ? 's' : ''}
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {recipes.map((recipe) => (
                <RecipeCard key={recipe._id} recipe={recipe} />
              ))}
            </div>
          </>
        ) : (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-2">
              No recipes found
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Try adjusting your filters or search terms
            </p>
            <button
              onClick={clearFilters}
              className="px-6 py-3 bg-primary-500 text-white rounded-full hover:bg-primary-600 transition"
            >
              Clear Filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AllRecipes;
