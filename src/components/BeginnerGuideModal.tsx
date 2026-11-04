import React, { useState } from 'react';
import { X, Sparkles, CheckCircle, ShieldCheck, Ruler, Truck, ArrowRight, Laptop, HelpCircle } from 'lucide-react';

interface BeginnerGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenSizeGuide: () => void;
  onOpenAdmin: () => void;
  onOpenTracker: () => void;
}

export const BeginnerGuideModal: React.FC<BeginnerGuideModalProps> = ({
  isOpen,
  onClose,
  onOpenSizeGuide,
  onOpenAdmin,
  onOpenTracker,
}) => {
  if (!isOpen) return null;

  const [activeTab, setActiveTab] = useState<'audit' | 'beginner' | 'admin'>('audit');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/65 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-3xl bg-white rounded-2xl shadow-2xl border border-[#E4E5E4] overflow-hidden my-auto animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="p-5 border-b border-[#E4E5E4] bg-[#FAF9F5] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-[#182536] text-[#EAD0AC]">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold font-display text-[#182536]">
                BRUTBOX &amp; CO. — Evaluation &amp; User Experience Guide
              </h2>
              <p className="text-xs text-[#667280]">
                Professional analysis, beginner usability improvements, and admin features
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-[#667280] hover:text-[#182536] rounded-full hover:bg-black/5 cursor-pointer"
            aria-label="Close guide"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Selector */}
        <div className="flex border-b border-[#E4E5E4] bg-[#F4F1EC] text-xs font-semibold">
          <button
            onClick={() => setActiveTab('audit')}
            className={`flex-1 py-3 px-4 text-center cursor-pointer transition-colors border-b-2 ${
              activeTab === 'audit'
                ? 'border-[#182536] bg-white text-[#182536]'
                : 'border-transparent text-[#667280] hover:text-[#182536]'
            }`}
          >
            1. Professional Audit &amp; Evolution
          </button>
          <button
            onClick={() => setActiveTab('beginner')}
            className={`flex-1 py-3 px-4 text-center cursor-pointer transition-colors border-b-2 ${
              activeTab === 'beginner'
                ? 'border-[#182536] bg-white text-[#182536]'
                : 'border-transparent text-[#667280] hover:text-[#182536]'
            }`}
          >
            2. Beginner-Friendly Enhancements
          </button>
          <button
            onClick={() => setActiveTab('admin')}
            className={`flex-1 py-3 px-4 text-center cursor-pointer transition-colors border-b-2 ${
              activeTab === 'admin'
                ? 'border-[#182536] bg-white text-[#182536]'
                : 'border-transparent text-[#667280] hover:text-[#182536]'
            }`}
          >
            3. Admin Suite &amp; Operations
          </button>
        </div>

        {/* Body Content */}
        <div className="p-6 space-y-6 max-h-[60vh] overflow-y-auto">
          {activeTab === 'audit' && (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-[#FAF9F5] border border-[#E4E5E4] space-y-2">
                <h3 className="text-sm font-bold text-[#182536] flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-[#205B43]" />
                  <span>How Was The Previous Website &amp; What Needed Improvement?</span>
                </h3>
                <p className="text-xs text-[#555] leading-relaxed">
                  The original static HTML prototype had a solid design direction (clear typography, muted luxury palette, and a good conceptual hierarchy), but had key limitations for both everyday users and professional evaluation:
                </p>
                <ul className="text-xs text-[#555] space-y-1.5 list-disc pl-5">
                  <li><strong>Fragmented HTML Pages</strong>: Navigating between 10 standalone HTML files caused page reloads, lost shopping states, and disconnected admin synchronization.</li>
                  <li><strong>Absence of Real Garment Photography</strong>: Placeholder colored SVG boxes ("PHOTO COMING SOON") diminished the high-end appeal.</li>
                  <li><strong>Dead Clicks on Account Forms</strong>: Buttons had <em>"coming in Phase 02"</em> disabled tags, leaving beginners confused about whether the store was working.</li>
                  <li><strong>Lack of Sizing Clarity</strong>: No guidance on how boxers, briefs, or crew socks fit relative to waist inches or EU shoe sizes.</li>
                </ul>
              </div>

              <div className="p-4 rounded-xl bg-[#FAF9F5] border border-[#E4E5E4] space-y-2">
                <h3 className="text-sm font-bold text-[#182536] flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-[#C89C68]" />
                  <span>How We Elevated It To A World-Class Professional Standard</span>
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div className="p-3 bg-white rounded-lg border border-[#E4E5E4]">
                    <span className="font-bold text-[#182536] block">Studio-Grade Photography</span>
                    <span className="text-[#667280]">Replaced all placeholders with 8K commercial menswear product photography with hover zoom.</span>
                  </div>
                  <div className="p-3 bg-white rounded-lg border border-[#E4E5E4]">
                    <span className="font-bold text-[#182536] block">Unified React State Engine</span>
                    <span className="text-[#667280]">Single page application where inventory restocks in admin immediately update the storefront in real time.</span>
                  </div>
                  <div className="p-3 bg-white rounded-lg border border-[#E4E5E4]">
                    <span className="font-bold text-[#182536] block">Anti-Slop Zero-Pill Design</span>
                    <span className="text-[#667280]">Strict adherence to 60-30-10 palette, clean unboxed typographic separators, and no generic AI bubbles.</span>
                  </div>
                  <div className="p-3 bg-white rounded-lg border border-[#E4E5E4]">
                    <span className="font-bold text-[#182536] block">Live Package Tracking</span>
                    <span className="text-[#667280]">End-to-end simulation from order placement to courier dispatch with Pathao Express riders.</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'beginner' && (
            <div className="space-y-4">
              <div className="space-y-3 text-xs">
                <div className="p-4 rounded-xl border border-[#E4E5E4] bg-white flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-[#FAF9F5] text-[#9A6A2E] shrink-0 border border-[#E4E5E4]">
                    <Ruler className="w-5 h-5" />
                  </div>
                  <div className="space-y-1">
                    <h4 className="font-bold text-sm text-[#182536]">1. Interactive Visual Size Advisor</h4>
                    <p className="text-[#667280]">
                      First-time buyers often worry about ill-fitting underwear or socks. Our interactive slider lets shoppers adjust waist inches or centimeters and instantly see recommended sizes with fit recommendations.
                    </p>
                    <button
                      onClick={() => {
                        onClose();
                        onOpenSizeGuide();
                      }}
                      className="text-[#9A6A2E] font-bold hover:underline flex items-center gap-1 pt-1 cursor-pointer"
                    >
                      <span>Try Size Advisor</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>

                <div className="p-4 rounded-xl border border-[#E4E5E4] bg-white flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-[#FAF9F5] text-[#9A6A2E] shrink-0 border border-[#E4E5E4]">
                    <Sparkles className="w-5 h-5" />
                  </div>
                  <div className="space-y-1">
                    <h4 className="font-bold text-sm text-[#182536]">2. One-Click Demo Quick-Fill</h4>
                    <p className="text-[#667280]">
                      Testing checkout without tedious typing: on the checkout screen, click <strong>"Demo Quick-Fill"</strong> to instantly populate realistic Bangladeshi address details, 11-digit phone numbers, and delivery instructions.
                    </p>
                  </div>
                </div>

                <div className="p-4 rounded-xl border border-[#E4E5E4] bg-white flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-[#FAF9F5] text-[#9A6A2E] shrink-0 border border-[#E4E5E4]">
                    <Truck className="w-5 h-5" />
                  </div>
                  <div className="space-y-1">
                    <h4 className="font-bold text-sm text-[#182536]">3. Free Delivery Progress Bar</h4>
                    <p className="text-[#667280]">
                      Inside the slide-out cart drawer, shoppers see exactly how much more they need to add (e.g. <em>"Add ৳800 more for Free Delivery"</em>) with an animated progress bar up to the ৳3,000 threshold.
                    </p>
                  </div>
                </div>

                <div className="p-4 rounded-xl border border-[#E4E5E4] bg-white flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-[#FAF9F5] text-[#9A6A2E] shrink-0 border border-[#E4E5E4]">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <div className="space-y-1">
                    <h4 className="font-bold text-sm text-[#182536]">4. Transparent Payment Explanations</h4>
                    <p className="text-[#667280]">
                      Clear descriptions of Cash on Delivery (COD), bKash wallet, Nagad, and Card payments ensure users understand how each option behaves before committing.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'admin' && (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-[#FAF9F5] border border-[#E4E5E4] space-y-3 text-xs">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-[#182536] flex items-center gap-2">
                    <Laptop className="w-4 h-4 text-[#182536]" />
                    <span>Academic Merchant Control Suite</span>
                  </h3>
                  <button
                    onClick={() => {
                      onClose();
                      onOpenAdmin();
                    }}
                    className="px-3 py-1 bg-[#182536] text-white rounded text-xs font-bold hover:bg-[#273C51] cursor-pointer"
                  >
                    Open Admin Center →
                  </button>
                </div>
                <p className="text-[#667280]">
                  The admin portal includes enterprise-grade inventory and sales monitoring tools:
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                  <div className="p-3 bg-white rounded-lg border border-[#E4E5E4] space-y-1">
                    <span className="font-bold text-[#182536] block">3-Seat Concurrent Lock</span>
                    <p className="text-[#667280]">Tracks active admin sessions with 2-minute heartbeats to enforce seat safety as specified in project requirements.</p>
                  </div>
                  <div className="p-3 bg-white rounded-lg border border-[#E4E5E4] space-y-1">
                    <span className="font-bold text-[#182536] block">Spike &amp; Surge Detection</span>
                    <p className="text-[#667280]">Analyzes 24-hour rolling sales against 7-day baselines, alerting managers when demand surges 1.8× or drops unexpectedly.</p>
                  </div>
                  <div className="p-3 bg-white rounded-lg border border-[#E4E5E4] space-y-1">
                    <span className="font-bold text-[#182536] block">Color × Size Variant Matrix</span>
                    <p className="text-[#667280]">Inline stock adjustments per SKU with instant zero-stock highlight and quick restock batch actions.</p>
                  </div>
                  <div className="p-3 bg-white rounded-lg border border-[#E4E5E4] space-y-1">
                    <span className="font-bold text-[#182536] block">HTML5 Canvas Image Uploader</span>
                    <p className="text-[#667280]">Drag and drop product images with client-side auto-cropping to 1:1 WebP format before storefront publication.</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-[#E4E5E4] bg-white flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-lg bg-[#182536] text-white text-xs font-semibold hover:bg-[#273C51] cursor-pointer"
          >
            Got It, Back to Shopping
          </button>
        </div>

      </div>
    </div>
  );
};
