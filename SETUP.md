# TechFusion Setup Guide

## Quick Start Guide

### 1. Install Dependencies

**Backend:**
```bash
cd backend
npm install
```

**Frontend:**
```bash
cd frontend
npm install
```

### 2. Setup Environment Variables

**Backend (.env):**
Create `backend/.env` file:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/techfusion
JWT_SECRET=techfusion_secret_key_2024
JWT_EXPIRE=7d
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key
NODE_ENV=development
```

**Frontend (.env):**
Create `frontend/.env` file:
```env
VITE_API_URL=http://localhost:5000/api
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key
```

### 3. Setup MongoDB

**Option A: Local MongoDB**
1. Install MongoDB from https://www.mongodb.com/try/download/community
2. Start MongoDB service:
   - Windows: MongoDB starts automatically
   - Mac: `brew services start mongodb-community`
   - Linux: `sudo systemctl start mongod`

**Option B: MongoDB Atlas (Cloud)**
1. Create account at https://www.mongodb.com/cloud/atlas
2. Create a cluster
3. Get connection string and update `MONGODB_URI` in backend/.env

### 4. Setup Stripe

1. Create account at https://stripe.com
2. Go to Developers → API keys
3. Copy "Publishable key" to frontend/.env
4. Copy "Secret key" to backend/.env

**Test Cards:**
- Success: 4242 4242 4242 4242
- Decline: 4000 0000 0000 0002

### 5. Seed Database

Run the seed script to populate initial data:
```bash
cd backend
node seed.js
```

This creates:
- Admin and user accounts for testing
- 12 sample products with Indian pricing (₹)

### 6. Start the Application

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```
Backend runs at: http://localhost:5000

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```
Frontend runs at: http://localhost:3000

### 7. Access the Application

- **Frontend:** http://localhost:3000
- **Backend API:** http://localhost:5000/api
- **API Health Check:** http://localhost:5000/api/health

## Testing the Application

### 1. User Flow
1. Register a new account or login
2. Browse products (prices in ₹) and add to cart
3. Proceed to checkout
4. Fill shipping address (default: Pune, Maharashtra, India)
5. Use test card: 4242 4242 4242 4242
6. Complete payment and view order
7. Note: Free shipping on orders above ₹10,000

### 2. Admin Flow
1. Login with admin account (created via seed script)
2. Access admin dashboard at http://localhost:3000/admin
3. Create/edit/delete products with Indian pricing
4. View and manage orders
5. Update order status (pending, processing, shipped, delivered)

## Common Issues

### MongoDB Connection Error
- Ensure MongoDB is running
- Check MONGODB_URI in .env
- For Atlas, check IP whitelist

### Port Already in Use
- Change PORT in backend/.env
- Update VITE_API_URL in frontend/.env accordingly

### Stripe Payment Fails
- Verify Stripe keys are correct
- Use test card numbers only in test mode
- Check browser console for errors

### CORS Errors
- Ensure backend is running
- Check VITE_API_URL matches backend URL
- Verify cors is configured in server.js

## Production Deployment

### Backend (Node.js)
1. Set NODE_ENV=production
2. Use production MongoDB URI
3. Use production Stripe keys
4. Deploy to: Heroku, Railway, Render, or DigitalOcean

### Frontend (React)
1. Run `npm run build`
2. Deploy `dist` folder to: Vercel, Netlify, or AWS S3

### Environment Variables
Update all environment variables for production:
- Use production database
- Use production Stripe keys
- Update API URLs
- Use secure JWT secret

## Additional Configuration

### Custom Port
Change in backend/.env:
```env
PORT=8000
```

Update frontend/.env:
```env
VITE_API_URL=http://localhost:8000/api
```

### Email Notifications (Future Enhancement)
Add email service credentials to backend/.env:
```env
EMAIL_SERVICE=gmail
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
```

## Support

For issues:
1. Check this setup guide
2. Review README.md
3. Check console logs
4. Open GitHub issue

## Next Steps

After setup:
1. Customize product categories
2. Add more products
3. Configure email notifications
4. Setup analytics
5. Add more payment methods
6. Implement wishlist feature
7. Add product comparison
