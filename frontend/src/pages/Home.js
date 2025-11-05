import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { recipeAPI, userAPI } from '../utils/api';
import RecipeCard from '../components/RecipeCard';
import LoadingSpinner from '../components/LoadingSpinner';
import { ChefHat, TrendingUp, Star, ArrowRight, Users } from 'lucide-react';

const Home = () => {
  const [trending, setTrending] = useState([]);
  const [featured, setFeatured] = useState([]);
  const [topChefs, setTopChefs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [trendingRes, featuredRes, chefsRes] = await Promise.all([
        recipeAPI.getTrending(),
        recipeAPI.getFeatured(),
        userAPI.getTopChefs()
      ]);
      setTrending(trendingRes.data.data);
      setFeatured(featuredRes.data.data);
      setTopChefs(chefsRes.data.data.slice(0, 6));
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <LoadingSpinner fullScreen />;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary-500 via-accent-500 to-soft-500 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center animate-fade-in">
            <h1 className="text-5xl md:text-6xl font-display font-bold mb-6">
              Welcome to CraveConnect
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-white/90">
              Share, Discover, and Connect Through Food
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link 
                to="/recipes"
                className="px-8 py-3 bg-white text-primary-500 rounded-full font-semibold hover:shadow-xl transition transform hover:scale-105"
              >
                Explore Recipes
              </Link>
              <Link 
                to="/register"
                className="px-8 py-3 bg-transparent border-2 border-white text-white rounded-full font-semibold hover:bg-white hover:text-primary-500 transition"
              >
                Join Community
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-12 bg-white dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-display font-bold text-center mb-8 text-gray-900 dark:text-white">
            Browse by Category
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {['Breakfast', 'Lunch', 'Dinner', 'Dessert', 'Snack'].map((category) => (
              <Link
                key={category}
                to={`/recipes?category=${category}`}
                className="p-6 bg-gradient-to-br from-primary-50 to-accent-50 dark:from-gray-700 dark:to-gray-600 rounded-2xl text-center hover:shadow-lg transition transform hover:scale-105"
              >
                <div className="text-4xl mb-2">
                  {category === 'Breakfast' && '🍳'}
                  {category === 'Lunch' && '🥗'}
                  {category === 'Dinner' && '🍽️'}
                  {category === 'Dessert' && '🍰'}
                  {category === 'Snack' && '🍿'}
                </div>
                <h3 className="font-semibold text-gray-900 dark:text-white">{category}</h3>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Trending Recipes */}
      <section className="py-16 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center space-x-3">
              <TrendingUp className="text-primary-500" size={32} />
              <h2 className="text-3xl font-display font-bold text-gray-900 dark:text-white">
                Trending Recipes
              </h2>
            </div>
            <Link 
              to="/recipes?sort=trending"
              className="flex items-center space-x-2 text-primary-500 hover:text-primary-600 font-semibold"
            >
              <span>View All</span>
              <ArrowRight size={20} />
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {trending.map((recipe) => (
              <RecipeCard key={recipe._id} recipe={recipe} />
            ))}
          </div>
        </div>
      </section>

      {/* Featured Recipes */}
      <section className="py-16 bg-white dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center space-x-3">
              <Star className="text-accent-500 fill-accent-500" size={32} />
              <h2 className="text-3xl font-display font-bold text-gray-900 dark:text-white">
                Featured Recipes
              </h2>
            </div>
            <Link 
              to="/recipes?featured=true"
              className="flex items-center space-x-2 text-accent-500 hover:text-accent-600 font-semibold"
            >
              <span>View All</span>
              <ArrowRight size={20} />
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featured.map((recipe) => (
              <RecipeCard key={recipe._id} recipe={recipe} />
            ))}
          </div>
        </div>
      </section>

      {/* Top Chefs */}
      <section className="py-16 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center space-x-3">
              <ChefHat className="text-soft-500" size={32} />
              <h2 className="text-3xl font-display font-bold text-gray-900 dark:text-white">
                Top Chefs This Week
              </h2>
            </div>
            <Link 
              to="/top-chefs"
              className="flex items-center space-x-2 text-soft-500 hover:text-soft-600 font-semibold"
            >
              <span>View Leaderboard</span>
              <ArrowRight size={20} />
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {topChefs.map((chef, index) => (
              <Link
                key={chef._id}
                to={`/profile/${chef._id}`}
                className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-md hover:shadow-xl transition card-hover"
              >
                <div className="flex items-center space-x-4">
                  <div className="relative">
                    <img 
                      src={chef.avatar} 
                      alt={chef.username}
                      className="w-16 h-16 rounded-full border-4 border-primary-500"
                    />
                    {index < 3 && (
                      <div className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-r from-accent-500 to-primary-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                        {index + 1}
                      </div>
                    )}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 dark:text-white flex items-center space-x-2">
                      <span>{chef.username}</span>
                      <span>👨‍🍳</span>
                    </h3>
                    <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-400 mt-1">
                      <div className="flex items-center space-x-1">
                        <TrendingUp size={14} />
                        <span>{chef.weeklyPoints} pts</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Users size={14} />
                        <span>{chef.followers?.length || 0}</span>
                      </div>
                    </div>
                  </div>
                </div>
                {chef.badges && chef.badges.length > 0 && (
                  <div className="mt-4 flex flex-wrap gap-2">
                    {chef.badges.slice(0, 3).map((badge, idx) => (
                      <span 
                        key={idx}
                        className="px-2 py-1 bg-gradient-to-r from-accent-100 to-primary-100 dark:from-accent-900 dark:to-primary-900 text-xs rounded-full"
                      >
                        {badge.icon} {badge.name}
                      </span>
                    ))}
                  </div>
                )}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-primary-500 to-accent-500 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-display font-bold mb-6">
            Ready to Share Your Culinary Creations?
          </h2>
          <p className="text-xl mb-8 text-white/90">
            Join thousands of food lovers and start sharing your favorite recipes today!
          </p>
          <Link 
            to="/register"
            className="inline-block px-8 py-4 bg-white text-primary-500 rounded-full font-semibold text-lg hover:shadow-xl transition transform hover:scale-105"
          >
            Get Started Now
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;
