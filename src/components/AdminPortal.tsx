import React, { useState, useEffect, useRef } from 'react';
import { 
  X, LayoutDashboard, PlusCircle, PackageSearch, BarChart3, History, 
  LogOut, ShieldAlert, AlertTriangle, ArrowUpRight, TrendingUp, Download, 
  Upload, Check, Trash2, Eye, EyeOff, Sparkles, RefreshCw, Layers
} from 'lucide-react';
import { Product, Order, ActivityLogItem } from '../types';
import { 
  formatBDT, calculateTotalStock, detectSpikes, exportToCSV, 
  MAX_ADMIN_SEATS, logActivity, COLOR_SWATCHES, CATEGORIES 
} from '../data/store';

interface AdminPortalProps {
  isOpen: boolean;
  onClose: () => void;
  products: Product[];
  orders: Order[];
  onUpdateProducts: (newProducts: Product[]) => void;
  onUpdateOrders: (newOrders: Order[]) => void;
  initialTab?: 'dashboard' | 'products' | 'inventory' | 'upload' | 'reports' | 'activity';
}

const INVENTORY_SKUS = [
  { sku: 'CB-BLK-S', prodId: 'p-boxer', name: 'Cotton Boxer', size: 'S', color: 'Black', category: 'underwear' },
  { sku: 'CB-BLK-M', prodId: 'p-boxer', name: 'Cotton Boxer', size: 'M', color: 'Black', category: 'underwear' },
  { sku: 'CB-BLK-L', prodId: 'p-boxer', name: 'Cotton Boxer', size: 'L', color: 'Black', category: 'underwear' },
  { sku: 'CB-BLK-XL', prodId: 'p-boxer', name: 'Cotton Boxer', size: 'XL', color: 'Black', category: 'underwear' },
  { sku: 'BR-WHT-M', prodId: 'p-ribbed-boxer', name: 'Bamboo Ribbed Boxer', size: 'M', color: 'White', category: 'underwear' },
  { sku: 'BR-WHT-L', prodId: 'p-ribbed-boxer', name: 'Bamboo Ribbed Boxer', size: 'L', color: 'White', category: 'underwear' },
  { sku: 'BT-BLK-OS', prodId: 'p-bow-tie', name: 'Silk Bow Tie', size: 'One Size', color: 'Black', category: 'bow-ties' },
  { sku: 'PS-NVY-OS', prodId: 'p-pocket-square', name: 'Emerald Silk Pocket Square', size: 'One Size', color: 'Navy', category: 'pocket-squares' },
  { sku: 'CS-BLK-4043', prodId: 'p-merino-socks', name: 'Merino Wool Socks', size: '40-43', color: 'Charcoal', category: 'socks' },
  { sku: 'CS-BLK-4446', prodId: 'p-merino-socks', name: 'Merino Wool Socks', size: '44-46', color: 'Charcoal', category: 'socks' },
  { sku: 'EC-BLK-STD', prodId: 'p-glasses-case', name: 'Hard Eyeglass Case', size: 'Standard', color: 'Tan', category: 'accessories' },
  { sku: 'BW-BRN-STD', prodId: 'p-leather-wallet', name: 'Full-Grain Bifold Wallet', size: 'Standard', color: 'Cognac Brown', category: 'wallets' },
];

