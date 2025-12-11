'use client';

import { useState } from 'react';
import { Search, Filter, Clock, CheckCircle, Package, Truck } from 'lucide-react';

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState([
    {
      id: '1',
      orderNumber: 'ORD-2025-001',
      customer: 'John Doe',
      email: 'john@example.com',
      phone: '+1 234 567 8900',
      orderType: 'DELIVERY',
      status: 'PREPARING',
      total: 45.99,
      placedAt: new Date(),
      items: 3,
    },
    {
      id: '2',
      orderNumber: 'ORD-2025-002',
      customer: 'Jane Smith',
      email: 'jane@example.com',
      phone: '+1 234 567 8901',
      orderType: 'PICKUP',
      status: 'READY',
      total: 32.50,
      placedAt: new Date(),
      items: 2,
    },
  ]);

  const [filterStatus, setFilterStatus] = useState('ALL');

  const filteredOrders = filterStatus === 'ALL' 
    ? orders 
    : orders.filter(o => o.status === filterStatus);

  const handleStatusUpdate = (orderId: string, newStatus: string) => {
    setOrders(orders.map(order => 
      order.id === orderId ? { ...order, status: newStatus } : order
    ));
  };

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Orders Management</h1>
        <p className="text-gray-600">View and manage all customer orders</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <StatCard label="Pending" count={orders.filter(o => o.status === 'PENDING').length} color="bg-yellow-500" />
        <StatCard label="Preparing" count={orders.filter(o => o.status === 'PREPARING').length} color="bg-blue-500" />
        <StatCard label="Ready" count={orders.filter(o => o.status === 'READY').length} color="bg-green-500" />
        <StatCard label="Out for Delivery" count={orders.filter(o => o.status === 'OUT_FOR_DELIVERY').length} color="bg-purple-500" />
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100 mb-6">
        <div className="flex gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search orders..."
              className="w-full pl-12 pr-4 py-3 rounded-lg border border-gray-300 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
            />
          </div>
          <select 
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-3 rounded-lg border border-gray-300 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
          >
            <option value="ALL">All Status</option>
            <option value="PENDING">Pending</option>
            <option value="CONFIRMED">Confirmed</option>
            <option value="PREPARING">Preparing</option>
            <option value="READY">Ready</option>
            <option value="OUT_FOR_DELIVERY">Out for Delivery</option>
            <option value="COMPLETED">Completed</option>
          </select>
          <select className="px-4 py-3 rounded-lg border border-gray-300 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none">
            <option>All Types</option>
            <option>Delivery</option>
            <option>Pickup</option>
            <option>Dine-in</option>
          </select>
        </div>
      </div>

      {/* Orders Grid */}
      <div className="grid grid-cols-1 gap-4">
        {filteredOrders.map((order) => (
          <div key={order.id} className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 hover:shadow-md transition-all">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-2">
                  <h3 className="text-xl font-bold text-gray-900">{order.orderNumber}</h3>
                  <OrderTypeBadge type={order.orderType} />
                  <StatusBadge status={order.status} />
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <p className="text-gray-500">Customer</p>
                    <p className="font-semibold text-gray-900">{order.customer}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Phone</p>
                    <p className="font-medium text-gray-900">{order.phone}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Total</p>
                    <p className="font-bold text-primary text-lg">${order.total.toFixed(2)}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Time</p>
                    <p className="font-medium text-gray-900">
                      {order.placedAt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Status Update Buttons */}
            <div className="flex flex-wrap gap-2 pt-4 border-t border-gray-200">
              {order.status === 'PENDING' && (
                <button
                  onClick={() => handleStatusUpdate(order.id, 'CONFIRMED')}
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm font-medium"
                >
                  Confirm Order
                </button>
              )}
              {order.status === 'CONFIRMED' && (
                <button
                  onClick={() => handleStatusUpdate(order.id, 'PREPARING')}
                  className="px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors text-sm font-medium"
                >
                  Start Preparing
                </button>
              )}
              {order.status === 'PREPARING' && (
                <button
                  onClick={() => handleStatusUpdate(order.id, 'READY')}
                  className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors text-sm font-medium"
                >
                  Mark as Ready
                </button>
              )}
              {order.status === 'READY' && order.orderType === 'DELIVERY' && (
                <button
                  onClick={() => handleStatusUpdate(order.id, 'OUT_FOR_DELIVERY')}
                  className="px-4 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 transition-colors text-sm font-medium"
                >
                  Out for Delivery
                </button>
              )}
              <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium">
                View Details
              </button>
              <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium">
                Print Receipt
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function StatCard({ label, count, color }: { label: string; count: number; color: string }) {
  return (
    <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
      <div className={`${color} w-12 h-12 rounded-lg flex items-center justify-center text-white mb-3`}>
        <Clock className="h-6 w-6" />
      </div>
      <p className="text-gray-600 text-sm mb-1">{label}</p>
      <p className="text-3xl font-bold text-gray-900">{count}</p>
    </div>
  );
}

function OrderTypeBadge({ type }: { type: string }) {
  const getColor = () => {
    switch (type) {
      case 'DELIVERY': return 'bg-purple-100 text-purple-800';
      case 'PICKUP': return 'bg-blue-100 text-blue-800';
      case 'DINE_IN': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${getColor()}`}>
      {type.replace('_', ' ')}
    </span>
  );
}

function StatusBadge({ status }: { status: string }) {
  const getColor = () => {
    switch (status) {
      case 'PENDING': return 'bg-yellow-100 text-yellow-800';
      case 'CONFIRMED': return 'bg-blue-100 text-blue-800';
      case 'PREPARING': return 'bg-purple-100 text-purple-800';
      case 'READY': return 'bg-green-100 text-green-800';
      case 'OUT_FOR_DELIVERY': return 'bg-indigo-100 text-indigo-800';
      case 'COMPLETED': return 'bg-green-100 text-green-800';
      case 'CANCELLED': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${getColor()}`}>
      {status.replace('_', ' ')}
    </span>
  );
}

