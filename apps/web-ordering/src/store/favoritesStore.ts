import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Item } from '@/types/menu';

interface FavoritesState {
  favorites: Item[];
  addFavorite: (item: Item) => void;
  removeFavorite: (itemId: string) => void;
  isFavorite: (itemId: string) => boolean;
  clearFavorites: () => void;
}

export const useFavoritesStore = create<FavoritesState>()(
  persist(
    (set, get) => ({
      favorites: [],

      addFavorite: (item) => {
        set((state) => {
          // Check if already exists
          if (state.favorites.some(f => f.id === item.id)) {
            return state;
          }
          return { favorites: [...state.favorites, item] };
        });
      },

      removeFavorite: (itemId) => {
        set((state) => ({
          favorites: state.favorites.filter(item => item.id !== itemId),
        }));
      },

      isFavorite: (itemId) => {
        return get().favorites.some(item => item.id === itemId);
      },

      clearFavorites: () => set({ favorites: [] }),
    }),
    {
      name: 'favorites-storage',
    }
  )
);

