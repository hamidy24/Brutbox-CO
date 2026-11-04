import React, { useState } from 'react';
import { X, Heart, Plus, Minus, ShoppingBag, Ruler, Check, ShieldCheck, Truck, RotateCcw } from 'lucide-react';
import { Product } from '../types';
import { formatBDT, COLOR_SWATCHES } from '../data/store';

interface ProductDetailModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
  onAddToCart: (product: Product, color: string, size: string, qty: number) => void;
  isWishlisted: boolean;
  onToggleWishlist: (productId: string) => void;
  onOpenSizeGuide: (category: string) => void;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  product,
  isOpen,
  onClose,
  onAddToCart,
  isWishlisted,
  onToggleWishlist,
  onOpenSizeGuide,
}) => {
  if (!isOpen || !product) return null;

  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [selectedColor, setSelectedColor] = useState<string>(product.colors[0] || 'Black');
  const [selectedSize, setSelectedSize] = useState<string>(product.sizes[0] || 'M');
  const [quantity, setQuantity] = useState(1);
  const [isZoomed, setIsZoomed] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 50, y: 50 });
  const [addedNotice, setAddedNotice] = useState(false);

  const images = product.images && product.images.length ? product.images : [product.image];
  const activeImage = images[activeImageIndex] || product.image;

  // Determine stock for selected variant
  const currentStock = (product.stock[selectedColor] && product.stock[selectedColor][selectedSize]) ?? 10;
  const isVariantSoldOut = currentStock <= 0;
  const isVariantLowStock = currentStock > 0 && currentStock <= 5;

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;
    setMousePosition({ x, y });
  };

  const handleAdd = () => {
    if (isVariantSoldOut) return;
    onAddToCart(product, selectedColor, selectedSize, quantity);
    setAddedNotice(true);
    setTimeout(() => setAddedNotice(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/65 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-4xl bg-white rounded-2xl shadow-2xl border border-[#E4E5E4] overflow-hidden my-auto animate-in fade-in zoom-in-95 duration-200">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 p-2 rounded-full bg-white/80 hover:bg-white text-[#182536] shadow-sm transition-all cursor-pointer"
          aria-label="Close product details"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-12 max-h-[85vh] overflow-y-auto">
          
          {/* Left Gallery Stage (5 cols) */}
          <div className="md:col-span-6 p-6 bg-[#F4F1EC] flex flex-col justify-between border-b md:border-b-0 md:border-r border-[#E4E5E4]">
            <div>
              {/* Main zoomable viewport */}
              <div
                onMouseEnter={() => setIsZoomed(true)}
                onMouseLeave={() => setIsZoomed(false)}
                onMouseMove={handleMouseMove}
                className="relative aspect-square w-full rounded-xl overflow-hidden bg-white border border-[#E4E5E4] cursor-crosshair group shadow-xs"
              >
                <img
                  src={activeImage}
                  alt={product.name}
                  className={`w-full h-full object-cover object-center transition-transform duration-200 ${
                    isZoomed ? 'scale-150' : 'scale-100'
                  }`}
                  style={
                    isZoomed
                      ? { transformOrigin: `${mousePosition.x}% ${mousePosition.y}%` }
                      : undefined
                  }
                />
                
                {/* Low stock pill */}
                {isVariantSoldOut ? (
                  <span className="absolute top-3 left-3 bg-[#182536] text-white text-[11px] font-bold uppercase tracking-wider px-2.5 py-1 rounded">
                    Sold Out in this size
                  </span>
                ) : isVariantLowStock ? (
                  <span className="absolute top-3 left-3 bg-[#FFF7E0] text-[#9A6700] border border-[#ECD08A] text-[11px] font-bold uppercase tracking-wider px-2.5 py-1 rounded">
                    Only {currentStock} Left
                  </span>
                ) : null}

                {/* Subtle zoom instruction */}
                <div className="absolute bottom-2.5 right-2.5 bg-black/60 text-white text-[10px] px-2 py-0.5 rounded backdrop-blur-xs pointer-events-none">
                  Hover to inspect fabric
                </div>
              </div>

              {/* Thumbnails strip */}
              {images.length > 1 && (
                <div className="flex items-center gap-3 mt-4 overflow-x-auto pb-1">
                  {images.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setActiveImageIndex(idx)}
                      className={`w-16 h-16 rounded-lg overflow-hidden border-2 shrink-0 transition-all cursor-pointer ${
                        activeImageIndex === idx ? 'border-[#C89C68] shadow-xs' : 'border-transparent opacity-70 hover:opacity-100'
                      }`}
                    >
                      <img src={img} alt={`View ${idx + 1}`} className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Natural materials reassurance */}
            <div className="mt-6 pt-4 border-t border-[#E4E5E4] flex items-center justify-between text-xs text-[#667280]">
              <span className="font-medium">Fabric: {product.materials}</span>
              <span className="font-mono text-[#182536] font-bold">Ref: {product.id}</span>
            </div>
          </div>

          {/* Right Purchasing & Specification Stage (6 cols) */}
          <div className="md:col-span-6 p-6 sm:p-8 flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              
              {/* Category & Ratings */}
              <div className="flex items-center justify-between text-xs text-[#667280]">
                <span className="uppercase tracking-widest font-bold text-[#9A6A2E]">
                  {product.category.replace('-', ' ')}
                </span>
                <div className="flex items-center gap-1 font-mono text-xs">
                  <span>★ {product.rating}</span>
                  <span className="text-[#667280]/60">({product.reviewsCount} verified reviews)</span>
                </div>
              </div>

              {/* Title & Price */}
              <div>
                <h2 className="text-2xl sm:text-3xl font-extrabold font-display text-[#182536] leading-tight">
                  {product.name}
                </h2>
                <div className="mt-2 text-2xl font-bold font-mono text-[#182536] tabular-nums">
                  {formatBDT(product.price)}
                  <span className="text-xs text-[#667280] font-sans font-normal ml-2">
                    Inclusive of all local taxes
                  </span>
                </div>
              </div>

              {/* Description */}
              <p className="text-sm text-[#4A5568] leading-relaxed">
                {product.description}
              </p>

              {/* Color Selection */}
              <div className="space-y-2 pt-2 border-t border-[#F0F0EE]">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-[#182536] uppercase tracking-wider">
                    Select Color: <span className="font-normal text-[#667280]">{selectedColor}</span>
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  {product.colors.map(color => (
                    <button
                      key={color}
                      onClick={() => setSelectedColor(color)}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-semibold cursor-pointer transition-all ${
                        selectedColor === color
                          ? 'border-[#182536] bg-[#182536] text-white'
                          : 'border-[#E4E5E4] bg-white text-[#182536] hover:border-[#C89C68]'
                      }`}
                    >
                      <span
                        className="w-3 h-3 rounded-full border border-black/20"
                        style={{ backgroundColor: COLOR_SWATCHES[color] || '#888' }}
                      />
                      <span>{color}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Size Selection */}
              <div className="space-y-2 pt-2 border-t border-[#F0F0EE]">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-[#182536] uppercase tracking-wider">
                    Select Size
                  </span>
                  <button
                    onClick={() => onOpenSizeGuide(product.category)}
                    className="text-[#9A6A2E] hover:underline font-semibold flex items-center gap-1 cursor-pointer"
                  >
                    <Ruler className="w-3.5 h-3.5" />
                    <span>Find Your Size</span>
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {product.sizes.map(size => {
                    const variantUnits = (product.stock[selectedColor] && product.stock[selectedColor][size]) ?? 0;
                    const isSold = variantUnits <= 0;
                    return (
                      <button
                        key={size}
                        disabled={isSold}
                        onClick={() => setSelectedSize(size)}
                        className={`min-w-12 py-2 px-3 rounded-lg text-xs font-bold font-mono transition-all cursor-pointer ${
                          isSold
                            ? 'bg-gray-100 text-gray-400 border border-gray-200 line-through cursor-not-allowed opacity-60'
                            : selectedSize === size
                            ? 'bg-[#182536] text-white border-2 border-[#182536]'
                            : 'bg-white text-[#182536] border border-[#E4E5E4] hover:border-[#C89C68]'
                        }`}
                      >
                        {size}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Quantity Stepper & Add to Bag */}
              <div className="pt-4 border-t border-[#F0F0EE] space-y-3">
                <div className="flex items-center gap-4">
                  <div className="flex items-center border border-[#E4E5E4] rounded-lg bg-white overflow-hidden">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      disabled={quantity <= 1 || isVariantSoldOut}
                      className="p-2.5 text-[#182536] hover:bg-[#F4F1EC] disabled:opacity-40 cursor-pointer"
                      aria-label="Decrease quantity"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="w-10 text-center font-mono font-bold text-sm text-[#182536] tabular-nums">
                      {quantity}
                    </span>
                    <button
                      onClick={() => setQuantity(Math.min(currentStock || 10, quantity + 1))}
                      disabled={quantity >= (currentStock || 10) || isVariantSoldOut}
                      className="p-2.5 text-[#182536] hover:bg-[#F4F1EC] disabled:opacity-40 cursor-pointer"
                      aria-label="Increase quantity"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <button
                    onClick={handleAdd}
                    disabled={isVariantSoldOut}
                    className={`flex-1 py-3 px-6 rounded-lg font-bold text-sm flex items-center justify-center gap-2 transition-all shadow-md cursor-pointer ${
                      isVariantSoldOut
                        ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                        : addedNotice
                        ? 'bg-[#205B43] text-white'
                        : 'bg-[#182536] text-white hover:bg-[#273C51] active:scale-95'
                    }`}
                  >
                    {addedNotice ? (
                      <>
                        <Check className="w-4 h-4 text-[#EAD0AC]" />
                        <span>Added to Bag!</span>
                      </>
                    ) : isVariantSoldOut ? (
                      <span>Sold Out In This Size</span>
                    ) : (
                      <>
                        <ShoppingBag className="w-4 h-4 text-[#C89C68]" />
                        <span>Add To Bag · {formatBDT(product.price * quantity)}</span>
                      </>
                    )}
                  </button>

                  <button
                    onClick={() => onToggleWishlist(product.id)}
                    aria-label="Save to wishlist"
                    className={`p-3 rounded-lg border transition-all cursor-pointer ${
                      isWishlisted
                        ? 'bg-[#182536] text-[#C89C68] border-[#182536]'
                        : 'bg-white border-[#E4E5E4] text-[#182536] hover:border-[#C89C68]'
                    }`}
                  >
                    <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-current' : ''}`} />
                  </button>
                </div>
              </div>

              {/* Guarantees Box */}
              <div className="pt-2 grid grid-cols-2 gap-2 text-[11px] text-[#667280]">
                <div className="flex items-center gap-1.5 p-2 rounded-lg bg-[#FAF9F5] border border-[#E4E5E4]">
                  <Truck className="w-3.5 h-3.5 text-[#A97B4A] shrink-0" />
                  <span>Free shipping on orders ৳3,000+</span>
                </div>
                <div className="flex items-center gap-1.5 p-2 rounded-lg bg-[#FAF9F5] border border-[#E4E5E4]">
                  <RotateCcw className="w-3.5 h-3.5 text-[#A97B4A] shrink-0" />
                  <span>Free size exchanges in 7 days</span>
                </div>
              </div>

            </div>

            {/* Bottom details disclosure */}
            <div className="pt-4 border-t border-[#E4E5E4] text-xs text-[#667280] space-y-1">
              <div className="font-bold text-[#182536]">Care Instructions:</div>
              <div>{product.care}</div>
            </div>

          </div>

        </div>
      </div>
    </div>
  );
};
