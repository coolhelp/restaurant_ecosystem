'use client';

import { useState } from 'react';
import { Search, Mail, Phone, MapPin, Calendar, Star, TrendingUp } from 'lucide-react';

export default function CustomersPage() {
  const [customers, setCustomers] = useState([
    {
      id: '1',
      name: 'John Doe',
      email: 'john@example.com',
      phone: '+1 234 567 8900',
      totalOrders: 24,
      totalSpent: 1248.50,
      loyaltyPoints: 2450,
      tier: 'Gold',
      joinedAt: new Date('2024-01-15'),
      lastOrder: new Date(),
    },
    {
      id: '2',
      name: 'Jane Smith',
      email: 'jane@example.com',
      phone: '+1 234 567 8901',
      totalOrders: 18,
      totalSpent: 892.30,
      loyaltyPoints: 1780,
      tier: 'Silver',
      joinedAt: new Date('2024-03-20'),
      lastOrder: new Date(),
    },
  ]);

  const [searchQuery, setSearchQuery] = useState('');

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Customers</h1>
        <p className="text-gray-600">Manage your customer database and loyalty program</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <p className="text-gray-600 text-sm mb-1">Total Customers</p>
          <p className="text-3xl font-bold text-gray-900">{customers.length}</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <p className="text-gray-600 text-sm mb-1">Active This Month</p>
          <p className="text-3xl font-bold text-green-600">{customers.length}</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <p className="text-gray-600 text-sm mb-1">Avg Order Value</p>
          <p className="text-3xl font-bold text-blue-600">$54.23</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <p className="text-gray-600 text-sm mb-1">Loyalty Members</p>
          <p className="text-3xl font-bold text-purple-600">{customers.length}</p>
        </div>
      </div>

      {/* Search */}
      <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100 mb-6">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search customers by name, email, or phone..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3 rounded-lg border border-gray-300 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
          />
        </div>
      </div>

      {/* Customers Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {customers.map((customer) => (
          <div key={customer.id} className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 hover:shadow-md transition-all">
            {/* Header */}
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-1">{customer.name}</h3>
                <div className="flex items-center space-x-2">
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                    customer.tier === 'Gold' ? 'bg-yellow-100 text-yellow-800' :
                    customer.tier === 'Silver' ? 'bg-gray-100 text-gray-800' :
                    'bg-orange-100 text-orange-800'
                  }`}>
                    <Star className="h-3 w-3 mr-1 fill-current" />
                    {customer.tier} Tier
                  </span>
                </div>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-primary">{customer.loyaltyPoints}</p>
                <p className="text-xs text-gray-500">points</p>
              </div>
            </div>

            {/* Contact Info */}
            <div className="space-y-2 mb-4">
              <div className="flex items-center text-sm text-gray-600">
                <Mail className="h-4 w-4 mr-2" />
                {customer.email}
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <Phone className="h-4 w-4 mr-2" />
                {customer.phone}
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <Calendar className="h-4 w-4 mr-2" />
                Joined {customer.joinedAt.toLocaleDateString()}
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-200">
              <div>
                <p className="text-gray-500 text-sm">Total Orders</p>
                <p className="text-xl font-bold text-gray-900">{customer.totalOrders}</p>
              </div>
              <div>
                <p className="text-gray-500 text-sm">Total Spent</p>
                <p className="text-xl font-bold text-green-600">${customer.totalSpent.toFixed(2)}</p>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-2 mt-4">
              <button className="flex-1 px-4 py-2 border border-primary text-primary rounded-lg hover:bg-primary hover:text-white transition-colors text-sm font-medium">
                View Orders
              </button>
              <button className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm font-medium">
                Send Message
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

