import React from 'react';
import { X, Printer, Package, ArrowRight, CheckCircle2 } from 'lucide-react';
import { Order } from '../types';
import { formatBDT } from '../data/store';

interface ReceiptModalProps {
  order: Order | null;
  isOpen: boolean;
  onClose: () => void;
  onTrackOrder: (orderId: string) => void;
  onContinueShopping: () => void;
}

export const ReceiptModal: React.FC<ReceiptModalProps> = ({
  order,
  isOpen,
  onClose,
  onTrackOrder,
  onContinueShopping,
}) => {
  if (!isOpen || !order) return null;

  const handlePrint = () => {
    window.print();
  };

  const formattedDate = new Date(order.createdAt).toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/65 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-xl bg-white rounded-2xl shadow-2xl border border-[#E4E5E4] overflow-hidden my-auto animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header Bar */}
        <div className="p-4 sm:p-5 border-b border-[#E4E5E4] bg-[#FAF9F5] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-[#205B43]" />
            <div>
              <h3 className="text-base font-bold font-display text-[#182536]">
                Order Confirmed · POS Receipt
              </h3>
              <p className="text-xs text-[#667280]">
                80 mm format · Ready for thermal printing or PDF export
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-[#667280] hover:text-[#182536] rounded-full hover:bg-black/5 cursor-pointer"
            aria-label="Close receipt"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Action Controls */}
        <div className="px-6 py-3 bg-[#F4F1EC] flex items-center justify-between border-b border-[#E4E5E4]">
          <button
            onClick={handlePrint}
            className="px-4 py-1.5 rounded-lg bg-[#182536] text-white text-xs font-semibold hover:bg-[#273C51] flex items-center gap-1.5 cursor-pointer shadow-xs"
          >
            <Printer className="w-3.5 h-3.5 text-[#C89C68]" />
            <span>Print Receipt (80mm)</span>
          </button>

          <button
            onClick={() => {
              onClose();
              onTrackOrder(order.id);
            }}
            className="px-4 py-1.5 rounded-lg border border-[#182536] text-[#182536] text-xs font-semibold hover:bg-white flex items-center gap-1.5 cursor-pointer"
          >
            <Package className="w-3.5 h-3.5 text-[#9A6A2E]" />
            <span>Live Order Tracker</span>
          </button>
        </div>

        {/* Scrollable Receipt Body */}
        <div className="p-6 bg-gray-50 max-h-[60vh] overflow-y-auto flex justify-center">
          
          {/* Printable 80mm Receipt Paper */}
          <article
            id="printable-receipt"
            className="w-full max-w-[340px] bg-white border border-dashed border-gray-400 p-5 font-mono text-[11px] text-gray-900 shadow-sm space-y-3"
          >
            {/* Store Brand Lockup */}
            <div className="text-center space-y-0.5">
              <h2 className="text-base font-bold font-display tracking-tight text-gray-900">
                BRUTBOX &amp; CO.
              </h2>
              <div className="text-[10px] tracking-widest uppercase text-gray-600">
                Men's Essentials Edit
              </div>
              <div className="text-[9px] text-gray-500">
                Dhaka, Bangladesh · support@brutbox.com
              </div>
              <div className="font-bold text-[10px] text-gray-800 pt-1">
                DEMO TRANSACTION RECEIPT
              </div>
            </div>

            <div className="border-t border-dashed border-gray-400 my-2" />

            {/* Meta Rows */}
            <div className="space-y-1 text-[10px]">
              <div className="flex justify-between">
                <span className="text-gray-600">Order ID:</span>
                <span className="font-bold text-gray-900">{order.id}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Date/Time:</span>
                <span>{formattedDate}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Customer:</span>
                <span className="font-bold">{order.customer}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Phone:</span>
                <span>{order.phone}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Payment:</span>
                <span className="font-bold">{order.paymentMethod} (Simulated)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Delivery To:</span>
                <span className="text-right truncate max-w-[180px]">{order.address}</span>
              </div>
            </div>

            <div className="border-t border-dashed border-gray-400 my-2" />

            {/* Itemized Table */}
            <div>
              <div className="flex justify-between font-bold text-[10px] pb-1 border-b border-gray-300">
                <span>ITEM / VARIANT</span>
                <span className="text-right">QTY · BDT</span>
              </div>
              <div className="divide-y divide-gray-100 py-1">
                {order.items.map((it, idx) => (
                  <div key={idx} className="py-1.5 flex justify-between gap-2">
                    <div>
                      <div className="font-bold line-clamp-1">{it.name}</div>
                      <div className="text-[9px] text-gray-500">
                        Size: {it.size} | Color: {it.color}
                      </div>
                    </div>
                    <div className="text-right whitespace-nowrap">
                      <span>{it.qty} × {formatBDT(it.price)}</span>
                      <div className="font-bold">{formatBDT(it.price * it.qty)}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="border-t border-dashed border-gray-400 my-2" />

            {/* Totals */}
            <div className="space-y-1 text-[10px]">
              <div className="flex justify-between">
                <span>Subtotal:</span>
                <span>{formatBDT(order.subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span>Delivery Charge:</span>
                <span>{order.deliveryFee === 0 ? 'FREE' : formatBDT(order.deliveryFee)}</span>
              </div>
              <div className="border-t border-gray-400 pt-1 flex justify-between font-bold text-xs text-gray-900">
                <span>TOTAL DUE:</span>
                <span>{formatBDT(order.total)}</span>
              </div>
            </div>

            <div className="border-t border-dashed border-gray-400 my-2" />

            {/* Barcode & Thank you */}
            <div className="text-center space-y-1 pt-1">
              <div className="font-mono text-[9px] tracking-widest text-gray-500">
                * * * {order.trackingNumber} * * *
              </div>
              <div className="font-bold text-[10px] text-gray-800">
                THANK YOU FOR CHOOSING BRUTBOX &amp; CO.
              </div>
              <p className="text-[9px] text-gray-500 leading-tight">
                Academic design demo. Retain this receipt reference for live tracking updates.
              </p>
            </div>
          </article>
        </div>

        {/* Bottom Actions */}
        <div className="p-4 border-t border-[#E4E5E4] bg-white flex items-center justify-between">
          <button
            onClick={() => {
              onClose();
              onContinueShopping();
            }}
            className="px-4 py-2 text-xs font-semibold text-[#182536] hover:bg-[#FAF9F5] rounded-lg cursor-pointer"
          >
            ← Back to Storefront
          </button>

          <button
            onClick={() => {
              onClose();
              onTrackOrder(order.id);
            }}
            className="px-5 py-2.5 rounded-lg bg-[#182536] text-white text-xs font-bold hover:bg-[#273C51] flex items-center gap-2 cursor-pointer shadow-sm"
          >
            <span>Track Delivery Progress</span>
            <ArrowRight className="w-3.5 h-3.5 text-[#C89C68]" />
          </button>
        </div>

      </div>
    </div>
  );
};
