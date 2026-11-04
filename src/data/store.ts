import {
  CategoryInfo,
  Product,
  CartItem,
  Order,
  AdminSession,
  ActivityLogItem,
  PaymentMethod,
  OrderStatus,
} from '../types';

export const CATEGORIES: CategoryInfo[] = [
  { slug: 'underwear', name: 'Underwear', tagline: "Men's Everyday Comfort", sizes: ['S', 'M', 'L', 'XL'] },
  { slug: 'bow-ties', name: 'Bow Ties', tagline: 'Formal & Black-Tie Essentials', sizes: ['One Size'] },
  { slug: 'pocket-squares', name: 'Pocket Squares', tagline: 'Suit & Blazer Finishing Touches', sizes: ['One Size'] },
  { slug: 'socks', name: 'Socks', tagline: 'Breathable Merino & Cotton Basics', sizes: ['40–43', '44–46'] },
  { slug: 'eyeglass-cases', name: 'Eyeglass Cases', tagline: 'Protective Minimal Travel Shells', sizes: ['Standard'] },
  { slug: 'wallets', name: 'Wallets', tagline: 'Full-Grain Handcrafted Leather Carry', sizes: ['Standard'] },
];

export const COLOR_SWATCHES: Record<string, string> = {
  Black: '#111111',
  Navy: '#1E2B3E',
  Grey: '#6B7280',
  White: '#F3F4F6',
  Burgundy: '#6A1A24',
  Emerald: '#1B4D3E',
  Brown: '#5C3826',
  Tan: '#A67B5B',
  Gold: '#C89C68',
  Champagne: '#E5D3B3',
};

export const FREE_DELIVERY_THRESHOLD = 3000;
export const STANDARD_DELIVERY_FEE = 70;
export const MAX_ADMIN_SEATS = 3;
export const SESSION_TTL_MS = 120 * 1000; // 2 minutes heartbeat

// Storage keys
const STORAGE_KEYS = {
  products: 'bb_products_v4',
  cart: 'bb_cart_v4',
  wishlist: 'bb_wishlist_v4',
  recent: 'bb_recent_v4',
  orders: 'bb_orders_v4',
  sessions: 'bb_admin_sessions_v4',
  activity: 'bb_admin_activity_v4',
  lastOrderId: 'bb_last_order_id_v4',
};

