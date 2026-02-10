"use client";

import React, { useState, useEffect, useMemo } from 'react';
import { Camera, Search, FileText, TrendingUp, Users, Package, RefreshCw, ChevronRight, Phone, MapPin, Mail, ArrowRight, Lock } from 'lucide-react';

// ==========================================
// 【設定】 GASのウェブアプリURL (必ずデプロイIDを最新に！)
// ==========================================
const GAS_API_URL = "https://script.google.com/macros/s/AKfycbzT6j4n1M... (あなたのID) .../exec";

// --- 型定義 ---
interface Product {
  id: string;
  maker: string;
  name: string;
  year: string;
  sq: string;
  core: string;
  ratio: number;
  category: string;
  source: string;
}

interface MarketConfig {
  price: number;
  lastUpdate: string;
}

// ==========================================
//  メインコンポーネント (App Entry)
// ==========================================
export default function WireProjectApp() {
  const [viewMode, setViewMode] = useState<'LP' | 'DASHBOARD'>('LP');
  const [products, setProducts] = useState<Product[]>([]);
  const [config, setConfig] = useState<MarketConfig>({ price: 0, lastUpdate: "" });
  const [loading, setLoading] = useState(true);

  // --- データ取得 (LP/Dashboard共通) ---
  useEffect(() => {
    async function init() {
      try {
        const [prodRes, confRes] = await Promise.all([
          fetch(`${GAS_API_URL}?action=get_products`).then(r => r.json()),
          fetch(`${GAS_API_URL}?action=get_config`).then(r => r.json())
        ]);
        setProducts(prodRes.products || []);
        setConfig({ 
          price: Number(confRes.price) || 0, 
          lastUpdate: confRes.description || "" 
        });
      } catch (e) {
        console.error("Data fetch failed", e);
        setConfig({ price: 0, lastUpdate: "Offline" });
      } finally {
        setLoading(false);
      }
    }
    init();
  }, []);

  if (loading) return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center text-red-600 animate-pulse gap-4">
      <div className="text-4xl font-black tracking-tighter">TSUKISAMU</div>
      <div className="text-sm text-neutral-500">SYSTEM LOADING...</div>
    </div>
  );

  return (
    <>
      {viewMode === 'LP' ? (
        <LandingPage 
          products={products} 
          config={config} 
          onSwitchToDashboard={() => setViewMode('DASHBOARD')} 
        />
      ) : (
        <Dashboard 
          products={products} 
          config={config} 
          onBackToHome={() => setViewMode('LP')} 
        />
      )}
    </>
  );
}

