import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Trash2, Plus, Minus, ShoppingBag } from 'lucide-react';
import useCartStore from '../store/cartStore';
import useAuthStore from '../store/authStore';

const Cart = () => {
  const { items, removeFromCart, updateQuantity, getCartTotal } = useCartStore();
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const navigate = useNavigate();

  const handleCheckout = () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    navigate('/checkout');
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12">
        <div className="text-center">
          <ShoppingBag className="mx-auto text-gray-400 mb-4" size={80} />
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Your cart is empty</h2>
          <p className="text-gray-600 mb-8">Add some products to get started!</p>
          <Link to="/products" className="btn-primary">
            Browse Products
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold mb-8">Shopping Cart</h1>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <div className="space-y-4">
              {items.map((item) => (
                <div key={item._id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <div className="flex gap-6">
                    {/* Image */}
                    <Link to={`/product/${item._id}`} className="flex-shrink-0">
                      <img
                        src={item.images[0] || 'https://via.placeholder.com/150'}
                        alt={item.name}
                        className="w-32 h-32 object-cover rounded-lg"
                      />
                    </Link>

                    {/* Details */}
                    <div className="flex-grow">
                      <Link to={`/product/${item._id}`} className="block">
                        <h3 className="font-semibold text-lg text-gray-900 hover:text-primary-600 mb-1">
                          {item.name}
                        </h3>
                      </Link>
                      <p className="text-gray-600 text-sm mb-3">{item.brand}</p>
                      <p className="text-2xl font-bold text-gray-900 mb-4">
                        ₹{item.price.toLocaleString('en-IN')}
                      </p>

                      <div className="flex items-center justify-between">
                        {/* Quantity Controls */}
                        <div className="flex items-center gap-3">
                          <button
                            onClick={() => updateQuantity(item._id, item.quantity - 1)}
                            className="w-8 h-8 flex items-center justify-center border-2 border-gray-300 rounded-lg hover:bg-gray-100"
                          >
                            <Minus size={16} />
                          </button>
                          <span className="text-lg font-semibold w-8 text-center">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item._id, item.quantity + 1)}
                            disabled={item.quantity >= item.stock}
                            className="w-8 h-8 flex items-center justify-center border-2 border-gray-300 rounded-lg hover:bg-gray-100 disabled:opacity-50"
                          >
                            <Plus size={16} />
                          </button>
                        </div>

                        {/* Remove Button */}
                        <button
                          onClick={() => removeFromCart(item._id)}
                          className="text-red-600 hover:text-red-700 flex items-center gap-2"
                        >
                          <Trash2 size={18} />
                          Remove
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 sticky top-24">
              <h2 className="text-xl font-bold mb-6">Order Summary</h2>

              <div className="space-y-3 mb-6">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-semibold">₹{getCartTotal().toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Shipping</span>
                  <span className="font-semibold">
                    {getCartTotal() > 10000 ? 'FREE' : '₹100'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Tax (18%)</span>
                  <span className="font-semibold">
                    ₹{(getCartTotal() * 0.18).toLocaleString('en-IN')}
                  </span>
                </div>
                <div className="border-t pt-3">
                  <div className="flex justify-between text-lg">
                    <span className="font-bold">Total</span>
                    <span className="font-bold text-primary-600">
                      ₹{(getCartTotal() + (getCartTotal() > 10000 ? 0 : 100) + getCartTotal() * 0.18).toLocaleString('en-IN')}
                    </span>
                  </div>
                </div>
              </div>

              <button onClick={handleCheckout} className="w-full btn-primary mb-4">
                Proceed to Checkout
              </button>

              <Link to="/products" className="block text-center text-primary-600 font-semibold hover:underline">
                Continue Shopping
              </Link>

              {getCartTotal() > 10000 && (
                <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                  <p className="text-sm text-green-800 font-medium">
                    🎉 You qualify for FREE shipping!
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