// Seed products using generated high-resolution assets
export const INITIAL_PRODUCTS: Product[] = [
  {
    id: 'p-1001',
    name: 'Organic Cotton Boxer Brief',
    category: 'underwear',
    price: 450,
    colors: ['Black', 'Navy', 'Grey'],
    sizes: ['S', 'M', 'L', 'XL'],
    stock: {
      Black: { S: 8, M: 24, L: 14, XL: 6 },
      Navy: { S: 5, M: 18, L: 9, XL: 2 },
      Grey: { S: 12, M: 30, L: 15, XL: 8 },
    },
    image: '/src/assets/images/product_cotton_boxer_1793796879993.jpg',
    images: [
      '/src/assets/images/product_cotton_boxer_1793796879993.jpg',
      '/src/assets/images/hero_mens_editorial_1793796879372.jpg',
    ],
    description: 'Tailored from ultra-soft 95% long-staple organic cotton and 5% elastane. Features an ergonomic anti-roll microfiber waistband and non-binding flatlock seams for all-day breathability.',
    details: [
      '95% combed organic cotton, 5% elastane for shape retention',
      'Soft-brushed plush elastic waistband that does not dig in',
      'Reinforced double-layered pouch with supportive fit',
      'Naturally antibacterial and moisture-wicking',
    ],
    materials: '95% Organic Cotton, 5% Elastane',
    care: 'Machine wash warm (40°C) with like colors. Tumble dry low.',
    rating: 4.9,
    reviewsCount: 38,
    hidden: false,
    source: 'seed',
    createdAt: '2026-08-10',
  },
  {
    id: 'p-1002',
    name: 'Modal Micro-Rib Brief',
    category: 'underwear',
    price: 390,
    colors: ['Black', 'White', 'Navy'],
    sizes: ['S', 'M', 'L'],
    stock: {
      Black: { S: 6, M: 15, L: 8 },
      White: { S: 4, M: 10, L: 0 },
      Navy: { S: 9, M: 12, L: 5 },
    },
    image: '/src/assets/images/product_cotton_boxer_1793796879993.jpg',
    images: ['/src/assets/images/product_cotton_boxer_1793796879993.jpg'],
    description: 'Featherlight Austrian beechwood modal knit with a second-skin feel. Perfect under tailored dress trousers for a smooth, invisible finish without bunching.',
    details: [
      'Silky micro-modal fabric 2× softer than cotton',
      'Low-rise modern cut with athletic leg opening',
      'Tagless heat-transferred care label for zero irritation',
    ],
    materials: '92% Micro-Modal, 8% Spandex',
    care: 'Gentle cycle wash. Air dry recommended to preserve elasticity.',
    rating: 4.8,
    reviewsCount: 22,
    hidden: false,
    source: 'seed',
    createdAt: '2026-08-14',
  },
  {
    id: 'p-2001',
    name: 'Hand-Rolled Silk Bow Tie',
    category: 'bow-ties',
    price: 650,
    colors: ['Burgundy', 'Black', 'Navy'],
    sizes: ['One Size'],
    stock: {
      Burgundy: { 'One Size': 14 },
      Black: { 'One Size': 22 },
      Navy: { 'One Size': 5 },
    },
    image: '/src/assets/images/product_silk_bow_tie_1793796880639.jpg',
    images: [
      '/src/assets/images/product_silk_bow_tie_1793796880639.jpg',
      '/src/assets/images/hero_mens_editorial_1793796879372.jpg',
    ],
    description: 'Woven from 100% pure Mulberry silk with subtle textural jacquard twill. Pre-tied with an adjustable strap sliding smoothly up to neck size 19 inches.',
    details: [
      'Pure Mulberry silk with satin luster',
      'Brass hardware slider with concealed closure hook',
      'Pre-formed crisp butterfly silhouette that holds its form',
      'Arrives in a protective Brutbox matte slide case',
    ],
    materials: '100% Pure Woven Silk',
    care: 'Dry clean only. Steam lightly if needed.',
    rating: 5.0,
    reviewsCount: 19,
    hidden: false,
    source: 'seed',
    createdAt: '2026-08-18',
  },
  {
    id: 'p-3001',
    name: 'Artisan Emerald Pocket Square',
    category: 'pocket-squares',
    price: 550,
    colors: ['Emerald', 'Burgundy', 'Champagne'],
    sizes: ['One Size'],
    stock: {
      Emerald: { 'One Size': 16 },
      Burgundy: { 'One Size': 12 },
      Champagne: { 'One Size': 8 },
    },
    image: '/src/assets/images/product_silk_bow_tie_1793796880639.jpg',
    images: ['/src/assets/images/product_silk_bow_tie_1793796880639.jpg'],
    description: 'Generous 33 × 33 cm silk square with hand-rolled shoemaker edges. Drapes naturally into puff, crown, or presidential fold without sliding into your jacket pocket.',
    details: [
      '33 cm × 33 cm (13" × 13") classic proportion',
      'Delicate hand-rolled and hand-stitched contrast border',
      'Subtle matte sheen that catches evening light beautifully',
    ],
    materials: '100% Silk Twill',
    care: 'Dry clean only. Press with low iron over a press cloth.',
    rating: 4.9,
    reviewsCount: 15,
    hidden: false,
    source: 'seed',
    createdAt: '2026-08-20',
  },
  {
    id: 'p-4001',
    name: 'Fine Merino Wool Crew Socks',
    category: 'socks',
    price: 240,
    colors: ['Navy', 'Grey', 'Black'],
    sizes: ['40–43', '44–46'],
    stock: {
      Navy: { '40–43': 28, '44–46': 12 },
      Grey: { '40–43': 32, '44–46': 18 },
      Black: { '40–43': 40, '44–46': 22 },
    },
    image: '/src/assets/images/product_merino_socks_1793796881862.jpg',
    images: [
      '/src/assets/images/product_merino_socks_1793796881862.jpg',
      '/src/assets/images/hero_mens_editorial_1793796879372.jpg',
    ],
    description: 'Thermo-regulating Australian merino blend knitted on 200-needle Italian cylinders. Hand-linked seamless toe closure prevents chafing in oxfords and boots.',
    details: [
      '68% Australian Merino Wool, 30% Polyamide, 2% Lycra',
      'Seamless hand-linked toe box (zero pressure ridge)',
      'Double-cuff rib that stays up all day without calf marks',
      'Reinforced heel and toe padding for extended longevity',
    ],
    materials: '68% Merino Wool, 30% Polyamide, 2% Lycra',
    care: 'Machine wash cool (30°C) inside out. Lay flat to dry.',
    rating: 4.9,
    reviewsCount: 46,
    hidden: false,
    source: 'seed',
    createdAt: '2026-08-22',
  },
  {
    id: 'p-5001',
    name: 'Hard-Shell Matte Eyeglass Case',
    category: 'eyeglass-cases',
    price: 350,
    colors: ['Black', 'Navy'],
    sizes: ['Standard'],
    stock: {
      Black: { Standard: 20 },
      Navy: { Standard: 11 },
    },
    image: '/src/assets/images/product_merino_socks_1793796881862.jpg',
    images: ['/src/assets/images/product_merino_socks_1793796881862.jpg'],
    description: 'Crush-resistant steel core case covered in tactile matte-rubberized polymer. Soft velvet interior lining shields sunglasses and prescription frames from scratches.',
    details: [
      'Rigid steel internal chassis tested to withstand 25 kg pressure',
      'Gentle velvet flocking prevents micro-scratches on lenses',
      'Magnetic snaps shut securely inside briefcase or backpack',
      'Includes microfiber lens cleaning cloth',
    ],
    materials: 'Steel Chassis, Matte Polymer Coating, Velvet Interior',
    care: 'Wipe clean with a damp microfiber cloth.',
    rating: 4.7,
    reviewsCount: 18,
    hidden: false,
    source: 'seed',
    createdAt: '2026-08-25',
  },
  {
    id: 'p-6001',
    name: 'Full-Grain Leather Bifold Wallet',
    category: 'wallets',
    price: 1250,
    colors: ['Brown', 'Black', 'Tan'],
    sizes: ['Standard'],
    stock: {
      Brown: { Standard: 9 },
      Black: { Standard: 14 },
      Tan: { Standard: 4 }, // low stock
    },
    image: '/src/assets/images/product_leather_wallet_1793796881877.jpg',
    images: [
      '/src/assets/images/product_leather_wallet_1793796881877.jpg',
      '/src/assets/images/hero_mens_editorial_1793796879372.jpg',
    ],
    description: 'Vegetable-tanned full-grain cowhide that develops a rich, individual patina with wear. Features 6 card slots, 2 hidden receipt pockets, and a full-length banknote compartment.',
    details: [
      '100% full-grain vegetable-tanned leather',
      'RFID-blocking copper-alloy protective lining',
      'Slim 10 mm profile when folded',
      'Burnished wax edges for smooth pocket entry',
    ],
    materials: '100% Full-Grain Vegetable Tanned Leather',
    care: 'Condition once every 6 months with natural beeswax balm.',
    rating: 5.0,
    reviewsCount: 31,
    hidden: false,
    source: 'seed',
    createdAt: '2026-08-28',
  },
];

