# Stripe Payment Setup Guide

## Why Payment is Not Working
Your payment system requires Stripe API keys to be configured. Without these keys, the payment gateway cannot process transactions.

## Setup Instructions

### Step 1: Get Stripe API Keys

#### Option A: Use Test Mode (Recommended for Development)
1. Go to [https://stripe.com](https://stripe.com)
2. Create a free account (no credit card required for testing)
3. After login, click **"Developers"** in the top menu
4. Click **"API keys"** in the left sidebar
5. You'll see two test keys:
   - **Publishable key** (starts with `pk_test_...`)
   - **Secret key** (starts with `sk_test_...`) - Click "Reveal test key"

#### Option B: Use Production Mode (For Live Payments)
1. Complete Stripe account verification
2. Toggle from "Test mode" to "Live mode"
3. Get live keys (starts with `pk_live_...` and `sk_live_...`)

---

### Step 2: Configure Backend Environment Variables

Open `backend/.env` and add:

```env
STRIPE_SECRET_KEY=sk_test_your_secret_key_here
STRIPE_PUBLISHABLE_KEY=pk_test_your_publishable_key_here
```

**Replace with your actual keys from Step 1**

---

### Step 3: Configure Frontend Environment Variables

Open `frontend/.env` and add:

```env
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_your_publishable_key_here
```

**Use the same publishable key from Step 2**

---

### Step 4: Restart Both Servers

**Backend:**
```bash
cd backend
npm run dev
```

**Frontend:**
```bash
cd frontend
npm run dev
```

---

## Testing Payment

### Test Card Numbers (Test Mode Only)

Stripe provides test card numbers for testing:

#### Successful Payment:
- **Card Number:** `4242 4242 4242 4242`
- **Expiry:** Any future date (e.g., `12/34`)
- **CVC:** Any 3 digits (e.g., `123`)
- **ZIP:** Any 5 digits (e.g., `12345`)

#### Declined Payment:
- **Card Number:** `4000 0000 0000 0002`
- **Expiry:** Any future date
- **CVC:** Any 3 digits

#### Requires Authentication (3D Secure):
- **Card Number:** `4000 0025 0000 3155`
- **Expiry:** Any future date
- **CVC:** Any 3 digits

More test cards: [https://stripe.com/docs/testing](https://stripe.com/docs/testing)

---

## Verifying Setup

### 1. Check Frontend Console
- Open browser DevTools (F12)
- Look for Stripe-related errors
- Should see Stripe.js loaded successfully

### 2. Check Backend Logs
- Look for Stripe API connection
- No errors about missing API keys

### 3. Test Payment Flow
1. Add items to cart
2. Go to checkout
3. Fill in shipping details
4. Use test card: `4242 4242 4242 4242`
5. Complete payment
6. Check if order is created

---

## Common Issues

### Issue: "Invalid API Key provided"
**Solution:** Double-check your API keys are copied correctly without extra spaces

### Issue: "Stripe has not been properly initialized"
**Solution:** Ensure VITE_STRIPE_PUBLISHABLE_KEY is set in frontend/.env and server is restarted

### Issue: "No such payment_intent"
**Solution:** Make sure backend STRIPE_SECRET_KEY matches the frontend STRIPE_PUBLISHABLE_KEY (both test or both live)

### Issue: Payment succeeds but order not created
**Solution:** Check backend MongoDB connection and order service logs

---

## Important Notes

### Test Mode vs Live Mode
- ✅ **Test Mode:** Use for development - No real money charged
- ⚠️ **Live Mode:** Use for production - Real transactions

### Security
- ❌ Never commit `.env` files with real keys to Git
- ✅ Always use environment variables
- ✅ Keep secret keys SECRET (never expose in frontend code)

### Stripe Dashboard
- View all test transactions at [https://dashboard.stripe.com/test/payments](https://dashboard.stripe.com/test/payments)
- View live transactions at [https://dashboard.stripe.com/payments](https://dashboard.stripe.com/payments)

---

## Next Steps

After setting up Stripe:
1. ✅ Test checkout with test card
2. ✅ Verify order creation in database
3. ✅ Check admin panel for new orders
4. ✅ Test different payment scenarios (success, decline, etc.)

For production deployment, switch to live Stripe keys and complete Stripe account verification.
