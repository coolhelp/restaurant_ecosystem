'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ChefHat, ShoppingCart, Search, Filter, Star, Plus, Loader2, Heart } from 'lucide-react';
import { menuApi } from '@/lib/apiServices';
import { useCartStore } from '@/store/cartStore';
import { useAuthStore } from '@/store/authStore';
import { useFavoritesStore } from '@/store/favoritesStore';
import type { Category, Item } from '@/types/menu';

export default function MenuPage() {
  const router = useRouter();
  const { user } = useAuthStore();
  const { items: cartItems, addItem, getItemCount } = useCartStore();
  const { addFavorite, removeFavorite, isFavorite } = useFavoritesStore();
  
  const [categories, setCategories] = useState<Category[]>([]);
  const [items, setItems] = useState<Item[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadMenu();
  }, []);

  const loadMenu = async () => {
    try {
      setIsLoading(true);
      const [categoriesData, itemsData] = await Promise.all([
        menuApi.getCategories(),
        menuApi.getItems(),
      ]);
      setCategories(categoriesData.filter(c => c.isActive));
      setItems(itemsData.filter(i => i.isAvailable && i.isActive));
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to load menu');
    } finally {
      setIsLoading(false);
    }
  };

  const filteredItems = items.filter((item) => {
    const matchesCategory = selectedCategory === 'all' || item.categoryId === selectedCategory;
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         item.description?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleAddToCart = (item: Item) => {
    addItem(item, 1, [], undefined);
    // Could show a toast notification here
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
      <header className="bg-white shadow-sm sticky top-0 z-50 border-b border-gray-100">
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
              {user && (
                <Link href="/dashboard" className="text-gray-700 hover:text-primary font-medium">
                  Dashboard
                </Link>
              )}
              <Link href="/cart" className="relative p-2 hover:bg-gray-100 rounded-lg transition-colors">
                <ShoppingCart className="h-6 w-6 text-gray-700" />
                {getItemCount() > 0 && (
                  <span className="absolute -top-1 -right-1 bg-primary text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold">
                    {getItemCount()}
                  </span>
                )}
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <div className="bg-gradient-to-r from-primary via-primary-dark to-secondary text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold mb-4">Our Menu</h2>
          <p className="text-xl text-white/90">Fresh, delicious, and delivered fast!</p>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="bg-white border-b border-gray-200 sticky top-16 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search menu items..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 rounded-lg border border-gray-300 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Categories */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex overflow-x-auto py-4 space-x-4 scrollbar-hide">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`px-6 py-2 rounded-full font-medium whitespace-nowrap transition-colors ${
                selectedCategory === 'all'
                  ? 'bg-primary text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              All Items
            </button>
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`px-6 py-2 rounded-full font-medium whitespace-nowrap transition-colors ${
                  selectedCategory === category.id
                    ? 'bg-primary text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {category.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Menu Items */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {error ? (
          <div className="text-center py-12">
            <p className="text-red-600 mb-4">{error}</p>
            <button
              onClick={loadMenu}
              className="px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary-dark"
            >
              Try Again
            </button>
          </div>
        ) : filteredItems.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600 mb-4">No items found</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredItems.map((item) => (
              <MenuItem 
                key={item.id} 
                item={item} 
                onAddToCart={handleAddToCart}
                isFavorite={isFavorite(item.id)}
                onToggleFavorite={() => {
                  if (isFavorite(item.id)) {
                    removeFavorite(item.id);
                  } else {
                    addFavorite(item);
                  }
                }}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function MenuItem({ item, onAddToCart, isFavorite, onToggleFavorite }: { 
  item: Item; 
  onAddToCart: (item: Item) => void;
  isFavorite: boolean;
  onToggleFavorite: () => void;
}) {
  return (
    <div className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 overflow-hidden group relative">
      {/* Favorite Button */}
      <button
        onClick={onToggleFavorite}
        className={`absolute top-4 right-4 z-10 p-2 rounded-full transition-all ${
          isFavorite 
            ? 'bg-red-500 text-white' 
            : 'bg-white/90 text-gray-400 hover:text-red-500'
        }`}
      >
        <Heart className={`h-5 w-5 ${isFavorite ? 'fill-white' : ''}`} />
      </button>

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
      <div className="p-6">
        <h3 className="text-xl font-bold mb-2 text-gray-900">{item.name}</h3>
        {item.description && (
          <p className="text-gray-600 mb-4 text-sm line-clamp-2">{item.description}</p>
        )}
        <div className="flex items-center justify-between mb-4">
          {item.calories && (
            <span className="text-sm text-gray-500">{item.calories} cal</span>
          )}
          {item.prepTime && (
            <span className="text-sm text-gray-500">{item.prepTime} min</span>
          )}
        </div>
        <div className="flex justify-between items-center">
          <span className="text-3xl font-bold text-primary">${Number(item.basePrice).toFixed(2)}</span>
          <button
            onClick={() => onAddToCart(item)}
            className="bg-gradient-to-r from-primary to-primary-dark text-white p-3 rounded-full hover:shadow-lg transition-all transform hover:scale-110 active:scale-95"
          >
            <Plus className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  );
}

