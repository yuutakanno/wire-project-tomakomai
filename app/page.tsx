// @ts-nocheck
/* eslint-disable */
'use client';

import React, { useState, useEffect, useMemo } from 'react';

// ==========================================
//  設定・定数エリア
// ==========================================
const API_ENDPOINT = "https://script.google.com/macros/s/AKfycbyfYM8q6t7Q7UwIRORFBNOCA-mMpVFE1Z3oLzCJp5GNiYI9_CMy4767p9am2iMY70kl/exec";

// ランク定義 (会員ランクの魅力をここで定義)
const RANKS = [
  { id: 'GUEST', name: '一般 (未登録)', bonus: 0, color: 'text-gray-500', bg: 'bg-gray-100', icon: '👤' },
  { id: 'MEMBER', name: 'レギュラー', bonus: 20, color: 'text-blue-600', bg: 'bg-blue-50', icon: '💎' },
  { id: 'VIP', name: 'プラチナ', bonus: 50, color: 'text-amber-500', bg: 'bg-amber-50', icon: '👑' },
];

// アイコン
const IconChart = () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="20" x2="18" y2="10"></line><line x1="12" y1="20" x2="12" y2="4"></line><line x1="6" y1="20" x2="6" y2="14"></line></svg>;
const IconArrowUp = () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="19" x2="12" y2="5"></line><polyline points="5 12 12 5 19 12"></polyline></svg>;
const IconLock = () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>;
const IconMenu = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>;
const IconX = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>;
const IconCalculator = () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="4" y="2" width="16" height="20" rx="2"></rect><line x1="8" y1="6" x2="16" y2="6"></line><line x1="16" y1="14" x2="16" y2="18"></line><path d="M16 10h.01"></path><path d="M12 10h.01"></path><path d="M8 10h.01"></path><path d="M12 14h.01"></path><path d="M8 14h.01"></path><path d="M12 18h.01"></path><path d="M8 18h.01"></path></svg>;
const IconChevronDown = ({className}) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><polyline points="6 9 12 15 18 9"></polyline></svg>;


// --- SVG Chart Component (No external library needed) ---
const SimpleChart = ({ data, color = "#D32F2F" }) => {
  if (!data || data.length === 0) return null;
  const max = Math.max(...data.map(d => d.value));
  const min = Math.min(...data.map(d => d.value));
  const range = max - min;
  const height = 100;
  const width = 300; // viewBox width

  // Points generation
  const points = data.map((d, i) => {
    const x = (i / (data.length - 1)) * width;
    const y = height - ((d.value - min) / range) * height;
    return `${x},${y}`;
  }).join(' ');

  // Area fill path
  const fillPath = `${points} ${width},${height} 0,${height}`;

  return (
    <div className="w-full h-48 md:h-64 relative">
      <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-full overflow-visible" preserveAspectRatio="none">
        <defs>
          <linearGradient id="gradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor={color} stopOpacity="0.2" />
            <stop offset="100%" stopColor={color} stopOpacity="0" />
          </linearGradient>
        </defs>
        {/* Grid Lines */}
        <line x1="0" y1="0" x2={width} y2="0" stroke="#eee" strokeWidth="0.5" strokeDasharray="2" />
        <line x1="0" y1={height/2} x2={width} y2={height/2} stroke="#eee" strokeWidth="0.5" strokeDasharray="2" />
        <line x1="0" y1={height} x2={width} y2={height} stroke="#eee" strokeWidth="0.5" strokeDasharray="2" />
        
        {/* Chart */}
        <path d={`M${points}`} fill="none" stroke={color} strokeWidth="2" vectorEffect="non-scaling-stroke" />
        <path d={`M ${points} L ${width},${height} L 0,${height} Z`} fill="url(#gradient)" stroke="none" />
        
        {/* Tooltip-like dot on the last point */}
        <circle cx={width} cy={height - ((data[data.length-1].value - min) / range) * height} r="3" fill={color} />
      </svg>
      {/* Labels */}
      <div className="absolute top-0 right-0 bg-white/80 px-2 py-1 text-xs font-bold rounded shadow text-gray-600">Highest: ¥{max.toLocaleString()}</div>
      <div className="absolute bottom-0 left-0 bg-white/80 px-2 py-1 text-xs font-bold rounded shadow text-gray-600">Lowest: ¥{min.toLocaleString()}</div>
    </div>
  );
};

