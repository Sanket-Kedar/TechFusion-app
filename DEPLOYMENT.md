# 🚀 TechFusion Deployment Guide

This guide will help you deploy your MERN stack application to free cloud hosting platforms.

## Prerequisites

- GitHub account
- MongoDB Atlas account
- Vercel account
- Render account

---

## 📊 Step 1: Setup MongoDB Atlas (Database)

### 1.1 Create Free Cluster

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Sign up or log in
3. Click **"Create"** → **"Shared"** (Free M0 tier)
4. Choose a cloud provider (AWS recommended)
5. Select a region close to you
6. Click **"Create Cluster"**

### 1.2 Configure Database Access

1. Go to **"Database Access"** → **"Add New Database User"**
2. Create username and password (save these!)
3. Set privileges to **"Read and write to any database"**

### 1.3 Configure Network Access

1. Go to **"Network Access"** → **"Add IP Address"**
2. Click **"Allow Access from Anywhere"** (0.0.0.0/0)
3. Or add specific IPs for better security

### 1.4 Get Connection String

1. Click **"Connect"** on your cluster
2. Choose **"Connect your application"**
3. Copy the connection string:
   ```
   mongodb+srv://username:<password>@cluster0.xxxxx.mongodb.net/techfusion?retryWrites=true&w=majority
   ```
4. Replace `<password>` with your actual password
5. Replace `techfusion` with your database name

---

## 🖥️ Step 2: Deploy Backend to Render

### 2.1 Sign Up

