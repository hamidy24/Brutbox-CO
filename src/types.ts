export type CategorySlug = 
  | 'underwear' 
  | 'bow-ties' 
  | 'pocket-squares' 
  | 'socks' 
  | 'eyeglass-cases' 
  | 'wallets';

export interface CategoryInfo {
  slug: CategorySlug;
  name: string;
  tagline: string;
  sizes: string[];
}

export interface ProductVariantStock {
  [color: string]: {
    [size: string]: number;
  };
}

export interface Product {
  id: string;
  name: string;
  category: CategorySlug;
  price: number;
  colors: string[];
  sizes: string[];
  stock: ProductVariantStock;
  image: string;
  images: string[];
  description: string;
  details: string[];
  materials: string;
  care: string;
  rating: number;
  reviewsCount: number;
  hidden: boolean;
  source: 'seed' | 'admin';
  createdAt: string;
}

export interface CartItem {
  id: string; // unique item line id (e.g. p-1001-Black-M)
  productId: string;
  name: string;
  category: CategorySlug;
  color: string;
  size: string;
  price: number;
  qty: number;
  image: string;
}

export interface ShippingDetails {
  fullName: string;
  phone: string;
  address: string;
  city: string;
  postalCode: string;
  notes?: string;
}

export type PaymentMethod = 'COD' | 'bKash' | 'Nagad' | 'CARD';

export type OrderStatus = 'Ordered' | 'Packed' | 'In Transit' | 'Delivered';

export interface TrackingMilestone {
  step: OrderStatus;
  label: string;
  timestamp: string;
  note: string;
  completed: boolean;
}

export interface Order {
  id: string;
  createdAt: string;
  customer: string;
  phone: string;
  address: string;
  paymentMethod: PaymentMethod;
  items: Array<{
    productId: string;
    name: string;
    size: string;
    color: string;
    qty: number;
    price: number;
    image?: string;
  }>;
  subtotal: number;
  deliveryFee: number;
  total: number;
  status: OrderStatus;
  carrierName: string;
  trackingNumber: string;
  estimatedDelivery: string;
  milestones: TrackingMilestone[];
  isDemo: boolean;
}

export interface AdminSession {
  token: string;
  startedAt: number;
  lastSeen: number;
}

export interface ActivityLogItem {
  id: string;
  type: 'upload' | 'restock' | 'price' | 'delete' | 'visibility' | 'login' | 'export';
  message: string;
  at: string;
}
