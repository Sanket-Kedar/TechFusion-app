import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Package, MapPin, CreditCard, X } from 'lucide-react';
import Loader from '../components/Loader';
import { orderService } from '../services/orderService';
import { toast } from 'react-toastify';

const OrderDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [cancelling, setCancelling] = useState(false);

  useEffect(() => {
    fetchOrder();
  }, [id]);

  const fetchOrder = async () => {
    try {
      const data = await orderService.getOrderById(id);
      setOrder(data);
    } catch (error) {
      toast.error('Order not found');
    } finally {
      setLoading(false);
    }
  };

  const handleCancelOrder = async () => {
    const reason = window.prompt(
      order.status === 'pending'
        ? 'Order will be cancelled immediately. Reason (optional):'
        : 'Your cancellation request will be sent to admin for approval. Reason (optional):'
    );

    if (reason === null) {
      return; // User clicked cancel
    }

    setCancelling(true);
    try {
      const result = await orderService.cancelOrder(id, reason);
      
      if (result.directCancel) {
        toast.success('Order cancelled successfully');
      } else if (result.requiresApproval) {
        toast.info('Cancellation request sent to admin for approval');
      }
      
      fetchOrder(); // Refresh order data
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to cancel order');
    } finally {
      setCancelling(false);
    }
  };

  const canCancelOrder = () => {
    return order && (order.status === 'pending' || order.status === 'processing');
  };

  if (loading) return <Loader />;
  if (!order) return null;

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link to="/orders" className="text-primary-600 hover:underline mb-4 inline-block">
          ← Back to Orders
        </Link>
        <h1 className="text-3xl font-bold mb-6">Order #{order._id}</h1>

        <div className="grid md:grid-cols-3 gap-6">
          <div className="md:col-span-2 space-y-6">
            {/* Order Items */}
            <div className="bg-white rounded-xl shadow-sm border p-6">
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <Package size={24} />
                Order Items
              </h2>
              {order.orderItems.map((item, idx) => (
                <div key={idx} className="flex gap-4 py-4 border-b">
                  <img src={item.image} alt={item.name} className="w-20 h-20 object-cover rounded" />
                  <div className="flex-grow">
                    <h4 className="font-semibold">{item.name}</h4>
                    <p className="text-sm text-gray-600">Qty: {item.quantity} × ₹{item.price.toLocaleString('en-IN')}</p>
                  </div>
                  <span className="font-bold">₹{(item.price * item.quantity).toLocaleString('en-IN')}</span>
                </div>
              ))}
            </div>

            {/* Shipping Address */}
            <div className="bg-white rounded-xl shadow-sm border p-6">
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <MapPin size={24} />
                Shipping Address
              </h2>
              <div className="text-gray-700 space-y-1">
                <p className="font-semibold">{order.shippingAddress.name}</p>
                <p>{order.shippingAddress.phone}</p>
                <p>{order.shippingAddress.street}</p>
                <p>{order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zipCode}</p>
                <p>{order.shippingAddress.country}</p>
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div>
            <div className="bg-white rounded-xl shadow-sm border p-6 space-y-4">
              <h2 className="text-xl font-bold">Summary</h2>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>₹{order.itemsPrice.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span>₹{order.shippingPrice.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between">
                  <span>Tax</span>
                  <span>₹{order.taxPrice.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between font-bold text-lg pt-2 border-t">
                  <span>Total</span>
                  <span className="text-primary-600">₹{order.totalPrice.toLocaleString('en-IN')}</span>
                </div>
              </div>
              <div className="pt-4 border-t space-y-2">
                <p className={order.isPaid ? 'text-green-600 font-semibold' : 'text-red-600'}>
                  {order.isPaid ? '✓ Paid' : 'Not Paid'}
                </p>
                <p className={`font-semibold capitalize ${order.status === 'delivered' ? 'text-green-600' : order.status === 'cancelled' ? 'text-red-600' : order.status === 'cancel_requested' ? 'text-orange-600' : 'text-blue-600'}`}>
                  Status: {order.status === 'cancel_requested' ? 'Cancel Requested' : order.status}
                </p>
                {order.status === 'cancel_requested' && (
                  <div className="mt-2 p-3 bg-orange-50 border border-orange-200 rounded-lg">
                    <p className="text-sm text-orange-800">
                      ⏳ <strong>Awaiting admin approval</strong>
                    </p>
                    {order.cancelReason && (
                      <p className="text-xs text-orange-700 mt-1">
                        Reason: {order.cancelReason}
                      </p>
                    )}
                  </div>
                )}
                {order.status === 'cancelled' && order.cancelReason && (
                  <p className="text-xs text-gray-600 mt-1">
                    Reason: {order.cancelReason}
                  </p>
                )}
              </div>
              {canCancelOrder() && (
                <div className="pt-4 border-t">
                  <button
                    onClick={handleCancelOrder}
                    disabled={cancelling}
                    className="w-full btn-outline text-red-600 border-red-600 hover:bg-red-50 flex items-center justify-center gap-2"
                  >
                    <X size={18} />
                    {cancelling ? 'Processing...' : order.status === 'pending' ? 'Cancel Order' : 'Request Cancel'}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetail;
