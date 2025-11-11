# TechFusion - Premium Electronics Ecommerce Store

A full-stack MERN (MongoDB, Express, React, Node.js) ecommerce application for selling premium electronics with admin dashboard, user authentication, shopping cart, and Stripe payment integration.

## Features

### User Features
- 🛍️ Browse products with filtering and search
- 🛒 Shopping cart with persistent storage
- 💳 Secure checkout with Stripe payment gateway
- 👤 User authentication (JWT)
- 📦 Order tracking and history
- ⭐ Product reviews and ratings
- 📱 Responsive design with modern UI

### Admin Features
- 📊 Admin dashboard with statistics
- ➕ Create, update, and delete products
- 📋 Manage orders and update status
- 🎯 Mark products as featured
- 📈 View revenue and order analytics

## Tech Stack

### Frontend
- **React 18** - UI library
- **Vite** - Build tool
- **TailwindCSS** - Styling
- **Zustand** - State management
- **React Router** - Routing
- **Axios** - HTTP client
- **Stripe React** - Payment integration
- **Lucide React** - Icons
- **React Toastify** - Notifications

### Backend
- **Node.js** - Runtime
- **Express** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM
- **JWT** - Authentication
- **Bcrypt** - Password hashing
- **Stripe** - Payment processing

## Installation

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or Atlas)
- Stripe account (for payment testing)

### Backend Setup

1. Navigate to backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file:
```bash
cp .env.example .env
```

4. Configure environment variables in `.env`:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/techfusion
JWT_SECRET=your_secret_key_here
STRIPE_SECRET_KEY=your_stripe_secret_key
```

5. Start the server:
```bash
npm run dev
```

The backend will run on http://localhost:5000

### Frontend Setup

1. Navigate to frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file:
```bash
cp .env.example .env
```

4. Configure environment variables in `.env`:
```env
VITE_API_URL=http://localhost:5000/api
VITE_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
```

5. Start the development server:
```bash
npm run dev
```

The frontend will run on http://localhost:3000

## Getting Started

After installation, you'll need to seed the database to create initial admin and user accounts along with sample products. Run the seed script as described in the setup section.

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user
- `PUT /api/auth/profile` - Update profile

### Products
- `GET /api/products` - Get all products
- `GET /api/products/:id` - Get single product
- `POST /api/products` - Create product (Admin)
- `PUT /api/products/:id` - Update product (Admin)
- `DELETE /api/products/:id` - Delete product (Admin)
- `POST /api/products/:id/reviews` - Add review

### Orders
- `POST /api/orders` - Create order
- `GET /api/orders/:id` - Get order
- `GET /api/orders/myorders` - Get user orders
- `GET /api/orders` - Get all orders (Admin)
- `PUT /api/orders/:id/pay` - Update to paid
- `PUT /api/orders/:id/status` - Update status (Admin)

### Payment
- `POST /api/payment/create-payment-intent` - Create Stripe payment intent
- `GET /api/payment/config` - Get Stripe config

## Testing Stripe Payments

Use these test card numbers:
- **Success:** 4242 4242 4242 4242
- **Decline:** 4000 0000 0000 0002
- Use any future date for expiry and any 3 digits for CVC

## Project Structure

```
TechFusion-app/
├── backend/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   └── server.js
└── frontend/
    ├── public/
    └── src/
        ├── components/
        ├── pages/
        │   └── admin/
        ├── services/
        ├── store/
        ├── utils/
        ├── App.jsx
        └── main.jsx
```

## Features Breakdown

### Shopping Experience
- Product catalog with categories
- Advanced filtering (category, brand, search)
- Product detail pages with images
- Add to cart functionality
- Cart management (update quantities, remove items)
- Order summary with tax (18% GST) and shipping calculation
- Free shipping on orders over ₹10,000

### Payment Integration
- Stripe payment processing
- Secure card input with validation
- Payment confirmation
- Order receipt

### User Management
- JWT-based authentication
- Protected routes
- User profile management
- Order history
- Shipping address management

### Admin Panel
- Dashboard with key metrics
- Product management (CRUD)
- Order management
- Status updates
- Revenue tracking

## Scripts

### Backend
- `npm start` - Start production server
- `npm run dev` - Start development server with nodemon

### Frontend
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build

## 🚀 Deployment

This app can be deployed to free cloud hosting platforms:

### Quick Deployment (~30 minutes)
1. **Database**: MongoDB Atlas (Free M0 cluster)
2. **Backend**: Render (Free tier)
3. **Frontend**: Vercel (Free tier)

### Deployment Files Included
- `render.yaml` - Render configuration
- `vercel.json` - Vercel configuration
- `DEPLOYMENT.md` - Detailed deployment guide
- `DEPLOY_CHECKLIST.md` - Quick deployment checklist

### Quick Start
```bash
# 1. Push to GitHub
git push origin main

# 2. Follow DEPLOY_CHECKLIST.md for step-by-step instructions

# 3. Your app will be live in ~30 minutes!
```

**📚 Read Full Guide**: See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed instructions.

### Live Demo URLs
- Frontend: https://techfusion-app.vercel.app/
- Backend: https://techfusion-app.onrender.com/
### Free Tier Limitations
- **Render**: Backend sleeps after 15 min inactivity (30-50s wake time)
- **Vercel**: Unlimited bandwidth for hobby projects
- **MongoDB Atlas**: 512MB storage

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License.



