import React from 'react';
import { ArrowUpRight, Compass, ShieldCheck, Truck, RefreshCw, Ruler } from 'lucide-react';
import { CategorySlug } from '../types';
import { CATEGORIES } from '../data/store';

interface HeroProps {
  onExplore: () => void;
  onOpenSizeGuide: () => void;
  onOpenGuide: () => void;
  onSelectCategory: (category: CategorySlug) => void;
}

export const Hero: React.FC<HeroProps> = ({
  onExplore,
  onOpenSizeGuide,
  onOpenGuide,
  onSelectCategory,
}) => {
  return (
    <section className="relative overflow-hidden bg-[#182536] text-white">
      {/* Background ambient lighting */}
      <div className="absolute inset-0 bg-gradient-to-r from-[#182536] via-[#182536]/90 to-transparent z-10 pointer-events-none md:w-3/5" />
      
      <div className="max-w-[1240px] mx-auto px-4 sm:px-6 py-12 md:py-20 relative z-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* Left Column: Hero Narrative */}
          <div className="lg:col-span-7 space-y-6">
            <div className="flex items-center gap-2 text-xs font-semibold tracking-widest text-[#EAD0AC] uppercase">
              <span>The Everyday Edit</span>
              <span aria-hidden="true">·</span>
              <span>2026 Collection</span>
              <span aria-hidden="true">·</span>
              <span>Dhaka, BD</span>
            </div>

            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight font-display leading-[1.08] text-balance">
              Modern essentials. <br />
              <span className="italic font-normal text-[#EAD0AC]">Timeless details.</span>
            </h1>

            <p className="text-base sm:text-lg text-[#D0D8E0] max-w-xl font-normal leading-relaxed">
              From breathable organic cotton daily basics to hand-finished Mulberry silk bow ties and full-grain leather goods. A cleaner, more considered way to dress every day.
            </p>

            {/* CTAs */}
            <div className="pt-2 flex flex-wrap items-center gap-3 sm:gap-4">
              <button
                onClick={onExplore}
                className="px-6 py-3.5 rounded-lg bg-[#EAD0AC] text-[#182536] font-bold text-sm hover:bg-[#F4DFC4] active:scale-95 transition-all flex items-center gap-2 cursor-pointer shadow-sm"
              >
                <span>Shop The Collection</span>
                <ArrowUpRight className="w-4 h-4" />
              </button>

              <button
                onClick={onOpenSizeGuide}
                className="px-5 py-3.5 rounded-lg border border-white/20 text-white font-medium text-sm hover:bg-white/10 active:scale-95 transition-all flex items-center gap-2 cursor-pointer"
              >
                <Ruler className="w-4 h-4 text-[#C89C68]" />
                <span>Find Your Size</span>
              </button>

              <button
                onClick={onOpenGuide}
                className="px-4 py-3.5 text-xs text-[#EAD0AC] hover:text-white transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <Compass className="w-3.5 h-3.5" />
                <span>Beginner Overview</span>
              </button>
            </div>

            {/* Micro Quantitative Trust Line */}
            <div className="pt-4 border-t border-white/10 flex items-center gap-6 text-xs text-[#BFC8D1]">
              <div className="flex items-baseline gap-1.5">
                <span className="text-xl font-bold font-display text-[#EAD0AC]">06</span>
                <span className="text-[11px] uppercase tracking-wider text-[#9AA5B4]">Curated Lines</span>
              </div>
              <span className="text-white/20">|</span>
              <div className="flex items-baseline gap-1.5">
                <span className="text-xl font-bold font-display text-[#EAD0AC]">100%</span>
                <span className="text-[11px] uppercase tracking-wider text-[#9AA5B4]">Natural Fibers</span>
              </div>
              <span className="text-white/20">|</span>
              <div className="flex items-baseline gap-1.5">
                <span className="text-xl font-bold font-display text-[#EAD0AC]">৳0</span>
                <span className="text-[11px] uppercase tracking-wider text-[#9AA5B4]">Free Shipping 3K+</span>
              </div>
            </div>
          </div>

          {/* Right Column: Hero High-Res Imagery */}
          <div className="lg:col-span-5">
            <div className="relative rounded-2xl overflow-hidden aspect-[4/3] lg:aspect-square shadow-2xl border border-white/10 group">
              <img
                src="/src/assets/images/hero_mens_editorial_1793796879372.jpg"
                alt="Brutbox luxury folded menswear and brass accessories"
                className="w-full h-full object-cover object-center group-hover:scale-102 transition-transform duration-700"
                loading="eager"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent flex items-end p-6">
                <div>
                  <div className="text-[10px] uppercase tracking-widest text-[#EAD0AC] font-bold">
                    Signature Palette
                  </div>
                  <div className="text-lg font-bold font-display text-white">
                    Understated Oxford &amp; Slate Neutrals
                  </div>
                  <p className="text-xs text-white/80 mt-1">
                    Carefully chosen natural tones designed to pair seamlessly with blazers, knitwear, and denim.
                  </p>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Editorial Promise Strip */}
      <div className="bg-[#111D2B] border-t border-white/10 py-3.5 px-4 text-xs">
        <div className="max-w-[1240px] mx-auto flex flex-wrap items-center justify-around gap-4 text-[#B5C0CD] font-medium">
          <div className="flex items-center gap-2">
            <Truck className="w-4 h-4 text-[#C89C68]" />
            <span>Fast Dispatch across Bangladesh (COD Available)</span>
          </div>
          <div className="flex items-center gap-2">
            <RefreshCw className="w-4 h-4 text-[#C89C68]" />
            <span>7-Day Easy Sizing Exchange Guarantee</span>
          </div>
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-[#C89C68]" />
            <span>Safe Mobile Wallet &amp; Card Gateway</span>
          </div>
        </div>
      </div>

      {/* Category Navigation Bar */}
      <div className="bg-[#FAF9F5] text-[#182536] py-8 border-b border-[#E4E5E4]">
        <div className="max-w-[1240px] mx-auto px-4 sm:px-6">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6">
            <div>
              <div className="text-xs font-bold uppercase tracking-widest text-[#9A6A2E]">
                Shop By Essential
              </div>
              <h2 className="text-2xl font-bold font-display text-[#182536] mt-0.5">
                Everyday Curation
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-[#667280] max-w-md">
              Tap any category to focus your catalog view. Designed for straightforward selection without clutter.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
            {CATEGORIES.map(cat => (
              <button
                key={cat.slug}
                onClick={() => onSelectCategory(cat.slug)}
                className="p-4 rounded-xl border border-[#E4E5E4] bg-white hover:border-[#C89C68] hover:bg-[#FDFBF7] hover:-translate-y-1 transition-all text-left group cursor-pointer shadow-xs"
              >
                <div className="text-[10px] font-mono text-[#9A6A2E] font-semibold uppercase">
                  {cat.slug.replace('-', ' ')}
                </div>
                <div className="font-bold font-display text-sm sm:text-base text-[#182536] mt-1 group-hover:text-[#9A6A2E] transition-colors">
                  {cat.name}
                </div>
                <div className="text-[11px] text-[#667280] mt-1 line-clamp-1">
                  {cat.sizes.join(' · ')}
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
