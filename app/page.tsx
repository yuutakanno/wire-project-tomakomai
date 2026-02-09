// @ts-nocheck
/* eslint-disable */
'use client';

import React, { useState, useEffect } from 'react';

// ==========================================
//  設定・データ定義
// ==========================================
const API_ENDPOINT = "https://script.google.com/macros/s/AKfycbyfYM8q6t7Q7UwIRORFBNOCA-mMpVFE1Z3oLzCJp5GNiYI9_CMy4767p9am2iMY70kl/exec";

// 2026年のリアルな銅建値データ
const REAL_HISTORY_2026 = [
  { date: '1/4', value: 2050 }, { date: '1/6', value: 2150 },
  { date: '1/8', value: 2110 }, { date: '1/13', value: 2190 },
  { date: '1/19', value: 2120 }, { date: '1/28', value: 2060 },
  { date: '1/30', value: 2180 }, { date: '2/2', value: 2110 },
  { date: '2/4', value: 2170 }, { date: '2/6', value: 2100 }
];

const FAQ_ITEMS = [
  { q: "インボイス制度には対応していますか？", a: "はい、完全対応しております。適格請求書発行事業者として登録済みですので、法人のお客様も安心してご利用いただけます。" },
  { q: "被覆付きの電線でもそのまま持ち込めますか？", a: "もちろんです！当社は独自のナゲットプラントを保有しており、被覆銅線から純度99.9%の銅を回収する技術を持っています。面倒な剥離作業は不要です。" },
  { q: "基板や電子部品も買取可能ですか？", a: "はい。都市鉱山と呼ばれるE-Scrap（基板・IC・コネクタ等）も、高度な選別技術により金・銀・パラジウムなどの希少金属として評価・買取いたします。" },
  { q: "支払いはいつになりますか？", a: "検収完了後、その場で現金にてお支払いいたします。法人様で掛け売りをご希望の場合はご相談ください。" }
];

const RANKS = [
  { id: 'GUEST', name: '一般 (未登録)', bonus: 0, color: 'text-gray-500', bg: 'bg-gray-100', icon: '👤' },
  { id: 'MEMBER', name: 'レギュラー', bonus: 20, color: 'text-blue-600', bg: 'bg-blue-50', icon: '💎' },
  { id: 'VIP', name: 'プラチナ', bonus: 50, color: 'text-amber-500', bg: 'bg-amber-50', icon: '👑' },
];

// --- Icons ---
const IconChart = () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="20" x2="18" y2="10"></line><line x1="12" y1="20" x2="12" y2="4"></line><line x1="6" y1="20" x2="6" y2="14"></line></svg>;
const IconArrowUp = () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="19" x2="12" y2="5"></line><polyline points="5 12 12 5 19 12"></polyline></svg>;
const IconLock = () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>;
const IconMenu = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>;
const IconX = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>;
const IconCalculator = () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="4" y="2" width="16" height="20" rx="2"></rect><line x1="8" y1="6" x2="16" y2="6"></line><line x1="16" y1="14" x2="16" y2="18"></line><path d="M16 10h.01"></path><path d="M12 10h.01"></path><path d="M8 10h.01"></path><path d="M12 14h.01"></path><path d="M8 14h.01"></path><path d="M12 18h.01"></path><path d="M8 18h.01"></path></svg>;
const IconChevronDown = ({className}) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><polyline points="6 9 12 15 18 9"></polyline></svg>;
const IconTruck = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="1" y="3" width="15" height="13"></rect><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"></polygon><circle cx="5.5" cy="18.5" r="2.5"></circle><circle cx="18.5" cy="18.5" r="2.5"></circle></svg>;
const IconZap = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon></svg>;
const IconShield = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>;
const IconCpu = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="4" y="4" width="16" height="16" rx="2" ry="2"></rect><rect x="9" y="9" width="6" height="6"></rect><line x1="9" y1="1" x2="9" y2="4"></line><line x1="15" y1="1" x2="15" y2="4"></line><line x1="9" y1="20" x2="9" y2="23"></line><line x1="15" y1="20" x2="15" y2="23"></line><line x1="20" y1="9" x2="23" y2="9"></line><line x1="20" y1="14" x2="23" y2="14"></line><line x1="1" y1="9" x2="4" y2="9"></line><line x1="1" y1="14" x2="4" y2="14"></line></svg>;
const IconFactory = ({size=24}) => <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 20a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V8l-7 5V8l-7 5V4a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2Z"></path><path d="M17 18h1"></path><path d="M12 18h1"></path><path d="M7 18h1"></path></svg>;
const IconMapPin = ({size=24}) => <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>;
const IconSearch = ({className}) => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>;
const IconCheck = () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>;

