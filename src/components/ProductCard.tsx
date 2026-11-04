import React from 'react';
import { Heart, Plus, Check } from 'lucide-react';
import { Product } from '../types';
import { formatBDT, calculateTotalStock, COLOR_SWATCHES } from '../data/store';

interface ProductCardProps {
  product: Product;
  isWishlisted: boolean;
  onToggleWishlist: (productId: string) => void;
  onQuickAdd: (product: Product) => void;
  onSelectProduct: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  isWishlisted,
  onToggleWishlist,
  onQuickAdd,
  onSelectProduct,
}) => {
  const [addedRecently, setAddedRecently] = React.useState(false);
  const totalStock = calculateTotalStock(product.stock);
  const isSoldOut = totalStock === 0;
  const isLowStock = totalStock > 0 && totalStock <= 6;

  const handleQuickAddClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isSoldOut) return;
    onQuickAdd(product);
    setAddedRecently(true);
    setTimeout(() => setAddedRecently(false), 1400);
  };

  const handleWishlistClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onToggleWishlist(product.id);
  };

  return (
    <article
      onClick={() => onSelectProduct(product)}
      className="group relative flex flex-col bg-white border border-[#E4E5E4] rounded-xl overflow-hidden hover:border-[#C89C68] hover:shadow-md transition-all cursor-pointer"
    >
      {/* Media Image Showcase */}
      <div className="relative aspect-[4/3] sm:aspect-square bg-[#F4F1EC] overflow-hidden">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />

        {/* Secondary image on hover if available */}
        {product.images && product.images[1] && (
          <img
            src={product.images[1]}
            alt={`${product.name} alternate view`}
            className="w-full h-full object-cover object-center absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
            loading="lazy"
          />
        )}

        {/* Badges: Clean unboxed subtle markers */}
        <div className="absolute top-3 left-3 flex flex-col gap-1 items-start pointer-events-none">
          {isSoldOut ? (
            <span className="text-[11px] font-bold uppercase tracking-wider bg-[#182536] text-white px-2 py-0.5 rounded">
              Sold Out
            </span>
          ) : isLowStock ? (
            <span className="text-[11px] font-bold uppercase tracking-wider bg-[#FFF7E0] text-[#9A6700] border border-[#ECD08A] px-2 py-0.5 rounded">
              Only {totalStock} Left
            </span>
          ) : null}
        </div>

        {/* Wishlist toggle */}
        <button
          type="button"
          onClick={handleWishlistClick}
          aria-label={isWishlisted ? 'Remove from wishlist' : 'Save to wishlist'}
          className={`absolute top-3 right-3 p-2 rounded-full backdrop-blur-md transition-all cursor-pointer ${
            isWishlisted
              ? 'bg-[#182536] text-[#C89C68] shadow-sm'
              : 'bg-white/80 text-[#182536] hover:bg-white hover:text-[#C89C68]'
          }`}
        >
          <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-current' : ''}`} />
        </button>

        {/* Quick View & Add overlays on desktop */}
        <div className="absolute inset-x-3 bottom-3 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            type="button"
            onClick={handleQuickAddClick}
            disabled={isSoldOut}
            className={`w-full py-2.5 px-3 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition-all shadow-md cursor-pointer ${
              isSoldOut
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : addedRecently
                ? 'bg-[#205B43] text-white'
                : 'bg-[#182536] text-white hover:bg-[#273C51] active:scale-95'
            }`}
          >
            {addedRecently ? (
              <>
                <Check className="w-3.5 h-3.5" />
                <span>Added to Bag</span>
              </>
            ) : isSoldOut ? (
              <span>Out of Stock</span>
            ) : (
              <>
                <Plus className="w-3.5 h-3.5 text-[#C89C68]" />
                <span>Quick Add</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Content Area */}
      <div className="p-4 sm:p-5 flex flex-col flex-1 justify-between">
        <div>
          {/* Clean unboxed metadata per Frontend Design Constitution */}
          <div className="flex items-center gap-2 text-xs text-[#667280]">
            <span className="capitalize">{product.category.replace('-', ' ')}</span>
            <span aria-hidden="true">·</span>
            <span>{product.colors.length} {product.colors.length === 1 ? 'color' : 'colors'}</span>
            <span aria-hidden="true">·</span>
            <span>{product.sizes.length} {product.sizes.length === 1 ? 'size' : 'sizes'}</span>
          </div>

          <h3 className="text-base font-bold text-[#182536] font-display mt-1.5 group-hover:text-[#9A6A2E] transition-colors leading-snug">
            {product.name}
          </h3>

          <p className="text-xs text-[#667280] line-clamp-2 mt-1 leading-relaxed">
            {product.description}
          </p>
        </div>

        {/* Bottom row: Swatches & Price */}
        <div className="pt-4 mt-3 border-t border-[#F0F0EE] flex items-center justify-between">
          <div className="flex items-center gap-1">
            {product.colors.slice(0, 4).map(color => (
              <span
                key={color}
                title={color}
                className="w-3 h-3 rounded-full border border-black/20"
                style={{ backgroundColor: COLOR_SWATCHES[color] || '#888' }}
              />
            ))}
            {product.colors.length > 4 && (
              <span className="text-[10px] text-[#667280] font-mono ml-0.5">
                +{product.colors.length - 4}
              </span>
            )}
          </div>

          <div className="text-right">
            <span className="text-base font-bold text-[#182536] font-mono tabular-nums">
              {formatBDT(product.price)}
            </span>
          </div>
        </div>
      </div>
    </article>
  );
};