// ==========================================
//  1. ランディングページ (LP)
// ==========================================
function LandingPage({ products, config, onSwitchToDashboard }: { products: Product[], config: MarketConfig, onSwitchToDashboard: () => void }) {
  const [simWeight, setSimWeight] = useState<number>(100);
  const [simType, setSimType] = useState<number>(75); // デフォルト: 上線ミックス(75%)相当

  // 簡易シミュレーション計算
  const estimatedPrice = Math.floor(simWeight * (simType / 100) * config.price);

  return (
    <div className="min-h-screen bg-white text-neutral-900 font-sans">
      {/* Header */}
      <header className="fixed top-0 w-full bg-white/90 backdrop-blur-md z-50 border-b border-neutral-200">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-red-700 text-white flex items-center justify-center font-black text-xl rounded-sm">月</div>
            <div>
              <h1 className="font-bold text-lg leading-tight">株式会社月寒製作所</h1>
              <p className="text-[10px] text-neutral-500 tracking-wider">TOMAKOMAI FACTORY Since 1961</p>
            </div>
          </div>
          <div className="hidden md:flex items-center gap-6 font-bold text-sm text-neutral-600">
            <a href="#about" className="hover:text-red-700 transition">事業案内</a>
            <a href="#simulator" className="hover:text-red-700 transition">買取価格</a>
            <a href="#access" className="hover:text-red-700 transition">アクセス</a>
            <a href="tel:0144-55-5544" className="bg-red-700 text-white px-6 py-2 rounded-full hover:bg-red-800 transition flex items-center gap-2">
              <Phone size={16} /> お問い合わせ
            </a>
          </div>
        </div>
        {/* Ticker */}
        <div className="bg-neutral-900 text-white text-xs py-1 overflow-hidden">
          <div className="animate-marquee whitespace-nowrap flex gap-8 px-4 justify-center">
            <span>🔴 現在の銅建値: <span className="text-yellow-400 font-bold text-base">¥{config.price.toLocaleString()}</span> /kg</span>
            <span className="text-neutral-500">({config.lastUpdate} 更新)</span>
            <span>※相場変動により買取価格は毎日変わります。まずはお電話ください。</span>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative h-[80vh] flex items-center justify-center bg-neutral-900 text-white overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1567606400613-2e2a87c7324c?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center opacity-40"></div>
        <div className="relative z-10 text-center px-4 max-w-4xl">
          <h2 className="text-5xl md:text-7xl font-black mb-6 tracking-tighter">
            RE-DEFINE<br/><span className="text-red-600">RECYCLING.</span>
          </h2>
          <p className="text-xl md:text-2xl font-light mb-10 text-neutral-300">
            リサイクルを、再定義する。<br/>
            都市鉱山から未来の資源へ。
          </p>
          <div className="flex flex-col md:flex-row gap-4 justify-center">
            <a href="#simulator" className="bg-red-600 hover:bg-red-700 text-white px-8 py-4 rounded-xl font-bold text-lg transition flex items-center justify-center gap-2">
              <TrendingUp /> 今日の買取価格を見る
            </a>
            <a href="tel:0144-55-5544" className="bg-white hover:bg-neutral-100 text-black px-8 py-4 rounded-xl font-bold text-lg transition flex items-center justify-center gap-2">
              <Phone /> 0144-55-5544
            </a>
          </div>
        </div>
      </section>

      {/* Simulator Section (Public) */}
      <section id="simulator" className="py-20 bg-neutral-50">
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-center mb-12">
            <h3 className="text-red-700 font-bold tracking-widest text-sm mb-2">SIMULATOR</h3>
            <h2 className="text-3xl font-bold">かんたん買取シミュレーション</h2>
            <p className="text-neutral-500 mt-4">お持ちの廃電線の重量を入力するだけで、概算買取額を即座に算出します。</p>
          </div>

          <div className="bg-white rounded-3xl shadow-xl p-8 border border-neutral-100">
            <div className="grid md:grid-cols-2 gap-12">
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-bold text-neutral-600 mb-2">電線の種類（目安）</label>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { l: '上線 (ピカ線)', v: 80 },
                      { l: '中線 (CV/IV)', v: 60 },
                      { l: '並線 (VA/VVF)', v: 42 },
                      { l: '下線 (家電線)', v: 30 },
                    ].map((t) => (
                      <button 
                        key={t.v}
                        onClick={() => setSimType(t.v)}
                        className={`py-3 px-4 rounded-lg text-sm font-bold border transition ${
                          simType === t.v ? 'bg-red-50 border-red-500 text-red-700' : 'bg-neutral-50 border-neutral-200 text-neutral-600 hover:bg-neutral-100'
                        }`}
                      >
                        {t.l}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-bold text-neutral-600 mb-2">重量 (kg)</label>
                  <input 
                    type="number" 
                    value={simWeight}
                    onChange={(e) => setSimWeight(Number(e.target.value))}
                    className="w-full text-3xl font-bold p-4 bg-neutral-50 rounded-xl border border-neutral-200 focus:border-red-500 outline-none"
                  />
                </div>
              </div>
              <div className="flex flex-col justify-center items-center bg-neutral-900 text-white rounded-2xl p-8 text-center relative overflow-hidden">
                <div className="relative z-10">
                  <div className="text-sm text-neutral-400 mb-2">概算買取金額</div>
                  <div className="text-5xl font-black text-yellow-400 mb-2">¥{estimatedPrice.toLocaleString()}</div>
                  <div className="text-xs text-neutral-500">※実際の買取価格は現物確認後に決定します</div>
                </div>
                {/* Background Decor */}
                <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-red-600 rounded-full blur-3xl opacity-20"></div>
              </div>
            </div>
            <div className="mt-8 text-center">
              <p className="text-sm text-neutral-500">※大量持ち込み（1t以上）の場合は特別単価のご相談も承ります。</p>
            </div>
          </div>
        </div>
      </section>

      {/* About / Access */}
      <section id="access" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h3 className="text-red-700 font-bold tracking-widest text-sm mb-2">ACCESS & INFO</h3>
            <h2 className="text-3xl font-bold mb-6">株式会社 月寒製作所 苫小牧工場</h2>
            <div className="space-y-4 text-neutral-600">
              <div className="flex items-start gap-4">
                <MapPin className="mt-1 text-red-600 shrink-0" />
                <div>
                  <p className="font-bold text-black">〒053-0001 北海道苫小牧市一本松町9-6</p>
                  <p className="text-sm">国道36号線沿い、トラックでの搬入もスムーズです。</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <Phone className="text-red-600 shrink-0" />
                <p className="font-bold text-black text-xl">0144-55-5544</p>
              </div>
              <div className="flex items-center gap-4">
                <Users className="text-red-600 shrink-0" />
                <p>担当：菅野（原料事業部）</p>
              </div>
            </div>
          </div>
          <div className="h-80 bg-neutral-200 rounded-2xl overflow-hidden relative">
             {/* Map Placeholder */}
             <div className="w-full h-full bg-neutral-300 flex items-center justify-center text-neutral-500">
                Google Map Area
             </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-neutral-900 text-white py-12 border-t border-neutral-800">
        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="text-center md:text-left">
            <h4 className="font-bold text-lg">株式会社 月寒製作所</h4>
            <p className="text-xs text-neutral-500 mt-2">© 2026 Tsukisamu Manufacturing Co., Ltd. All Rights Reserved.</p>
          </div>
          
          {/* Staff Login Trigger */}
          <button 
            onClick={onSwitchToDashboard}
            className="text-neutral-700 hover:text-neutral-500 transition flex items-center gap-2 text-xs"
          >
            <Lock size={12} /> Staff Only
          </button>
        </div>
      </footer>
    </div>
  );
}

// ==========================================
//  2. ダッシュボード (System)
// ==========================================
function Dashboard({ products, config, onBackToHome }: { products: Product[], config: MarketConfig, onBackToHome: () => void }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [cart, setCart] = useState<{ product: Product, weight: number }[]>([]);
  const [view, setView] = useState<'simulator' | 'inventory' | 'crm'>('simulator');

  const filteredProducts = useMemo(() => {
    if (!searchQuery) return products.slice(0, 10);
    const q = searchQuery.toLowerCase();
    return products.filter(p => 
      p.maker.toLowerCase().includes(q) || 
      p.name.toLowerCase().includes(q) || 
      p.id.toLowerCase().includes(q) ||
      p.year.toString().includes(q)
    ).sort((a, b) => (a.source.includes("実測") ? -1 : 1));
  }, [searchQuery, products]);

  const addToCart = (product: Product) => {
    const weight = window.prompt(`${product.maker} ${product.name} の重量(kg)を入力`, "10");
    if (weight && !isNaN(Number(weight))) {
      setCart([...cart, { product, weight: Number(weight) }]);
    }
  };

  const totalValue = cart.reduce((sum, item) => 
    sum + (item.weight * (item.product.ratio / 100) * config.price), 0);

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 font-sans">
      {/* System Header */}
      <header className="border-b border-red-900/30 bg-black/50 sticky top-0 z-50 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <button onClick={onBackToHome} className="p-2 bg-neutral-800 rounded-full hover:bg-neutral-700">
              <ChevronRight className="rotate-180 w-4 h-4"/>
            </button>
            <div className="font-bold tracking-tighter text-xl">WIRE PROJECT <span className="text-red-500">TOMAKOMAI</span> <span className="text-xs bg-red-900 text-red-100 px-2 py-0.5 rounded ml-2">PRO</span></div>
          </div>
          <div className="text-right">
            <div className="text-xs text-neutral-500">LME/JX 銅建値</div>
            <div className="text-xl font-black text-red-500">¥{config.price.toLocaleString()}</div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto p-4 grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Search & List */}
        <div className="lg:col-span-8 space-y-6">
          <div className="relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-500 group-focus-within:text-red-500 transition-colors" />
            <input 
              type="text" 
              placeholder="[PRO] メーカー・型番・年式・IDで検索"
              className="w-full bg-neutral-900 border border-neutral-800 rounded-xl py-4 pl-12 pr-4 focus:outline-none focus:border-red-600 transition-all text-lg font-mono"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              autoFocus
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredProducts.map(p => (
              <div 
                key={p.id} 
                onClick={() => addToCart(p)}
                className="bg-neutral-900 border border-neutral-800 p-4 rounded-xl hover:border-red-900/50 cursor-pointer transition-all relative overflow-hidden group"
              >
                {p.source.includes("実測") && (
                  <div className="absolute top-0 right-0 bg-red-600 text-[10px] px-2 py-1 font-bold">VERIFIED</div>
                )}
                <div className="text-xs text-neutral-500 mb-1 flex justify-between">
                  <span>{p.maker} ({p.year})</span>
                  <span className="font-mono text-neutral-700">{p.id}</span>
                </div>
                <div className="font-bold text-lg text-neutral-200">{p.name} <span className="text-neutral-500 text-sm">{p.sq}sq × {p.core}C</span></div>
                <div className="flex justify-between items-end mt-4">
                  <div className="text-sm">
                    実測銅分率: <span className="text-red-500 font-bold text-xl">{p.ratio}%</span>
                  </div>
                  <div className="text-xs text-neutral-600 bg-neutral-800 px-2 py-1 rounded">単価: ¥{Math.floor(config.price * (p.ratio/100)).toLocaleString()}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Cart & Actions */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-neutral-900 border border-red-900/20 rounded-2xl p-6 sticky top-24">
            <div className="flex items-center gap-2 mb-6">
              <Package className="text-red-500" />
              <h2 className="font-bold text-xl">買取リスト作成</h2>
            </div>
            <div className="space-y-4 mb-8 max-h-[40vh] overflow-y-auto">
              {cart.map((item, idx) => (
                <div key={idx} className="flex justify-between items-center border-b border-neutral-800 pb-2 text-sm">
                  <div>
                    <div className="font-bold">{item.product.name}</div>
                    <div className="text-xs text-neutral-500">{item.weight}kg × {item.product.ratio}%</div>
                  </div>
                  <div className="text-right font-mono">
                    ¥{Math.floor(item.weight * (item.product.ratio / 100) * config.price).toLocaleString()}
                  </div>
                </div>
              ))}
            </div>
            <div className="border-t border-neutral-800 pt-4">
              <div className="flex justify-between items-end">
                <span className="text-neutral-400">合計(税抜)</span>
                <span className="text-3xl font-black text-red-500">¥{Math.floor(totalValue).toLocaleString()}</span>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 mt-6">
              <button className="bg-neutral-800 hover:bg-neutral-700 text-white py-3 rounded-lg text-sm font-bold" onClick={() => setCart([])}>クリア</button>
              <button className="bg-red-600 hover:bg-red-700 text-white py-3 rounded-lg text-sm font-bold flex items-center justify-center gap-2">
                <FileText size={16}/> PDF発行
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