// --- Interactive Chart Component ---
const RealChart = ({ data, color = "#ef4444" }) => {
  const [activePoint, setActivePoint] = useState(null);
  
  if (!data || data.length === 0) return null;
  
  const maxVal = Math.max(...data.map(d => d.value));
  const minVal = Math.min(...data.map(d => d.value));
  const padding = (maxVal - minVal) * 0.2; 
  const yMax = maxVal + padding;
  const yMin = minVal - padding;
  const yRange = yMax - yMin;
  
  const width = 100;
  const height = 100;

  const getX = (index) => (index / (data.length - 1)) * width;
  const getY = (value) => height - ((value - yMin) / yRange) * height;
  const points = data.map((d, i) => `${getX(i)},${getY(d.value)}`).join(' ');

  return (
    <div className="w-full relative select-none" onMouseLeave={() => setActivePoint(null)}>
       <div className="flex justify-between items-end mb-4 px-2">
          <div>
            <div className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">
              {activePoint ? activePoint.date : 'Current Price'}
            </div>
            <div className="text-3xl font-black text-white flex items-center gap-2">
              ¥{activePoint ? activePoint.value.toLocaleString() : data[data.length-1].value.toLocaleString()} 
              <span className="text-sm font-normal text-slate-500">/kg</span>
            </div>
          </div>
          <div className="text-right">
             <div className="text-green-400 text-xs font-bold flex items-center justify-end gap-1 mb-1">
               <IconArrowUp /> 日足 (Daily)
             </div>
             <div className="text-[10px] text-slate-500">JX金属建値連動</div>
          </div>
       </div>

       <div className="h-48 w-full relative border-l border-b border-slate-700/50 bg-slate-800/20 rounded-lg overflow-hidden">
          <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-full overflow-visible" preserveAspectRatio="none">
            <defs>
              <linearGradient id="gradient" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor={color} stopOpacity="0.3" />
                <stop offset="100%" stopColor={color} stopOpacity="0" />
              </linearGradient>
            </defs>
            {[0.25, 0.5, 0.75].map(p => (
              <line key={p} x1="0" y1={height * p} x2={width} y2={height * p} stroke="#334155" strokeWidth="0.2" strokeDasharray="1" />
            ))}
            <path d={`M ${points} L ${width},${height} L 0,${height} Z`} fill="url(#gradient)" stroke="none" />
            <path d={`M${points}`} fill="none" stroke={color} strokeWidth="1.5" vectorEffect="non-scaling-stroke" strokeLinecap="round" strokeLinejoin="round" />
            {data.map((d, i) => (
              <g key={i}>
                <rect x={getX(i) - (width/data.length)/2} y="0" width={width/data.length} height="100" fill="transparent" onMouseEnter={() => setActivePoint(d)} onTouchStart={() => setActivePoint(d)} />
                {activePoint && activePoint.date === d.date && (
                   <g>
                     <line x1={getX(i)} y1="0" x2={getX(i)} y2="100" stroke="white" strokeWidth="0.5" strokeDasharray="2" vectorEffect="non-scaling-stroke" />
                     <circle cx={getX(i)} cy={getY(d.value)} r="3" fill="white" stroke={color} strokeWidth="2" vectorEffect="non-scaling-stroke" />
                   </g>
                )}
              </g>
            ))}
          </svg>
       </div>
    </div>
  );
};

