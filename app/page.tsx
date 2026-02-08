'use client';

import React, { useState, useEffect } from 'react';

// --- アイコンコンポーネント (外部依存なし) ---
const IconPhone = () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>;
const IconCheck = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-red-600"><polyline points="20 6 9 17 4 12"></polyline></svg>;
const IconMenu = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>;
const IconX = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>;
const IconCalculator = () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="4" y="2" width="16" height="20" rx="2"></rect><line x1="8" y1="6" x2="16" y2="6"></line><line x1="16" y1="14" x2="16" y2="18"></line><path d="M16 10h.01"></path><path d="M12 10h.01"></path><path d="M8 10h.01"></path><path d="M12 14h.01"></path><path d="M8 14h.01"></path><path d="M12 18h.01"></path><path d="M8 18h.01"></path></svg>;
const IconChevronDown = ({className}:{className?:string}) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><polyline points="6 9 12 15 18 9"></polyline></svg>;

// --- データ定義 (HTMLデータより統合) ---
const SYS_CONFIG = { market: 1350 }; 

// 詳細な商品データ
const PRODUCTS = [
  { id:1, name:'ピカ線 (1号銅線)', category:'pika', desc:'被覆を剥いた純度の高い銅線。直径1.3mm以上。', ratio:98, priceMin:1300, priceMax:1450, tag:'最高値', specs:[{l:'特徴',v:'錆び・メッキ・エナメルなし'},{l:'用途',v:'太物電線の剥線'},{l:'条件',v:'緑青、ターミナル付着なし'}], image:'https://images.unsplash.com/photo-1605517476562-b9247346b0a6?auto=format&fit=crop&q=80' },
  { id:2, name:'CV・CVTケーブル', category:'cv', desc:'架橋ポリエチレン絶縁ビニルシースケーブル。高圧電力用。', ratio:65, priceMin:1100, priceMax:1450, tag:'高価買取', specs:[{l:'銅率',v:'通常60%～85%'},{l:'用途',v:'工場・ビルの電力供給'},{l:'特徴',v:'太く重量がある'}], image:'https://images.unsplash.com/photo-1558346490-a72e53ae2d4f?auto=format&fit=crop&q=80' },
  { id:3, name:'IVケーブル', category:'iv', desc:'屋内配線用ビニル絶縁電線。建物内の配線に広く使用される。', ratio:55, priceMin:1150, priceMax:1280, tag:'一般的', specs:[{l:'銅率',v:'70%～75%'},{l:'用途',v:'建物内配線、制御盤'},{l:'特徴',v:'単線または撚り線'}], image:'https://images.unsplash.com/photo-1544724569-5f546fd6dd2d?auto=format&fit=crop&q=80' },
  { id:4, name:'VVFケーブル (VA)', category:'vvf', desc:'ビニル絶縁ビニルシースケーブル平形。住宅配線の定番。', ratio:42, priceMin:650, priceMax:750, tag:'大量歓迎', specs:[{l:'銅率',v:'40%～50%'},{l:'用途',v:'住宅・建築物の屋内配線'},{l:'特徴',v:'平形、2芯または3芯'}], image:'https://images.unsplash.com/photo-1518349619113-03114f06ac3a?auto=format&fit=crop&q=80' },
  { id:5, name:'雑線 (ミックス)', category:'mixed', desc:'様々な細い電線が混ざったもの。家電線や通信線など。', ratio:38, priceMin:550, priceMax:750, tag:'混載OK', specs:[{l:'銅率',v:'30%～50%'},{l:'用途',v:'家電配線、通信ケーブル'},{l:'特徴',v:'細線が多数、混在OK'}], image:'https://images.unsplash.com/photo-1563293882-38640702d849?auto=format&fit=crop&q=80' },
  { id:6, name:'キャブタイヤ', category:'cabtire', desc:'ゴムで被覆された丈夫な電線。移動機械の電源ケーブル。', ratio:45, priceMin:600, priceMax:900, tag:'要確認', specs:[{l:'特徴',v:'ゴム被覆、柔軟性あり'},{l:'用途',v:'溶接機、建設機械'},{l:'種類',v:'動力用、制御用'}], image:'https://images.unsplash.com/photo-1585314877292-62947d512403?auto=format&fit=crop&q=80' },
];

