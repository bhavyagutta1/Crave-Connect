import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { 
  Home, Search, MessageCircle, Trophy, User, LogOut, 
  Moon, Sun, Menu, X, Bell, BookMarked, Shield, PlusCircle 
} from 'lucide-react';

const Navbar = () => {
  const { user, logout, isAdmin, isChef } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="sticky top-0 z-50 bg-white dark:bg-gray-900 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="text-3xl">🍽️</div>
            <span className="text-2xl font-display font-bold bg-gradient-to-r from-primary-500 to-accent-500 bg-clip-text text-transparent">
              CraveConnect
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            <Link 
              to="/" 
              className="flex items-center space-x-1 text-gray-700 dark:text-gray-300 hover:text-primary-500 dark:hover:text-primary-400 transition"
            >
              <Home size={20} />
              <span>Home</span>
            </Link>
            <Link 
              to="/recipes" 
              className="flex items-center space-x-1 text-gray-700 dark:text-gray-300 hover:text-primary-500 dark:hover:text-primary-400 transition"
            >
              <Search size={20} />
              <span>Recipes</span>
            </Link>
            <Link 
              to="/chat" 
              className="flex items-center space-x-1 text-gray-700 dark:text-gray-300 hover:text-primary-500 dark:hover:text-primary-400 transition"
            >
              <MessageCircle size={20} />
              <span>Chat</span>
            </Link>
            <Link 
              to="/top-chefs" 
              className="flex items-center space-x-1 text-gray-700 dark:text-gray-300 hover:text-primary-500 dark:hover:text-primary-400 transition"
            >
              <Trophy size={20} />
              <span>Top Chefs</span>
            </Link>
            
            {/* Post Recipe - Only for Chefs and Admins */}
            {isChef && (
              <Link 
                to="/post-recipe" 
                className="flex items-center space-x-1 px-4 py-2 bg-gradient-to-r from-primary-500 to-accent-500 text-white rounded-full hover:shadow-lg transition font-medium"
              >
                <PlusCircle size={20} />
                <span>Post Recipe</span>
              </Link>
            )}
          </div>

          {/* Right Side Actions */}
          <div className="hidden md:flex items-center space-x-4">
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition"
              aria-label="Toggle theme"
            >
              {isDark ? <Sun size={20} className="text-yellow-400" /> : <Moon size={20} className="text-gray-700" />}
            </button>

            {user ? (
              <>
                {/* Notifications */}
                <Link 
                  to="/notifications" 
                  className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition relative"
                >
                  <Bell size={20} className="text-gray-700 dark:text-gray-300" />
                </Link>

                {/* Bookmarks */}
                <Link 
                  to={`/profile/${user._id}?tab=bookmarks`}
                  className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition"
                >
                  <BookMarked size={20} className="text-gray-700 dark:text-gray-300" />
                </Link>

                {/* Admin Panel */}
                {isAdmin && (
                  <Link 
                    to="/admin" 
                    className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition"
                  >
                    <Shield size={20} className="text-primary-500" />
                  </Link>
                )}

                {/* Profile Dropdown */}
                <div className="relative group">
                  <button className="flex items-center space-x-2">
                    <img 
                      src={user.avatar} 
                      alt={user.username}
                      className="w-8 h-8 rounded-full border-2 border-primary-500"
                    />
                  </button>
                  <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg py-2 invisible group-hover:visible opacity-0 group-hover:opacity-100 transition-all">
                    <Link 
                      to={`/profile/${user._id}`}
                      className="flex items-center space-x-2 px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                      <User size={16} />
                      <span>Profile</span>
                    </Link>
                    <button 
                      onClick={handleLogout}
                      className="flex items-center space-x-2 px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 w-full text-left text-red-500"
                    >
                      <LogOut size={16} />
                      <span>Logout</span>
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex items-center space-x-3">
                <Link 
                  to="/login"
                  className="px-4 py-2 text-primary-500 hover:text-primary-600 font-medium transition"
                >
                  Login
                </Link>
                <Link 
                  to="/register"
                  className="px-4 py-2 bg-gradient-to-r from-primary-500 to-accent-500 text-white rounded-full hover:shadow-lg transition font-medium"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white dark:bg-gray-900 border-t dark:border-gray-800">
          <div className="px-4 py-4 space-y-3">
            <Link 
              to="/" 
              className="flex items-center space-x-2 py-2 text-gray-700 dark:text-gray-300"
              onClick={() => setMobileMenuOpen(false)}
            >
              <Home size={20} />
              <span>Home</span>
            </Link>
            <Link 
              to="/recipes" 
              className="flex items-center space-x-2 py-2 text-gray-700 dark:text-gray-300"
              onClick={() => setMobileMenuOpen(false)}
            >
              <Search size={20} />
              <span>Recipes</span>
            </Link>
            <Link 
              to="/chat" 
              className="flex items-center space-x-2 py-2 text-gray-700 dark:text-gray-300"
              onClick={() => setMobileMenuOpen(false)}
            >
              <MessageCircle size={20} />
              <span>Chat</span>
            </Link>
            <Link 
              to="/top-chefs" 
              className="flex items-center space-x-2 py-2 text-gray-700 dark:text-gray-300"
              onClick={() => setMobileMenuOpen(false)}
            >
              <Trophy size={20} />
              <span>Top Chefs</span>
            </Link>
            
            {/* Post Recipe - Mobile */}
            {isChef && (
              <Link 
                to="/post-recipe" 
                className="flex items-center space-x-2 py-2 px-4 bg-gradient-to-r from-primary-500 to-accent-500 text-white rounded-full font-medium"
                onClick={() => setMobileMenuOpen(false)}
              >
                <PlusCircle size={20} />
                <span>Post Recipe</span>
              </Link>
            )}
            
            {user && (
              <>
                <Link 
                  to={`/profile/${user._id}`}
                  className="flex items-center space-x-2 py-2 text-gray-700 dark:text-gray-300"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <User size={20} />
                  <span>Profile</span>
                </Link>
                {isAdmin && (
                  <Link 
                    to="/admin" 
                    className="flex items-center space-x-2 py-2 text-primary-500"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <Shield size={20} />
                    <span>Admin Panel</span>
                  </Link>
                )}
                <button 
                  onClick={() => {
                    handleLogout();
                    setMobileMenuOpen(false);
                  }}
                  className="flex items-center space-x-2 py-2 text-red-500 w-full"
                >
                  <LogOut size={20} />
                  <span>Logout</span>
                </button>
              </>
            )}
            {!user && (
              <div className="flex flex-col space-y-2 pt-2">
                <Link 
                  to="/login"
                  className="px-4 py-2 text-center text-primary-500 border border-primary-500 rounded-full"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Login
                </Link>
                <Link 
                  to="/register"
                  className="px-4 py-2 text-center bg-gradient-to-r from-primary-500 to-accent-500 text-white rounded-full"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
