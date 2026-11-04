import React, { useState } from 'react';
import { X, Search, Package, CheckCircle2, Clock, Truck, Home, MapPin, RefreshCw, AlertCircle } from 'lucide-react';
import { Order, OrderStatus } from '../types';
import { formatBDT } from '../data/store';

interface OrderTrackerModalProps {
  isOpen: boolean;
  onClose: () => void;
  orders: Order[];
  initialOrderId?: string;
  onUpdateOrderStatus: (orderId: string, newStatus: OrderStatus) => void;
}

export const OrderTrackerModal: React.FC<OrderTrackerModalProps> = ({
  isOpen,
  onClose,
  orders,
  initialOrderId,
  onUpdateOrderStatus,
}) => {
  if (!isOpen) return null;

  const [searchId, setSearchId] = useState(initialOrderId || (orders[0]?.id ?? 'BB-1001'));
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(
    orders.find(o => o.id === (initialOrderId || searchId)) || orders[0] || null
  );
  const [errorNotice, setErrorNotice] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const query = searchId.trim().toUpperCase();
    const match = orders.find(o => o.id.toUpperCase() === query);
    if (match) {
      setSelectedOrder(match);
      setErrorNotice('');
    } else {
      setErrorNotice(`No order found matching "${searchId}". Try sample ID "${orders[0]?.id || 'BB-1001'}".`);
    }
  };

  // Next step simulation
  const handleSimulateNextStep = () => {
    if (!selectedOrder) return;
    const stages: OrderStatus[] = ['Ordered', 'Packed', 'In Transit', 'Delivered'];
    const currentIndex = stages.indexOf(selectedOrder.status);
    if (currentIndex < stages.length - 1) {
      const nextStatus = stages[currentIndex + 1];
      onUpdateOrderStatus(selectedOrder.id, nextStatus);
      setSelectedOrder({
        ...selectedOrder,
        status: nextStatus,
        milestones: selectedOrder.milestones.map((m, idx) => ({
          ...m,
          completed: idx <= currentIndex + 1,
          timestamp: idx === currentIndex + 1 ? new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : m.timestamp,
        })),
      });
    }
  };

  const getStepIcon = (step: OrderStatus, completed: boolean) => {
    switch (step) {
      case 'Ordered':
        return <Clock className={`w-4 h-4 ${completed ? 'text-white' : 'text-gray-400'}`} />;
      case 'Packed':
        return <Package className={`w-4 h-4 ${completed ? 'text-white' : 'text-gray-400'}`} />;
      case 'In Transit':
        return <Truck className={`w-4 h-4 ${completed ? 'text-white' : 'text-gray-400'}`} />;
      case 'Delivered':
        return <Home className={`w-4 h-4 ${completed ? 'text-white' : 'text-gray-400'}`} />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/65 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-[#E4E5E4] overflow-hidden my-auto animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="p-5 border-b border-[#E4E5E4] bg-[#FAF9F5] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-[#182536] text-[#EAD0AC]">
              <Package className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold font-display text-[#182536]">
                Live Package Dispatch Simulator
              </h2>
              <p className="text-xs text-[#667280]">
                Real-time tracking for Bangladesh courier dispatch
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-[#667280] hover:text-[#182536] rounded-full hover:bg-black/5 cursor-pointer"
            aria-label="Close tracking"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search bar */}
        <div className="p-4 bg-[#F4F1EC] border-b border-[#E4E5E4]">
          <form onSubmit={handleSearch} className="flex gap-2">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
              <input
                type="text"
                value={searchId}
                onChange={e => setSearchId(e.target.value)}
                placeholder="Enter Order ID (e.g. BB-1001)"
                className="w-full pl-9 pr-3 py-2 rounded-lg bg-white border border-[#CCD2D5] focus:border-[#C89C68] focus:outline-hidden text-xs sm:text-sm font-mono uppercase"
              />
            </div>
            <button
              type="submit"
              className="px-4 py-2 rounded-lg bg-[#182536] text-white text-xs font-bold hover:bg-[#273C51] cursor-pointer"
            >
              Track
            </button>
          </form>

          {/* Quick preset links */}
          <div className="flex items-center gap-2 mt-2 text-[11px] text-[#667280]">
            <span>Recent Test Orders:</span>
            {orders.slice(0, 3).map(o => (
              <button
                key={o.id}
                type="button"
                onClick={() => {
                  setSearchId(o.id);
                  setSelectedOrder(o);
                  setErrorNotice('');
                }}
                className="font-mono text-[#9A6A2E] hover:underline font-bold cursor-pointer"
              >
                {o.id}
              </button>
            ))}
          </div>

          {errorNotice && (
            <div className="mt-2 text-xs text-[#B42318] flex items-center gap-1.5">
              <AlertCircle className="w-3.5 h-3.5" />
              <span>{errorNotice}</span>
            </div>
          )}
        </div>

        {/* Tracking Details View */}
        {selectedOrder ? (
          <div className="p-6 space-y-6 max-h-[60vh] overflow-y-auto">
            
            {/* Status card */}
            <div className="p-5 rounded-xl bg-gradient-to-br from-[#182536] to-[#223349] text-white flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="text-[10px] font-mono tracking-widest text-[#EAD0AC] uppercase">
                  Waybill: {selectedOrder.trackingNumber}
                </div>
                <div className="text-2xl font-bold font-display text-white">
                  Status: {selectedOrder.status}
                </div>
                <div className="text-xs text-white/80">
                  Carrier: {selectedOrder.carrierName} · Est. Arrival: {selectedOrder.estimatedDelivery}
                </div>
              </div>

              {selectedOrder.status !== 'Delivered' && (
                <button
                  onClick={handleSimulateNextStep}
                  className="px-4 py-2.5 rounded-lg bg-[#EAD0AC] text-[#182536] text-xs font-bold hover:bg-[#F4DFC4] active:scale-95 transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-sm shrink-0"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Simulate Next Step</span>
                </button>
              )}
            </div>

            {/* Stepper Timeline */}
            <div className="space-y-4">
              <div className="text-xs font-bold text-[#182536] uppercase tracking-wider">
                Transit Milestones
              </div>

              <div className="relative pl-6 space-y-6 before:absolute before:left-3 before:top-2 before:bottom-2 before:w-0.5 before:bg-[#E4E5E4]">
                {selectedOrder.milestones.map((m, idx) => {
                  const isCurrent = selectedOrder.status === m.step;
                  return (
                    <div key={idx} className="relative group">
                      {/* Node Icon */}
                      <div
                        className={`absolute -left-6 top-0 w-6 h-6 rounded-full flex items-center justify-center transition-all ${
                          m.completed
                            ? 'bg-[#205B43] shadow-xs'
                            : 'bg-white border-2 border-gray-300'
                        }`}
                      >
                        {getStepIcon(m.step, m.completed)}
                      </div>

                      <div className="pl-3">
                        <div className="flex items-baseline justify-between gap-2">
                          <h4 className={`text-sm font-bold ${m.completed ? 'text-[#182536]' : 'text-gray-400'}`}>
                            {m.label}
                          </h4>
                          <span className="text-[11px] font-mono text-[#667280]">
                            {m.timestamp}
                          </span>
                        </div>
                        <p className="text-xs text-[#667280] mt-0.5">
                          {m.note}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Delivery Details & Items */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-[#E4E5E4] text-xs">
              <div className="p-3.5 rounded-xl bg-[#FAF9F5] border border-[#E4E5E4] space-y-1">
                <div className="font-bold text-[#182536] uppercase tracking-wider flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-[#A97B4A]" />
                  <span>Delivery Destination</span>
                </div>
                <div className="font-semibold text-gray-800">{selectedOrder.customer} ({selectedOrder.phone})</div>
                <div className="text-gray-600">{selectedOrder.address}</div>
                <div className="text-[11px] text-[#A97B4A] pt-1 font-mono">
                  Payment Method: {selectedOrder.paymentMethod}
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-[#FAF9F5] border border-[#E4E5E4] space-y-1">
                <div className="font-bold text-[#182536] uppercase tracking-wider">
                  Package Contents ({selectedOrder.items.length} items)
                </div>
                <div className="divide-y divide-[#E4E5E4] max-h-24 overflow-y-auto">
                  {selectedOrder.items.map((it, i) => (
                    <div key={i} className="py-1 flex justify-between">
                      <span className="truncate max-w-[140px] text-gray-700">
                        {it.qty} × {it.name}
                      </span>
                      <span className="font-mono font-bold text-gray-900">
                        {formatBDT(it.price * it.qty)}
                      </span>
                    </div>
                  ))}
                </div>
                <div className="pt-1 flex justify-between font-bold text-gray-900">
                  <span>Grand Total</span>
                  <span className="font-mono">{formatBDT(selectedOrder.total)}</span>
                </div>
              </div>
            </div>

          </div>
        ) : (
          <div className="p-12 text-center text-[#667280]">
            No orders available to track.
          </div>
        )}

        {/* Footer */}
        <div className="p-4 border-t border-[#E4E5E4] bg-white flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-lg bg-[#182536] text-white text-xs font-semibold hover:bg-[#273C51] cursor-pointer"
          >
            Close Tracker
          </button>
        </div>

      </div>
    </div>
  );
};
