import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Package, Calendar, IndianRupee, X } from 'lucide-react';
import Loader from '../components/Loader';
import { orderService } from '../services/orderService';
import { toast } from 'react-toastify';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const data = await orderService.getMyOrders();
      setOrders(data);
    } catch (error) {
      toast.error('Failed to fetch orders');
    } finally {
      setLoading(false);
    }
  };

  const handleCancelOrder = async (orderId, orderStatus) => {
    const reason = window.prompt(
      orderStatus === 'pending'
        ? 'Order will be cancelled immediately. Reason (optional):'
        : 'Your cancellation request will be sent to admin for approval. Reason (optional):'
    );

    if (reason === null) {
      return; // User clicked cancel
    }

    try {
      const result = await orderService.cancelOrder(orderId, reason);
      
      if (result.directCancel) {
        toast.success('Order cancelled successfully');
      } else if (result.requiresApproval) {
        toast.info('Cancellation request sent to admin for approval');
      }
      
      fetchOrders(); // Refresh orders list
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to cancel order');
    }
  };

  const canCancelOrder = (order) => {
    return order.status === 'pending' || order.status === 'processing';
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800',
      processing: 'bg-blue-100 text-blue-800',
      shipped: 'bg-purple-100 text-purple-800',
      delivered: 'bg-green-100 text-green-800',
      cancelled: 'bg-red-100 text-red-800',
      cancel_requested: 'bg-orange-100 text-orange-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const getStatusLabel = (status) => {
    const labels = {
      cancel_requested: 'Cancel Requested'
    };
    return labels[status] || status.charAt(0).toUpperCase() + status.slice(1);
  };

  if (loading) return <Loader />;

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold mb-8">My Orders</h1>

        {orders.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
            <Package className="mx-auto text-gray-400 mb-4" size={64} />
            <h2 className="text-xl font-semibold mb-2">No orders yet</h2>
            <p className="text-gray-600 mb-6">Start shopping to create your first order!</p>
            <Link to="/products" className="btn-primary">
              Browse Products
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <div key={order._id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="p-6">
                  {/* Order Header */}
                  <div className="flex flex-wrap items-center justify-between mb-6 gap-4">
                    <div className="flex items-center gap-4">
                      <div>
                        <p className="text-sm text-gray-600">Order ID</p>
                        <p className="font-mono font-semibold">{order._id}</p>
                      </div>
                      <div className="flex items-center gap-2 text-gray-600">
                        <Calendar size={18} />
                        <span>{new Date(order.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      <span className={`px-4 py-2 rounded-full text-sm font-semibold ${getStatusColor(order.status)}`}>
                        {getStatusLabel(order.status)}
                      </span>
                      <div className="flex items-center gap-2">
                        <IndianRupee size={18} className="text-gray-600" />
                        <span className="text-xl font-bold">₹{order.totalPrice.toLocaleString('en-IN')}</span>
                      </div>
                    </div>
                  </div>

                  {/* Order Items */}
                  <div className="border-t pt-4">
                    <div className="grid gap-4">
                      {order.orderItems.map((item, idx) => (
                        <div key={idx} className="flex items-center gap-4">
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-20 h-20 object-cover rounded-lg"
                          />
                          <div className="flex-grow">
                            <h4 className="font-semibold">{item.name}</h4>
                            <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                          </div>
                          <span className="font-semibold">
                            ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Order Actions */}
                  <div className="border-t mt-6 pt-4 flex justify-between items-center">
                    <div className="text-sm text-gray-600">
                      {order.isPaid ? (
                        <span className="text-green-600 font-semibold">✓ Paid</span>
                      ) : (
                        <span className="text-red-600 font-semibold">Not Paid</span>
                      )}
                      {order.isDelivered && (
                        <span className="ml-4 text-green-600 font-semibold">
                          ✓ Delivered on {new Date(order.deliveredAt).toLocaleDateString()}
                        </span>
                      )}
                    </div>
                    <div className="flex gap-2">
                      {canCancelOrder(order) && (
                        <button
                          onClick={() => handleCancelOrder(order._id, order.status)}
                          className="btn-outline text-sm text-red-600 border-red-600 hover:bg-red-50 flex items-center gap-1"
                        >
                          <X size={16} />
                          {order.status === 'pending' ? 'Cancel Order' : 'Request Cancel'}
                        </button>
                      )}
                      {order.status === 'cancel_requested' && (
                        <span className="text-sm text-orange-600 font-semibold">
                          ⏳ Awaiting admin approval
                        </span>
                      )}
                      <Link to={`/order/${order._id}`} className="btn-outline text-sm">
                        View Details
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Orders;
