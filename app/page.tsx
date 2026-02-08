'use client';

import React, { useState, useEffect, useRef } from 'react';
import { 
  TrendingUp, Truck, ShieldCheck, Zap, Menu, X, Smartphone, 
  MapPin, Clock, ChevronRight, Search, Calculator, Printer, User, LogOut
} from 'lucide-react';

// --- データ定義 (旧コードから移植) ---
const SYS_CONFIG = { market: 1350 }; // 初期の銅建値基準

// ランク定義
const RANKS = [
  { name: 'REGULAR', rate: 0.01, limit: 0, color: 'text-orange-700', bg: 'bg-orange-100', border: 'border-orange-200' },
  { name: 'GOLD', rate: 0.02, limit: 500000, color: 'text-yellow-600', bg: 'bg-yellow-50', border: 'border-yellow-200' },
  { name: 'PLATINUM', rate: 0.03, limit: 1000000, color: 'text-slate-900', bg: 'bg-slate-200', border: 'border-slate-300' }
];

// 商品データ (24品目完全移植)
const PRODUCTS = [
  { id:1, maker:'ピカ線', type:'特1号', ratio:98, eff:1.5, tag:'🌟高効率', tClass:'bg-pink-500' },
  { id:2, maker:'銅', type:'1号銅', ratio:97, eff:1.2, tag:'標準', tClass:'bg-blue-500' },
  { id:3, maker:'銅', type:'2号銅', ratio:95, eff:1.0, tag:'標準', tClass:'bg-blue-500' },
  { id:4, maker:'銅', type:'並銅', ratio:90, eff:1.0, tag:'標準', tClass:'bg-blue-500' },
  { id:5, maker:'住友', type:'CV (1本物)', ratio:55, eff:1.0, tag:'標準', tClass:'bg-blue-500' },
  { id:6, maker:'フジクラ', type:'CV (3芯)', ratio:52, eff:1.0, tag:'標準', tClass:'bg-blue-500' },
  { id:7, maker:'矢崎', type:'CVT', ratio:58, eff:1.0, tag:'標準', tClass:'bg-blue-500' },
  { id:8, maker:'矢崎', type:'IV (太)', ratio:48, eff:1.0, tag:'標準', tClass:'bg-blue-500' },
  { id:9, maker:'その他', type:'IV (中)', ratio:45, eff:1.0, tag:'標準', tClass:'bg-blue-500' },
  { id:10, maker:'その他', type:'IV (細)', ratio:42, eff:0.8, tag:'手間', tClass:'bg-gray-500' },
  { id:11, maker:'その他', type:'VVF (VA)', ratio:40, eff:1.0, tag:'標準', tClass:'bg-blue-500' },
  { id:12, maker:'その他', type:'雑線 (上)', ratio:40, eff:0.8, tag:'標準', tClass:'bg-blue-500' },
  { id:13, maker:'その他', type:'雑線 (下)', ratio:30, eff:0.5, tag:'⚠️手間', tClass:'bg-gray-500' },
  { id:14, maker:'自動車', type:'ハーネス', ratio:42, eff:0.8, tag:'標準', tClass:'bg-blue-500' },
  { id:15, maker:'通信', type:'通信ケーブル', ratio:35, eff:0.5, tag:'⚠️手間', tClass:'bg-gray-500' },
  { id:16, maker:'給湯器', type:'釜 (銅)', ratio:70, eff:0.5, tag:'⚠️手間', tClass:'bg-gray-500' },
  { id:17, maker:'工業用', type:'モーター', ratio:15, eff:0.5, tag:'標準', tClass:'bg-blue-500' },
  { id:18, maker:'黄銅', type:'真鍮', ratio:60, eff:1.0, tag:'標準', tClass:'bg-blue-500' },
  { id:19, maker:'青銅', type:'砲金', ratio:80, eff:1.0, tag:'標準', tClass:'bg-blue-500' },
  { id:20, maker:'アルミ', type:'サッシ', ratio:90, eff:1.0, tag:'標準', tClass:'bg-blue-500' },
  { id:21, maker:'アルミ', type:'ホイール', ratio:95, eff:1.0, tag:'標準', tClass:'bg-blue-500' },
  { id:22, maker:'SUS', type:'ステンレス', ratio:99, eff:1.0, tag:'標準', tClass:'bg-blue-500' },
  { id:23, maker:'鉛', type:'鉛', ratio:99, eff:1.0, tag:'標準', tClass:'bg-blue-500' },
  { id:24, maker:'車', type:'バッテリー', ratio:50, eff:1.0, tag:'標準', tClass:'bg-blue-500' }
];

