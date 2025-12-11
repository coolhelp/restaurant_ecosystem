'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ChefHat, Trash2, Plus, Minus, ShoppingBag, ArrowRight } from 'lucide-react';
import { useCartStore } from '@/store/cartStore';
import { useAuthStore } from '@/store/authStore';

export default function CartPage() {
  const router = useRouter();
  const { items, removeItem, updateQuantity, clearCart, getTotal, getItemCount } = useCartStore();
  const { isAuthenticated } = useAuthStore();

  const subtotal = getTotal();
  const tax = subtotal * 0.0825; // 8.25% tax
  const deliveryFee = subtotal > 0 ? 4.99 : 0;
  const total = subtotal + tax + deliveryFee;

  const handleCheckout = () => {
    if (!isAuthenticated) {
      router.push('/login?redirect=/checkout');
    } else {
      router.push('/checkout');
    }
  };

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
            <Link href="/menu" className="text-primary hover:text-primary-dark font-medium">
              Continue Shopping
            </Link>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h2 className="text-4xl font-bold mb-8">Shopping Cart</h2>

        {items.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-md p-12 text-center">
            <ShoppingBag className="h-24 w-24 text-gray-300 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-gray-900 mb-2">Your cart is empty</h3>
            <p className="text-gray-600 mb-6">Add some delicious items to get started!</p>
            <Link
              href="/menu"
              className="inline-flex items-center px-8 py-3 bg-gradient-to-r from-primary to-primary-dark text-white rounded-full font-semibold hover:shadow-lg transition-all"
            >
              Browse Menu
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              {items.map((cartItem, index) => (
                <div key={index} className="bg-white rounded-2xl shadow-md p-6 border border-gray-100">
                  <div className="flex items-start space-x-4">
                    <div className="w-24 h-24 bg-gradient-to-br from-orange-400 to-red-400 rounded-xl flex-shrink-0"></div>
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-gray-900 mb-1">{cartItem.item.name}</h3>
                      <p className="text-gray-600 text-sm mb-2">${Number(cartItem.item.basePrice).toFixed(2)}</p>
                      
                      {cartItem.selectedModifiers.length > 0 && (
                        <div className="mb-2">
                          <p className="text-sm text-gray-500">
                            {cartItem.selectedModifiers.map(m => m.name).join(', ')}
                          </p>
                        </div>
                      )}
                      
                      {cartItem.specialInstructions && (
                        <p className="text-sm text-gray-500 italic mb-2">
                          Note: {cartItem.specialInstructions}
                        </p>
                      )}

                      <div className="flex items-center justify-between mt-4">
                        <div className="flex items-center space-x-3 bg-gray-100 rounded-lg p-1">
                          <button
                            onClick={() => {
                              if (cartItem.quantity > 1) {
                                updateQuantity(cartItem.item.id, cartItem.quantity - 1);
                              }
                            }}
                            className="p-2 hover:bg-white rounded transition-colors"
                          >
                            <Minus className="h-4 w-4" />
                          </button>
                          <span className="font-semibold w-8 text-center">{cartItem.quantity}</span>
                          <button
                            onClick={() => updateQuantity(cartItem.item.id, cartItem.quantity + 1)}
                            className="p-2 hover:bg-white rounded transition-colors"
                          >
                            <Plus className="h-4 w-4" />
                          </button>
                        </div>
                        <div className="flex items-center space-x-4">
                          <span className="text-xl font-bold text-primary">
                            ${cartItem.subtotal.toFixed(2)}
                          </span>
                          <button
                            onClick={() => removeItem(cartItem.item.id)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          >
                            <Trash2 className="h-5 w-5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              <button
                onClick={clearCart}
                className="w-full text-center py-3 text-red-600 hover:bg-red-50 rounded-lg transition-colors font-medium"
              >
                Clear Cart
              </button>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-2xl shadow-md p-6 border border-gray-100 sticky top-24">
                <h3 className="text-2xl font-bold mb-6">Order Summary</h3>
                
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between text-gray-600">
                    <span>Subtotal ({getItemCount()} items)</span>
                    <span>${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Tax (8.25%)</span>
                    <span>${tax.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Delivery Fee</span>
                    <span>${deliveryFee.toFixed(2)}</span>
                  </div>
                  <div className="border-t border-gray-200 pt-3">
                    <div className="flex justify-between text-xl font-bold">
                      <span>Total</span>
                      <span className="text-primary">${total.toFixed(2)}</span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={handleCheckout}
                  className="w-full bg-gradient-to-r from-primary to-primary-dark text-white py-4 rounded-full font-bold hover:shadow-lg transition-all transform hover:scale-105 active:scale-95 flex items-center justify-center"
                >
                  Proceed to Checkout
                  <ArrowRight className="ml-2 h-5 w-5" />
                </button>

                <div className="mt-4 text-center text-sm text-gray-500">
                  <p>Estimated delivery: 30-45 minutes</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