export default function LandingPage() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  // System Data
  const [marketPrice, setMarketPrice] = useState(0); 
  const [chartData, setChartData] = useState([]); 
  const [products, setProducts] = useState([]);
  const [crmData, setCrmData] = useState([]);
  
  // User Data
  const [user, setUser] = useState(null);
  const [loginModalOpen, setLoginModalOpen] = useState(false);
  const [loginId, setLoginId] = useState('');
  const [loginPw, setLoginPw] = useState('');
  
  // UI State
  const [isPosOpen, setIsPosOpen] = useState(false);
  const [isCrmOpen, setIsCrmOpen] = useState(false);
  const [cart, setCart] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [calcValue, setCalcValue] = useState('0');
  const [calcModalOpen, setCalcModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('loading');
  const [activeFaq, setActiveFaq] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);

    const fetchSystemData = async () => {
      try {
        const [priceRes, productRes] = await Promise.all([
            fetch(`${API_ENDPOINT}?action=get_market_price`).catch(e => null),
            fetch(`${API_ENDPOINT}?action=get_products`).catch(e => null)
        ]);

        let currentPrice = 2100; 
        if (priceRes && priceRes.ok) {
          const data = await priceRes.json();
          if (data && data.price) {
            currentPrice = Number(data.price);
            setMarketPrice(currentPrice);
          }
        }

        const history = [...REAL_HISTORY_2026];
        const lastHist = history[history.length - 1];
        if (lastHist.value !== currentPrice) {
           const today = new Date();
           history.push({ date: `${today.getMonth()+1}/${today.getDate()}`, value: currentPrice });
        }
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
      } catch (e) { console.warn("Fetch Error", e); }
    };

    fetchSystemData();
    const storedUser = localStorage.getItem('tsukisamu_user');
    if (storedUser) setUser(JSON.parse(storedUser));
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (user && user.rank === 'OWNER') {
        fetch(`${API_ENDPOINT}?action=get_crm_data`)
          .then(res => res.json())
          .then(data => { if(data.targets) setCrmData(data.targets); })
          .catch(e => console.error(e));
    }
  }, [user]);

  const handleLogin = async () => {
    try {
      const res = await fetch(`${API_ENDPOINT}?action=login&id=${loginId}&pw=${loginPw}`);
      const data = await res.json();
      if (data.success && data.user) {
        setUser(data.user);
        localStorage.setItem('tsukisamu_user', JSON.stringify(data.user));
        setLoginModalOpen(false);
      } else { alert('ID/PWが違います'); }
    } catch (e) { alert('通信エラー'); }
  };

  const handleLogout = () => {
    if(confirm('ログアウトしますか？')) {
      setUser(null);
      localStorage.removeItem('tsukisamu_user');
      setCart([]);
    }
  };

  const addToCart = () => {
    const w = parseFloat(calcValue);
    if(w > 0 && selectedProduct) {
      const unit = Math.floor(marketPrice * (selectedProduct.ratio/100));
      const grossProfit = Math.floor((marketPrice * 0.98 * (selectedProduct.ratio/100) - unit) * w);
      setCart([...cart, { ...selectedProduct, weight: w, unit: unit, subtotal: Math.floor(w * unit), grossProfit: grossProfit }]);
      setCalcModalOpen(false);
      setCalcValue('0');
    }
  };

  const handleCalcInput = (v) => {
    if(v === '.' && calcValue.includes('.')) return;
    setCalcValue(prev => prev === '0' && v !== '.' ? v : prev + v);
  };

  const subTotal = cart.reduce((a,b) => a + b.subtotal, 0);
  const totalProfit = cart.reduce((a,b) => a + (b.grossProfit || 0), 0);
  const totalWeight = cart.reduce((a,b) => a + b.weight, 0);
  const estimatedHours = totalWeight / 20; 
  const hourlyWage = estimatedHours > 0 ? Math.floor(totalProfit / estimatedHours) : 0;

  const categories = Array.from(new Set(products.map(p => p.category))).sort();

  return (
    <div className="min-h-screen font-sans text-[#1a1a1a] bg-white">
      {/* Header */}
      <header className={`fixed top-0 w-full z-40 transition-all duration-300 border-b ${isScrolled ? 'bg-white/95 backdrop-blur shadow-md py-2' : 'bg-white py-4 border-transparent'}`}>
        <div className="container mx-auto px-4 md:px-6 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-[#D32F2F] rounded-lg flex items-center justify-center text-white font-black">月</div>
            <div>
              <h1 className="text-xl font-bold tracking-tight text-[#1a1a1a] leading-none">TSUKISAMU<br/><span className="text-[10px] text-gray-500 font-normal tracking-widest">TOMAKOMAI FACTORY</span></h1>
            </div>
          </div>
          <nav className="hidden lg:flex items-center gap-6 text-sm font-bold text-[#1a1a1a]">
            <a href="#recycle" className="hover:text-[#D32F2F] transition-colors">リサイクル事業</a>
            <a href="#rank" className="hover:text-[#D32F2F] transition-colors">会員ランク</a>
            <a href="#about" className="hover:text-[#D32F2F] transition-colors">会社概要</a>
            {user ? (
              <div className="flex items-center gap-4 ml-4">
                <div className="text-right"><div className="text-xs text-gray-500">{user.name} 様</div><button onClick={handleLogout} className="text-[10px] text-red-600 underline">ログアウト</button></div>
                <button onClick={() => setIsCrmOpen(true)} className="text-sm font-bold text-gray-600 hover:text-black flex items-center gap-1"><IconMapPin /> 営業リスト</button>
                <button onClick={() => setIsPosOpen(true)} className="bg-[#1a1a1a] text-white px-5 py-2.5 rounded hover:bg-black transition-all flex items-center gap-2 shadow-lg"><IconCalculator /> 会員POS</button>
              </div>
            ) : (
              <div className="flex items-center gap-3 ml-4">
                <button onClick={() => setLoginModalOpen(true)} className="text-xs font-bold text-gray-500 hover:text-black">パートナーログイン</button>
                <button onClick={() => setIsPosOpen(true)} className="bg-[#D32F2F] text-white px-6 py-2.5 rounded-full hover:bg-[#B71C1C] transition-all flex items-center gap-2 shadow-lg animate-pulse"><IconCalculator /> 買取シミュレーション</button>
              </div>
            )}
          </nav>
          <button className="lg:hidden p-2 text-[#1a1a1a]" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>{mobileMenuOpen ? <IconX /> : <IconMenu />}</button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 px-4 bg-slate-900 text-white overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1565610261709-5c5697d74556?auto=format&fit=crop&q=80')] bg-cover bg-center opacity-20"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/90 to-transparent"></div>
        
        <div className="container mx-auto relative z-10 grid md:grid-cols-2 gap-12 items-center">
          <div className="animate-in fade-in slide-in-from-bottom-8 duration-1000">
            <div className="inline-block px-3 py-1 bg-[#D32F2F]/20 text-[#D32F2F] border border-[#D32F2F]/50 rounded-full text-xs font-bold mb-6 tracking-wider">SINCE 1961</div>
            <h2 className="text-5xl md:text-7xl font-black tracking-tight mb-6 leading-tight">Re Defining <br/><span className="text-[#D32F2F]">Recycling.</span></h2>
            <p className="text-lg text-slate-400 font-medium mb-8 leading-relaxed">
              BEYOND RESOURCES. EVOLVING VALUE.<br/>
              都市に眠る資源は、磨けば光る「宝石」。<br/>
              1961年の創業以来培った技術で、リサイクルを再定義します。
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <button onClick={() => setIsPosOpen(true)} className="bg-white text-slate-900 px-8 py-4 rounded font-bold text-lg shadow-[0_0_20px_rgba(255,255,255,0.3)] hover:shadow-[0_0_30px_rgba(255,255,255,0.5)] transition-all flex items-center justify-center gap-2"><IconCalculator /> 今すぐ査定する</button>
              <div className="flex items-center gap-2 text-slate-500 px-4"><IconLock /> 会員登録でさらに優遇</div>
            </div>
          </div>
          <div className="bg-[#1e293b] border border-slate-700 rounded-2xl p-6 shadow-2xl animate-in fade-in slide-in-from-right-8 duration-1000 delay-200">
             <RealChart data={chartData} color="#ef4444" />
             <div className="mt-4 pt-4 border-t border-slate-700 text-xs text-slate-500 flex justify-between"><span>Source: JX Nippon Mining & Metals</span><span>Update: Auto (Daily)</span></div>
          </div>
        </div>
      </section>

      {/* Main Service (Recycling) */}
      <section id="recycle" className="py-24 bg-white">
        <div className="container mx-auto px-4">
           <div className="flex flex-col md:flex-row items-center gap-12">
              <div className="md:w-1/2">
                 <div className="inline-block px-4 py-1 bg-red-100 text-[#D32F2F] font-bold rounded-full text-xs mb-6">MAIN BUSINESS</div>
                 <h2 className="text-4xl font-black text-[#1a1a1a] mb-6 leading-tight">廃電線・非鉄金属<br/>リサイクル事業</h2>
                 <p className="text-gray-600 text-lg leading-relaxed mb-8">
                    当社は独自の「ナゲットプラント」を工場内に保有しています。<br/>
                    持ち込まれた被覆銅線を粉砕・選別し、純度99.9%の銅ナゲットとして再生します。<br/>
                    この一貫処理体制により、被覆がついたままの状態での高価買取を実現しています。
                 </p>
                 <ul className="space-y-4">
                    <li className="flex items-center gap-3 font-bold text-[#1a1a1a]"><span className="text-[#D32F2F]"><IconCheck /></span> 面倒な「皮むき作業」は一切不要</li>
                    <li className="flex items-center gap-3 font-bold text-[#1a1a1a]"><span className="text-[#D32F2F]"><IconCheck /></span> 独自の選別技術で「純度99.9%」の銅を回収</li>
                    <li className="flex items-center gap-3 font-bold text-[#1a1a1a]"><span className="text-[#D32F2F]"><IconCheck /></span> 基板・E-Scrapからの貴金属回収も対応</li>
                 </ul>
              </div>
              <div className="md:w-1/2 bg-gray-100 rounded-2xl h-80 flex items-center justify-center relative overflow-hidden group">
                 {/* Placeholder for Factory Image */}
                 <div className="absolute inset-0 bg-gradient-to-br from-gray-200 to-gray-300"></div>
                 <IconFactory size={64} className="text-gray-400 relative z-10" />
                 <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur px-4 py-2 rounded-lg text-xs font-bold text-gray-600">自社ナゲットプラント稼働中</div>
              </div>
           </div>
        </div>
      </section>

      {/* Sub Services (Trust Indicators) */}
      <section className="py-16 bg-gray-50 border-y border-gray-200">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
             <h3 className="text-xl font-bold text-gray-500">技術は、人が創る。<br/>創業以来の確かなモノづくり。</h3>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
             <div className="bg-white p-6 rounded-xl border border-gray-100 flex items-start gap-4">
                <div className="text-[#D32F2F] bg-red-50 p-3 rounded-lg"><IconFactory size={24} /></div>
                <div><h4 className="font-bold text-[#1a1a1a] mb-1">黄銅ビレット鋳造</h4><p className="text-xs text-gray-500">熟練の職人が成分を管理し、高品質な黄銅ビレットを製造。</p></div>
             </div>
             <div className="bg-white p-6 rounded-xl border border-gray-100 flex items-start gap-4">
                <div className="text-[#D32F2F] bg-red-50 p-3 rounded-lg"><IconCpu size={24} /></div>
                <div><h4 className="font-bold text-[#1a1a1a] mb-1">制御盤・分電盤</h4><p className="text-xs text-gray-500">札幌本社工場にて、設計から製造までを一貫して行います。</p></div>
             </div>
             <div className="bg-white p-6 rounded-xl border border-gray-100 flex items-start gap-4">
                <div className="text-[#D32F2F] bg-red-50 p-3 rounded-lg"><IconShield size={24} /></div>
                <div><h4 className="font-bold text-[#1a1a1a] mb-1">圧縮端子製造</h4><p className="text-xs text-gray-500">マルチピラーや簡易キュービクル等の部材を自社製造。</p></div>
             </div>
          </div>
        </div>
      </section>

      {/* Ranks (Restored) */}
      <section id="rank" className="py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
             <h2 className="text-3xl font-black text-[#1a1a1a] mb-4">会員ランクシステム</h2>
             <p className="text-gray-500">初回取引完了後に発行されるIDで、<br/>2回目以降の取引が圧倒的にお得になります。</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
             {RANKS.map((rank) => (
               <div key={rank.id} className={`relative p-8 rounded-2xl border-2 ${rank.id === 'VIP' ? 'border-amber-400 shadow-xl scale-105 z-10' : 'border-gray-100 shadow-sm'} bg-white flex flex-col items-center text-center transition-all hover:-translate-y-2`}>
                  {rank.id === 'VIP' && <div className="absolute -top-4 bg-amber-500 text-white px-4 py-1 rounded-full text-xs font-bold tracking-widest">MOST POPULAR</div>}
                  <div className={`w-16 h-16 rounded-full ${rank.bg} flex items-center justify-center text-3xl mb-6 shadow-inner`}>
                     {rank.icon}
                  </div>
                  <h3 className="text-xl font-black text-[#1a1a1a] mb-2">{rank.name}</h3>
                  <div className="w-full bg-gray-50 rounded-xl p-4 mb-4">
                     <div className="text-xs text-gray-400 font-bold uppercase mb-1">買取単価ボーナス</div>
                     <div className={`text-3xl font-black ${rank.color}`}>
                       {rank.bonus === 0 ? '±0' : `+${rank.bonus}`} <span className="text-sm text-gray-400 font-normal">円/kg</span>
                     </div>
                  </div>
                  {rank.id === 'GUEST' ? <span className="text-xs text-gray-400 font-bold mt-auto">現在のお客様</span> : <div className="mt-auto text-xs font-bold text-[#D32F2F]">年間 <span className="text-lg">約{((rank.bonus * 1000 * 12)/10000).toFixed(0)}万円</span> お得</div>}
               </div>
             ))}
          </div>
        </div>
      </section>

      {/* FAQ (Restored) */}
      <section id="faq" className="py-20 bg-gray-50">
        <div className="container mx-auto px-4 max-w-3xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-black text-[#1a1a1a] mb-4">よくある質問</h2>
          </div>
          <div className="space-y-4">
            {FAQ_ITEMS.map((item, idx) => (
              <div key={idx} className="border border-gray-200 rounded-lg overflow-hidden bg-white hover:shadow-md transition-shadow">
                <button onClick={() => setActiveFaq(activeFaq === idx ? null : idx)} className="w-full flex justify-between items-center p-5 text-left font-bold hover:bg-gray-50">
                  <span className="flex items-center gap-3"><span className="text-[#D32F2F]">Q.</span> {item.q}</span>
                  <IconChevronDown className={`transform transition-transform ${activeFaq === idx ? 'rotate-180' : ''}`} />
                </button>
                {activeFaq === idx && <div className="p-5 bg-gray-50 text-sm text-gray-600 border-t border-gray-100 leading-relaxed"><span className="font-bold text-[#1a1a1a] mr-2">A.</span> {item.a}</div>}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Company Info (Moved to bottom) */}
      <section id="about" className="py-20 bg-white">
        <div className="container mx-auto px-4 max-w-4xl">
           <div className="bg-gray-50 rounded-2xl shadow-sm overflow-hidden flex flex-col md:flex-row border border-gray-100">
              <div className="bg-[#1a1a1a] text-white p-12 md:w-1/3 flex flex-col justify-center">
                 <h2 className="text-2xl font-black mb-4">拠点紹介</h2>
                 <p className="text-gray-400 text-sm">OUR LOCATIONS</p>
              </div>
              <div className="p-12 md:w-2/3 space-y-8">
                 <div>
                    <h3 className="font-bold text-lg flex items-center gap-2 mb-2"><span className="w-2 h-2 bg-[#D32F2F] rounded-full"></span> 札幌本社工場</h3>
                    <p className="text-sm text-gray-600 pl-4">〒004-0871 札幌市清田区平岡1条5丁目2番1号<br/>TEL: 011-881-1116(代)</p>
                 </div>
                 <div>
                    <h3 className="font-bold text-lg flex items-center gap-2 mb-2"><span className="w-2 h-2 bg-[#D32F2F] rounded-full"></span> 苫小牧工場</h3>
                    <p className="text-sm text-gray-600 pl-4">〒053-0001 苫小牧市一本松町9-6<br/>TEL: 0144-55-5544(代)</p>
                 </div>
              </div>
           </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#1a1a1a] text-[#999999] py-16 text-sm border-t border-gray-800">
        <div className="container mx-auto px-4 text-center">
            <h2 className="text-2xl font-black text-white mb-2">株式会社月寒製作所</h2>
            <p className="text-xs text-gray-500 mb-6 font-mono">TSUKISAMU MANUFACTURING CO., LTD. (Since 1961)</p>
            <p>© 2026 All Rights Reserved.</p>
        </div>
      </footer>

      {/* CRM Sales Map Modal */}
      {isCrmOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
           <div className="bg-white w-full max-w-4xl h-[80vh] rounded-2xl shadow-2xl flex flex-col overflow-hidden">
              <div className="bg-[#1a1a1a] text-white p-4 flex justify-between items-center">
                 <h3 className="font-bold flex items-center gap-2"><IconMapPin /> 営業ターゲットリスト (CRM)</h3>
                 <button onClick={() => setIsCrmOpen(false)}><IconX /></button>
              </div>
              <div className="p-4 border-b">
                 <div className="relative">
                    <IconSearch className="absolute left-3 top-3 text-gray-400" />
                    <input type="text" placeholder="企業名・住所で検索..." className="w-full pl-10 pr-4 py-2 border rounded-lg bg-gray-50 outline-none focus:border-black transition-colors" value={searchTerm} onChange={e=>setSearchTerm(e.target.value)} />
                 </div>
              </div>
              <div className="flex-1 overflow-y-auto p-0">
                 <table className="w-full text-sm text-left">
                    <thead className="bg-gray-50 text-gray-500 font-bold sticky top-0"><tr><th className="p-4">企業名</th><th className="p-4">住所</th><th className="p-4">ランク</th><th className="p-4">アクション</th></tr></thead>
                    <tbody className="divide-y">
                       {crmData.filter(t => t.name.includes(searchTerm) || t.address.includes(searchTerm)).map(target => (
                          <tr key={target.id} className="hover:bg-gray-50">
                             <td className="p-4 font-bold">{target.name}</td>
                             <td className="p-4 text-gray-500">{target.address}</td>
                             <td className="p-4"><span className={`px-2 py-1 rounded text-xs font-bold ${target.priority === 'S' ? 'bg-red-100 text-red-600' : 'bg-gray-100 text-gray-500'}`}>{target.priority}</span></td>
                             <td className="p-4"><a href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(target.name + " " + target.address)}`} target="_blank" rel="noreferrer" className="text-blue-600 hover:underline flex items-center gap-1"><IconMapPin size={14} /> マップを開く</a></td>
                          </tr>
                       ))}
                    </tbody>
                 </table>
              </div>
           </div>
        </div>
      )}

      {/* POS Modal */}
      {isPosOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-end md:items-center justify-center p-0 md:p-4 animate-in fade-in duration-200">
          <div className="bg-white w-full md:max-w-6xl h-[95vh] md:h-[90vh] md:rounded-2xl shadow-2xl flex flex-col overflow-hidden relative">
            <div className="bg-[#1a1a1a] text-white p-4 flex justify-between items-center shrink-0">
                <div className="flex items-center gap-3"><IconCalculator /><span className="font-bold">{user ? `会員POS: ${user.name}` : '買取シミュレーター'}</span></div>
                <div className="flex gap-4 items-center">
                   <div className="text-xs text-gray-400 bg-white/10 px-3 py-1 rounded-full">本日建値: <span className="text-white font-bold">¥{marketPrice}</span></div>
                   <button onClick={() => setIsPosOpen(false)} className="bg-white/10 p-2 rounded hover:bg-white/20 transition-colors"><IconX /></button>
                </div>
            </div>
            <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
                <div className="flex-1 flex flex-col bg-[#f8fafc] overflow-hidden relative">
                   <div className="p-3 overflow-x-auto whitespace-nowrap bg-white border-b shrink-0 shadow-sm z-10">
                      {categories.map(c => (<button key={c} onClick={()=>setActiveTab(c)} className={`px-5 py-2 mx-1 rounded-full text-xs font-bold transition-all ${activeTab===c ? 'bg-[#1a1a1a] text-white shadow-lg scale-105':'bg-gray-100 text-gray-500 hover:bg-gray-200'}`}>{c}</button>))}
                   </div>
                   <div className="flex-1 overflow-y-auto p-4">
                     <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
                       {products.filter(p => p.category === activeTab).map(p => {
                          const unit = Math.floor(marketPrice * (p.ratio/100));
                          return (
                            <button key={p.id} onClick={() => { setSelectedProduct(p); setCalcModalOpen(true); }} className="bg-white p-4 rounded-xl shadow-sm border border-transparent hover:border-[#D32F2F] hover:shadow-md transition-all text-left group">
                               <div className="flex justify-between items-start mb-2"><div className="text-sm font-bold text-gray-700 group-hover:text-[#D32F2F]">{p.name}</div><span className="text-[10px] bg-gray-100 text-gray-500 px-1.5 py-0.5 rounded">{p.tag}</span></div>
                               <div className="text-xl font-black text-[#1a1a1a]">¥{unit.toLocaleString()}</div>
                               <div className="text-[10px] text-gray-400 mt-1">{p.desc}</div>
                            </button>
                          )
                       })}
                     </div>
                   </div>
                </div>
                <div className="w-full md:w-96 bg-white border-l flex flex-col z-20 shadow-xl h-[45%] md:h-auto">
                   <div className="flex-1 overflow-y-auto p-4 space-y-3">
                     {cart.length === 0 ? (
                       <div className="h-full flex flex-col items-center justify-center text-gray-300"><IconChart /><span className="text-xs mt-2">品目を選択して計算</span></div>
                     ) : (
                       cart.map((item, i) => (
                         <div key={i} className="flex justify-between items-center text-sm border-b border-dashed pb-2">
                            <div><span className="font-bold block text-gray-700">{item.name}</span><span className="text-xs text-gray-400">{item.weight}kg × @{item.unit}</span></div>
                            <div className="font-bold text-[#1a1a1a]">¥{item.subtotal.toLocaleString()}</div>
                         </div>
                       ))
                     )}
                   </div>
                   {user && cart.length > 0 && (
                     <div className="bg-blue-50 p-4 border-t border-blue-100 animate-in slide-in-from-bottom-4">
                        <div className="text-xs font-bold text-blue-800 mb-2 flex items-center gap-1"><IconZap size={14} /> Smart Labor (Profit Simulation)</div>
                        <div className="flex justify-between items-center mb-1"><span className="text-xs text-gray-500">予想粗利:</span><span className="font-bold text-blue-700">¥{totalProfit.toLocaleString()}</span></div>
                        <div className="flex justify-between items-center"><span className="text-xs text-gray-500">時給換算 (20kg/h):</span><span className="font-bold text-green-600">¥{hourlyWage.toLocaleString()}/h</span></div>
                     </div>
                   )}
                   <div className="p-6 bg-[#1a1a1a] text-white shrink-0">
                      <div className="flex justify-between items-end mb-6"><span className="text-sm text-gray-400">お支払い予定額</span><span className="text-4xl font-black tracking-tight">¥{subTotal.toLocaleString()}</span></div>
                      {!user ? (<button onClick={() => alert("初回ID発行フローへ")} className="w-full bg-[#D32F2F] hover:bg-[#B71C1C] text-white py-4 rounded-xl font-bold shadow-lg transition-all transform active:scale-95 flex items-center justify-center gap-2">買取申込 & ID発行</button>) : (<button onClick={() => alert("送信完了")} className="w-full bg-blue-600 hover:bg-blue-500 text-white py-4 rounded-xl font-bold shadow-lg">取引確定 (会員)</button>)}
                   </div>
                </div>
              </div>
              {calcModalOpen && (
                <div className="absolute inset-0 z-30 bg-black/20 backdrop-blur-[1px] flex items-center justify-center p-4">
                  <div className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-xs animate-in zoom-in duration-200">
                      <div className="text-center mb-6"><div className="text-sm text-gray-500 mb-1">重量を入力 (kg)</div><div className="text-lg font-bold text-[#1a1a1a]">{selectedProduct?.name}</div></div>
                      <div className="bg-gray-100 p-4 rounded-xl mb-6 text-right text-4xl font-mono font-black tracking-tight border border-gray-200 shadow-inner">{calcValue}<span className="text-sm text-gray-400 ml-2 font-sans font-normal">kg</span></div>
                      <div className="grid grid-cols-3 gap-3 mb-6">
                        {[7,8,9,4,5,6,1,2,3,0,'.'].map(n => <button key={n} onClick={()=>handleCalcInput(n.toString())} className="h-14 bg-white border border-gray-200 rounded-xl font-bold text-xl hover:bg-gray-50 shadow-sm active:translate-y-0.5 transition-all">{n}</button>)}
                        <button onClick={()=>setCalcValue('0')} className="h-14 bg-red-50 text-red-600 border border-red-100 rounded-xl font-bold shadow-sm active:translate-y-0.5">C</button>
                      </div>
                      <div className="flex gap-3"><button onClick={()=>setCalcModalOpen(false)} className="flex-1 py-4 bg-gray-100 rounded-xl font-bold text-gray-600 hover:bg-gray-200">戻る</button><button onClick={addToCart} className="flex-1 py-4 bg-[#1a1a1a] text-white rounded-xl font-bold shadow-lg hover:bg-black">決定</button></div>
                  </div>
                </div>
              )}
          </div>
        </div>
      )}

      {loginModalOpen && (
        <div className="fixed inset-0 z-[60] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-sm relative">
            <button onClick={() => setLoginModalOpen(false)} className="absolute top-4 right-4 text-gray-400 hover:text-black"><IconX /></button>
            <h3 className="text-xl font-black text-center mb-2">PARTNER LOGIN</h3>
            <p className="text-xs text-center text-gray-400 mb-8">登録済みのパートナーIDを入力してください</p>
            <div className="space-y-4">
              <div><label className="text-xs font-bold text-gray-500 ml-1">ID</label><input type="text" className="w-full p-4 border border-gray-200 rounded-xl bg-gray-50 focus:border-black outline-none transition-colors" value={loginId} onChange={e=>setLoginId(e.target.value)} /></div>
              <div><label className="text-xs font-bold text-gray-500 ml-1">PASSWORD</label><input type="password" className="w-full p-4 border border-gray-200 rounded-xl bg-gray-50 focus:border-black outline-none transition-colors" value={loginPw} onChange={e=>setLoginPw(e.target.value)} /></div>
              <button onClick={handleLogin} className="w-full bg-[#1a1a1a] text-white py-4 rounded-xl font-bold hover:bg-black transition-colors shadow-lg mt-4">ログイン</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
