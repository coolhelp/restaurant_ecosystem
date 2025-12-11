'use client';

import { useState } from 'react';
import { Download, Calendar, DollarSign, TrendingUp, ShoppingBag, Users } from 'lucide-react';
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

export default function ReportsPage() {
  const salesData = [
    { date: 'Jan', revenue: 4200, orders: 89 },
    { date: 'Feb', revenue: 5100, orders: 102 },
    { date: 'Mar', revenue: 4800, orders: 95 },
    { date: 'Apr', revenue: 6200, orders: 124 },
    { date: 'May', revenue: 7100, orders: 142 },
    { date: 'Jun', revenue: 8300, orders: 167 },
  ];

  const categoryData = [
    { name: 'Pizza', value: 4500, color: '#FF6B6B' },
    { name: 'Burgers', value: 3200, color: '#4ECDC4' },
    { name: 'Salads', value: 1800, color: '#FFE66D' },
    { name: 'Drinks', value: 1200, color: '#95E1D3' },
  ];

  const topItems = [
    { name: 'Margherita Pizza', sold: 456, revenue: 6840 },
    { name: 'Beef Burger', sold: 389, revenue: 5046.11 },
    { name: 'Caesar Salad', sold: 245, revenue: 2447.55 },
  ];

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Sales Reports</h1>
          <p className="text-gray-600">Analyze your restaurant performance</p>
        </div>
        <div className="flex gap-3">
          <select className="px-4 py-2 rounded-lg border border-gray-300 focus:border-primary outline-none">
            <option>Last 30 Days</option>
            <option>Last 7 Days</option>
            <option>This Month</option>
            <option>Last Month</option>
            <option>Custom Range</option>
          </select>
          <button className="flex items-center px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors font-medium">
            <Download className="h-5 w-5 mr-2" />
            Export
          </button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <MetricCard
          icon={<DollarSign className="h-8 w-8" />}
          label="Total Revenue"
          value="$35,800"
          change="+15.3%"
          changeType="positive"
          color="bg-green-500"
        />
        <MetricCard
          icon={<ShoppingBag className="h-8 w-8" />}
          label="Total Orders"
          value="719"
          change="+12.7%"
          changeType="positive"
          color="bg-blue-500"
        />
        <MetricCard
          icon={<TrendingUp className="h-8 w-8" />}
          label="Avg Order Value"
          value="$49.79"
          change="+2.1%"
          changeType="positive"
          color="bg-purple-500"
        />
        <MetricCard
          icon={<Users className="h-8 w-8" />}
          label="New Customers"
          value="127"
          change="+8.9%"
          changeType="positive"
          color="bg-orange-500"
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Revenue Trend */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <h3 className="text-lg font-bold mb-4">Revenue Trend</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={salesData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="revenue" stroke="#FF6B6B" strokeWidth={2} name="Revenue ($)" />
              <Line type="monotone" dataKey="orders" stroke="#4ECDC4" strokeWidth={2} name="Orders" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Category Performance */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <h3 className="text-lg font-bold mb-4">Sales by Category</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={categoryData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {categoryData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Top Items Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-bold">Top Selling Items</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Item</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Units Sold</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Revenue</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Trend</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {topItems.map((item, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-orange-400 to-red-400 rounded-lg flex items-center justify-center text-white font-bold">
                        #{index + 1}
                      </div>
                      <span className="font-medium text-gray-900">{item.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm font-semibold text-gray-900">{item.sold}</td>
                  <td className="px-6 py-4 text-sm font-bold text-green-600">${item.revenue.toFixed(2)}</td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center text-green-600 text-sm font-medium">
                      <TrendingUp className="h-4 w-4 mr-1" />
                      +12%
                    </span>
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

function MetricCard({ icon, label, value, change, changeType, color }: {
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

