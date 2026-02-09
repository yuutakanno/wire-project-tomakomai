// @ts-nocheck
/* eslint-disable */
'use client';

import React, { useState, useEffect } from 'react';

// ==========================================
//  設定エリア (重要)
// ==========================================
// ★ここにGASの「ウェブアプリのURL」を貼り付けてください
const API_ENDPOINT = "https://script.google.com/macros/s/AKfycbyfYM8q6t7Q7UwIRORFBNOCA-mMpVFE1Z3oLzCJp5GNiYI9_CMy4767p9am2iMY70kl/exec";

// --- ランク定義 ---
const CONDITION_RANKS = {
  A: { label: 'A:優良', rate: 1.02, color: 'bg-green-100 text-green-800 border-green-300', desc: '分別済・異物なし (+2%)' },
  B: { label: 'B:標準', rate: 1.00, color: 'bg-gray-100 text-gray-800 border-gray-300', desc: '通常の状態' },
  C: { label: 'C:手間', rate: 0.95, color: 'bg-red-100 text-red-800 border-red-300', desc: '泥付・団子・混合 (-5%)' }
};

// --- アイコンコンポーネント ---
const IconMenu = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>;
const IconX = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>;
const IconCalculator = () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="4" y="2" width="16" height="20" rx="2"></rect><line x1="8" y1="6" x2="16" y2="6"></line><line x1="16" y1="14" x2="16" y2="18"></line><path d="M16 10h.01"></path><path d="M12 10h.01"></path><path d="M8 10h.01"></path><path d="M12 14h.01"></path><path d="M8 14h.01"></path><path d="M12 18h.01"></path><path d="M8 18h.01"></path></svg>;
const IconLogOut = () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>;
const IconChevronDown = ({className}) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><polyline points="6 9 12 15 18 9"></polyline></svg>;
const IconAward = () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="8" r="7"></circle><polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"></polyline></svg>;
const IconCamera = () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"></path><circle cx="12" cy="13" r="4"></circle></svg>;
const IconPrinter = () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 6 2 18 2 18 9"></polyline><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"></path><rect x="6" y="14" width="12" height="8"></rect></svg>;

// --- 初期データ ---
const RANKS = [
  { name: 'REGULAR', limit: 0, pointRate: 0.005, color: 'text-gray-600', bg: 'bg-gray-100', border: 'border-gray-300' },
  { name: 'GOLD', limit: 500000, pointRate: 0.01, color: 'text-yellow-600', bg: 'bg-yellow-50', border: 'border-yellow-400' },
  { name: 'PLATINUM', limit: 2000000, pointRate: 0.02, color: 'text-slate-900', bg: 'bg-slate-200', border: 'border-slate-800' }
];

const FAQ_ITEMS = [
  { q: "どんな電線でも買取できますか？", a: "基本的に銅を含む電線であれば買取可能です。ただし、アルミ電線のみ（銅なし）や、鉛被覆電線、極端に汚れがひどいものは対象外となる場合があります。" },
  { q: "少量でも買取してもらえますか？", a: "はい、可能です。持込買取は100kgから、出張買取は500kgから対応しております。少量の場合はまとめてお持ち込みいただくとお得です。" },
  { q: "被覆付きのままで大丈夫ですか？", a: "はい、被覆付きのままで大丈夫です。当社では電線剥離機とナゲットプラントを完備しており、そのまま処理可能です。" },
  { q: "支払いはいつですか？", a: "持込の場合は、計量・査定完了後、その場で現金にてお支払いいたします。" }
];

