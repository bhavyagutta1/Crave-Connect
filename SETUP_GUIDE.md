# 🚀 CraveConnect Setup Guide

Complete step-by-step guide to get CraveConnect running on your local machine.

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v14 or higher) - [Download](https://nodejs.org/)
- **MongoDB** - Choose one:
  - Local: [Download MongoDB Community Server](https://www.mongodb.com/try/download/community)
  - Cloud: [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) (Free tier available)
- **Git** (optional) - [Download](https://git-scm.com/)
- **Code Editor** - VS Code recommended

## 🔧 Step-by-Step Setup

### Step 1: Verify Prerequisites

Open terminal/command prompt and verify installations:

```bash
node --version
# Should show v14.x.x or higher

npm --version
# Should show 6.x.x or higher

mongod --version
# Should show MongoDB version (if using local MongoDB)
```

### Step 2: Navigate to Project

```bash
cd "C:\Users\bhavy\Downloads\fed craveconnect"
```

### Step 3: Backend Setup

#### 3.1 Install Backend Dependencies

```bash
cd backend
npm install
```

This will install:
- express
- mongoose
- socket.io
- jsonwebtoken
- bcryptjs
- cors
- dotenv
- And other dependencies

#### 3.2 Configure MongoDB

**Option A: Local MongoDB**

1. Start MongoDB service:
   - Windows: MongoDB should auto-start, or run `mongod` in terminal
   - Mac: `brew services start mongodb-community`
   - Linux: `sudo systemctl start mongod`

2. Your connection string will be:
   ```
   mongodb://localhost:27017/craveconnect
   ```

**Option B: MongoDB Atlas (Cloud)**

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create free account
3. Create a new cluster (free tier)
4. Click "Connect" → "Connect your application"
5. Copy the connection string (looks like):
   ```
   mongodb+srv://username:password@cluster.mongodb.net/craveconnect?retryWrites=true&w=majority
   ```
6. Replace `<password>` with your actual password

#### 3.3 Create Backend .env File

Create a new file named `.env` in the `backend` folder:

**For Windows:**
```bash
# In backend folder
notepad .env
```

**For Mac/Linux:**
```bash
# In backend folder
touch .env
nano .env
```

Add this content (modify as needed):

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/craveconnect
JWT_SECRET=craveconnect_super_secret_key_2024_change_in_production
JWT_EXPIRE=7d
NODE_ENV=development
CLIENT_URL=http://localhost:3000
```

**Important Notes:**
- Change `JWT_SECRET` to a random string in production
- If using MongoDB Atlas, replace `MONGODB_URI` with your Atlas connection string
- Keep this file secure and never commit it to version control

#### 3.4 Seed the Database (Recommended)

This creates sample data including users, recipes, comments, and a Cook-Off challenge:

```bash
npm run seed
```

You should see:
```
MongoDB Connected: localhost
Cleared existing data
Created users
Created recipes
Created comments
Created Cook-Off challenge
✅ Database seeded successfully!

Test Accounts:
Admin: admin@craveconnect.com / admin123
Chef: maria@example.com / password123
...
```

#### 3.5 Start Backend Server

```bash
npm run dev
```

You should see:
```
Server running in development mode on port 5000
MongoDB Connected: localhost
```

**Backend is now running at:** `http://localhost:5000`

Keep this terminal open!

### Step 4: Frontend Setup

Open a **NEW** terminal/command prompt.

#### 4.1 Navigate to Frontend

```bash
cd "C:\Users\bhavy\Downloads\fed craveconnect\frontend"
```

#### 4.2 Install Frontend Dependencies

```bash
npm install
```

This will install:
- react
- react-router-dom
- tailwindcss
- axios
- socket.io-client
- react-hot-toast
- lucide-react
- And other dependencies

This may take a few minutes.

#### 4.3 Create Frontend .env File

Create a new file named `.env` in the `frontend` folder:

**For Windows:**
```bash
# In frontend folder
notepad .env
```

**For Mac/Linux:**
```bash
# In frontend folder
touch .env
nano .env
```

Add this content:

```env
REACT_APP_API_URL=http://localhost:5000
```

#### 4.4 Start Frontend Development Server

```bash
npm start
```

The app will automatically open in your browser at `http://localhost:3000`

If it doesn't open automatically, manually navigate to: `http://localhost:3000`

## ✅ Verification

You should now have:

1. **Backend running** on `http://localhost:5000`
   - Check: Visit `http://localhost:5000/api/health` - should show JSON response

2. **Frontend running** on `http://localhost:3000`
   - Check: Should see CraveConnect homepage

3. **MongoDB connected**
   - Check: Backend terminal should show "MongoDB Connected"

## 🎯 Test the Application

### 1. Login with Demo Account

Use any of these accounts:

| Email | Password | Role |
|-------|----------|------|
| admin@craveconnect.com | admin123 | Admin |
| maria@example.com | password123 | Chef |
| sarah@example.com | password123 | Foodie |

### 2. Test Features

- ✅ Browse recipes on homepage
- ✅ Search and filter recipes
- ✅ View recipe details
- ✅ Like and rate recipes
- ✅ Add comments
- ✅ Post new recipe (as Chef)
- ✅ Join community chat
- ✅ View top chefs leaderboard
- ✅ Visit user profiles
- ✅ Follow users
- ✅ Bookmark recipes
- ✅ Access admin panel (as Admin)
- ✅ Toggle dark/light theme

## 🐛 Troubleshooting

### Backend Issues

**Error: "Cannot connect to MongoDB"**
- Ensure MongoDB is running
- Check your connection string in `.env`
- For Atlas: Ensure IP whitelist includes your IP (or use 0.0.0.0/0 for testing)

**Error: "Port 5000 already in use"**
- Change `PORT` in backend `.env` to another port (e.g., 5001)
- Update frontend `.env` to match: `REACT_APP_API_URL=http://localhost:5001`

**Error: "JWT_SECRET is not defined"**
- Ensure `.env` file exists in backend folder
- Check that `JWT_SECRET` is set in `.env`

### Frontend Issues

**Error: "Cannot connect to backend"**
- Ensure backend is running on port 5000
- Check `REACT_APP_API_URL` in frontend `.env`
- Restart frontend after changing `.env`

**Tailwind styles not working**
- Run `npm install` again in frontend folder
- Clear browser cache
- Restart development server

**Socket.io connection failed**
- Ensure backend is running
- Check browser console for errors
- Verify CORS settings in backend

### General Issues

**"Module not found" errors**
- Delete `node_modules` folder
- Delete `package-lock.json`
- Run `npm install` again

**Changes not reflecting**
- Hard refresh browser (Ctrl+Shift+R or Cmd+Shift+R)
- Clear browser cache
- Restart development servers

## 📱 Mobile Testing

To test on mobile devices on the same network:

1. Find your computer's local IP address:
   - Windows: `ipconfig` (look for IPv4)
   - Mac/Linux: `ifconfig` (look for inet)

2. Update frontend `.env`:
   ```env
   REACT_APP_API_URL=http://YOUR_LOCAL_IP:5000
   ```

3. Access from mobile: `http://YOUR_LOCAL_IP:3000`

## 🔄 Stopping the Application

1. **Stop Frontend**: Press `Ctrl+C` in frontend terminal
2. **Stop Backend**: Press `Ctrl+C` in backend terminal
3. **Stop MongoDB** (if local):
   - Windows: MongoDB service continues running
   - Mac: `brew services stop mongodb-community`
   - Linux: `sudo systemctl stop mongod`

## 🚀 Next Steps

- Explore all features
- Create your own recipes
- Customize the theme colors
- Add more sample data
- Deploy to production

## 📞 Need Help?

If you encounter issues:

1. Check this guide again
2. Review error messages carefully
3. Check browser console (F12)
4. Check terminal output
5. Ensure all prerequisites are installed
6. Verify all `.env` files are created correctly

## 🎉 Success!

If everything is working, you should see:
- Beautiful homepage with recipes
- Smooth navigation
- Real-time chat working
- All features functional

Enjoy exploring CraveConnect! 🍽️