// --- メインコンポーネント ---
export default function LandingPage() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  // システム状態
  const [isPosOpen, setIsPosOpen] = useState(false);
  const [marketPrice, setMarketPrice] = useState(SYS_CONFIG.market);
  const [activeTab, setActiveTab] = useState('pika');

  // ユーザー状態 (Local Storageの代わり)
  const [user, setUser] = useState<any>(null);
  const [loginModalOpen, setLoginModalOpen] = useState(false);
  const [loginTab, setLoginTab] = useState<'login' | 'register'>('login');
  const [loginId, setLoginId] = useState('');
  const [loginPw, setLoginPw] = useState('');

  // POSカート状態
  const [cart, setCart] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [calcValue, setCalcValue] = useState('0');
  const [calcModalOpen, setCalcModalOpen] = useState(false);
  const [usedPoints, setUsedPoints] = useState(0);

  // 初期化 & スクロール検知
  useEffect(() => {
    // 擬似的な相場変動ロジック (Live Market Simulation)
    const timer = setInterval(() => {
      const fluctuation = Math.floor(Math.random() * 20) - 10;
      setMarketPrice(prev => prev + fluctuation);
    }, 10000);

    // ユーザー情報の復元
    const storedUser = localStorage.getItem('tsukisamu_user');
    if (storedUser) setUser(JSON.parse(storedUser));

    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
      clearInterval(timer);
    };
  }, []);

  // --- ロジック関数 ---

  // ランク計算
  const getRankInfo = (score: number) => {
    let current = RANKS[0], next = RANKS[1];
    for(let i=0; i<RANKS.length; i++) {
        if(score >= RANKS[i].limit) { current=RANKS[i]; next=RANKS[i+1]||null; }
    }
    return { current, next };
  };

  // ログイン処理
  const handleLogin = () => {
    if(loginId==='user' && loginPw==='user') {
      const u = { name:'山田建設', id:'u01', points:12500, monthScore:650000 };
      setUser(u);
      localStorage.setItem('tsukisamu_user', JSON.stringify(u));
      setLoginModalOpen(false);
    } else {
      alert('ID/Passが違います (test: user/user)');
    }
  };

  // 登録処理 (招待制)
  const handleRegister = (code: string, name: string) => {
    if(code === 'FIRST-DEAL') {
      const u = { name: name, id:'new', points:500, monthScore:0 };
      setUser(u);
      localStorage.setItem('tsukisamu_user', JSON.stringify(u));
      setLoginModalOpen(false);
      alert('認証成功！会員登録が完了しました。');
    } else {
      alert('招待コードが無効です');
    }
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('tsukisamu_user');
    setCart([]);
  };

  // POS計算
  const addToCart = () => {
    const w = parseFloat(calcValue);
    if(w > 0 && selectedProduct) {
      const unit = Math.floor(marketPrice * (selectedProduct.ratio/100));
      setCart([...cart, { ...selectedProduct, weight:w, unit:unit, subtotal:Math.floor(w*unit) }]);
      setCalcModalOpen(false);
      setCalcValue('0');
    }
  };

  const handleCalcInput = (v: string) => {
    if(v === '.' && calcValue.includes('.')) return;
    setCalcValue(prev => prev === '0' && v !== '.' ? v : prev + v);
  };

  // 集計
  const subTotal = cart.reduce((a,b) => a + b.subtotal, 0);
  const tax = Math.floor(subTotal * 0.1);
  const total = subTotal + tax - usedPoints;
  const rankInfo = user ? getRankInfo(user.monthScore) : { current: RANKS[0] };
  const earnPoints = Math.floor(subTotal * rankInfo.current.rate);

  // --- 表示コンポーネント ---

  return (
    <div className={`min-h-screen font-sans selection:bg-orange-200 ${isPosOpen ? 'overflow-hidden h-screen' : 'bg-slate-50'}`}>
      
      {/* 1. 通常サイト (Landing Page) */}
      <div className={isPosOpen ? 'hidden' : 'block'}>
        <header className={`fixed top-0 w-full z-40 transition-all duration-300 ${isScrolled ? 'bg-white/90 backdrop-blur-md shadow-sm py-2' : 'bg-transparent py-4'}`}>
          <div className="container mx-auto px-4 md:px-6">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-orange-600 rounded-sm flex items-center justify-center text-white font-bold">T</div>
                <span className="text-lg font-bold tracking-tight text-slate-900">
                  TSUKISAMU <span className="font-light text-slate-500">TOMAKOMAI</span>
                </span>
              </div>

              <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-600">
                <a href="#about" className="hover:text-orange-600">選ばれる理由</a>
                <a href="#items" className="hover:text-orange-600">買取品目</a>
                <a href="#company" className="hover:text-orange-600">会社概要</a>
                
                {user ? (
                  <div className="flex items-center gap-2 bg-slate-100 px-3 py-1 rounded-full text-xs font-bold">
                    <span className={`w-2 h-2 rounded-full ${rankInfo.current.bg.replace('bg-', 'bg-')}-500`}></span>
                    {user.name}様
                  </div>
                ) : (
                  <button onClick={() => { setLoginModalOpen(true); }} className="text-xs font-bold underline">
                    パートナーログイン
                  </button>
                )}

                <button onClick={() => setIsPosOpen(true)} className="bg-slate-900 text-white px-5 py-2.5 rounded-full hover:bg-slate-800 transition-all flex items-center gap-2 text-sm shadow-lg">
                  <Calculator size={16} />
                  Web査定・買取POS
                </button>
              </nav>
              
              <button className="md:hidden p-2" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
                {mobileMenuOpen ? <X /> : <Menu />}
              </button>
            </div>
          </div>
          
          {/* Ticker */}
          <div className="w-full bg-slate-900 text-slate-400 text-xs py-1.5 overflow-hidden border-t border-slate-800 mt-2 md:mt-4">
            <div className="flex gap-8 items-center justify-center md:justify-start px-4">
              <span className="flex items-center gap-1"><span className="text-orange-500">●</span> LME COPPER: $12,821/t (+1.2%)</span>
              <span className="hidden md:inline text-slate-700">|</span>
              <span className="flex items-center gap-1 text-white font-bold">本日の銅建値: ¥{marketPrice.toLocaleString()}/t</span>
            </div>
          </div>
        </header>

        {/* Hero */}
        <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 px-4 bg-slate-900 text-white overflow-hidden">
            <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1605517476562-b9247346b0a6?auto=format&fit=crop&q=80')] bg-cover bg-center opacity-40"></div>
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent"></div>
            
            <div className="container mx-auto relative z-10 text-center">
                <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-6 leading-tight">
                    繋げ、未来へ。
                </h1>
                <p className="text-lg md:text-xl text-slate-300 mb-8 max-w-2xl mx-auto">
                    資源を価値に変える、確かな目利き。創業60年の実績。<br/>
                    苫小牧工場から、循環型社会の最前線へ。
                </p>
                <div className="flex flex-wrap justify-center gap-4 mb-10">
                    {['創業1961年', '自社ナゲット工場', '北海道全域対応'].map(tag => (
                        <span key={tag} className="px-4 py-1 border border-white/30 rounded-full text-sm backdrop-blur-sm bg-white/10">
                            {tag}
                        </span>
                    ))}
                </div>
                <button onClick={() => setIsPosOpen(true)} className="bg-orange-600 hover:bg-orange-500 text-white px-8 py-4 rounded-lg font-bold text-lg shadow-xl shadow-orange-900/20 transition-all transform hover:scale-105">
                    今すぐ買取単価を確認する
                </button>
            </div>
        </section>

        {/* Invitation Only Banner */}
        <div className="bg-white py-16 px-4 border-b border-slate-200">
            <div className="max-w-4xl mx-auto bg-gradient-to-br from-slate-800 to-black text-white rounded-2xl p-8 md:p-12 shadow-2xl relative overflow-hidden">
                <div className="relative z-10">
                    <span className="bg-[#d4af37] text-black text-xs font-extrabold px-3 py-1 rounded mb-4 inline-block tracking-widest">INVITATION ONLY</span>
                    <h2 className="text-3xl md:text-4xl font-bold mb-6">会員権は、<br/>最初の取引で手に入れる。</h2>
                    <p className="text-slate-300 mb-6 leading-relaxed">
                        当社では、安易な会員募集を行っておりません。一度お取引をいただき、プロフェッショナルとしての信頼関係が築けたお客様だけに、<strong>「会員認証コード」</strong>を発行しております。
                    </p>
                    <p className="text-slate-300 mb-8 leading-relaxed">
                        2回目以降のお取引から、<strong>会員限定の特別単価</strong>と<strong>最大3%のポイント還元</strong>が適用されます。まずは初回、ゲストとしてお持ち込みください。
                    </p>
                    <button onClick={() => setIsPosOpen(true)} className="bg-white text-slate-900 px-6 py-3 rounded-lg font-bold hover:bg-slate-100 transition-colors">
                        まずはゲストで試算する
                    </button>
                </div>
                <div className="absolute -right-10 -bottom-10 text-9xl font-black text-white/5 select-none">VIP</div>
            </div>
        </div>

        {/* Items Section */}
        <section id="items" className="py-20 bg-slate-50">
            <div className="container mx-auto px-4">
                <h2 className="text-3xl font-bold text-center mb-12 text-slate-900">主な買取品目</h2>
                
                {/* Tabs */}
                <div className="flex justify-center gap-2 mb-8 flex-wrap">
                    {[
                        {id:'pika', label:'ピカ線'}, {id:'cv', label:'CVケーブル'}, 
                        {id:'iv', label:'IV線'}, {id:'mix', label:'雑線・その他'}
                    ].map(tab => (
                        <button 
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`px-6 py-2 rounded-full font-bold transition-all ${activeTab === tab.id ? 'bg-orange-600 text-white shadow-lg' : 'bg-white text-slate-600 border border-slate-200 hover:bg-orange-50'}`}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>

                {/* Tab Content */}
                <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-sm border border-slate-100 p-6 md:p-10 animate-fade-in">
                    {activeTab === 'pika' && (
                        <div className="flex flex-col md:flex-row gap-8 items-start">
                            <img src="https://images.unsplash.com/photo-1549106965-02b4d9622d0b?auto=format&fit=crop&q=80" className="w-full md:w-1/2 rounded-lg object-cover h-64 shadow-md" alt="ピカ線"/>
                            <div>
                                <h3 className="text-2xl font-bold mb-4 border-l-4 border-orange-600 pl-4">ピカ線 (特1号銅線)</h3>
                                <p className="text-slate-600 mb-6 leading-relaxed">被覆を取り除いた純粋な銅線で、直径1.3mm以上のもの。表面に劣化やメッキがなく、光沢がある状態のものが最高値となります。</p>
                                <div className="bg-yellow-50 text-yellow-800 p-4 rounded-lg text-sm font-bold border border-yellow-100">
                                    【ポイント】酸化して黒ずんでいる場合や、エナメル線、スズメッキ線は別品目となります。
                                </div>
                            </div>
                        </div>
                    )}
                    {activeTab === 'cv' && (
                        <div className="flex flex-col md:flex-row gap-8 items-start">
                             <img src="https://images.unsplash.com/photo-1558346490-a72e53ae2d4f?auto=format&fit=crop&q=80" className="w-full md:w-1/2 rounded-lg object-cover h-64 shadow-md" alt="CV"/>
                            <div>
                                <h3 className="text-2xl font-bold mb-4 border-l-4 border-orange-600 pl-4">CV/CVTケーブル</h3>
                                <p className="text-slate-600 mb-6 leading-relaxed">高圧電力用ケーブル。銅率が高く、被覆も剥きやすいため高価買取対象です。単芯(1C)か3芯(3C)か、またサイズ(sq)によって銅率が変わります。</p>
                                <div className="bg-yellow-50 text-yellow-800 p-4 rounded-lg text-sm font-bold border border-yellow-100">
                                    【ポイント】自社ナゲット機があるため、被覆がついたままで高価買取可能です。
                                </div>
                            </div>
                        </div>
                    )}
                    {/* 他のタブも同様に実装可能だが省略 */}
                    {(activeTab !== 'pika' && activeTab !== 'cv') && (
                        <div className="text-center py-10 text-slate-500">
                            他の品目詳細も同様に表示されます...
                        </div>
                    )}
                </div>
            </div>
        </section>

        {/* Company Info */}
        <section id="company" className="py-20 bg-white">
            <div className="container mx-auto px-4 max-w-3xl">
                <h2 className="text-3xl font-bold text-center mb-12 text-slate-900">会社概要</h2>
                <div className="overflow-hidden rounded-xl border border-slate-200">
                    <table className="w-full text-left border-collapse">
                        <tbody>
                            <tr className="border-b border-slate-100"><th className="p-4 bg-slate-50 font-bold w-1/3">社名</th><td className="p-4">株式会社月寒製作所 苫小牧工場</td></tr>
                            <tr className="border-b border-slate-100"><th className="p-4 bg-slate-50 font-bold">所在地</th><td className="p-4">〒053-0001 北海道苫小牧市一本松町9-6</td></tr>
                            <tr className="border-b border-slate-100"><th className="p-4 bg-slate-50 font-bold">電話番号</th><td className="p-4">0144-55-5544</td></tr>
                            <tr><th className="p-4 bg-slate-50 font-bold">事業内容</th><td className="p-4">電線・非鉄金属リサイクル、銅ナゲット製造、分電盤製造</td></tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </section>

        <footer className="bg-slate-950 text-slate-400 py-12 border-t border-slate-900 text-center text-sm">
            <p>&copy; 2026 Tsukisamu Seisakusho Co., Ltd. Tomakomai Factory.</p>
        </footer>
      </div>

      {/* 2. POSシステム (Full Screen Overlay) */}
      {isPosOpen && (
        <div className="fixed inset-0 z-50 bg-slate-100 flex flex-col animate-in slide-in-from-bottom duration-300">
          {/* POS Header */}
          <div className="bg-white border-b border-slate-200 p-4 flex justify-between items-center shadow-sm">
            <div className="flex items-center gap-2">
                <div className="font-black text-xl text-orange-600 tracking-tight">TSUKISAMU <span className="text-slate-400 font-light">POS</span></div>
            </div>
            <div className="flex items-center gap-4">
                <div className="text-right hidden sm:block">
                    <div className="text-[10px] text-slate-500 font-bold uppercase">Current Market</div>
                    <div className="font-mono font-bold text-slate-900">¥{marketPrice.toLocaleString()}</div>
                </div>
                <button onClick={() => setIsPosOpen(false)} className="bg-slate-200 p-2 rounded-full hover:bg-slate-300 transition-colors">
                    <X size={20} className="text-slate-600"/>
                </button>
            </div>
          </div>

          <div className="flex-1 flex overflow-hidden">
            {/* Sidebar (PC Only) */}
            <div className="w-72 bg-white border-r border-slate-200 hidden md:flex flex-col p-6 overflow-y-auto">
                {user ? (
                    <div className={`rounded-xl p-6 text-slate-900 shadow-lg mb-6 border ${rankInfo.current.bg} ${rankInfo.current.border}`}>
                        <div className="flex justify-between items-start mb-4">
                            <span className="font-bold text-xs tracking-widest opacity-70">MEMBER CARD</span>
                            <span className={`text-[10px] font-black px-2 py-1 bg-white/50 rounded ${rankInfo.current.color}`}>{rankInfo.current.name}</span>
                        </div>
                        <div className="font-bold text-lg mb-1">{user.name}</div>
                        <div className="text-xs text-slate-500 mb-6">ID: {user.id}</div>
                        
                        <div className="mb-1 text-xs font-bold text-slate-500">保有ポイント</div>
                        <div className="font-mono text-3xl font-black mb-4">{user.points.toLocaleString()}<span className="text-sm font-normal ml-1">pt</span></div>
                        
                        <div className="w-full bg-black/5 h-1.5 rounded-full overflow-hidden">
                            <div className="bg-slate-900 h-full" style={{ width: rankInfo.next ? `${(user.monthScore/rankInfo.next.limit)*100}%` : '100%' }}></div>
                        </div>
                        <div className="text-right text-[10px] mt-2 text-slate-500">
                            {rankInfo.next ? `あと ${(rankInfo.next.limit - user.monthScore).toLocaleString()}pt でランクアップ` : '最高ランク到達'}
                        </div>
                    </div>
                ) : (
                    <div className="bg-slate-50 rounded-xl p-6 text-center mb-6 border border-slate-200">
                        <User size={32} className="mx-auto text-slate-300 mb-3" />
                        <p className="text-sm text-slate-500 mb-4">ログインすると会員価格・ポイント機能が利用できます</p>
                        <button onClick={() => setLoginModalOpen(true)} className="w-full bg-white border border-slate-300 font-bold py-2 rounded-lg text-sm hover:bg-slate-50">
                            ログイン / 認証
                        </button>
                    </div>
                )}
                
                {user && (
                     <button onClick={handleLogout} className="flex items-center gap-2 text-slate-400 text-sm hover:text-slate-600 mt-auto">
                        <LogOut size={16} /> ログアウト
                    </button>
                )}
            </div>

            {/* Main Area */}
            <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
                {/* Product Grid */}
                <div className="flex-1 p-4 md:p-6 overflow-y-auto bg-slate-50/50">
                    <div className="relative mb-6">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                        <input 
                            type="text" 
                            placeholder="品名・メーカーで検索..." 
                            className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-orange-500 bg-white"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                    
                    <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                        {PRODUCTS.filter(p => 
                            p.type.includes(searchQuery) || p.maker.includes(searchQuery)
                        ).map(p => {
                            const unitPrice = Math.floor(marketPrice * (p.ratio/100));
                            return (
                                <button 
                                    key={p.id}
                                    onClick={() => { setSelectedProduct(p); setCalcModalOpen(true); }}
                                    className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm hover:shadow-md hover:border-orange-300 transition-all text-left group relative overflow-hidden"
                                >
                                    <span className={`absolute top-0 right-0 text-[10px] font-bold text-white px-2 py-0.5 rounded-bl-lg ${p.tClass.replace('bg-', 'bg-')}`}>
                                        {p.tag}
                                    </span>
                                    <div className="text-xs text-slate-400 mb-1">{p.maker}</div>
                                    <div className="font-bold text-slate-800 mb-3 group-hover:text-orange-600">{p.type}</div>
                                    <div className="flex items-end justify-between">
                                        <div className="font-mono text-lg font-bold text-slate-900">¥{unitPrice.toLocaleString()}</div>
                                        <div className="text-[10px] text-slate-400">/kg</div>
                                    </div>
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* Cart Area */}
                <div className="w-full md:w-80 bg-white border-l border-slate-200 flex flex-col h-[40vh] md:h-auto shadow-xl z-20">
                    <div className="p-4 border-b border-slate-100 font-bold flex justify-between items-center bg-slate-50">
                        <span>見積カート</span>
                        <button onClick={() => setCart([])} className="text-xs text-red-500 hover:text-red-600">クリア</button>
                    </div>
                    
                    <div className="flex-1 overflow-y-auto p-4 space-y-3">
                        {cart.length === 0 ? (
                            <div className="text-center text-slate-400 py-10 text-sm">商品を選択してください</div>
                        ) : (
                            cart.map((item, idx) => (
                                <div key={idx} className="flex justify-between items-center text-sm border-b border-slate-50 pb-2">
                                    <div>
                                        <div className="font-bold text-slate-700">{item.type}</div>
                                        <div className="text-xs text-slate-400">{item.weight}kg × @{item.unit}</div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <div className="font-mono font-bold">¥{item.subtotal.toLocaleString()}</div>
                                        <button onClick={() => {
                                            const newCart = [...cart];
                                            newCart.splice(idx, 1);
                                            setCart(newCart);
                                        }} className="text-slate-300 hover:text-red-500">×</button>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>

                    <div className="p-4 bg-slate-50 border-t border-slate-200 space-y-2">
                        {user && (
                            <div className="flex gap-2 mb-2">
                                <input 
                                    type="number" 
                                    placeholder="利用pt" 
                                    className="w-20 px-2 py-1 text-sm border rounded"
                                    onChange={(e) => setUsedPoints(Number(e.target.value))} 
                                />
                                <div className="text-xs flex items-center text-slate-500">ポイント利用</div>
                            </div>
                        )}
                        <div className="flex justify-between text-xs text-slate-500"><span>小計</span><span>¥{subTotal.toLocaleString()}</span></div>
                        <div className="flex justify-between text-xs text-slate-500"><span>消費税(10%)</span><span>¥{tax.toLocaleString()}</span></div>
                        {usedPoints > 0 && <div className="flex justify-between text-xs text-red-500"><span>ポイント値引</span><span>-¥{usedPoints.toLocaleString()}</span></div>}
                        
                        <div className="flex justify-between items-end pt-2 border-t border-slate-200 mt-2">
                            <span className="font-bold text-slate-700">合計支払額</span>
                            <span className="font-mono text-2xl font-black text-orange-600">¥{total.toLocaleString()}</span>
                        </div>
                        
                        <div className="text-right text-[10px] text-orange-500 font-bold">
                            {user ? `今回付与予定: ${earnPoints} pt` : '会員登録でポイント付与'}
                        </div>

                        <button 
                            onClick={() => window.print()}
                            className="w-full bg-slate-900 text-white py-3 rounded-lg font-bold mt-2 hover:bg-slate-800 flex items-center justify-center gap-2"
                        >
                            <Printer size={16} /> 買取明細書を発行
                        </button>
                    </div>
                </div>
            </div>
          </div>

          {/* Calculator Modal */}
          {calcModalOpen && (
            <div className="fixed inset-0 z-[60] bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
                <div className="bg-white rounded-2xl w-full max-w-xs shadow-2xl overflow-hidden">
                    <div className="p-4 bg-slate-50 border-b border-slate-100 text-center">
                        <div className="text-xs text-slate-500 mb-1">{selectedProduct?.maker}</div>
                        <h3 className="font-bold text-lg">{selectedProduct?.type}</h3>
                    </div>
                    <div className="p-6">
                        <div className="mb-6 text-right">
                            <div className="text-xs text-slate-400 mb-1">重量 (kg)</div>
                            <div className="text-4xl font-mono font-black text-orange-600 border-b-2 border-orange-100 pb-1">{calcValue}</div>
                        </div>
                        <div className="grid grid-cols-3 gap-3 mb-6">
                            {[7,8,9,4,5,6,1,2,3].map(n => (
                                <button key={n} onClick={() => handleCalcInput(n.toString())} className="h-12 rounded-lg bg-slate-50 font-bold text-lg hover:bg-slate-100 text-slate-700 border border-slate-200">
                                    {n}
                                </button>
                            ))}
                            <button onClick={() => handleCalcInput('0')} className="col-span-2 h-12 rounded-lg bg-slate-50 font-bold text-lg hover:bg-slate-100 text-slate-700 border border-slate-200">0</button>
                            <button onClick={() => handleCalcInput('.')} className="h-12 rounded-lg bg-slate-50 font-bold text-lg hover:bg-slate-100 text-slate-700 border border-slate-200">.</button>
                        </div>
                        <div className="flex gap-3">
                            <button onClick={() => { setCalcModalOpen(false); setCalcValue('0'); }} className="flex-1 py-3 rounded-xl border border-slate-300 font-bold text-slate-600">取消</button>
                            <button onClick={addToCart} className="flex-1 py-3 rounded-xl bg-orange-600 text-white font-bold shadow-lg shadow-orange-200">決定</button>
                        </div>
                    </div>
                </div>
            </div>
          )}

          {/* Login Modal */}
          {loginModalOpen && (
            <div className="fixed inset-0 z-[60] bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
                <div className="bg-white rounded-2xl w-full max-w-sm shadow-2xl p-6">
                    <div className="flex gap-4 border-b border-slate-100 pb-4 mb-4">
                        <button onClick={() => setLoginTab('login')} className={`flex-1 pb-2 border-b-2 font-bold ${loginTab==='login' ? 'border-orange-600 text-orange-600' : 'border-transparent text-slate-400'}`}>ログイン</button>
                        <button onClick={() => setLoginTab('register')} className={`flex-1 pb-2 border-b-2 font-bold ${loginTab==='register' ? 'border-orange-600 text-orange-600' : 'border-transparent text-slate-400'}`}>初回認証</button>
                    </div>
                    
                    {loginTab === 'login' ? (
                        <div className="space-y-4">
                            <input type="text" placeholder="ID" className="w-full p-3 border rounded-lg bg-slate-50" value={loginId} onChange={e=>setLoginId(e.target.value)} />
                            <input type="password" placeholder="Password" className="w-full p-3 border rounded-lg bg-slate-50" value={loginPw} onChange={e=>setLoginPw(e.target.value)} />
                            <button onClick={handleLogin} className="w-full bg-slate-900 text-white py-3 rounded-lg font-bold">ログイン</button>
                            <div className="text-center text-xs text-slate-400">Test ID: user / Pass: user</div>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            <div className="bg-orange-50 text-orange-800 p-3 rounded text-xs">⚠️ 初回取引時のレシートに記載された「取引No.」が必要です。</div>
                            <input type="text" id="regName" placeholder="貴社名" className="w-full p-3 border rounded-lg bg-slate-50" />
                            <input type="text" id="regCode" placeholder="取引No. (例: FIRST-DEAL)" className="w-full p-3 border rounded-lg bg-slate-50" />
                            <button onClick={() => handleRegister((document.getElementById('regCode') as HTMLInputElement).value, (document.getElementById('regName') as HTMLInputElement).value)} className="w-full bg-orange-600 text-white py-3 rounded-lg font-bold">認証して登録</button>
                        </div>
                    )}
                    <button onClick={() => setLoginModalOpen(false)} className="w-full mt-4 text-sm text-slate-500">閉じる</button>
                </div>
            </div>
          )}

        </div>
      )}

      {/* Print Styles (Hidden in normal view) */}
      <style jsx global>{`
        @media print {
            body * { visibility: hidden; }
            .w-full.md\\:w-80, .w-full.md\\:w-80 * { visibility: visible; }
            .w-full.md\\:w-80 { position: absolute; left: 0; top: 0; width: 100%; height: auto; border: none; }
            button { display: none !important; }
        }
      `}</style>
    </div>
  );
}
