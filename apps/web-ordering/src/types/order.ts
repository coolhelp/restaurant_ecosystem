export interface Order {
  id: string;
  orderNumber: string;
  userId: string;
  locationId: string;
  orderType: OrderType;
  orderStatus: OrderStatus;
  paymentStatus: PaymentStatus;
  
  tableId?: string;
  tableNumber?: string;
  addressId?: string;
  scheduledFor?: Date;
  
  subtotal: number;
  taxAmount: number;
  tipAmount: number;
  deliveryFee: number;
  discountAmount: number;
  loyaltyDiscount: number;
  total: number;
  
  specialInstructions?: string;
  customerNotes?: string;
  estimatedTime?: number;
  
  placedAt: Date;
  acceptedAt?: Date;
  readyAt?: Date;
  completedAt?: Date;
  cancelledAt?: Date;
  
  items: OrderItem[];
  delivery?: Delivery;
}

export type OrderType = 'DINE_IN' | 'TAKEOUT' | 'PICKUP' | 'DELIVERY';
export type OrderStatus = 'PENDING' | 'CONFIRMED' | 'PREPARING' | 'READY' | 'OUT_FOR_DELIVERY' | 'COMPLETED' | 'CANCELLED';
export type PaymentStatus = 'PENDING' | 'AUTHORIZED' | 'PAID' | 'PARTIALLY_REFUNDED' | 'REFUNDED' | 'FAILED';

export interface OrderItem {
  id: string;
  itemId: string;
  quantity: number;
  unitPrice: number;
  subtotal: number;
  specialInstructions?: string;
  item?: {
    name: string;
    image?: string;
  };
  modifiers: OrderItemModifier[];
}

export interface OrderItemModifier {
  id: string;
  modifierId: string;
  quantity: number;
  price: number;
  modifier?: {
    name: string;
  };
}

export interface Delivery {
  id: string;
  orderId: string;
  status: DeliveryStatus;
  deliveryAddress: string;
  estimatedTime?: number;
  assignedAt?: Date;
  pickedUpAt?: Date;
  deliveredAt?: Date;
}

export type DeliveryStatus = 'PENDING' | 'ASSIGNED' | 'PICKED_UP' | 'ON_THE_WAY' | 'DELIVERED' | 'CANCELLED';

export interface CreateOrderData {
  locationId: string;
  orderType: OrderType;
  addressId?: string;
  scheduledFor?: Date;
  items: {
    itemId: string;
    quantity: number;
    modifiers?: {
      modifierId: string;
      quantity: number;
    }[];
    specialInstructions?: string;
  }[];
  specialInstructions?: string;
  tipAmount?: number;
}

