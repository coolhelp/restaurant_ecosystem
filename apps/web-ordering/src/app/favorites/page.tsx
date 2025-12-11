'use client';

import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ChefHat, Heart, ShoppingCart, Trash2, Plus, Star } from 'lucide-react';
import { withAuth } from '@/lib/withAuth';
import { useFavoritesStore } from '@/store/favoritesStore';
import { useCartStore } from '@/store/cartStore';

function FavoritesPage() {
  const router = useRouter();
  const { favorites, removeFavorite, clearFavorites } = useFavoritesStore();
  const { addItem } = useCartStore();

  const handleAddToCart = (item: any) => {
    addItem(item, 1, [], undefined);
    // Show a toast notification here if you want
  };

  const handleRemoveFavorite = (itemId: string) => {
    if (confirm('Remove this item from favorites?')) {
      removeFavorite(itemId);
    }
  };

  const handleClearAll = () => {
    if (confirm('Remove all items from favorites?')) {
      clearFavorites();
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
            <div className="flex items-center space-x-4">
              <Link href="/dashboard" className="text-gray-700 hover:text-primary font-medium">
                Dashboard
              </Link>
              <Link href="/menu" className="text-primary hover:text-primary-dark font-medium">
                Browse Menu
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <div className="bg-gradient-to-r from-red-500 via-pink-500 to-red-600 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center space-x-3 mb-2">
            <Heart className="h-10 w-10 fill-white" />
            <h2 className="text-4xl font-bold">My Favorites</h2>
          </div>
          <p className="text-xl text-white/90">Your saved menu items</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {favorites.length > 0 && (
          <div className="flex justify-between items-center mb-8">
            <p className="text-gray-600">
              {favorites.length} {favorites.length === 1 ? 'item' : 'items'} saved
            </p>
            <button
              onClick={handleClearAll}
              className="text-red-600 hover:text-red-700 font-medium flex items-center"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Clear All
            </button>
          </div>
        )}

        {favorites.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-md p-12 text-center">
            <div className="relative inline-block mb-6">
              <Heart className="h-24 w-24 text-gray-300" />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-16 h-1 bg-gray-300 rotate-45"></div>
              </div>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">No favorites yet</h3>
            <p className="text-gray-600 mb-6">
              Start adding items to your favorites for quick access later
            </p>
            <Link
              href="/menu"
              className="inline-flex items-center px-8 py-3 bg-gradient-to-r from-primary to-primary-dark text-white rounded-full font-semibold hover:shadow-lg transition-all"
            >
              Browse Menu
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {favorites.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 overflow-hidden group relative"
              >
                {/* Favorite Badge */}
                <div className="absolute top-4 right-4 z-10">
                  <button
                    onClick={() => handleRemoveFavorite(item.id)}
                    className="bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition-colors shadow-lg"
                  >
                    <Heart className="h-5 w-5 fill-white" />
                  </button>
                </div>

                {/* Image */}
                <div className="relative">
                  <div className="w-full h-56 bg-gradient-to-br from-orange-400 via-red-400 to-pink-400"></div>
                  {item.isFeatured && (
                    <div className="absolute top-4 left-4">
                      <span className="bg-accent text-gray-900 px-3 py-1 rounded-full text-sm font-semibold flex items-center">
                        <Star className="h-4 w-4 mr-1 fill-current" />
                        Featured
                      </span>
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="p-6">
                  <h3 className="text-xl font-bold mb-2 text-gray-900">{item.name}</h3>
                  {item.description && (
                    <p className="text-gray-600 mb-4 text-sm line-clamp-2">{item.description}</p>
                  )}

                  {/* Info */}
                  <div className="flex items-center justify-between mb-4 text-sm text-gray-500">
                    {item.calories && <span>{item.calories} cal</span>}
                    {item.prepTime && <span>{item.prepTime} min</span>}
                  </div>

                  {/* Price & Actions */}
                  <div className="flex justify-between items-center">
                    <span className="text-3xl font-bold text-primary">
                      ${Number(item.basePrice).toFixed(2)}
                    </span>
                    <button
                      onClick={() => handleAddToCart(item)}
                      className="bg-gradient-to-r from-primary to-primary-dark text-white px-6 py-2.5 rounded-full hover:shadow-lg transition-all font-medium flex items-center space-x-2"
                    >
                      <ShoppingCart className="h-5 w-5" />
                      <span>Add to Cart</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Quick Actions */}
        {favorites.length > 0 && (
          <div className="mt-12 bg-gradient-to-r from-primary via-primary-dark to-secondary rounded-2xl p-8 text-white text-center">
            <h3 className="text-2xl font-bold mb-4">Ready to order?</h3>
            <p className="text-white/90 mb-6">
              Add your favorite items to cart and complete your order
            </p>
            <div className="flex justify-center space-x-4">
              <button
                onClick={() => {
                  // Add all favorites to cart
                  favorites.forEach(item => addItem(item, 1, [], undefined));
                  router.push('/cart');
                }}
                className="bg-white text-primary px-8 py-3 rounded-full font-semibold hover:bg-gray-100 transition-all"
              >
                Add All to Cart
              </button>
              <Link
                href="/menu"
                className="border-2 border-white text-white px-8 py-3 rounded-full font-semibold hover:bg-white hover:text-primary transition-all"
              >
                Browse More Items
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default withAuth(FavoritesPage);

