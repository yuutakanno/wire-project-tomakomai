// @ts-nocheck
/* eslint-disable */
'use client';

import React, { useState, useEffect } from 'react';

// ==========================================
//  設定エリア (燃料パイプ)
// ==========================================
// ※ここがズレていると「通信エラー」になります
const API_ENDPOINT = "https://script.google.com/macros/s/AKfycbyfYM8q6t7Q7UwIRORFBNOCA-mMpVFE1Z3oLzCJp5GNiYI9_CMy4767p9am2iMY70kl/exec";

// --- アイコン (外部依存なし) ---
const IconPhone = () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>;
const IconMenu = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>;
const IconX = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>;
const IconCalculator = () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="4" y="2" width="16" height="20" rx="2"></rect><line x1="8" y1="6" x2="16" y2="6"></line><line x1="16" y1="14" x2="16" y2="18"></line><path d="M16 10h.01"></path><path d="M12 10h.01"></path><path d="M8 10h.01"></path><path d="M12 14h.01"></path><path d="M8 14h.01"></path><path d="M12 18h.01"></path><path d="M8 18h.01"></path></svg>;
const IconLogOut = () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>;
const IconChevronDown = ({className}) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><polyline points="6 9 12 15 18 9"></polyline></svg>;
const IconAward = () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="8" r="7"></circle><polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"></polyline></svg>;

// --- データ定義 ---
// 通信失敗時用のフォールバックデータ（ここが表示されている＝通信エラー）
const FALLBACK_MARKET = 1350; 
const FALLBACK_PRODUCTS = [
  { id:1, name:'ピカ線 (1号銅線)', category:'pika', desc:'【通信エラー中】サンプルデータ表示中', ratio:98, priceMin:1300, priceMax:1450, tag:'通信エラー', specs:[], image:'https://images.unsplash.com/photo-1605517476562-b9247346b0a6?auto=format&fit=crop&q=80' },
  { id:2, name:'CV・CVTケーブル', category:'cv', desc:'【通信エラー中】サンプルデータ表示中', ratio:65, priceMin:1100, priceMax:1450, tag:'通信エラー', specs:[], image:'https://images.unsplash.com/photo-1558346490-a72e53ae2d4f?auto=format&fit=crop&q=80' },
];

// 会員ランク定義
const RANKS = [
  { name: 'REGULAR', limit: 0, pointRate: 0.005, color: 'text-gray-600', bg: 'bg-gray-100', border: 'border-gray-300' },
  { name: 'GOLD', limit: 500000, pointRate: 0.01, color: 'text-yellow-600', bg: 'bg-yellow-50', border: 'border-yellow-400' },
  { name: 'PLATINUM', limit: 2000000, pointRate: 0.02, color: 'text-slate-900', bg: 'bg-slate-200', border: 'border-slate-800' }
];

const FAQ_ITEMS = [
  { q: "どんな電線でも買取できますか？", a: "基本的に銅を含む電線であれば買取可能です。ただし、アルミ電線のみ（銅なし）や、鉛被覆電線、極端に汚れがひどいものは対象外となる場合があります。" },
  { q: "少量でも買取してもらえますか？", a: "はい、可能です。持込買取は100kgから、出張買取は500kgから対応しております。少量の場合はまとめてお持ち込みいただくとお得です。" },
  { q: "会員登録の方法は？", a: "「完全招待制」となっております。初回のお取引完了時、レシートに記載された招待コードを使ってアカウントを作成いただけます。" },
];

