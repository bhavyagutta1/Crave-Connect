# 🍽️ CraveConnect - Food Community Platform

A full-stack, real-time community platform for food lovers to share, discover, rate, and chat about recipes.

![CraveConnect](https://img.shields.io/badge/version-1.0.0-blue)
![React](https://img.shields.io/badge/React-18.2.0-61dafb)
![Node.js](https://img.shields.io/badge/Node.js-Express-green)
![MongoDB](https://img.shields.io/badge/MongoDB-Database-47A248)
![Socket.io](https://img.shields.io/badge/Socket.io-Real--time-black)

## ✨ Features

### 🏠 Core Features
- **Home Page**: Trending recipes, featured dishes, top chefs, and category browsing
- **Recipe Discovery**: Advanced filtering by cuisine, category, difficulty, and ingredients
- **Recipe Details**: Full recipe view with ingredients, instructions, ratings, and comments
- **Post Recipe**: Rich form with image preview, validation, and dynamic fields
- **Search**: Dynamic filtering with real-time results
- **Community Chat**: WebSocket-powered real-time chat with active user list
- **Top Chefs**: Weekly leaderboard with badges and rankings
- **User Profiles**: Personal dashboard with recipes, followers, bookmarks, and activity
- **Admin Panel**: Complete moderation tools for users, recipes, and comments

### 🔐 Authentication & Authorization
- JWT-based authentication
- Role-based access control (Foodie, Chef, Admin)
- Protected routes and API endpoints
- Secure password hashing with bcrypt

### 🎨 UI/UX Features
- **Vibrant Design**: Red, Orange, and Pink color scheme
- **Dark/Light Mode**: Toggle theme with persistent preference
- **Responsive Design**: Mobile-first CSS Grid layout
- **Smooth Animations**: Hover effects and transitions
- **Accessibility**: Focus indicators and semantic HTML
- **Modern Fonts**: Google Poppins and Montserrat

### 🚀 Real-time Features
- Live chat with typing indicators
- Real-time notifications
- Active user tracking
- Instant comment updates
- Live like and rating updates

### 📊 Social Features
- Like and bookmark recipes
- 5-star rating system
- Follow/unfollow users
- Comment on recipes
- Weekly Cook-Off challenges
- Badge and achievement system

## 🛠️ Tech Stack

### Frontend
- **React 18.2** - UI library
- **React Router v6** - Navigation
- **Tailwind CSS** - Styling
- **Socket.io Client** - Real-time communication
- **Axios** - HTTP client
- **React Hot Toast** - Notifications
- **Lucide React** - Icons
- **date-fns** - Date formatting

### Backend
- **Node.js & Express** - Server framework
- **MongoDB & Mongoose** - Database
- **Socket.io** - WebSocket server
- **JWT** - Authentication
- **bcryptjs** - Password hashing
- **Express Validator** - Input validation
- **Helmet** - Security headers
- **Morgan** - Logging
- **CORS** - Cross-origin support

## 📁 Project Structure

```
craveconnect/
├── backend/
│   ├── config/
│   │   └── db.js
│   ├── middleware/
│   │   ├── auth.js
│   │   └── errorHandler.js
│   ├── models/
│   │   ├── User.js
│   │   ├── Recipe.js
│   │   ├── Comment.js
│   │   ├── ChatMessage.js
│   │   ├── Notification.js
│   │   └── CookOff.js
│   ├── routes/
│   │   ├── auth.js
│   │   ├── recipes.js
│   │   ├── users.js
│   │   ├── admin.js
│   │   └── chat.js
│   ├── seeders/
│   │   └── seed.js
│   ├── utils/
│   │   └── generateToken.js
│   ├── server.js
│   └── package.json
│
└── frontend/
    ├── public/
    │   └── index.html
    ├── src/
    │   ├── components/
    │   │   ├── Navbar.js
    │   │   ├── RecipeCard.js
    │   │   ├── LoadingSpinner.js
    │   │   └── ProtectedRoute.js
    │   ├── context/
    │   │   ├── AuthContext.js
    │   │   ├── ThemeContext.js
    │   │   └── SocketContext.js
    │   ├── pages/
    │   │   ├── Home.js
    │   │   ├── Login.js
    │   │   ├── Register.js
    │   │   ├── AllRecipes.js
    │   │   ├── RecipeDetail.js
    │   │   ├── PostRecipe.js
    │   │   ├── Chat.js
    │   │   ├── TopChefs.js
    │   │   ├── Profile.js
    │   │   └── AdminPanel.js
    │   ├── utils/
    │   │   └── api.js
    │   ├── App.js
    │   ├── index.js
    │   └── index.css
    ├── tailwind.config.js
    └── package.json
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or Atlas)
- npm or yarn

### Installation

1. **Clone the repository**
```bash
cd "C:\Users\bhavy\Downloads\fed craveconnect"
```

2. **Backend Setup**
```bash
cd backend
npm install
```

3. **Create backend .env file**
Create a file named `.env` in the `backend` folder with:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/craveconnect
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
JWT_EXPIRE=7d
NODE_ENV=development
CLIENT_URL=http://localhost:3000
```

**For MongoDB Atlas (Cloud):**
Replace `MONGODB_URI` with your Atlas connection string:
```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/craveconnect?retryWrites=true&w=majority
```

4. **Seed the database** (Optional but recommended)
```bash
npm run seed
```

This will create sample users, recipes, comments, and a Cook-Off challenge.

5. **Start the backend server**
```bash
npm run dev
```

Backend will run on `http://localhost:5000`

6. **Frontend Setup**
Open a new terminal:
```bash
cd frontend
npm install
```

7. **Create frontend .env file**
Create a file named `.env` in the `frontend` folder with:
```env
REACT_APP_API_URL=http://localhost:5000
```

8. **Start the frontend**
```bash
npm start
```

Frontend will run on `http://localhost:3000`

## 👤 Demo Accounts

After seeding the database, you can use these accounts:

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@craveconnect.com | admin123 |
| Chef | takeshi@example.com | password123 |
| Chef | raj@example.com | password123 |


## 📱 Features Overview

### For Foodies
- Browse and search thousands of recipes
- Filter by cuisine, category, difficulty, and ingredients
- Like and bookmark favorite recipes
- Rate recipes with 5-star system
- Comment on recipes
- Follow favorite chefs
- Join community chat
- Track activity and bookmarks

### For Chefs
- Post unlimited recipes with images
- Edit and delete own recipes
- Earn points and badges
- Compete in weekly leaderboard
- Participate in Cook-Off challenges
- Build follower base
- Track recipe performance

### For Admins
- Moderate all content
- Approve/reject recipes
- Feature recipes on homepage
- Manage users and roles
- Delete inappropriate comments
- View platform statistics
- Reset weekly points
- Create Cook-Off challenges

## 🎯 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user

### Recipes
- `GET /api/recipes` - Get all recipes (with filters)
- `GET /api/recipes/trending` - Get trending recipes
- `GET /api/recipes/featured` - Get featured recipes
- `GET /api/recipes/:id` - Get single recipe
- `POST /api/recipes` - Create recipe (Chef/Admin)
- `PUT /api/recipes/:id` - Update recipe (Owner/Admin)
- `DELETE /api/recipes/:id` - Delete recipe (Owner/Admin)
- `POST /api/recipes/:id/like` - Like/unlike recipe
- `POST /api/recipes/:id/rate` - Rate recipe
- `GET /api/recipes/:id/comments` - Get recipe comments
- `POST /api/recipes/:id/comments` - Add comment

### Users
- `GET /api/users/top-chefs` - Get top chefs leaderboard
- `GET /api/users/:id` - Get user profile
- `PUT /api/users/:id` - Update profile (Owner)
- `POST /api/users/:id/follow` - Follow/unfollow user
- `POST /api/users/bookmark/:recipeId` - Bookmark recipe
- `GET /api/users/:id/bookmarks` - Get bookmarks
- `GET /api/users/:id/notifications` - Get notifications

### Chat
- `GET /api/chat/messages` - Get chat messages
- `POST /api/chat/messages` - Send message
- `DELETE /api/chat/messages/:id` - Delete message

### Admin
- `GET /api/admin/stats` - Get dashboard stats
- `GET /api/admin/users` - Get all users
- `PUT /api/admin/users/:id/role` - Update user role
- `DELETE /api/admin/users/:id` - Delete user
- `GET /api/admin/recipes/pending` - Get pending recipes
- `PUT /api/admin/recipes/:id/approve` - Approve/reject recipe
- `PUT /api/admin/recipes/:id/feature` - Feature recipe
- `GET /api/admin/comments` - Get all comments
- `DELETE /api/admin/comments/:id` - Delete comment
- `POST /api/admin/reset-weekly-points` - Reset weekly points

## 🔌 Socket.io Events

### Client to Server
- `user:join` - User joins with profile data
- `chat:join` - Join chat room
- `chat:message` - Send chat message
- `chat:typing` - Typing indicator
- `recipe:like` - Recipe liked
- `comment:new` - New comment added
- `recipe:new` - New recipe posted
- `recipe:rate` - Recipe rated

### Server to Client
- `users:active` - Active users list
- `user:joined` - User joined notification
- `user:left` - User left notification
- `chat:message` - New chat message
- `chat:typing` - Someone is typing
- `recipe:liked` - Recipe like update
- `comment:added` - New comment notification
- `recipe:created` - New recipe notification
- `recipe:rated` - Rating update
- `notification:new` - New notification

## 🎨 Color Palette

- **Primary Red**: `#f43f5e` - Main actions, highlights
- **Warm Orange**: `#f97316` - Accents, secondary actions
- **Soft Pink**: `#ec4899` - Tertiary highlights
- **Gray Scale**: Various shades for text and backgrounds
- **Dark Mode**: Optimized dark color scheme

## 🚀 Deployment

### Backend (Railway/Render)
1. Create account on Railway or Render
2. Connect GitHub repository
3. Set environment variables
4. Deploy

### Frontend (Vercel)
1. Create account on Vercel
2. Import GitHub repository
3. Set `REACT_APP_API_URL` to your backend URL
4. Deploy

## 📝 Environment Variables

### Backend (.env)
```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRE=7d
NODE_ENV=production
CLIENT_URL=your_frontend_url
```

### Frontend (.env)
```env
REACT_APP_API_URL=your_backend_api_url
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.


**Built with ❤️ for food lovers everywhere**
