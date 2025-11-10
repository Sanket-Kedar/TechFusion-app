# 🚀 Quick Deployment Checklist

Follow this checklist to deploy your TechFusion app in ~30 minutes.

## ☑️ Pre-Deployment Checklist

- [ ] Code pushed to GitHub
- [ ] MongoDB Atlas account created
- [ ] Vercel account created (free)
- [ ] Render account created (free)
- [ ] Cloudinary account created (optional, for image uploads)

---

## 📋 Step-by-Step Deployment

### 1️⃣ MongoDB Atlas (5 minutes)

- [ ] Create free M0 cluster
- [ ] Create database user (save username & password)
- [ ] Allow access from anywhere (0.0.0.0/0)
- [ ] Copy connection string
- [ ] Replace `<password>` in connection string
- [ ] Add database name to connection string

**Connection String Format:**
```
mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/techfusion?retryWrites=true&w=majority
```

---

### 2️⃣ Render - Backend Deployment (10 minutes)

- [ ] Sign up at render.com with GitHub
- [ ] Click "New +" → "Web Service"
- [ ] Connect your GitHub repository
- [ ] Configure service:
  - Name: `techfusion-backend`
  - Environment: `Node`
  - Branch: `main`
  - Build Command: `cd backend && npm install`
  - Start Command: `cd backend && npm start`
  - Plan: `Free`

- [ ] Add environment variables in Render:
  ```env
  NODE_ENV=production
  PORT=5000
  MONGODB_URI=your_mongodb_connection_string
  JWT_SECRET=create_a_long_random_string_at_least_32_characters
  JWT_EXPIRE=7d
  CLIENT_URL=https://your-app-name.vercel.app
  ```

- [ ] Click "Create Web Service"
- [ ] Wait for deployment (5-10 mins)
- [ ] Copy your backend URL: `https://techfusion-backend-xxxx.onrender.com`
- [ ] Test: Visit `https://your-backend-url.onrender.com/api/health`

---

### 3️⃣ Vercel - Frontend Deployment (5 minutes)

- [ ] Sign up at vercel.com with GitHub
- [ ] Click "Add New Project"
- [ ] Import your GitHub repository
- [ ] Configure:
  - Framework: `Vite`
  - Root Directory: `frontend`
  - Build Command: `npm run build`
  - Output Directory: `dist`

- [ ] Add environment variable:
  ```env
  VITE_API_URL=https://your-render-backend-url.onrender.com/api
  ```

- [ ] Click "Deploy"
- [ ] Wait for deployment (2-5 mins)
- [ ] Copy your frontend URL: `https://your-app-name.vercel.app`

---

### 4️⃣ Update Backend CLIENT_URL (2 minutes)

- [ ] Go back to Render dashboard
- [ ] Click your backend service
- [ ] Go to "Environment" tab
- [ ] Update `CLIENT_URL` to your Vercel URL
- [ ] Click "Save Changes"
- [ ] Service will auto-redeploy

---

### 5️⃣ Seed Database (5 minutes)

**Option A: Via Render Shell**
- [ ] Go to Render dashboard → Your service
- [ ] Click "Shell" tab
- [ ] Run: `cd backend && node seed.js`
- [ ] Wait for completion

**Option B: Locally**
- [ ] Update local `.env` with production MONGODB_URI
- [ ] Run: `cd backend && node seed.js`
- [ ] Restore local `.env`

---

### 6️⃣ Test Everything (5 minutes)

#### Backend Tests
- [ ] Visit: `https://your-backend.onrender.com/api/health` → Should return JSON
- [ ] Visit: `https://your-backend.onrender.com/api/products` → Should return products

#### Frontend Tests
- [ ] Visit your Vercel URL
- [ ] Homepage loads correctly
- [ ] Products page shows items
- [ ] Register new user
- [ ] Login works
- [ ] Cart functionality works
- [ ] Checkout flow works

#### Admin Tests
- [ ] Login as admin:
  - Email: `admin@techfusion.com`
  - Password: `admin@9396`
- [ ] Admin dashboard accessible
- [ ] Can view/manage products
- [ ] Can view/manage orders

---

## ✅ Deployment Complete!

Your URLs:
- **Frontend**: https://your-app-name.vercel.app
- **Backend**: https://techfusion-backend-xxxx.onrender.com
- **Database**: MongoDB Atlas

---

## 🔄 Future Updates

To update your deployed app:

1. Make code changes locally
2. Commit: `git add . && git commit -m "Your message"`
3. Push: `git push origin main`
4. Both Vercel and Render will auto-deploy! ✨

---

## ⚠️ Important Notes

1. **Free Tier Limitations:**
   - Render: Backend sleeps after 15 min inactivity (30-50s wake-up time)
   - Vercel: Unlimited bandwidth for hobby projects
   - MongoDB Atlas: 512MB storage limit

2. **First Load Slow?**
   - This is normal for Render free tier
   - Consider paid plan ($7/month) for always-on backend

3. **Custom Domain?**
   - Vercel allows free custom domains
   - Just add DNS records and configure in Vercel dashboard

---

## 🆘 Troubleshooting

### Backend not deploying?
- Check Render logs for errors
- Verify all environment variables are set
- Ensure MongoDB connection string is correct

### Frontend shows blank page?
- Check browser console for errors
- Verify VITE_API_URL is correct
- Check network tab for failed API calls

### CORS errors?
- Verify CLIENT_URL in Render matches your Vercel URL exactly
- No trailing slash in URLs

### Database connection failed?
- Check MongoDB Atlas network access (0.0.0.0/0)
- Verify connection string format
- Check username/password are correct

---

## 📞 Need Help?

Refer to full deployment guide: `DEPLOYMENT.md`

---

**🎉 Happy Deploying!**
