import React from 'react';
import { X, Trash2, Plus, Minus, ArrowRight, ShoppingBag, Truck, CheckCircle2 } from 'lucide-react';
import { CartItem } from '../types';
import { formatBDT, FREE_DELIVERY_THRESHOLD, STANDARD_DELIVERY_FEE } from '../data/store';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cart: CartItem[];
  onUpdateQty: (itemIndex: number, newQty: number) => void;
  onRemoveItem: (itemIndex: number) => void;
  onProceedCheckout: () => void;
  onStartShopping: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  cart,
  onUpdateQty,
  onRemoveItem,
  onProceedCheckout,
  onStartShopping,
}) => {
  if (!isOpen) return null;

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
  const isFreeDelivery = subtotal >= FREE_DELIVERY_THRESHOLD || subtotal === 0;
  const deliveryFee = isFreeDelivery ? 0 : STANDARD_DELIVERY_FEE;
  const grandTotal = subtotal + deliveryFee;
  const remainingForFree = Math.max(0, FREE_DELIVERY_THRESHOLD - subtotal);
  const freeProgressPercent = Math.min(100, Math.round((subtotal / FREE_DELIVERY_THRESHOLD) * 100));

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/60 backdrop-blur-xs flex justify-end">
      <div className="w-full max-w-md bg-white h-full shadow-2xl flex flex-col justify-between animate-in slide-in-from-right duration-300">
        
        {/* Header */}
        <div className="p-5 border-b border-[#E4E5E4] flex items-center justify-between bg-[#FAF9F5]">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-[#182536]" />
            <h2 className="text-lg font-bold font-display text-[#182536]">
              Shopping Bag
            </h2>
            <span className="text-xs font-mono bg-[#182536] text-[#EAD0AC] font-bold px-2 py-0.5 rounded-full">
              {cart.reduce((s, i) => s + i.qty, 0)}
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-[#667280] hover:text-[#182536] rounded-full hover:bg-black/5 cursor-pointer"
            aria-label="Close bag"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Free Shipping Progress Indicator (Beginner Delight) */}
        <div className="p-4 bg-[#F8F2E8] border-b border-[#EAD0AC]/50">
          <div className="flex items-center justify-between text-xs font-semibold text-[#182536] mb-1.5">
            <span className="flex items-center gap-1.5">
              <Truck className="w-3.5 h-3.5 text-[#9A6A2E]" />
              {isFreeDelivery && subtotal > 0 ? (
                <span className="text-[#205B43] flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Free Express Delivery Unlocked!
                </span>
              ) : (
                <span>Add {formatBDT(remainingForFree)} more for Free Delivery</span>
              )}
            </span>
            <span className="font-mono text-[11px] text-[#9A6A2E]">{freeProgressPercent}%</span>
          </div>
          <div className="w-full h-2 rounded-full bg-[#E4E5E4] overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-[#C89C68] to-[#9A6A2E] rounded-full transition-all duration-500"
              style={{ width: `${freeProgressPercent}%` }}
            />
          </div>
        </div>

        {/* Items List */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {cart.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-4 text-[#667280]">
              <div className="w-16 h-16 rounded-full bg-[#FAF9F5] border border-[#E4E5E4] flex items-center justify-center text-[#182536]">
                <ShoppingBag className="w-8 h-8 opacity-40" />
              </div>
              <div className="space-y-1">
                <h3 className="text-base font-bold font-display text-[#182536]">
                  Your bag is empty
                </h3>
                <p className="text-xs text-[#667280] max-w-xs">
                  Browse our curated everyday essentials collection and add items to begin checkout.
                </p>
              </div>
              <button
                onClick={() => {
                  onClose();
                  onStartShopping();
                }}
                className="px-5 py-2.5 rounded-lg bg-[#182536] text-white text-xs font-bold hover:bg-[#273C51] transition-all cursor-pointer"
              >
                Explore Collection
              </button>
            </div>
          ) : (
            cart.map((item, index) => (
              <div
                key={item.id}
                className="flex gap-4 p-3 rounded-xl border border-[#E4E5E4] bg-white hover:border-[#C89C68] transition-colors"
              >
                {/* Thumb */}
                <div className="w-20 h-20 rounded-lg overflow-hidden bg-[#F4F1EC] shrink-0 border border-[#E4E5E4]">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Details */}
                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-start justify-between gap-2">
                      <h4 className="text-xs sm:text-sm font-bold text-[#182536] font-display line-clamp-1">
                        {item.name}
                      </h4>
                      <button
                        onClick={() => onRemoveItem(index)}
                        className="text-[#999] hover:text-[#B42318] p-1 cursor-pointer"
                        title="Remove item"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    <div className="text-[11px] text-[#667280] mt-0.5">
                      <span>Size: {item.size}</span> · <span>Color: {item.color}</span>
                    </div>
                  </div>

                  {/* Quantity Stepper & Price */}
                  <div className="flex items-center justify-between mt-2 pt-2 border-t border-[#F0F0EE]">
                    <div className="flex items-center border border-[#E4E5E4] rounded-md overflow-hidden bg-white">
                      <button
                        onClick={() => onUpdateQty(index, item.qty - 1)}
                        className="p-1 text-[#182536] hover:bg-[#F4F1EC] cursor-pointer"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="w-7 text-center font-mono font-bold text-xs text-[#182536] tabular-nums">
                        {item.qty}
                      </span>
                      <button
                        onClick={() => onUpdateQty(index, item.qty + 1)}
                        className="p-1 text-[#182536] hover:bg-[#F4F1EC] cursor-pointer"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>

                    <div className="font-mono font-bold text-xs sm:text-sm text-[#182536] tabular-nums">
                      {formatBDT(item.price * item.qty)}
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Order Summary & Checkout CTA */}
        {cart.length > 0 && (
          <div className="p-5 border-t border-[#E4E5E4] bg-[#FAF9F5] space-y-4">
            <div className="space-y-1.5 text-xs text-[#667280]">
              <div className="flex justify-between">
                <span>Subtotal ({cart.reduce((s, i) => s + i.qty, 0)} items)</span>
                <span className="font-mono text-[#182536] font-bold">{formatBDT(subtotal)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span>Delivery</span>
                <span className="font-mono font-bold">
                  {isFreeDelivery ? (
                    <span className="text-[#205B43]">FREE</span>
                  ) : (
                    formatBDT(deliveryFee)
                  )}
                </span>
              </div>
              <div className="pt-2 border-t border-[#E4E5E4] flex justify-between text-sm font-bold text-[#182536]">
                <span>Total Amount</span>
                <span className="font-mono text-base">{formatBDT(grandTotal)}</span>
              </div>
            </div>

            <button
              onClick={() => {
                onClose();
                onProceedCheckout();
              }}
              className="w-full py-3.5 px-6 rounded-lg bg-[#182536] text-white font-bold text-sm hover:bg-[#273C51] active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md"
            >
              <span>Proceed to Checkout</span>
              <ArrowRight className="w-4 h-4 text-[#C89C68]" />
            </button>
          </div>
        )}

      </div>
    </div>
  );
};
