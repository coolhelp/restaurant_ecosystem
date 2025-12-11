export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  image?: string;
  sortOrder: number;
  isActive: boolean;
}

export interface Item {
  id: string;
  categoryId: string;
  name: string;
  slug: string;
  description?: string;
  image?: string;
  basePrice: number;
  cost?: number;
  calories?: number;
  prepTime?: number;
  isAvailable: boolean;
  isActive: boolean;
  isFeatured: boolean;
  tags?: string[];
  allergens?: string[];
  category?: Category;
  modifierGroups?: ItemModifierGroup[];
}

export interface ModifierGroup {
  id: string;
  name: string;
  description?: string;
  minSelection: number;
  maxSelection?: number;
  isRequired: boolean;
  modifiers: Modifier[];
}

export interface Modifier {
  id: string;
  name: string;
  price: number;
  isDefault: boolean;
  isAvailable: boolean;
}

export interface ItemModifierGroup {
  modifierGroupId: string;
  isRequired: boolean;
  modifierGroup: ModifierGroup;
}

export interface CartItem {
  item: Item;
  quantity: number;
  selectedModifiers: SelectedModifier[];
  specialInstructions?: string;
  subtotal: number;
}

export interface SelectedModifier {
  modifierId: string;
  modifierGroupId: string;
  name: string;
  price: number;
  quantity: number;
}

