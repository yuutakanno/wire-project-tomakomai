'use client';

import React, { useState, useEffect } from 'react';

// --- アイコンコンポーネント (ライブラリ依存なし) ---
const IconPhone = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
);
const IconCheck = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-orange-600"><polyline points="20 6 9 17 4 12"></polyline></svg>
);
const IconMenu = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>
);
const IconX = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
);
const IconCalculator = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="4" y="2" width="16" height="20" rx="2"></rect><line x1="8" y1="6" x2="16" y2="6"></line><line x1="16" y1="14" x2="16" y2="18"></line><path d="M16 10h.01"></path><path d="M12 10h.01"></path><path d="M8 10h.01"></path><path d="M12 14h.01"></path><path d="M8 14h.01"></path><path d="M12 18h.01"></path><path d="M8 18h.01"></path></svg>
);

// --- データ定義 ---
const SYS_CONFIG = { market: 1350 }; 

// 詳細な商品データ (SEOテキスト反映版)
const PRODUCTS = [
  { id:1, maker:'ピカ線', type:'特1号銅線', desc:'被覆を剥いた純度の高い銅線。直径1.3mm以上。', ratio:98, tag:'最高値', image:'https://images.unsplash.com/photo-1605517476562-b9247346b0a6?auto=format&fit=crop&q=80' },
  { id:2, maker:'CV/CVT', type:'高圧ケーブル', desc:'架橋ポリエチレン絶縁。工場・ビルの電力供給用。', ratio:58, tag:'強化買取', image:'https://images.unsplash.com/photo-1558346490-a72e53ae2d4f?auto=format&fit=crop&q=80' },
  { id:3, maker:'IV線', type:'屋内配線', desc:'建物内の配線に広く使用されるビニル絶縁電線。', ratio:48, tag:'一般的', image:'https://images.unsplash.com/photo-1544724569-5f546fd6dd2d?auto=format&fit=crop&q=80' },
  { id:4, maker:'VVF/VA', type:'Fケーブル', desc:'住宅配線の定番。平形、2芯または3芯。', ratio:40, tag:'大量歓迎', image:'https://images.unsplash.com/photo-1518349619113-03114f06ac3a?auto=format&fit=crop&q=80' },
  { id:5, maker:'雑線', type:'ミックス線', desc:'家電配線や通信線など、様々な細い電線の混在。', ratio:35, tag:'混載OK', image:'https://images.unsplash.com/photo-1563293882-38640702d849?auto=format&fit=crop&q=80' },
  { id:6, maker:'キャブタイヤ', type:'動力用', desc:'ゴム被覆の丈夫な電線。溶接機や建機など。', ratio:45, tag:'要確認', image:'https://images.unsplash.com/photo-1585314877292-62947d512403?auto=format&fit=crop&q=80' },
];