const FAQ_ITEMS = [
  { q: "どんな電線でも買取できますか？", a: "基本的に銅を含む電線であれば買取可能です。ただし、アルミ電線のみ（銅なし）や、鉛被覆電線、極端に汚れがひどいものは対象外となる場合があります。" },
  { q: "少量でも買取してもらえますか？", a: "はい、可能です。持込買取は100kgから、出張買取は500kgから対応しております。少量の場合はまとめてお持ち込みいただくとお得です。" },
  { q: "被覆付きのままで大丈夫ですか？", a: "はい、被覆付きのままで大丈夫です。当社では電線剥離機とナゲットプラントを完備しており、そのまま処理可能です。無理に剥くと銅線を傷つける場合があるので、そのままでOKです。" },
  { q: "支払いはいつですか？", a: "持込の場合は、計量・査定完了後、その場で現金にてお支払いいたします。出張買取の場合も基本的に当日現金払いですが、大量の場合やご希望により銀行振込も可能です。" },
  { q: "出張買取は可能ですか？", a: "はい、北海道内（苫小牧・札幌・千歳・室蘭エリア）を中心に対応しております。500kg以上推奨ですが、まずはお電話でご相談ください。" },
  { q: "身分証明書は必要ですか？", a: "はい、古物営業法により必須です。運転免許証、マイナンバーカード、パスポート等のいずれかをご提示ください。法人の場合はお名刺もお願いいたします。" },
  { q: "ごちゃ混ぜの電線でも大丈夫ですか？", a: "はい、大丈夫です。当社の60年のノウハウで、混在した状態でも適正に査定いたします。可能であれば大まかに分けていただけるとスムーズです。" },
  { q: "価格はどのように決まりますか？", a: "毎日の「銅建値（市場価格）」、銅の含有率（歩留まり）、電線の種類・品質、重量から総合的に算出します。" },
  { q: "銅建値とは何ですか？", a: "銅の国際・国内取引価格の基準です。日々変動するため、当社では最新の建値を反映した価格設定を行っています。" },
  { q: "法人と個人で買取価格は変わりますか？", a: "いいえ、変わりません。同一基準で公正に査定いたします。個人のお客様もお気軽にお持ち込みください。" }
];

