import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { MapPin, CreditCard, AlertCircle } from 'lucide-react';
import { toast } from 'react-toastify';
import useCartStore from '../store/cartStore';
import useAuthStore from '../store/authStore';
import { orderService } from '../services/orderService';
import { paymentService } from '../services/paymentService';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || 'pk_test_placeholder');

const CheckoutForm = () => {
  const stripe = useStripe();
  const elements = useElements();
  const navigate = useNavigate();
  const { items, getCartTotal, clearCart } = useCartStore();
  const user = useAuthStore((state) => state.user);

  const [loading, setLoading] = useState(false);
  const [isSimulated, setIsSimulated] = useState(false);
  const [shippingAddress, setShippingAddress] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    street: user?.address?.street || '',
    city: user?.address?.city || 'Pune',
    state: user?.address?.state || 'Maharashtra',
    zipCode: user?.address?.zipCode || '',
    country: user?.address?.country || 'India'
  });

  useEffect(() => {
    // Check if payment is simulated
    const checkPaymentMode = async () => {
      try {
        const config = await paymentService.getStripeConfig();
        setIsSimulated(config.simulated === true);
      } catch (error) {
        console.error('Failed to check payment mode:', error);
      }
    };
    checkPaymentMode();
  }, []);

  const subtotal = getCartTotal();
  const shippingPrice = subtotal > 10000 ? 0 : 100;
  const taxPrice = subtotal * 0.18;
  const totalPrice = subtotal + shippingPrice + taxPrice;

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Only require stripe/elements for real payments
    if (!isSimulated && (!stripe || !elements)) {
      return;
    }

    // Validate shipping address
    if (!shippingAddress.name || !shippingAddress.phone || !shippingAddress.street || 
        !shippingAddress.city || !shippingAddress.state || !shippingAddress.zipCode) {
      toast.error('Please fill in all shipping address fields');
      return;
    }

    setLoading(true);

    try {
      // Create payment intent
      const paymentData = await paymentService.createPaymentIntent(totalPrice);
      const { clientSecret, paymentIntentId, simulated } = paymentData;

      let paymentResult;

      if (simulated) {
        // SIMULATED PAYMENT FLOW
        toast.info('Processing simulated payment...');
        
        // Confirm simulated payment
        paymentResult = await paymentService.confirmPayment(paymentIntentId);
        
        if (!paymentResult.success) {
          toast.error('Simulated payment failed');
          setLoading(false);
          return;
        }
      } else {
        // REAL STRIPE PAYMENT FLOW
        const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
          payment_method: {
            card: elements.getElement(CardElement),
            billing_details: {
              name: shippingAddress.name,
              email: user.email
            }
          }
        });

        if (error) {
          toast.error(error.message);
          setLoading(false);
          return;
        }

        paymentResult = {
          success: paymentIntent.status === 'succeeded',
          paymentIntentId: paymentIntent.id,
          status: paymentIntent.status
        };
      }

      if (paymentResult.success || paymentResult.status === 'succeeded') {
        // Create order
        const orderData = {
          orderItems: items.map(item => ({
            product: item._id,
            name: item.name,
            quantity: item.quantity,
            image: item.images[0],
            price: item.price
          })),
          shippingAddress,
          paymentMethod: simulated ? 'simulated' : 'stripe',
          itemsPrice: subtotal,
          taxPrice,
          shippingPrice,
          totalPrice
        };

        const order = await orderService.createOrder(orderData);

        // Update order to paid
        await orderService.updateOrderToPaid(order._id, {
          id: paymentResult.paymentIntentId,
          status: paymentResult.status || 'succeeded',
          update_time: new Date().toISOString(),
          email_address: user.email
        });

        clearCart();
        toast.success('Order placed successfully!');
        navigate(`/order/${order._id}`);
      }
    } catch (error) {
      console.error('Payment error:', error);
      toast.error(error.response?.data?.message || 'Payment failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Shipping Address */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
          <MapPin size={24} />
          Shipping Address
        </h2>

        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold mb-2">Full Name *</label>
            <input
              type="text"
              required
              value={shippingAddress.name}
              onChange={(e) => setShippingAddress({ ...shippingAddress, name: e.target.value })}
              className="input-field"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2">Phone *</label>
            <input
              type="tel"
              required
              value={shippingAddress.phone}
              onChange={(e) => setShippingAddress({ ...shippingAddress, phone: e.target.value })}
              className="input-field"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-semibold mb-2">Street Address *</label>
            <input
              type="text"
              required
              value={shippingAddress.street}
              onChange={(e) => setShippingAddress({ ...shippingAddress, street: e.target.value })}
              className="input-field"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2">City *</label>
            <input
              type="text"
              required
              value={shippingAddress.city}
              onChange={(e) => setShippingAddress({ ...shippingAddress, city: e.target.value })}
              className="input-field"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2">State *</label>
            <input
              type="text"
              required
              value={shippingAddress.state}
              onChange={(e) => setShippingAddress({ ...shippingAddress, state: e.target.value })}
              className="input-field"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2">ZIP Code *</label>
            <input
              type="text"
              required
              value={shippingAddress.zipCode}
              onChange={(e) => setShippingAddress({ ...shippingAddress, zipCode: e.target.value })}
              className="input-field"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2">Country *</label>
            <input
              type="text"
              required
              value={shippingAddress.country}
              onChange={(e) => setShippingAddress({ ...shippingAddress, country: e.target.value })}
              className="input-field"
            />
          </div>
        </div>
      </div>

      {/* Payment Information */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
          <CreditCard size={24} />
          Payment Information
        </h2>

        {isSimulated ? (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <AlertCircle className="text-yellow-600 flex-shrink-0 mt-0.5" size={20} />
              <div>
                <h3 className="font-semibold text-yellow-900 mb-1">Simulated Payment Mode</h3>
                <p className="text-sm text-yellow-800 mb-2">
                  This is a test environment. No real payment will be processed.
                </p>
                <p className="text-xs text-yellow-700">
                  Click "Place Order" to simulate a successful payment.
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div className="mb-4">
            <label className="block text-sm font-semibold mb-2">Card Details</label>
            <div className="border border-gray-300 rounded-lg p-4">
              <CardElement
                options={{
                  style: {
                    base: {
                      fontSize: '16px',
                      color: '#424770',
                      '::placeholder': {
                        color: '#aab7c4',
                      },
                    },
                    invalid: {
                      color: '#9e2146',
                    },
                  },
                }}
              />
            </div>
            <p className="text-xs text-gray-500 mt-2">
              Test card: 4242 4242 4242 4242 | Any future date | Any 3 digits
            </p>
          </div>
        )}
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={(isSimulated ? false : !stripe) || loading}
        className="w-full btn-primary py-4 text-lg"
      >
        {loading ? 'Processing...' : isSimulated ? `Place Order - ₹${totalPrice.toLocaleString('en-IN')}` : `Pay ₹${totalPrice.toLocaleString('en-IN')}`}
      </button>
    </form>
  );
};

const Checkout = () => {
  const { items, getCartTotal } = useCartStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (items.length === 0) {
      navigate('/cart');
    }
  }, [items, navigate]);

  const subtotal = getCartTotal();
  const shippingPrice = subtotal > 10000 ? 0 : 100;
  const taxPrice = subtotal * 0.18;
  const totalPrice = subtotal + shippingPrice + taxPrice;

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold mb-8">Checkout</h1>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Checkout Form */}
          <div className="lg:col-span-2">
            <Elements stripe={stripePromise}>
              <CheckoutForm />
            </Elements>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 sticky top-24">
              <h2 className="text-xl font-bold mb-6">Order Summary</h2>

              <div className="space-y-4 mb-6">
                {items.map((item) => (
                  <div key={item._id} className="flex gap-4">
                    <img
                      src={item.images[0]}
                      alt={item.name}
                      className="w-16 h-16 object-cover rounded-lg"
                    />
                    <div className="flex-grow">
                      <h4 className="font-medium text-sm">{item.name}</h4>
                      <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
                    </div>
                    <span className="font-semibold">
                      ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                    </span>
                  </div>
                ))}
              </div>

              <div className="space-y-3 border-t pt-4">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-semibold">₹{subtotal.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Shipping</span>
                  <span className="font-semibold">
                    {shippingPrice === 0 ? 'FREE' : `₹${shippingPrice.toLocaleString('en-IN')}`}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Tax (18%)</span>
                  <span className="font-semibold">₹{taxPrice.toLocaleString('en-IN')}</span>
                </div>
                <div className="border-t pt-3">
                  <div className="flex justify-between text-lg">
                    <span className="font-bold">Total</span>
                    <span className="font-bold text-primary-600">
                      ₹{totalPrice.toLocaleString('en-IN')}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
