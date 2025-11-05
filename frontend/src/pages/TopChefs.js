import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { userAPI } from '../utils/api';
import LoadingSpinner from '../components/LoadingSpinner';
import { Trophy, TrendingUp, Users, Award } from 'lucide-react';

const TopChefs = () => {
  const [chefs, setChefs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTopChefs();
  }, []);

  const fetchTopChefs = async () => {
    try {
      const response = await userAPI.getTopChefs();
      setChefs(response.data.data);
    } catch (error) {
      console.error('Error fetching top chefs:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <LoadingSpinner fullScreen />;

  const getMedalEmoji = (index) => {
    if (index === 0) return '🥇';
    if (index === 1) return '🥈';
    if (index === 2) return '🥉';
    return `#${index + 1}`;
  };

  const getMedalColor = (index) => {
    if (index === 0) return 'from-yellow-400 to-yellow-600';
    if (index === 1) return 'from-gray-300 to-gray-500';
    if (index === 2) return 'from-orange-400 to-orange-600';
    return 'from-primary-500 to-accent-500';
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <Trophy className="text-yellow-500" size={48} />
            <h1 className="text-4xl md:text-5xl font-display font-bold text-gray-900 dark:text-white">
              Top Chefs Leaderboard
            </h1>
          </div>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            Weekly rankings based on community engagement and recipe quality
          </p>
        </div>

        {/* Top 3 Podium */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {chefs.slice(0, 3).map((chef, index) => {
            const positions = [1, 0, 2]; // Center, Left, Right
            const actualIndex = positions.indexOf(index);
            
            return (
              <Link
                key={chef._id}
                to={`/profile/${chef._id}`}
                className={`bg-white dark:bg-gray-800 rounded-3xl shadow-xl p-8 text-center transform transition hover:scale-105 ${
                  index === 0 ? 'md:order-2 md:scale-110' : index === 1 ? 'md:order-1' : 'md:order-3'
                }`}
              >
                <div className={`w-24 h-24 mx-auto mb-4 rounded-full bg-gradient-to-br ${getMedalColor(index)} flex items-center justify-center text-4xl font-bold text-white shadow-lg`}>
                  {getMedalEmoji(index)}
                </div>
                <img 
                  src={chef.avatar}
                  alt={chef.username}
                  className="w-24 h-24 mx-auto rounded-full border-4 border-primary-500 mb-4 -mt-16"
                />
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                  {chef.username}
                </h2>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  {chef.role}
                </p>
                <div className="flex items-center justify-center space-x-6 mb-4">
                  <div className="text-center">
                    <div className="flex items-center justify-center space-x-1 text-primary-500 font-bold text-xl">
                      <TrendingUp size={20} />
                      <span>{chef.weeklyPoints}</span>
                    </div>
                    <p className="text-xs text-gray-500">Weekly Points</p>
                  </div>
                  <div className="text-center">
                    <div className="flex items-center justify-center space-x-1 text-accent-500 font-bold text-xl">
                      <Users size={20} />
                      <span>{chef.followers?.length || 0}</span>
                    </div>
                    <p className="text-xs text-gray-500">Followers</p>
                  </div>
                </div>
                {chef.badges && chef.badges.length > 0 && (
                  <div className="flex flex-wrap justify-center gap-2">
                    {chef.badges.slice(0, 3).map((badge, idx) => (
                      <span 
                        key={idx}
                        className="px-3 py-1 bg-gradient-to-r from-accent-100 to-primary-100 dark:from-accent-900 dark:to-primary-900 text-xs rounded-full"
                        title={badge.name}
                      >
                        {badge.icon}
                      </span>
                    ))}
                  </div>
                )}
              </Link>
            );
          })}
        </div>

        {/* Rest of Leaderboard */}
        <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl overflow-hidden">
          <div className="bg-gradient-to-r from-primary-500 to-accent-500 text-white p-6">
            <h2 className="text-2xl font-display font-bold">Full Rankings</h2>
          </div>
          <div className="divide-y dark:divide-gray-700">
            {chefs.map((chef, index) => (
              <Link
                key={chef._id}
                to={`/profile/${chef._id}`}
                className="flex items-center space-x-4 p-6 hover:bg-gray-50 dark:hover:bg-gray-700 transition"
              >
                <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${getMedalColor(index)} flex items-center justify-center text-white font-bold`}>
                  {index < 3 ? getMedalEmoji(index) : index + 1}
                </div>
                <img 
                  src={chef.avatar}
                  alt={chef.username}
                  className="w-16 h-16 rounded-full border-2 border-primary-500"
                />
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center space-x-2">
                    <span>{chef.username}</span>
                    <span>👨‍🍳</span>
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {chef.role}
                  </p>
                  {chef.badges && chef.badges.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-2">
                      {chef.badges.slice(0, 4).map((badge, idx) => (
                        <span 
                          key={idx}
                          className="text-xs"
                          title={badge.name}
                        >
                          {badge.icon}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
                <div className="text-right space-y-2">
                  <div className="flex items-center space-x-2 text-primary-500 font-bold">
                    <TrendingUp size={18} />
                    <span>{chef.weeklyPoints} pts</span>
                  </div>
                  <div className="flex items-center space-x-2 text-gray-600 dark:text-gray-400 text-sm">
                    <Users size={16} />
                    <span>{chef.followers?.length || 0} followers</span>
                  </div>
                  <div className="flex items-center space-x-2 text-gray-600 dark:text-gray-400 text-sm">
                    <Award size={16} />
                    <span>{chef.totalPoints} total</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Info Box */}
        <div className="mt-8 bg-gradient-to-br from-primary-50 to-accent-50 dark:from-gray-800 dark:to-gray-700 rounded-2xl p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
            How Points Are Earned
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm text-gray-700 dark:text-gray-300">
            <div className="flex items-start space-x-2">
              <span className="text-2xl">📝</span>
              <div>
                <p className="font-semibold">Post Recipe</p>
                <p className="text-xs">+10 points</p>
              </div>
            </div>
            <div className="flex items-start space-x-2">
              <span className="text-2xl">❤️</span>
              <div>
                <p className="font-semibold">Get Likes</p>
                <p className="text-xs">+2 points each</p>
              </div>
            </div>
            <div className="flex items-start space-x-2">
              <span className="text-2xl">⭐</span>
              <div>
                <p className="font-semibold">Get 5-Star Rating</p>
                <p className="text-xs">+5 points</p>
              </div>
            </div>
            <div className="flex items-start space-x-2">
              <span className="text-2xl">💬</span>
              <div>
                <p className="font-semibold">Get Comments</p>
                <p className="text-xs">+1 point each</p>
              </div>
            </div>
          </div>
          <p className="mt-4 text-xs text-gray-600 dark:text-gray-400">
            * Weekly points reset every Monday. Keep creating amazing recipes to stay on top!
          </p>
        </div>
      </div>
    </div>
  );
};

export default TopChefs;
