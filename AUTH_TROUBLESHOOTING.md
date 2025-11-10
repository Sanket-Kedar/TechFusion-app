# Registration & Login Failed - Troubleshooting Guide

## Problem Fixed
Registration and login were failing due to API configuration issues. This has been fixed.

---

## What Was Wrong?

The frontend was trying to connect directly to `http://localhost:5000/api`, which caused CORS (Cross-Origin Resource Sharing) errors. Your app has a proxy configured in `vite.config.js` that should handle this, but it wasn't being used.

---

## ✅ Fixes Applied

1. **Updated API configuration** (`frontend/src/utils/api.js`)
   - Changed from full URL to relative path `/api`
   - Now uses Vite's proxy configuration
   - Avoids CORS issues

2. **Updated image upload** (`frontend/src/pages/admin/AdminProductForm.jsx`)
   - Fixed to use relative path

3. **Updated .env examples**
   - Added `CLIENT_URL` to backend
   - Clarified VITE_API_URL usage in frontend

---

## 🔧 What You Need to Do

### Step 1: Check Your Backend .env File
Make sure `backend/.env` has:

```env
PORT=5000
CLIENT_URL=http://localhost:3000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
```

### Step 2: Check Your Frontend .env File
Your `frontend/.env` should look like:

```env
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_your_key_here
```

**IMPORTANT:** Do NOT add `VITE_API_URL` in development mode. The proxy will handle it.

### Step 3: Restart Both Servers

**Backend:**
```bash
cd backend
# Stop if running (Ctrl+C)
npm run dev
```

**Frontend:**
```bash
cd frontend
# Stop if running (Ctrl+C)
npm run dev
```

### Step 4: Test Registration
1. Go to `http://localhost:3000/register`
2. Fill in the form:
   - Name: Your Name
   - Email: test@example.com
   - Password: test123
   - Confirm Password: test123
3. Click Register

Should show: ✅ "Registration successful!"

### Step 5: Test Login
1. Go to `http://localhost:3000/login`
2. Use your credentials
3. Should redirect to home page

---

## 🔍 Still Having Issues?

### Issue: "Network Error" or "Failed to fetch"

**Check Backend is Running:**
```bash
# Test backend health
curl http://localhost:5000/api/health
```

Should return:
```json
{"message": "TechFusion API is running"}
```

**If backend isn't running:**
- Check backend terminal for errors
- Look for MongoDB connection errors
- Ensure port 5000 isn't in use by another app

### Issue: "Registration failed" with no other error

**Check Backend Logs:**
Look in your backend terminal for error messages like:
- MongoDB connection errors
- Missing JWT_SECRET
- Database save errors

**Common causes:**
1. **MongoDB not connected**
   - Check `MONGODB_URI` in backend/.env
   - Ensure MongoDB is running (if local)
   - Check MongoDB Atlas connection (if cloud)

2. **Missing JWT_SECRET**
   - Add `JWT_SECRET=your_secret_key_here` to backend/.env

3. **Password hashing issue**
   - Should be fixed after running seed script

### Issue: "User already exists"

This means the email is already registered. Try:
- Different email
- Or check MongoDB to see existing users

### Issue: Login works but immediately logs out

**Check:**
1. JWT_SECRET is set in backend/.env
2. Token is being saved (check browser DevTools → Application → Local Storage)
3. No console errors about invalid tokens

---

## 🧪 Test Your Setup

### 1. Test Backend Health
```bash
curl http://localhost:5000/api/health
```
Expected: `{"message": "TechFusion API is running"}`

### 2. Test Registration API
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@example.com","password":"test123"}'
```
Expected: User object with token

### 3. Check Browser Console
- Open DevTools (F12)
- Go to Console tab
- Look for errors during registration/login
- Common errors:
  - CORS errors → Check CLIENT_URL in backend/.env
  - 404 errors → Backend not running
  - 500 errors → Check backend terminal logs

### 4. Check Network Tab
- Open DevTools (F12) → Network tab
- Try to register
- Look for API calls:
  - Should see: `POST /api/auth/register`
  - Status should be: 200 or 201
  - If 400/500: Check backend logs

---

## 📝 Checklist

Before you test, ensure:
- [ ] Backend is running on port 5000
- [ ] Frontend is running on port 3000
- [ ] MongoDB is connected (check backend logs)
- [ ] JWT_SECRET is in backend/.env
- [ ] CLIENT_URL is in backend/.env
- [ ] Both servers restarted after changes
- [ ] Browser cache cleared (Ctrl+Shift+R)
- [ ] No VITE_API_URL in frontend/.env (let proxy handle it)

---

## 🎯 Quick Test Commands

Run these in your terminal to verify everything:

```bash
# Check if backend is running
curl http://localhost:5000/api/health

# Check if frontend is accessible
curl http://localhost:3000

# Test registration (change email if user exists)
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test","email":"test123@test.com","password":"test123"}'
```

---

## 💡 Pro Tips

1. **Always check both terminals** (backend and frontend) for errors
2. **Clear browser cache** if things don't update (Ctrl+Shift+R)
3. **Check MongoDB connection** in backend terminal startup logs
4. **Use browser DevTools** to see actual API errors
5. **Test with curl** to isolate frontend vs backend issues

---

## Need More Help?

If still not working:
1. Check backend terminal - what errors do you see?
2. Check browser console - any red errors?
3. What exact error message appears?
4. Did you restart both servers?
