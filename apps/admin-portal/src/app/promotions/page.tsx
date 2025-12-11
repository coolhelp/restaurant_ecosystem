'use client';

import { useState } from 'react';
import { Plus, Gift, Calendar, Percent, DollarSign, Eye, EyeOff, Edit, Trash2 } from 'lucide-react';

export default function PromotionsPage() {
  const [promotions, setPromotions] = useState([
    {
      id: '1',
      code: 'SUMMER25',
      name: 'Summer Special',
      type: 'percentage',
      value: 25,
      minOrderAmount: 30,
      startDate: new Date('2025-06-01'),
      endDate: new Date('2025-08-31'),
      usageCount: 145,
      usageLimit: 1000,
      isActive: true,
    },
    {
      id: '2',
      code: 'FREESHIP',
      name: 'Free Delivery',
      type: 'fixed',
      value: 4.99,
      minOrderAmount: 20,
      startDate: new Date('2025-01-01'),
      endDate: new Date('2025-12-31'),
      usageCount: 567,
      usageLimit: null,
      isActive: true,
    },
  ]);

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Promotions & Discounts</h1>
          <p className="text-gray-600">Manage promotional codes and special offers</p>
        </div>
        <button className="flex items-center px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors font-medium">
          <Plus className="h-5 w-5 mr-2" />
          Create Promotion
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center space-x-3 mb-3">
            <div className="bg-green-100 p-3 rounded-lg">
              <Gift className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <p className="text-gray-600 text-sm">Active Promotions</p>
              <p className="text-2xl font-bold text-gray-900">{promotions.filter(p => p.isActive).length}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center space-x-3 mb-3">
            <div className="bg-blue-100 p-3 rounded-lg">
              <TrendingUp className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <p className="text-gray-600 text-sm">Total Uses This Month</p>
              <p className="text-2xl font-bold text-gray-900">712</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center space-x-3 mb-3">
            <div className="bg-purple-100 p-3 rounded-lg">
              <DollarSign className="h-6 w-6 text-purple-600" />
            </div>
            <div>
              <p className="text-gray-600 text-sm">Discount Given</p>
              <p className="text-2xl font-bold text-gray-900">$3,245</p>
            </div>
          </div>
        </div>
      </div>

      {/* Promotions List */}
      <div className="space-y-4">
        {promotions.map((promo) => (
          <div key={promo.id} className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 hover:shadow-md transition-all">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-2">
                  <h3 className="text-xl font-bold text-gray-900">{promo.name}</h3>
                  <span className="px-3 py-1 bg-primary/10 text-primary rounded-full font-mono font-bold text-sm">
                    {promo.code}
                  </span>
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                    promo.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                  }`}>
                    {promo.isActive ? (
                      <>
                        <Eye className="h-3 w-3 mr-1" />
                        Active
                      </>
                    ) : (
                      <>
                        <EyeOff className="h-3 w-3 mr-1" />
                        Inactive
                      </>
                    )}
                  </span>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <p className="text-gray-500">Discount</p>
                    <p className="font-bold text-primary text-lg">
                      {promo.type === 'percentage' ? `${promo.value}%` : `$${promo.value}`}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-500">Min Order</p>
                    <p className="font-semibold text-gray-900">${promo.minOrderAmount}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Usage</p>
                    <p className="font-semibold text-gray-900">
                      {promo.usageCount}{promo.usageLimit ? ` / ${promo.usageLimit}` : ''}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-500">Valid Period</p>
                    <p className="font-medium text-gray-900 text-xs">
                      {promo.startDate.toLocaleDateString()} - {promo.endDate.toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex gap-2 ml-4">
                <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                  <Edit className="h-5 w-5" />
                </button>
                <button className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                  <Trash2 className="h-5 w-5" />
                </button>
              </div>
            </div>

            {/* Progress Bar */}
            {promo.usageLimit && (
              <div className="mt-4">
                <div className="flex justify-between text-xs text-gray-600 mb-1">
                  <span>Usage Progress</span>
                  <span>{((promo.usageCount / promo.usageLimit) * 100).toFixed(1)}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-primary rounded-full h-2 transition-all"
                    style={{ width: `${(promo.usageCount / promo.usageLimit) * 100}%` }}
                  />
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function MetricCard({ icon, label, value, change, changeType, color }: any) {
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

