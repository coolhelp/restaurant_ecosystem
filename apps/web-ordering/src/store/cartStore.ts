import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { CartItem, Item, SelectedModifier } from '@/types/menu';

interface CartState {
  items: CartItem[];
  addItem: (item: Item, quantity: number, selectedModifiers: SelectedModifier[], specialInstructions?: string) => void;
  removeItem: (itemId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  clearCart: () => void;
  getTotal: () => number;
  getItemCount: () => number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (item, quantity, selectedModifiers, specialInstructions) => {
        const modifiersTotal = selectedModifiers.reduce((sum, mod) => sum + (mod.price * mod.quantity), 0);
        const subtotal = (item.basePrice + modifiersTotal) * quantity;

        const cartItem: CartItem = {
          item,
          quantity,
          selectedModifiers,
          specialInstructions,
          subtotal,
        };

        set((state) => {
          // Check if same item with same modifiers exists
          const existingIndex = state.items.findIndex(
            (i) =>
              i.item.id === item.id &&
              JSON.stringify(i.selectedModifiers) === JSON.stringify(selectedModifiers)
          );

          if (existingIndex >= 0) {
            // Update quantity if item exists
            const newItems = [...state.items];
            newItems[existingIndex].quantity += quantity;
            newItems[existingIndex].subtotal = 
              (item.basePrice + modifiersTotal) * newItems[existingIndex].quantity;
            return { items: newItems };
          }

          // Add new item
          return { items: [...state.items, cartItem] };
        });
      },

      removeItem: (itemId) => {
        set((state) => ({
          items: state.items.filter((item) => item.item.id !== itemId),
        }));
      },

      updateQuantity: (itemId, quantity) => {
        set((state) => ({
          items: state.items.map((item) => {
            if (item.item.id === itemId) {
              const modifiersTotal = item.selectedModifiers.reduce(
                (sum, mod) => sum + (mod.price * mod.quantity),
                0
              );
              const subtotal = (item.item.basePrice + modifiersTotal) * quantity;
              return { ...item, quantity, subtotal };
            }
            return item;
          }),
        }));
      },

      clearCart: () => set({ items: [] }),

      getTotal: () => {
        const state = get();
        return state.items.reduce((total, item) => total + item.subtotal, 0);
      },

      getItemCount: () => {
        const state = get();
        return state.items.reduce((count, item) => count + item.quantity, 0);
      },
    }),
    {
      name: 'cart-storage',
    }
  )
);

