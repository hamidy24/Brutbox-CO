import React, { useState } from 'react';
import { X, ShieldAlert, Check, ArrowRight, ArrowLeft, Sparkles, MapPin, CreditCard, AlertCircle } from 'lucide-react';
import { CartItem, PaymentMethod, Order } from '../types';
import { formatBDT, FREE_DELIVERY_THRESHOLD, STANDARD_DELIVERY_FEE } from '../data/store';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  cart: CartItem[];
  onOrderCreated: (order: Order) => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  isOpen,
  onClose,
  cart,
  onOrderCreated,
}) => {
  if (!isOpen || cart.length === 0) return null;

  const [step, setStep] = useState<1 | 2>(1);
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('Dhaka');
  const [postalCode, setPostalCode] = useState('1212');
  const [notes, setNotes] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('COD');
  const [errorMessage, setErrorMessage] = useState('');
  const [showDemoConfirm, setShowDemoConfirm] = useState(false);

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
  const deliveryFee = subtotal >= FREE_DELIVERY_THRESHOLD ? 0 : STANDARD_DELIVERY_FEE;
  const total = subtotal + deliveryFee;

  // One-click demo data quick-fill
  const fillDemoData = () => {
    setFullName('Mahir Hamidy');
    setPhone('01712345678');
    setAddress('House 18, Road 4, Sector 7, Uttara');
    setCity('Dhaka');
    setPostalCode('1230');
    setNotes('Please ring bell on arrival');
    setErrorMessage('');
  };

  const validateStep1 = () => {
    if (!fullName.trim()) {
      setErrorMessage('Please enter your full name.');
      return false;
    }
    if (!/^01[3-9]\d{8}$/.test(phone.trim())) {
      setErrorMessage('Please enter a valid 11-digit Bangladeshi mobile number starting with 01 (e.g. 017XXXXXXXX).');
      return false;
    }
    if (!address.trim()) {
      setErrorMessage('Please enter your delivery street address.');
      return false;
    }
    if (!city.trim()) {
      setErrorMessage('Please specify your delivery city.');
      return false;
    }
    setErrorMessage('');
    return true;
  };

  const handleNextStep = () => {
    if (validateStep1()) {
      setStep(2);
    }
  };

  const handleFinalize = () => {
    setShowDemoConfirm(true);
  };

  const executeOrderCreation = () => {
    const orderId = `BB-${Math.floor(1000 + Math.random() * 9000)}`;
    const nowIso = new Date().toISOString();

    const newOrder: Order = {
      id: orderId,
      createdAt: nowIso,
      customer: fullName,
      phone,
      address: `${address}, ${city} ${postalCode}`,
      paymentMethod,
      items: cart.map(item => ({
        productId: item.productId,
        name: item.name,
        size: item.size,
        color: item.color,
        qty: item.qty,
        price: item.price,
        image: item.image,
      })),
      subtotal,
      deliveryFee,
      total,
      status: 'Ordered',
      carrierName: 'Pathao Courier BD',
      trackingNumber: `BD-EXP-${Math.floor(100000 + Math.random() * 900000)}`,
      estimatedDelivery: new Date(Date.now() + 86400000 * 2).toLocaleDateString('en-GB', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      }),
      milestones: [
        {
          step: 'Ordered',
          label: 'Order Placed & Verified',
          timestamp: nowIso,
          note: `Payment mode: ${paymentMethod}. Order received at central Dhaka fulfillment hub.`,
          completed: true,
        },
        {
          step: 'Packed',
          label: 'Garment Inspection & Packaging',
          timestamp: 'Pending packaging',
          note: 'Tailored essentials packed into protective moisture-seal dust bags.',
          completed: false,
        },
        {
          step: 'In Transit',
          label: 'Dispatched with Courier',
          timestamp: 'Scheduled for dispatch',
          note: 'Assigned to Pathao Express rider for express delivery.',
          completed: false,
        },
        {
          step: 'Delivered',
          label: 'Delivery & Signature',
          timestamp: 'Estimated within 48 hours',
          note: 'Customer handover and digital receipt signature.',
          completed: false,
        },
      ],
      isDemo: true,
    };

    setShowDemoConfirm(false);
    onOrderCreated(newOrder);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/65 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-[#E4E5E4] overflow-hidden my-auto animate-in fade-in zoom-in-95 duration-200">
        
        {/* Top Header & Step Banner */}
        <div className="p-5 border-b border-[#E4E5E4] bg-[#FAF9F5] flex items-center justify-between">
          <div>
            <div className="text-[10px] font-bold tracking-widest text-[#9A6A2E] uppercase">
              Secure Checkout · Step {step} of 2
            </div>
            <h2 className="text-xl font-bold font-display text-[#182536]">
              {step === 1 ? 'Delivery Information' : 'Select Payment Method'}
            </h2>
          </div>

          <div className="flex items-center gap-2">
            {step === 1 && (
              <button
                type="button"
                onClick={fillDemoData}
                className="px-3 py-1.5 rounded-lg bg-[#EAD0AC]/50 hover:bg-[#EAD0AC] text-[#182536] text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                title="Fill sample customer address"
              >
                <Sparkles className="w-3.5 h-3.5 text-[#9A6A2E]" />
                <span className="hidden sm:inline">Demo Quick-Fill</span>
              </button>
            )}
            <button
              onClick={onClose}
              className="p-2 text-[#667280] hover:text-[#182536] rounded-full hover:bg-black/5 cursor-pointer"
              aria-label="Close checkout"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Step Indicator Tabs */}
        <div className="grid grid-cols-2 border-b border-[#E4E5E4] text-xs font-bold text-center">
          <button
            onClick={() => setStep(1)}
            className={`py-2.5 transition-colors cursor-pointer border-b-2 ${
              step === 1
                ? 'border-[#182536] text-[#182536] bg-white'
                : 'border-transparent text-[#667280] bg-[#FAF9F5]'
            }`}
          >
            1. Shipping Address
          </button>
          <button
            onClick={() => validateStep1() && setStep(2)}
            className={`py-2.5 transition-colors cursor-pointer border-b-2 ${
              step === 2
                ? 'border-[#182536] text-[#182536] bg-white'
                : 'border-transparent text-[#667280] bg-[#FAF9F5]'
            }`}
          >
            2. Payment &amp; Review
          </button>
        </div>

        {/* Body Form */}
        <div className="p-6 space-y-5 max-h-[65vh] overflow-y-auto">
          {errorMessage && (
            <div className="p-3 rounded-lg bg-[#FDEEEE] border border-[#F0B4AD] text-[#B42318] text-xs font-medium flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {step === 1 ? (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#182536] uppercase tracking-wider mb-1.5">
                    Full Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={fullName}
                    onChange={e => setFullName(e.target.value)}
                    placeholder="e.g. Mahir Hamidy"
                    className="w-full px-3.5 py-2.5 rounded-lg border border-[#CCD2D5] focus:border-[#C89C68] focus:outline-hidden text-sm"
                  />
                  <span className="text-[11px] text-[#667280] mt-1 block">Recipient name for parcel delivery</span>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#182536] uppercase tracking-wider mb-1.5">
                    Phone Number <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={e => setPhone(e.target.value)}
                    placeholder="01XXXXXXXXX"
                    className="w-full px-3.5 py-2.5 rounded-lg border border-[#CCD2D5] focus:border-[#C89C68] focus:outline-hidden text-sm font-mono"
                  />
                  <span className="text-[11px] text-[#667280] mt-1 block">11-digit Bangladeshi mobile number</span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#182536] uppercase tracking-wider mb-1.5">
                  Street Address &amp; Area <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={address}
                  onChange={e => setAddress(e.target.value)}
                  placeholder="House number, road number, flat/apartment, area"
                  className="w-full px-3.5 py-2.5 rounded-lg border border-[#CCD2D5] focus:border-[#C89C68] focus:outline-hidden text-sm"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#182536] uppercase tracking-wider mb-1.5">
                    City / Division <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={city}
                    onChange={e => setCity(e.target.value)}
                    placeholder="Dhaka, Chittagong, Sylhet..."
                    className="w-full px-3.5 py-2.5 rounded-lg border border-[#CCD2D5] focus:border-[#C89C68] focus:outline-hidden text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#182536] uppercase tracking-wider mb-1.5">
                    Postal Code
                  </label>
                  <input
                    type="text"
                    value={postalCode}
                    onChange={e => setPostalCode(e.target.value)}
                    placeholder="1200"
                    className="w-full px-3.5 py-2.5 rounded-lg border border-[#CCD2D5] focus:border-[#C89C68] focus:outline-hidden text-sm font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#182536] uppercase tracking-wider mb-1.5">
                  Delivery Notes <span className="text-gray-400 font-normal">(Optional)</span>
                </label>
                <input
                  type="text"
                  value={notes}
                  onChange={e => setNotes(e.target.value)}
                  placeholder="Special instructions for rider..."
                  className="w-full px-3.5 py-2.5 rounded-lg border border-[#CCD2D5] focus:border-[#C89C68] focus:outline-hidden text-sm"
                />
              </div>
            </div>
          ) : (
            <div className="space-y-5">
              {/* Delivery Destination recap */}
              <div className="p-3.5 rounded-xl bg-[#FAF9F5] border border-[#E4E5E4] flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-[#A97B4A]" />
                  <div>
                    <span className="font-bold text-[#182536]">{fullName}</span> · <span>{phone}</span>
                    <div className="text-[#667280]">{address}, {city} {postalCode}</div>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="text-[#9A6A2E] hover:underline font-bold cursor-pointer"
                >
                  Edit
                </button>
              </div>

              {/* Payment Methods */}
              <div className="space-y-2.5">
                <label className="block text-xs font-bold text-[#182536] uppercase tracking-wider">
                  Select Demo Payment Method
                </label>

                {/* COD */}
                <label className={`flex items-start gap-3 p-3.5 rounded-xl border cursor-pointer transition-all ${
                  paymentMethod === 'COD' ? 'border-[#182536] bg-[#FDFBF7] ring-1 ring-[#182536]' : 'border-[#E4E5E4] hover:border-[#C89C68]'
                }`}>
                  <input
                    type="radio"
                    name="payment"
                    checked={paymentMethod === 'COD'}
                    onChange={() => setPaymentMethod('COD')}
                    className="mt-1 accent-[#182536]"
                  />
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-sm text-[#182536]">Cash on Delivery (COD)</span>
                      <span className="text-[11px] font-mono font-bold text-[#205B43] bg-[#E4EFE8] px-2 py-0.5 rounded">
                        Most Popular
                      </span>
                    </div>
                    <p className="text-xs text-[#667280] mt-0.5">
                      Pay cash directly to the courier rider upon delivery and physical inspection of your package.
                    </p>
                  </div>
                </label>

                {/* bKash */}
                <label className={`flex items-start gap-3 p-3.5 rounded-xl border cursor-pointer transition-all ${
                  paymentMethod === 'bKash' ? 'border-[#182536] bg-[#FDFBF7] ring-1 ring-[#182536]' : 'border-[#E4E5E4] hover:border-[#C89C68]'
                }`}>
                  <input
                    type="radio"
                    name="payment"
                    checked={paymentMethod === 'bKash'}
                    onChange={() => setPaymentMethod('bKash')}
                    className="mt-1 accent-[#182536]"
                  />
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-sm text-[#E2136E]">bKash Wallet</span>
                      <span className="text-[11px] font-mono text-[#667280]">Mobile Payment</span>
                    </div>
                    <p className="text-xs text-[#667280] mt-0.5">
                      Instant mobile financial wallet transfer simulation. No real PIN or credentials needed.
                    </p>
                  </div>
                </label>

                {/* Nagad */}
                <label className={`flex items-start gap-3 p-3.5 rounded-xl border cursor-pointer transition-all ${
                  paymentMethod === 'Nagad' ? 'border-[#182536] bg-[#FDFBF7] ring-1 ring-[#182536]' : 'border-[#E4E5E4] hover:border-[#C89C68]'
                }`}>
                  <input
                    type="radio"
                    name="payment"
                    checked={paymentMethod === 'Nagad'}
                    onChange={() => setPaymentMethod('Nagad')}
                    className="mt-1 accent-[#182536]"
                  />
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-sm text-[#F7941D]">Nagad Wallet</span>
                      <span className="text-[11px] font-mono text-[#667280]">Postal Digital</span>
                    </div>
                    <p className="text-xs text-[#667280] mt-0.5">
                      Direct Nagad wallet payment simulation with zero surcharge fees.
                    </p>
                  </div>
                </label>

                {/* Card */}
                <label className={`flex items-start gap-3 p-3.5 rounded-xl border cursor-pointer transition-all ${
                  paymentMethod === 'CARD' ? 'border-[#182536] bg-[#FDFBF7] ring-1 ring-[#182536]' : 'border-[#E4E5E4] hover:border-[#C89C68]'
                }`}>
                  <input
                    type="radio"
                    name="payment"
                    checked={paymentMethod === 'CARD'}
                    onChange={() => setPaymentMethod('CARD')}
                    className="mt-1 accent-[#182536]"
                  />
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-sm text-[#182536]">Debit / Credit Card</span>
                      <span className="text-[11px] font-mono text-[#667280]">Visa / MC</span>
                    </div>
                    <p className="text-xs text-[#667280] mt-0.5">
                      Simulated 3D Secure bank card gateway for credit and debit cards.
                    </p>
                  </div>
                </label>
              </div>

              {/* Order items recap */}
              <div className="p-4 rounded-xl border border-[#E4E5E4] bg-[#FAF9F5] space-y-2 text-xs">
                <div className="font-bold text-[#182536] uppercase tracking-wider">Order Summary</div>
                <div className="divide-y divide-[#E4E5E4]">
                  {cart.map(item => (
                    <div key={item.id} className="py-1.5 flex justify-between">
                      <span className="text-[#667280]">
                        {item.qty} × {item.name} ({item.size}/{item.color})
                      </span>
                      <span className="font-mono font-bold text-[#182536]">
                        {formatBDT(item.price * item.qty)}
                      </span>
                    </div>
                  ))}
                </div>
                <div className="pt-2 border-t border-[#E4E5E4] flex justify-between text-sm font-bold text-[#182536]">
                  <span>Total Due</span>
                  <span className="font-mono text-base">{formatBDT(total)}</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-[#E4E5E4] bg-[#FAF9F5] flex items-center justify-between">
          {step === 2 ? (
            <button
              onClick={() => setStep(1)}
              className="px-4 py-2 text-xs font-bold text-[#182536] hover:bg-black/5 rounded-lg flex items-center gap-1.5 cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Shipping</span>
            </button>
          ) : (
            <div className="text-xs text-[#667280]">
              Free delivery on orders over ৳3,000
            </div>
          )}

          {step === 1 ? (
            <button
              onClick={handleNextStep}
              className="px-6 py-2.5 rounded-lg bg-[#182536] text-white text-xs font-bold hover:bg-[#273C51] flex items-center gap-1.5 cursor-pointer shadow-sm"
            >
              <span>Continue to Payment</span>
              <ArrowRight className="w-3.5 h-3.5 text-[#C89C68]" />
            </button>
          ) : (
            <button
              onClick={handleFinalize}
              className="px-6 py-2.5 rounded-lg bg-[#182536] text-white text-xs font-bold hover:bg-[#273C51] flex items-center gap-1.5 cursor-pointer shadow-sm"
            >
              <span>Confirm Demo Order · {formatBDT(total)}</span>
              <Check className="w-4 h-4 text-[#C89C68]" />
            </button>
          )}
        </div>

      </div>

      {/* Demo Warning Confirmation Dialog */}
      {showDemoConfirm && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs">
          <div className="max-w-md w-full bg-white rounded-2xl p-6 shadow-2xl border border-[#E4E5E4] space-y-4">
            <div className="w-12 h-12 rounded-full bg-[#FFF7E0] border border-[#ECD08A] text-[#9A6700] flex items-center justify-center mx-auto">
              <ShieldAlert className="w-6 h-6" />
            </div>

            <div className="text-center space-y-1">
              <div className="text-[11px] font-bold uppercase tracking-widest text-[#9A6A2E]">
                Student Academic Demo Notice
              </div>
              <h3 className="text-xl font-bold font-display text-[#182536]">
                Place Simulated Order
              </h3>
              <p className="text-xs text-[#667280] leading-relaxed">
                This website is a demonstration e-commerce prototype. No real money will be charged, and no real delivery will occur. Placing this order will generate an authentic <strong>80mm POS receipt</strong> and initialize the live <strong>Order Tracking Simulator</strong>.
              </p>
            </div>

            <div className="p-3 rounded-lg bg-[#FAF9F5] border border-[#E4E5E4] text-xs space-y-1 text-[#182536]">
              <div className="flex justify-between font-medium">
                <span>Customer:</span>
                <span className="font-bold">{fullName}</span>
              </div>
              <div className="flex justify-between font-medium">
                <span>Total Amount:</span>
                <span className="font-bold font-mono">{formatBDT(total)}</span>
              </div>
              <div className="flex justify-between font-medium">
                <span>Payment Mode:</span>
                <span className="font-bold">{paymentMethod}</span>
              </div>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                onClick={() => setShowDemoConfirm(false)}
                className="flex-1 py-2.5 rounded-lg border border-[#E4E5E4] text-xs font-semibold text-[#182536] hover:bg-[#F4F1EC] cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={executeOrderCreation}
                className="flex-1 py-2.5 rounded-lg bg-[#182536] text-white text-xs font-bold hover:bg-[#273C51] cursor-pointer shadow-sm"
              >
                Yes, Place Order
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
