'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ChefHat, MapPin, CreditCard, Wallet, DollarSign, Clock, Check, Loader2, ArrowRight } from 'lucide-react';
import { withAuth } from '@/lib/withAuth';
import { useCartStore } from '@/store/cartStore';
import { useAuthStore } from '@/store/authStore';
import { addressApi, orderApi, locationApi } from '@/lib/apiServices';
import type { Address } from '@/types/address';
import type { CreateOrderData } from '@/types/order';

type PaymentMethod = 'CREDIT_CARD' | 'DEBIT_CARD' | 'CASH';

function CheckoutPage() {
  const router = useRouter();
  const { user } = useAuthStore();
  const { items, getTotal, clearCart } = useCartStore();
  
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [selectedAddressId, setSelectedAddressId] = useState<string>('');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('CREDIT_CARD');
  const [tipAmount, setTipAmount] = useState(0);
  const [specialInstructions, setSpecialInstructions] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);
  const [error, setError] = useState('');

  const subtotal = getTotal();
  const tax = subtotal * 0.0825; // 8.25% tax
  const deliveryFee = 4.99;
  const total = subtotal + tax + deliveryFee + tipAmount;

  useEffect(() => {
    if (items.length === 0) {
      router.push('/cart');
      return;
    }
    loadCheckoutData();
  }, []);

  const loadCheckoutData = async () => {
    try {
      setIsLoading(true);
      const addressesData = await addressApi.getAddresses();
      setAddresses(addressesData);
      
      // Auto-select default address
      const defaultAddress = addressesData.find(addr => addr.isDefault);
      if (defaultAddress) {
        setSelectedAddressId(defaultAddress.id);
      } else if (addressesData.length > 0) {
        setSelectedAddressId(addressesData[0].id);
      }
    } catch (err: any) {
      setError('Failed to load checkout data');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePlaceOrder = async () => {
    if (!selectedAddressId) {
      setError('Please select a delivery address');
      return;
    }

    setIsPlacingOrder(true);
    setError('');

    try {
      // Get first available location (you might want to let user select this)
      const locations = await locationApi.getLocations();
      const location = locations[0];

      if (!location) {
        throw new Error('No location available');
      }

      const orderData: CreateOrderData = {
        locationId: location.id,
        orderType: 'DELIVERY',
        addressId: selectedAddressId,
        items: items.map(cartItem => ({
          itemId: cartItem.item.id,
          quantity: cartItem.quantity,
          modifiers: cartItem.selectedModifiers.map(mod => ({
            modifierId: mod.modifierId,
            quantity: mod.quantity,
          })),
          specialInstructions: cartItem.specialInstructions,
        })),
        specialInstructions,
        tipAmount,
      };

      const order = await orderApi.createOrder(orderData);
      
      // Clear cart
      clearCart();
      
      // Redirect to order confirmation
      router.push(`/orders/${order.id}`);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to place order. Please try again.');
    } finally {
      setIsPlacingOrder(false);
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
            <Link href="/cart" className="text-gray-700 hover:text-primary font-medium">
              Back to Cart
            </Link>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h2 className="text-4xl font-bold mb-8">Checkout</h2>

        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-red-800">{error}</p>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Delivery Address */}
            <div className="bg-white rounded-2xl shadow-md p-6 border border-gray-100">
              <div className="flex items-center space-x-3 mb-6">
                <div className="bg-primary/10 p-3 rounded-xl">
                  <MapPin className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="text-xl font-bold">Delivery Address</h3>
                  <p className="text-gray-600 text-sm">Where should we deliver your order?</p>
                </div>
              </div>

              {addresses.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-600 mb-4">No delivery addresses found</p>
                  <Link
                    href="/addresses"
                    className="inline-flex items-center text-primary hover:text-primary-dark font-medium"
                  >
                    Add Address
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </div>
              ) : (
                <div className="space-y-3">
                  {addresses.map((address) => (
                    <label
                      key={address.id}
                      className={`block p-4 rounded-lg border-2 cursor-pointer transition-all ${
                        selectedAddressId === address.id
                          ? 'border-primary bg-primary/5'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <input
                        type="radio"
                        name="address"
                        value={address.id}
                        checked={selectedAddressId === address.id}
                        onChange={() => setSelectedAddressId(address.id)}
                        className="sr-only"
                      />
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          {address.label && (
                            <p className="font-semibold text-gray-900 mb-1">{address.label}</p>
                          )}
                          <p className="text-gray-700">{address.street1}</p>
                          {address.street2 && <p className="text-gray-700">{address.street2}</p>}
                          <p className="text-gray-700">
                            {address.city}, {address.state} {address.zipCode}
                          </p>
                        </div>
                        {selectedAddressId === address.id && (
                          <Check className="h-6 w-6 text-primary flex-shrink-0" />
                        )}
                      </div>
                    </label>
                  ))}
                  <Link
                    href="/addresses"
                    className="block text-center py-3 text-primary hover:text-primary-dark font-medium"
                  >
                    + Add New Address
                  </Link>
                </div>
              )}
            </div>

            {/* Payment Method */}
            <div className="bg-white rounded-2xl shadow-md p-6 border border-gray-100">
              <div className="flex items-center space-x-3 mb-6">
                <div className="bg-green-100 p-3 rounded-xl">
                  <CreditCard className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <h3 className="text-xl font-bold">Payment Method</h3>
                  <p className="text-gray-600 text-sm">How would you like to pay?</p>
                </div>
              </div>

              <div className="space-y-3">
                <label className={`block p-4 rounded-lg border-2 cursor-pointer transition-all ${
                  paymentMethod === 'CREDIT_CARD' ? 'border-primary bg-primary/5' : 'border-gray-200'
                }`}>
                  <input
                    type="radio"
                    name="payment"
                    value="CREDIT_CARD"
                    checked={paymentMethod === 'CREDIT_CARD'}
                    onChange={() => setPaymentMethod('CREDIT_CARD')}
                    className="sr-only"
                  />
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <CreditCard className="h-6 w-6 text-gray-600" />
                      <span className="font-medium">Credit Card</span>
                    </div>
                    {paymentMethod === 'CREDIT_CARD' && <Check className="h-6 w-6 text-primary" />}
                  </div>
                </label>

                <label className={`block p-4 rounded-lg border-2 cursor-pointer transition-all ${
                  paymentMethod === 'DEBIT_CARD' ? 'border-primary bg-primary/5' : 'border-gray-200'
                }`}>
                  <input
                    type="radio"
                    name="payment"
                    value="DEBIT_CARD"
                    checked={paymentMethod === 'DEBIT_CARD'}
                    onChange={() => setPaymentMethod('DEBIT_CARD')}
                    className="sr-only"
                  />
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <Wallet className="h-6 w-6 text-gray-600" />
                      <span className="font-medium">Debit Card</span>
                    </div>
                    {paymentMethod === 'DEBIT_CARD' && <Check className="h-6 w-6 text-primary" />}
                  </div>
                </label>

                <label className={`block p-4 rounded-lg border-2 cursor-pointer transition-all ${
                  paymentMethod === 'CASH' ? 'border-primary bg-primary/5' : 'border-gray-200'
                }`}>
                  <input
                    type="radio"
                    name="payment"
                    value="CASH"
                    checked={paymentMethod === 'CASH'}
                    onChange={() => setPaymentMethod('CASH')}
                    className="sr-only"
                  />
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <DollarSign className="h-6 w-6 text-gray-600" />
                      <span className="font-medium">Cash on Delivery</span>
                    </div>
                    {paymentMethod === 'CASH' && <Check className="h-6 w-6 text-primary" />}
                  </div>
                </label>
              </div>

              <p className="mt-4 text-sm text-gray-500">
                💳 Payment will be processed securely at delivery
              </p>
            </div>

            {/* Tip */}
            <div className="bg-white rounded-2xl shadow-md p-6 border border-gray-100">
              <h3 className="text-xl font-bold mb-4">Add a Tip for Your Driver</h3>
              <div className="grid grid-cols-4 gap-3">
                {[0, 2, 5, 10].map((amount) => (
                  <button
                    key={amount}
                    onClick={() => setTipAmount(amount)}
                    className={`py-3 rounded-lg font-semibold transition-all ${
                      tipAmount === amount
                        ? 'bg-primary text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    ${amount}
                  </button>
                ))}
              </div>
              <input
                type="number"
                min="0"
                step="0.01"
                placeholder="Custom amount"
                value={tipAmount || ''}
                onChange={(e) => setTipAmount(parseFloat(e.target.value) || 0)}
                className="mt-3 w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
              />
            </div>

            {/* Special Instructions */}
            <div className="bg-white rounded-2xl shadow-md p-6 border border-gray-100">
              <h3 className="text-xl font-bold mb-4">Special Instructions</h3>
              <textarea
                value={specialInstructions}
                onChange={(e) => setSpecialInstructions(e.target.value)}
                placeholder="Any special requests? (e.g., extra napkins, ring doorbell)"
                rows={4}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none resize-none"
              />
            </div>
          </div>

          {/* Order Summary Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-md p-6 border border-gray-100 sticky top-24">
              <h3 className="text-2xl font-bold mb-6">Order Summary</h3>
              
              {/* Items */}
              <div className="space-y-3 mb-6 max-h-64 overflow-y-auto">
                {items.map((item, index) => (
                  <div key={index} className="flex justify-between text-sm">
                    <span className="text-gray-700">
                      {item.quantity}x {item.item.name}
                    </span>
                    <span className="font-medium">${item.subtotal.toFixed(2)}</span>
                  </div>
                ))}
              </div>

              {/* Totals */}
              <div className="space-y-3 border-t border-gray-200 pt-4 mb-6">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Delivery Fee</span>
                  <span>${deliveryFee.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Tax</span>
                  <span>${tax.toFixed(2)}</span>
                </div>
                {tipAmount > 0 && (
                  <div className="flex justify-between text-gray-600">
                    <span>Tip</span>
                    <span>${tipAmount.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between text-xl font-bold border-t border-gray-200 pt-3">
                  <span>Total</span>
                  <span className="text-primary">${total.toFixed(2)}</span>
                </div>
              </div>

              {/* Estimated Time */}
              <div className="flex items-center space-x-2 text-sm text-gray-600 mb-6 bg-blue-50 p-3 rounded-lg">
                <Clock className="h-5 w-5 text-blue-600" />
                <span>Estimated delivery: 30-45 minutes</span>
              </div>

              {/* Place Order Button */}
              <button
                onClick={handlePlaceOrder}
                disabled={isPlacingOrder || !selectedAddressId}
                className="w-full bg-gradient-to-r from-primary to-primary-dark text-white py-4 rounded-full font-bold hover:shadow-lg transition-all transform hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center"
              >
                {isPlacingOrder ? (
                  <>
                    <Loader2 className="animate-spin h-5 w-5 mr-2" />
                    Placing Order...
                  </>
                ) : (
                  <>
                    Place Order
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </>
                )}
              </button>

              <p className="text-xs text-gray-500 text-center mt-4">
                By placing this order, you agree to our Terms of Service
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default withAuth(CheckoutPage);

