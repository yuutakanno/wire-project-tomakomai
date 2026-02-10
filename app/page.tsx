"use client";

import React, { useState, useEffect, useMemo } from 'react';
import { Camera, Search, FileText, TrendingUp, Users, Package, RefreshCw, ChevronRight } from 'lucide-react';

// ==========================================
// 【設定】 GASのウェブアプリURLをここに貼り付け
// ==========================================
const GAS_API_URL = "https://script.google.com/macros/s/YOUR_GAS_DEPLOY_ID/exec";

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

export default function TomakomaiDashboard() {
  const [products, setProducts] = useState<Product[]>([]);
  const [config, setConfig] = useState<MarketConfig>({ price: 0, lastUpdate: "" });
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [cart, setCart] = useState<{ product: Product, weight: number }[]>([]);
  const [view, setView] = useState<'simulator' | 'inventory' | 'crm'>('simulator');

  // --- データ取得 ---
  useEffect(() => {
    async function init() {
      try {
        const [prodRes, confRes] = await Promise.all([
          fetch(`${GAS_API_URL}?action=get_products`).then(r => r.json()),
          fetch(`${GAS_API_URL}?action=get_config`).then(r => r.json())
        ]);
        setProducts(prodRes.products || []);
        setConfig({ price: confRes.price, lastUpdate: confRes.description });
      } catch (e) {
        console.error("Data fetch failed", e);
      } finally {
        setLoading(false);
      }
    }
    init();
  }, []);

  // --- 検索ロジック (ボスの実測データを最優先) ---
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

  // --- 計算ロジック ---
  const addToCart = (product: Product) => {
    const weight = window.prompt(`${product.maker} ${product.name} の重量(kg)を入力`, "10");
    if (weight && !isNaN(Number(weight))) {
      setCart([...cart, { product, weight: Number(weight) }]);
    }
  };

  const totalValue = cart.reduce((sum, item) => 
    sum + (item.weight * (item.product.ratio / 100) * config.price), 0);

  if (loading) return <div className="min-h-screen bg-black flex items-center justify-center text-red-500 animate-pulse">Alpha System Loading...</div>;

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 font-sans">
      {/* ヘッダー: 銅相場リアルタイム表示 */}
      <header className="border-b border-red-900/30 bg-black/50 sticky top-0 z-50 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-red-600 rounded-sm flex items-center justify-center font-black">T</div>
            <h1 className="font-bold tracking-tighter text-xl">WIRE PROJECT <span className="text-red-500">TOMAKOMAI</span></h1>
          </div>
          <div className="flex items-center gap-4 text-sm">
            <div className="text-right">
              <div className="text-xs text-neutral-500">LME/JX 銅建値 (kg)</div>
              <div className="text-xl font-black text-red-500">¥{config.price.toLocaleString()}</div>
            </div>
            <RefreshCw className="w-4 h-4 text-neutral-600 animate-spin-slow" />
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto p-4 grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* 左側: メイン操作エリア */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* 検索バー: ここでボスの実測データを一瞬で引き出す */}
          <div className="relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-500 group-focus-within:text-red-500 transition-colors" />
            <input 
              type="text" 
              placeholder="メーカー、型番、製造年で検索 (例: 矢崎 2025 IV)"
              className="w-full bg-neutral-900 border border-neutral-800 rounded-xl py-4 pl-12 pr-4 focus:outline-none focus:border-red-600 transition-all text-lg"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {/* 製品リスト */}
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
                <div className="text-xs text-neutral-500 mb-1">{p.maker} | {p.year}年製</div>
                <div className="font-bold text-lg">{p.name} {p.sq}sq × {p.core}C</div>
                <div className="flex justify-between items-end mt-4">
                  <div className="text-sm">
                    期待銅分率: <span className="text-red-500 font-bold">{p.ratio}%</span>
                  </div>
                  <div className="text-xs text-neutral-600">ID: {p.id}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 右側: 査定・カートエリア */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-neutral-900 border border-red-900/20 rounded-2xl p-6 sticky top-24">
            <div className="flex items-center gap-2 mb-6">
              <TrendingUp className="text-red-500" />
              <h2 className="font-bold text-xl">現在の査定概算</h2>
            </div>

            <div className="space-y-4 mb-8 max-h-[40vh] overflow-y-auto">
              {cart.length === 0 && (
                <div className="text-center py-12 text-neutral-600 border-2 border-dashed border-neutral-800 rounded-xl">
                  品目を選択してください
                </div>
              )}
              {cart.map((item, idx) => (
                <div key={idx} className="flex justify-between items-center border-b border-neutral-800 pb-2">
                  <div>
                    <div className="text-sm font-bold">{item.product.name}</div>
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
                <span className="text-neutral-400">合計買取額</span>
                <span className="text-3xl font-black text-red-500">¥{Math.floor(totalValue).toLocaleString()}</span>
              </div>
            </div>

            <button 
              className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-4 rounded-xl mt-8 flex items-center justify-center gap-2 transition-all active:scale-95"
              onClick={() => alert("PDF発行機能をGAS経由で呼び出します")}
            >
              <FileText className="w-5 h-5" />
              明細書(PDF)を発行する
            </button>
          </div>
        </div>
      </main>

      {/* フッターナビ: スマホ操作を意識 */}
      <nav className="fixed bottom-0 w-full bg-black border-t border-neutral-800 p-2 lg:hidden flex justify-around">
        <button onClick={() => setView('simulator')} className={`p-3 rounded-lg ${view==='simulator'?'text-red-500':'text-neutral-500'}`}><TrendingUp /></button>
        <button onClick={() => setView('inventory')} className={`p-3 rounded-lg ${view==='inventory'?'text-red-500':'text-neutral-500'}`}><Package /></button>
        <button onClick={() => setView('crm')} className={`p-3 rounded-lg ${view==='crm'?'text-red-500':'text-neutral-500'}`}><Users /></button>
      </nav>
    </div>
  );
}