1. Go to [Render](https://render.com)
2. Sign up with GitHub

### 2.2 Create Web Service

1. Click **"New +"** → **"Web Service"**
2. Connect your GitHub repository
3. Configure:
   - **Name**: `techfusion-backend`
   - **Environment**: `Node`
   - **Region**: Choose closest to you
   - **Branch**: `main`
   - **Build Command**: `cd backend && npm install`
   - **Start Command**: `cd backend && npm start`
   - **Plan**: `Free`

### 2.3 Add Environment Variables

Click **"Environment"** and add:

```env
NODE_ENV=production
PORT=5000
MONGODB_URI=your_mongodb_atlas_connection_string
JWT_SECRET=your_super_secret_jwt_key_min_32_chars
JWT_EXPIRE=7d
CLIENT_URL=https://your-frontend-url.vercel.app
CLOUDINARY_CLOUD_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_cloudinary_key
CLOUDINARY_API_SECRET=your_cloudinary_secret
```

### 2.4 Deploy

1. Click **"Create Web Service"**
2. Wait for deployment (5-10 minutes)
3. Copy your backend URL: `https://techfusion-backend.onrender.com`

**⚠️ Note**: Free tier sleeps after 15 minutes of inactivity. First request after sleep takes 30-50 seconds.

---

## 🎨 Step 3: Deploy Frontend to Vercel

### 3.1 Install Vercel CLI (Optional)

```bash
npm install -g vercel
```

### 3.2 Deploy via Vercel Dashboard

1. Go to [Vercel](https://vercel.com)
2. Sign up with GitHub
3. Click **"Add New Project"**
4. Import your GitHub repository
5. Configure:
   - **Framework Preset**: `Vite`
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`

### 3.3 Add Environment Variables

Click **"Environment Variables"** and add:

```env
VITE_API_URL=https://techfusion-backend.onrender.com/api
```

### 3.4 Deploy

1. Click **"Deploy"**
2. Wait for deployment (2-5 minutes)
3. Your site will be live at: `https://your-project.vercel.app`

### 3.5 Update Backend CLIENT_URL

Go back to Render → Environment Variables → Update:
```env
CLIENT_URL=https://your-project.vercel.app
```

---

## 🗄️ Step 4: Seed Database (Optional)

### 4.1 Run Seed Script

You can seed your database with initial products and admin user:

**Option 1: Local with production DB**
```bash
cd backend
# Update .env with production MONGODB_URI
node seed.js
```

**Option 2: Via Render Shell**
1. Go to Render Dashboard
2. Click on your backend service
3. Go to **"Shell"** tab
4. Run: `node seed.js`

---

## ✅ Step 5: Test Your Deployment

### 5.1 Test Backend

Visit: `https://techfusion-backend.onrender.com/api/products`

Should return JSON with products.

### 5.2 Test Frontend

1. Visit your Vercel URL
2. Test user registration/login
3. Test product browsing
4. Test cart functionality
5. Test checkout

### 5.3 Test Admin Panel

1. Login with admin credentials:
   - Email: `admin@techfusion.com`
   - Password: `admin@9396`
2. Test product management
3. Test order management

---

## 🔧 Troubleshooting

### Backend Issues

**Problem**: "Application error" or 503
- **Solution**: Check Render logs, verify environment variables

**Problem**: Database connection failed
- **Solution**: Verify MongoDB connection string, check network access

**Problem**: CORS errors
- **Solution**: Verify CLIENT_URL matches your Vercel URL

### Frontend Issues

**Problem**: API calls failing
- **Solution**: Verify VITE_API_URL in Vercel environment variables

**Problem**: 404 on page refresh
- **Solution**: Vercel handles this automatically with React Router

### Performance Issues

**Problem**: Backend slow to respond
- **Solution**: Free tier sleeps after 15 mins. Consider paid plan or use services like UptimeRobot to ping every 14 minutes

---

## 📝 Environment Variables Checklist

### Backend (Render)
- ✅ `NODE_ENV=production`
- ✅ `PORT=5000`
- ✅ `MONGODB_URI` (from MongoDB Atlas)
- ✅ `JWT_SECRET` (random 32+ character string)
- ✅ `JWT_EXPIRE=7d`
- ✅ `CLIENT_URL` (your Vercel URL)
- ⚠️ `CLOUDINARY_CLOUD_NAME` (optional, for image uploads)
- ⚠️ `CLOUDINARY_API_KEY` (optional)
- ⚠️ `CLOUDINARY_API_SECRET` (optional)

### Frontend (Vercel)
- ✅ `VITE_API_URL` (your Render backend URL + /api)

---

## 🎉 You're Live!

Your TechFusion e-commerce platform is now deployed and accessible worldwide!

- **Frontend**: `https://your-project.vercel.app`
- **Backend**: `https://techfusion-backend.onrender.com`
- **Database**: MongoDB Atlas

---

## 💡 Tips

1. **Custom Domain**: Add a custom domain in Vercel (free)
2. **SSL**: Both Vercel and Render provide free SSL certificates
3. **Monitoring**: Use Render's built-in logs for debugging
4. **Analytics**: Add Google Analytics or Vercel Analytics
5. **Performance**: Consider upgrading to paid plans for better performance

---

## 🆕 Updating Your Deployment

### Auto-Deploy on Git Push

Both Vercel and Render support automatic deployments:

1. Push code to GitHub: `git push origin main`
2. Vercel and Render will automatically detect changes
3. Your app will redeploy automatically (3-10 minutes)

### Manual Deploy

**Vercel**: Click "Redeploy" in dashboard  
**Render**: Click "Manual Deploy" → "Deploy latest commit"

---

## 📚 Alternative Free Platforms

If you want to try other platforms:

### Frontend Alternatives
- **Netlify**: Similar to Vercel
- **Cloudflare Pages**: Good for static sites
- **GitHub Pages**: Requires hash router

### Backend Alternatives
- **Railway**: 500 hours/month free
- **Fly.io**: Good free tier
- **Cyclic**: Easy deployment
- **Heroku**: Limited free tier (eco dyno)

---

## 🔐 Security Recommendations

1. ✅ Use strong JWT_SECRET (32+ random characters)
2. ✅ Enable MongoDB Atlas IP whitelist
3. ✅ Keep environment variables secure
4. ✅ Use HTTPS only (provided by default)
5. ✅ Regular security updates: `npm audit fix`

---

## 📞 Need Help?

- Render Docs: https://render.com/docs
- Vercel Docs: https://vercel.com/docs
- MongoDB Atlas Docs: https://docs.atlas.mongodb.com/

---

**Happy Deploying! 🚀**
