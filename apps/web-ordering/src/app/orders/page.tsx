'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ChefHat, Clock, Check, X, Truck, Package, Loader2 } from 'lucide-react';
import { withAuth } from '@/lib/withAuth';
import { orderApi } from '@/lib/apiServices';
import type { Order } from '@/types/order';

function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    try {
      setIsLoading(true);
      const data = await orderApi.getOrders();
      setOrders(data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to load orders');
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
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

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'PENDING': return <Clock className="h-5 w-5" />;
      case 'COMPLETED': return <Check className="h-5 w-5" />;
      case 'CANCELLED': return <X className="h-5 w-5" />;
      case 'OUT_FOR_DELIVERY': return <Truck className="h-5 w-5" />;
      default: return <Package className="h-5 w-5" />;
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="flex items-center space-x-2">
              <div className="bg-gradient-to-br from-primary to-secondary p-2 rounded-xl">
                <ChefHat className="h-6 w-6 text-white" />
              </div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                TastyBites
              </h1>
            </Link>
            <Link href="/dashboard" className="text-primary hover:text-primary-dark font-medium">
              Dashboard
            </Link>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h2 className="text-4xl font-bold mb-8">Order History</h2>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <p className="text-red-800">{error}</p>
          </div>
        )}

        {orders.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-md p-12 text-center">
            <Package className="h-24 w-24 text-gray-300 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-gray-900 mb-2">No orders yet</h3>
            <p className="text-gray-600 mb-6">Start ordering your favorite meals!</p>
            <Link
              href="/menu"
              className="inline-flex items-center px-8 py-3 bg-gradient-to-r from-primary to-primary-dark text-white rounded-full font-semibold hover:shadow-lg transition-all"
            >
              Browse Menu
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <div key={order.id} className="bg-white rounded-2xl shadow-md p-6 border border-gray-100 hover:shadow-lg transition-shadow">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-1">
                      Order #{order.orderNumber}
                    </h3>
                    <p className="text-gray-600">
                      {new Date(order.placedAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                  </div>
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.orderStatus)}`}>
                    {getStatusIcon(order.orderStatus)}
                    <span className="ml-2">{order.orderStatus.replace('_', ' ')}</span>
                  </span>
                </div>

                <div className="border-t border-gray-200 pt-4 mb-4">
                  <div className="space-y-2">
                    {order.items.map((item) => (
                      <div key={item.id} className="flex justify-between text-sm">
                        <span className="text-gray-700">
                          {item.quantity}x {item.item?.name || 'Item'}
                        </span>
                        <span className="text-gray-900 font-medium">
                          ${Number(item.subtotal).toFixed(2)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex justify-between items-center pt-4 border-t border-gray-200">
                  <div>
                    <span className="text-gray-600">Total: </span>
                    <span className="text-2xl font-bold text-primary">
                      ${Number(order.total).toFixed(2)}
                    </span>
                  </div>
                  <div className="flex space-x-3">
                    <Link
                      href={`/orders/${order.id}`}
                      className="px-6 py-2 border border-primary text-primary rounded-lg hover:bg-primary hover:text-white transition-colors font-medium"
                    >
                      View Details
                    </Link>
                    {order.orderStatus === 'COMPLETED' && (
                      <button className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors font-medium">
                        Reorder
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default withAuth(OrdersPage);

