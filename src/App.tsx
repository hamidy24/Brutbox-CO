import React, { useState, useEffect, useMemo } from 'react';
import { 
  getStoredProducts, saveStoredProducts, 
  getStoredCart, saveStoredCart, 
  getStoredWishlist, saveStoredWishlist, 
  getStoredOrders, saveStoredOrders, 
  addStoredRecent, getStoredRecent,
  CATEGORIES 
} from './data/store';
import { Product, CartItem, Order, CategorySlug, OrderStatus } from './types';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { ProductCard } from './components/ProductCard';
import { ProductDetailModal } from './components/ProductDetailModal';
import { SizeCalculatorModal } from './components/SizeCalculatorModal';
import { CartDrawer } from './components/CartDrawer';
import { CheckoutModal } from './components/CheckoutModal';
import { ReceiptModal } from './components/ReceiptModal';
import { OrderTrackerModal } from './components/OrderTrackerModal';
import { BeginnerGuideModal } from './components/BeginnerGuideModal';
import { WishlistDrawer } from './components/WishlistDrawer';
import { LiveSearchModal } from './components/LiveSearchModal';
import { AdminPortal } from './components/AdminPortal';
import { Footer } from './components/Footer';
import { Filter, Search, Sparkles } from 'lucide-react';

export default function App() {
  // State management
  const [products, setProducts] = useState<Product[]>(getStoredProducts);
  const [cart, setCart] = useState<CartItem[]>(getStoredCart);
  const [wishlist, setWishlist] = useState<string[]>(getStoredWishlist);
  const [recentIds, setRecentIds] = useState<string[]>(getStoredRecent);
  const [orders, setOrders] = useState<Order[]>(getStoredOrders);

  // Active filters and views
  const [selectedCategory, setSelectedCategory] = useState<CategorySlug | 'all'>('all');
  const [catalogSearch, setCatalogSearch] = useState('');

  // Modals & Drawers state
  const [activeProduct, setActiveProduct] = useState<Product | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isReceiptOpen, setIsReceiptOpen] = useState(false);
  const [currentReceiptOrder, setCurrentReceiptOrder] = useState<Order | null>(null);
  const [isTrackerOpen, setIsTrackerOpen] = useState(false);
  const [trackerOrderId, setTrackerOrderId] = useState<string>('');
  const [isSizeGuideOpen, setIsSizeGuideOpen] = useState(false);
  const [sizeGuideCategory, setSizeGuideCategory] = useState<string>('underwear');
  const [isGuideOpen, setIsGuideOpen] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [adminTab, setAdminTab] = useState<'dashboard' | 'products' | 'inventory' | 'upload' | 'reports' | 'activity'>('dashboard');

  const handleOpenAdmin = (tab?: 'dashboard' | 'products' | 'inventory' | 'upload' | 'reports' | 'activity') => {
    if (tab) setAdminTab(tab);
    setIsAdminOpen(true);
  };

  // Keyboard shortcut for search (⌘K or Ctrl+K)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchOpen(true);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Save changes to storage
  const handleUpdateProducts = (newProducts: Product[]) => {
    setProducts(newProducts);
    saveStoredProducts(newProducts);
  };

  const handleUpdateOrders = (newOrders: Order[]) => {
    setOrders(newOrders);
    saveStoredOrders(newOrders);
  };

  // Cart operations
  const handleAddToCart = (product: Product, color: string, size: string, qty: number) => {
    const lineId = `${product.id}-${color}-${size}`;
    const existingIndex = cart.findIndex(item => item.id === lineId);
    let updatedCart: CartItem[];

    if (existingIndex > -1) {
      updatedCart = [...cart];
      updatedCart[existingIndex].qty += qty;
    } else {
      updatedCart = [
        ...cart,
        {
          id: lineId,
          productId: product.id,
          name: product.name,
          category: product.category,
          color,
          size,
          price: product.price,
          qty,
          image: product.image,
        },
      ];
    }

    setCart(updatedCart);
    saveStoredCart(updatedCart);
    setIsCartOpen(true);
  };

  const handleQuickAdd = (product: Product) => {
    const defaultColor = product.colors[0] || 'Black';
    const defaultSize = product.sizes[0] || 'M';
    handleAddToCart(product, defaultColor, defaultSize, 1);
  };

  const handleUpdateCartQty = (itemIndex: number, newQty: number) => {
    if (newQty <= 0) {
      handleRemoveCartItem(itemIndex);
      return;
    }
    const updated = [...cart];
    updated[itemIndex].qty = newQty;
    setCart(updated);
    saveStoredCart(updated);
  };

  const handleRemoveCartItem = (itemIndex: number) => {
    const updated = cart.filter((_, i) => i !== itemIndex);
    setCart(updated);
    saveStoredCart(updated);
  };

  // Wishlist toggle
  const handleToggleWishlist = (productId: string) => {
    let updated: string[];
    if (wishlist.includes(productId)) {
      updated = wishlist.filter(id => id !== productId);
    } else {
      updated = [...wishlist, productId];
    }
    setWishlist(updated);
    saveStoredWishlist(updated);
  };

  // Select product for detail modal
  const handleSelectProduct = (product: Product) => {
    setActiveProduct(product);
    setIsDetailOpen(true);
    addStoredRecent(product.id);
    setRecentIds(getStoredRecent());
  };

  // Open size guide with custom category
  const handleOpenSizeGuide = (category?: string) => {
    if (category) setSizeGuideCategory(category);
    setIsSizeGuideOpen(true);
  };

  // Order created handler
  const handleOrderCreated = (order: Order) => {
    const updatedOrders = [order, ...orders];
    setOrders(updatedOrders);
    saveStoredOrders(updatedOrders);
    setCart([]);
    saveStoredCart([]);
    setIsCheckoutOpen(false);
    setCurrentReceiptOrder(order);
    setIsReceiptOpen(true);
  };

  // Update live tracking status
  const handleUpdateOrderStatus = (orderId: string, newStatus: OrderStatus) => {
    const updated = orders.map(o => {
      if (o.id !== orderId) return o;
      return {
        ...o,
        status: newStatus,
        milestones: o.milestones.map((m, idx) => ({
          ...m,
          completed: idx <= ['Ordered', 'Packed', 'In Transit', 'Delivered'].indexOf(newStatus),
        })),
      };
    });
    setOrders(updated);
    saveStoredOrders(updated);
  };

  // Filtered products on storefront
  const visibleProducts = useMemo(() => {
    return products.filter(p => {
      if (p.hidden) return false;
      if (selectedCategory !== 'all' && p.category !== selectedCategory) return false;
      if (catalogSearch.trim()) {
        const q = catalogSearch.toLowerCase();
        return (
          p.name.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q) ||
          p.materials.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [products, selectedCategory, catalogSearch]);

  const totalCartCount = cart.reduce((sum, item) => sum + item.qty, 0);

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF9F5] text-[#182536]">
      
      {/* 1. Header (Follows Top Bar Contract) */}
      <Header
        cartCount={totalCartCount}
        wishlistCount={wishlist.length}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenWishlist={() => setIsWishlistOpen(true)}
        onOpenSearch={() => setIsSearchOpen(true)}
        onOpenAdmin={handleOpenAdmin}
        onOpenTracker={() => {
          setTrackerOrderId(orders[0]?.id || '');
          setIsTrackerOpen(true);
        }}
        onOpenGuide={() => setIsGuideOpen(true)}
        activeCategory={selectedCategory}
        onSelectCategory={setSelectedCategory}
      />

      {/* 2. Hero Section */}
      <Hero
        onExplore={() => {
          const el = document.getElementById('catalog-section');
          el?.scrollIntoView({ behavior: 'smooth' });
        }}
        onOpenSizeGuide={() => handleOpenSizeGuide('underwear')}
        onOpenGuide={() => setIsGuideOpen(true)}
        onSelectCategory={cat => {
          setSelectedCategory(cat);
          const el = document.getElementById('catalog-section');
          el?.scrollIntoView({ behavior: 'smooth' });
        }}
      />

      {/* 3. Main Catalog Section */}
      <main id="catalog-section" className="flex-1 max-w-[1240px] w-full mx-auto px-4 sm:px-6 py-12">
        
        {/* Catalog Control Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-[#E4E5E4] mb-8">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#9A6A2E]">
              <span>Curated Selection</span>
              <span aria-hidden="true">·</span>
              <span>{visibleProducts.length} Items Displayed</span>
            </div>
            <h2 className="text-3xl font-extrabold font-display text-[#182536] mt-1">
              {selectedCategory === 'all'
                ? 'All Everyday Essentials'
                : CATEGORIES.find(c => c.slug === selectedCategory)?.name || 'Collection'}
            </h2>
          </div>

          {/* Filter Pills & Instant Quick-Search */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-1.5 p-1 bg-[#F4F1EC] rounded-xl overflow-x-auto max-w-full">
              <button
                onClick={() => setSelectedCategory('all')}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition-all ${
                  selectedCategory === 'all'
                    ? 'bg-white text-[#182536] shadow-xs'
                    : 'text-[#667280] hover:text-[#182536]'
                }`}
              >
                All
              </button>
              {CATEGORIES.map(c => (
                <button
                  key={c.slug}
                  onClick={() => setSelectedCategory(c.slug)}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap cursor-pointer transition-all ${
                    selectedCategory === c.slug
                      ? 'bg-white text-[#182536] shadow-xs'
                      : 'text-[#667280] hover:text-[#182536]'
                  }`}
                >
                  {c.name}
                </button>
              ))}
            </div>

            {/* Quick search input */}
            <div className="relative">
              <input
                type="text"
                value={catalogSearch}
                onChange={e => setCatalogSearch(e.target.value)}
                placeholder="Filter grid..."
                className="w-36 sm:w-44 pl-8 pr-3 py-1.5 rounded-lg border border-[#CCD2D5] bg-white text-xs font-medium focus:border-[#C89C68] focus:outline-hidden"
              />
              <Search className="w-3.5 h-3.5 text-gray-400 absolute left-2.5 top-2.5" />
            </div>
          </div>
        </div>

        {/* Product Grid */}
        {visibleProducts.length === 0 ? (
          <div className="p-16 rounded-2xl bg-white border border-[#E4E5E4] text-center space-y-3">
            <div className="w-16 h-16 rounded-full bg-[#FAF9F5] border border-[#E4E5E4] flex items-center justify-center mx-auto text-[#182536]">
              <Filter className="w-6 h-6 text-[#A97B4A]" />
            </div>
            <h3 className="text-lg font-bold font-display text-[#182536]">
              No essentials match your filter
            </h3>
            <p className="text-xs text-[#667280] max-w-md mx-auto">
              Try choosing another category or clearing the search box.
            </p>
            <button
              onClick={() => {
                setSelectedCategory('all');
                setCatalogSearch('');
              }}
              className="px-4 py-2 rounded-lg bg-[#182536] text-white text-xs font-bold hover:bg-[#273C51] cursor-pointer mt-2"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 sm:gap-7">
            {visibleProducts.map(product => (
              <ProductCard
                key={product.id}
                product={product}
                isWishlisted={wishlist.includes(product.id)}
                onToggleWishlist={handleToggleWishlist}
                onQuickAdd={handleQuickAdd}
                onSelectProduct={handleSelectProduct}
              />
            ))}
          </div>
        )}

      </main>

      {/* 4. Footer */}
      <Footer
        onSelectCategory={setSelectedCategory}
        onOpenSizeGuide={() => handleOpenSizeGuide('underwear')}
        onOpenTracker={() => {
          setTrackerOrderId(orders[0]?.id || '');
          setIsTrackerOpen(true);
        }}
        onOpenGuide={() => setIsGuideOpen(true)}
        onOpenAdmin={handleOpenAdmin}
        onOpenCheckout={() => setIsCheckoutOpen(true)}
        onOpenReceipt={() => {
          setCurrentReceiptOrder(orders[0] || null);
          setIsReceiptOpen(true);
        }}
      />

      {/* ================= MODALS & DRAWERS ================= */}

      {/* Product Detail Modal */}
      <ProductDetailModal
        product={activeProduct}
        isOpen={isDetailOpen}
        onClose={() => setIsDetailOpen(false)}
        onAddToCart={handleAddToCart}
        isWishlisted={activeProduct ? wishlist.includes(activeProduct.id) : false}
        onToggleWishlist={handleToggleWishlist}
        onOpenSizeGuide={handleOpenSizeGuide}
      />

      {/* Interactive Size Advisor Modal */}
      <SizeCalculatorModal
        isOpen={isSizeGuideOpen}
        onClose={() => setIsSizeGuideOpen(false)}
        initialCategory={sizeGuideCategory}
        onApplySize={size => {
          // If product detail is open, we can close the advisor
          setIsSizeGuideOpen(false);
        }}
      />

      {/* Slide-out Cart Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cart={cart}
        onUpdateQty={handleUpdateCartQty}
        onRemoveItem={handleRemoveCartItem}
        onProceedCheckout={() => setIsCheckoutOpen(true)}
        onStartShopping={() => {
          const el = document.getElementById('catalog-section');
          el?.scrollIntoView({ behavior: 'smooth' });
        }}
      />

      {/* Wishlist Drawer */}
      <WishlistDrawer
        isOpen={isWishlistOpen}
        onClose={() => setIsWishlistOpen(false)}
        wishlistProductIds={wishlist}
        allProducts={products}
        recentProductIds={recentIds}
        onRemoveWishlist={handleToggleWishlist}
        onSelectProduct={handleSelectProduct}
      />

      {/* Live Search & Filter Modal */}
      <LiveSearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        products={products}
        onSelectProduct={handleSelectProduct}
      />

      {/* Multi-step Checkout Modal */}
      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        cart={cart}
        onOrderCreated={handleOrderCreated}
      />

      {/* Printable 80mm POS Receipt Modal */}
      <ReceiptModal
        order={currentReceiptOrder}
        isOpen={isReceiptOpen}
        onClose={() => setIsReceiptOpen(false)}
        onTrackOrder={orderId => {
          setTrackerOrderId(orderId);
          setIsTrackerOpen(true);
        }}
        onContinueShopping={() => {
          const el = document.getElementById('catalog-section');
          el?.scrollIntoView({ behavior: 'smooth' });
        }}
      />

      {/* Live Order Tracker Modal */}
      <OrderTrackerModal
        isOpen={isTrackerOpen}
        onClose={() => setIsTrackerOpen(false)}
        orders={orders}
        initialOrderId={trackerOrderId}
        onUpdateOrderStatus={handleUpdateOrderStatus}
      />

      {/* Evaluation & Beginner Guide Modal */}
      <BeginnerGuideModal
        isOpen={isGuideOpen}
        onClose={() => setIsGuideOpen(false)}
        onOpenSizeGuide={() => handleOpenSizeGuide('underwear')}
        onOpenAdmin={() => handleOpenAdmin('dashboard')}
        onOpenTracker={() => {
          setTrackerOrderId(orders[0]?.id || '');
          setIsTrackerOpen(true);
        }}
      />

      {/* Admin Control Center Portal */}
      <AdminPortal
        isOpen={isAdminOpen}
        onClose={() => setIsAdminOpen(false)}
        products={products}
        orders={orders}
        onUpdateProducts={handleUpdateProducts}
        onUpdateOrders={handleUpdateOrders}
        initialTab={adminTab}
      />

      {/* Quick Access Bar for Academic Evaluation & Previews */}
      <div className="fixed bottom-4 left-4 z-30 hidden sm:flex items-center gap-2.5 bg-[#182536] text-white px-3.5 py-2 rounded-full shadow-lg border border-white/20 text-xs backdrop-blur-md">
        <span className="w-2 h-2 rounded-full bg-[#A9D3BF] animate-pulse" />
        <span className="text-[#C89C68] font-bold">Admin Previews:</span>
        <button
          onClick={() => handleOpenAdmin('dashboard')}
          className="hover:text-[#C89C68] transition-colors font-medium cursor-pointer"
        >
          Dashboard (admin.html)
        </button>
        <span className="text-[#667280]">·</span>
        <button
          onClick={() => handleOpenAdmin('inventory')}
          className="hover:text-[#C89C68] transition-colors font-medium cursor-pointer"
        >
          Variant Inventory (inventory.html)
        </button>
      </div>

    </div>
  );
}
