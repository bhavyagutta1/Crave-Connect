import React, { useEffect, useState } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { userAPI, recipeAPI } from '../utils/api';
import { useAuth } from '../context/AuthContext';
import RecipeCard from '../components/RecipeCard';
import LoadingSpinner from '../components/LoadingSpinner';
import toast from 'react-hot-toast';
import { Users, BookMarked, Award, TrendingUp, UserPlus, UserMinus } from 'lucide-react';

const Profile = () => {
  const { id } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const { user: currentUser } = useAuth();
  const [profile, setProfile] = useState(null);
  const [recipes, setRecipes] = useState([]);
  const [bookmarks, setBookmarks] = useState([]);
  const [activeTab, setActiveTab] = useState(searchParams.get('tab') || 'recipes');
  const [loading, setLoading] = useState(true);
  const [isFollowing, setIsFollowing] = useState(false);

  useEffect(() => {
    fetchProfile();
  }, [id]);

  useEffect(() => {
    if (activeTab === 'bookmarks' && currentUser && id === currentUser._id) {
      fetchBookmarks();
    }
  }, [activeTab, id, currentUser]);

  const fetchProfile = async () => {
    try {
      const response = await userAPI.getProfile(id);
      setProfile(response.data.data.user);
      setRecipes(response.data.data.recipes);
      
      if (currentUser) {
        setIsFollowing(response.data.data.user.followers.some(f => f._id === currentUser._id));
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
      toast.error('Profile not found');
    } finally {
      setLoading(false);
    }
  };

  const fetchBookmarks = async () => {
    try {
      const response = await userAPI.getBookmarks(id);
      setBookmarks(response.data.data);
    } catch (error) {
      console.error('Error fetching bookmarks:', error);
    }
  };

  const handleFollow = async () => {
    try {
      await userAPI.follow(id);
      setIsFollowing(!isFollowing);
      setProfile({
        ...profile,
        followers: isFollowing 
          ? profile.followers.filter(f => f._id !== currentUser._id)
          : [...profile.followers, { _id: currentUser._id }]
      });
      toast.success(isFollowing ? 'Unfollowed' : 'Following');
    } catch (error) {
      toast.error('Failed to update follow status');
    }
  };

  if (loading) return <LoadingSpinner fullScreen />;
  if (!profile) return null;

  const isOwnProfile = currentUser && currentUser._id === id;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Profile Header */}
        <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl p-8 mb-8">
          <div className="flex flex-col md:flex-row items-center md:items-start space-y-6 md:space-y-0 md:space-x-8">
            {/* Avatar */}
            <img 
              src={profile.avatar}
              alt={profile.username}
              className="w-32 h-32 rounded-full border-4 border-primary-500 shadow-lg"
            />

            {/* Info */}
            <div className="flex-1 text-center md:text-left">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
                <div>
                  <h1 className="text-3xl font-display font-bold text-gray-900 dark:text-white mb-2 flex items-center justify-center md:justify-start space-x-2">
                    <span>{profile.username}</span>
                    {profile.role === 'Chef' && <span>👨‍🍳</span>}
                    {profile.role === 'Admin' && <span>👑</span>}
                  </h1>
                  <p className="text-gray-600 dark:text-gray-400">{profile.role}</p>
                </div>
                {!isOwnProfile && currentUser && (
                  <button
                    onClick={handleFollow}
                    className={`mt-4 md:mt-0 flex items-center space-x-2 px-6 py-3 rounded-full font-semibold transition ${
                      isFollowing
                        ? 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300'
                        : 'bg-gradient-to-r from-primary-500 to-accent-500 text-white hover:shadow-lg'
                    }`}
                  >
                    {isFollowing ? <UserMinus size={20} /> : <UserPlus size={20} />}
                    <span>{isFollowing ? 'Unfollow' : 'Follow'}</span>
                  </button>
                )}
              </div>

              {profile.bio && (
                <p className="text-gray-700 dark:text-gray-300 mb-6 max-w-2xl">
                  {profile.bio}
                </p>
              )}

              {/* Stats */}
              <div className="flex flex-wrap justify-center md:justify-start gap-6 mb-6">
                <div className="text-center">
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {recipes.length}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Recipes</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {profile.followers?.length || 0}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Followers</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {profile.following?.length || 0}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Following</p>
                </div>
                {(profile.role === 'Chef' || profile.role === 'Admin') && (
                  <>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-primary-500">
                        {profile.weeklyPoints}
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Weekly Points</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-accent-500">
                        {profile.totalPoints}
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Total Points</p>
                    </div>
                  </>
                )}
              </div>

              {/* Badges */}
              {profile.badges && profile.badges.length > 0 && (
                <div>
                  <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                    Badges & Achievements
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {profile.badges.map((badge, index) => (
                      <span 
                        key={index}
                        className="px-4 py-2 bg-gradient-to-r from-accent-100 to-primary-100 dark:from-accent-900 dark:to-primary-900 rounded-full text-sm font-semibold"
                        title={badge.name}
                      >
                        {badge.icon} {badge.name}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-md mb-8">
          <div className="flex border-b dark:border-gray-700">
            <button
              onClick={() => setActiveTab('recipes')}
              className={`flex-1 flex items-center justify-center space-x-2 py-4 font-semibold transition ${
                activeTab === 'recipes'
                  ? 'text-primary-500 border-b-2 border-primary-500'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              <Award size={20} />
              <span>Recipes</span>
            </button>
            {isOwnProfile && (
              <button
                onClick={() => setActiveTab('bookmarks')}
                className={`flex-1 flex items-center justify-center space-x-2 py-4 font-semibold transition ${
                  activeTab === 'bookmarks'
                    ? 'text-primary-500 border-b-2 border-primary-500'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                }`}
              >
                <BookMarked size={20} />
                <span>Bookmarks</span>
              </button>
            )}
            <button
              onClick={() => setActiveTab('followers')}
              className={`flex-1 flex items-center justify-center space-x-2 py-4 font-semibold transition ${
                activeTab === 'followers'
                  ? 'text-primary-500 border-b-2 border-primary-500'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              <Users size={20} />
              <span>Followers</span>
            </button>
            <button
              onClick={() => setActiveTab('following')}
              className={`flex-1 flex items-center justify-center space-x-2 py-4 font-semibold transition ${
                activeTab === 'following'
                  ? 'text-primary-500 border-b-2 border-primary-500'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              <TrendingUp size={20} />
              <span>Following</span>
            </button>
          </div>
        </div>

        {/* Tab Content */}
        <div>
          {activeTab === 'recipes' && (
            <div>
              {recipes.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {recipes.map((recipe) => (
                    <RecipeCard key={recipe._id} recipe={recipe} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-16 bg-white dark:bg-gray-800 rounded-2xl">
                  <div className="text-6xl mb-4">📝</div>
                  <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-2">
                    No recipes yet
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    {isOwnProfile ? 'Start sharing your culinary creations!' : 'This chef hasn\'t posted any recipes yet.'}
                  </p>
                </div>
              )}
            </div>
          )}

          {activeTab === 'bookmarks' && (
            <div>
              {bookmarks.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {bookmarks.map((recipe) => (
                    <RecipeCard key={recipe._id} recipe={recipe} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-16 bg-white dark:bg-gray-800 rounded-2xl">
                  <div className="text-6xl mb-4">🔖</div>
                  <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-2">
                    No bookmarks yet
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    Save your favorite recipes to find them easily later!
                  </p>
                </div>
              )}
            </div>
          )}

          {activeTab === 'followers' && (
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6">
              {profile.followers && profile.followers.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {profile.followers.map((follower) => (
                    <a
                      key={follower._id}
                      href={`/profile/${follower._id}`}
                      className="flex items-center space-x-3 p-4 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition"
                    >
                      <img 
                        src={follower.avatar}
                        alt={follower.username}
                        className="w-12 h-12 rounded-full"
                      />
                      <div>
                        <p className="font-semibold text-gray-900 dark:text-white">
                          {follower.username}
                        </p>
                      </div>
                    </a>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-600 dark:text-gray-400">No followers yet</p>
                </div>
              )}
            </div>
          )}

          {activeTab === 'following' && (
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6">
              {profile.following && profile.following.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {profile.following.map((following) => (
                    <a
                      key={following._id}
                      href={`/profile/${following._id}`}
                      className="flex items-center space-x-3 p-4 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition"
                    >
                      <img 
                        src={following.avatar}
                        alt={following.username}
                        className="w-12 h-12 rounded-full"
                      />
                      <div>
                        <p className="font-semibold text-gray-900 dark:text-white">
                          {following.username}
                        </p>
                      </div>
                    </a>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-600 dark:text-gray-400">Not following anyone yet</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
