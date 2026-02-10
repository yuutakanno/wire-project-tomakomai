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
const IconCamera = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"></path><circle cx="12" cy="13" r="4"></circle></svg>;

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
             <div className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{activePoint ? activePoint.date : 'Current Price'}</div>
             <div className="text-3xl font-black text-white flex items-center gap-2">¥{activePoint ? activePoint.value.toLocaleString() : data[data.length-1].value.toLocaleString()} <span className="text-sm font-normal text-slate-500">/kg</span></div>
           </div>
           <div className="text-right">
              <div className="text-green-400 text-xs font-bold flex items-center justify-end gap-1 mb-1"><IconArrowUp /> 日足 (Daily)</div>
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
             {[0.25, 0.5, 0.75].map(p => (<line key={p} x1="0" y1={height * p} x2={width} y2={height * p} stroke="#334155" strokeWidth="0.2" strokeDasharray="1" />))}
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
  const [isAiModalOpen, setIsAiModalOpen] = useState(false); 
  
  // Data
  const [marketPrice, setMarketPrice] = useState(0); 
  const [chartData, setChartData] = useState([]); 
  const [products, setProducts] = useState([]);
  const [crmData, setCrmData] = useState([]);
  
  // User
  const [user, setUser] = useState(null);
  const [loginModalOpen, setLoginModalOpen] = useState(false);
  const [loginId, setLoginId] = useState('');
  const [loginPw, setLoginPw] = useState('');
  
  // UI
  const [isPosOpen, setIsPosOpen] = useState(false);
  const [isCrmOpen, setIsCrmOpen] = useState(false);
  const [cart, setCart] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [calcValue, setCalcValue] = useState('0');
  const [calcModalOpen, setCalcModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('loading');

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
    <div className="min-h-screen font-sans text-[#1a1a1a] bg-white relative">
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

      {/* Main Content: Recycling Service Overview */}
      <section id="recycle" className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-black mb-4">OUR SERVICE</h2>
            <p className="text-slate-500">最新鋭の設備と職人の目利きで、あらゆる廃電線を価値に変えます。</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-slate-50 p-8 rounded-2xl hover:bg-slate-100 transition-all group">
              <div className="w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center mb-6 group-hover:scale-110 transition-transform"><IconZap /></div>
              <h3 className="text-xl font-bold mb-3">廃電線買取</h3>
              <p className="text-slate-500 text-sm leading-relaxed">IV線、CVTケーブル、通信線など、あらゆる種類の電線を高価買取。被覆がついたままでOKです。</p>
            </div>
            <div className="bg-slate-50 p-8 rounded-2xl hover:bg-slate-100 transition-all group">
              <div className="w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center mb-6 group-hover:scale-110 transition-transform"><IconFactory /></div>
              <h3 className="text-xl font-bold mb-3">ナゲット加工</h3>
              <p className="text-slate-500 text-sm leading-relaxed">自社工場内のナゲットプラントで、被覆と銅を99.9%の純度で分離。環境負荷を最小限に抑えます。</p>
            </div>
            <div className="bg-slate-50 p-8 rounded-2xl hover:bg-slate-100 transition-all group">
               <div className="w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center mb-6 group-hover:scale-110 transition-transform"><IconTruck /></div>
              <h3 className="text-xl font-bold mb-3">出張引取</h3>
              <p className="text-slate-500 text-sm leading-relaxed">大口のお客様には、専用トラックでの出張引取も対応。現場から直接、苫小牧工場へ搬入可能です。</p>
            </div>
          </div>
        </div>
      </section>

      {/* Rank System */}
      <section id="rank" className="py-20 bg-slate-900 text-white">
        <div className="container mx-auto px-4">
           <div className="grid md:grid-cols-2 gap-12 items-center">
             <div>
               <h2 className="text-3xl font-black mb-6">MEMBERSHIP</h2>
               <p className="text-slate-400 mb-8 leading-relaxed">
                 取引量に応じたランク制度を導入。<br/>
                 使えば使うほど、買取単価が自動的にアップします。
               </p>
               <div className="space-y-4">
                 {RANKS.map(rank => (
                   <div key={rank.id} className="flex items-center gap-4 bg-slate-800/50 p-4 rounded-lg border border-slate-700">
                     <div className="text-2xl">{rank.icon}</div>
                     <div>
                       <div className="font-bold">{rank.name}</div>
                       <div className="text-xs text-slate-400">ボーナス: <span className="text-green-400">+{rank.bonus}円/kg</span></div>
                     </div>
                   </div>
                 ))}
               </div>
             </div>
             <div className="bg-gradient-to-br from-slate-800 to-slate-900 p-8 rounded-2xl border border-slate-700 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-32 bg-[#D32F2F] opacity-10 blur-[80px] rounded-full"></div>
                <h3 className="text-xl font-bold mb-4 flex items-center gap-2"><IconCheck /> 法人契約のメリット</h3>
                <ul className="space-y-4 text-slate-300 text-sm">
                  <li className="flex gap-2"><IconCheck /> 専属担当者による優先対応</li>
                  <li className="flex gap-2"><IconCheck /> 請求書払い（掛け売り）対応</li>
                  <li className="flex gap-2"><IconCheck /> 産業廃棄物管理票（マニフェスト）発行</li>
                </ul>
                <button onClick={()=>setLoginModalOpen(true)} className="mt-8 w-full bg-white text-slate-900 font-bold py-3 rounded hover:bg-gray-100 transition-colors">パートナー登録 / ログイン</button>
             </div>
           </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 max-w-3xl">
          <h2 className="text-3xl font-black text-center mb-12">FAQ</h2>
          <div className="space-y-4">
            {FAQ_ITEMS.map((item, idx) => (
              <div key={idx} className="border border-gray-200 rounded-lg overflow-hidden">
                <button 
                  onClick={() => setActiveFaq(activeFaq === idx ? null : idx)}
                  className="w-full flex justify-between items-center p-4 text-left font-bold hover:bg-gray-50"
                >
                  {item.q}
                  <IconChevronDown className={`transition-transform ${activeFaq === idx ? 'rotate-180' : ''}`} />
                </button>
                {activeFaq === idx && (
                  <div className="p-4 bg-gray-50 text-sm text-gray-600 border-t border-gray-200 animate-in slide-in-from-top-2">
                    {item.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About / Footer */}
      <footer id="about" className="bg-[#1a1a1a] text-gray-400 py-12 border-t border-gray-800">
        <div className="container mx-auto px-4 grid md:grid-cols-4 gap-8 text-sm">
          <div className="col-span-1 md:col-span-2">
            <h4 className="text-white font-bold text-lg mb-4">株式会社 月寒製作所</h4>
            <p className="mb-4">北海道苫小牧市勇払123-4<br/>TEL: 0144-XX-XXXX</p>
            <p className="text-xs">
              古物商許可証: 北海道公安委員会 第123456789号<br/>
              産業廃棄物収集運搬業許可: 第0000000号
            </p>
          </div>
          <div>
            <h4 className="text-white font-bold mb-4">LINKS</h4>
            <ul className="space-y-2">
              <li><a href="#" className="hover:text-white">ホーム</a></li>
              <li><a href="#" className="hover:text-white">買取価格一覧</a></li>
              <li><a href="#" className="hover:text-white">持ち込み予約</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-bold mb-4">ACCESS</h4>
            <div className="w-full h-32 bg-gray-800 rounded flex items-center justify-center text-xs">
              Google Map Loading...
            </div>
          </div>
        </div>
        <div className="text-center text-xs mt-12 pt-8 border-t border-gray-800">
          &copy; 2026 TSUKISAMU FACTORY. All Rights Reserved.
        </div>
      </footer>

      {/* ============================================================
          Modals
         ============================================================ */}

      {/* 1. Login Modal (復活！) */}
      {loginModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white w-full max-w-md rounded-xl p-6 shadow-2xl">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-slate-900">パートナーログイン</h3>
              <button onClick={() => setLoginModalOpen(false)} className="text-gray-400 hover:text-black"><IconX /></button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-500 mb-1">ログインID</label>
                <input 
                  type="text" 
                  value={loginId}
                  onChange={(e) => setLoginId(e.target.value)}
                  className="w-full bg-gray-100 p-3 rounded-lg border border-transparent focus:border-black outline-none transition-all font-bold"
                  placeholder="admin"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 mb-1">パスワード</label>
                <input 
                  type="password" 
                  value={loginPw}
                  onChange={(e) => setLoginPw(e.target.value)}
                  className="w-full bg-gray-100 p-3 rounded-lg border border-transparent focus:border-black outline-none transition-all font-bold"
                  placeholder="••••••••"
                />
              </div>
              <button 
                onClick={handleLogin}
                className="w-full bg-[#1a1a1a] text-white py-4 rounded-lg font-bold hover:bg-black transition-all shadow-lg mt-2"
              >
                認証する
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 2. POS Modal */}
      {isPosOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in">
           <div className="bg-white w-full max-w-4xl h-[85vh] rounded-2xl overflow-hidden shadow-2xl flex flex-col md:flex-row relative">
              <button onClick={()=>setIsPosOpen(false)} className="absolute top-4 right-4 text-black z-10 p-2 hover:bg-gray-100 rounded-full"><IconX /></button>
              
              <div className="p-6 md:p-8 w-full h-full flex flex-col">
                  <h3 className="text-xl font-bold mb-4 flex items-center gap-2 flex-shrink-0"><IconCalculator /> 買取シミュレーター</h3>
                  
                  <div className="flex flex-col md:flex-row gap-6 h-full overflow-hidden">
                      {/* Left: Product List */}
                      <div className="w-full md:w-1/2 flex flex-col h-full overflow-hidden">
                          <div className="flex gap-2 mb-4 overflow-x-auto pb-2 flex-shrink-0">
                             {categories.map(c => (
                                 <button key={c} onClick={()=>setActiveTab(c)} className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-colors ${activeTab===c ? 'bg-black text-white' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'}`}>{c}</button>
                             ))}
                          </div>
                          <div className="space-y-2 overflow-y-auto pr-2 pb-20 md:pb-0">
                              {products.filter(p => p.category === activeTab).map(p => (
                                  <div key={p.id} onClick={()=>{setSelectedProduct(p); setCalcModalOpen(true);}} className="p-3 border rounded-lg hover:border-[#D32F2F] hover:bg-red-50 cursor-pointer group transition-all">
                                      <div className="flex justify-between items-center">
                                          <div>
                                            <div className="font-bold text-sm text-slate-800">{p.name}</div>
                                            <div className="text-xs text-gray-500">{p.sq !== '-' ? p.sq + 'sq' : ''}</div>
                                          </div>
                                          <div className="text-[#D32F2F] font-bold text-sm bg-white px-2 py-1 rounded border border-red-100">{p.ratio}%</div>
                                      </div>
                                  </div>
                              ))}
                          </div>
                      </div>
                      
                      {/* Right: Calculator & Cart */}
                      <div className="w-full md:w-1/2 bg-gray-50 rounded-xl p-4 flex flex-col h-1/2 md:h-full">
                          {/* Cart Items */}
                          <div className="flex-1 overflow-y-auto mb-4">
                              {cart.length === 0 ? (
                                <div className="h-full flex flex-col items-center justify-center text-gray-400">
                                  <IconTruck />
                                  <span className="text-xs mt-2">アイテムを選択してください</span>
                                </div>
                              ) : (
                                  <div className="space-y-2">
                                      {cart.map((item, idx) => (
                                          <div key={idx} className="bg-white p-3 rounded shadow-sm text-xs flex justify-between items-center animate-in slide-in-from-bottom-2">
                                              <div>
                                                <div className="font-bold">{item.name}</div>
                                                <div className="text-gray-500">{item.weight}kg × @{item.unit}</div>
                                              </div>
                                              <div className="font-bold text-lg">¥{item.subtotal.toLocaleString()}</div>
                                          </div>
                                      ))}
                                  </div>
                              )}
                          </div>
                          {/* Total */}
                          <div className="border-t border-gray-200 pt-4 mt-auto">
                              <div className="flex justify-between items-end mb-2">
                                  <div className="text-xs text-gray-500 font-bold">買取総額</div>
                                  <div className="text-3xl font-black text-[#D32F2F] leading-none">¥{subTotal.toLocaleString()}</div>
                              </div>
                              <div className="flex justify-between items-center text-[10px] text-gray-400 bg-white p-2 rounded border border-gray-100">
                                  <div>総重量: {totalWeight}kg</div>
                                  <div>推定利益(時給): <span className="font-bold text-slate-600">¥{hourlyWage.toLocaleString()}</span></div>
                              </div>
                              {cart.length > 0 && (
                                <button className="w-full bg-[#D32F2F] text-white font-bold py-3 rounded-lg mt-3 shadow-lg hover:bg-[#b71c1c] transition-colors">
                                  買取明細を発行する
                                </button>
                              )}
                          </div>
                      </div>
                  </div>
              </div>
           </div>
           
           {/* Numeric Keypad Modal (Nested) */}
           {calcModalOpen && selectedProduct && (
               <div className="absolute inset-0 z-50 bg-black/20 backdrop-blur-[1px] flex items-end justify-center sm:items-center">
                   <div className="bg-white w-full max-w-xs sm:rounded-2xl p-4 shadow-2xl animate-in slide-in-from-bottom-10 border border-gray-200">
                       <div className="flex justify-between items-center mb-4">
                           <div className="font-bold text-sm text-slate-800">{selectedProduct.name}</div>
                           <button onClick={()=>setCalcModalOpen(false)} className="text-gray-400 hover:text-black"><IconX /></button>
                       </div>
                       <div className="bg-slate-100 p-4 rounded-lg mb-4 text-right border-2 border-transparent focus-within:border-[#D32F2F] transition-colors">
                           <div className="text-xs text-slate-500 font-bold mb-1">重量入力 (kg)</div>
                           <div className="text-4xl font-black tracking-widest text-slate-900">{calcValue}</div>
                       </div>
                       <div className="grid grid-cols-3 gap-2 mb-4">
                           {[7,8,9,4,5,6,1,2,3,0,'.'].map(n => (
                               <button key={n} onClick={()=>handleCalcInput(String(n))} className="py-4 bg-white border border-gray-200 rounded-lg text-xl font-bold active:bg-gray-100 hover:shadow-sm transition-all text-slate-700">{n}</button>
                           ))}
                           <button onClick={()=>setCalcValue('0')} className="py-4 bg-red-50 text-red-500 border border-red-100 rounded-lg font-bold active:bg-red-100">C</button>
                       </div>
                       <button onClick={addToCart} className="w-full bg-[#1a1a1a] text-white py-4 rounded-lg font-bold text-lg hover:bg-black transition-colors shadow-lg">確定する</button>
                   </div>
               </div>
           )}
        </div>
      )}

      {/* 3. CRM Modal (簡易版) */}
      {isCrmOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white w-full max-w-2xl max-h-[80vh] rounded-xl p-6 shadow-2xl flex flex-col">
            <div className="flex justify-between items-center mb-4">
               <h3 className="text-xl font-bold flex items-center gap-2"><IconMapPin /> 営業ターゲットリスト</h3>
               <button onClick={()=>setIsCrmOpen(false)}><IconX /></button>
            </div>
            <div className="flex-1 overflow-y-auto">
               <table className="w-full text-sm text-left">
                 <thead className="text-xs text-gray-500 uppercase bg-gray-50 sticky top-0">
                   <tr>
                     <th className="px-4 py-3">優先度</th>
                     <th className="px-4 py-3">顧客名</th>
                     <th className="px-4 py-3">住所/メモ</th>
                   </tr>
                 </thead>
                 <tbody>
                   {crmData.map((target, i) => (
                     <tr key={i} className="border-b hover:bg-gray-50">
                       <td className="px-4 py-3 font-bold text-center">{target.priority}</td>
                       <td className="px-4 py-3 font-bold">{target.name}</td>
                       <td className="px-4 py-3 text-gray-500">
                         <div>{target.address}</div>
                         <div className="text-xs text-blue-500">{target.memo}</div>
                       </td>
                     </tr>
                   ))}
                 </tbody>
               </table>
               {crmData.length === 0 && <div className="text-center py-10 text-gray-400">データがありません</div>}
            </div>
          </div>
        </div>
      )}

      {/* 4. AI Camera Button & Modal */}
      <button
        onClick={() => setIsAiModalOpen(true)}
        className="fixed bottom-6 right-6 z-40 bg-[#1a1a1a] text-white w-16 h-16 rounded-full shadow-2xl hover:scale-110 transition-transform flex items-center justify-center border-4 border-white/20 group"
        style={{ boxShadow: '0 10px 30px -10px rgba(0,0,0,0.6)' }}
      >
        <span className="text-3xl group-hover:rotate-12 transition-transform">👁️</span>
      </button>

      <AICameraModal 
        isOpen={isAiModalOpen} 
        onClose={() => setIsAiModalOpen(false)} 
        onResult={(data) => {
           console.log("AI Result:", data);
           if(data.copper_ratio_estimate) {
             alert(`AI鑑定完了: ${data.category}\n推定歩留まり: ${data.copper_ratio_estimate}%`);
             setCalcValue(String(data.copper_ratio_estimate));
             setIsPosOpen(true);
             setIsAiModalOpen(false);
           }
        }} 
      />

    </div>
  );
}

// ==========================================
//  AI Camera Modal Component
// ==========================================
const AICameraModal = ({ isOpen, onClose, onResult }) => {
  const [image, setImage] = useState(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState(null);

  if (!isOpen) return null;

  const handleCapture = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result);
        runAnalysis(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const runAnalysis = async (base64Str) => {
    setAnalyzing(true);
    const rawBase64 = base64Str.replace(/^data:image\/\w+;base64,/, "");

    try {
      const res = await fetch(API_ENDPOINT, {
        method: 'POST',
        body: JSON.stringify({ action: 'analyze_image', image: rawBase64 })
      });
      const data = await res.json();
      
      if (data.error) {
        alert("解析エラー: " + data.error);
        setResult(null);
      } else {
        setResult(data);
        if(onResult) onResult(data);
      }
    } catch (e) {
      alert("通信エラー: " + e.message);
    } finally {
      setAnalyzing(false);
    }
  };

  const reset = () => {
    setImage(null);
    setResult(null);
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
      <div className="bg-white w-full max-w-md rounded-2xl overflow-hidden shadow-2xl relative">
        <button onClick={onClose} className="absolute top-4 right-4 text-white/80 hover:text-white z-10 bg-black/20 rounded-full p-1"><IconX /></button>
        
        <div className="bg-slate-900 text-white p-6 text-center">
          <h3 className="text-xl font-bold flex items-center justify-center gap-2">
            <IconZap /> AI Scrap Appraisal
          </h3>
          <p className="text-xs text-slate-400 mt-1">Gemini 1.5 Flash Powered</p>
        </div>

        <div className="p-6">
          {!image ? (
            <div className="text-center py-8">
              <label className="cursor-pointer bg-gradient-to-r from-[#D32F2F] to-[#b71c1c] text-white font-bold py-5 px-8 rounded-full shadow-lg hover:scale-105 transition-transform flex items-center justify-center gap-2 mx-auto w-full">
                <span className="text-2xl">📷</span> カメラを起動
                <input type="file" accept="image/*" capture="environment" className="hidden" onChange={handleCapture} />
              </label>
              <p className="mt-4 text-xs text-slate-500">※比較対象（タバコ等）を横に置くと精度UP</p>
            </div>
          ) : (
            <div>
              <div className="relative rounded-lg overflow-hidden mb-4 border border-slate-200 bg-black">
                <img src={image} alt="Preview" className="w-full h-64 object-contain" />
                {analyzing && (
                  <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center">
                    <div className="w-10 h-10 border-4 border-white border-t-transparent rounded-full animate-spin mb-2"></div>
                    <div className="text-white text-sm font-bold animate-pulse">Geminiが分析中...</div>
                  </div>
                )}
              </div>

              {result && (
                <div className="bg-green-50 border border-green-200 rounded-xl p-4 animate-in slide-in-from-bottom-4">
                  <div className="flex justify-between items-start border-b border-green-200 pb-2 mb-2">
                    <div>
                      <div className="text-[10px] text-green-700 font-bold uppercase">Detected Type</div>
                      <div className="text-lg font-black text-slate-900">{result.category}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-[10px] text-green-700 font-bold uppercase">Cu Ratio</div>
                      <div className="text-2xl font-black text-[#D32F2F]">{result.copper_ratio_estimate}<span className="text-sm">%</span></div>
                    </div>
                  </div>
                  <div className="text-xs text-slate-600 mb-4 bg-white/50 p-2 rounded">
                    💡 {result.reasoning}
                  </div>
                  <div className="flex gap-2">
                    <button onClick={onClose} className="flex-1 bg-slate-900 text-white py-3 rounded-lg font-bold text-sm">閉じる</button>
                    <button onClick={reset} className="px-4 py-3 text-slate-500 text-sm underline">撮り直す</button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
