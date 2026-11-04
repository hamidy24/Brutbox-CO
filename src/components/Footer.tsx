import React from 'react';
import { ShieldCheck, Package, Ruler, HelpCircle } from 'lucide-react';
import { CategorySlug } from '../types';
import { CATEGORIES } from '../data/store';

interface FooterProps {
  onSelectCategory: (category: CategorySlug | 'all') => void;
  onOpenSizeGuide: () => void;
  onOpenTracker: () => void;
  onOpenGuide: () => void;
  onOpenAdmin: (tab?: 'dashboard' | 'products' | 'inventory' | 'upload' | 'reports' | 'activity') => void;
  onOpenCheckout?: () => void;
  onOpenReceipt?: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  onSelectCategory,
  onOpenSizeGuide,
  onOpenTracker,
  onOpenGuide,
  onOpenAdmin,
  onOpenCheckout,
  onOpenReceipt,
}) => {
  return (
    <footer className="bg-[#111D2B] text-[#D7DCE2] border-t border-white/10 pt-16 pb-12 text-xs">
      <div className="max-w-[1240px] mx-auto px-4 sm:px-6">
        
        {/* Main 4-Column Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-12 gap-8 lg:gap-10 pb-12 border-b border-white/10">
          
          {/* Brand Info (4 cols) */}
          <div className="md:col-span-4 space-y-4">
            <div className="text-2xl font-bold font-display text-white tracking-tight">
              BRUTBOX <span className="text-[#C89C68]">&amp; CO.</span>
            </div>
            <p className="text-[#9AA5B4] text-xs leading-relaxed max-w-sm">
              Understated style. Everyday essentials. A production-grade digital storefront and merchant administration suite built for curated men's comfort in Bangladesh.
            </p>
            <div className="p-3 rounded-lg bg-white/5 border border-white/10 space-y-1">
              <div className="text-[11px] text-[#C89C68] font-bold">
                Student &amp; Academic Showcase
              </div>
              <p className="text-[10px] text-[#9AA5B4] leading-normal">
                Originally prototyped across 10 static HTML/CSS files, now synthesized into a reactive, persistent e-commerce application.
              </p>
            </div>
          </div>

          {/* Catalog Links (2 cols) */}
          <div className="md:col-span-2 space-y-3">
            <div className="text-[11px] font-bold uppercase tracking-wider text-white">
              The Collection
            </div>
            <ul className="space-y-2 text-[#9AA5B4]">
              {CATEGORIES.map(c => (
                <li key={c.slug}>
                  <button
                    onClick={() => {
                      onSelectCategory(c.slug);
                      window.scrollTo({ top: 500, behavior: 'smooth' });
                    }}
                    className="hover:text-white transition-colors cursor-pointer text-left"
                  >
                    {c.name}
                  </button>
                </li>
              ))}
              <li>
                <button
                  onClick={() => {
                    onSelectCategory('all');
                    window.scrollTo({ top: 500, behavior: 'smooth' });
                  }}
                  className="text-[#C89C68] hover:underline cursor-pointer"
                >
                  All Items →
                </button>
              </li>
            </ul>
          </div>

          {/* Project Pages & Original Previews (3 cols) */}
          <div className="md:col-span-3 space-y-3">
            <div className="text-[11px] font-bold uppercase tracking-wider text-[#C89C68] flex items-center gap-1.5">
              <span>Project Pages Preview</span>
            </div>
            <ul className="space-y-2 text-[#9AA5B4]">
              <li>
                <button
                  onClick={() => onOpenAdmin('dashboard')}
                  className="hover:text-white transition-colors cursor-pointer flex items-center gap-2 group text-left"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-[#C89C68]" />
                  <span>Admin Dashboard <code className="text-[10px] text-[#A97B4A] font-mono">(admin.html)</code></span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => onOpenAdmin('inventory')}
                  className="hover:text-white transition-colors cursor-pointer flex items-center gap-2 group text-left"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-[#C89C68]" />
                  <span>Variant Inventory <code className="text-[10px] text-[#A97B4A] font-mono">(inventory.html)</code></span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => onOpenAdmin('upload')}
                  className="hover:text-white transition-colors cursor-pointer flex items-center gap-2 group text-left"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-[#9AA5B4]" />
                  <span>Upload Product <code className="text-[10px] text-[#9AA5B4] font-mono">(admin.html#upload)</code></span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => onOpenAdmin('reports')}
                  className="hover:text-white transition-colors cursor-pointer flex items-center gap-2 group text-left"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-[#9AA5B4]" />
                  <span>Reports &amp; CSV <code className="text-[10px] text-[#9AA5B4] font-mono">(admin.html#reports)</code></span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => onOpenCheckout ? onOpenCheckout() : onOpenGuide()}
                  className="hover:text-white transition-colors cursor-pointer flex items-center gap-2 group text-left"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-[#9AA5B4]" />
                  <span>Checkout Flow <code className="text-[10px] text-[#9AA5B4] font-mono">(checkout.html)</code></span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => onOpenReceipt ? onOpenReceipt() : onOpenTracker()}
                  className="hover:text-white transition-colors cursor-pointer flex items-center gap-2 group text-left"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-[#9AA5B4]" />
                  <span>Thermal Receipt <code className="text-[10px] text-[#9AA5B4] font-mono">(receipt.html)</code></span>
                </button>
              </li>
            </ul>
          </div>

          {/* Interactive Tools & Auditing (3 cols) */}
          <div className="md:col-span-3 space-y-3">
            <div className="text-[11px] font-bold uppercase tracking-wider text-white">
              Features &amp; Guide
            </div>
            <ul className="space-y-2 text-[#9AA5B4]">
              <li>
                <button
                  onClick={onOpenSizeGuide}
                  className="hover:text-white transition-colors cursor-pointer flex items-center gap-1.5"
                >
                  <Ruler className="w-3.5 h-3.5 text-[#C89C68]" />
                  <span>Visual Sizing Advisor</span>
                </button>
              </li>
              <li>
                <button
                  onClick={onOpenTracker}
                  className="hover:text-white transition-colors cursor-pointer flex items-center gap-1.5"
                >
                  <Package className="w-3.5 h-3.5 text-[#C89C68]" />
                  <span>Live Order Tracker Simulator</span>
                </button>
              </li>
              <li>
                <button
                  onClick={onOpenGuide}
                  className="hover:text-white transition-colors cursor-pointer flex items-center gap-1.5"
                >
                  <HelpCircle className="w-3.5 h-3.5 text-[#C89C68]" />
                  <span>Beginner User Guide &amp; Audit</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => onOpenAdmin('dashboard')}
                  className="hover:text-white transition-colors cursor-pointer flex items-center gap-1.5 text-[#C89C68]"
                >
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Merchant Control Center</span>
                </button>
              </li>
            </ul>
            <div className="pt-2 text-[10px] text-[#667280]">
              Admin login: ID <span className="font-mono text-white">admin1</span> · Pass <span className="font-mono text-white">brut1234</span>
            </div>
          </div>

        </div>

        {/* Bottom Credits & Disclaimer */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-[#667280]">
          <div>
            &copy; 2026 BRUTBOX &amp; CO. · Developed with modern React &amp; Tailwind CSS
          </div>
          <div className="flex items-center gap-4">
            <span>Designed for Desktop, Tablet &amp; Mobile</span>
            <span aria-hidden="true">·</span>
            <button onClick={() => onOpenAdmin('dashboard')} className="text-[#C89C68] hover:underline cursor-pointer">
              Admin Sign In
            </button>
          </div>
        </div>

      </div>
    </footer>
  );
};
