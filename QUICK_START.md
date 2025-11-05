# ⚡ Quick Start Guide

Get CraveConnect running in 5 minutes!

## 🎯 Prerequisites

- Node.js installed
- MongoDB running (local or Atlas)

## 🚀 Quick Setup

### 1. Backend Setup (Terminal 1)

```bash
cd backend
npm install
```

Create `backend/.env`:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/craveconnect
JWT_SECRET=your_secret_key_here
JWT_EXPIRE=7d
NODE_ENV=development
CLIENT_URL=http://localhost:3000
```

Seed database and start:
```bash
npm run seed
npm run dev
```

### 2. Frontend Setup (Terminal 2)

```bash
cd frontend
npm install
```

Create `frontend/.env`:
```env
REACT_APP_API_URL=http://localhost:5000
```

Start frontend:
```bash
npm start
```

## ✅ Done!

Visit: `http://localhost:3000`

Login with:
- **Admin**: admin@craveconnect.com / admin123
- **Chef**: maria@example.com / password123
- **Foodie**: sarah@example.com / password123

## 📝 Manual .env Creation

Since `.env` files can't be auto-created, here's how to create them manually:

### Windows:
```bash
# In backend folder
echo PORT=5000 > .env
echo MONGODB_URI=mongodb://localhost:27017/craveconnect >> .env
echo JWT_SECRET=your_secret_key_here >> .env
echo JWT_EXPIRE=7d >> .env
echo NODE_ENV=development >> .env
echo CLIENT_URL=http://localhost:3000 >> .env

# In frontend folder
echo REACT_APP_API_URL=http://localhost:5000 > .env
```

### Mac/Linux:
```bash
# In backend folder
cat > .env << EOF
PORT=5000
MONGODB_URI=mongodb://localhost:27017/craveconnect
JWT_SECRET=your_secret_key_here
JWT_EXPIRE=7d
NODE_ENV=development
CLIENT_URL=http://localhost:3000
EOF

# In frontend folder
cat > .env << EOF
REACT_APP_API_URL=http://localhost:5000
EOF
```

## 🎉 Features to Try

1. ✅ Browse trending recipes
2. ✅ Search and filter
3. ✅ Post a recipe (as Chef)
4. ✅ Join community chat
5. ✅ Rate and comment
6. ✅ Follow users
7. ✅ Admin panel (as Admin)
8. ✅ Toggle dark mode

Enjoy! 🍽️
