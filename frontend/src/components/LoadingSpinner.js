import React from 'react';

const LoadingSpinner = ({ size = 'md', fullScreen = false }) => {
  const sizeClasses = {
    sm: 'w-6 h-6',
    md: 'w-12 h-12',
    lg: 'w-16 h-16'
  };

  const spinner = (
    <div className={`${sizeClasses[size]} border-4 border-primary-200 border-t-primary-500 rounded-full animate-spin`}></div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-white dark:bg-gray-900 bg-opacity-80 z-50">
        {spinner}
      </div>
    );
  }

  return (
    <div className="flex justify-center items-center p-8">
      {spinner}
    </div>
  );
};

export default LoadingSpinner;
