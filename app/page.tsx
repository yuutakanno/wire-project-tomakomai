"use client";

import React, { useState, useEffect } from 'react';

export default function WireMasterCloud() {
  const [role, setRole] = useState<'GUEST' | 'MEMBER' | 'ADMIN'>('GUEST');
  const [user, setUser] = useState<any>(null);
  const [db, setDb] = useState<any>({ config: { market_price: 0 }, products: [] });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 初回データ取得
  useEffect(() => {
    fetch('/api/gas')
      .then(res => res.json())
      .then(data => setDb(data))
      .catch(() => setError("システム初期化エラー"));
  }, []);

  const handleLogin = async (e: any) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/gas', {
        method: 'POST',
        body: JSON.stringify({
          action: 'AUTH_LOGIN',
          loginId: e.target.loginId.value,
          password: e.target.password.value
        })
      });
      const result = await res.json();
      if (result.status === 'success') {
        setUser(result.user);
        setRole(result.user.rank === 'ADMIN' ? 'ADMIN' : 'MEMBER');
      } else {
        setError(result.message);
      }
    } catch (err) {
      setError("認証通信エラー");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans">
      {/* Header */}
      <header className="border-b bg-white px-6 py-4 flex justify-between items-center sticky top-0 z-50 shadow-sm">
        <div className="font-black text-xl italic tracking-tighter">月寒製作所 <span className="text-red-600">苫小牧工場</span></div>
        <div className="text-right">
          <span className="text-[10px] text-gray-400 block font-bold">LME COPPER JPY/KG</span>
          <span className="text-lg font-mono text-red-600 font-black">
            ¥{db.config?.market_price ? Number(db.config.market_price).toLocaleString() : '---'}
          </span>
        </div>
      </header>

      {/* ログイン前 (GUEST) */}
      {role === 'GUEST' && (
        <main className="max-w-md mx-auto py-24 px-6 text-center">
          <div className="bg-white border-4 border-black p-10 rounded-2xl shadow-2xl">
            <h2 className="text-3xl font-black mb-8 italic uppercase">Authentication</h2>
            {error && <p className="mb-4 text-red-600 text-xs font-bold bg-red-50 p-2 rounded border border-red-200">{error}</p>}
            <form onSubmit={handleLogin} className="space-y-6 text-left">
              <div>
                <label className="text-[10px] font-bold text-gray-400 uppercase">Login ID</label>
                <input name="loginId" className="w-full p-4 bg-gray-100 rounded border-none font-bold" required />
              </div>
              <div>
                <label className="text-[10px] font-bold text-gray-400 uppercase">Password</label>
                <input name="password" type="password" className="w-full p-4 bg-gray-100 rounded border-none font-bold" required />
              </div>
              <button disabled={loading} className="w-full bg-red-600 text-white py-5 rounded font-black text-lg shadow-lg hover:bg-black transition">
                {loading ? 'WAIT...' : 'ENTER'}
              </button>
            </form>
          </div>
        </main>
      )}

      {/* 管理者モード (ADMIN) */}
      {role === 'ADMIN' && (
        <main className="p-6 max-w-7xl mx-auto space-y-6">
          <h2 className="text-3xl font-black border-l-8 border-red-600 pl-4 uppercase italic">Admin Cockpit</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-neutral-900 text-white p-8 rounded-3xl shadow-xl">
              <p className="text-xs font-bold text-gray-500 mb-2">PROGRESS</p>
              <div className="text-4xl font-mono font-black">12.5 <small className="text-sm opacity-50">/ 30.0 t</small></div>
            </div>
            <div className="bg-white border-2 p-8 rounded-3xl">
              <p className="text-xs font-bold text-gray-400 mb-2">TARGET COPPER</p>
              <div className="text-4xl font-mono font-black text-red-600">¥{Number(db.config?.market_price).toLocaleString()}</div>
            </div>
            <div className="bg-green-50 p-8 rounded-3xl border border-green-200">
              <p className="text-xs font-bold text-green-600 mb-2">EST. PROFIT</p>
              <div className="text-4xl font-mono font-black text-green-700">¥1.8M</div>
            </div>
          </div>
          <div className="p-10 bg-white border-2 rounded-3xl text-center">
            <p className="font-bold">管理者用POS・工場管理機能はここに追加されます</p>
            <button onClick={() => setRole('GUEST')} className="mt-4 text-xs underline text-gray-400">ログアウト</button>
          </div>
        </main>
      )}

      {/* 会員モード (MEMBER) */}
      {role === 'MEMBER' && (
        <main className="max-w-3xl mx-auto py-12 px-6">
          <div className="bg-slate-900 text-white p-10 rounded-3xl shadow-2xl">
            <span className="text-yellow-400 font-black text-xs tracking-widest uppercase">Member Status</span>
            <h2 className="text-5xl font-black italic">{user.rank} MEMBER</h2>
            <p className="mt-2 font-bold opacity-70">{user.companyName} 様</p>
            <div className="mt-8 grid grid-cols-2 gap-4">
              <div className="bg-white/10 p-6 rounded-2xl border border-white/5">
                <p className="text-xs opacity-50">保有ポイント</p>
                <p className="text-3xl font-mono font-black">{Number(user.points).toLocaleString()} pt</p>
              </div>
              <div className="bg-red-600/20 p-6 rounded-2xl border border-red-500/50">
                <p className="text-xs text-red-400">ランク特典</p>
                <p className="text-2xl font-black">＋2% 優遇中</p>
              </div>
            </div>
            <button onClick={() => setRole('GUEST')} className="mt-8 text-xs opacity-30 underline">ログアウト</button>
          </div>
        </main>
      )}
    </div>
  );
}