// Seed sample orders for realistic sales charts & tracking
export function generateSeedOrders(): Order[] {
  const sampleNames = ['Mahir Hamidy', 'Tanvir Ahmed', 'Farhan Kabir', 'Sakib Rahman', 'Nafis Chowdhury', 'Rafiul Islam'];
  const methods: PaymentMethod[] = ['COD', 'bKash', 'Nagad', 'CARD'];
  const orders: Order[] = [];
  const now = Date.now();
  const DAY = 86400000;

  // 14 days of realistic order activity
  for (let i = 13; i >= 0; i--) {
    const ordersCount = Math.floor(Math.random() * 4) + 2; // 2 to 5 orders per day
    for (let j = 0; j < ordersCount; j++) {
      const orderTime = new Date(now - i * DAY - Math.random() * DAY * 0.8).toISOString();
      const customer = sampleNames[(i + j) % sampleNames.length];
      const method = methods[(i + j) % methods.length];
      const p1 = INITIAL_PRODUCTS[0];
      const p2 = INITIAL_PRODUCTS[Math.floor(Math.random() * INITIAL_PRODUCTS.length)];
      
      const items = [
        {
          productId: p1.id,
          name: p1.name,
          size: 'M',
          color: 'Black',
          qty: 2,
          price: p1.price,
          image: p1.image,
        },
      ];
      if (p2.id !== p1.id) {
        items.push({
          productId: p2.id,
          name: p2.name,
          size: p2.sizes[0],
          color: p2.colors[0],
          qty: 1,
          price: p2.price,
          image: p2.image,
        });
      }

      const subtotal = items.reduce((sum, item) => sum + item.price * item.qty, 0);
      const deliveryFee = subtotal >= FREE_DELIVERY_THRESHOLD ? 0 : STANDARD_DELIVERY_FEE;
      const total = subtotal + deliveryFee;
      const isRecent = i <= 2;
      const status: OrderStatus = isRecent ? (i === 0 ? 'Ordered' : 'In Transit') : 'Delivered';

      orders.push({
        id: `BB-${(1000 + i * 10 + j).toString()}`,
        createdAt: orderTime,
        customer,
        phone: `017${Math.floor(10000000 + Math.random() * 90000000)}`,
        address: 'House 42, Road 11, Banani, Dhaka 1213',
        paymentMethod: method,
        items,
        subtotal,
        deliveryFee,
        total,
        status,
        carrierName: 'Pathao Express Courier',
        trackingNumber: `PE-DH-${8800 + i * 10 + j}`,
        estimatedDelivery: new Date(Date.now() + 2 * DAY).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' }),
        milestones: [
          { step: 'Ordered', label: 'Order Confirmed', timestamp: orderTime, note: 'Order details verified & queued', completed: true },
          { step: 'Packed', label: 'Package Assembled', timestamp: new Date(Date.parse(orderTime) + 3600000).toISOString(), note: 'Inspected and packed at Dhaka Fulfillment Hub', completed: status !== 'Ordered' },
          { step: 'In Transit', label: 'Dispatched to Courier', timestamp: new Date(Date.parse(orderTime) + 7200000).toISOString(), note: 'With rider on route to delivery area', completed: status === 'In Transit' || status === 'Delivered' },
          { step: 'Delivered', label: 'Delivered & Signed', timestamp: new Date(Date.parse(orderTime) + 14400000).toISOString(), note: 'Package handed over to recipient', completed: status === 'Delivered' },
        ],
        isDemo: true,
      });
    }
  }

  return orders;
}