export default function LandingPage() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  // システム状態
  const [isPosOpen, setIsPosOpen] = useState(false);
  const [marketPrice, setMarketPrice] = useState(0);
  const [isLoadingMarket, setIsLoadingMarket] = useState(true);
  const [products, setProducts] = useState([]);
  
  // ユーザー状態
  const [user, setUser] = useState(null);
  const [loginModalOpen, setLoginModalOpen] = useState(false);
  const [loginTab, setLoginTab] = useState('login');
  const [loginId, setLoginId] = useState('');
  const [loginPw, setLoginPw] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  
  // POS状態
  const [cart, setCart] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [calcValue, setCalcValue] = useState('0');
  const [calcModalOpen, setCalcModalOpen] = useState(false);
  const [currentCondition, setCurrentCondition] = useState('B'); 
  const [transactionComplete, setTransactionComplete] = useState(false);
  const [lastTransactionId, setLastTransactionId] = useState('');
  const [usedPoints, setUsedPoints] = useState(0);
  
  // タブ状態
  const [activeTab, setActiveTab] = useState('loading');
  const [activeFaq, setActiveFaq] = useState(null);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);

    const fetchSystemData = async () => {
      setIsLoadingMarket(true);
      try {
        const [priceRes, productRes] = await Promise.all([
            fetch(`${API_ENDPOINT}?action=get_market_price`).catch(e => null),
            fetch(`${API_ENDPOINT}?action=get_products`).catch(e => null)
        ]);

        if (priceRes && priceRes.ok) {
          const data = await priceRes.json();
          if (data && data.price) setMarketPrice(Number(data.price));
        }

        if (productRes && productRes.ok) {
            const pData = await productRes.json();
            if (pData && pData.products) {
                setProducts(pData.products);
                // カテゴリの初期設定: 「かんたん見積」があればそれを優先
                if(pData.products.some(p => p.category.includes('かんたん'))) {
                   setActiveTab(pData.products.find(p => p.category.includes('かんたん')).category);
                } else if (pData.products.length > 0) {
                   setActiveTab(pData.products[0].category);
                }
            }
        }
      } catch (e) {
        console.warn("Data Fetch Error", e);
      } finally {
        setIsLoadingMarket(false);
      }
    };

    fetchSystemData();

    const storedUser = localStorage.getItem('tsukisamu_user');
    if (storedUser) setUser(JSON.parse(storedUser));

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const getRankInfo = (score) => {
    // 簡易ロジック: 現在はユーザーデータのrank文字列を優先したいが、
    // ここではmonthScoreに基づいた表示ロジックを残しておく
    let current = RANKS[0];
    // もしUserオブジェクトにrankがあればそれを使う
    if (user && user.rank === 'GOLD') current = RANKS[1];
    if (user && user.rank === 'PLATINUM') current = RANKS[2];
    return { current };
  };

  const handleLogin = async () => {
    setIsLoggingIn(true);
    try {
      const res = await fetch(`${API_ENDPOINT}?action=login&id=${loginId}&pw=${loginPw}`);
      if (res.ok) {
        const data = await res.json();
        if (data.success && data.user) {
          setUser(data.user);
          localStorage.setItem('tsukisamu_user', JSON.stringify(data.user));
          setLoginModalOpen(false);
        } else {
            alert('ログイン失敗: IDまたはパスワードを確認してください');
        }
      }
    } catch (e) {
         alert('通信エラーが発生しました。');
    }
    setIsLoggingIn(false);
  };

  const handleLogout = () => {
    if(confirm('ログアウトしますか？')) {
      setUser(null);
      localStorage.removeItem('tsukisamu_user');
      setCart([]);
      setLoginId('');
      setLoginPw('');
    }
  };

  // --- POS機能 ---
  const addToCart = () => {
    const w = parseFloat(calcValue);
    if(w > 0 && selectedProduct) {
      const condition = CONDITION_RANKS[currentCondition];
      let baseUnit = Math.floor(marketPrice * (selectedProduct.ratio/100));
      let finalUnit = Math.floor(baseUnit * condition.rate);

      setCart([...cart, { 
        ...selectedProduct, 
        weight: w, 
        unit: finalUnit, 
        subtotal: Math.floor(w * finalUnit),
        condition: currentCondition
      }]);
      setCalcModalOpen(false);
      setCalcValue('0');
      setCurrentCondition('B');
    }
  };

  const handleCalcInput = (v) => {
    if(v === '.' && calcValue.includes('.')) return;
    setCalcValue(prev => prev === '0' && v !== '.' ? v : prev + v);
  };

  const completeTransaction = async () => {
    if(cart.length === 0) return;
    if(!confirm('取引を確定しますか？')) return;

    // ID生成
    const now = new Date();
    const id = `${now.getFullYear()}${String(now.getMonth()+1).padStart(2,'0')}${String(now.getDate()).padStart(2,'0')}-${String(now.getHours()).padStart(2,'0')}${String(now.getMinutes()).padStart(2,'0')}`;
    
    // GASへ送信
    try {
      await fetch(`${API_ENDPOINT}?action=save_transaction`, {
        method: 'POST',
        body: JSON.stringify({
          id: id,
          userId: user.dbId || user.id, // V2のdbIdがあればそれを使う
          totalWeight: cart.reduce((a,b)=>a+b.weight, 0),
          totalAmount: total,
          items: cart.map(c => ({ name: c.name, weight: c.weight, cond: c.condition }))
        })
      });
    } catch(e) {
      console.error("Save failed", e);
      // エラーでも一旦画面上は完了とする（現場の運用優先）
    }

    setLastTransactionId(id);
    setTransactionComplete(true);
  };

  const resetPos = () => {
    setCart([]);
    setUsedPoints(0);
    setTransactionComplete(false);
    setLastTransactionId('');
  };

  const subTotal = cart.reduce((a,b) => a + b.subtotal, 0);
  const total = subTotal - usedPoints;
  const rankInfo = getRankInfo(0); 
  const categories = Array.from(new Set(products.map(p => p.category))).sort();

  return (
    <div className="min-h-screen font-sans text-[#1a1a1a] bg-white">
      {/* Header */}
      <header className={`fixed top-0 w-full z-40 transition-all duration-300 border-b ${isScrolled ? 'bg-white/95 backdrop-blur shadow-md py-2' : 'bg-white py-4 border-[#e0e0e0]'}`}>
        <div className="container mx-auto px-4 md:px-6 flex justify-between items-center">
          <div className="flex flex-col">
            <h1 className="text-xl font-bold tracking-tight text-[#1a1a1a] leading-tight">株式会社月寒製作所<br/><span className="text-sm text-[#D32F2F] font-bold">苫小牧工場</span></h1>
          </div>
          
          {/* PC Nav */}
          <nav className="hidden lg:flex items-center gap-6 text-sm font-bold text-[#1a1a1a]">
            <a href="#features" className="hover:text-[#D32F2F]">特徴</a>
            <a href="#items" className="hover:text-[#D32F2F]">買取品目</a>
            <a href="#process" className="hover:text-[#D32F2F]">流れ</a>
            
            {user ? (
              <div className="flex items-center gap-4 ml-4">
                 {/* ログアウトボタン(PC) */}
                <div className="flex flex-col items-end">
                  <div className="text-xs text-gray-500 flex gap-2">
                    {user.name} 
                    <button onClick={handleLogout} className="text-red-600 underline hover:text-red-800" title="ログアウト"><IconLogOut/></button>
                  </div>
                  <div className={`flex items-center gap-1 px-3 py-0.5 rounded border text-xs font-black mt-1 ${rankInfo.current.bg} ${rankInfo.current.border} ${rankInfo.current.color}`}>
                    <IconAward /> {user.rank || rankInfo.current.name}
                  </div>
                </div>
                <button onClick={() => setIsPosOpen(true)} className="bg-[#1a1a1a] text-white px-5 py-2.5 rounded hover:bg-black transition-all flex items-center gap-2 shadow-lg">
                  <IconCalculator /> 会員POS
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-3 ml-4">
                <button onClick={() => { setLoginTab('login'); setLoginModalOpen(true); }} className="text-[#666666] hover:text-[#D32F2F] underline">
                  パートナーログイン
                </button>
                <button onClick={() => setIsPosOpen(true)} className="bg-[#D32F2F] text-white px-5 py-2.5 rounded hover:bg-[#B71C1C] transition-all flex items-center gap-2 shadow-lg">
                  <IconCalculator /> 買取シミュレーター
                </button>
              </div>
            )}
          </nav>
          
          <button className="lg:hidden p-2 text-[#1a1a1a]" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>{mobileMenuOpen ? <IconX /> : <IconMenu />}</button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="absolute top-full left-0 w-full bg-white border-b p-4 shadow-xl flex flex-col gap-4 lg:hidden">
            {user ? (
              <div className="bg-gray-50 p-4 rounded text-center border border-gray-200">
                <div className="font-bold text-[#1a1a1a] mb-1">{user.name} 様</div>
                <div className="text-xs text-gray-500 mb-3">ランク: {user.rank || rankInfo.current.name}</div>
                <button onClick={handleLogout} className="text-sm text-red-600 underline flex items-center justify-center gap-1"><IconLogOut/> ログアウト</button>
              </div>
            ) : (
              <button onClick={() => { setLoginModalOpen(true); setMobileMenuOpen(false); }} className="w-full py-3 border border-[#e0e0e0] rounded font-bold text-[#666666] hover:bg-gray-50">
                パートナーログイン
              </button>
            )}
            <button onClick={() => {setIsPosOpen(true); setMobileMenuOpen(false);}} className="bg-[#1a1a1a] text-white w-full py-3 rounded font-bold flex justify-center gap-2">
               <IconCalculator /> {user ? '会員POS起動' : '買取シミュレーター'}
            </button>
          </div>
        )}
      </header>

      {/* Hero */}
      <section className="relative pt-40 pb-20 md:pt-48 md:pb-32 px-4 bg-gray-900 text-white overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1565610261709-5c5697d74556?auto=format&fit=crop&q=80')] bg-cover bg-center opacity-30"></div>
        <div className="absolute inset-0 bg-gradient-to-tr from-[#B71C1C]/90 to-gray-900/80"></div>
        <div className="container mx-auto relative z-10 text-center max-w-4xl">
          <h2 className="text-5xl md:text-7xl font-black tracking-tight mb-6 leading-tight drop-shadow-lg">繋げ、未来へ。</h2>
          <p className="text-xl md:text-3xl text-white/90 font-bold mb-6 tracking-wide drop-shadow-md">資源を価値に変える、確かな目利き</p>
          <div className="flex justify-center gap-4 mt-8">
            <button onClick={() => setIsPosOpen(true)} className="bg-white text-[#D32F2F] px-10 py-4 rounded font-bold text-xl shadow-xl hover:bg-gray-100 transition-all transform hover:scale-105 flex items-center gap-2"><IconCalculator /> {user ? 'POSを開く' : '買取価格を確認'}</button>
          </div>
        </div>
      </section>

      {/* Dynamic Products */}
      <section id="items" className="py-24 bg-white">
        <div className="container mx-auto px-4 max-w-6xl">
          <h2 className="text-4xl font-black text-center mb-12">本日の<span className="text-[#D32F2F]">買取価格</span></h2>
          
          <div className="flex flex-wrap justify-center gap-2 mb-10">
            {categories.map((cat, idx) => (
              <button key={idx} onClick={() => setActiveTab(cat)} className={`px-4 py-2 text-sm font-bold transition-all border rounded ${activeTab === cat ? 'bg-[#D32F2F] text-white border-[#D32F2F]' : 'bg-white text-[#666666] border-[#e0e0e0] hover:border-[#D32F2F]'}`}>
                {cat}
              </button>
            ))}
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
             {products.filter(p => p.category === activeTab).map(p => {
               const unit = Math.floor(marketPrice * (p.ratio/100));
               return (
                 <div key={p.id} className="bg-white border border-[#e0e0e0] p-4 rounded hover:shadow-lg transition-all group">
                    <div className="flex justify-between items-start mb-2">
                       <h3 className="font-bold text-lg text-[#1a1a1a]">{p.name}</h3>
                       <span className="text-xs bg-gray-100 px-2 py-1 rounded">{p.tag}</span>
                    </div>
                    <p className="text-xs text-[#666666] mb-4 h-10">{p.desc}</p>
                    <div className="flex justify-between items-end border-t pt-4">
                       <span className="text-xs text-[#666666]">参考単価</span>
                       <span className="text-2xl font-black text-[#D32F2F]">¥{unit.toLocaleString()}</span>
                    </div>
                 </div>
               )
             })}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#1a1a1a] text-[#999999] py-16 text-sm">
        <div className="container mx-auto px-4 text-center">
          <p className="font-bold text-white text-lg mb-4">株式会社月寒製作所 苫小牧工場</p>
          <p>© 2026 Tsukisamu Seisakusho Co., Ltd.</p>
        </div>
      </footer>

      {/* POS System */}
      {isPosOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-end md:items-center justify-center p-0 md:p-4 animate-in fade-in duration-200">
          {!transactionComplete ? (
            <div className="bg-white w-full md:max-w-5xl h-[95vh] md:h-[85vh] md:rounded-xl shadow-2xl flex flex-col overflow-hidden">
              <div className="bg-[#1a1a1a] text-white p-3 flex justify-between items-center shrink-0">
                <div className="font-bold flex items-center gap-2"><IconCalculator /> {user ? `会員POS: ${user.name}` : 'シミュレーター'}</div>
                <div className="flex gap-4 items-center">
                   <div className="text-xs text-orange-400">建値: ¥{marketPrice}</div>
                   <button onClick={() => setIsPosOpen(false)} className="bg-white/10 p-2 rounded"><IconX /></button>
                </div>
              </div>
              
              <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
                {/* 左側: 商品選択 */}
                <div className="flex-1 flex flex-col bg-[#f0f0f0] overflow-hidden">
                   <div className="p-2 overflow-x-auto whitespace-nowrap bg-white border-b shrink-0">
                      {categories.map(c => (
                        <button key={c} onClick={()=>setActiveTab(c)} className={`px-4 py-2 mx-1 rounded-full text-xs font-bold ${activeTab===c ? 'bg-[#1a1a1a] text-white':'bg-gray-100 text-gray-600'}`}>{c}</button>
                      ))}
                   </div>
                   <div className="flex-1 overflow-y-auto p-2">
                     <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                       {products.filter(p => p.category === activeTab).map(p => {
                          const unit = Math.floor(marketPrice * (p.ratio/100));
                          return (
                            <button key={p.id} onClick={() => { setSelectedProduct(p); setCalcModalOpen(true); }} className="bg-white p-3 rounded shadow-sm border border-transparent hover:border-[#D32F2F] text-left">
                               <div className="text-xs text-gray-500 mb-1">{p.name}</div>
                               <div className="text-lg font-black text-[#1a1a1a]">¥{unit.toLocaleString()}</div>
                            </button>
                          )
                       })}
                     </div>
                   </div>
                </div>

                {/* 右側: カート */}
                <div className="w-full md:w-80 bg-white border-l flex flex-col z-10 shadow-xl h-1/2 md:h-auto">
                   <div className="p-3 bg-gray-50 border-b font-bold text-sm flex justify-between">
                     <span>リスト ({cart.length})</span>
                     <button onClick={()=>setCart([])} className="text-red-600 text-xs">クリア</button>
                   </div>
                   <div className="flex-1 overflow-y-auto p-3 space-y-2">
                     {cart.map((item, i) => (
                       <div key={i} className="flex justify-between text-sm border-b pb-1">
                          <div>
                            <span className="font-bold block">{item.name}</span>
                            <span className="text-xs text-gray-500">{item.weight}kg × @{item.unit} ({item.condition})</span>
                          </div>
                          <div className="font-bold">¥{item.subtotal.toLocaleString()}</div>
                       </div>
                     ))}
                   </div>
                   <div className="p-4 bg-gray-100 border-t shrink-0">
                      <div className="flex justify-between items-end mb-3">
                        <span className="font-bold">合計</span>
                        <span className="text-3xl font-black text-[#D32F2F]">¥{total.toLocaleString()}</span>
                      </div>
                      {user ? (
                        <button onClick={completeTransaction} className="w-full bg-[#1a1a1a] text-white py-4 rounded font-bold shadow-lg">取引確定・ID発行</button>
                      ) : (
                        <div className="text-center text-xs text-gray-500">※確定にはログインが必要です</div>
                      )}
                   </div>
                </div>
              </div>
            </div>
          ) : (
            // 完了画面
            <div className="bg-white w-full max-w-md rounded-xl p-8 text-center shadow-2xl m-4">
               <div className="text-5xl mb-4">🎉</div>
               <h3 className="text-2xl font-bold mb-2">受付完了</h3>
               <div className="bg-gray-100 p-4 rounded mb-6">
                 <div className="text-xs text-gray-500">管理ID</div>
                 <div className="text-3xl font-mono font-black">{lastTransactionId}</div>
               </div>
               <button onClick={resetPos} className="w-full bg-[#1a1a1a] text-white py-3 rounded font-bold">次の取引へ</button>
            </div>
          )}

          {/* 計算機モーダル */}
          {calcModalOpen && (
            <div className="absolute inset-0 z-[60] bg-black/50 flex items-center justify-center p-4">
               <div className="bg-white rounded-xl shadow-2xl p-4 w-full max-w-xs animate-in zoom-in">
                  <div className="text-center mb-4">
                    <div className="font-bold">{selectedProduct?.name}</div>
                    <div className="flex justify-center gap-2 mt-2">
                      {Object.keys(CONDITION_RANKS).map(r => (
                        <button key={r} onClick={()=>setCurrentCondition(r)} className={`px-3 py-1 rounded text-xs font-bold border ${currentCondition===r ? 'bg-[#1a1a1a] text-white border-black':'bg-white text-gray-500'}`}>{CONDITION_RANKS[r].label}</button>
                      ))}
                    </div>
                  </div>
                  <div className="bg-gray-100 p-3 rounded mb-4 text-right text-3xl font-mono font-bold">{calcValue}</div>
                  <div className="grid grid-cols-3 gap-2 mb-4">
                    {[7,8,9,4,5,6,1,2,3,0,'.'].map(n => <button key={n} onClick={()=>handleCalcInput(n.toString())} className="p-3 bg-white border rounded font-bold text-lg active:bg-gray-100">{n}</button>)}
                    <button onClick={()=>setCalcValue('0')} className="p-3 bg-red-50 text-red-600 border border-red-100 rounded font-bold">C</button>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={()=>setCalcModalOpen(false)} className="flex-1 py-3 bg-gray-200 rounded font-bold">戻る</button>
                    <button onClick={addToCart} className="flex-1 py-3 bg-[#D32F2F] text-white rounded font-bold">決定</button>
                  </div>
               </div>
            </div>
          )}
        </div>
      )}

      {/* Login Modal */}
      {loginModalOpen && (
        <div className="fixed inset-0 z-[60] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-sm relative">
            <button onClick={() => setLoginModalOpen(false)} className="absolute top-4 right-4"><IconX /></button>
            <h3 className="text-xl font-bold text-center mb-6">パートナーログイン</h3>
            <div className="space-y-4">
              <div>
                <label className="text-xs font-bold text-gray-500">ログインID</label>
                <input type="text" className="w-full p-3 border rounded bg-gray-50" value={loginId} onChange={e=>setLoginId(e.target.value)} />
              </div>
              <div>
                <label className="text-xs font-bold text-gray-500">パスワード (電話番号)</label>
                <input type="password" className="w-full p-3 border rounded bg-gray-50" value={loginPw} onChange={e=>setLoginPw(e.target.value)} />
              </div>
              <button onClick={handleLogin} disabled={isLoggingIn} className="w-full bg-[#1a1a1a] text-white py-3 rounded font-bold disabled:opacity-50">{isLoggingIn ? '確認中...' : 'ログイン'}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
