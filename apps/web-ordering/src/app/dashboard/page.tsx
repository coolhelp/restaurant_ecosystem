'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { useAuthStore } from '@/store/authStore';
import { withAuth } from '@/lib/withAuth';
import { loyaltyApi } from '@/lib/apiServices';
import { ChefHat, ShoppingBag, Heart, Clock, MapPin, User, Settings, LogOut, Bell, CreditCard, Star, TrendingUp } from 'lucide-react';

function DashboardPage() {
  const router = useRouter();
  const { user, clearAuth } = useAuthStore();
  const [loyaltyAccount, setLoyaltyAccount] = useState<any>(null);
  const [isLoadingLoyalty, setIsLoadingLoyalty] = useState(true);

  useEffect(() => {
    loadLoyaltyData();
  }, []);

  const loadLoyaltyData = async () => {
    try {
      const data = await loyaltyApi.getAccount();
      setLoyaltyAccount(data);
    } catch (err) {
      // Loyalty account might not exist yet
      console.log('No loyalty account found');
    } finally {
      setIsLoadingLoyalty(false);
    }
  };

  const handleLogout = async () => {
    clearAuth();
    toast.success('Logged out successfully');
    router.push('/');
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
            <div className="flex items-center space-x-4">
              <button className="relative p-2 rounded-lg hover:bg-gray-100 transition-colors">
                <Bell className="h-6 w-6 text-gray-600" />
                <span className="absolute top-1 right-1 bg-primary text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                  3
                </span>
              </button>
              <button
                onClick={handleLogout}
                className="flex items-center space-x-2 px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <LogOut className="h-5 w-5" />
                <span className="hidden sm:inline">Logout</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-primary via-primary-dark to-secondary text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold mb-2">
            Welcome back, {user?.firstName}! 👋
          </h2>
          <p className="text-xl text-white/90">
            Ready to order something delicious?
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <QuickActionCard
            icon={<ShoppingBag className="h-8 w-8" />}
            title="Order Now"
            description="Browse our menu"
            color="bg-blue-500"
            href="/menu"
          />
          <QuickActionCard
            icon={<Clock className="h-8 w-8" />}
            title="Order History"
            description="View past orders"
            color="bg-green-500"
            href="/orders"
          />
          <QuickActionCard
            icon={<Heart className="h-8 w-8" />}
            title="Favorites"
            description="Your saved items"
            color="bg-red-500"
            href="/favorites"
          />
          <QuickActionCard
            icon={<MapPin className="h-8 w-8" />}
            title="Addresses"
            description="Manage locations"
            color="bg-purple-500"
            href="/addresses"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Recent Orders */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-md p-6 border border-gray-100">
              <h3 className="text-2xl font-bold mb-6 flex items-center">
                <Clock className="h-6 w-6 mr-2 text-primary" />
                Recent Orders
              </h3>
              <div className="space-y-4">
                <EmptyState
                  icon={<ShoppingBag className="h-12 w-12 text-gray-300" />}
                  title="No orders yet"
                  description="Start ordering your favorite meals now!"
                  action={
                    <Link
                      href="/menu"
                      className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-primary to-primary-dark text-white rounded-full font-semibold hover:shadow-lg transition-all"
                    >
                      Browse Menu
                    </Link>
                  }
                />
              </div>
            </div>
          </div>

          {/* Account Summary */}
          <div className="space-y-6">
            {/* Profile Card */}
            <div className="bg-white rounded-2xl shadow-md p-6 border border-gray-100">
              <h3 className="text-xl font-bold mb-4 flex items-center">
                <User className="h-5 w-5 mr-2 text-primary" />
                Your Profile
              </h3>
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-gray-500">Name</p>
                  <p className="font-semibold">{user?.firstName} {user?.lastName}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Email</p>
                  <p className="font-semibold">{user?.email}</p>
                </div>
                {user?.phone && (
                  <div>
                    <p className="text-sm text-gray-500">Phone</p>
                    <p className="font-semibold">{user?.phone}</p>
                  </div>
                )}
                <div>
                  <p className="text-sm text-gray-500">Account Type</p>
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-primary/10 text-primary">
                    {user?.role}
                  </span>
                </div>
                <Link
                  href="/profile"
                  className="block w-full text-center px-4 py-2 border border-primary text-primary rounded-lg hover:bg-primary hover:text-white transition-colors font-medium"
                >
                  Edit Profile
                </Link>
              </div>
            </div>

            {/* Quick Links */}
            <div className="bg-white rounded-2xl shadow-md p-6 border border-gray-100">
              <h3 className="text-xl font-bold mb-4">Quick Links</h3>
              <div className="space-y-2">
                <QuickLink icon={<Settings />} text="Account Settings" href="/settings" />
                <QuickLink icon={<CreditCard />} text="Payment Methods" href="/payment-methods" />
                <QuickLink icon={<MapPin />} text="Delivery Addresses" href="/addresses" />
                <QuickLink icon={<Bell />} text="Notifications" href="/notifications" />
              </div>
            </div>
          </div>
        </div>
        </div>
      </div>
    </div>
  );
}

function QuickActionCard({ icon, title, description, color, href }: {
  icon: React.ReactNode;
  title: string;
  description: string;
  color: string;
  href: string;
}) {
  return (
    <Link
      href={href}
      className="bg-white p-6 rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100 group"
    >
      <div className={`${color} w-16 h-16 rounded-xl flex items-center justify-center text-white mb-4 group-hover:scale-110 transition-transform`}>
        {icon}
      </div>
      <h4 className="text-lg font-bold mb-1 text-gray-900">{title}</h4>
      <p className="text-gray-600 text-sm">{description}</p>
    </Link>
  );
}

function QuickLink({ icon, text, href }: {
  icon: React.ReactNode;
  text: string;
  href: string;
}) {
  return (
    <Link
      href={href}
      className="flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-gray-50 transition-colors group"
    >
      <div className="text-gray-400 group-hover:text-primary transition-colors">
        {icon}
      </div>
      <span className="text-gray-700 group-hover:text-gray-900 font-medium">{text}</span>
    </Link>
  );
}

function EmptyState({ icon, title, description, action }: {
  icon: React.ReactNode;
  title: string;
  description: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="text-center py-12">
      <div className="flex justify-center mb-4">
        {icon}
      </div>
      <h4 className="text-xl font-semibold text-gray-900 mb-2">{title}</h4>
      <p className="text-gray-600 mb-6">{description}</p>
      {action}
    </div>
  );
}

export default withAuth(DashboardPage);