export default function LandingPage() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  // システム状態
  const [isPosOpen, setIsPosOpen] = useState(false);
  const [marketPrice, setMarketPrice] = useState(FALLBACK_MARKET);
  const [isLoadingMarket, setIsLoadingMarket] = useState(false);
  const [products, setProducts] = useState(FALLBACK_PRODUCTS); // 商品リストも動的に
  
  // ユーザー状態
  const [user, setUser] = useState(null);
  const [loginModalOpen, setLoginModalOpen] = useState(false);
  const [loginTab, setLoginTab] = useState('login');
  const [loginId, setLoginId] = useState('');
  const [loginPw, setLoginPw] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  
  // POSカート・計算状態
  const [cart, setCart] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [calcValue, setCalcValue] = useState('0');
  const [calcModalOpen, setCalcModalOpen] = useState(false);
  const [isSorted, setIsSorted] = useState(false);
  const [usedPoints, setUsedPoints] = useState(0);
  
  // UI状態
  const [activeTab, setActiveTab] = useState('pika'); // カテゴリ制御用（GAS側と合わせる必要あり）
  const [activeFaq, setActiveFaq] = useState(null);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);

    // 1. スプレッドシートから全データ（相場・商品）を取得
    const fetchSystemData = async () => {
      setIsLoadingMarket(true);
      try {
        // 並列で取得
        const [priceRes, productRes] = await Promise.all([
            fetch(`${API_ENDPOINT}?action=get_market_price`, { mode: 'cors' }),
            fetch(`${API_ENDPOINT}?action=get_products`, { mode: 'cors' })
        ]);

        if (priceRes.ok) {
          const data = await priceRes.json();
          if (data && data.price) setMarketPrice(data.price);
        }

        if (productRes.ok) {
            const pData = await productRes.json();
            if (pData && pData.products && pData.products.length > 0) {
                setProducts(pData.products);
                // カテゴリ初期値を最初の商品に合わせる
                if(pData.products[0].category) setActiveTab(pData.products[0].category);
            }
        }

      } catch (e) {
        console.warn("System Data Fetch Failed, switching to simulation mode.", e);
        // フォールバック維持
      } finally {
        setIsLoadingMarket(false);
      }
    };

    fetchSystemData();

    // 2. ログイン状態の自動復元
    try {
      const storedUser = localStorage.getItem('tsukisamu_user');
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    } catch (e) {
      console.error("Login restore failed", e);
    }

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const getRankInfo = (score) => {
    let current = RANKS[0], next = RANKS[1];
    for(let i=0; i<RANKS.length; i++) {
        if(score >= RANKS[i].limit) { current=RANKS[i]; next=RANKS[i+1]||null; }
    }
    return { current, next };
  };

  const handleLogin = async () => {
    setIsLoggingIn(true);
    try {
      const res = await fetch(`${API_ENDPOINT}?action=login&id=${loginId}&pw=${loginPw}`, { mode: 'cors' });
      if (res.ok) {
        const data = await res.json();
        if (data && data.success) {
          const u = data.user;
          setUser(u);
          localStorage.setItem('tsukisamu_user', JSON.stringify(u));
          setLoginModalOpen(false);
          setIsLoggingIn(false);
          return;
        } else {
            alert('ログイン失敗: IDまたはパスワードが間違っています。');
        }
      }
    } catch (e) {
      console.warn("API Login Failed", e);
      alert('通信エラー: サーバーに接続できませんでした。');
    }
    setIsLoggingIn(false);
  };

  const handleRegister = (code, name) => {
    if(code === 'FIRST-DEAL') {
      const u = { name: name, id:'new_member', points:1000, monthScore:0, qualityScore: 50 };
      setUser(u);
      localStorage.setItem('tsukisamu_user', JSON.stringify(u));
      setLoginModalOpen(false);
      alert('認証成功！会員登録が完了しました。\n初回特典: 1000pt 付与');
    } else {
      alert('招待コードが無効です。\n初回取引時のレシートをご確認ください。');
    }
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
      let unit = Math.floor(marketPrice * (selectedProduct.ratio/100));
      if (isSorted) unit = Math.floor(unit * 1.02);
      setCart([...cart, { ...selectedProduct, weight: w, unit: unit, subtotal: Math.floor(w * unit), sorted: isSorted }]);
      setCalcModalOpen(false);
      setCalcValue('0');
      setIsSorted(false);
    }
  };

  const handleCalcInput = (v) => {
    if(v === '.' && calcValue.includes('.')) return;
    setCalcValue(prev => prev === '0' && v !== '.' ? v : prev + v);
  };

  const subTotal = cart.reduce((a,b) => a + b.subtotal, 0);
  const tax = Math.floor(subTotal * 0.1);
  const total = subTotal + tax - (usedPoints || 0); 
  const rankInfo = user ? getRankInfo(user.monthScore) : { current: RANKS[0] };
  const earnPoints = Math.floor(subTotal * rankInfo.current.pointRate);

  // カテゴリのユニークリスト作成（重複排除）
  const categories = Array.from(new Set(products.map(p => p.category || p.maker))).filter(Boolean);

  return (
    <div className="min-h-screen font-sans text-[#1a1a1a] bg-white">
      
      {/* Header */}
      <header className={`fixed top-0 w-full z-40 transition-all duration-300 border-b ${isScrolled ? 'bg-white/95 backdrop-blur shadow-md py-2' : 'bg-white py-4 border-[#e0e0e0]'}`}>
        <div className="container mx-auto px-4 md:px-6 flex justify-between items-center">
          <div className="flex flex-col">
            <h1 className="text-xl font-bold tracking-tight text-[#1a1a1a] leading-tight">
              株式会社月寒製作所<br/>
              <span className="text-sm text-[#D32F2F] font-bold">苫小牧工場</span>
            </h1>
          </div>
          <nav className="hidden lg:flex items-center gap-6 text-sm font-bold text-[#1a1a1a]">
            <a href="#features" className="hover:text-[#D32F2F]">特徴</a>
            <a href="#items" className="hover:text-[#D32F2F]">買取品目</a>
            <a href="#process" className="hover:text-[#D32F2F]">流れ</a>
            {user ? (
              <div className="flex items-center gap-4 ml-4">
                <div className={`flex flex-col items-end px-4 py-1 rounded border ${rankInfo.current.bg} ${rankInfo.current.border}`}>
                  <div className={`text-xs font-black ${rankInfo.current.color} flex items-center gap-1`}><IconAward /> {rankInfo.current.name}</div>
                  <div className="text-sm font-bold">{user.points.toLocaleString()} pt</div>
                </div>
                <button onClick={() => setIsPosOpen(true)} className="bg-[#1a1a1a] text-white px-5 py-2.5 rounded hover:bg-black transition-all flex items-center gap-2 shadow-lg"><IconCalculator /> 会員POS</button>
              </div>
            ) : (
              <div className="flex items-center gap-3 ml-4">
                <button onClick={() => { setLoginTab('login'); setLoginModalOpen(true); }} className="text-[#666666] hover:text-[#D32F2F] underline">パートナーログイン</button>
                <button onClick={() => setIsPosOpen(true)} className="bg-[#D32F2F] text-white px-5 py-2.5 rounded hover:bg-[#B71C1C] transition-all flex items-center gap-2 shadow-lg"><IconCalculator /> 買取シミュレーター</button>
              </div>
            )}
          </nav>
          <button className="lg:hidden p-2 text-[#1a1a1a]" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>{mobileMenuOpen ? <IconX /> : <IconMenu />}</button>
        </div>
      </header>

      {/* Hero */}
      <section className="relative pt-40 pb-20 md:pt-48 md:pb-32 px-4 bg-gray-900 text-white overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1565610261709-5c5697d74556?auto=format&fit=crop&q=80')] bg-cover bg-center opacity-30"></div>
        <div className="absolute inset-0 bg-gradient-to-tr from-[#B71C1C]/90 to-gray-900/80"></div>
        <div className="container mx-auto relative z-10 text-center max-w-4xl">
          <h2 className="text-5xl md:text-7xl font-black tracking-tight mb-6 leading-tight drop-shadow-lg">繋げ、未来へ。</h2>
          <p className="text-xl md:text-2xl text-white/90 font-bold mb-6 tracking-wide drop-shadow-md">資源を価値に変える、確かな目利き</p>
          <div className="flex justify-center gap-4">
            <button onClick={() => setIsPosOpen(true)} className="bg-white text-[#D32F2F] px-10 py-4 rounded font-bold text-xl shadow-xl hover:bg-gray-100 transition-all transform hover:scale-105 flex items-center gap-2"><IconCalculator /> {user ? '会員専用POSを開く' : '買取価格を今すぐ確認'}</button>
          </div>
        </div>
      </section>

      {/* Dynamic Product Section */}
      <section id="items" className="py-24 bg-white">
        <div className="container mx-auto px-4 max-w-6xl">
          <h2 className="text-4xl font-black text-center mb-12">主要な電線の<span className="text-[#D32F2F] relative inline-block">種類と特徴<span className="absolute bottom-[-8px] left-0 w-full h-1 bg-[#D32F2F]"></span></span></h2>
          
          {/* Dynamic Tabs */}
          <div className="flex flex-wrap justify-center gap-2 mb-10">
            {categories.length > 0 ? categories.map((cat, idx) => (
              <button key={idx} onClick={() => setActiveTab(cat)} className={`px-8 py-3 font-bold transition-all border ${activeTab === cat ? 'bg-[#D32F2F] text-white border-[#D32F2F]' : 'bg-white text-[#666666] border-[#e0e0e0] hover:border-[#D32F2F] hover:text-[#D32F2F]'}`}>
                {cat}
              </button>
            )) : <div className="text-gray-400">商品データを読み込み中...</div>}
          </div>

          <div className="bg-[#f8f8f8] border border-[#e0e0e0] p-6 md:p-10 flex flex-col md:flex-row gap-10 items-start shadow-sm animate-fade-in">
             <div className="w-full md:w-1/2 aspect-[4/3] bg-gray-100 overflow-hidden border border-[#e0e0e0]">
               <img src={products.find(p => (p.category || p.maker) === activeTab)?.image} alt="Wire" className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"/>
             </div>
             <div className="flex-1 w-full">
               <div className="flex justify-between items-start mb-4">
                 <h3 className="text-2xl font-black text-[#1a1a1a]">{products.find(p => (p.category || p.maker) === activeTab)?.name}</h3>
                 <span className="bg-orange-100 text-orange-800 text-xs font-bold px-3 py-1 rounded">{products.find(p => (p.category || p.maker) === activeTab)?.tag}</span>
               </div>
               <p className="text-[#666666] mb-8 leading-relaxed border-b border-[#e0e0e0] pb-6">{products.find(p => (p.category || p.maker) === activeTab)?.desc}</p>
               <div className="bg-white p-6 border-l-4 border-[#D32F2F] mb-6 shadow-sm">
                 <div className="font-bold text-[#1a1a1a] mb-1">参考買取価格</div>
                 <div className="text-xl font-black text-[#D32F2F]">
                   {products.find(p => (p.category || p.maker) === activeTab)?.priceMin?.toLocaleString()}円 ～ {products.find(p => (p.category || p.maker) === activeTab)?.priceMax?.toLocaleString()}円 / kg
                 </div>
                 <div className="text-xs text-[#666666] mt-1">※銅建値や状態により変動します</div>
               </div>
               <button onClick={() => setIsPosOpen(true)} className="w-full bg-[#1a1a1a] text-white py-4 rounded font-bold hover:bg-black transition-colors">{user ? 'この品目をPOSに追加する' : '買取シミュレーションに追加'}</button>
             </div>
          </div>
        </div>
      </section>

      {/* POS System */}
      {isPosOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-end md:items-center justify-center p-0 md:p-4 animate-in fade-in duration-200">
          <div className="bg-white w-full md:max-w-4xl h-[90vh] md:h-auto md:max-h-[90vh] md:rounded-xl shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-bottom duration-300">
            <div className="bg-[#1a1a1a] text-white p-4 flex justify-between items-center shrink-0">
              <div className="flex items-center gap-4">
                <div className="font-bold text-lg flex items-center gap-2"><IconCalculator /> {user ? '会員専用POS' : '買取シミュレーター'}</div>
                {user && <span className={`text-xs px-2 py-0.5 rounded font-bold bg-white text-black`}>{rankInfo.current.name}</span>}
              </div>
              <div className="flex items-center gap-4">
                <div className="hidden md:block text-xs text-orange-400">{isLoadingMarket ? '相場取得中...' : `本日の銅建値: ¥${marketPrice.toLocaleString()}/t`}</div>
                <button onClick={() => setIsPosOpen(false)} className="bg-white/10 hover:bg-white/20 p-2 rounded transition-colors"><IconX /></button>
              </div>
            </div>
            <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
              <div className="flex-1 overflow-y-auto p-4 bg-[#f8f8f8]">
                <div className="grid grid-cols-2 gap-3">
                  {products.map(p => {
                    const unit = Math.floor(marketPrice * (p.ratio/100));
                    return (
                      <button key={p.id} onClick={() => { setSelectedProduct(p); setCalcModalOpen(true); }} className="bg-white p-4 rounded border border-[#e0e0e0] shadow-sm hover:border-[#D32F2F] hover:shadow-md transition-all text-left">
                        <div className="text-xs font-bold text-[#D32F2F] mb-1">{p.name}</div>
                        <div className="text-[10px] text-[#666666] mb-2">{p.tag}</div>
                        <div className="flex justify-between items-end"><span className="text-lg font-black text-[#1a1a1a]">¥{unit.toLocaleString()}</span><span className="text-xs text-[#666666]">/kg</span></div>
                      </button>
                    )
                  })}
                </div>
              </div>
              <div className="w-full md:w-80 bg-white border-l border-[#e0e0e0] flex flex-col shadow-xl z-10">
                <div className="p-4 bg-[#f8f8f8] border-b border-[#e0e0e0] font-bold text-[#1a1a1a] flex justify-between shrink-0"><span>見積りリスト</span><button onClick={() => setCart([])} className="text-xs text-red-600 hover:underline">クリア</button></div>
                <div className="flex-1 overflow-y-auto p-4 space-y-3">
                  {cart.length === 0 ? <div className="text-center text-[#999999] text-sm py-8">商品を選択してください</div> : cart.map((item, i) => (
                    <div key={i} className="flex justify-between text-sm border-b border-[#f0f0f0] pb-2"><div><div className="font-bold flex items-center gap-1">{item.name}{item.sorted && <span className="bg-green-100 text-green-700 text-[10px] px-1 rounded">良</span>}</div><div className="text-xs text-[#666666]">{item.weight}kg × @{item.unit}</div></div><div className="font-mono font-bold">¥{item.subtotal.toLocaleString()}</div></div>
                  ))}
                </div>
                <div className="p-6 bg-[#f8f8f8] border-t border-[#e0e0e0] shrink-0">
                  {user && user.points > 0 && <div className="mb-4 text-xs"><div className="flex justify-between items-center mb-1"><span className="font-bold text-[#666666]">保有ポイント利用</span><span>{user.points.toLocaleString()} pt</span></div><input type="number" className="w-full border p-2 rounded" placeholder="利用pt" max={user.points} value={usedPoints} onChange={(e) => setUsedPoints(Math.min(user.points, parseInt(e.target.value) || 0))}/></div>}
                  <div className="flex justify-between items-end mb-1"><span className="font-bold text-[#666666]">合計支払額</span><span className="text-3xl font-black text-[#D32F2F]">¥{total.toLocaleString()}</span></div>
                  {user ? <div className="text-right text-xs font-bold text-[#D32F2F] mb-4">獲得予定: {earnPoints} pt (ランク {rankInfo.current.pointRate*100}%)</div> : <div className="text-right text-xs text-[#666666] mb-4"><button onClick={() => setLoginModalOpen(true)} className="underline hover:text-[#D32F2F]">会員登録でポイントが貯まります</button></div>}
                  <button onClick={() => window.print()} className="w-full bg-[#1a1a1a] text-white py-4 rounded font-bold hover:bg-black transition-colors flex justify-center gap-2">明細書を発行する</button>
                </div>
              </div>
            </div>
          </div>
          {calcModalOpen && (
            <div className="absolute inset-0 bg-black/20 flex items-center justify-center p-4">
              <div className="bg-white rounded-xl shadow-2xl p-4 w-full max-w-xs animate-in zoom-in duration-200">
                <div className="text-center mb-4"><div className="text-sm text-[#666666]">{selectedProduct?.tag}</div><div className="font-bold text-lg">{selectedProduct?.name}</div></div>
                {user && <div className="mb-4"><label className={`flex items-center justify-between p-3 rounded border cursor-pointer transition-colors ${isSorted ? 'bg-green-50 border-green-500' : 'bg-gray-50 border-gray-200'}`}><span className="text-sm font-bold text-gray-700">分別済み・付物なし</span><input type="checkbox" checked={isSorted} onChange={(e) => setIsSorted(e.target.checked)} className="w-5 h-5 accent-green-600"/></label><div className="text-[10px] text-gray-500 mt-1 text-center">※チェックで単価アップ＆貢献度ボーナス</div></div>}
                <div className="bg-[#f8f8f8] p-4 rounded mb-4 text-right border border-[#e0e0e0]"><span className="text-xs text-[#666666] block">重量 (kg)</span><span className="text-3xl font-mono font-bold text-[#1a1a1a]">{calcValue}</span></div>
                <div className="grid grid-cols-3 gap-2 mb-4">{[7,8,9,4,5,6,1,2,3,0,'.'].map(n => <button key={n} onClick={() => handleCalcInput(n.toString())} className="bg-white border border-[#e0e0e0] rounded p-3 font-bold text-lg hover:bg-[#f0f0f0]">{n}</button>)}<button onClick={() => setCalcValue('0')} className="bg-red-50 text-red-600 border border-red-100 rounded p-3 font-bold text-sm">C</button></div>
                <div className="flex gap-2"><button onClick={() => setCalcModalOpen(false)} className="flex-1 py-3 border border-[#e0e0e0] rounded font-bold text-[#666666]">キャンセル</button><button onClick={addToCart} className="flex-1 py-3 bg-[#D32F2F] text-white rounded font-bold shadow-lg hover:bg-[#B71C1C]">決定</button></div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Login Modal */}
      {loginModalOpen && (
        <div className="fixed inset-0 z-[60] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white rounded-xl shadow-2xl p-8 w-full max-w-sm relative">
            <button onClick={() => setLoginModalOpen(false)} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"><IconX /></button>
            <div className="text-center mb-6"><h3 className="text-xl font-black text-[#1a1a1a] mb-2">{loginTab === 'login' ? 'パートナーログイン' : '新規会員登録'}</h3><div className="flex justify-center gap-4 text-sm font-bold border-b border-gray-200"><button onClick={() => setLoginTab('login')} className={`pb-2 ${loginTab==='login' ? 'text-[#D32F2F] border-b-2 border-[#D32F2F]' : 'text-gray-400'}`}>ログイン</button><button onClick={() => setLoginTab('register')} className={`pb-2 ${loginTab==='register' ? 'text-[#D32F2F] border-b-2 border-[#D32F2F]' : 'text-gray-400'}`}>招待コード入力</button></div></div>
            {loginTab === 'login' ? (
              <div className="space-y-4">
                <input type="text" placeholder="ID" className="w-full p-3 border rounded bg-gray-50" value={loginId} onChange={e=>setLoginId(e.target.value)} />
                <input type="password" placeholder="パスワード" className="w-full p-3 border rounded bg-gray-50" value={loginPw} onChange={e=>setLoginPw(e.target.value)} />
                <button onClick={handleLogin} disabled={isLoggingIn} className="w-full bg-[#1a1a1a] text-white py-3 rounded font-bold hover:bg-black transition-colors disabled:opacity-50">{isLoggingIn ? '通信中...' : 'ログイン'}</button>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="bg-orange-50 text-orange-800 p-3 rounded text-xs">※初回取引時のレシートに記載された招待コードを入力してください。</div>
                <input type="text" id="regName" placeholder="貴社名 / お名前" className="w-full p-3 border rounded bg-gray-50" />
                <input type="text" id="regCode" placeholder="招待コード (例: FIRST-DEAL)" className="w-full p-3 border rounded bg-gray-50" />
                <button onClick={() => handleRegister((document.getElementById('regCode')).value, (document.getElementById('regName')).value)} className="w-full bg-[#D32F2F] text-white py-3 rounded font-bold hover:bg-[#B71C1C] transition-colors">コードを認証して登録</button>
              </div>
            )}
          </div>
        </div>
      )}
      <style jsx global>{` @media print { body * { visibility: hidden; } .w-full.md\\:w-80, .w-full.md\\:w-80 * { visibility: visible; position: absolute; left: 0; top: 0; width: 100%; } button { display: none !important; } } `}</style>
    </div>
  );
}
