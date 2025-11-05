import React, { useEffect, useState, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { useSocket } from '../context/SocketContext';
import { chatAPI } from '../utils/api';
import { Send, Users } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import toast from 'react-hot-toast';

const Chat = () => {
  const { user } = useAuth();
  const { socket, connected, activeUsers } = useSocket();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [typing, setTyping] = useState(null);
  const messagesEndRef = useRef(null);
  const typingTimeoutRef = useRef(null);

  useEffect(() => {
    fetchMessages();
  }, []);

  useEffect(() => {
    if (socket) {
      socket.emit('chat:join', 'general');

      socket.on('chat:message', (message) => {
        setMessages(prev => [...prev, message]);
      });

      socket.on('chat:typing', (data) => {
        setTyping(data.isTyping ? data.username : null);
        if (data.isTyping) {
          setTimeout(() => setTyping(null), 3000);
        }
      });

      return () => {
        socket.off('chat:message');
        socket.off('chat:typing');
      };
    }
  }, [socket]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const fetchMessages = async () => {
    try {
      const response = await chatAPI.getMessages('general');
      setMessages(response.data.data);
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleTyping = () => {
    if (socket && connected) {
      socket.emit('chat:typing', {
        room: 'general',
        username: user.username,
        isTyping: true
      });

      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }

      typingTimeoutRef.current = setTimeout(() => {
        socket.emit('chat:typing', {
          room: 'general',
          username: user.username,
          isTyping: false
        });
      }, 1000);
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    const messageData = {
      user: user._id,
      username: user.username,
      avatar: user.avatar,
      message: newMessage,
      room: 'general',
      timestamp: new Date().toISOString()
    };

    try {
      if (socket && connected) {
        socket.emit('chat:message', messageData);
      }
      await chatAPI.sendMessage(newMessage, 'general');
      setNewMessage('');
    } catch (error) {
      toast.error('Failed to send message');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Chat Area */}
          <div className="lg:col-span-3">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden flex flex-col h-[calc(100vh-12rem)]">
              {/* Header */}
              <div className="bg-gradient-to-r from-primary-500 to-accent-500 text-white p-6">
                <h1 className="text-2xl font-display font-bold mb-2">
                  Community Chat
                </h1>
                <p className="text-white/80 text-sm">
                  Connect with fellow food lovers • {connected ? '🟢 Connected' : '🔴 Disconnected'}
                </p>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-6 space-y-4">
                {messages.map((message, index) => {
                  const isOwnMessage = message.user?._id === user._id || message.user === user._id;
                  
                  return (
                    <div 
                      key={index}
                      className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'}`}
                    >
                      <div className={`flex space-x-3 max-w-md ${isOwnMessage ? 'flex-row-reverse space-x-reverse' : ''}`}>
                        <img 
                          src={message.avatar || message.user?.avatar}
                          alt={message.username}
                          className="w-10 h-10 rounded-full flex-shrink-0"
                        />
                        <div>
                          <div className={`flex items-center space-x-2 mb-1 ${isOwnMessage ? 'flex-row-reverse space-x-reverse' : ''}`}>
                            <span className="text-sm font-semibold text-gray-900 dark:text-white">
                              {message.username}
                            </span>
                            <span className="text-xs text-gray-500">
                              {formatDistanceToNow(new Date(message.createdAt || message.timestamp), { addSuffix: true })}
                            </span>
                          </div>
                          <div className={`px-4 py-2 rounded-2xl ${
                            isOwnMessage 
                              ? 'bg-gradient-to-r from-primary-500 to-accent-500 text-white' 
                              : 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white'
                          }`}>
                            <p className="text-sm">{message.message}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
                {typing && (
                  <div className="flex items-center space-x-2 text-gray-500 text-sm">
                    <span>{typing} is typing</span>
                    <span className="flex space-x-1">
                      <span className="animate-bounce">.</span>
                      <span className="animate-bounce" style={{ animationDelay: '0.2s' }}>.</span>
                      <span className="animate-bounce" style={{ animationDelay: '0.4s' }}>.</span>
                    </span>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Input */}
              <form onSubmit={handleSendMessage} className="p-4 border-t dark:border-gray-700">
                <div className="flex space-x-3">
                  <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => {
                      setNewMessage(e.target.value);
                      handleTyping();
                    }}
                    placeholder="Type your message..."
                    className="flex-1 px-4 py-3 bg-gray-100 dark:bg-gray-700 border-0 rounded-xl focus:ring-2 focus:ring-primary-500 dark:text-white"
                  />
                  <button
                    type="submit"
                    disabled={!newMessage.trim()}
                    className="px-6 py-3 bg-gradient-to-r from-primary-500 to-accent-500 text-white rounded-xl hover:shadow-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Send size={20} />
                  </button>
                </div>
              </form>
            </div>
          </div>

          {/* Active Users Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6">
              <div className="flex items-center space-x-2 mb-6">
                <Users className="text-primary-500" size={24} />
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Active Users
                </h2>
                <span className="px-2 py-1 bg-primary-100 dark:bg-primary-900 text-primary-600 dark:text-primary-300 rounded-full text-xs font-semibold">
                  {activeUsers.length}
                </span>
              </div>
              <div className="space-y-3">
                {activeUsers.map((activeUser, index) => (
                  <div key={index} className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition">
                    <div className="relative">
                      <img 
                        src={activeUser.avatar}
                        alt={activeUser.username}
                        className="w-10 h-10 rounded-full"
                      />
                      <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white dark:border-gray-800 rounded-full"></span>
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        {activeUser.username}
                      </p>
                      <p className="text-xs text-green-500">Online</p>
                    </div>
                  </div>
                ))}
                {activeUsers.length === 0 && (
                  <p className="text-sm text-gray-500 text-center py-4">
                    No active users
                  </p>
                )}
              </div>
            </div>

            {/* Chat Rules */}
            <div className="mt-6 bg-gradient-to-br from-primary-50 to-accent-50 dark:from-gray-700 dark:to-gray-600 rounded-2xl p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                Chat Guidelines
              </h3>
              <ul className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
                <li className="flex items-start space-x-2">
                  <span>✅</span>
                  <span>Be respectful and kind</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span>✅</span>
                  <span>Share recipes and tips</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span>✅</span>
                  <span>Ask cooking questions</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span>❌</span>
                  <span>No spam or harassment</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chat;
