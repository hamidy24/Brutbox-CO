import React, { useState, useRef, useEffect } from 'react';
import { Search, ShoppingBag, Heart, Shield, HelpCircle, Package, Menu, X, ChevronDown, LayoutDashboard, PlusCircle, PackageSearch, BarChart3, History, Layers } from 'lucide-react';
import { CategorySlug } from '../types';

interface HeaderProps {
  cartCount: number;
  wishlistCount: number;
  onOpenCart: () => void;
  onOpenWishlist: () => void;
  onOpenSearch: () => void;
  onOpenAdmin: (tab?: 'dashboard' | 'products' | 'inventory' | 'upload' | 'reports' | 'activity') => void;
  onOpenTracker: () => void;
  onOpenGuide: () => void;
  activeCategory: CategorySlug | 'all';
  onSelectCategory: (category: CategorySlug | 'all') => void;
}

export const Header: React.FC<HeaderProps> = ({
  cartCount,
  wishlistCount,
  onOpenCart,
  onOpenWishlist,
  onOpenSearch,
  onOpenAdmin,
  onOpenTracker,
  onOpenGuide,
  activeCategory,
  onSelectCategory,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [adminMenuOpen, setAdminMenuOpen] = useState(false);
  const adminMenuRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (adminMenuRef.current && !adminMenuRef.current.contains(e.target as Node)) {
        setAdminMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  return (
    <>
      {/* Top Banner with Beginner Friendly Trust Markers */}
      <div className="bg-[#182536] text-[#ECE2D4] text-[11px] font-medium tracking-wider py-1.5 px-4 text-center border-b border-white/10 flex items-center justify-between">
        <div className="hidden sm:block text-[#A97B4A] font-semibold tracking-widest text-[10px]">
          BRUTBOX & CO. · EST. 2026
        </div>
        <div className="mx-auto flex items-center gap-4">
          <span>THE MEN'S ESSENTIALS EDIT</span>
          <span className="hidden md:inline text-white/30">|</span>
          <span className="hidden md:inline">FREE EXPRESS DELIVERY OVER ৳3,000</span>
          <span className="hidden md:inline text-white/30">|</span>
          <button
            onClick={onOpenGuide}
            className="inline-flex items-center gap-1 text-[#EAD0AC] hover:text-white underline underline-offset-2 transition-colors cursor-pointer"
          >
            <HelpCircle className="w-3 h-3" />
            <span>Beginner Guide</span>
          </button>
        </div>
        <div className="hidden sm:flex items-center gap-3">
          <button
            onClick={() => onOpenAdmin('dashboard')}
            className="hover:text-white transition-colors cursor-pointer text-[#C89C68] font-medium flex items-center gap-1"
          >
            <Shield className="w-3 h-3" />
            <span>Admin Preview</span>
          </button>
          <span className="text-white/30">|</span>
          <button
            onClick={onOpenTracker}
            className="hover:text-white transition-colors cursor-pointer text-[#D0D8E0] font-medium"
          >
            Track Order
          </button>
        </div>
      </div>

      {/* Main Top Navigation conforming strictly to Top Bar Contract */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-[#E4E5E4] transition-shadow">
        <div className="max-w-[1240px] mx-auto px-4 sm:px-6 h-18 flex items-center justify-between gap-8">
          
          {/* Zone 1: Single element wordmark */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => {
                onSelectCategory('all');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="text-xl sm:text-2xl font-bold tracking-tight text-[#182536] font-display whitespace-nowrap shrink-0 text-left cursor-pointer group"
            >
              BRUTBOX <span className="text-[#A97B4A] transition-colors group-hover:text-[#C89C68]">&amp; CO.</span>
            </button>
          </div>

          {/* Zone 2: 4–5 single-line clean text navigation links */}
          <nav className="hidden lg:flex items-center gap-7 text-[13px] font-semibold text-[#5D6974]">
            <button
              onClick={() => onSelectCategory('all')}
              className={`hover:text-[#182536] transition-colors whitespace-nowrap shrink-0 py-2 border-b-2 cursor-pointer ${
                activeCategory === 'all' ? 'border-[#C89C68] text-[#182536]' : 'border-transparent'
              }`}
            >
              All Essentials
            </button>
            <button
              onClick={() => onSelectCategory('underwear')}
              className={`hover:text-[#182536] transition-colors whitespace-nowrap shrink-0 py-2 border-b-2 cursor-pointer ${
                activeCategory === 'underwear' ? 'border-[#C89C68] text-[#182536]' : 'border-transparent'
              }`}
            >
              Underwear
            </button>
            <button
              onClick={() => onSelectCategory('bow-ties')}
              className={`hover:text-[#182536] transition-colors whitespace-nowrap shrink-0 py-2 border-b-2 cursor-pointer ${
                activeCategory === 'bow-ties' ? 'border-[#C89C68] text-[#182536]' : 'border-transparent'
              }`}
            >
              Bow Ties
            </button>
            <button
              onClick={() => onSelectCategory('socks')}
              className={`hover:text-[#182536] transition-colors whitespace-nowrap shrink-0 py-2 border-b-2 cursor-pointer ${
                activeCategory === 'socks' ? 'border-[#C89C68] text-[#182536]' : 'border-transparent'
              }`}
            >
              Socks
            </button>
            <button
              onClick={() => onSelectCategory('wallets')}
              className={`hover:text-[#182536] transition-colors whitespace-nowrap shrink-0 py-2 border-b-2 cursor-pointer ${
                activeCategory === 'wallets' ? 'border-[#C89C68] text-[#182536]' : 'border-transparent'
              }`}
            >
              Wallets
            </button>
          </nav>

          {/* Zone 3: 1 primary action area with functional affordances */}
          <div className="flex items-center gap-2 sm:gap-3.5 shrink-0">
            {/* Live Search Trigger */}
            <button
              onClick={onOpenSearch}
              aria-label="Search catalog"
              className="p-2 text-[#182536] hover:text-[#C89C68] rounded-full hover:bg-[#F4F1EC] transition-colors cursor-pointer"
              title="Search products (⌘K / Ctrl+K)"
            >
              <Search className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>

            {/* Wishlist Trigger */}
            <button
              onClick={onOpenWishlist}
              aria-label="View wishlist"
              className="relative p-2 text-[#182536] hover:text-[#C89C68] rounded-full hover:bg-[#F4F1EC] transition-colors cursor-pointer"
              title="Saved items"
            >
              <Heart className="w-4 h-4 sm:w-5 sm:h-5" />
              {wishlistCount > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-[#182536] text-white text-[10px] font-bold flex items-center justify-center font-mono">
                  {wishlistCount}
                </span>
              )}
            </button>

            {/* Admin Menu Dropdown (Reproducing admin-menu from original index.html) */}
            <div className="relative" ref={adminMenuRef}>
              <button
                onClick={() => setAdminMenuOpen(!adminMenuOpen)}
                aria-label="Admin tools"
                aria-expanded={adminMenuOpen}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#CCD2D5] bg-[#FAF9F5] hover:border-[#C89C68] hover:bg-white text-[#182536] text-xs font-bold transition-all cursor-pointer shadow-xs"
                title="Admin Control Center &amp; Inventory Preview"
              >
                <Shield className="w-4 h-4 text-[#9A6A2E]" />
                <span className="hidden sm:inline">Admin Preview</span>
                <ChevronDown className="w-3.5 h-3.5 text-[#667280]" />
              </button>

              {/* Dropdown panel matching original admin-menu-panel */}
              {adminMenuOpen && (
                <div className="absolute right-0 top-full mt-2 w-64 bg-white border border-[#E4E5E4] rounded-xl shadow-xl py-2 z-50 animate-in fade-in zoom-in-95 duration-150">
                  <div className="px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-[#9A6A2E]">
                    Admin Control Center (Demo)
                  </div>
                  
                  <button
                    onClick={() => {
                      setAdminMenuOpen(false);
                      onOpenAdmin('dashboard');
                    }}
                    className="w-full text-left px-3.5 py-2 text-xs font-medium text-[#182536] hover:bg-[#FAF9F5] hover:text-[#9A6A2E] flex items-center gap-2.5 cursor-pointer"
                  >
                    <LayoutDashboard className="w-3.5 h-3.5 text-[#182536]" />
                    <span>Dashboard &amp; Overview</span>
                  </button>

                  <button
                    onClick={() => {
                      setAdminMenuOpen(false);
                      onOpenAdmin('products');
                    }}
                    className="w-full text-left px-3.5 py-2 text-xs font-medium text-[#182536] hover:bg-[#FAF9F5] hover:text-[#9A6A2E] flex items-center gap-2.5 cursor-pointer"
                  >
                    <PackageSearch className="w-3.5 h-3.5 text-[#182536]" />
                    <span>Products &amp; Stock Matrix</span>
                  </button>

                  <button
                    onClick={() => {
                      setAdminMenuOpen(false);
                      onOpenAdmin('inventory');
                    }}
                    className="w-full text-left px-3.5 py-2 text-xs font-medium text-[#182536] hover:bg-[#FAF9F5] hover:text-[#9A6A2E] flex items-center gap-2.5 cursor-pointer"
                  >
                    <Layers className="w-3.5 h-3.5 text-[#182536]" />
                    <span>Variant Inventory (inventory.html)</span>
                  </button>

                  <button
                    onClick={() => {
                      setAdminMenuOpen(false);
                      onOpenAdmin('upload');
                    }}
                    className="w-full text-left px-3.5 py-2 text-xs font-medium text-[#182536] hover:bg-[#FAF9F5] hover:text-[#9A6A2E] flex items-center gap-2.5 cursor-pointer"
                  >
                    <PlusCircle className="w-3.5 h-3.5 text-[#182536]" />
                    <span>Upload Product (Canvas Crop)</span>
                  </button>

                  <button
                    onClick={() => {
                      setAdminMenuOpen(false);
                      onOpenAdmin('reports');
                    }}
                    className="w-full text-left px-3.5 py-2 text-xs font-medium text-[#182536] hover:bg-[#FAF9F5] hover:text-[#9A6A2E] flex items-center gap-2.5 cursor-pointer"
                  >
                    <BarChart3 className="w-3.5 h-3.5 text-[#182536]" />
                    <span>Sales Reports &amp; CSV Export</span>
                  </button>

                  <button
                    onClick={() => {
                      setAdminMenuOpen(false);
                      onOpenAdmin('activity');
                    }}
                    className="w-full text-left px-3.5 py-2 text-xs font-medium text-[#182536] hover:bg-[#FAF9F5] hover:text-[#9A6A2E] flex items-center gap-2.5 cursor-pointer"
                  >
                    <History className="w-3.5 h-3.5 text-[#182536]" />
                    <span>Activity Audit Log</span>
                  </button>

                  <div className="border-t border-[#E4E5E4] mt-1 pt-1 px-3 py-1 text-[10px] text-[#667280]">
                    Demo credentials: admin1 / brut1234
                  </div>
                </div>
              )}
            </div>

            {/* Primary Action: Slide-out Bag Pill */}
            <button
              onClick={onOpenCart}
              aria-label={`View shopping bag with ${cartCount} items`}
              className="flex items-center gap-2.5 px-3.5 sm:px-4 py-2 rounded-lg bg-[#182536] text-white hover:bg-[#223349] active:scale-95 transition-all cursor-pointer shadow-sm text-xs sm:text-sm font-semibold"
            >
              <ShoppingBag className="w-4 h-4" />
              <span className="hidden sm:inline">Bag</span>
              <span className="w-5 h-5 rounded-full bg-[#C89C68] text-[#182536] font-bold text-[11px] flex items-center justify-center font-mono tabular-nums">
                {String(cartCount).padStart(2, '0')}
              </span>
            </button>

            {/* Mobile Hamburger toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 lg:hidden text-[#182536] rounded-md hover:bg-[#F4F1EC] cursor-pointer"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile menu dropdown */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-white border-t border-[#E4E5E4] px-4 py-4 space-y-3 shadow-lg">
            <div className="text-[11px] font-bold tracking-wider text-[#A97B4A] uppercase">
              Explore Collections
            </div>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => {
                  onSelectCategory('all');
                  setMobileMenuOpen(false);
                }}
                className={`text-left px-3 py-2 text-sm rounded-md font-medium ${
                  activeCategory === 'all' ? 'bg-[#182536] text-white' : 'hover:bg-[#F4F1EC] text-[#182536]'
                }`}
              >
                All Essentials
              </button>
              <button
                onClick={() => {
                  onSelectCategory('underwear');
                  setMobileMenuOpen(false);
                }}
                className={`text-left px-3 py-2 text-sm rounded-md font-medium ${
                  activeCategory === 'underwear' ? 'bg-[#182536] text-white' : 'hover:bg-[#F4F1EC] text-[#182536]'
                }`}
              >
                Underwear
              </button>
              <button
                onClick={() => {
                  onSelectCategory('bow-ties');
                  setMobileMenuOpen(false);
                }}
                className={`text-left px-3 py-2 text-sm rounded-md font-medium ${
                  activeCategory === 'bow-ties' ? 'bg-[#182536] text-white' : 'hover:bg-[#F4F1EC] text-[#182536]'
                }`}
              >
                Bow Ties
              </button>
              <button
                onClick={() => {
                  onSelectCategory('pocket-squares');
                  setMobileMenuOpen(false);
                }}
                className={`text-left px-3 py-2 text-sm rounded-md font-medium ${
                  activeCategory === 'pocket-squares' ? 'bg-[#182536] text-white' : 'hover:bg-[#F4F1EC] text-[#182536]'
                }`}
              >
                Pocket Squares
              </button>
              <button
                onClick={() => {
                  onSelectCategory('socks');
                  setMobileMenuOpen(false);
                }}
                className={`text-left px-3 py-2 text-sm rounded-md font-medium ${
                  activeCategory === 'socks' ? 'bg-[#182536] text-white' : 'hover:bg-[#F4F1EC] text-[#182536]'
                }`}
              >
                Socks
              </button>
              <button
                onClick={() => {
                  onSelectCategory('eyeglass-cases');
                  setMobileMenuOpen(false);
                }}
                className={`text-left px-3 py-2 text-sm rounded-md font-medium ${
                  activeCategory === 'eyeglass-cases' ? 'bg-[#182536] text-white' : 'hover:bg-[#F4F1EC] text-[#182536]'
                }`}
              >
                Eyeglass Cases
              </button>
              <button
                onClick={() => {
                  onSelectCategory('wallets');
                  setMobileMenuOpen(false);
                }}
                className={`text-left px-3 py-2 text-sm rounded-md font-medium ${
                  activeCategory === 'wallets' ? 'bg-[#182536] text-white' : 'hover:bg-[#F4F1EC] text-[#182536]'
                }`}
              >
                Wallets
              </button>
            </div>

            <div className="pt-3 border-t border-[#E4E5E4] flex flex-col gap-2">
              <div className="text-[11px] font-bold tracking-wider text-[#A97B4A] uppercase">
                Admin &amp; Tools Preview
              </div>
              <button
                onClick={() => {
                  onOpenAdmin('dashboard');
                  setMobileMenuOpen(false);
                }}
                className="flex items-center gap-2 px-3 py-2 text-sm text-[#182536] font-medium bg-[#FAF9F5] rounded-md border border-[#E4E5E4]"
              >
                <Shield className="w-4 h-4 text-[#A97B4A]" />
                <span className="font-bold">Admin Control Center (Dashboard)</span>
              </button>
              <button
                onClick={() => {
                  onOpenAdmin('inventory');
                  setMobileMenuOpen(false);
                }}
                className="flex items-center gap-2 px-3 py-2 text-sm text-[#182536] font-medium hover:bg-[#FAF9F5] rounded-md"
              >
                <Layers className="w-4 h-4 text-[#A97B4A]" />
                <span>Variant Inventory Table (from inventory.html)</span>
              </button>
              <button
                onClick={() => {
                  onOpenTracker();
                  setMobileMenuOpen(false);
                }}
                className="flex items-center gap-2 px-3 py-2 text-sm text-[#182536] font-medium hover:bg-[#FAF9F5] rounded-md"
              >
                <Package className="w-4 h-4 text-[#A97B4A]" />
                <span>Track an Existing Order</span>
              </button>
              <button
                onClick={() => {
                  onOpenGuide();
                  setMobileMenuOpen(false);
                }}
                className="flex items-center gap-2 px-3 py-2 text-sm text-[#182536] font-medium hover:bg-[#F4F1EC] rounded-md"
              >
                <HelpCircle className="w-4 h-4 text-[#A97B4A]" />
                <span>Beginner Store Guide</span>
              </button>
            </div>
          </div>
        )}
      </header>
    </>
  );
};