export default function LandingPage() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  // System State
  const [marketPrice, setMarketPrice] = useState(0); // Current Price
  const [chartData, setChartData] = useState([]); // Mock Chart Data
  const [products, setProducts] = useState([]);
  
  // User State
  const [user, setUser] = useState(null);
  const [loginModalOpen, setLoginModalOpen] = useState(false);
  const [loginId, setLoginId] = useState('');
  const [loginPw, setLoginPw] = useState('');
  
  // Simulator State
  const [isPosOpen, setIsPosOpen] = useState(false);
  const [cart, setCart] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [calcValue, setCalcValue] = useState('0');
  const [calcModalOpen, setCalcModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('loading');
  
  // The "Trap" State (Comparison)
  const [showMemberBenefit, setShowMemberBenefit] = useState(false);

  useEffect(() => {
    // Scroll Listener
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);

    // Initial Data Fetch
    const fetchSystemData = async () => {
      try {
        const [priceRes, productRes] = await Promise.all([
            fetch(`${API_ENDPOINT}?action=get_market_price`).catch(e => null),
            fetch(`${API_ENDPOINT}?action=get_products`).catch(e => null)
        ]);

        let currentPrice = 1350; // Default fallback
        if (priceRes && priceRes.ok) {
          const data = await priceRes.json();
          if (data && data.price) {
            currentPrice = Number(data.price);
            setMarketPrice(currentPrice);
          }
        }

        // Generate Realistic Chart Data based on current price
        const history = [];
        let p = currentPrice - 50; 
        for(let i=0; i<30; i++) {
            p = p + (Math.random() * 40 - 20);
            history.push({ date: i, value: Math.floor(p) });
        }
        history[history.length-1].value = currentPrice; // Ensure ends at current
        setChartData(history);

        if (productRes && productRes.ok) {
            const pData = await productRes.json();
            if (pData && pData.products) {
                setProducts(pData.products);
                if(pData.products.some(p => p.category.includes('かんたん'))) {
                   setActiveTab(pData.products.find(p => p.category.includes('かんたん')).category);
                } else if (pData.products.length > 0) {
                   setActiveTab(pData.products[0].category);
                }
            }
        }
      } catch (e) {
        console.warn("Data Fetch Error", e);
      }
    };

    fetchSystemData();

    const storedUser = localStorage.getItem('tsukisamu_user');
    if (storedUser) setUser(JSON.parse(storedUser));

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogin = async () => {
    try {
      const res = await fetch(`${API_ENDPOINT}?action=login&id=${loginId}&pw=${loginPw}`);
      const data = await res.json();
      if (data.success && data.user) {
        setUser(data.user);
        localStorage.setItem('tsukisamu_user', JSON.stringify(data.user));
        setLoginModalOpen(false);
      } else {
        alert('ID/PWが違います');
      }
    } catch (e) { alert('Login Error'); }
  };

  const handleLogout = () => {
    if(confirm('ログアウトしますか？')) {
      setUser(null);
      localStorage.removeItem('tsukisamu_user');
      setCart([]);
    }
  };

  // --- POS Logic ---
  const addToCart = () => {
    const w = parseFloat(calcValue);
    if(w > 0 && selectedProduct) {
      // Calculate guest price
      const baseUnit = Math.floor(marketPrice * (selectedProduct.ratio/100));
      
      setCart([...cart, { 
        ...selectedProduct, 
        weight: w, 
        unit: baseUnit, 
        subtotal: Math.floor(w * baseUnit) 
      }]);
      setCalcModalOpen(false);
      setCalcValue('0');
      setShowMemberBenefit(true); // Trigger the "Trap"
    }
  };

  const handleCalcInput = (v) => {
    if(v === '.' && calcValue.includes('.')) return;
    setCalcValue(prev => prev === '0' && v !== '.' ? v : prev + v);
  };

  const subTotal = cart.reduce((a,b) => a + b.subtotal, 0);
  const categories = Array.from(new Set(products.map(p => p.category))).sort();

  return (
    <div className="min-h-screen font-sans text-[#1a1a1a] bg-white">
      {/* Header */}
      <header className={`fixed top-0 w-full z-40 transition-all duration-300 border-b ${isScrolled ? 'bg-white/95 backdrop-blur shadow-md py-2' : 'bg-white py-4 border-transparent'}`}>
        <div className="container mx-auto px-4 md:px-6 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-[#D32F2F] rounded-lg flex items-center justify-center text-white font-black">月</div>
            <h1 className="text-xl font-bold tracking-tight text-[#1a1a1a] leading-none">TSUKISAMU<br/><span className="text-[10px] text-gray-500 font-normal tracking-widest">FACTORY OS</span></h1>
          </div>
          
          <nav className="hidden lg:flex items-center gap-6 text-sm font-bold text-[#1a1a1a]">
            <a href="#market" className="hover:text-[#D32F2F] transition-colors">相場チャート</a>
            <a href="#rank" className="hover:text-[#D32F2F] transition-colors">会員ランク</a>
            <a href="#process" className="hover:text-[#D32F2F] transition-colors">ご利用の流れ</a>
            
            {user ? (
              <div className="flex items-center gap-4 ml-4">
                <div className="text-right">
                  <div className="text-xs text-gray-500">{user.name} 様</div>
                  <button onClick={handleLogout} className="text-[10px] text-red-600 underline">ログアウト</button>
                </div>
                <button onClick={() => setIsPosOpen(true)} className="bg-[#1a1a1a] text-white px-5 py-2.5 rounded hover:bg-black transition-all flex items-center gap-2 shadow-lg">
                  <IconCalculator /> 会員POS
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-3 ml-4">
                <button onClick={() => setLoginModalOpen(true)} className="text-xs font-bold text-gray-500 hover:text-black">
                  パートナーログイン
                </button>
                <button onClick={() => setIsPosOpen(true)} className="bg-[#D32F2F] text-white px-6 py-2.5 rounded-full hover:bg-[#B71C1C] transition-all flex items-center gap-2 shadow-lg animate-pulse">
                  <IconCalculator /> 今すぐ査定する
                </button>
              </div>
            )}
          </nav>
          
          <button className="lg:hidden p-2 text-[#1a1a1a]" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>{mobileMenuOpen ? <IconX /> : <IconMenu />}</button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 px-4 bg-slate-900 text-white overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1605518216938-7c316318d6c4?auto=format&fit=crop&q=80')] bg-cover bg-center opacity-20"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/80 to-transparent"></div>
        
        <div className="container mx-auto relative z-10 grid md:grid-cols-2 gap-12 items-center">
          <div className="animate-in fade-in slide-in-from-bottom-8 duration-1000">
            <div className="inline-block px-3 py-1 bg-[#D32F2F]/20 text-[#D32F2F] border border-[#D32F2F]/50 rounded-full text-xs font-bold mb-6 tracking-wider">
              LIVE MARKET DATA
            </div>
            <h2 className="text-5xl md:text-7xl font-black tracking-tight mb-6 leading-tight">
              その電線に、<br/><span className="text-[#D32F2F]">正当な価値</span>を。
            </h2>
            <p className="text-lg text-slate-400 font-medium mb-8 leading-relaxed">
              JX金属建値連動のリアルタイム査定。<br/>
              ブラックボックス化した買取価格を、テクノロジーで透明化します。
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <button onClick={() => setIsPosOpen(true)} className="bg-white text-slate-900 px-8 py-4 rounded font-bold text-lg shadow-[0_0_20px_rgba(255,255,255,0.3)] hover:shadow-[0_0_30px_rgba(255,255,255,0.5)] transition-all flex items-center justify-center gap-2">
                <IconCalculator /> 買取シミュレーション
              </button>
              <div className="flex items-center gap-2 text-slate-500 px-4">
                <IconLock /> 登録不要で試せます
              </div>
            </div>
          </div>

          {/* Market Dashboard Teaser */}
          <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6 shadow-2xl animate-in fade-in slide-in-from-right-8 duration-1000 delay-200">
             <div className="flex justify-between items-end mb-4">
                <div>
                   <div className="text-xs text-slate-400 font-bold uppercase tracking-widest">Copper Market Price</div>
                   <div className="text-4xl font-black text-white flex items-center gap-2">
                     ¥{marketPrice.toLocaleString()} <span className="text-lg font-normal text-slate-500">/kg</span>
                   </div>
                </div>
                <div className="text-green-400 text-sm font-bold flex items-center gap-1 bg-green-400/10 px-2 py-1 rounded">
                   <IconArrowUp /> Realtime
                </div>
             </div>
             {/* Chart Component */}
             <SimpleChart data={chartData} color="#ef4444" />
             <div className="mt-4 pt-4 border-t border-white/10 text-xs text-slate-500 flex justify-between">
                <span>Source: JX Nippon Mining & Metals</span>
                <span>Updated: Today</span>
             </div>
          </div>
        </div>
      </section>

      {/* Rank System (The Hook) */}
      <section id="rank" className="py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
             <h2 className="text-3xl font-black text-[#1a1a1a] mb-4">会員ランクシステム</h2>
             <p className="text-gray-500">使えば使うほど、単価が上がる。<br/>月寒製作所だけのプロフェッショナル優待。</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
             {RANKS.map((rank) => (
               <div key={rank.id} className={`relative p-8 rounded-2xl border-2 ${rank.id === 'VIP' ? 'border-amber-400 shadow-xl scale-105 z-10' : 'border-gray-100 shadow-sm'} bg-white flex flex-col items-center text-center transition-all hover:-translate-y-2`}>
                  {rank.id === 'VIP' && <div className="absolute -top-4 bg-amber-500 text-white px-4 py-1 rounded-full text-xs font-bold tracking-widest">MOST POPULAR</div>}
                  <div className={`w-16 h-16 rounded-full ${rank.bg} flex items-center justify-center text-3xl mb-6 shadow-inner`}>
                     {rank.icon}
                  </div>
                  <h3 className="text-xl font-black text-[#1a1a1a] mb-2">{rank.name}</h3>
                  <div className="text-sm text-gray-500 mb-6 h-10">
                     {rank.id === 'GUEST' ? '登録不要ですぐに利用可能' : rank.id === 'MEMBER' ? '初回取引完了後に自動昇格' : '月間1t以上の取引でVIP待遇'}
                  </div>
                  <div className="w-full bg-gray-50 rounded-xl p-4 mb-4">
                     <div className="text-xs text-gray-400 font-bold uppercase mb-1">買取単価ボーナス</div>
                     <div className={`text-3xl font-black ${rank.color}`}>
                       {rank.bonus === 0 ? '±0' : `+${rank.bonus}`} <span className="text-sm text-gray-400 font-normal">円/kg</span>
                     </div>
                  </div>
                  {rank.id === 'GUEST' ? (
                     <span className="text-xs text-gray-400 font-bold mt-auto">現在のお客様</span>
                  ) : (
                     <div className="mt-auto text-xs font-bold text-[#D32F2F]">
                        年間 <span className="text-lg">約{((rank.bonus * 1000 * 12)/10000).toFixed(0)}万円</span> お得
                     </div>
                  )}
               </div>
             ))}
          </div>
        </div>
      </section>

      {/* POS Modal (The Fishing Rod) */}
      {isPosOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-end md:items-center justify-center p-0 md:p-4 animate-in fade-in duration-200">
          <div className="bg-white w-full md:max-w-6xl h-[95vh] md:h-[90vh] md:rounded-2xl shadow-2xl flex flex-col overflow-hidden relative">
            
            {/* Modal Header */}
            <div className="bg-[#1a1a1a] text-white p-4 flex justify-between items-center shrink-0">
                <div className="flex items-center gap-3">
                  <IconCalculator /> 
                  <span className="font-bold">{user ? `会員POS: ${user.name}` : '買取シミュレーター'}</span>
                </div>
                <div className="flex gap-4 items-center">
                   <div className="text-xs text-gray-400 bg-white/10 px-3 py-1 rounded-full">
                      本日建値: <span className="text-white font-bold">¥{marketPrice}</span>
                   </div>
                   <button onClick={() => setIsPosOpen(false)} className="bg-white/10 p-2 rounded hover:bg-white/20 transition-colors"><IconX /></button>
                </div>
            </div>
              
            <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
                {/* Left: Products Selector */}
                <div className="flex-1 flex flex-col bg-[#f8fafc] overflow-hidden relative">
                   <div className="p-3 overflow-x-auto whitespace-nowrap bg-white border-b shrink-0 shadow-sm z-10">
                      {categories.map(c => (
                        <button key={c} onClick={()=>setActiveTab(c)} className={`px-5 py-2 mx-1 rounded-full text-xs font-bold transition-all ${activeTab===c ? 'bg-[#1a1a1a] text-white shadow-lg scale-105':'bg-gray-100 text-gray-500 hover:bg-gray-200'}`}>{c}</button>
                      ))}
                   </div>
                   <div className="flex-1 overflow-y-auto p-4">
                     <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
                       {products.filter(p => p.category === activeTab).map(p => {
                          const unit = Math.floor(marketPrice * (p.ratio/100));
                          return (
                            <button key={p.id} onClick={() => { setSelectedProduct(p); setCalcModalOpen(true); }} className="bg-white p-4 rounded-xl shadow-sm border border-transparent hover:border-[#D32F2F] hover:shadow-md transition-all text-left group">
                               <div className="flex justify-between items-start mb-2">
                                  <div className="text-sm font-bold text-gray-700 group-hover:text-[#D32F2F]">{p.name}</div>
                                  <span className="text-[10px] bg-gray-100 text-gray-500 px-1.5 py-0.5 rounded">{p.tag}</span>
                               </div>
                               <div className="text-xl font-black text-[#1a1a1a]">¥{unit.toLocaleString()}</div>
                               <div className="text-[10px] text-gray-400 mt-1">{p.desc}</div>
                            </button>
                          )
                       })}
                     </div>
                   </div>
                </div>

                {/* Right: Cart & The Trap */}
                <div className="w-full md:w-96 bg-white border-l flex flex-col z-20 shadow-xl h-[45%] md:h-auto">
                   
                   {/* 1. Cart List */}
                   <div className="flex-1 overflow-y-auto p-4 space-y-3">
                     {cart.length === 0 ? (
                       <div className="h-full flex flex-col items-center justify-center text-gray-300">
                          <IconChart />
                          <span className="text-xs mt-2">品目を選択して計算</span>
                       </div>
                     ) : (
                       cart.map((item, i) => (
                         <div key={i} className="flex justify-between items-center text-sm border-b border-dashed pb-2">
                            <div>
                              <span className="font-bold block text-gray-700">{item.name}</span>
                              <span className="text-xs text-gray-400">{item.weight}kg × @{item.unit}</span>
                            </div>
                            <div className="font-bold text-[#1a1a1a]">¥{item.subtotal.toLocaleString()}</div>
                         </div>
                       ))
                     )}
                   </div>

                   {/* 2. The Trap (Benefit Visualization) */}
                   {cart.length > 0 && !user && (
                     <div className="bg-amber-50 p-4 border-t border-amber-100 animate-in slide-in-from-bottom-4">
                        <div className="flex justify-between text-xs mb-1">
                           <span className="text-gray-500">一般価格 (Guest):</span>
                           <span className="font-bold">¥{subTotal.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between items-center">
                           <span className="text-sm font-bold text-amber-700 flex items-center gap-1"><span className="text-lg">👑</span> 会員価格なら:</span>
                           {/* 仮に会員だと単価+20円で計算 */}
                           <span className="text-xl font-black text-amber-600">
                              ¥{(cart.reduce((a,b) => a + (b.weight * (b.unit + 20)), 0)).toLocaleString()}
                           </span>
                        </div>
                        <div className="text-[10px] text-amber-600/70 text-right mt-1 font-bold">
                           差額: ¥{(cart.reduce((a,b) => a + (b.weight * 20), 0)).toLocaleString()} お得！
                        </div>
                     </div>
                   )}

                   {/* 3. Total & Action */}
                   <div className="p-6 bg-[#1a1a1a] text-white shrink-0">
                      <div className="flex justify-between items-end mb-6">
                        <span className="text-sm text-gray-400">お支払い予定額</span>
                        <span className="text-4xl font-black tracking-tight">¥{subTotal.toLocaleString()}</span>
                      </div>
                      
                      {!user ? (
                        <div className="space-y-3">
                          <button onClick={() => alert("初回取引のため、この内容で仮IDを発行します。\n受付でこの画面を提示してください。")} className="w-full bg-[#D32F2F] hover:bg-[#B71C1C] text-white py-4 rounded-xl font-bold shadow-lg transition-all transform active:scale-95 flex items-center justify-center gap-2">
                             買取申込 & ID発行
                          </button>
                          <p className="text-[10px] text-center text-gray-500">
                             ※初回取引完了後、レシートのQRコードから<br/>会員登録(無料)を行うとランクが適用されます。
                          </p>
                        </div>
                      ) : (
                        <button onClick={() => alert("データ送信完了")} className="w-full bg-blue-600 hover:bg-blue-500 text-white py-4 rounded-xl font-bold shadow-lg">
                           取引確定 (会員)
                        </button>
                      )}
                   </div>
                </div>
              </div>

              {/* Calculator Overlay */}
              {calcModalOpen && (
                <div className="absolute inset-0 z-30 bg-black/20 backdrop-blur-[1px] flex items-center justify-center p-4">
                  <div className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-xs animate-in zoom-in duration-200">
                      <div className="text-center mb-6">
                        <div className="text-sm text-gray-500 mb-1">重量を入力 (kg)</div>
                        <div className="text-lg font-bold text-[#1a1a1a]">{selectedProduct?.name}</div>
                      </div>
                      <div className="bg-gray-100 p-4 rounded-xl mb-6 text-right text-4xl font-mono font-black tracking-tight border border-gray-200 shadow-inner">
                        {calcValue}<span className="text-sm text-gray-400 ml-2 font-sans font-normal">kg</span>
                      </div>
                      <div className="grid grid-cols-3 gap-3 mb-6">
                        {[7,8,9,4,5,6,1,2,3,0,'.'].map(n => (
                          <button key={n} onClick={()=>handleCalcInput(n.toString())} className="h-14 bg-white border border-gray-200 rounded-xl font-bold text-xl hover:bg-gray-50 shadow-sm active:translate-y-0.5 transition-all">{n}</button>
                        ))}
                        <button onClick={()=>setCalcValue('0')} className="h-14 bg-red-50 text-red-600 border border-red-100 rounded-xl font-bold shadow-sm active:translate-y-0.5">C</button>
                      </div>
                      <div className="flex gap-3">
                        <button onClick={()=>setCalcModalOpen(false)} className="flex-1 py-4 bg-gray-100 rounded-xl font-bold text-gray-600 hover:bg-gray-200">戻る</button>
                        <button onClick={addToCart} className="flex-1 py-4 bg-[#1a1a1a] text-white rounded-xl font-bold shadow-lg hover:bg-black">決定</button>
                      </div>
                  </div>
                </div>
              )}
          </div>
        </div>
      )}

      {/* Login Modal */}
      {loginModalOpen && (
        <div className="fixed inset-0 z-[60] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-sm relative">
            <button onClick={() => setLoginModalOpen(false)} className="absolute top-4 right-4 text-gray-400 hover:text-black"><IconX /></button>
            <h3 className="text-xl font-black text-center mb-2">PARTNER LOGIN</h3>
            <p className="text-xs text-center text-gray-400 mb-8">登録済みのパートナーIDを入力してください</p>
            <div className="space-y-4">
              <div>
                <label className="text-xs font-bold text-gray-500 ml-1">ID</label>
                <input type="text" className="w-full p-4 border border-gray-200 rounded-xl bg-gray-50 focus:border-black outline-none transition-colors" value={loginId} onChange={e=>setLoginId(e.target.value)} />
              </div>
              <div>
                <label className="text-xs font-bold text-gray-500 ml-1">PASSWORD</label>
                <input type="password" className="w-full p-4 border border-gray-200 rounded-xl bg-gray-50 focus:border-black outline-none transition-colors" value={loginPw} onChange={e=>setLoginPw(e.target.value)} />
              </div>
              <button onClick={handleLogin} className="w-full bg-[#1a1a1a] text-white py-4 rounded-xl font-bold hover:bg-black transition-colors shadow-lg mt-4">ログイン</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
