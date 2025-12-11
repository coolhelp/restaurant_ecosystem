'use client';

import { useState, useEffect } from 'react';
import { 
  DollarSign, ShoppingBag, Users, TrendingUp, 
  Package, Clock, CheckCircle, XCircle 
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    todaySales: 2450.50,
    todayOrders: 45,
    activeCustomers: 234,
    avgOrderValue: 54.45,
  });

  const [recentOrders, setRecentOrders] = useState([
    { id: '1', orderNumber: 'ORD-001', customer: 'John Doe', total: 45.99, status: 'COMPLETED' },
    { id: '2', orderNumber: 'ORD-002', customer: 'Jane Smith', total: 32.50, status: 'PREPARING' },
    { id: '3', orderNumber: 'ORD-003', customer: 'Bob Johnson', total: 67.25, status: 'PENDING' },
  ]);

  const salesData = [
    { name: 'Mon', sales: 1200 },
    { name: 'Tue', sales: 1900 },
    { name: 'Wed', sales: 1500 },
    { name: 'Thu', sales: 2100 },
    { name: 'Fri', sales: 2800 },
    { name: 'Sat', sales: 3200 },
    { name: 'Sun', sales: 2450 },
  ];

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600">Welcome back! Here's what's happening today.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          icon={<DollarSign className="h-8 w-8" />}
          label="Today's Sales"
          value={`$${stats.todaySales.toFixed(2)}`}
          change="+12.5%"
          changeType="positive"
          color="bg-green-500"
        />
        <StatCard
          icon={<ShoppingBag className="h-8 w-8" />}
          label="Today's Orders"
          value={stats.todayOrders.toString()}
          change="+8.2%"
          changeType="positive"
          color="bg-blue-500"
        />
        <StatCard
          icon={<Users className="h-8 w-8" />}
          label="Active Customers"
          value={stats.activeCustomers.toString()}
          change="+5.1%"
          changeType="positive"
          color="bg-purple-500"
        />
        <StatCard
          icon={<TrendingUp className="h-8 w-8" />}
          label="Avg Order Value"
          value={`$${stats.avgOrderValue.toFixed(2)}`}
          change="+3.7%"
          changeType="positive"
          color="bg-orange-500"
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Sales Chart */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <h3 className="text-lg font-bold mb-4">Weekly Sales</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={salesData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="sales" fill="#FF6B6B" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Revenue Trend */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <h3 className="text-lg font-bold mb-4">Revenue Trend</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={salesData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="sales" stroke="#4ECDC4" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent Orders Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-bold">Recent Orders</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Order #</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Customer</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {recentOrders.map((order) => (
                <tr key={order.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">{order.orderNumber}</td>
                  <td className="px-6 py-4 text-sm text-gray-700">{order.customer}</td>
                  <td className="px-6 py-4 text-sm font-semibold text-gray-900">${order.total.toFixed(2)}</td>
                  <td className="px-6 py-4">
                    <StatusBadge status={order.status} />
                  </td>
                  <td className="px-6 py-4">
                    <button className="text-primary hover:text-primary-dark font-medium text-sm">
                      View Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function StatCard({ icon, label, value, change, changeType, color }: {
  icon: React.ReactNode;
  label: string;
  value: string;
  change: string;
  changeType: 'positive' | 'negative';
  color: string;
}) {
  return (
    <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
      <div className="flex items-center justify-between mb-4">
        <div className={`${color} w-12 h-12 rounded-lg flex items-center justify-center text-white`}>
          {icon}
        </div>
        <span className={`text-sm font-semibold ${changeType === 'positive' ? 'text-green-600' : 'text-red-600'}`}>
          {change}
        </span>
      </div>
      <p className="text-gray-600 text-sm mb-1">{label}</p>
      <p className="text-2xl font-bold text-gray-900">{value}</p>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const getStatusStyle = () => {
    switch (status) {
      case 'COMPLETED':
        return 'bg-green-100 text-green-800';
      case 'PREPARING':
        return 'bg-blue-100 text-blue-800';
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-800';
      case 'CANCELLED':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${getStatusStyle()}`}>
      {status}
    </span>
  );
}