export const AdminPortal: React.FC<AdminPortalProps> = ({
  isOpen,
  onClose,
  products,
  orders,
  onUpdateProducts,
  onUpdateOrders,
  initialTab = 'dashboard',
}) => {
  if (!isOpen) return null;

  // Session & Authentication state
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return !!sessionStorage.getItem('bb_admin_token');
  });
  const [adminId, setAdminId] = useState('admin1');
  const [adminPassword, setAdminPassword] = useState('brut1234');
  const [loginError, setLoginError] = useState('');
  const [activeTab, setActiveTab] = useState<'dashboard' | 'upload' | 'products' | 'inventory' | 'reports' | 'activity'>(initialTab);

  useEffect(() => {
    if (initialTab) {
      setActiveTab(initialTab);
    }
  }, [initialTab]);

  // Restock and Bulk Edit State
  const [selectedProductId, setSelectedProductId] = useState<string>(products[0]?.id || '');
  const [selectedColor, setSelectedColor] = useState<string>('');
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [restockAmount, setRestockAmount] = useState<number>(10);
  const [bulkCategory, setBulkCategory] = useState<string>('all');
  const [bulkPercent, setBulkPercent] = useState<number>(10);
  const [toastMessage, setToastMessage] = useState<string>('');

  // Variant inventory tab state (from original inventory.html)
  const [invFilter, setInvFilter] = useState<'all' | 'underwear' | 'accessories' | 'low'>('all');
  const [invSelectedSku, setInvSelectedSku] = useState('CB-BLK-S');
  const [invAdjType, setInvAdjType] = useState('Restock shipment');
  const [invAdjQty, setInvAdjQty] = useState(20);
  const [invAdjReason, setInvAdjReason] = useState('Factory batch Q3 delivery');

  // Upload state
  const [newProdName, setNewProdName] = useState('');
  const [newProdCategory, setNewProdCategory] = useState<any>('underwear');
  const [newProdPrice, setNewProdPrice] = useState<number>(550);
  const [newProdColors, setNewProdColors] = useState('Black, Navy');
  const [newProdSizes, setNewProdSizes] = useState('S, M, L, XL');
  const [newProdImage, setNewProdImage] = useState<string | null>(null);
  const [newProdStock, setNewProdStock] = useState<Record<string, Record<string, number>>>({});
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Sync selected color and size when product changes
  useEffect(() => {
    const p = products.find(prod => prod.id === selectedProductId) || products[0];
    if (p) {
      setSelectedColor(p.colors[0] || 'Black');
      setSelectedSize(p.sizes[0] || 'M');
    }
  }, [selectedProductId, products]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3500);
  };

  // Login handler
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (adminId.trim() === 'admin1' && adminPassword === 'brut1234') {
      const token = Math.random().toString(36).slice(2) + Date.now().toString(36);
      sessionStorage.setItem('bb_admin_token', token);
      setIsAuthenticated(true);
      setLoginError('');
      logActivity('login', `Admin session authenticated (1 of ${MAX_ADMIN_SEATS} seats in use)`);
    } else {
      setLoginError('Invalid demo credentials. Use ID: admin1, Password: brut1234');
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem('bb_admin_token');
    setIsAuthenticated(false);
  };

  // Process image using HTML5 Canvas to 1000x1000 WebP/JPEG
  const handleFileProcess = (file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('Please upload a valid image file (JPG, PNG, WebP).');
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      const img = new Image();
      img.onload = () => {
        const size = 1000;
        const canvas = document.createElement('canvas');
        canvas.width = size;
        canvas.height = size;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(0, 0, size, size);

        const s = Math.min(img.width, img.height);
        const sx = (img.width - s) / 2;
        const sy = (img.height - s) / 2;
        ctx.drawImage(img, sx, sy, s, s, 0, 0, size, size);

        let url = canvas.toDataURL('image/webp', 0.85);
        if (!url.startsWith('data:image/webp')) {
          url = canvas.toDataURL('image/jpeg', 0.88);
        }
        setNewProdImage(url);
      };
      img.src = reader.result as string;
    };
    reader.readAsDataURL(file);
  };

  // Publish new product
  const handlePublishProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProdName.trim()) return alert('Please enter a product name.');
    if (!newProdImage) return alert('Please upload a product photo.');

    const colors = newProdColors.split(',').map(s => s.trim()).filter(Boolean);
    const sizes = newProdSizes.split(',').map(s => s.trim()).filter(Boolean);

    const generatedStock: Record<string, Record<string, number>> = {};
    colors.forEach(c => {
      generatedStock[c] = {};
      sizes.forEach(s => {
        generatedStock[c][s] = (newProdStock[c] && newProdStock[c][s] != null) ? newProdStock[c][s] : 10;
      });
    });

    const newProd: Product = {
      id: `p-${Date.now().toString(36)}`,
      name: newProdName.trim(),
      category: newProdCategory,
      price: Math.max(1, Math.floor(newProdPrice)),
      colors,
      sizes,
      stock: generatedStock,
      image: newProdImage,
      images: [newProdImage],
      description: `Premium curated ${newProdName} crafted for effortless everyday comfort and style.`,
      details: ['Natural fibers with ergonomic fit', 'Reinforced seams for extended longevity'],
      materials: 'Natural Cotton Blend',
      care: 'Machine wash cool (30°C) with like colors.',
      rating: 5.0,
      reviewsCount: 1,
      hidden: false,
      source: 'admin',
      createdAt: new Date().toISOString().slice(0, 10),
    };

    const updated = [newProd, ...products];
    onUpdateProducts(updated);
    logActivity('upload', `Published ${newProd.name} (৳${newProd.price}) with ${colors.length} colors and ${sizes.length} sizes`);
    showToast(`Published "${newProd.name}" to the live storefront.`);
    setNewProdName('');
    setNewProdImage(null);
    setActiveTab('products');
  };

  // Inline Stock change handler
  const handleStockChange = (productId: string, color: string, size: string, newStockVal: number) => {
    const updated = products.map(p => {
      if (p.id !== productId) return p;
      return {
        ...p,
        stock: {
          ...p.stock,
          [color]: {
            ...p.stock[color],
            [size]: Math.max(0, newStockVal),
          },
        },
      };
    });
    onUpdateProducts(updated);
    logActivity('restock', `Stock updated for ${productId} (${color}/${size}): ${newStockVal} units`);
  };

  // Quick Restock apply
  const handleQuickRestock = () => {
    if (restockAmount <= 0) return;
    const targetProd = products.find(p => p.id === selectedProductId);
    if (!targetProd) return;

    const currentVal = targetProd.stock[selectedColor]?.[selectedSize] || 0;
    handleStockChange(selectedProductId, selectedColor, selectedSize, currentVal + restockAmount);
    showToast(`Added +${restockAmount} to ${targetProd.name} (${selectedColor}/${selectedSize}).`);
  };

  // Inventory preview restock submit handler (from inventory.html)
  const handleInventoryRestockSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const item = INVENTORY_SKUS.find(s => s.sku === invSelectedSku);
    if (!item) return;
    const targetProd = products.find(p => p.id === item.prodId || p.name.toLowerCase().includes(item.name.toLowerCase()));
    if (!targetProd) return;

    const currentVal = targetProd.stock[item.color]?.[item.size] || 0;
    const delta = invAdjType.toLowerCase().includes('loss') || invAdjType.toLowerCase().includes('shrinkage')
      ? -Math.abs(invAdjQty)
      : Math.abs(invAdjQty);
    const newVal = Math.max(0, currentVal + delta);
    handleStockChange(targetProd.id, item.color, item.size, newVal);
    showToast(`Applied ${invAdjType} (${delta > 0 ? '+' : ''}${delta}) to SKU ${item.sku}. New stock: ${newVal}`);
    logActivity('restock', `${invAdjType}: SKU ${item.sku} (${item.name} · ${item.color}/${item.size}) -> ${newVal} units [Note: ${invAdjReason}]`);
  };

  // Bulk price modification
  const handleBulkPrice = (direction: 'up' | 'down') => {
    const factor = direction === 'up' ? 1 + bulkPercent / 100 : 1 - bulkPercent / 100;
    let modifiedCount = 0;

    const updated = products.map(p => {
      if (bulkCategory !== 'all' && p.category !== bulkCategory) return p;
      modifiedCount++;
      return {
        ...p,
        price: Math.max(50, Math.round(p.price * factor)),
      };
    });

    onUpdateProducts(updated);
    logActivity('price', `${direction === 'up' ? 'Increased' : 'Decreased'} prices by ${bulkPercent}% across ${modifiedCount} products`);
    showToast(`Updated prices for ${modifiedCount} products.`);
  };

  // Toggle Product Visibility
  const handleToggleVisibility = (productId: string) => {
    const updated = products.map(p => {
      if (p.id !== productId) return p;
      const willHide = !p.hidden;
      logActivity('visibility', `${willHide ? 'Hid' : 'Unhid'} product ${p.name}`);
      return { ...p, hidden: willHide };
    });
    onUpdateProducts(updated);
  };

  // Analytics Calculations
  const allOrders = orders;
  const totalRevenue = allOrders.reduce((sum, o) => sum + o.total, 0);
  const totalUnitsSold = allOrders.reduce((sum, o) => sum + o.items.reduce((s, i) => s + i.qty, 0), 0);
  const avgOrderValue = allOrders.length > 0 ? Math.round(totalRevenue / allOrders.length) : 0;
  const spikeAnalysis = detectSpikes(allOrders);

  // 14-day daily revenue data
  const DAY = 86400000;
  const now = Date.now();
  const dailyRevData = Array.from({ length: 14 }, (_, i) => {
    const dayStart = new Date(now - (13 - i) * DAY);
    dayStart.setHours(0, 0, 0, 0);
    const dayEnd = new Date(dayStart.getTime() + DAY);
    const dayOrders = allOrders.filter(o => {
      const t = Date.parse(o.createdAt);
      return t >= dayStart.getTime() && t < dayEnd.getTime();
    });
    const rev = dayOrders.reduce((sum, o) => sum + o.total, 0);
    return {
      label: dayStart.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' }),
      revenue: rev,
      ordersCount: dayOrders.length,
    };
  });
  const maxDayRevenue = Math.max(...dailyRevData.map(d => d.revenue), 1000);

  // Category revenue share
  const categorySales: Record<string, number> = {};
  allOrders.forEach(o => {
    o.items.forEach(item => {
      const prod = products.find(p => p.id === item.productId);
      const cat = prod?.category || 'underwear';
      categorySales[cat] = (categorySales[cat] || 0) + item.price * item.qty;
    });
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/75 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-6xl bg-[#EEF0F2] rounded-2xl shadow-2xl border border-[#CCD2D5] overflow-hidden my-auto flex flex-col max-h-[92vh] animate-in fade-in zoom-in-95 duration-200">
        
        {/* Top Bar */}
        <div className="p-4 sm:p-5 border-b border-[#CCD2D5] bg-[#182536] text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-[#C89C68] text-[#182536] font-bold">
              BB
            </div>
            <div>
              <div className="text-[10px] font-mono tracking-widest text-[#EAD0AC] uppercase">
                Enterprise Operations Portal
              </div>
              <h2 className="text-lg font-bold font-display text-white">
                Admin Control Center · Brutbox &amp; Co.
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {isAuthenticated && (
              <span className="hidden sm:inline-block font-mono text-xs bg-white/10 text-[#EAD0AC] px-3 py-1 rounded-full">
                Active Seats: 1 / {MAX_ADMIN_SEATS}
              </span>
            )}
            <button
              onClick={onClose}
              className="p-2 text-white/70 hover:text-white rounded-full hover:bg-white/10 cursor-pointer"
              aria-label="Close admin center"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Auth Gate if not logged in */}
        {!isAuthenticated ? (
          <div className="p-8 sm:p-12 flex-1 flex items-center justify-center">
            <div className="w-full max-w-md bg-white rounded-2xl p-6 sm:p-8 border border-[#CCD2D5] shadow-lg space-y-6">
              <div className="text-center space-y-1">
                <div className="text-[10px] font-mono font-bold tracking-widest text-[#9A6A2E] uppercase">
                  Staff Authentication
                </div>
                <h3 className="text-2xl font-bold font-display text-[#182536]">
                  Sign In to Admin
                </h3>
                <p className="text-xs text-[#667280]">
                  Academic demo login. Up to 3 admins can be signed in concurrently.
                </p>
              </div>

              {loginError && (
                <div className="p-3 rounded-lg bg-[#FDEEEE] border border-[#F0B4AD] text-[#B42318] text-xs font-semibold">
                  {loginError}
                </div>
              )}

              <form onSubmit={handleLogin} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-[#182536] uppercase tracking-wider mb-1">
                    Admin ID
                  </label>
                  <input
                    type="text"
                    value={adminId}
                    onChange={e => setAdminId(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-lg border border-[#CCD2D5] text-sm focus:border-[#C89C68] focus:outline-hidden"
                  />
                  <span className="text-[10px] text-[#667280] mt-1 block">Default demo ID: admin1</span>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#182536] uppercase tracking-wider mb-1">
                    Password
                  </label>
                  <input
                    type="password"
                    value={adminPassword}
                    onChange={e => setAdminPassword(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-lg border border-[#CCD2D5] text-sm focus:border-[#C89C68] focus:outline-hidden"
                  />
                  <span className="text-[10px] text-[#667280] mt-1 block">Default demo password: brut1234</span>
                </div>

                <button
                  type="submit"
                  className="w-full py-3 rounded-lg bg-[#182536] text-white text-xs font-bold hover:bg-[#273C51] cursor-pointer shadow-sm transition-all"
                >
                  Sign In to Dashboard
                </button>

                <div className="relative py-2 flex items-center justify-center">
                  <div className="border-t border-[#CCD2D5] w-full absolute" />
                  <span className="bg-[#FAF9F5] px-2 text-[10px] uppercase font-bold text-[#667280] relative">or Instant Access</span>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    sessionStorage.setItem('bb_admin_token', 'demo_admin_jwt_token_2026');
                    setIsAuthenticated(true);
                    logActivity('login', `Instant Demo Sign In as admin1`);
                  }}
                  className="w-full py-2.5 rounded-lg bg-[#EAD0AC] hover:bg-[#DFC29B] text-[#182536] text-xs font-bold flex items-center justify-center gap-2 cursor-pointer shadow-xs transition-all"
                >
                  <Sparkles className="w-3.5 h-3.5 text-[#A97B4A]" />
                  <span>⚡ Quick Demo Sign In (1-Click)</span>
                </button>
              </form>
            </div>
          </div>
        ) : (
          /* Authenticated Dashboard View */
          <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
            
            {/* Sidebar Navigation */}
            <aside className="w-full md:w-56 bg-white border-r border-[#CCD2D5] p-4 flex flex-col justify-between shrink-0">
              <nav className="space-y-1 text-xs font-semibold">
                <button
                  onClick={() => setActiveTab('dashboard')}
                  className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg transition-colors cursor-pointer text-left ${
                    activeTab === 'dashboard' ? 'bg-[#182536] text-white' : 'text-[#555] hover:bg-[#F4F1EC]'
                  }`}
                >
                  <LayoutDashboard className="w-4 h-4" />
                  <span>Dashboard</span>
                </button>

                <button
                  onClick={() => setActiveTab('products')}
                  className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg transition-colors cursor-pointer text-left ${
                    activeTab === 'products' ? 'bg-[#182536] text-white' : 'text-[#555] hover:bg-[#F4F1EC]'
                  }`}
                >
                  <PackageSearch className="w-4 h-4" />
                  <span>Products &amp; Stock</span>
                </button>

                <button
                  onClick={() => setActiveTab('inventory')}
                  className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg transition-colors cursor-pointer text-left ${
                    activeTab === 'inventory' ? 'bg-[#182536] text-white' : 'text-[#555] hover:bg-[#F4F1EC]'
                  }`}
                >
                  <Layers className="w-4 h-4" />
                  <span>Variant Inventory (inventory.html)</span>
                </button>

                <button
                  onClick={() => setActiveTab('upload')}
                  className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg transition-colors cursor-pointer text-left ${
                    activeTab === 'upload' ? 'bg-[#182536] text-white' : 'text-[#555] hover:bg-[#F4F1EC]'
                  }`}
                >
                  <PlusCircle className="w-4 h-4" />
                  <span>Upload Product</span>
                </button>

                <button
                  onClick={() => setActiveTab('reports')}
                  className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg transition-colors cursor-pointer text-left ${
                    activeTab === 'reports' ? 'bg-[#182536] text-white' : 'text-[#555] hover:bg-[#F4F1EC]'
                  }`}
                >
                  <BarChart3 className="w-4 h-4" />
                  <span>Sales &amp; Reports</span>
                </button>

                <button
                  onClick={() => setActiveTab('activity')}
                  className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg transition-colors cursor-pointer text-left ${
                    activeTab === 'activity' ? 'bg-[#182536] text-white' : 'text-[#555] hover:bg-[#F4F1EC]'
                  }`}
                >
                  <History className="w-4 h-4" />
                  <span>Activity Log</span>
                </button>
              </nav>

              <div className="pt-4 border-t border-[#CCD2D5] space-y-2">
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-2 px-3 py-2 text-xs font-semibold text-[#B42318] hover:bg-[#FDEEEE] rounded-lg cursor-pointer"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Sign Out</span>
                </button>
              </div>
            </aside>

            {/* Main Content View */}
            <main className="flex-1 p-5 sm:p-6 overflow-y-auto space-y-6">
              
              {/* Toast Notification */}
              {toastMessage && (
                <div className="p-3 bg-[#E4EFE8] border border-[#A9D3BF] text-[#205B43] rounded-lg text-xs font-bold flex items-center gap-2 animate-in fade-in">
                  <Check className="w-4 h-4" />
                  <span>{toastMessage}</span>
                </div>
              )}

              {/* 1. Dashboard Tab */}
              {activeTab === 'dashboard' && (
                <div className="space-y-6">
                  {/* Spike alert banner if triggered */}
                  <div className={`p-4 rounded-xl border flex items-center gap-3 text-xs font-semibold ${
                    spikeAnalysis.hasSpike
                      ? 'bg-[#FDEEEE] border-[#F0B4AD] text-[#B42318]'
                      : 'bg-white border-[#CCD2D5] text-[#182536]'
                  }`}>
                    {spikeAnalysis.hasSpike ? (
                      <AlertTriangle className="w-5 h-5 shrink-0 text-[#B42318]" />
                    ) : (
                      <TrendingUp className="w-5 h-5 shrink-0 text-[#205B43]" />
                    )}
                    <div className="flex-1">
                      <span className="font-bold">{spikeAnalysis.message}</span>
                      <div className="text-[11px] text-[#667280]">
                        Rolling 24h: {formatBDT(spikeAnalysis.rolling24h)} · 7-Day Daily Average: {formatBDT(spikeAnalysis.dailyAvg)}
                      </div>
                    </div>
                  </div>

                  {/* 6 KPI Cards */}
                  <div className="grid grid-cols-2 lg:grid-cols-3 gap-3.5">
                    <div className="p-4 rounded-xl bg-white border border-[#CCD2D5] shadow-xs">
                      <div className="text-[11px] font-mono uppercase text-[#667280]">All-Time Revenue</div>
                      <div className="text-xl font-bold font-mono text-[#182536] mt-1">{formatBDT(totalRevenue)}</div>
                      <div className="text-[11px] text-[#667280]">{allOrders.length} confirmed orders</div>
                    </div>
                    <div className="p-4 rounded-xl bg-white border border-[#CCD2D5] shadow-xs">
                      <div className="text-[11px] font-mono uppercase text-[#667280]">Units Sold</div>
                      <div className="text-xl font-bold font-mono text-[#182536] mt-1">{totalUnitsSold}</div>
                      <div className="text-[11px] text-[#667280]">Across 6 categories</div>
                    </div>
                    <div className="p-4 rounded-xl bg-white border border-[#CCD2D5] shadow-xs">
                      <div className="text-[11px] font-mono uppercase text-[#667280]">Avg Order Value</div>
                      <div className="text-xl font-bold font-mono text-[#182536] mt-1">{formatBDT(avgOrderValue)}</div>
                      <div className="text-[11px] text-[#667280]">Per checkout</div>
                    </div>
                    <div className="p-4 rounded-xl bg-white border border-[#CCD2D5] shadow-xs">
                      <div className="text-[11px] font-mono uppercase text-[#667280]">Live SKUs</div>
                      <div className="text-xl font-bold font-mono text-[#182536] mt-1">{products.length}</div>
                      <div className="text-[11px] text-[#667280]">{products.filter(p => !p.hidden).length} active in store</div>
                    </div>
                    <div className="p-4 rounded-xl bg-white border border-[#CCD2D5] shadow-xs">
                      <div className="text-[11px] font-mono uppercase text-[#667280]">Low Stock Alert</div>
                      <div className="text-xl font-bold font-mono text-[#9A6700] mt-1">
                        {products.filter(p => calculateTotalStock(p.stock) <= 6).length} Items
                      </div>
                      <div className="text-[11px] text-[#667280]">Needs immediate restock</div>
                    </div>
                    <div className="p-4 rounded-xl bg-white border border-[#CCD2D5] shadow-xs">
                      <div className="text-[11px] font-mono uppercase text-[#667280]">Active Admins</div>
                      <div className="text-xl font-bold font-mono text-[#205B43] mt-1">1 / {MAX_ADMIN_SEATS}</div>
                      <div className="text-[11px] text-[#667280]">2 seats available</div>
                    </div>
                  </div>

                  {/* 14-Day Sales Bar Chart */}
                  <div className="p-5 rounded-xl bg-white border border-[#CCD2D5] shadow-xs space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-bold font-display text-[#182536]">
                        Revenue Overview (Last 14 Days)
                      </h3>
                      <span className="text-xs text-[#667280]">Hover bars for details</span>
                    </div>

                    <div className="h-44 flex items-end gap-2 pt-6 pb-2 border-b border-[#CCD2D5]">
                      {dailyRevData.map((d, i) => {
                        const heightPercent = Math.max(8, Math.round((d.revenue / maxDayRevenue) * 100));
                        return (
                          <div key={i} className="flex-1 flex flex-col items-center gap-1 group relative">
                            {/* Bar Tooltip */}
                            <div className="opacity-0 group-hover:opacity-100 transition-opacity absolute -top-10 bg-[#182536] text-white text-[10px] py-1 px-2 rounded font-mono whitespace-nowrap z-10 pointer-events-none">
                              {d.label}: {formatBDT(d.revenue)} ({d.ordersCount} orders)
                            </div>
                            <div
                              className="w-full bg-[#182536] group-hover:bg-[#C89C68] rounded-t-sm transition-all"
                              style={{ height: `${heightPercent}%` }}
                            />
                            <span className="text-[9px] font-mono text-[#667280] truncate w-full text-center">
                              {d.label.split(' ')[0]}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}

              {/* 2. Products & Stock Matrix Tab */}
              {activeTab === 'products' && (
                <div className="space-y-6">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <h3 className="text-base font-bold font-display text-[#182536]">
                        Product Inventory &amp; Variant Matrix
                      </h3>
                      <p className="text-xs text-[#667280]">
                        Adjust stock directly per color and size. Changes sync immediately to the storefront.
                      </p>
                    </div>
                    <button
                      onClick={() => setActiveTab('upload')}
                      className="px-4 py-2 rounded-lg bg-[#182536] text-white text-xs font-bold hover:bg-[#273C51] cursor-pointer"
                    >
                      + Add New Product
                    </button>
                  </div>

                  {/* Restock & Bulk Price Accordions */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Quick Restock Widget */}
                    <div className="p-4 rounded-xl bg-white border border-[#CCD2D5] space-y-3">
                      <div className="text-xs font-bold text-[#182536] uppercase tracking-wider">
                        Quick Restock Single SKU
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <div>
                          <label className="block text-[11px] text-[#667280] mb-1">Product</label>
                          <select
                            value={selectedProductId}
                            onChange={e => setSelectedProductId(e.target.value)}
                            className="w-full p-2 rounded border border-[#CCD2D5] text-xs font-medium"
                          >
                            {products.map(p => (
                              <option key={p.id} value={p.id}>{p.name}</option>
                            ))}
                          </select>
                        </div>
                        <div>
                          <label className="block text-[11px] text-[#667280] mb-1">Color / Size</label>
                          <div className="flex gap-1">
                            <select
                              value={selectedColor}
                              onChange={e => setSelectedColor(e.target.value)}
                              className="w-1/2 p-2 rounded border border-[#CCD2D5] text-xs font-medium"
                            >
                              {(products.find(p => p.id === selectedProductId)?.colors || []).map(c => (
                                <option key={c} value={c}>{c}</option>
                              ))}
                            </select>
                            <select
                              value={selectedSize}
                              onChange={e => setSelectedSize(e.target.value)}
                              className="w-1/2 p-2 rounded border border-[#CCD2D5] text-xs font-medium"
                            >
                              {(products.find(p => p.id === selectedProductId)?.sizes || []).map(s => (
                                <option key={s} value={s}>{s}</option>
                              ))}
                            </select>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <input
                          type="number"
                          min="1"
                          value={restockAmount}
                          onChange={e => setRestockAmount(Number(e.target.value))}
                          className="w-24 p-2 rounded border border-[#CCD2D5] text-xs font-mono font-bold"
                        />
                        <button
                          onClick={handleQuickRestock}
                          className="flex-1 py-2 rounded bg-[#182536] text-white text-xs font-bold hover:bg-[#273C51] cursor-pointer"
                        >
                          Add Stock (+{restockAmount})
                        </button>
                      </div>
                    </div>

                    {/* Bulk Price Adjust Widget */}
                    <div className="p-4 rounded-xl bg-white border border-[#CCD2D5] space-y-3">
                      <div className="text-xs font-bold text-[#182536] uppercase tracking-wider">
                        Bulk Category Price Adjustment
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <div>
                          <label className="block text-[11px] text-[#667280] mb-1">Target Category</label>
                          <select
                            value={bulkCategory}
                            onChange={e => setBulkCategory(e.target.value)}
                            className="w-full p-2 rounded border border-[#CCD2D5] text-xs font-medium"
                          >
                            <option value="all">All Categories</option>
                            {CATEGORIES.map(c => (
                              <option key={c.slug} value={c.slug}>{c.name}</option>
                            ))}
                          </select>
                        </div>
                        <div>
                          <label className="block text-[11px] text-[#667280] mb-1">Percentage (%)</label>
                          <input
                            type="number"
                            min="1"
                            max="50"
                            value={bulkPercent}
                            onChange={e => setBulkPercent(Number(e.target.value))}
                            className="w-full p-2 rounded border border-[#CCD2D5] text-xs font-mono font-bold"
                          />
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleBulkPrice('up')}
                          className="flex-1 py-2 rounded bg-white border border-[#CCD2D5] text-[#182536] hover:bg-[#F4F1EC] text-xs font-bold cursor-pointer"
                        >
                          +{bulkPercent}% Increase
                        </button>
                        <button
                          onClick={() => handleBulkPrice('down')}
                          className="flex-1 py-2 rounded bg-white border border-[#CCD2D5] text-[#182536] hover:bg-[#F4F1EC] text-xs font-bold cursor-pointer"
                        >
                          -{bulkPercent}% Discount
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Product Cards and Matrix */}
                  <div className="space-y-4">
                    {products.map(product => {
                      const totalStock = calculateTotalStock(product.stock);
                      return (
                        <div
                          key={product.id}
                          className="p-4 rounded-xl bg-white border border-[#CCD2D5] shadow-xs space-y-3"
                        >
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#F0F0EE]">
                            <div className="flex items-center gap-3">
                              <img
                                src={product.image}
                                alt={product.name}
                                className="w-14 h-14 rounded-lg object-cover border border-[#CCD2D5]"
                              />
                              <div>
                                <h4 className="text-sm font-bold text-[#182536] font-display">
                                  {product.name}
                                </h4>
                                <div className="text-xs text-[#667280]">
                                  {product.category} · Price: {formatBDT(product.price)} · Total Stock: {totalStock} units
                                </div>
                              </div>
                            </div>

                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => handleToggleVisibility(product.id)}
                                className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 cursor-pointer border ${
                                  product.hidden
                                    ? 'bg-[#FDEEEE] border-[#F0B4AD] text-[#B42318]'
                                    : 'bg-white border-[#CCD2D5] text-[#182536] hover:bg-[#F4F1EC]'
                                }`}
                              >
                                {product.hidden ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                                <span>{product.hidden ? 'Hidden' : 'Visible'}</span>
                              </button>
                            </div>
                          </div>

                          {/* Variant Matrix Table */}
                          <div className="overflow-x-auto">
                            <table className="w-full text-left text-xs border-collapse">
                              <thead>
                                <tr className="border-b border-[#E4E5E4] text-[#667280]">
                                  <th className="py-2 px-3 font-semibold">Color</th>
                                  {product.sizes.map(s => (
                                    <th key={s} className="py-2 px-3 font-semibold text-center">{s}</th>
                                  ))}
                                </tr>
                              </thead>
                              <tbody className="divide-y divide-[#F0F0EE]">
                                {product.colors.map(color => (
                                  <tr key={color}>
                                    <td className="py-2 px-3 font-bold flex items-center gap-2">
                                      <span
                                        className="w-3 h-3 rounded-full border"
                                        style={{ backgroundColor: COLOR_SWATCHES[color] || '#888' }}
                                      />
                                      <span>{color}</span>
                                    </td>
                                    {product.sizes.map(size => {
                                      const stockVal = product.stock[color]?.[size] ?? 0;
                                      return (
                                        <td key={size} className="py-1 px-3 text-center">
                                          <input
                                            type="number"
                                            min="0"
                                            value={stockVal}
                                            onChange={e => handleStockChange(product.id, color, size, Number(e.target.value))}
                                            className={`w-16 p-1 text-center font-mono font-bold rounded border text-xs ${
                                              stockVal === 0
                                                ? 'bg-[#FDEEEE] border-[#F0B4AD] text-[#B42318]'
                                                : stockVal <= 5
                                                ? 'bg-[#FFF7E0] border-[#ECD08A] text-[#9A6700]'
                                                : 'bg-white border-[#CCD2D5] text-[#182536]'
                                            }`}
                                          />
                                        </td>
                                      );
                                    })}
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Variant Inventory Tab (Faithful modern recreation of inventory.html) */}
              {activeTab === 'inventory' && (
                <div className="space-y-6">
                  {/* Page Hero matching original inventory.html */}
                  <div className="p-5 rounded-xl bg-white border border-[#CCD2D5] shadow-xs space-y-3">
                    <p className="text-xs text-[#667280]">
                      <span className="text-[#182536] font-bold">Admin</span> / <span className="text-[#A97B4A] font-bold">Variant Inventory (inventory.html)</span>
                    </p>
                    <p className="text-[11px] font-bold uppercase tracking-widest text-[#A97B4A]">
                      STOCK &amp; VARIANTS / DESIGN PROTOTYPE
                    </p>
                    <h2 className="text-2xl font-bold font-display text-[#182536]">
                      Inventory overview.
                    </h2>
                    <p className="text-xs text-[#5D6974] leading-relaxed max-w-2xl">
                      Size-level stock tracking is one of our core ideas. In your original project, this was an HTML/CSS preview in <code className="px-1.5 py-0.5 bg-[#F4F1EC] rounded text-[#182536] font-mono text-[11px]">inventory.html</code> — here it is fully connected to live React state and interactive restocking.
                    </p>

                    <div className="p-3.5 rounded-lg bg-[#FAF9F5] border border-[#CCD2D5] flex items-start gap-3 text-xs text-[#182536]">
                      <Sparkles className="w-4 h-4 text-[#A97B4A] shrink-0 mt-0.5" />
                      <div>
                        <span className="font-bold uppercase tracking-wider text-[10px] text-[#A97B4A] block">
                          Phase 01 Prototype → Live Operational Engine
                        </span>
                        <span>
                          In your original static prototype, buttons and form fields illustrated how inventory adjustment would look. Now, every restock and stock change synchronously updates the customer storefront and cart validation in real-time.
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* 3 Stat Cards from original inventory.html */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="p-4 rounded-xl bg-white border border-[#CCD2D5] shadow-xs">
                      <span className="block text-xs font-semibold text-[#667280]">Sample products</span>
                      <strong className="text-2xl font-bold font-mono text-[#182536] block mt-1">
                        {String(products.length).padStart(2, '0')}
                      </strong>
                      <small className="text-[11px] text-[#A97B4A] font-semibold">6 categories</small>
                    </div>

                    <div className="p-4 rounded-xl bg-white border border-[#CCD2D5] shadow-xs">
                      <span className="block text-xs font-semibold text-[#667280]">Unique SKU variants</span>
                      <strong className="text-2xl font-bold font-mono text-[#182536] block mt-1">
                        12
                      </strong>
                      <small className="text-[11px] text-[#A97B4A] font-semibold">Separate sizes and colors</small>
                    </div>

                    <div className="p-4 rounded-xl bg-white border border-[#CCD2D5] shadow-xs">
                      <span className="block text-xs font-semibold text-[#667280]">Restock action</span>
                      <strong className="text-2xl font-bold font-mono text-[#205B43] block mt-1">
                        +{invAdjQty}
                      </strong>
                      <small className="text-[11px] text-[#667280]">Live interactive entry</small>
                    </div>
                  </div>

                  {/* Filter Toolbar */}
                  <div className="flex flex-wrap items-center justify-between gap-3 p-3 bg-white rounded-xl border border-[#CCD2D5]">
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => setInvFilter('all')}
                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition-colors ${
                          invFilter === 'all' ? 'bg-[#182536] text-white' : 'text-[#667280] hover:bg-[#F4F1EC]'
                        }`}
                      >
                        All 12 SKUs
                      </button>
                      <button
                        onClick={() => setInvFilter('underwear')}
                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition-colors ${
                          invFilter === 'underwear' ? 'bg-[#182536] text-white' : 'text-[#667280] hover:bg-[#F4F1EC]'
                        }`}
                      >
                        Underwear (6)
                      </button>
                      <button
                        onClick={() => setInvFilter('accessories')}
                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition-colors ${
                          invFilter === 'accessories' ? 'bg-[#182536] text-white' : 'text-[#667280] hover:bg-[#F4F1EC]'
                        }`}
                      >
                        Accessories (6)
                      </button>
                      <button
                        onClick={() => setInvFilter('low')}
                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition-colors ${
                          invFilter === 'low' ? 'bg-[#FFF7E0] text-[#9A6700] border border-[#ECD08A]' : 'text-[#667280] hover:bg-[#F4F1EC]'
                        }`}
                      >
                        Low Stock Alert (&le;5)
                      </button>
                    </div>

                    <a
                      href="#restock-form"
                      className="px-3 py-1.5 rounded-lg bg-[#FAF9F5] border border-[#CCD2D5] text-xs font-bold text-[#182536] hover:bg-[#F4F1EC] transition-colors"
                    >
                      Adjust Stock Form ↓
                    </a>
                  </div>

                  {/* 12 Sample SKU Rows Table (from inventory.html) */}
                  <div className="rounded-xl bg-white border border-[#CCD2D5] shadow-xs overflow-hidden">
                    <div className="p-4 border-b border-[#F0F0EE] flex items-center justify-between">
                      <div>
                        <h3 className="text-sm font-bold font-display text-[#182536]">
                          Variant inventory table
                        </h3>
                        <p className="text-xs text-[#667280]">
                          12 sample SKU rows with real-time stock steppers
                        </p>
                      </div>
                    </div>

                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-xs border-collapse">
                        <thead>
                          <tr className="bg-[#FAF9F5] border-b border-[#CCD2D5] text-[#182536] font-bold uppercase tracking-wider text-[11px]">
                            <th className="py-3 px-4">SKU</th>
                            <th className="py-3 px-4">Product</th>
                            <th className="py-3 px-3">Size</th>
                            <th className="py-3 px-3">Color</th>
                            <th className="py-3 px-4 text-center">Live Stock</th>
                            <th className="py-3 px-4">Availability</th>
                            <th className="py-3 px-4 text-right">Quick Restock</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-[#F0F0EE]">
                          {INVENTORY_SKUS.filter(item => {
                            if (invFilter === 'underwear') return item.category === 'underwear';
                            if (invFilter === 'accessories') return item.category !== 'underwear';
                            if (invFilter === 'low') {
                              const targetProd = products.find(p => p.id === item.prodId || p.name.toLowerCase().includes(item.name.toLowerCase()));
                              const currentVal = targetProd?.stock[item.color]?.[item.size] ?? 0;
                              return currentVal <= 5;
                            }
                            return true;
                          }).map(item => {
                            const targetProd = products.find(p => p.id === item.prodId || p.name.toLowerCase().includes(item.name.toLowerCase()));
                            const currentStock = targetProd?.stock[item.color]?.[item.size] ?? 0;
                            const isLow = currentStock > 0 && currentStock <= 5;
                            const isOut = currentStock === 0;

                            return (
                              <tr key={item.sku} className="hover:bg-[#FAF9F5] transition-colors">
                                <td className="py-3 px-4 font-mono font-bold text-[#182536]">
                                  {item.sku}
                                </td>
                                <td className="py-3 px-4 font-semibold text-[#182536]">
                                  {item.name}
                                </td>
                                <td className="py-3 px-3">
                                  <span className="px-2 py-0.5 rounded bg-[#F4F1EC] font-semibold text-[#182536] text-[11px]">
                                    {item.size}
                                  </span>
                                </td>
                                <td className="py-3 px-3 font-medium text-[#555]">
                                  <div className="flex items-center gap-1.5">
                                    <span
                                      className="w-2.5 h-2.5 rounded-full border border-black/10 shrink-0"
                                      style={{ backgroundColor: COLOR_SWATCHES[item.color] || '#555' }}
                                    />
                                    <span>{item.color}</span>
                                  </div>
                                </td>
                                <td className="py-3 px-4 text-center">
                                  <div className="inline-flex items-center border border-[#CCD2D5] rounded-lg overflow-hidden bg-white">
                                    <button
                                      onClick={() => {
                                        if (targetProd) {
                                          handleStockChange(targetProd.id, item.color, item.size, Math.max(0, currentStock - 1));
                                        }
                                      }}
                                      className="px-2 py-1 text-xs hover:bg-[#F4F1EC] text-[#555] cursor-pointer"
                                    >
                                      -
                                    </button>
                                    <span className={`w-12 py-1 text-center font-mono font-bold text-xs ${
                                      isOut ? 'text-[#B42318]' : isLow ? 'text-[#9A6700]' : 'text-[#182536]'
                                    }`}>
                                      {currentStock}
                                    </span>
                                    <button
                                      onClick={() => {
                                        if (targetProd) {
                                          handleStockChange(targetProd.id, item.color, item.size, currentStock + 1);
                                        }
                                      }}
                                      className="px-2 py-1 text-xs hover:bg-[#F4F1EC] text-[#555] cursor-pointer"
                                    >
                                      +
                                    </button>
                                  </div>
                                </td>
                                <td className="py-3 px-4">
                                  <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-bold ${
                                    isOut
                                      ? 'bg-[#FDEEEE] text-[#B42318]'
                                      : isLow
                                      ? 'bg-[#FFF7E0] text-[#9A6700]'
                                      : 'bg-[#E4EFE8] text-[#205B43]'
                                  }`}>
                                    {isOut ? 'Out of stock' : isLow ? 'Low stock' : 'In stock'}
                                  </span>
                                </td>
                                <td className="py-3 px-4 text-right">
                                  <div className="inline-flex items-center gap-1.5">
                                    <button
                                      onClick={() => {
                                        if (targetProd) {
                                          handleStockChange(targetProd.id, item.color, item.size, currentStock + 5);
                                          showToast(`Added +5 to ${item.sku}`);
                                        }
                                      }}
                                      className="px-2 py-1 rounded bg-[#F4F1EC] hover:bg-[#EAD0AC] text-[10px] font-bold text-[#182536] cursor-pointer"
                                    >
                                      +5
                                    </button>
                                    <button
                                      onClick={() => {
                                        if (targetProd) {
                                          handleStockChange(targetProd.id, item.color, item.size, currentStock + 20);
                                          showToast(`Added +20 to ${item.sku}`);
                                        }
                                      }}
                                      className="px-2 py-1 rounded bg-[#182536] hover:bg-[#273C51] text-[10px] font-bold text-white cursor-pointer"
                                    >
                                      +20
                                    </button>
                                  </div>
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* Restock Form Design (Reproduced from inventory.html #restock-preview) */}
                  <div id="restock-form" className="p-6 rounded-xl bg-white border border-[#CCD2D5] shadow-xs space-y-4">
                    <div>
                      <div className="text-[11px] font-bold uppercase tracking-widest text-[#A97B4A]">
                        RESTOCK PREVIEW FORM
                      </div>
                      <h3 className="text-base font-bold font-display text-[#182536]">
                        Stock adjustment preview
                      </h3>
                      <p className="text-xs text-[#667280]">
                        Submitting this form immediately adds units to the live inventory and records an entry in the Administrative Audit Trail.
                      </p>
                    </div>

                    <form onSubmit={handleInventoryRestockSubmit} className="space-y-4">
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div>
                          <label className="block text-xs font-bold text-[#182536] uppercase tracking-wider mb-1">
                            Product Variant SKU
                          </label>
                          <select
                            value={invSelectedSku}
                            onChange={e => setInvSelectedSku(e.target.value)}
                            className="w-full p-2.5 rounded-lg border border-[#CCD2D5] text-xs font-mono font-bold text-[#182536]"
                          >
                            {INVENTORY_SKUS.map(s => (
                              <option key={s.sku} value={s.sku}>
                                {s.sku} — {s.name} ({s.color} / {s.size})
                              </option>
                            ))}
                          </select>
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-[#182536] uppercase tracking-wider mb-1">
                            Adjustment Type
                          </label>
                          <select
                            value={invAdjType}
                            onChange={e => setInvAdjType(e.target.value)}
                            className="w-full p-2.5 rounded-lg border border-[#CCD2D5] text-xs font-medium text-[#182536]"
                          >
                            <option value="Restock shipment">Restock shipment (+)</option>
                            <option value="Customer return">Customer return (+)</option>
                            <option value="Shrinkage / Loss">Shrinkage / Loss (-)</option>
                            <option value="Inventory audit">Inventory audit correction</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-[#182536] uppercase tracking-wider mb-1">
                            Adjustment Quantity
                          </label>
                          <div className="flex items-center gap-2">
                            <input
                              type="number"
                              min="1"
                              max="500"
                              value={invAdjQty}
                              onChange={e => setInvAdjQty(Math.max(1, Number(e.target.value)))}
                              className="w-24 p-2.5 rounded-lg border border-[#CCD2D5] text-xs font-mono font-bold"
                            />
                            <div className="flex items-center gap-1">
                              {[10, 20, 50].map(n => (
                                <button
                                  key={n}
                                  type="button"
                                  onClick={() => setInvAdjQty(n)}
                                  className={`px-2 py-1.5 rounded text-[11px] font-bold cursor-pointer border ${
                                    invAdjQty === n
                                      ? 'bg-[#182536] text-white border-[#182536]'
                                      : 'bg-[#FAF9F5] text-[#182536] border-[#CCD2D5] hover:bg-[#F4F1EC]'
                                  }`}
                                >
                                  +{n}
                                </button>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-[#182536] uppercase tracking-wider mb-1">
                          Reason / Reference Note
                        </label>
                        <input
                          type="text"
                          value={invAdjReason}
                          onChange={e => setInvAdjReason(e.target.value)}
                          placeholder="e.g. PO-2026-DHAKA-04 delivery verified"
                          className="w-full p-2.5 rounded-lg border border-[#CCD2D5] text-xs"
                        />
                      </div>

                      <div className="pt-2 flex items-center justify-between gap-4">
                        <div className="text-xs text-[#667280]">
                          Target SKU: <span className="font-mono font-bold text-[#182536]">{invSelectedSku}</span>
                        </div>
                        <button
                          type="submit"
                          className="px-6 py-2.5 rounded-lg bg-[#182536] hover:bg-[#273C51] text-white text-xs font-bold cursor-pointer transition-all shadow-sm flex items-center gap-2"
                        >
                          <Check className="w-4 h-4 text-[#A9D3BF]" />
                          <span>Apply Restock Adjustment</span>
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              )}

              {/* 3. Upload Product Tab */}
              {activeTab === 'upload' && (
                <div className="p-6 rounded-xl bg-white border border-[#CCD2D5] shadow-xs space-y-6">
                  <div>
                    <h3 className="text-base font-bold font-display text-[#182536]">
                      Upload &amp; Crop New Product
                    </h3>
                    <p className="text-xs text-[#667280]">
                      Images are automatically cropped client-side to 1000 × 1000 px WebP format and published immediately.
                    </p>
                  </div>

                  <form onSubmit={handlePublishProduct} className="grid grid-cols-1 md:grid-cols-12 gap-6">
                    {/* Left: Drag Drop Area */}
                    <div className="md:col-span-5 space-y-3">
                      <div
                        onClick={() => fileInputRef.current?.click()}
                        className={`aspect-square w-full rounded-xl border-2 border-dashed flex flex-col items-center justify-center p-6 text-center cursor-pointer transition-all ${
                          newProdImage ? 'border-[#205B43] bg-[#E4EFE8]/20' : 'border-[#CCD2D5] bg-[#FAF9F5] hover:border-[#C89C68]'
                        }`}
                      >
                        {newProdImage ? (
                          <div className="relative w-full h-full rounded-lg overflow-hidden">
                            <img src={newProdImage} alt="Crop preview" className="w-full h-full object-cover" />
                            <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity text-white text-xs font-bold">
                              Click to change
                            </div>
                          </div>
                        ) : (
                          <>
                            <Upload className="w-8 h-8 text-[#A97B4A] mb-2" />
                            <span className="text-xs font-bold text-[#182536]">Drag &amp; drop photo here</span>
                            <span className="text-[11px] text-[#667280] mt-1">or click to browse local files</span>
                          </>
                        )}
                        <input
                          ref={fileInputRef}
                          type="file"
                          accept="image/*"
                          onChange={e => e.target.files?.[0] && handleFileProcess(e.target.files[0])}
                          className="hidden"
                        />
                      </div>
                      <p className="text-[11px] text-[#667280] text-center">
                        Auto-crops to square aspect ratio (1000×1000).
                      </p>
                    </div>

                    {/* Right: Product Spec Fields */}
                    <div className="md:col-span-7 space-y-4">
                      <div>
                        <label className="block text-xs font-bold text-[#182536] uppercase tracking-wider mb-1">
                          Product Title
                        </label>
                        <input
                          type="text"
                          required
                          value={newProdName}
                          onChange={e => setNewProdName(e.target.value)}
                          placeholder="e.g. Supima Cotton Polo"
                          className="w-full p-2.5 rounded-lg border border-[#CCD2D5] text-xs font-semibold focus:border-[#C89C68] focus:outline-hidden"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-bold text-[#182536] uppercase tracking-wider mb-1">
                            Category
                          </label>
                          <select
                            value={newProdCategory}
                            onChange={e => setNewProdCategory(e.target.value)}
                            className="w-full p-2.5 rounded-lg border border-[#CCD2D5] text-xs font-semibold"
                          >
                            {CATEGORIES.map(c => (
                              <option key={c.slug} value={c.slug}>{c.name}</option>
                            ))}
                          </select>
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-[#182536] uppercase tracking-wider mb-1">
                            Price (BDT)
                          </label>
                          <input
                            type="number"
                            min="10"
                            required
                            value={newProdPrice}
                            onChange={e => setNewProdPrice(Number(e.target.value))}
                            className="w-full p-2.5 rounded-lg border border-[#CCD2D5] text-xs font-mono font-bold"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-bold text-[#182536] uppercase tracking-wider mb-1">
                            Colors (Comma-separated)
                          </label>
                          <input
                            type="text"
                            value={newProdColors}
                            onChange={e => setNewProdColors(e.target.value)}
                            placeholder="Black, Navy, Grey"
                            className="w-full p-2.5 rounded-lg border border-[#CCD2D5] text-xs font-semibold"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-[#182536] uppercase tracking-wider mb-1">
                            Sizes (Comma-separated)
                          </label>
                          <input
                            type="text"
                            value={newProdSizes}
                            onChange={e => setNewProdSizes(e.target.value)}
                            placeholder="S, M, L, XL"
                            className="w-full p-2.5 rounded-lg border border-[#CCD2D5] text-xs font-semibold"
                          />
                        </div>
                      </div>

                      <div className="pt-4 border-t border-[#F0F0EE]">
                        <button
                          type="submit"
                          className="w-full py-3 rounded-lg bg-[#182536] text-white text-xs font-bold hover:bg-[#273C51] cursor-pointer shadow-sm"
                        >
                          Publish to Live Storefront
                        </button>
                      </div>
                    </div>
                  </form>
                </div>
              )}

              {/* 4. Sales Reports & CSV Export Tab */}
              {activeTab === 'reports' && (
                <div className="space-y-6">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <h3 className="text-base font-bold font-display text-[#182536]">
                        Sales Analytics &amp; Data Exports
                      </h3>
                      <p className="text-xs text-[#667280]">
                        Download structured CSV reports for Excel, Google Sheets, or local audit records.
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => {
                          const rows: (string | number)[][] = [
                            ['Order ID', 'Date', 'Customer', 'Phone', 'Item Name', 'Size', 'Color', 'Qty', 'Unit Price', 'Line Total', 'Payment', 'Status'],
                          ];
                          allOrders.forEach(o => {
                            o.items.forEach(it => {
                              rows.push([
                                o.id,
                                o.createdAt,
                                o.customer,
                                o.phone,
                                it.name,
                                it.size,
                                it.color,
                                it.qty,
                                it.price,
                                it.price * it.qty,
                                o.paymentMethod,
                                o.status,
                              ]);
                            });
                          });
                          exportToCSV('brutbox_orders_export.csv', rows);
                          logActivity('export', `Exported order records (${rows.length - 1} rows) to CSV`);
                          showToast('Downloaded brutbox_orders_export.csv');
                        }}
                        className="px-3.5 py-2 rounded-lg bg-white border border-[#CCD2D5] text-xs font-bold text-[#182536] hover:bg-[#F4F1EC] flex items-center gap-1.5 cursor-pointer"
                      >
                        <Download className="w-3.5 h-3.5 text-[#A97B4A]" />
                        <span>Export Orders CSV</span>
                      </button>

                      <button
                        onClick={() => {
                          const rows: (string | number)[][] = [
                            ['Product ID', 'Name', 'Category', 'Color', 'Size', 'Stock', 'Price BDT', 'Status'],
                          ];
                          products.forEach(p => {
                            Object.keys(p.stock).forEach(col => {
                              Object.keys(p.stock[col]).forEach(sz => {
                                rows.push([
                                  p.id,
                                  p.name,
                                  p.category,
                                  col,
                                  sz,
                                  p.stock[col][sz],
                                  p.price,
                                  p.hidden ? 'Hidden' : 'Live',
                                ]);
                              });
                            });
                          });
                          exportToCSV('brutbox_inventory_export.csv', rows);
                          logActivity('export', `Exported stock inventory (${rows.length - 1} variants) to CSV`);
                          showToast('Downloaded brutbox_inventory_export.csv');
                        }}
                        className="px-3.5 py-2 rounded-lg bg-white border border-[#CCD2D5] text-xs font-bold text-[#182536] hover:bg-[#F4F1EC] flex items-center gap-1.5 cursor-pointer"
                      >
                        <Download className="w-3.5 h-3.5 text-[#A97B4A]" />
                        <span>Export Stock CSV</span>
                      </button>
                    </div>
                  </div>

                  {/* Revenue by Category Breakdown */}
                  <div className="p-5 rounded-xl bg-white border border-[#CCD2D5] shadow-xs space-y-4">
                    <h4 className="text-sm font-bold text-[#182536]">
                      Revenue by Category
                    </h4>
                    <div className="space-y-2.5">
                      {CATEGORIES.map(cat => {
                        const amount = categorySales[cat.slug] || 0;
                        const pct = totalRevenue > 0 ? Math.round((amount / totalRevenue) * 100) : 0;
                        return (
                          <div key={cat.slug} className="space-y-1">
                            <div className="flex justify-between text-xs font-semibold">
                              <span className="text-[#182536]">{cat.name}</span>
                              <span className="font-mono text-[#667280]">{formatBDT(amount)} ({pct}%)</span>
                            </div>
                            <div className="w-full h-2 rounded-full bg-[#E4E5E4] overflow-hidden">
                              <div
                                className="h-full bg-[#182536] rounded-full"
                                style={{ width: `${pct}%` }}
                              />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Order History Table */}
                  <div className="p-5 rounded-xl bg-white border border-[#CCD2D5] shadow-xs space-y-3">
                    <h4 className="text-sm font-bold text-[#182536]">
                      Recent Customer Transactions ({allOrders.length})
                    </h4>
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-xs border-collapse">
                        <thead>
                          <tr className="border-b border-[#CCD2D5] text-[#667280]">
                            <th className="py-2 px-3 font-semibold">ID</th>
                            <th className="py-2 px-3 font-semibold">Date</th>
                            <th className="py-2 px-3 font-semibold">Customer</th>
                            <th className="py-2 px-3 font-semibold">Items</th>
                            <th className="py-2 px-3 font-semibold">Payment</th>
                            <th className="py-2 px-3 font-semibold">Total</th>
                            <th className="py-2 px-3 font-semibold">Status</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-[#F0F0EE]">
                          {allOrders.slice(0, 10).map(o => (
                            <tr key={o.id}>
                              <td className="py-2.5 px-3 font-mono font-bold">{o.id}</td>
                              <td className="py-2.5 px-3 text-[#667280]">{new Date(o.createdAt).toLocaleDateString()}</td>
                              <td className="py-2.5 px-3 font-medium">{o.customer}</td>
                              <td className="py-2.5 px-3 text-[#667280]">{o.items.length} items</td>
                              <td className="py-2.5 px-3 font-bold text-[#182536]">{o.paymentMethod}</td>
                              <td className="py-2.5 px-3 font-mono font-bold text-[#182536]">{formatBDT(o.total)}</td>
                              <td className="py-2.5 px-3">
                                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                                  o.status === 'Delivered'
                                    ? 'bg-[#E4EFE8] text-[#205B43]'
                                    : 'bg-[#FFF7E0] text-[#9A6700]'
                                }`}>
                                  {o.status}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}

              {/* 5. Activity Log Tab */}
              {activeTab === 'activity' && (
                <div className="p-6 rounded-xl bg-white border border-[#CCD2D5] shadow-xs space-y-4">
                  <div>
                    <h3 className="text-base font-bold font-display text-[#182536]">
                      Administrative Audit Trail
                    </h3>
                    <p className="text-xs text-[#667280]">
                      Chronological ledger tracking staff logins, stock alterations, price shifts, and data exports.
                    </p>
                  </div>

                  <div className="space-y-3">
                    {/* Simulated live activity items */}
                    <div className="p-3 rounded-lg bg-[#FAF9F5] border border-[#CCD2D5] text-xs flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-[#182536] uppercase text-[10px] bg-[#EAD0AC] px-2 py-0.5 rounded">
                          AUTH
                        </span>
                        <span>Admin session authenticated to Dhaka operations center</span>
                      </div>
                      <span className="text-[11px] font-mono text-[#667280]">Just now</span>
                    </div>

                    <div className="p-3 rounded-lg bg-[#FAF9F5] border border-[#CCD2D5] text-xs flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-[#182536] uppercase text-[10px] bg-[#E4EFE8] px-2 py-0.5 rounded">
                          RESTOCK
                        </span>
                        <span>Seeded 12 SKU variant matrices across 6 product lines</span>
                      </div>
                      <span className="text-[11px] font-mono text-[#667280]">2 hours ago</span>
                    </div>

                    <div className="p-3 rounded-lg bg-[#FAF9F5] border border-[#CCD2D5] text-xs flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-[#182536] uppercase text-[10px] bg-[#FDEEEE] px-2 py-0.5 rounded">
                          SYSTEM
                        </span>
                        <span>Spike detector initialized with rolling 24h analytical window</span>
                      </div>
                      <span className="text-[11px] font-mono text-[#667280]">1 day ago</span>
                    </div>
                  </div>
                </div>
              )}

            </main>
          </div>
        )}

      </div>
    </div>
  );
};
