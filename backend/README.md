# CraveConnect Backend API

RESTful API with Socket.io for CraveConnect food community platform.

## 🚀 Quick Start

```bash
npm install
npm run seed    # Optional: Load sample data
npm run dev     # Development mode
npm start       # Production mode
```

## 📝 Environment Variables

Create `.env` file:

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/craveconnect
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRE=7d
NODE_ENV=development
CLIENT_URL=http://localhost:3000
```

## 📚 API Documentation

### Base URL
```
http://localhost:5000/api
```

### Authentication Endpoints

#### Register User
```http
POST /auth/register
Content-Type: application/json

{
  "username": "johndoe",
  "email": "john@example.com",
  "password": "password123",
  "role": "Foodie"
}
```

#### Login
```http
POST /auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}
```

#### Get Current User
```http
GET /auth/me
Authorization: Bearer <token>
```

### Recipe Endpoints

#### Get All Recipes
```http
GET /recipes?cuisine=Italian&category=Dinner&search=pizza&page=1&limit=12
```

#### Get Trending Recipes
```http
GET /recipes/trending
```

#### Get Featured Recipes
```http
GET /recipes/featured
```

#### Get Single Recipe
```http
GET /recipes/:id
```

#### Create Recipe (Chef/Admin only)
```http
POST /recipes
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "Classic Pizza",
  "description": "Delicious homemade pizza",
  "image": "https://example.com/image.jpg",
  "cuisine": "Italian",
  "category": "Dinner",
  "difficulty": "Medium",
  "prepTime": 20,
  "cookTime": 15,
  "servings": 4,
  "ingredients": [
    { "name": "Flour", "quantity": "2 cups" }
  ],
  "instructions": [
    { "step": 1, "description": "Mix ingredients" }
  ],
  "tags": ["pizza", "italian"]
}
```

#### Like Recipe
```http
POST /recipes/:id/like
Authorization: Bearer <token>
```

#### Rate Recipe
```http
POST /recipes/:id/rate
Authorization: Bearer <token>
Content-Type: application/json

{
  "rating": 5
}
```

#### Add Comment
```http
POST /recipes/:id/comments
Authorization: Bearer <token>
Content-Type: application/json

{
  "text": "Great recipe!"
}
```

### User Endpoints

#### Get Top Chefs
```http
GET /users/top-chefs
```

#### Get User Profile
```http
GET /users/:id
```

#### Follow User
```http
POST /users/:id/follow
Authorization: Bearer <token>
```

#### Bookmark Recipe
```http
POST /users/bookmark/:recipeId
Authorization: Bearer <token>
```

### Chat Endpoints

#### Get Messages
```http
GET /chat/messages?room=general&limit=50
Authorization: Bearer <token>
```

#### Send Message
```http
POST /chat/messages
Authorization: Bearer <token>
Content-Type: application/json

{
  "message": "Hello everyone!",
  "room": "general"
}
```

### Admin Endpoints (Admin only)

#### Get Stats
```http
GET /admin/stats
Authorization: Bearer <token>
```

#### Get All Users
```http
GET /admin/users?page=1&limit=20
Authorization: Bearer <token>
```

#### Update User Role
```http
PUT /admin/users/:id/role
Authorization: Bearer <token>
Content-Type: application/json

{
  "role": "Chef"
}
```

#### Approve Recipe
```http
PUT /admin/recipes/:id/approve
Authorization: Bearer <token>
Content-Type: application/json

{
  "isApproved": true
}
```

## 🔌 Socket.io Events

### Client → Server
- `user:join` - Join with user data
- `chat:join` - Join chat room
- `chat:message` - Send message
- `chat:typing` - Typing indicator
- `recipe:like` - Recipe liked
- `comment:new` - New comment
- `recipe:new` - New recipe
- `recipe:rate` - Recipe rated

### Server → Client
- `users:active` - Active users list
- `user:joined` - User joined
- `user:left` - User left
- `chat:message` - New message
- `chat:typing` - Typing status
- `recipe:liked` - Like update
- `comment:added` - New comment
- `recipe:created` - New recipe
- `recipe:rated` - Rating update
- `notification:new` - New notification

## 🗄️ Database Models

### User
- username, email, password (hashed)
- role: Foodie, Chef, Admin
- avatar, bio
- followers, following, bookmarks
- badges, weeklyPoints, totalPoints

### Recipe
- title, description, image
- cuisine, category, difficulty
- ingredients, instructions
- prepTime, cookTime, servings
- chef, likes, ratings, views
- isTrending, isFeatured, isApproved

### Comment
- recipe, user, text
- likes, isApproved

### ChatMessage
- user, username, avatar, message
- room, isDeleted

### Notification
- recipient, sender, type, message
- link, isRead

### CookOff
- title, description, theme
- startDate, endDate
- participants, winner, isActive

## 🔐 Authentication

JWT tokens are required for protected routes. Include in header:

```
Authorization: Bearer <your_jwt_token>
```

## 📦 Dependencies

- express - Web framework
- mongoose - MongoDB ODM
- socket.io - Real-time communication
- jsonwebtoken - JWT authentication
- bcryptjs - Password hashing
- cors - CORS support
- helmet - Security headers
- morgan - Logging
- express-validator - Input validation

## 🛠️ Scripts

```bash
npm start          # Start production server
npm run dev        # Start with nodemon
npm run seed       # Seed database with sample data
```

## 🐛 Error Handling

All errors return JSON:

```json
{
  "success": false,
  "message": "Error description"
}
```

## 📊 Response Format

Success responses:

```json
{
  "success": true,
  "data": { ... }
}
```

Paginated responses:

```json
{
  "success": true,
  "data": [...],
  "pagination": {
    "page": 1,
    "limit": 12,
    "total": 100,
    "pages": 9
  }
}
```
