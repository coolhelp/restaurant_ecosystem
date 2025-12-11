'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { ChefHat, MapPin, Plus, Trash2, Edit, Check, Loader2, X } from 'lucide-react';
import { withAuth } from '@/lib/withAuth';
import { addressApi } from '@/lib/apiServices';
import type { Address, CreateAddressData } from '@/types/address';

const addressSchema = z.object({
  label: z.string().min(1, 'Label is required').max(50, 'Label is too long'),
  street1: z.string().min(3, 'Street address is required'),
  street2: z.string().optional(),
  city: z.string().min(2, 'City is required'),
  state: z.string().min(2, 'State is required'),
  zipCode: z.string().regex(/^\d{5}(-\d{4})?$/, 'Invalid ZIP code'),
  isDefault: z.boolean().default(false),
});

type AddressFormData = z.infer<typeof addressSchema>;

function AddressesPage() {
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<AddressFormData>({
    resolver: zodResolver(addressSchema),
    defaultValues: {
      isDefault: false,
    },
  });

  useEffect(() => {
    loadAddresses();
  }, []);

  const loadAddresses = async () => {
    try {
      setIsLoading(true);
      const data = await addressApi.getAddresses();
      setAddresses(data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to load addresses');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddAddress = async (data: AddressFormData) => {
    setIsSaving(true);
    try {
      const newAddress = await addressApi.createAddress({
        ...data,
        country: 'US',
      });
      setAddresses([...addresses, newAddress]);
      setShowAddForm(false);
      reset();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to add address');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this address?')) return;

    try {
      await addressApi.deleteAddress(id);
      setAddresses(addresses.filter(addr => addr.id !== id));
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to delete address');
    }
  };

  const handleSetDefault = async (id: string) => {
    try {
      await addressApi.setDefaultAddress(id);
      // Refresh addresses
      loadAddresses();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to set default address');
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

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-4xl font-bold">Delivery Addresses</h2>
          <button 
            onClick={() => setShowAddForm(true)}
            className="flex items-center px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors font-medium"
          >
            <Plus className="h-5 w-5 mr-2" />
            Add Address
          </button>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <p className="text-red-800">{error}</p>
          </div>
        )}

        {/* Add Address Modal */}
        {showAddForm && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
                <h3 className="text-2xl font-bold">Add New Address</h3>
                <button
                  onClick={() => {
                    setShowAddForm(false);
                    reset();
                  }}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              <form onSubmit={handleSubmit(handleAddAddress)} className="p-6 space-y-4">
                {/* Label */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Address Label *
                  </label>
                  <input
                    {...register('label')}
                    type="text"
                    placeholder="e.g., Home, Work, Mom's House"
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
                  />
                  {errors.label && (
                    <p className="mt-1 text-sm text-red-600">{errors.label.message}</p>
                  )}
                </div>

                {/* Street 1 */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Street Address *
                  </label>
                  <input
                    {...register('street1')}
                    type="text"
                    placeholder="123 Main Street"
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
                  />
                  {errors.street1 && (
                    <p className="mt-1 text-sm text-red-600">{errors.street1.message}</p>
                  )}
                </div>

                {/* Street 2 */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Apt, Suite, Unit (Optional)
                  </label>
                  <input
                    {...register('street2')}
                    type="text"
                    placeholder="Apt 4B"
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
                  />
                </div>

                {/* City & State */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      City *
                    </label>
                    <input
                      {...register('city')}
                      type="text"
                      placeholder="New York"
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
                    />
                    {errors.city && (
                      <p className="mt-1 text-sm text-red-600">{errors.city.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      State *
                    </label>
                    <input
                      {...register('state')}
                      type="text"
                      placeholder="NY"
                      maxLength={2}
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none uppercase"
                    />
                    {errors.state && (
                      <p className="mt-1 text-sm text-red-600">{errors.state.message}</p>
                    )}
                  </div>
                </div>

                {/* ZIP Code */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    ZIP Code *
                  </label>
                  <input
                    {...register('zipCode')}
                    type="text"
                    placeholder="10001"
                    maxLength={10}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
                  />
                  {errors.zipCode && (
                    <p className="mt-1 text-sm text-red-600">{errors.zipCode.message}</p>
                  )}
                </div>

                {/* Set as Default */}
                <div className="flex items-center">
                  <input
                    {...register('isDefault')}
                    id="isDefault"
                    type="checkbox"
                    className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded cursor-pointer"
                  />
                  <label htmlFor="isDefault" className="ml-3 text-sm text-gray-700 cursor-pointer">
                    Set as default delivery address
                  </label>
                </div>

                {/* Action Buttons */}
                <div className="flex space-x-4 pt-4">
                  <button
                    type="submit"
                    disabled={isSaving}
                    className="flex-1 bg-primary text-white py-3 rounded-lg font-semibold hover:bg-primary-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                  >
                    {isSaving ? (
                      <>
                        <Loader2 className="animate-spin h-5 w-5 mr-2" />
                        Adding...
                      </>
                    ) : (
                      <>
                        <Plus className="h-5 w-5 mr-2" />
                        Add Address
                      </>
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowAddForm(false);
                      reset();
                    }}
                    className="px-8 py-3 border border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {addresses.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-md p-12 text-center">
            <MapPin className="h-24 w-24 text-gray-300 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-gray-900 mb-2">No addresses yet</h3>
            <p className="text-gray-600 mb-6">Add a delivery address to start ordering</p>
            <button 
              onClick={() => setShowAddForm(true)}
              className="inline-flex items-center px-8 py-3 bg-gradient-to-r from-primary to-primary-dark text-white rounded-full font-semibold hover:shadow-lg transition-all"
            >
              <Plus className="h-5 w-5 mr-2" />
              Add Your First Address
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {addresses.map((address) => (
              <div 
                key={address.id} 
                className={`bg-white rounded-2xl shadow-md p-6 border ${address.isDefault ? 'border-primary' : 'border-gray-100'} hover:shadow-lg transition-all relative`}
              >
                {address.isDefault && (
                  <div className="absolute top-4 right-4">
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-primary text-white">
                      <Check className="h-3 w-3 mr-1" />
                      Default
                    </span>
                  </div>
                )}

                <div className="flex items-start space-x-4 mb-4">
                  <div className="bg-primary/10 p-3 rounded-xl flex-shrink-0">
                    <MapPin className="h-6 w-6 text-primary" />
                  </div>
                  <div className="flex-1">
                    {address.label && (
                      <h3 className="text-lg font-bold text-gray-900 mb-2">{address.label}</h3>
                    )}
                    <p className="text-gray-700">{address.street1}</p>
                    {address.street2 && <p className="text-gray-700">{address.street2}</p>}
                    <p className="text-gray-700">
                      {address.city}, {address.state} {address.zipCode}
                    </p>
                    <p className="text-gray-600 text-sm mt-1">{address.country}</p>
                  </div>
                </div>

                <div className="flex space-x-2 pt-4 border-t border-gray-200">
                  {!address.isDefault && (
                    <button
                      onClick={() => handleSetDefault(address.id)}
                      className="flex-1 px-4 py-2 border border-primary text-primary rounded-lg hover:bg-primary hover:text-white transition-colors font-medium text-sm"
                    >
                      Set as Default
                    </button>
                  )}
                  <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
                    <Edit className="h-5 w-5" />
                  </button>
                  <button 
                    onClick={() => handleDelete(address.id)}
                    className="px-4 py-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors"
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default withAuth(AddressesPage);

