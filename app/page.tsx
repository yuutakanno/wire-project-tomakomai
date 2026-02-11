"use client";

import React, { useState, useEffect } from 'react';

const GAS_API_URL = 'https://script.google.com/macros/s/AKfycbyfYM8q6t7Q7UwIRORFBNOCA-mMpVFE1Z3oLzCJp5GNiYI9_CMy4767p9am2iMY70kl/exec';

export default function WireMasterCloud() {
  const [role, setRole] = useState<'GUEST' | 'MEMBER' | 'ADMIN'>('GUEST');
  const [user, setUser] = useState<any>(null);
  const [db, setDb] = useState<any>({ config: {}, products: [], pendingBatches: [] });
  const [loading, setLoading] = useState(false);

  // 1. 認証と初期データロード
  const login = async (e: any) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch(GAS_API_URL, {
        method: 'POST',
        body: JSON.stringify({ action: 'AUTH_LOGIN', loginId: e.target.loginId.value, password: e.target.password.value })
      });
      const result = await res.json();
      if (result.status === 'success') {
        setUser(result.user);
        setRole(result.user.rank === 'ADMIN' ? 'ADMIN' : 'MEMBER');
        const initRes = await fetch(GAS_API_URL, { method: 'POST', body: JSON.stringify({ action: 'GET_INIT_DATA' }) });
        setDb(await initRes.json());
      } else { alert(result.message); }
    } catch (err) { alert("通信エラー"); } finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen bg-white font-sans text-gray-900">
      <header className="border-b px-6 py-4 flex justify-between items-center sticky top-0 bg-white z-50">
        <div className="font-black text-xl italic tracking-tighter">月寒製作所 <span className="text-red-600">苫小牧工場</span></div>
        <div className="text-right">
          <span className="text-[10px] text-gray-400 block font-bold">LME COPPER JPY/KG</span>
          <span className="text-lg font-mono text-red-600 font-black">¥{Number(db.config.market_price).toLocaleString()}</span>
        </div>
      </header>

      {role === 'ADMIN' && (
        <main className="p-6 max-w-7xl mx-auto space-y-6">
          <h2 className="text-2xl font-black border-l-8 border-red-600 pl-4 uppercase italic">Admin Cockpit</h2>
          
          {/* Dashboard: 収支と目標 */}
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-neutral-900 text-white p-8 rounded-3xl shadow-xl">
              <p className="text-xs font-bold text-gray-500 mb-2">MONTHLY PROGRESS</p>
              <div className="text-4xl font-mono font-black">12.5 <small className="text-sm">/ 30.0 t</small></div>
              <div className="w-full bg-white/10 h-2 mt-4 rounded-full overflow-hidden">
                <div className="bg-red-600 h-full" style={{width:'42%'}}></div>
              </div>
            </div>
            <div className="bg-white border-2 p-8 rounded-3xl">
              <p className="text-xs font-bold text-gray-400 mb-2">PENDING BATCHES</p>
              <div className="text-4xl font-mono font-black text-orange-500">{db.pendingBatches.length}</div>
            </div>
            <div className="bg-green-50 p-8 rounded-3xl border border-green-200">
              <p className="text-xs font-bold text-green-600 mb-2">EST. PROFIT (FEB)</p>
              <div className="text-4xl font-mono font-black text-green-700">¥1.82M</div>
            </div>
          </div>

          {/* POS & Factory Tasks */}
          <div className="grid lg:grid-cols-2 gap-8">
            <div className="bg-white p-8 rounded-3xl border-4 border-black shadow-2xl">
              <h3 className="text-xl font-black mb-6">1. 買取POS入力</h3>
              <div className="space-y-4">
                <select className="w-full p-4 border-2 rounded-xl font-bold">
                  {db.products.map((p:any) => <option key={p.id}>{p.name} ({p.ratio}%)</option>)}
                </select>
                <input type="number" className="w-full p-4 border-2 rounded-xl text-3xl font-mono font-black" placeholder="重量 kg" />
                <button className="w-full bg-black text-white py-6 rounded-xl font-black text-2xl">買取確定・ID発行</button>
              </div>
            </div>

            <div className="bg-neutral-50 p-8 rounded-3xl border space-y-4">
              <h3 className="text-xl font-black mb-4">2. WN-800 現場タスク</h3>
              {db.pendingBatches.map((b:any) => (
                <div key={b.id} className="bg-white p-4 rounded-xl border-2 flex justify-between items-center">
                  <div>
                    <p className="text-xs font-bold text-gray-400">{b.id}</p>
                    <p className="font-black">{b.client}</p>
                    <p className="text-sm">{b.weight} kg</p>
                  </div>
                  <button className="bg-red-600 text-white px-8 py-3 rounded-xl font-black shadow-lg">加工開始</button>
                </div>
              ))}
            </div>
          </div>
        </main>
      )}

      {role === 'MEMBER' && (
        <main className="max-w-3xl mx-auto py-12 px-6">
          <div className="bg-slate-900 text-white p-10 rounded-3xl shadow-2xl">
            <h2 className="text-4xl font-black italic">{user.rank} MEMBER</h2>
            <p className="mt-2 font-bold opacity-70">{user.companyName} 様</p>
            <div className="mt-8 grid grid-cols-2 gap-4">
              <div className="bg-white/10 p-6 rounded-2xl">
                <p className="text-xs opacity-50">保有ポイント</p>
                <p className="text-3xl font-mono font-black">{Number(user.points).toLocaleString()} pt</p>
              </div>
              <div className="bg-red-600/20 p-6 rounded-2xl border border-red-500/50 text-center">
                <p className="text-xs text-red-400">ランク特典適用</p>
                <p className="text-2xl font-black">＋2% 増額</p>
              </div>
            </div>
          </div>
          <div className="mt-12">
            <h3 className="text-xl font-black mb-6">前回の取引フィードバック</h3>
            <div className="bg-white border-2 p-8 rounded-3xl text-center">
              <p className="text-gray-500">前回の実測歩留まり：<span className="text-slate-900 font-black">64.2%</span></p>
              <p className="text-sm text-green-600 font-bold mt-2">基準を上回る高品質な選別です。ボーナスポイントを付与しました。</p>
            </div>
          </div>
        </main>
      )}

      {role === 'GUEST' && (
        <main className="max-w-md mx-auto py-24 px-6">
          <div className="bg-white border-4 border-black p-10 rounded-2xl shadow-2xl">
            <h2 className="text-3xl font-black text-center mb-8 italic">AUTHENTICATION</h2>
            <form onSubmit={login} className="space-y-6">
              <input name="loginId" className="w-full p-4 bg-gray-100 rounded border-none font-bold" placeholder="ID" required />
              <input name="password" type="password" className="w-full p-4 bg-gray-100 rounded border-none font-bold" placeholder="PASS" required />
              <button disabled={loading} className="w-full bg-red-600 text-white py-5 rounded font-black text-lg">
                {loading ? 'CONNECTING...' : 'ENTER SYSTEM'}
              </button>
            </form>
          </div>
        </main>
      )}
    </div>
  );
}
