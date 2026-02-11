"use client";

import React, { useState, useEffect } from 'react';

const GAS_API_URL = 'https://script.google.com/macros/s/AKfycbyfYM8q6t7Q7UwIRORFBNOCA-mMpVFE1Z3oLzCJp5GNiYI9_CMy4767p9am2iMY70kl/exec';

export default function WireMasterCloud() {
  const [view, setView] = useState<'LOGIN' | 'POS' | 'FACTORY' | 'DASHBOARD'>('LOGIN');
  const [user, setUser] = useState<any>(null);
  const [copperPrice, setCopperPrice] = useState(1300); // Configから取得想定
  
  // POS用State
  const [posData, setPosData] = useState({ type: 'VVF', weight: 0, rank: 'B' });
  const [currentResult, setCurrentResult] = useState(0);

  // 1. 建値計算ロジック (ランクによる補正)
  useEffect(() => {
    let baseRate = 0.65; // VVF基準
    if (posData.type === 'CV') baseRate = 0.8;
    if (posData.type === '雑線') baseRate = 0.4;

    let rankModifier = 1.0;
    if (posData.rank === 'A') rankModifier = 1.05; // 5%増
    if (posData.rank === 'C') rankModifier = 0.90; // 10%減

    setCurrentResult(Math.floor(copperPrice * baseRate * rankModifier * posData.weight));
  }, [posData, copperPrice]);

  const handleLogin = async (e: any) => {
    e.preventDefault();
    // 実際はAPIを叩く
    setUser({ name: "テスト顧客A", rank: "GOLD", email: "test@example.com" });
    setView('POS');
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 font-sans">
      {/* 共通ヘッダー：常に銅建値を表示 */}
      <header className="bg-black border-b border-cyan-500 p-4 flex justify-between items-center sticky top-0 z-50">
        <div>
          <h1 className="text-xl font-black text-cyan-400">WIRE MASTER CLOUD</h1>
          <p className="text-[10px] text-slate-500">Tomakomai Factory Operating System</p>
        </div>
        <div className="text-right">
          <span className="text-xs block text-slate-400">LME COPPER JPY/KG</span>
          <span className="text-xl font-mono text-yellow-400">¥{copperPrice.toLocaleString()}</span>
        </div>
      </header>

      {/* ログイン画面 */}
      {view === 'LOGIN' && (
        <div className="max-w-md mx-auto mt-20 p-8 bg-slate-800 rounded-xl border border-slate-700">
          <h2 className="text-2xl font-bold mb-6 text-center">認証</h2>
          <form onSubmit={handleLogin} className="space-y-4">
            <input type="email" placeholder="Email" className="w-full p-4 bg-slate-900 border border-slate-600 rounded" required />
            <button className="w-full py-4 bg-cyan-600 hover:bg-cyan-500 rounded font-black transition">ENTER SYSTEM</button>
            <p className="text-center text-xs text-slate-500">※初回取引完了後にアカウントが有効化されます</p>
          </form>
        </div>
      )}

      {/* 買取POSモード */}
      {user && view === 'POS' && (
        <main className="p-4 max-w-4xl mx-auto space-y-6">
          <div className="flex gap-2">
            <button onClick={()=>setView('POS')} className={`flex-1 py-2 rounded font-bold ${view==='POS'?'bg-cyan-600':'bg-slate-700'}`}>1. 買取入力</button>
            <button onClick={()=>setView('FACTORY')} className="flex-1 py-2 bg-slate-700 rounded font-bold">2. 工場稼働</button>
          </div>

          <div className="bg-slate-800 p-6 rounded-xl border border-slate-700 space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-slate-400">線種</label>
                <select className="w-full p-4 bg-slate-900 rounded border-slate-600" onChange={e=>setPosData({...posData, type: e.target.value})}>
                  <option>VVF</option><option>CV</option><option>雑線</option>
                </select>
              </div>
              <div>
                <label className="text-xs font-bold text-slate-400">コンディション</label>
                <div className="flex gap-1 mt-1">
                  {['A','B','C'].map(r => (
                    <button key={r} onClick={()=>setPosData({...posData, rank: r})} className={`flex-1 py-3 rounded font-black ${posData.rank === r ? 'bg-yellow-500 text-black':'bg-slate-700'}`}>{r}</button>
                  ))}
                </div>
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-400">重量 (kg)</label>
              <input type="number" className="w-full p-6 bg-slate-900 text-3xl font-mono text-cyan-400 rounded border-slate-600" 
                onChange={e=>setPosData({...posData, weight: parseFloat(e.target.value)})} />
            </div>

            <div className="p-6 bg-black rounded-lg border-2 border-cyan-500 text-center">
              <span className="text-xs text-slate-400">買取合計金額</span>
              <div className="text-5xl font-mono text-white">¥{currentResult.toLocaleString()}</div>
            </div>

            <button className="w-full py-6 bg-red-600 hover:bg-red-500 text-white rounded-xl font-black text-xl shadow-lg">買取確定・ID発行</button>
          </div>
        </main>
      )}

      {/* 工場モード (Step 2 & 3) */}
      {view === 'FACTORY' && (
        <main className="p-4 max-w-4xl mx-auto space-y-4">
          <h2 className="text-xl font-bold border-l-4 border-yellow-500 pl-3">WN-800 オペレーションボード</h2>
          <div className="bg-slate-800 p-4 rounded border border-slate-700 flex justify-between items-center">
            <div>
              <span className="text-xs text-slate-400">待機中のバッチ</span>
              <div className="text-lg font-bold">TRX-20260211-001 (CV 150kg)</div>
            </div>
            <button className="bg-green-600 px-8 py-4 rounded font-black">START</button>
          </div>
          
          <div className="grid grid-cols-2 gap-4 mt-8">
            <div className="bg-black p-4 rounded text-center">
              <span className="text-xs text-slate-500">今月の累計処理量</span>
              <div className="text-2xl font-mono text-cyan-400">12,450 / 30,000 kg</div>
            </div>
            <div className="bg-black p-4 rounded text-center">
              <span className="text-xs text-slate-500">本日のノルマ残り</span>
              <div className="text-2xl font-mono text-red-500">650 kg</div>
            </div>
          </div>
        </main>
      )}
    </div>
  );
}