// Storage helpers
export function getStoredProducts(): Product[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.products);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.products, JSON.stringify(INITIAL_PRODUCTS));
      return INITIAL_PRODUCTS;
    }
    return JSON.parse(raw);
  } catch {
    return INITIAL_PRODUCTS;
  }
}

export function saveStoredProducts(products: Product[]): boolean {
  try {
    localStorage.setItem(STORAGE_KEYS.products, JSON.stringify(products));
    return true;
  } catch {
    return false;
  }
}

export function getStoredCart(): CartItem[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.cart);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveStoredCart(cart: CartItem[]): void {
  try {
    localStorage.setItem(STORAGE_KEYS.cart, JSON.stringify(cart));
  } catch {
    // ignore
  }
}

export function getStoredWishlist(): string[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.wishlist);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveStoredWishlist(wishlist: string[]): void {
  try {
    localStorage.setItem(STORAGE_KEYS.wishlist, JSON.stringify(wishlist));
  } catch {
    // ignore
  }
}

export function getStoredRecent(): string[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.recent);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function addStoredRecent(productId: string): void {
  try {
    const existing = getStoredRecent().filter(id => id !== productId);
    existing.unshift(productId);
    localStorage.setItem(STORAGE_KEYS.recent, JSON.stringify(existing.slice(0, 8)));
  } catch {
    // ignore
  }
}

export function getStoredOrders(): Order[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.orders);
    if (!raw) {
      const seeded = generateSeedOrders();
      localStorage.setItem(STORAGE_KEYS.orders, JSON.stringify(seeded));
      return seeded;
    }
    return JSON.parse(raw);
  } catch {
    return generateSeedOrders();
  }
}

export function saveStoredOrders(orders: Order[]): void {
  try {
    localStorage.setItem(STORAGE_KEYS.orders, JSON.stringify(orders));
  } catch {
    // ignore
  }
}

