import React from 'react';
import { X, Heart, Trash2, ShoppingBag, ArrowRight } from 'lucide-react';
import { Product } from '../types';
import { formatBDT } from '../data/store';

interface WishlistDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  wishlistProductIds: string[];
  allProducts: Product[];
  recentProductIds: string[];
  onRemoveWishlist: (productId: string) => void;
  onSelectProduct: (product: Product) => void;
}

export const WishlistDrawer: React.FC<WishlistDrawerProps> = ({
  isOpen,
  onClose,
  wishlistProductIds,
  allProducts,
  recentProductIds,
  onRemoveWishlist,
  onSelectProduct,
}) => {
  if (!isOpen) return null;

  const wishlistedProducts = allProducts.filter(p => wishlistProductIds.includes(p.id));
  const recentProducts = allProducts.filter(p => recentProductIds.includes(p.id) && !wishlistProductIds.includes(p.id));

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/60 backdrop-blur-xs flex justify-end">
      <div className="w-full max-w-md bg-white h-full shadow-2xl flex flex-col justify-between animate-in slide-in-from-right duration-300">
        
        {/* Header */}
        <div className="p-5 border-b border-[#E4E5E4] flex items-center justify-between bg-[#FAF9F5]">
          <div className="flex items-center gap-2">
            <Heart className="w-5 h-5 text-[#C89C68] fill-current" />
            <h2 className="text-lg font-bold font-display text-[#182536]">
              Saved Wishlist
            </h2>
            <span className="text-xs font-mono bg-[#182536] text-[#EAD0AC] font-bold px-2 py-0.5 rounded-full">
              {wishlistedProducts.length}
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-[#667280] hover:text-[#182536] rounded-full hover:bg-black/5 cursor-pointer"
            aria-label="Close wishlist"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Wishlist Items List */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {wishlistedProducts.length === 0 ? (
            <div className="text-center py-10 space-y-3 text-[#667280]">
              <div className="w-14 h-14 rounded-full bg-[#FAF9F5] border border-[#E4E5E4] flex items-center justify-center mx-auto text-[#182536]">
                <Heart className="w-6 h-6 opacity-40" />
              </div>
              <h3 className="text-base font-bold text-[#182536] font-display">
                No items saved yet
              </h3>
              <p className="text-xs text-[#667280] max-w-xs mx-auto">
                Tap the heart icon on any essential to save it for later or compare sizes.
              </p>
            </div>
          ) : (
            wishlistedProducts.map(product => (
              <div
                key={product.id}
                className="flex gap-4 p-3 rounded-xl border border-[#E4E5E4] bg-white hover:border-[#C89C68] transition-colors"
              >
                <div
                  onClick={() => {
                    onClose();
                    onSelectProduct(product);
                  }}
                  className="w-20 h-20 rounded-lg overflow-hidden bg-[#F4F1EC] shrink-0 border border-[#E4E5E4] cursor-pointer"
                >
                  <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                </div>

                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-start justify-between gap-1">
                      <h4
                        onClick={() => {
                          onClose();
                          onSelectProduct(product);
                        }}
                        className="text-xs sm:text-sm font-bold text-[#182536] font-display line-clamp-1 cursor-pointer hover:text-[#9A6A2E]"
                      >
                        {product.name}
                      </h4>
                      <button
                        onClick={() => onRemoveWishlist(product.id)}
                        className="text-[#999] hover:text-[#B42318] p-1 cursor-pointer"
                        title="Remove from saved"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    <div className="text-[11px] text-[#667280] capitalize">
                      {product.category.replace('-', ' ')}
                    </div>
                  </div>

                  <div className="flex items-center justify-between mt-2 pt-2 border-t border-[#F0F0EE]">
                    <span className="font-mono font-bold text-xs sm:text-sm text-[#182536]">
                      {formatBDT(product.price)}
                    </span>
                    <button
                      onClick={() => {
                        onClose();
                        onSelectProduct(product);
                      }}
                      className="px-3 py-1 rounded bg-[#182536] text-white text-[11px] font-bold hover:bg-[#273C51] flex items-center gap-1 cursor-pointer"
                    >
                      <span>View</span>
                      <ArrowRight className="w-3 h-3 text-[#C89C68]" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}

          {/* Recently Viewed Shelf */}
          {recentProducts.length > 0 && (
            <div className="pt-6 border-t border-[#E4E5E4] space-y-3">
              <div className="text-xs font-bold text-[#182536] uppercase tracking-wider">
                Recently Viewed
              </div>
              <div className="grid grid-cols-2 gap-2">
                {recentProducts.slice(0, 4).map(product => (
                  <div
                    key={product.id}
                    onClick={() => {
                      onClose();
                      onSelectProduct(product);
                    }}
                    className="p-2 rounded-lg border border-[#E4E5E4] hover:border-[#C89C68] cursor-pointer group bg-[#FAF9F5]"
                  >
                    <div className="aspect-square rounded overflow-hidden bg-white mb-1.5">
                      <img src={product.image} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                    </div>
                    <div className="text-xs font-bold text-[#182536] line-clamp-1">{product.name}</div>
                    <div className="font-mono text-[11px] font-bold text-[#9A6A2E]">{formatBDT(product.price)}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-[#E4E5E4] bg-[#FAF9F5] flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-lg bg-[#182536] text-white text-xs font-semibold hover:bg-[#273C51] cursor-pointer"
          >
            Done
          </button>
        </div>

      </div>
    </div>
  );
};
