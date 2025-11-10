# Payment Error: "You did not provide API" - Quick Fix

## This error means your Stripe API keys are missing or incorrect.

---

## ✅ Step-by-Step Fix

### Step 1: Check Your Backend `.env` File

Open `backend/.env` (it's currently open in your editor on line 11)

**Make sure it has these EXACT lines:**

```env
STRIPE_SECRET_KEY=sk_test_your_actual_key_here
STRIPE_PUBLISHABLE_KEY=pk_test_your_actual_key_here
```

**⚠️ Common Mistakes:**
- ❌ Don't use quotes around the keys
- ❌ No spaces before or after the `=` sign
- ❌ Don't leave them as placeholder values
- ❌ Don't use live keys (`sk_live_...`) in development

**✅ Correct Format:**
```env
STRIPE_SECRET_KEY=sk_test_51AbCdEf123456789...
STRIPE_PUBLISHABLE_KEY=pk_test_51AbCdEf123456789...
```

---

### Step 2: Check Your Frontend `.env` File

Create or edit `frontend/.env`:

```env
VITE_API_URL=http://localhost:5000/api
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_your_actual_key_here
```

**⚠️ Important:**
- Use the SAME `pk_test_...` key from Step 1
- Must start with `VITE_` for Vite to load it
- No quotes needed

---

### Step 3: Get Your Stripe Keys (If You Don't Have Them)

1. Go to [https://dashboard.stripe.com/test/apikeys](https://dashboard.stripe.com/test/apikeys)
2. Make sure you're in **Test mode** (toggle in top right)
3. Copy:
   - **Publishable key**: Starts with `pk_test_`
   - **Secret key**: Click "Reveal test key", starts with `sk_test_`

---

### Step 4: Restart BOTH Servers (REQUIRED!)

**Backend:**
```bash
# Stop the backend server (Ctrl+C if running)
cd backend
npm run dev
```

**You should see:**
```
Server running in development mode on port 5000
MongoDB Connected: ...
```

**If you see an error like:**
```
❌ STRIPE_SECRET_KEY is not defined in .env file
```
→ Go back to Step 1 and add the key to `backend/.env`

**Frontend:**
```bash
# Stop the frontend server (Ctrl+C if running)  
cd frontend
npm run dev
```

---

### Step 5: Test the Payment

1. Add items to cart
2. Go to checkout: `http://localhost:5173/checkout`
3. Fill in shipping address
4. Use test card:
   - **Card Number:** `4242 4242 4242 4242`
   - **Expiry:** `12/34`
   - **CVC:** `123`
   - **ZIP:** `12345`
5. Click "Place Order"

---

## 🔍 Still Not Working?

### Check Browser Console (F12)
Look for errors like:
- "Stripe has not been properly initialized"
- "Invalid API Key provided"

### Check Backend Terminal
Look for:
- `❌ STRIPE_SECRET_KEY is not defined` → Add key to backend/.env
- Server crashes on startup → Check for typos in .env file

### Verify Environment Variables Are Loaded

**Backend - Add this temporary check:**
In `backend/server.js`, after line 13 (`dotenv.config();`), add:

```javascript
console.log('🔑 Stripe Secret Key:', process.env.STRIPE_SECRET_KEY ? '✅ Loaded' : '❌ Missing');
console.log('🔑 Stripe Publishable Key:', process.env.STRIPE_PUBLISHABLE_KEY ? '✅ Loaded' : '❌ Missing');
```

Restart backend and check if both show `✅ Loaded`.

**Frontend - Check in browser console:**
```javascript
console.log('Stripe Key:', import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);
```

Should show your `pk_test_...` key (not undefined).

---

## 📝 Checklist

- [ ] Backend `.env` has `STRIPE_SECRET_KEY=sk_test_...`
- [ ] Backend `.env` has `STRIPE_PUBLISHABLE_KEY=pk_test_...`
- [ ] Frontend `.env` has `VITE_STRIPE_PUBLISHABLE_KEY=pk_test_...`
- [ ] Both keys are from the SAME Stripe account
- [ ] Both keys are in TEST mode (not live)
- [ ] No extra spaces or quotes in .env files
- [ ] Restarted backend server
- [ ] Restarted frontend server
- [ ] Can see "✅ Loaded" for both keys in backend console

---

## 💡 Quick Test

After following all steps, try this API test:

**In your browser, go to:**
```
http://localhost:5000/api/payment/config
```

**You should see:**
```json
{
  "publishableKey": "pk_test_your_key_here"
}
```

**If you see:**
```json
{
  "publishableKey": ""
}
```
→ The backend `.env` file doesn't have `STRIPE_PUBLISHABLE_KEY`

---

## Need Stripe Keys?

1. Sign up free at [stripe.com](https://stripe.com)
2. No credit card required
3. Test mode gives you unlimited free testing
4. Keys are in: Dashboard → Developers → API keys
