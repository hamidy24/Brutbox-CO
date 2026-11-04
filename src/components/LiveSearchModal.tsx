import React, { useState, useMemo } from 'react';
import { X, Search, SlidersHorizontal, Check } from 'lucide-react';
import { Product, CategorySlug } from '../types';
import { formatBDT, calculateTotalStock } from '../data/store';

interface LiveSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  products: Product[];
  onSelectProduct: (product: Product) => void;
}

export const LiveSearchModal: React.FC<LiveSearchModalProps> = ({
  isOpen,
  onClose,
  products,
  onSelectProduct,
}) => {
  if (!isOpen) return null;

  const [query, setQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<CategorySlug | 'all'>('all');
  const [maxPrice, setMaxPrice] = useState<number>(2000);
  const [onlyInStock, setOnlyInStock] = useState(false);
  const [sortBy, setSortBy] = useState<'featured' | 'price-asc' | 'price-desc' | 'rating'>('featured');

  const filteredProducts = useMemo(() => {
    return products.filter(p => {
      if (p.hidden) return false;
      if (selectedCategory !== 'all' && p.category !== selectedCategory) return false;
      if (p.price > maxPrice) return false;
      if (onlyInStock && calculateTotalStock(p.stock) <= 0) return false;

      if (query.trim()) {
        const q = query.toLowerCase();
        const matchName = p.name.toLowerCase().includes(q);
        const matchDesc = p.description.toLowerCase().includes(q);
        const matchCat = p.category.toLowerCase().includes(q);
        const matchMaterial = p.materials.toLowerCase().includes(q);
        const matchColors = p.colors.some(c => c.toLowerCase().includes(q));
        if (!matchName && !matchDesc && !matchCat && !matchMaterial && !matchColors) {
          return false;
        }
      }

      return true;
    }).sort((a, b) => {
      if (sortBy === 'price-asc') return a.price - b.price;
      if (sortBy === 'price-desc') return b.price - a.price;
      if (sortBy === 'rating') return b.rating - a.rating;
      return 0;
    });
  }, [products, query, selectedCategory, maxPrice, onlyInStock, sortBy]);

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center p-3 sm:p-6 bg-black/65 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-3xl bg-white rounded-2xl shadow-2xl border border-[#E4E5E4] overflow-hidden my-6 sm:my-12 animate-in fade-in zoom-in-95 duration-200">
        
        {/* Search Input Bar */}
        <div className="p-4 sm:p-5 border-b border-[#E4E5E4] bg-[#FAF9F5] flex items-center gap-3">
          <Search className="w-5 h-5 text-[#9A6A2E] shrink-0" />
          <input
            type="text"
            autoFocus
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Search by product name, fabric, color, or style..."
            className="w-full bg-transparent border-none text-base sm:text-lg font-medium text-[#182536] placeholder:text-gray-400 focus:outline-hidden"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="p-1 text-gray-400 hover:text-gray-700 cursor-pointer text-xs"
            >
              Clear
            </button>
          )}
          <button
            onClick={onClose}
            className="p-2 text-[#667280] hover:text-[#182536] rounded-full hover:bg-black/5 cursor-pointer ml-1"
            aria-label="Close search"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Filter Controls Row */}
        <div className="px-5 py-3 border-b border-[#E4E5E4] bg-white flex flex-wrap items-center justify-between gap-3 text-xs">
          
          {/* Category Chips */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 max-w-full">
            {(['all', 'underwear', 'bow-ties', 'pocket-squares', 'socks', 'wallets', 'eyeglass-cases'] as const).map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-full font-medium whitespace-nowrap cursor-pointer transition-all ${
                  selectedCategory === cat
                    ? 'bg-[#182536] text-white'
                    : 'bg-[#F4F1EC] text-[#555] hover:bg-[#E4E5E4]'
                }`}
              >
                {cat === 'all' ? 'All' : cat.replace('-', ' ')}
              </button>
            ))}
          </div>

          {/* Sort & In-stock toggle */}
          <div className="flex items-center gap-4">
            <label className="flex items-center gap-1.5 cursor-pointer text-[#182536]">
              <input
                type="checkbox"
                checked={onlyInStock}
                onChange={e => setOnlyInStock(e.target.checked)}
                className="rounded text-[#182536] accent-[#182536]"
              />
              <span className="font-semibold">In Stock Only</span>
            </label>

            <select
              value={sortBy}
              onChange={e => setSortBy(e.target.value as any)}
              className="bg-[#F4F1EC] border border-[#CCD2D5] rounded-md px-2 py-1 text-xs font-semibold cursor-pointer"
            >
              <option value="featured">Sort: Featured</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="rating">Top Rated</option>
            </select>
          </div>
        </div>

        {/* Results Area */}
        <div className="max-h-[55vh] overflow-y-auto p-5">
          <div className="text-xs font-bold text-[#667280] mb-3 flex items-center justify-between">
            <span>{filteredProducts.length} {filteredProducts.length === 1 ? 'Product found' : 'Products found'}</span>
            <span>Max Price: {formatBDT(maxPrice)}</span>
          </div>

          {filteredProducts.length === 0 ? (
            <div className="p-12 text-center text-[#667280] space-y-2">
              <p className="text-sm font-semibold text-[#182536]">No essentials match your criteria.</p>
              <p className="text-xs">Try clearing search terms or selecting another category.</p>
              <button
                onClick={() => {
                  setQuery('');
                  setSelectedCategory('all');
                  setOnlyInStock(false);
                }}
                className="mt-2 text-xs font-bold text-[#9A6A2E] hover:underline cursor-pointer"
              >
                Reset all filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {filteredProducts.map(p => {
                const stock = calculateTotalStock(p.stock);
                return (
                  <div
                    key={p.id}
                    onClick={() => {
                      onClose();
                      onSelectProduct(p);
                    }}
                    className="flex gap-3 p-3 rounded-xl border border-[#E4E5E4] hover:border-[#C89C68] hover:bg-[#FAF9F5] transition-all cursor-pointer group"
                  >
                    <div className="w-18 h-18 rounded-lg overflow-hidden bg-[#F4F1EC] shrink-0 border border-[#E4E5E4]">
                      <img src={p.image} alt={p.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                    </div>

                    <div className="flex-1 flex flex-col justify-between">
                      <div>
                        <div className="text-[10px] text-[#A97B4A] uppercase font-bold tracking-wider">
                          {p.category.replace('-', ' ')}
                        </div>
                        <h4 className="text-sm font-bold text-[#182536] font-display line-clamp-1 group-hover:text-[#9A6A2E] transition-colors">
                          {p.name}
                        </h4>
                        <div className="text-[11px] text-[#667280] line-clamp-1">
                          {p.materials}
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-1">
                        <span className="font-mono font-bold text-xs text-[#182536]">
                          {formatBDT(p.price)}
                        </span>
                        <span className="text-[10px] font-mono text-gray-500">
                          {stock > 0 ? `${stock} units` : 'Sold out'}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
