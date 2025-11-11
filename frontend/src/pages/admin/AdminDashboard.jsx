import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Package, ShoppingBag, Users, IndianRupee } from 'lucide-react';
import { productService } from '../../services/productService';
import { orderService } from '../../services/orderService';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalOrders: 0,
    totalRevenue: 0,
    recentOrders: []
  });

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [productsData, ordersData] = await Promise.all([
        productService.getProducts({}),
        orderService.getAllOrders()
      ]);

      // Exclude cancelled orders from revenue calculation
      const activeOrders = ordersData.filter(order => order.status !== 'cancelled');
      const revenue = activeOrders.reduce((sum, order) => sum + order.totalPrice, 0);

      setStats({
        totalProducts: productsData.total,
        totalOrders: ordersData.length, // Total includes all orders
        totalRevenue: revenue, // Revenue excludes cancelled orders
        recentOrders: ordersData.slice(0, 5)
      });
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    }
  };

  const statCards = [
    { title: 'Total Products', value: stats.totalProducts, icon: Package, color: 'bg-blue-500', link: '/admin/products' },
    { title: 'Total Orders', value: stats.totalOrders, icon: ShoppingBag, color: 'bg-green-500', link: '/admin/orders' },
    { title: 'Total Revenue', value: `₹${stats.totalRevenue.toLocaleString('en-IN')}`, icon: IndianRupee, color: 'bg-purple-500', link: '/admin/orders' }
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {statCards.map((stat, index) => (
            <Link key={index} to={stat.link} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm mb-1">{stat.title}</p>
                  <p className="text-3xl font-bold">{stat.value}</p>
                </div>
                <div className={`${stat.color} p-4 rounded-lg`}>
                  <stat.icon className="text-white" size={32} />
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <Link to="/admin/products/new" className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-center gap-4">
              <div className="bg-primary-100 p-4 rounded-lg">
                <Package className="text-primary-600" size={32} />
              </div>
              <div>
                <h3 className="text-xl font-bold mb-1">Add New Product</h3>
                <p className="text-gray-600">Create a new product listing</p>
              </div>
            </div>
          </Link>

          <Link to="/admin/orders" className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-center gap-4">
              <div className="bg-green-100 p-4 rounded-lg">
                <ShoppingBag className="text-green-600" size={32} />
              </div>
              <div>
                <h3 className="text-xl font-bold mb-1">Manage Orders</h3>
                <p className="text-gray-600">View and update order status</p>
              </div>
            </div>
          </Link>
        </div>

        {/* Recent Orders */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-bold mb-6">Recent Orders</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4">Order ID</th>
                  <th className="text-left py-3 px-4">Customer</th>
                  <th className="text-left py-3 px-4">Total</th>
                  <th className="text-left py-3 px-4">Status</th>
                  <th className="text-left py-3 px-4">Date</th>
                </tr>
              </thead>
              <tbody>
                {stats.recentOrders.map((order) => (
                  <tr key={order._id} className="border-b hover:bg-gray-50">
                    <td className="py-3 px-4 font-mono text-sm">{order._id.slice(-8)}</td>
                    <td className="py-3 px-4">{order.user?.name}</td>
                    <td className="py-3 px-4 font-semibold">₹{order.totalPrice.toLocaleString('en-IN')}</td>
                    <td className="py-3 px-4">
                      <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                        {order.status}
                      </span>
                    </td>
                    <td className="py-3 px-4">{new Date(order.createdAt).toLocaleDateString()}</td>
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

export default AdminDashboard;
