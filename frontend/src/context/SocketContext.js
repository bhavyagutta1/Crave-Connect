import React, { createContext, useContext } from 'react';

const SocketContext = createContext();

export const useSocket = () => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error('useSocket must be used within a SocketProvider');
  }
  return context;
};

export const SocketProvider = ({ children }) => {
  // Disabled Socket.io for Vercel deployment
  // Real-time features will require page refresh
  const value = {
    socket: null,
    connected: false,
    activeUsers: []
  };

  return <SocketContext.Provider value={value}>{children}</SocketContext.Provider>;
};
