# 🚀 Vercel Deployment Guide - CraveConnect

## ⚠️ Important Note
This deployment uses Vercel for both frontend and backend. Real-time features (live chat, notifications) are disabled but all other features work perfectly.

---

## 📋 STEP 1: Deploy Frontend to Vercel

### On Vercel Dashboard:

1. **Framework Preset**: Select `Create React App`

2. **Root Directory**: `frontend`

3. **Build Settings**:
   - Build Command: `npm run build`
   - Output Directory: `build`
   - Install Command: `npm install`

4. **Environment Variables**:
   ```
   REACT_APP_API_URL = https://YOUR-BACKEND-URL.vercel.app
   ```
   (Add your backend URL after Step 2)

5. Click **Deploy** 🚀

**You'll get**: `https://craveconnect-frontend-xyz.vercel.app`

---

## 📋 STEP 2: Deploy Backend to Vercel

### On Vercel Dashboard:

1. Click **"Add New"** → **"Project"**

2. Import the same repository again

3. **Framework Preset**: Select `Other`

4. **Root Directory**: `backend`

5. **Build Settings**:
   - Build Command: `npm install`
   - Output Directory: (leave empty)
   - Install Command: `npm install`

6. **Environment Variables** (CRITICAL!):
   ```
   MONGODB_URI = mongodb+srv://bhavyagutta18_db_user:YOUR_PASSWORD@cluster0.xp5henb.mongodb.net/craveconnect?retryWrites=true&w=majority
   
   JWT_SECRET = craveconnect_super_secret_key_2024
   
   JWT_EXPIRE = 7d
   
   NODE_ENV = production
   
   CLIENT_URL = https://craveconnect-frontend-xyz.vercel.app
   ```
   
   **Replace**:
   - `YOUR_PASSWORD` with your actual MongoDB password
   - `CLIENT_URL` with your frontend URL from Step 1

7. Click **Deploy** 🚀

**You'll get**: `https://craveconnect-backend-xyz.vercel.app`

---

## 📋 STEP 3: Update Frontend Environment Variable

1. Go to **Frontend Project** on Vercel
2. Go to **Settings** → **Environment Variables**
3. Update `REACT_APP_API_URL` to your backend URL from Step 2
4. Go to **Deployments** → Click **"Redeploy"**

---

## ✅ VERIFICATION

Test these features:

- ✅ Frontend loads
- ✅ Backend API: Visit `https://your-backend.vercel.app/api/health`
- ✅ Login works
- ✅ View recipes
- ✅ Post recipe (as Chef)
- ✅ Like, comment, rate recipes
- ✅ User profiles
- ✅ Admin panel

---

## ⚠️ Features That Won't Work (Vercel Limitation)

- ❌ Real-time chat (need to refresh to see new messages)
- ❌ Live notifications (need to refresh)
- ❌ Active users list
- ❌ Typing indicators

**All other features work perfectly!**

---

## 🎉 Your Deployed URLs

After deployment:
- **Frontend**: `https://craveconnect-frontend-xyz.vercel.app`
- **Backend**: `https://craveconnect-backend-xyz.vercel.app`

---

## 🔧 Troubleshooting

### Backend not responding:
- Check environment variables are set correctly
- Verify MongoDB URI is correct and on one line
- Check Vercel function logs

### Frontend can't connect to backend:
- Verify `REACT_APP_API_URL` is set correctly
- Make sure backend URL includes `https://`
- Redeploy frontend after updating env variables

### Database connection issues:
- Verify MongoDB Atlas credentials
- Check if IP whitelist includes `0.0.0.0/0` (allow all)
- Ensure database user has correct permissions

---

## 📝 Demo Accounts

- **Admin**: admin@craveconnect.com / admin123
- **Chef**: maria@example.com / password123
- **Foodie**: sarah@example.com / password123

---

**Deployment Complete! 🎉**
