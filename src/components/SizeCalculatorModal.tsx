import React, { useState } from 'react';
import { X, Ruler, CheckCircle2, Info, ArrowRight } from 'lucide-react';

interface SizeCalculatorModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialCategory?: string;
  onApplySize?: (size: string) => void;
}

export const SizeCalculatorModal: React.FC<SizeCalculatorModalProps> = ({
  isOpen,
  onClose,
  initialCategory = 'underwear',
  onApplySize,
}) => {
  const [unit, setUnit] = useState<'in' | 'cm'>('in');
  const [waist, setWaist] = useState<number>(32);
  const [categoryType, setCategoryType] = useState<string>(initialCategory);

  if (!isOpen) return null;

  // Calculate recommended size
  const calculateSize = (): { size: string; fitNote: string; rangeText: string } => {
    const waistInches = unit === 'in' ? waist : Math.round(waist / 2.54);

    if (categoryType === 'underwear') {
      if (waistInches <= 29) {
        return { size: 'S', fitNote: 'Snug everyday fit for 28–30 in waist', rangeText: '28" – 30"' };
      } else if (waistInches <= 33) {
        return { size: 'M', fitNote: 'Optimal tailored comfort for 31–33 in waist', rangeText: '31" – 33"' };
      } else if (waistInches <= 37) {
        return { size: 'L', fitNote: 'Relaxed non-binding fit for 34–37 in waist', rangeText: '34" – 37"' };
      } else {
        return { size: 'XL', fitNote: 'Spacious ergonomic fit for 38–41 in waist', rangeText: '38" – 41"' };
      }
    } else if (categoryType === 'socks') {
      return {
        size: waistInches < 34 ? '40–43' : '44–46',
        fitNote: 'Fits EU shoe sizes 40 to 43 (UK 6.5–9 / US 7–9.5)',
        rangeText: 'Standard Men',
      };
    } else {
      return {
        size: 'One Size',
        fitNote: 'Universal adjustable brass slider fits collar sizes 14.5" to 19"',
        rangeText: 'Universal fit',
      };
    }
  };

  const recommendation = calculateSize();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div className="relative w-full max-w-xl bg-white rounded-2xl shadow-2xl border border-[#E4E5E4] overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-[#E4E5E4] bg-[#FAF9F5]">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-[#182536] text-[#EAD0AC]">
              <Ruler className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold font-display text-[#182536]">
                Interactive Sizing Advisor
              </h3>
              <p className="text-xs text-[#667280]">
                Accurate fit calculator tailored for Bangladeshi and international standard cuts
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-[#667280] hover:text-[#182536] rounded-full hover:bg-black/5 cursor-pointer"
            aria-label="Close size advisor"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Category tabs */}
          <div className="flex items-center gap-2 p-1 bg-[#F4F1EC] rounded-lg">
            <button
              onClick={() => setCategoryType('underwear')}
              className={`flex-1 py-1.5 text-xs font-semibold rounded-md transition-all cursor-pointer ${
                categoryType === 'underwear'
                  ? 'bg-white text-[#182536] shadow-xs'
                  : 'text-[#667280] hover:text-[#182536]'
              }`}
            >
              Underwear / Boxers
            </button>
            <button
              onClick={() => setCategoryType('socks')}
              className={`flex-1 py-1.5 text-xs font-semibold rounded-md transition-all cursor-pointer ${
                categoryType === 'socks'
                  ? 'bg-white text-[#182536] shadow-xs'
                  : 'text-[#667280] hover:text-[#182536]'
              }`}
            >
              Merino Crew Socks
            </button>
            <button
              onClick={() => setCategoryType('accessories')}
              className={`flex-1 py-1.5 text-xs font-semibold rounded-md transition-all cursor-pointer ${
                categoryType === 'accessories'
                  ? 'bg-white text-[#182536] shadow-xs'
                  : 'text-[#667280] hover:text-[#182536]'
              }`}
            >
              Bow Ties &amp; Wallets
            </button>
          </div>

          {/* Unit Toggle and Slider */}
          {categoryType === 'underwear' && (
            <div className="space-y-4 bg-[#FAF9F5] p-4 rounded-xl border border-[#E4E5E4]">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-[#182536] uppercase tracking-wider">
                  Your Waist Measurement
                </label>
                <div className="flex items-center gap-1 text-xs">
                  <button
                    onClick={() => {
                      if (unit === 'cm') {
                        setUnit('in');
                        setWaist(Math.round(waist / 2.54));
                      }
                    }}
                    className={`px-2 py-0.5 rounded cursor-pointer ${
                      unit === 'in' ? 'bg-[#182536] text-white font-bold' : 'text-[#667280]'
                    }`}
                  >
                    Inches
                  </button>
                  <button
                    onClick={() => {
                      if (unit === 'in') {
                        setUnit('cm');
                        setWaist(Math.round(waist * 2.54));
                      }
                    }}
                    className={`px-2 py-0.5 rounded cursor-pointer ${
                      unit === 'cm' ? 'bg-[#182536] text-white font-bold' : 'text-[#667280]'
                    }`}
                  >
                    Centimeters
                  </button>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <input
                  type="range"
                  min={unit === 'in' ? 26 : 66}
                  max={unit === 'in' ? 44 : 112}
                  value={waist}
                  onChange={e => setWaist(Number(e.target.value))}
                  className="flex-1 accent-[#182536] cursor-pointer"
                />
                <div className="w-20 text-center font-mono font-bold text-lg text-[#182536] bg-white border border-[#E4E5E4] py-1 px-2 rounded-lg">
                  {waist} {unit}
                </div>
              </div>

              {/* Quick preset buttons */}
              <div className="flex items-center gap-2 pt-1 text-xs text-[#667280]">
                <span>Common Presets:</span>
                {[30, 32, 34, 36, 38].map(val => {
                  const displayVal = unit === 'in' ? val : Math.round(val * 2.54);
                  return (
                    <button
                      key={val}
                      onClick={() => setWaist(displayVal)}
                      className="px-2 py-0.5 rounded bg-white border border-[#E4E5E4] hover:border-[#C89C68] hover:text-[#182536] cursor-pointer font-mono"
                    >
                      {displayVal}{unit}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Recommendation Card */}
          <div className="p-5 rounded-xl bg-gradient-to-br from-[#182536] to-[#223349] text-white flex items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="text-[11px] font-semibold tracking-wider text-[#EAD0AC] uppercase flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Recommended Selection</span>
              </div>
              <div className="text-3xl font-extrabold font-display tracking-tight text-white flex items-baseline gap-2">
                <span>Size {recommendation.size}</span>
                <span className="text-xs font-mono text-[#D0D8E0]">({recommendation.rangeText})</span>
              </div>
              <p className="text-xs text-white/80">
                {recommendation.fitNote}
              </p>
            </div>

            {onApplySize && (
              <button
                onClick={() => {
                  onApplySize(recommendation.size);
                  onClose();
                }}
                className="px-4 py-2.5 rounded-lg bg-[#EAD0AC] text-[#182536] font-bold text-xs hover:bg-[#F4DFC4] active:scale-95 transition-all flex items-center gap-1.5 shrink-0 cursor-pointer"
              >
                <span>Apply Size</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Beginner Measuring Advice */}
          <div className="p-4 rounded-xl bg-[#FAF9F5] border border-[#E4E5E4] flex items-start gap-3 text-xs text-[#667280]">
            <Info className="w-4 h-4 text-[#A97B4A] shrink-0 mt-0.5" />
            <div className="space-y-1">
              <span className="font-bold text-[#182536] block">How to measure yourself accurately:</span>
              <p>
                Wrap a flexible measuring tape horizontally around your natural waistline (just above your hip bone), keeping one finger between your body and the tape. If between two sizes, we recommend sizing up for a more relaxed fit.
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-[#E4E5E4] bg-white flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-lg bg-[#182536] text-white text-xs font-semibold hover:bg-[#273C51] cursor-pointer"
          >
            Close Sizing Guide
          </button>
        </div>
      </div>
    </div>
  );
};