export default function LandingPage() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  // システム状態
  const [isPosOpen, setIsPosOpen] = useState(false);
  const [marketPrice, setMarketPrice] = useState(SYS_CONFIG.market);
  
  // POSカート・計算状態
  const [cart, setCart] = useState<any[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [calcValue, setCalcValue] = useState('0');
  const [calcModalOpen, setCalcModalOpen] = useState(false);
  
  // UI状態
  const [activeTab, setActiveTab] = useState('pika');
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

  // POSロジック
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
    <div className="min-h-screen font-sans text-[#1a1a1a] bg-white">
      
      {/* --- ヘッダー --- */}
      <header className={`fixed top-0 w-full z-40 transition-all duration-300 border-b ${isScrolled ? 'bg-white/95 backdrop-blur shadow-md py-2' : 'bg-white py-4 border-[#e0e0e0]'}`}>
        <div className="container mx-auto px-4 md:px-6 flex justify-between items-center">
          <div className="flex flex-col">
            <h1 className="text-xl font-bold tracking-tight text-[#1a1a1a] leading-tight">
              株式会社月寒製作所<br/>
              <span className="text-sm text-[#D32F2F] font-bold">苫小牧工場</span>
            </h1>
          </div>

          <nav className="hidden lg:flex items-center gap-8 text-sm font-bold text-[#1a1a1a]">
            <a href="#features" className="hover:text-[#D32F2F] transition-colors relative group">
              特徴<span className="absolute bottom-[-4px] left-0 w-0 h-0.5 bg-[#D32F2F] transition-all group-hover:w-full"></span>
            </a>
            <a href="#items" className="hover:text-[#D32F2F] transition-colors relative group">
              電線の種類<span className="absolute bottom-[-4px] left-0 w-0 h-0.5 bg-[#D32F2F] transition-all group-hover:w-full"></span>
            </a>
            <a href="#process" className="hover:text-[#D32F2F] transition-colors relative group">
              買取の流れ<span className="absolute bottom-[-4px] left-0 w-0 h-0.5 bg-[#D32F2F] transition-all group-hover:w-full"></span>
            </a>
            <a href="#faq" className="hover:text-[#D32F2F] transition-colors relative group">
              FAQ<span className="absolute bottom-[-4px] left-0 w-0 h-0.5 bg-[#D32F2F] transition-all group-hover:w-full"></span>
            </a>
            <a href="tel:0144555544" className="flex items-center gap-2 bg-[#D32F2F] text-white px-6 py-3 rounded hover:bg-[#B71C1C] transition-all shadow-lg hover:-translate-y-0.5">
              <IconPhone />
              0144-55-5544
            </a>
          </nav>
          
          <button className="lg:hidden p-2 text-[#1a1a1a]" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            {mobileMenuOpen ? <IconX /> : <IconMenu />}
          </button>
        </div>

        {mobileMenuOpen && (
          <div className="absolute top-full left-0 w-full bg-white border-b border-[#e0e0e0] p-4 shadow-xl flex flex-col gap-4 lg:hidden">
            {['特徴','電線の種類','買取の流れ','FAQ','会社概要'].map((item,i) => (
              <a key={i} href={`#${item === '会社概要' ? 'company' : item === '電線の種類' ? 'items' : item === '買取の流れ' ? 'process' : 'features'}`} onClick={() => setMobileMenuOpen(false)} className="font-bold p-2 border-b border-gray-100">{item}</a>
            ))}
            <button onClick={() => {setIsPosOpen(true); setMobileMenuOpen(false);}} className="bg-[#1a1a1a] text-white w-full py-3 rounded font-bold">
              買取シミュレーター起動
            </button>
          </div>
        )}
      </header>

      {/* --- ヒーローセクション --- */}
      <section className="relative pt-40 pb-20 md:pt-48 md:pb-32 px-4 bg-gray-900 text-white overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1565610261709-5c5697d74556?auto=format&fit=crop&q=80')] bg-cover bg-center opacity-30"></div>
        <div className="absolute inset-0 bg-gradient-to-tr from-[#B71C1C]/90 to-gray-900/80"></div>
        
        <div className="container mx-auto relative z-10 text-center max-w-4xl">
          <h2 className="text-5xl md:text-7xl font-black tracking-tight mb-6 leading-tight drop-shadow-lg">
            繋げ、未来へ。
          </h2>
          <p className="text-xl md:text-3xl text-white/90 font-bold mb-6 tracking-wide drop-shadow-md">
            資源を価値に変える、確かな目利き
          </p>
          <p className="text-white/80 mb-10 max-w-2xl mx-auto leading-relaxed text-lg">
            1961年創業、60年以上の実績。長年のノウハウで、<br className="hidden md:inline"/>
            あなたの資産（廃電線）を正確に査定し、循環型社会へ貢献します。
          </p>
          
          <div className="flex flex-wrap justify-center gap-4 mb-12">
            {['創業1961年', '自社ナゲット工場', '北海道全域対応'].map(tag => (
              <span key={tag} className="px-6 py-2 border border-white/30 bg-white/10 backdrop-blur rounded font-bold text-sm">
                {tag}
              </span>
            ))}
          </div>
          
          <button onClick={() => setIsPosOpen(true)} className="bg-white text-[#D32F2F] px-10 py-4 rounded font-bold text-xl shadow-xl hover:bg-gray-100 transition-all transform hover:scale-105 flex items-center gap-2 mx-auto">
            <IconCalculator />
            買取価格を今すぐ確認
          </button>
        </div>
      </section>

      {/* --- 特徴 (Features) --- */}
      <section id="features" className="py-24 bg-[#f8f8f8]">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-black text-center mb-16 text-[#1a1a1a]">
            選ばれる<span className="text-[#D32F2F] relative inline-block">4つの理由<span className="absolute bottom-[-8px] left-0 w-full h-1 bg-[#D32F2F]"></span></span>
          </h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { num:'01', title:'60年以上の実績', desc:'1961年創業以来、被覆線取り扱いのノウハウを蓄積。熟練スタッフによる正確な査定をお約束します。' },
              { num:'02', title:'自社工場完備', desc:'純度99.9%の銅ナゲットを自社製造。中間マージンをカットし、製錬所直納だからこその高価買取を実現。' },
              { num:'03', title:'透明な価格設定', desc:'日々の銅建値に基づく公正な価格。法人・個人問わず同一基準で査定します。' },
              { num:'04', title:'幅広い対応力', desc:'CV・IV・VVF・雑線など幅広く対応。ごちゃ混ぜの被覆線もOK。持込・出張どちらも対応可能です。' },
            ].map((f, i) => (
              <div key={i} className="bg-white p-8 border border-[#e0e0e0] hover:border-[#D32F2F] hover:shadow-xl transition-all group hover:-translate-y-2 duration-300">
                <div className="w-16 h-16 bg-[#D32F2F] text-white flex items-center justify-center font-black text-2xl mb-6 mx-auto group-hover:bg-[#B71C1C] transition-colors">{f.num}</div>
                <h3 className="text-xl font-bold mb-4 text-center">{f.title}</h3>
                <p className="text-[#666666] text-sm leading-relaxed text-center">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --- シミュレーター (POS Trigger) --- */}
      <section id="simulator" className="py-20 bg-white">
        <div className="container mx-auto px-4 max-w-4xl">
           <div className="bg-[#f8f8f8] border border-[#e0e0e0] p-8 md:p-12 text-center">
             <h2 className="text-3xl font-black mb-6">買取価格<span className="text-[#D32F2F]">シミュレーター</span></h2>
             <p className="text-[#666666] mb-8 leading-relaxed">
               お手持ちの電線の種類と重量を入力するだけで、概算の買取金額を計算できます。<br/>
               60年のノウハウに基づいた最新の単価データを使用しています。
             </p>
             <div className="bg-[#fff8e1] border-l-4 border-orange-400 p-4 mb-8 text-left max-w-2xl mx-auto text-sm text-orange-900">
               <strong>⚠️ 参考価格について</strong><br/>
               このシミュレーターは参考価格を表示するものです。実際の買取価格は現物確認後、市場動向などを総合的に判断し正確に査定いたします。
             </div>
             <button onClick={() => setIsPosOpen(true)} className="bg-[#D32F2F] text-white px-12 py-4 rounded font-bold text-lg shadow-lg hover:bg-[#B71C1C] transition-all transform hover:scale-105">
               シミュレーターを起動する
             </button>
           </div>
        </div>
      </section>

      {/* --- 電線の種類 (Tabs) --- */}
      <section id="items" className="py-24 bg-[#f8f8f8]">
        <div className="container mx-auto px-4 max-w-6xl">
          <h2 className="text-4xl font-black text-center mb-12">
            主要な電線の<span className="text-[#D32F2F] relative inline-block">種類と特徴<span className="absolute bottom-[-8px] left-0 w-full h-1 bg-[#D32F2F]"></span></span>
          </h2>
          
          <div className="flex flex-wrap justify-center gap-2 mb-10">
            {PRODUCTS.map((p) => (
              <button
                key={p.category}
                onClick={() => setActiveTab(p.category)}
                className={`px-8 py-3 font-bold transition-all border ${activeTab === p.category ? 'bg-[#D32F2F] text-white border-[#D32F2F]' : 'bg-white text-[#666666] border-[#e0e0e0] hover:border-[#D32F2F] hover:text-[#D32F2F]'}`}
              >
                {p.name.split(' ')[0]}
              </button>
            ))}
          </div>

          <div className="bg-white border border-[#e0e0e0] p-6 md:p-10 flex flex-col md:flex-row gap-10 items-start shadow-sm animate-fade-in">
             <div className="w-full md:w-1/2 aspect-[4/3] bg-gray-100 overflow-hidden border border-[#e0e0e0]">
               <img src={PRODUCTS.find(p=>p.category===activeTab)?.image} alt="Wire" className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"/>
             </div>
             <div className="flex-1 w-full">
               <div className="flex justify-between items-start mb-4">
                 <h3 className="text-2xl font-black text-[#1a1a1a]">{PRODUCTS.find(p=>p.category===activeTab)?.name}</h3>
                 <span className="bg-orange-100 text-orange-800 text-xs font-bold px-3 py-1 rounded">
                   {PRODUCTS.find(p=>p.category===activeTab)?.tag}
                 </span>
               </div>
               <p className="text-[#666666] mb-8 leading-relaxed border-b border-[#e0e0e0] pb-6">
                 {PRODUCTS.find(p=>p.category===activeTab)?.desc}
               </p>
               
               <div className="space-y-4 mb-8">
                 {PRODUCTS.find(p=>p.category===activeTab)?.specs.map((s,i) => (
                   <div key={i} className="grid grid-cols-[100px_1fr] gap-4 border-b border-[#f0f0f0] pb-3 last:border-0">
                     <span className="font-bold text-[#1a1a1a] text-sm">{s.l}</span>
                     <span className="text-[#666666] text-sm">{s.v}</span>
                   </div>
                 ))}
               </div>

               <div className="bg-[#fff8e1] p-6 border-l-4 border-[#D32F2F] mb-6">
                 <div className="font-bold text-[#1a1a1a] mb-1">参考買取価格</div>
                 <div className="text-xl font-black text-[#D32F2F]">
                   {PRODUCTS.find(p=>p.category===activeTab)?.priceMin.toLocaleString()}円 ～ {PRODUCTS.find(p=>p.category===activeTab)?.priceMax.toLocaleString()}円 / kg
                 </div>
                 <div className="text-xs text-[#666666] mt-1">※銅建値や状態により変動します</div>
               </div>
             </div>
          </div>
        </div>
      </section>

      {/* --- 買取の流れ --- */}
      <section id="process" className="py-24 bg-white">
        <div className="container mx-auto px-4 max-w-5xl">
          <h2 className="text-4xl font-black text-center mb-16">買取の<span className="text-[#D32F2F] relative inline-block">流れ<span className="absolute bottom-[-8px] left-0 w-full h-1 bg-[#D32F2F]"></span></span></h2>
          
          <div className="grid md:grid-cols-2 gap-12">
            {/* 持込 */}
            <div className="border border-[#e0e0e0] p-0 shadow-lg">
              <div className="bg-[#f8f8f8] p-6 border-b border-[#e0e0e0] text-center">
                <h3 className="text-xl font-black text-[#1a1a1a]">持込買取</h3>
                <p className="text-[#D32F2F] font-black text-3xl mt-2">100kg～</p>
                <p className="text-sm text-[#666666] mt-2">即日現金払い可能</p>
              </div>
              <div className="p-8">
                <ul className="space-y-8 relative before:absolute before:left-[19px] before:top-4 before:bottom-4 before:w-0.5 before:bg-[#e0e0e0]">
                  {[
                    'お電話またはメールでご連絡',
                    '身分証明書をお持ちの上、工場へ',
                    'トラックスケールで正確に計量・査定',
                    'その場で現金お支払い'
                  ].map((step, i) => (
                    <li key={i} className="flex gap-6 relative">
                      <span className="flex-shrink-0 w-10 h-10 bg-[#D32F2F] text-white font-bold rounded-full flex items-center justify-center z-10 shadow-md">{i+1}</span>
                      <div className="pt-2">
                        <h4 className="font-bold text-[#1a1a1a] mb-1">{step}</h4>
                        <p className="text-xs text-[#666666] leading-relaxed">
                          {i===0 && '持ち込み予定日時をお知らせください。'}
                          {i===1 && '運転免許証などをご持参ください。'}
                          {i===2 && '60年のノウハウで正確に査定します。'}
                          {i===3 && 'ご納得いただければ即現金化。'}
                        </p>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* 出張 */}
            <div className="border border-[#e0e0e0] p-0 shadow-lg">
              <div className="bg-[#f8f8f8] p-6 border-b border-[#e0e0e0] text-center">
                <h3 className="text-xl font-black text-[#1a1a1a]">出張買取</h3>
                <p className="text-[#D32F2F] font-black text-3xl mt-2">500kg～</p>
                <p className="text-sm text-[#666666] mt-2">北海道全域対応</p>
              </div>
              <div className="p-8">
                <ul className="space-y-8 relative before:absolute before:left-[19px] before:top-4 before:bottom-4 before:w-0.5 before:bg-[#e0e0e0]">
                  {[
                    'お電話で重量・種類をご相談',
                    '訪問日時を調整してお伺い',
                    '現地で計量・査定',
                    '回収完了後、当日現金払い'
                  ].map((step, i) => (
                    <li key={i} className="flex gap-6 relative">
                      <span className="flex-shrink-0 w-10 h-10 bg-[#1a1a1a] text-white font-bold rounded-full flex items-center justify-center z-10 shadow-md">{i+1}</span>
                      <div className="pt-2">
                        <h4 className="font-bold text-[#1a1a1a] mb-1">{step}</h4>
                        <p className="text-xs text-[#666666] leading-relaxed">
                          {i===0 && '少量の場合もご相談ください。'}
                          {i===1 && 'ご都合の良い日時に訪問します。'}
                          {i===2 && 'クレーン付トラック等で対応。'}
                          {i===3 && '大量の場合は振込も可能です。'}
                        </p>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* --- FAQ --- */}
      <section id="faq" className="py-24 bg-[#f8f8f8]">
        <div className="container mx-auto px-4 max-w-3xl">
          <h2 className="text-4xl font-black text-center mb-16">よくある<span className="text-[#D32F2F] relative inline-block">質問<span className="absolute bottom-[-8px] left-0 w-full h-1 bg-[#D32F2F]"></span></span></h2>
          <div className="space-y-4">
            {FAQ_ITEMS.map((item, i) => (
              <div key={i} className="bg-white border border-[#e0e0e0] rounded overflow-hidden shadow-sm transition-all hover:shadow-md">
                <button 
                  onClick={() => setActiveFaq(activeFaq === i ? null : i)}
                  className="w-full flex justify-between items-center p-6 text-left font-bold text-[#1a1a1a] hover:bg-gray-50 transition-colors"
                >
                  <span className="pr-8"><span className="text-[#D32F2F] mr-2">Q.</span>{item.q}</span>
                  <IconChevronDown className={`text-[#D32F2F] flex-shrink-0 transform transition-transform duration-300 ${activeFaq === i ? 'rotate-180' : ''}`} />
                </button>
                <div className={`overflow-hidden transition-all duration-300 ${activeFaq === i ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}>
                  <div className="p-6 bg-[#fcfcfc] text-[#666666] leading-relaxed border-t border-[#f0f0f0] text-sm">
                    {item.a}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --- 会社概要 --- */}
      <section id="company" className="py-24 bg-white">
        <div className="container mx-auto px-4 max-w-6xl">
          <h2 className="text-4xl font-black text-center mb-16">会社<span className="text-[#D32F2F] relative inline-block">情報<span className="absolute bottom-[-8px] left-0 w-full h-1 bg-[#D32F2F]"></span></span></h2>
          <div className="grid md:grid-cols-2 gap-16">
            <div className="bg-[#f8f8f8] p-10 border border-[#e0e0e0]">
              <table className="w-full text-sm text-left border-collapse">
                <tbody>
                  {[
                    {l:'社名',v:'株式会社月寒製作所 苫小牧工場'},
                    {l:'創業',v:'1961年'},
                    {l:'所在地',v:'〒053-0001 北海道苫小牧市一本松町9-6'},
                    {l:'電話番号',v:'0144-55-5544'},
                    {l:'事業内容',v:'非鉄金属リサイクル、銅ナゲット製造、分電盤・制御盤製造'},
                    {l:'建設業許可',v:'北海道知事許可（般-18）石第00857号'},
                    {l:'産廃許可',v:'産廃処分業許可 第00120077601号'},
                    {l:'証明書発行',v:'計量証明書、取引証明書、リサイクル報告書（2台のトラックスケール完備）'}
                  ].map((row,i) => (
                    <tr key={i} className="border-b border-[#e0e0e0] last:border-0">
                      <th className="py-4 font-bold text-[#1a1a1a] w-32 align-top">{row.l}</th>
                      <td className="py-4 text-[#666666] align-top">{row.v}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="h-full min-h-[400px] bg-gray-200 border border-[#e0e0e0] relative">
               {/* Map iframe placeholder (実際のURLを入れてください) */}
               <div className="absolute inset-0 flex items-center justify-center text-gray-500 font-bold bg-gray-100">
                  <iframe width="100%" height="100%" style={{border:0}} loading="lazy" src="https://maps.google.com/maps?q=42.6338,141.6056&z=15&output=embed"></iframe>
               </div>
            </div>
          </div>
        </div>
      </section>

      {/* --- お問い合わせ (Simple UI) --- */}
      <section id="contact" className="py-24 bg-[#f8f8f8]">
        <div className="container mx-auto px-4 max-w-3xl">
            <h2 className="text-4xl font-black text-center mb-12">お問い<span className="text-[#D32F2F]">合わせ</span></h2>
            <div className="bg-white p-8 md:p-12 border border-[#e0e0e0] shadow-sm">
                <form className="space-y-6" onSubmit={(e) => { e.preventDefault(); alert('お問い合わせありがとうございます。デモ環境のため送信されませんが、UIは正常です。'); }}>
                    <div className="grid md:grid-cols-2 gap-6">
                        <div>
                            <label className="block font-bold text-[#1a1a1a] mb-2">お名前 <span className="text-red-500">*</span></label>
                            <input type="text" required className="w-full p-3 border border-[#e0e0e0] bg-[#fcfcfc] focus:outline-none focus:border-[#D32F2F] transition-colors" placeholder="例: 山田 太郎"/>
                        </div>
                        <div>
                            <label className="block font-bold text-[#1a1a1a] mb-2">電話番号 <span className="text-red-500">*</span></label>
                            <input type="tel" required className="w-full p-3 border border-[#e0e0e0] bg-[#fcfcfc] focus:outline-none focus:border-[#D32F2F] transition-colors" placeholder="例: 090-1234-5678"/>
                        </div>
                    </div>
                    <div>
                        <label className="block font-bold text-[#1a1a1a] mb-2">電線の種類・重量（概算）</label>
                        <textarea className="w-full p-3 border border-[#e0e0e0] bg-[#fcfcfc] h-32 focus:outline-none focus:border-[#D32F2F] transition-colors" placeholder="例: CVケーブル 約200kg、雑線 約50kg"></textarea>
                    </div>
                    <button type="submit" className="w-full bg-[#D32F2F] text-white py-4 font-bold text-lg hover:bg-[#B71C1C] transition-colors shadow-lg">
                        送信する
                    </button>
                </form>
            </div>
        </div>
      </section>

      {/* --- フッター --- */}
      <footer className="bg-[#1a1a1a] text-[#999999] py-16 text-sm">
        <div className="container mx-auto px-4 grid md:grid-cols-3 gap-12 text-center md:text-left">
          <div>
            <p className="font-bold text-white text-lg mb-4">株式会社月寒製作所 苫小牧工場</p>
            <p className="mb-2">〒053-0001 北海道苫小牧市一本松町9-6</p>
            <p className="font-bold text-white text-xl">TEL: 0144-55-5544</p>
          </div>
          <div>
            <h3 className="font-bold text-white mb-4">営業時間</h3>
            <p>平日 8:00～17:00</p>
            <p>定休日: 土日祝（要相談）</p>
          </div>
          <div>
            <h3 className="font-bold text-white mb-4">リンク</h3>
            <div className="flex flex-col gap-2">
                <a href="#features" className="hover:text-white transition-colors">特徴</a>
                <a href="#items" className="hover:text-white transition-colors">電線の種類</a>
                <a href="#process" className="hover:text-white transition-colors">買取の流れ</a>
                <a href="#faq" className="hover:text-white transition-colors">FAQ</a>
            </div>
          </div>
        </div>
        <div className="container mx-auto px-4 mt-12 pt-8 border-t border-[#333333] text-center">
            <p>© 2026 Tsukisamu Seisakusho Co., Ltd. All Rights Reserved.</p>
        </div>
      </footer>


      {/* --- POSシステム (ビジネスツール) --- */}
      {isPosOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-end md:items-center justify-center p-0 md:p-4 animate-in fade-in duration-200">
          <div className="bg-white w-full md:max-w-4xl h-[90vh] md:h-auto md:max-h-[90vh] md:rounded-xl shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-bottom duration-300">
            
            {/* POS Header */}
            <div className="bg-[#1a1a1a] text-white p-4 flex justify-between items-center shrink-0">
              <div>
                <div className="font-bold text-lg flex items-center gap-2"><IconCalculator /> 買取シミュレーター</div>
                <div className="text-xs text-orange-400">本日の銅建値: ¥{marketPrice.toLocaleString()}/t</div>
              </div>
              <button onClick={() => setIsPosOpen(false)} className="bg-white/10 hover:bg-white/20 p-2 rounded transition-colors">
                <IconX />
              </button>
            </div>

            <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
              
              {/* 商品選択エリア */}
              <div className="flex-1 overflow-y-auto p-4 bg-[#f8f8f8]">
                <div className="grid grid-cols-2 gap-3">
                  {PRODUCTS.map(p => {
                    const unit = Math.floor(marketPrice * (p.ratio/100));
                    return (
                      <button 
                        key={p.id} 
                        onClick={() => { setSelectedProduct(p); setCalcModalOpen(true); }}
                        className="bg-white p-4 rounded border border-[#e0e0e0] shadow-sm hover:border-[#D32F2F] hover:shadow-md transition-all text-left"
                      >
                        <div className="text-xs font-bold text-[#D32F2F] mb-1">{p.name}</div>
                        <div className="text-[10px] text-[#666666] mb-2">{p.tag}</div>
                        <div className="flex justify-between items-end">
                          <span className="text-lg font-black text-[#1a1a1a]">¥{unit.toLocaleString()}</span>
                          <span className="text-xs text-[#666666]">/kg</span>
                        </div>
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* カート・計算エリア */}
              <div className="w-full md:w-80 bg-white border-l border-[#e0e0e0] flex flex-col shadow-xl z-10">
                <div className="p-4 bg-[#f8f8f8] border-b border-[#e0e0e0] font-bold text-[#1a1a1a] flex justify-between shrink-0">
                  <span>見積りリスト</span>
                  <button onClick={() => setCart([])} className="text-xs text-red-600 hover:underline">クリア</button>
                </div>
                
                <div className="flex-1 overflow-y-auto p-4 space-y-3">
                  {cart.length === 0 ? (
                    <div className="text-center text-[#999999] text-sm py-8">商品を選択してください</div>
                  ) : (
                    cart.map((item, i) => (
                      <div key={i} className="flex justify-between text-sm border-b border-[#f0f0f0] pb-2">
                        <div>
                          <div className="font-bold">{item.name}</div>
                          <div className="text-xs text-[#666666]">{item.weight}kg × @{item.unit}</div>
                        </div>
                        <div className="font-mono font-bold">¥{item.subtotal.toLocaleString()}</div>
                      </div>
                    ))
                  )}
                </div>

                <div className="p-6 bg-[#f8f8f8] border-t border-[#e0e0e0] shrink-0">
                  <div className="flex justify-between items-end mb-4">
                    <span className="font-bold text-[#666666]">概算合計</span>
                    <span className="text-3xl font-black text-[#D32F2F]">¥{subTotal.toLocaleString()}</span>
                  </div>
                  <button onClick={() => window.print()} className="w-full bg-[#1a1a1a] text-white py-4 rounded font-bold hover:bg-black transition-colors flex justify-center gap-2">
                    結果を印刷する
                  </button>
                  <p className="text-xs text-center text-[#999999] mt-2">※実際の買取価格は現物確認後に確定します</p>
                </div>
              </div>

            </div>
          </div>

          {/* 計算機モーダル */}
          {calcModalOpen && (
            <div className="absolute inset-0 bg-black/20 flex items-center justify-center p-4">
              <div className="bg-white rounded-xl shadow-2xl p-4 w-full max-w-xs animate-in zoom-in duration-200">
                <div className="text-center mb-4">
                  <div className="text-sm text-[#666666]">{selectedProduct?.tag}</div>
                  <div className="font-bold text-lg">{selectedProduct?.name}</div>
                </div>
                <div className="bg-[#f8f8f8] p-4 rounded mb-4 text-right border border-[#e0e0e0]">
                  <span className="text-xs text-[#666666] block">重量 (kg)</span>
                  <span className="text-3xl font-mono font-bold text-[#1a1a1a]">{calcValue}</span>
                </div>
                <div className="grid grid-cols-3 gap-2 mb-4">
                  {[7,8,9,4,5,6,1,2,3,0,'.'].map(n => (
                    <button key={n} onClick={() => handleCalcInput(n.toString())} className="bg-white border border-[#e0e0e0] rounded p-3 font-bold text-lg hover:bg-[#f0f0f0]">
                      {n}
                    </button>
                  ))}
                  <button onClick={() => setCalcValue('0')} className="bg-red-50 text-red-600 border border-red-100 rounded p-3 font-bold text-sm">C</button>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => setCalcModalOpen(false)} className="flex-1 py-3 border border-[#e0e0e0] rounded font-bold text-[#666666]">キャンセル</button>
                  <button onClick={addToCart} className="flex-1 py-3 bg-[#D32F2F] text-white rounded font-bold shadow-lg hover:bg-[#B71C1C]">決定</button>
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
