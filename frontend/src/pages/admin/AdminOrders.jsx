import React, { useEffect, useState } from 'react';
import { Search, Check, X } from 'lucide-react';
import { toast } from 'react-toastify';
import Loader from '../../components/Loader';
import { orderService } from '../../services/orderService';

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const data = await orderService.getAllOrders();
      setOrders(data);
    } catch (error) {
      toast.error('Failed to fetch orders');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await orderService.updateOrderStatus(orderId, newStatus);
      toast.success('Order status updated');
      fetchOrders();
    } catch (error) {
      toast.error('Failed to update status');
    }
  };

  const handleApproveCancelRequest = async (orderId) => {
    if (!window.confirm('Approve this cancellation request? Stock will be restored.')) {
      return;
    }
    try {
      await orderService.approveCancelRequest(orderId);
      toast.success('Cancel request approved. Order cancelled.');
      fetchOrders();
    } catch (error) {
      toast.error('Failed to approve cancel request');
    }
  };

  const handleRejectCancelRequest = async (orderId) => {
    if (!window.confirm('Reject this cancellation request? Order will continue processing.')) {
      return;
    }
    try {
      await orderService.rejectCancelRequest(orderId);
      toast.success('Cancel request rejected');
      fetchOrders();
    } catch (error) {
      toast.error('Failed to reject cancel request');
    }
  };

  const filteredOrders = orders.filter(order =>
    order._id.includes(search) ||
    order.user?.name.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) return <Loader />;

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold mb-8">Manage Orders</h1>

        {/* Search */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-3 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search by order ID or customer name..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="input-field pl-10"
            />
          </div>
        </div>

        {/* Orders Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-left py-4 px-6 font-semibold">Order ID</th>
                  <th className="text-left py-4 px-6 font-semibold">Customer</th>
                  <th className="text-left py-4 px-6 font-semibold">Date</th>
                  <th className="text-left py-4 px-6 font-semibold">Total</th>
                  <th className="text-left py-4 px-6 font-semibold">Paid</th>
                  <th className="text-left py-4 px-6 font-semibold">Status</th>
                  <th className="text-left py-4 px-6 font-semibold">Cancel Request</th>
                  <th className="text-left py-4 px-6 font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredOrders.map((order) => (
                  <tr key={order._id} className="border-t hover:bg-gray-50">
                    <td className="py-4 px-6 font-mono text-sm">{order._id.slice(-10)}</td>
                    <td className="py-4 px-6">
                      <div>
                        <p className="font-medium">{order.user?.name}</p>
                        <p className="text-sm text-gray-600">{order.user?.email}</p>
                      </div>
                    </td>
                    <td className="py-4 px-6">{new Date(order.createdAt).toLocaleDateString()}</td>
                    <td className="py-4 px-6 font-semibold">₹{order.totalPrice.toLocaleString('en-IN')}</td>
                    <td className="py-4 px-6">
                      <span className={`px-3 py-1 rounded-full text-sm ${order.isPaid ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                        {order.isPaid ? 'Yes' : 'No'}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      {order.status === 'cancel_requested' ? (
                        <span className="px-3 py-1 bg-orange-100 text-orange-800 rounded-full text-sm font-semibold">
                          Cancel Requested
                        </span>
                      ) : (
                        <select
                          value={order.status}
                          onChange={(e) => handleStatusChange(order._id, e.target.value)}
                          className="px-3 py-1 border border-gray-300 rounded-lg text-sm"
                        >
                          <option value="pending">Pending</option>
                          <option value="processing">Processing</option>
                          <option value="shipped">Shipped</option>
                          <option value="delivered">Delivered</option>
                          <option value="cancelled">Cancelled</option>
                        </select>
                      )}
                    </td>
                    <td className="py-4 px-6">
                      {order.status === 'cancel_requested' ? (
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleApproveCancelRequest(order._id)}
                            className="px-3 py-1 bg-green-600 text-white rounded-lg text-sm hover:bg-green-700 flex items-center gap-1"
                            title="Approve cancellation"
                          >
                            <Check size={14} />
                            Approve
                          </button>
                          <button
                            onClick={() => handleRejectCancelRequest(order._id)}
                            className="px-3 py-1 bg-red-600 text-white rounded-lg text-sm hover:bg-red-700 flex items-center gap-1"
                            title="Reject cancellation"
                          >
                            <X size={14} />
                            Reject
                          </button>
                        </div>
                      ) : (
                        <span className="text-sm text-gray-500">-</span>
                      )}
                    </td>
                    <td className="py-4 px-6">
                      <a
                        href={`/order/${order._id}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary-600 hover:underline text-sm"
                      >
                        View Details
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminOrders;
