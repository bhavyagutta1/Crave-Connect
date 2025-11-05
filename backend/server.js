require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const http = require('http');
const socketio = require('socket.io');
const connectDB = require('./config/db');
const errorHandler = require('./middleware/errorHandler');

// Connect to database
connectDB();

const app = express();
const server = http.createServer(app);
const io = socketio(server, {
  cors: {
    origin: process.env.CLIENT_URL || 'http://localhost:3000',
    methods: ['GET', 'POST']
  }
});

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));

// Make io accessible to routes
app.set('io', io);

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/recipes', require('./routes/recipes'));
app.use('/api/users', require('./routes/users'));
app.use('/api/admin', require('./routes/admin'));
app.use('/api/chat', require('./routes/chat'));

// Health check
app.get('/api/health', (req, res) => {
  res.json({ 
    success: true, 
    message: 'CraveConnect API is running',
    timestamp: new Date().toISOString()
  });
});

// Error handler
app.use(errorHandler);

// Socket.io connection
const activeUsers = new Map();

io.on('connection', (socket) => {
  console.log('New client connected:', socket.id);

  // User joins
  socket.on('user:join', (userData) => {
    activeUsers.set(socket.id, userData);
    io.emit('users:active', Array.from(activeUsers.values()));
    
    // Broadcast user joined
    socket.broadcast.emit('user:joined', {
      username: userData.username,
      avatar: userData.avatar
    });
  });

  // Join chat room
  socket.on('chat:join', (room) => {
    socket.join(room);
    console.log(`User joined room: ${room}`);
  });

  // Send chat message
  socket.on('chat:message', (data) => {
    const room = data.room || 'general';
    io.to(room).emit('chat:message', {
      ...data,
      timestamp: new Date().toISOString()
    });
  });

  // Typing indicator
  socket.on('chat:typing', (data) => {
    socket.to(data.room || 'general').emit('chat:typing', {
      username: data.username,
      isTyping: data.isTyping
    });
  });

  // Recipe like notification
  socket.on('recipe:like', (data) => {
    io.emit('recipe:liked', data);
  });

  // New comment notification
  socket.on('comment:new', (data) => {
    io.emit('comment:added', data);
  });

  // New recipe notification
  socket.on('recipe:new', (data) => {
    io.emit('recipe:created', data);
  });

  // Rating update
  socket.on('recipe:rate', (data) => {
    io.emit('recipe:rated', data);
  });

  // Notification
  socket.on('notification:send', (data) => {
    io.emit('notification:new', data);
  });

  // User disconnect
  socket.on('disconnect', () => {
    const userData = activeUsers.get(socket.id);
    activeUsers.delete(socket.id);
    io.emit('users:active', Array.from(activeUsers.values()));
    
    if (userData) {
      socket.broadcast.emit('user:left', {
        username: userData.username
      });
    }
    
    console.log('Client disconnected:', socket.id);
  });
});

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});