export default function LandingPage() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  // システム状態
  const [isPosOpen, setIsPosOpen] = useState(false);
  const [marketPrice, setMarketPrice] = useState(SYS_CONFIG.market);
  
  // POSカート状態
  const [cart, setCart] = useState<any[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [calcValue, setCalcValue] = useState('0');
  const [calcModalOpen, setCalcModalOpen] = useState(false);
  
  // タブ・FAQ状態
  const [activeTab, setActiveTab] = useState(1);
  const [activeFaq, setActiveFaq] = useState<number | null>(null);

  useEffect(() => {
    // 擬似的な相場変動
    const timer = setInterval(() => {
      const fluctuation = Math.floor(Math.random() * 20) - 10;
      setMarketPrice(prev => prev + fluctuation);
    }, 10000);

    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
      clearInterval(timer);
    };
  }, []);

  // POS計算ロジック
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

  const subTotal = cart.reduce((a,b) => a + b.subtotal, 0);

  return (
    <div className="min-h-screen font-sans text-slate-900 bg-white">
      
      {/* --- ヘッダー (Index.htmlのスタイルを継承) --- */}
      <header className={`fixed top-0 w-full z-40 transition-all duration-300 border-b ${isScrolled ? 'bg-white/95 backdrop-blur shadow-md py-2' : 'bg-white py-4 border-slate-100'}`}>
        <div className="container mx-auto px-4 md:px-6 flex justify-between items-center">
          <div className="flex flex-col">
            <h1 className="text-xl font-bold tracking-tight text-slate-900 leading-tight">
              株式会社月寒製作所<br/>
              <span className="text-sm text-orange-600 font-medium">苫小牧工場</span>
            </h1>
          </div>

          {/* PC Menu */}
          <nav className="hidden lg:flex items-center gap-8 text-sm font-bold text-slate-600">
            <a href="#features" className="hover:text-orange-600 transition-colors">特徴</a>
            <a href="#items" className="hover:text-orange-600 transition-colors">電線の種類</a>
            <a href="#process" className="hover:text-orange-600 transition-colors">買取の流れ</a>
            <a href="#company" className="hover:text-orange-600 transition-colors">会社概要</a>
            <a href="tel:0144555544" className="flex items-center gap-2 bg-orange-600 text-white px-5 py-2.5 rounded hover:bg-orange-700 transition-all shadow-lg shadow-orange-600/20">
              <IconPhone />
              0144-55-5544
            </a>
            <button onClick={() => setIsPosOpen(true)} className="bg-slate-900 text-white px-5 py-2.5 rounded hover:bg-slate-800 transition-all flex items-center gap-2 shadow-lg">
              <IconCalculator />
              買取シミュレーター
            </button>
          </nav>
          
          {/* Mobile Button */}
          <button className="lg:hidden p-2 text-slate-600" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            {mobileMenuOpen ? <IconX /> : <IconMenu />}
          </button>
        </div>

        {/* Mobile Menu Overlay */}
        {mobileMenuOpen && (
          <div className="absolute top-full left-0 w-full bg-white border-b border-slate-200 p-4 shadow-xl flex flex-col gap-4 lg:hidden">
            <a href="#features" onClick={() => setMobileMenuOpen(false)} className="font-bold p-2">特徴</a>
            <a href="#items" onClick={() => setMobileMenuOpen(false)} className="font-bold p-2">電線の種類</a>
            <a href="#process" onClick={() => setMobileMenuOpen(false)} className="font-bold p-2">買取の流れ</a>
            <button onClick={() => {setIsPosOpen(true); setMobileMenuOpen(false);}} className="bg-slate-900 text-white w-full py-3 rounded font-bold">
              買取シミュレーター起動
            </button>
          </div>
        )}
      </header>

      {/* --- ヒーローセクション --- */}
      <section className="relative pt-40 pb-20 md:pt-48 md:pb-32 px-4 bg-slate-900 text-white overflow-hidden">
        {/* 背景画像 (Unsplash) */}
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1565610261709-5c5697d74556?auto=format&fit=crop&q=80')] bg-cover bg-center opacity-30"></div>
        <div className="absolute inset-0 bg-gradient-to-tr from-orange-900/80 to-slate-900/80"></div>
        
        <div className="container mx-auto relative z-10 text-center max-w-4xl">
          <h2 className="text-5xl md:text-7xl font-black tracking-tight mb-6 leading-tight">
            繋げ、未来へ。
          </h2>
          <p className="text-xl md:text-2xl text-orange-100 font-bold mb-4 tracking-wide">
            資源を価値に変える、確かな目利き
          </p>
          <p className="text-slate-300 mb-10 max-w-2xl mx-auto leading-relaxed">
            1961年創業、60年以上の実績。北海道苫小牧から、循環型社会の最前線へ。<br className="hidden md:inline"/>
            長年のノウハウで、あなたの資産（廃電線）を正確に査定します。
          </p>
          
          <div className="flex flex-wrap justify-center gap-4 mb-12">
            {['創業1961年', '自社ナゲット工場', '北海道全域対応'].map(tag => (
              <span key={tag} className="px-5 py-2 border border-white/20 bg-white/10 backdrop-blur rounded font-bold text-sm">
                {tag}
              </span>
            ))}
          </div>
          
          <button onClick={() => setIsPosOpen(true)} className="bg-white text-orange-700 px-8 py-4 rounded font-bold text-lg shadow-xl hover:bg-orange-50 transition-all transform hover:scale-105">
            本日の買取価格を確認する
          </button>
        </div>
      </section>

      {/* --- 特徴 (Features) --- */}
      <section id="features" className="py-20 bg-slate-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-black text-center mb-16 text-slate-900 relative inline-block w-full">
            選ばれる<span className="text-orange-600">4つの理由</span>
          </h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { num:'01', title:'60年以上の実績', desc:'1961年創業以来、被覆線取り扱いのノウハウを蓄積。熟練スタッフによる正確な査定。' },
              { num:'02', title:'自社ナゲット工場', desc:'純度99.9%の銅ナゲットを自社製造。中間マージンをカットし高価買取を実現。' },
              { num:'03', title:'透明な価格設定', desc:'銅建値に基づく公正な価格。法人・個人問わず同一基準で査定します。' },
              { num:'04', title:'幅広い対応力', desc:'CV・IV・VVF・雑線など幅広く対応。ごちゃ混ぜの被覆線もOK。' },
            ].map((f, i) => (
              <div key={i} className="bg-white p-8 border border-slate-200 hover:border-orange-500 hover:shadow-xl transition-all group">
                <div className="text-4xl font-black text-slate-200 group-hover:text-orange-600 mb-4 transition-colors">{f.num}</div>
                <h3 className="text-xl font-bold mb-4">{f.title}</h3>
                <p className="text-slate-600 text-sm leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --- 電線の種類 (Tabs) --- */}
      <section id="items" className="py-20 bg-white">
        <div className="container mx-auto px-4 max-w-5xl">
          <h2 className="text-3xl font-black text-center mb-12">
            主要な電線の<span className="text-orange-600">種類と特徴</span>
          </h2>
          
          {/* Tabs */}
          <div className="flex flex-wrap justify-center gap-2 mb-10">
            {PRODUCTS.map((p) => (
              <button
                key={p.id}
                onClick={() => setActiveTab(p.id)}
                className={`px-6 py-3 rounded text-sm font-bold transition-all border ${activeTab === p.id ? 'bg-orange-600 text-white border-orange-600' : 'bg-white text-slate-600 border-slate-200 hover:border-orange-400'}`}
              >
                {p.maker}
              </button>
            ))}
          </div>

          {/* Content */}
          <div className="bg-slate-50 border border-slate-200 p-6 md:p-10 flex flex-col md:flex-row gap-8 items-start animate-fade-in">
             <div className="w-full md:w-1/2 aspect-video bg-slate-200 overflow-hidden rounded border border-slate-300">
               <img src={PRODUCTS.find(p=>p.id===activeTab)?.image} alt="Wire" className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"/>
             </div>
             <div className="flex-1">
               <span className="bg-orange-100 text-orange-800 text-xs font-bold px-2 py-1 rounded mb-2 inline-block">
                 {PRODUCTS.find(p=>p.id===activeTab)?.tag}
               </span>
               <h3 className="text-2xl font-bold mb-4">{PRODUCTS.find(p=>p.id===activeTab)?.type}</h3>
               <p className="text-slate-600 mb-6 leading-relaxed">
                 {PRODUCTS.find(p=>p.id===activeTab)?.desc}
               </p>
               
               <div className="space-y-3 mb-8">
                 <div className="flex justify-between border-b border-slate-200 py-2">
                   <span className="font-bold text-sm">銅含有率（目安）</span>
                   <span className="text-slate-600">{PRODUCTS.find(p=>p.id===activeTab)?.ratio}% 前後</span>
                 </div>
                 <div className="flex justify-between border-b border-slate-200 py-2">
                   <span className="font-bold text-sm">状態条件</span>
                   <span className="text-slate-600">油汚れ・付着物なし</span>
                 </div>
               </div>
               
               <button onClick={() => setIsPosOpen(true)} className="w-full bg-slate-900 text-white py-4 rounded font-bold hover:bg-slate-800 transition-colors">
                 この種類の買取価格を計算する
               </button>
             </div>
          </div>
        </div>
      </section>

      {/* --- 買取の流れ --- */}
      <section id="process" className="py-20 bg-slate-50">
        <div className="container mx-auto px-4 max-w-4xl">
          <h2 className="text-3xl font-black text-center mb-16">買取の<span className="text-orange-600">流れ</span></h2>
          
          <div className="grid md:grid-cols-2 gap-12">
            <div className="bg-white p-8 shadow-sm border-t-4 border-orange-600">
              <h3 className="text-xl font-bold mb-6 text-center">持込買取（100kg〜）</h3>
              <ul className="space-y-6">
                {[
                  'お電話またはメールでご連絡',
                  '身分証明書をお持ちの上、工場へ',
                  'トラックスケールで正確に計量・査定',
                  'その場で現金お支払い'
                ].map((step, i) => (
                  <li key={i} className="flex gap-4">
                    <span className="flex-shrink-0 w-8 h-8 bg-orange-100 text-orange-700 font-bold rounded-full flex items-center justify-center">{i+1}</span>
                    <span className="text-slate-700 font-medium">{step}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-white p-8 shadow-sm border-t-4 border-slate-600">
              <h3 className="text-xl font-bold mb-6 text-center">出張買取（500kg〜）</h3>
              <ul className="space-y-6">
                {[
                  'お電話で重量・種類をご相談',
                  '訪問日時を調整してお伺い',
                  '現地で計量・査定（クレーン付トラック）',
                  '回収完了後、当日現金払い'
                ].map((step, i) => (
                  <li key={i} className="flex gap-4">
                    <span className="flex-shrink-0 w-8 h-8 bg-slate-100 text-slate-700 font-bold rounded-full flex items-center justify-center">{i+1}</span>
                    <span className="text-slate-700 font-medium">{step}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* --- FAQ --- */}
      <section id="faq" className="py-20 bg-white">
        <div className="container mx-auto px-4 max-w-3xl">
          <h2 className="text-3xl font-black text-center mb-12">よくある<span className="text-orange-600">質問</span></h2>
          <div className="space-y-4">
            {[
              {q:'どんな電線でも買取できますか？', a:'基本的に銅を含む電線であれば可能です。アルミ線のみ、鉛被覆などは対象外となる場合があります。'},
              {q:'少量でも買取してもらえますか？', a:'持込は100kgから、出張は500kgから対応しております。少量の場合はまとめてからお持ち込みいただくとお得です。'},
              {q:'被覆付きのままで大丈夫ですか？', a:'はい、自社の剥離機・ナゲット機で処理しますので、そのままの状態でお持ちください。'},
              {q:'法人と個人で価格は変わりますか？', a:'いいえ、同一基準で公正に査定いたします。個人のお客様もお気軽にお越しください。'},
            ].map((item, i) => (
              <div key={i} className="border border-slate-200 rounded overflow-hidden">
                <button 
                  onClick={() => setActiveFaq(activeFaq === i ? null : i)}
                  className="w-full flex justify-between items-center p-5 text-left font-bold bg-slate-50 hover:bg-slate-100 transition-colors"
                >
                  <span>Q. {item.q}</span>
                  <span className={`text-orange-600 transform transition-transform ${activeFaq === i ? 'rotate-180' : ''}`}>▼</span>
                </button>
                {activeFaq === i && (
                  <div className="p-5 bg-white text-slate-600 leading-relaxed border-t border-slate-200">
                    A. {item.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --- 会社概要 --- */}
      <section id="company" className="py-20 bg-slate-50">
        <div className="container mx-auto px-4 max-w-5xl">
          <h2 className="text-3xl font-black text-center mb-12">会社<span className="text-orange-600">情報</span></h2>
          <div className="grid md:grid-cols-2 gap-12">
            <div className="bg-white p-8 border border-slate-200">
              <table className="w-full text-sm text-left">
                <tbody>
                  <tr className="border-b"><th className="py-4 font-bold text-slate-900 w-32">社名</th><td className="py-4 text-slate-600">株式会社月寒製作所 苫小牧工場</td></tr>
                  <tr className="border-b"><th className="py-4 font-bold text-slate-900">創業</th><td className="py-4 text-slate-600">1961年</td></tr>
                  <tr className="border-b"><th className="py-4 font-bold text-slate-900">所在地</th><td className="py-4 text-slate-600">〒053-0001 北海道苫小牧市一本松町9-6</td></tr>
                  <tr className="border-b"><th className="py-4 font-bold text-slate-900">電話番号</th><td className="py-4 text-slate-600">0144-55-5544</td></tr>
                  <tr className="border-b"><th className="py-4 font-bold text-slate-900">事業内容</th><td className="py-4 text-slate-600">非鉄金属リサイクル、銅ナゲット製造</td></tr>
                  <tr><th className="py-4 font-bold text-slate-900">許可証</th><td className="py-4 text-slate-600">北海道知事許可（般-18）石第00857号<br/>産廃処分業許可 第00120077601号</td></tr>
                </tbody>
              </table>
            </div>
            <div className="h-full min-h-[300px] bg-slate-200 relative group overflow-hidden">
               {/* Map Placeholder */}
               <iframe 
                 src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2928.6!2d141.6!3d42.6!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNDLCsDM2JzAwLjAiTiAxNDHCsDM2JzAwLjAiRQ!5e0!3m2!1sja!2sjp!4v1600000000000!5m2!1sja!2sjp" 
                 width="100%" height="100%" style={{border:0}} loading="lazy">
               </iframe>
            </div>
          </div>
        </div>
      </section>

      {/* --- フッター --- */}
      <footer className="bg-slate-900 text-slate-400 py-12 text-center text-sm">
        <div className="container mx-auto px-4">
          <p className="font-bold text-white text-lg mb-4">株式会社月寒製作所 苫小牧工場</p>
          <p className="mb-8">〒053-0001 北海道苫小牧市一本松町9-6</p>
          <p>&copy; 2026 Tsukisamu Seisakusho Co., Ltd. All Rights Reserved.</p>
        </div>
      </footer>


      {/* --- POSシステム (モーダル) --- */}
      {isPosOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-end md:items-center justify-center p-0 md:p-4 animate-in fade-in duration-200">
          <div className="bg-white w-full md:max-w-4xl h-[90vh] md:h-auto md:max-h-[90vh] md:rounded-xl shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-bottom duration-300">
            
            {/* POS Header */}
            <div className="bg-slate-900 text-white p-4 flex justify-between items-center">
              <div>
                <div className="font-bold text-lg">買取シミュレーター</div>
                <div className="text-xs text-orange-400">本日の銅建値: ¥{marketPrice.toLocaleString()}/t</div>
              </div>
              <button onClick={() => setIsPosOpen(false)} className="bg-white/10 hover:bg-white/20 p-2 rounded transition-colors">
                <IconX />
              </button>
            </div>

            <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
              
              {/* 商品選択エリア */}
              <div className="flex-1 overflow-y-auto p-4 bg-slate-50">
                <div className="grid grid-cols-2 gap-3">
                  {PRODUCTS.map(p => {
                    const unit = Math.floor(marketPrice * (p.ratio/100));
                    return (
                      <button 
                        key={p.id} 
                        onClick={() => { setSelectedProduct(p); setCalcModalOpen(true); }}
                        className="bg-white p-4 rounded border border-slate-200 shadow-sm hover:border-orange-500 hover:shadow-md transition-all text-left"
                      >
                        <div className="text-xs font-bold text-orange-600 mb-1">{p.type}</div>
                        <div className="font-bold text-slate-800 mb-2">{p.maker}</div>
                        <div className="flex justify-between items-end">
                          <span className="text-lg font-black text-slate-900">¥{unit.toLocaleString()}</span>
                          <span className="text-xs text-slate-400">/kg</span>
                        </div>
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* カート・計算エリア */}
              <div className="w-full md:w-80 bg-white border-l border-slate-200 flex flex-col shadow-xl z-10">
                <div className="p-4 bg-slate-100 border-b border-slate-200 font-bold text-slate-700 flex justify-between">
                  <span>見積りリスト</span>
                  <button onClick={() => setCart([])} className="text-xs text-red-600 hover:underline">クリア</button>
                </div>
                
                <div className="flex-1 overflow-y-auto p-4 space-y-3">
                  {cart.length === 0 ? (
                    <div className="text-center text-slate-400 text-sm py-8">商品を選択してください</div>
                  ) : (
                    cart.map((item, i) => (
                      <div key={i} className="flex justify-between text-sm border-b border-slate-100 pb-2">
                        <div>
                          <div className="font-bold">{item.type}</div>
                          <div className="text-xs text-slate-500">{item.weight}kg × @{item.unit}</div>
                        </div>
                        <div className="font-mono font-bold">¥{item.subtotal.toLocaleString()}</div>
                      </div>
                    ))
                  )}
                </div>

                <div className="p-6 bg-slate-50 border-t border-slate-200">
                  <div className="flex justify-between items-end mb-4">
                    <span className="font-bold text-slate-600">概算合計</span>
                    <span className="text-3xl font-black text-orange-600">¥{subTotal.toLocaleString()}</span>
                  </div>
                  <button onClick={() => window.print()} className="w-full bg-slate-900 text-white py-4 rounded font-bold hover:bg-slate-800 transition-colors flex justify-center gap-2">
                    結果を印刷する
                  </button>
                  <p className="text-xs text-center text-slate-400 mt-2">※実際の買取価格は現物確認後に確定します</p>
                </div>
              </div>

            </div>
          </div>

          {/* 計算機モーダル */}
          {calcModalOpen && (
            <div className="absolute inset-0 bg-black/20 flex items-center justify-center p-4">
              <div className="bg-white rounded-xl shadow-2xl p-4 w-full max-w-xs animate-in zoom-in duration-200">
                <div className="text-center mb-4">
                  <div className="text-sm text-slate-500">{selectedProduct?.type}</div>
                  <div className="font-bold text-xl">{selectedProduct?.maker}</div>
                </div>
                <div className="bg-slate-100 p-4 rounded mb-4 text-right">
                  <span className="text-xs text-slate-500 block">重量 (kg)</span>
                  <span className="text-3xl font-mono font-bold text-slate-900">{calcValue}</span>
                </div>
                <div className="grid grid-cols-3 gap-2 mb-4">
                  {[7,8,9,4,5,6,1,2,3,0,'.'].map(n => (
                    <button key={n} onClick={() => handleCalcInput(n.toString())} className="bg-white border border-slate-200 rounded p-3 font-bold text-lg hover:bg-slate-50">
                      {n}
                    </button>
                  ))}
                  <button onClick={() => setCalcValue('0')} className="bg-red-50 text-red-600 border border-red-100 rounded p-3 font-bold text-sm">C</button>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => setCalcModalOpen(false)} className="flex-1 py-3 border border-slate-300 rounded font-bold">キャンセル</button>
                  <button onClick={addToCart} className="flex-1 py-3 bg-orange-600 text-white rounded font-bold shadow-lg shadow-orange-200">決定</button>
                </div>
              </div>
            </div>
          )}

        </div>
      )}
      
      {/* 印刷用スタイル */}
      <style jsx global>{`
        @media print {
          body * { visibility: hidden; }
          .w-full.md\\:w-80, .w-full.md\\:w-80 * { 
            visibility: visible; 
            position: absolute; 
            left: 0; 
            top: 0; 
            width: 100%; 
          }
          button { display: none !important; }
        }
      `}</style>
    </div>
  );
}
