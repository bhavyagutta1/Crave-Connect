import React, { useEffect, useState } from 'react';
import { adminAPI } from '../utils/api';
import LoadingSpinner from '../components/LoadingSpinner';
import toast from 'react-hot-toast';
import { Users, FileText, MessageSquare, Shield, TrendingUp, CheckCircle, XCircle, Trash2, Star } from 'lucide-react';

const AdminPanel = () => {
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [pendingRecipes, setPendingRecipes] = useState([]);
  const [comments, setComments] = useState([]);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
    fetchPendingRecipes();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await adminAPI.getStats();
      setStats(response.data.data);
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await adminAPI.getUsers({});
      setUsers(response.data.data);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const fetchPendingRecipes = async () => {
    try {
      const response = await adminAPI.getPendingRecipes();
      setPendingRecipes(response.data.data);
    } catch (error) {
      console.error('Error fetching pending recipes:', error);
    }
  };

  const fetchComments = async () => {
    try {
      const response = await adminAPI.getComments({});
      setComments(response.data.data);
    } catch (error) {
      console.error('Error fetching comments:', error);
    }
  };

  const handleApproveRecipe = async (id, isApproved) => {
    try {
      await adminAPI.approveRecipe(id, isApproved);
      toast.success(isApproved ? 'Recipe approved' : 'Recipe rejected');
      fetchPendingRecipes();
    } catch (error) {
      toast.error('Failed to update recipe');
    }
  };

  const handleFeatureRecipe = async (id, isFeatured) => {
    try {
      await adminAPI.featureRecipe(id, isFeatured);
      toast.success(isFeatured ? 'Recipe featured' : 'Recipe unfeatured');
    } catch (error) {
      toast.error('Failed to update recipe');
    }
  };

  const handleDeleteUser = async (id) => {
    if (window.confirm('Are you sure you want to delete this user and all their data?')) {
      try {
        await adminAPI.deleteUser(id);
        toast.success('User deleted');
        fetchUsers();
      } catch (error) {
        toast.error('Failed to delete user');
      }
    }
  };

  const handleDeleteComment = async (id) => {
    if (window.confirm('Are you sure you want to delete this comment?')) {
      try {
        await adminAPI.deleteComment(id);
        toast.success('Comment deleted');
        fetchComments();
      } catch (error) {
        toast.error('Failed to delete comment');
      }
    }
  };

  const handleUpdateRole = async (id, role) => {
    try {
      await adminAPI.updateUserRole(id, role);
      toast.success('Role updated');
      fetchUsers();
    } catch (error) {
      toast.error('Failed to update role');
    }
  };

  const handleResetWeeklyPoints = async () => {
    if (window.confirm('Are you sure you want to reset all weekly points?')) {
      try {
        await adminAPI.resetWeeklyPoints();
        toast.success('Weekly points reset');
        fetchStats();
      } catch (error) {
        toast.error('Failed to reset points');
      }
    }
  };

  useEffect(() => {
    if (activeTab === 'users') fetchUsers();
    if (activeTab === 'comments') fetchComments();
  }, [activeTab]);

  if (loading) return <LoadingSpinner fullScreen />;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-3 mb-4">
            <Shield className="text-primary-500" size={40} />
            <h1 className="text-4xl font-display font-bold text-gray-900 dark:text-white">
              Admin Panel
            </h1>
          </div>
          <p className="text-gray-600 dark:text-gray-400">
            Manage users, recipes, and community content
          </p>
        </div>

        {/* Stats Cards */}
        {activeTab === 'dashboard' && stats && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-md">
              <div className="flex items-center justify-between mb-4">
                <Users className="text-primary-500" size={32} />
                <span className="text-3xl font-bold text-gray-900 dark:text-white">
                  {stats.totalUsers}
                </span>
              </div>
              <p className="text-gray-600 dark:text-gray-400">Total Users</p>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-md">
              <div className="flex items-center justify-between mb-4">
                <FileText className="text-accent-500" size={32} />
                <span className="text-3xl font-bold text-gray-900 dark:text-white">
                  {stats.totalRecipes}
                </span>
              </div>
              <p className="text-gray-600 dark:text-gray-400">Total Recipes</p>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-md">
              <div className="flex items-center justify-between mb-4">
                <MessageSquare className="text-soft-500" size={32} />
                <span className="text-3xl font-bold text-gray-900 dark:text-white">
                  {stats.totalComments}
                </span>
              </div>
              <p className="text-gray-600 dark:text-gray-400">Total Comments</p>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-md">
              <div className="flex items-center justify-between mb-4">
                <TrendingUp className="text-green-500" size={32} />
                <span className="text-3xl font-bold text-gray-900 dark:text-white">
                  {stats.pendingRecipes}
                </span>
              </div>
              <p className="text-gray-600 dark:text-gray-400">Pending Approval</p>
            </div>
          </div>
        )}

        {/* Tabs */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-md mb-8">
          <div className="flex border-b dark:border-gray-700 overflow-x-auto">
            {['dashboard', 'pending', 'users', 'comments'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-6 py-4 font-semibold whitespace-nowrap transition ${
                  activeTab === tab
                    ? 'text-primary-500 border-b-2 border-primary-500'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        <div>
          {activeTab === 'dashboard' && stats && (
            <div className="space-y-6">
              <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-md">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                  Recent Users
                </h2>
                <div className="space-y-3">
                  {stats.recentUsers.map((user) => (
                    <div key={user._id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                      <div>
                        <p className="font-semibold text-gray-900 dark:text-white">{user.username}</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{user.email}</p>
                      </div>
                      <span className="px-3 py-1 bg-primary-100 dark:bg-primary-900 text-primary-600 dark:text-primary-300 rounded-full text-sm">
                        {user.role}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-md">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                    Weekly Points Management
                  </h2>
                  <button
                    onClick={handleResetWeeklyPoints}
                    className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
                  >
                    Reset Weekly Points
                  </button>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Reset all users' weekly points to 0. This is typically done at the start of each week.
                </p>
              </div>
            </div>
          )}

          {activeTab === 'pending' && (
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-md overflow-hidden">
              <div className="p-6 border-b dark:border-gray-700">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Pending Recipe Approvals
                </h2>
              </div>
              <div className="divide-y dark:divide-gray-700">
                {pendingRecipes.length > 0 ? (
                  pendingRecipes.map((recipe) => (
                    <div key={recipe._id} className="p-6">
                      <div className="flex space-x-4">
                        <img 
                          src={recipe.image}
                          alt={recipe.title}
                          className="w-32 h-32 object-cover rounded-lg"
                        />
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                            {recipe.title}
                          </h3>
                          <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                            {recipe.description}
                          </p>
                          <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-400 mb-4">
                            <span>By: {recipe.chef.username}</span>
                            <span>•</span>
                            <span>{recipe.cuisine}</span>
                            <span>•</span>
                            <span>{recipe.category}</span>
                          </div>
                          <div className="flex space-x-3">
                            <button
                              onClick={() => handleApproveRecipe(recipe._id, true)}
                              className="flex items-center space-x-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition"
                            >
                              <CheckCircle size={18} />
                              <span>Approve</span>
                            </button>
                            <button
                              onClick={() => handleApproveRecipe(recipe._id, false)}
                              className="flex items-center space-x-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
                            >
                              <XCircle size={18} />
                              <span>Reject</span>
                            </button>
                            <button
                              onClick={() => handleFeatureRecipe(recipe._id, true)}
                              className="flex items-center space-x-2 px-4 py-2 bg-accent-500 text-white rounded-lg hover:bg-accent-600 transition"
                            >
                              <Star size={18} />
                              <span>Feature</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="p-12 text-center">
                    <p className="text-gray-600 dark:text-gray-400">No pending recipes</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'users' && (
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-md overflow-hidden">
              <div className="p-6 border-b dark:border-gray-700">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                  User Management
                </h2>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 dark:bg-gray-700">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">User</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Email</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Role</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y dark:divide-gray-700">
                    {users.map((user) => (
                      <tr key={user._id}>
                        <td className="px-6 py-4">
                          <div className="flex items-center space-x-3">
                            <img src={user.avatar} alt={user.username} className="w-10 h-10 rounded-full" />
                            <span className="font-medium text-gray-900 dark:text-white">{user.username}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-gray-600 dark:text-gray-400">{user.email}</td>
                        <td className="px-6 py-4">
                          <select
                            value={user.role}
                            onChange={(e) => handleUpdateRole(user._id, e.target.value)}
                            className="px-3 py-1 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-sm"
                          >
                            <option value="Foodie">Foodie</option>
                            <option value="Chef">Chef</option>
                            <option value="Admin">Admin</option>
                          </select>
                        </td>
                        <td className="px-6 py-4">
                          <button
                            onClick={() => handleDeleteUser(user._id)}
                            className="text-red-500 hover:text-red-600"
                          >
                            <Trash2 size={18} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'comments' && (
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-md overflow-hidden">
              <div className="p-6 border-b dark:border-gray-700">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Comment Moderation
                </h2>
              </div>
              <div className="divide-y dark:divide-gray-700">
                {comments.length > 0 ? (
                  comments.map((comment) => (
                    <div key={comment._id} className="p-6 flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <img src={comment.user.avatar} alt={comment.user.username} className="w-8 h-8 rounded-full" />
                          <span className="font-semibold text-gray-900 dark:text-white">{comment.user.username}</span>
                          <span className="text-sm text-gray-500">on</span>
                          <span className="text-sm text-primary-500">{comment.recipe.title}</span>
                        </div>
                        <p className="text-gray-700 dark:text-gray-300">{comment.text}</p>
                      </div>
                      <button
                        onClick={() => handleDeleteComment(comment._id)}
                        className="ml-4 text-red-500 hover:text-red-600"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  ))
                ) : (
                  <div className="p-12 text-center">
                    <p className="text-gray-600 dark:text-gray-400">No comments to moderate</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;
