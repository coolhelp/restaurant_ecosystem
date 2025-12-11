'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  ChefHat, MapPin, Clock, CheckCircle, XCircle, Truck, Package, 
  Phone, Mail, Loader2, ArrowLeft, Receipt
} from 'lucide-react';
import { withAuth } from '@/lib/withAuth';
import { orderApi } from '@/lib/apiServices';
import type { Order } from '@/types/order';

function OrderDetailPage() {
  const params = useParams();
  const router = useRouter();
  const orderId = params.id as string;

  const [order, setOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (orderId) {
      loadOrder();
    }
  }, [orderId]);

  const loadOrder = async () => {
    try {
      setIsLoading(true);
      const data = await orderApi.getOrder(orderId);
      setOrder(data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to load order');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancelOrder = async () => {
    if (!confirm('Are you sure you want to cancel this order?')) return;

    try {
      await orderApi.cancelOrder(orderId);
      loadOrder(); // Refresh
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to cancel order');
    }
  };

  const getStatusInfo = (status: string) => {
    switch (status) {
      case 'PENDING':
        return { icon: Clock, color: 'text-yellow-600', bg: 'bg-yellow-100', label: 'Order Received' };
      case 'CONFIRMED':
        return { icon: CheckCircle, color: 'text-blue-600', bg: 'bg-blue-100', label: 'Order Confirmed' };
      case 'PREPARING':
        return { icon: Package, color: 'text-purple-600', bg: 'bg-purple-100', label: 'Being Prepared' };
      case 'READY':
        return { icon: CheckCircle, color: 'text-green-600', bg: 'bg-green-100', label: 'Ready for Pickup' };
      case 'OUT_FOR_DELIVERY':
        return { icon: Truck, color: 'text-indigo-600', bg: 'bg-indigo-100', label: 'Out for Delivery' };
      case 'COMPLETED':
        return { icon: CheckCircle, color: 'text-green-600', bg: 'bg-green-100', label: 'Delivered' };
      case 'CANCELLED':
        return { icon: XCircle, color: 'text-red-600', bg: 'bg-red-100', label: 'Cancelled' };
      default:
        return { icon: Clock, color: 'text-gray-600', bg: 'bg-gray-100', label: status };
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <XCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-2">Order Not Found</h2>
          <p className="text-gray-600 mb-6">{error || 'This order does not exist'}</p>
          <Link href="/orders" className="text-primary hover:text-primary-dark font-medium">
            ← Back to Orders
          </Link>
        </div>
      </div>
    );
  }

  const statusInfo = getStatusInfo(order.orderStatus);
  const StatusIcon = statusInfo.icon;

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
            <Link href="/orders" className="flex items-center text-gray-700 hover:text-primary font-medium">
              <ArrowLeft className="h-4 w-4 mr-2" />
              All Orders
            </Link>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Order Header */}
        <div className="bg-white rounded-2xl shadow-md p-8 border border-gray-100 mb-6">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h2 className="text-3xl font-bold mb-2">Order #{order.orderNumber}</h2>
              <p className="text-gray-600">
                Placed on {new Date(order.placedAt).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </p>
            </div>
            <div className={`${statusInfo.bg} ${statusInfo.color} px-4 py-2 rounded-full flex items-center space-x-2`}>
              <StatusIcon className="h-5 w-5" />
              <span className="font-semibold">{statusInfo.label}</span>
            </div>
          </div>

          {/* Order Progress */}
          <div className="relative">
            <div className="flex justify-between items-center mb-8">
              {['PENDING', 'CONFIRMED', 'PREPARING', 'OUT_FOR_DELIVERY', 'COMPLETED'].map((status, index) => {
                const currentIndex = ['PENDING', 'CONFIRMED', 'PREPARING', 'READY', 'OUT_FOR_DELIVERY', 'COMPLETED'].indexOf(order.orderStatus);
                const stepIndex = ['PENDING', 'CONFIRMED', 'PREPARING', 'OUT_FOR_DELIVERY', 'COMPLETED'].indexOf(status);
                const isCompleted = stepIndex <= currentIndex;
                
                return (
                  <div key={status} className="flex-1 relative">
                    <div className="flex flex-col items-center">
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                        isCompleted ? 'bg-primary text-white' : 'bg-gray-200 text-gray-400'
                      }`}>
                        {isCompleted ? <Check className="h-6 w-6" /> : <Clock className="h-6 w-6" />}
                      </div>
                      <span className="text-xs text-gray-600 mt-2 text-center">
                        {status.replace('_', ' ')}
                      </span>
                    </div>
                    {index < 4 && (
                      <div className={`absolute top-6 left-1/2 w-full h-1 ${
                        isCompleted && stepIndex < currentIndex ? 'bg-primary' : 'bg-gray-200'
                      }`} style={{ zIndex: -1 }} />
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Order Details Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {/* Delivery Address */}
          {order.addressId && (
            <div className="bg-white rounded-2xl shadow-md p-6 border border-gray-100">
              <div className="flex items-center space-x-3 mb-4">
                <MapPin className="h-6 w-6 text-primary" />
                <h3 className="text-xl font-bold">Delivery Address</h3>
              </div>
              <p className="text-gray-700">Delivery to selected address</p>
              <p className="text-sm text-gray-500 mt-2">Address ID: {order.addressId}</p>
            </div>
          )}

          {/* Contact Info */}
          <div className="bg-white rounded-2xl shadow-md p-6 border border-gray-100">
            <div className="flex items-center space-x-3 mb-4">
              <Phone className="h-6 w-6 text-primary" />
              <h3 className="text-xl font-bold">Contact</h3>
            </div>
            <p className="text-gray-700">Need help with your order?</p>
            <p className="text-primary font-medium mt-2">1-800-TASTY-00</p>
          </div>
        </div>

        {/* Items Ordered */}
        <div className="bg-white rounded-2xl shadow-md p-6 border border-gray-100 mb-6">
          <div className="flex items-center space-x-3 mb-6">
            <Receipt className="h-6 w-6 text-primary" />
            <h3 className="text-xl font-bold">Items Ordered</h3>
          </div>
          <div className="space-y-4">
            {order.items.map((item) => (
              <div key={item.id} className="flex justify-between items-start pb-4 border-b border-gray-100 last:border-0">
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-900">{item.item?.name || 'Item'}</h4>
                  <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                  {item.modifiers && item.modifiers.length > 0 && (
                    <p className="text-sm text-gray-500 mt-1">
                      + {item.modifiers.map(m => m.modifier?.name).join(', ')}
                    </p>
                  )}
                  {item.specialInstructions && (
                    <p className="text-sm text-gray-500 italic mt-1">
                      Note: {item.specialInstructions}
                    </p>
                  )}
                </div>
                <span className="font-semibold text-gray-900">${Number(item.subtotal).toFixed(2)}</span>
              </div>
            ))}
          </div>

          {/* Price Breakdown */}
          <div className="mt-6 pt-6 border-t-2 border-gray-200 space-y-2">
            <div className="flex justify-between text-gray-600">
              <span>Subtotal</span>
              <span>${Number(order.subtotal).toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-gray-600">
              <span>Delivery Fee</span>
              <span>${Number(order.deliveryFee).toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-gray-600">
              <span>Tax</span>
              <span>${Number(order.taxAmount).toFixed(2)}</span>
            </div>
            {order.tipAmount > 0 && (
              <div className="flex justify-between text-gray-600">
                <span>Tip</span>
                <span>${Number(order.tipAmount).toFixed(2)}</span>
              </div>
            )}
            {order.discountAmount > 0 && (
              <div className="flex justify-between text-green-600">
                <span>Discount</span>
                <span>-${Number(order.discountAmount).toFixed(2)}</span>
              </div>
            )}
            <div className="flex justify-between text-2xl font-bold pt-3 border-t border-gray-200">
              <span>Total</span>
              <span className="text-primary">${Number(order.total).toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* Special Instructions */}
        {order.specialInstructions && (
          <div className="bg-blue-50 rounded-2xl p-6 border border-blue-200 mb-6">
            <h3 className="font-bold text-blue-900 mb-2">Special Instructions</h3>
            <p className="text-blue-800">{order.specialInstructions}</p>
          </div>
        )}

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4">
          {order.orderStatus === 'PENDING' && (
            <button
              onClick={handleCancelOrder}
              className="flex-1 border-2 border-red-500 text-red-600 py-3 rounded-lg font-semibold hover:bg-red-50 transition-colors"
            >
              Cancel Order
            </button>
          )}
          {order.orderStatus === 'COMPLETED' && (
            <button
              onClick={() => {
                // Reorder functionality - could add items back to cart
                router.push('/menu');
              }}
              className="flex-1 bg-primary text-white py-3 rounded-lg font-semibold hover:bg-primary-dark transition-colors"
            >
              Order Again
            </button>
          )}
          <Link
            href="/orders"
            className="flex-1 border border-gray-300 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-50 transition-colors text-center"
          >
            View All Orders
          </Link>
        </div>

        {/* Help Section */}
        <div className="mt-8 bg-gradient-to-r from-primary/10 to-secondary/10 rounded-2xl p-6 text-center">
          <h3 className="text-xl font-bold mb-2">Need Help?</h3>
          <p className="text-gray-600 mb-4">Our customer support team is here 24/7</p>
          <div className="flex justify-center space-x-4">
            <a href="tel:1-800-TASTY-00" className="flex items-center text-primary hover:text-primary-dark font-medium">
              <Phone className="h-4 w-4 mr-2" />
              1-800-TASTY-00
            </a>
            <a href="mailto:support@tastybites.com" className="flex items-center text-primary hover:text-primary-dark font-medium">
              <Mail className="h-4 w-4 mr-2" />
              support@tastybites.com
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default withAuth(OrderDetailPage);