export function getStoredActivity(): ActivityLogItem[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.activity);
    if (!raw) {
      const initial: ActivityLogItem[] = [
        { id: '1', type: 'login', message: 'Admin authenticated to control center', at: new Date().toISOString() },
        { id: '2', type: 'restock', message: 'Seeded initial inventory across 6 categories (12 SKUs)', at: new Date().toISOString() },
      ];
      localStorage.setItem(STORAGE_KEYS.activity, JSON.stringify(initial));
      return initial;
    }
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

export function logActivity(type: ActivityLogItem['type'], message: string): void {
  try {
    const log = getStoredActivity();
    log.unshift({ id: Date.now().toString(), type, message, at: new Date().toISOString() });
    localStorage.setItem(STORAGE_KEYS.activity, JSON.stringify(log.slice(0, 100)));
  } catch {
    // ignore
  }
}

export function getAdminSessions(): AdminSession[] {
  try {
    const now = Date.now();
    const raw = localStorage.getItem(STORAGE_KEYS.sessions);
    const list: AdminSession[] = raw ? JSON.parse(raw) : [];
    const valid = list.filter(s => now - s.lastSeen < SESSION_TTL_MS);
    localStorage.setItem(STORAGE_KEYS.sessions, JSON.stringify(valid));
    return valid;
  } catch {
    return [];
  }
}

export function heartbeatAdmin(token: string): boolean {
  try {
    const sessions = getAdminSessions();
    const match = sessions.find(s => s.token === token);
    if (!match) return false;
    match.lastSeen = Date.now();
    localStorage.setItem(STORAGE_KEYS.sessions, JSON.stringify(sessions));
    return true;
  } catch {
    return false;
  }
}

export function logoutAdmin(token: string): void {
  try {
    const sessions = getAdminSessions().filter(s => s.token !== token);
    localStorage.setItem(STORAGE_KEYS.sessions, JSON.stringify(sessions));
    sessionStorage.removeItem('bb_admin_token');
  } catch {
    // ignore
  }
}

// Total stock across variants
export function calculateTotalStock(stock: Product['stock']): number {
  let count = 0;
  for (const color of Object.keys(stock || {})) {
    for (const size of Object.keys(stock[color] || {})) {
      count += Number(stock[color][size]) || 0;
    }
  }
  return count;
}

// Format BDT Currency
export function formatBDT(amount: number): string {
  return `৳${Math.round(amount).toLocaleString('en-US')}`;
}

// Spike Detection Analytics
export function detectSpikes(orders: Order[]): { hasSpike: boolean; message: string; rolling24h: number; dailyAvg: number } {
  const now = Date.now();
  const DAY = 86400000;
  
  const last24hRevenue = orders
    .filter(o => now - Date.parse(o.createdAt) <= DAY)
    .reduce((sum, o) => sum + o.total, 0);

  const prior7DaysRevenue = orders
    .filter(o => {
      const diff = now - Date.parse(o.createdAt);
      return diff > DAY && diff <= 8 * DAY;
    })
    .reduce((sum, o) => sum + o.total, 0);

  const dailyAvg = prior7DaysRevenue / 7;

  if (last24hRevenue >= 3000 && last24hRevenue >= dailyAvg * 1.8) {
    const multiplier = dailyAvg > 0 ? (last24hRevenue / dailyAvg).toFixed(1) : '2+';
    return {
      hasSpike: true,
      message: `Surge Alert: Sales in the last 24h (${formatBDT(last24hRevenue)}) are ${multiplier}× higher than the 7-day average (${formatBDT(dailyAvg)}).`,
      rolling24h: last24hRevenue,
      dailyAvg,
    };
  }

  return {
    hasSpike: false,
    message: `Normal sales pace: 24h revenue is ${formatBDT(last24hRevenue)} vs 7-day average of ${formatBDT(dailyAvg)}.`,
    rolling24h: last24hRevenue,
    dailyAvg,
  };
}

// Download CSV utility
export function exportToCSV(filename: string, rows: (string | number)[][]): void {
  const processCell = (val: string | number) => {
    const s = String(val ?? '');
    return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
  };
  const csvContent = rows.map(r => r.map(processCell).join(',')).join('\n');
  const blob = new Blob(['\ufeff' + csvContent], { type: 'text/csv;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
