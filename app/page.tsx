"use client";

import React, { useState, useEffect } from 'react';

export default function WireMasterCloud() {
  const [role, setRole] = useState<'GUEST' | 'MEMBER' | 'ADMIN'>('GUEST');
  const [user, setUser] = useState<any>(null);
  const [db, setDb] = useState<any>({ config: { market_price: 0 }, products: [] });
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // 初回ロード
  useEffect(() => {
    fetch('/api/gas')
      .then(res => res.json())
      .then(data => {
        if (data.status === 'success') setDb(data);
      })
      .catch(() => setErrorMessage("市場データの取得に失敗しました"));
  }, []);

  const handleLogin = async (e: any) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage(null);
    
    const payload = {
      action: 'AUTH_LOGIN',
      loginId: e.target.loginId.value,
      password: e.target.password.value
    };

    try {
      const res = await fetch('/api/gas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const result = await res.json();
      
      if (result.status === 'success') {
        setUser(result.user);
        setRole(result.user.rank === 'ADMIN' ? 'ADMIN' : 'MEMBER');
      } else {
        setErrorMessage(result.message);
      }
    } catch (err) {
      setErrorMessage("システムとの通信に失敗しました");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans">
      {/* 銅建値ヘッダー：NaN対策済み */}
      <header className="border-b bg-white/80 backdrop-blur px-6 py-4 flex justify-between items-center sticky top-0 z-50">
        <div className="flex items-center gap-2">
          <div className="bg-red-700 text-white w-10 h-10 flex items-center justify-center font-black rounded text-xl shadow-lg">月</div>
          <h1 className="text-xl font-black italic tracking-tighter">株式会社月寒製作所 <span className="text-red-600">苫小牧工場</span></h1>
        </div>
        <div className="text-right">
          <span className="text-[10px] text-slate-400 block font-bold uppercase tracking-widest">LME COPPER JPY/KG</span>
          <span className="text-xl font-mono text-red-600 font-black">
            ¥{Number(db.config?.market_price || 0).toLocaleString()}
          </span>
        </div>
      </header>

      {/* 公開ログイン画面 (GUEST) */}
      {role === 'GUEST' && (
        <main className="max-w-md mx-auto py-24 px-6 text-center">
          <div className="bg-white border-4 border-slate-900 p-10 rounded-3xl shadow-2xl transition-all hover:scale-[1.02]">
            <h2 className="text-3xl font-black mb-8 italic uppercase tracking-tighter">Authorization</h2>
            
            {errorMessage && (
              <div className="mb-6 p-4 bg-red-50 text-red-600 text-[10px] font-bold rounded border-2 border-red-100 animate-pulse">
                ⚠️ {errorMessage}
              </div>
            )}

            <form onSubmit={handleLogin} className="space-y-6 text-left">
              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1 block">Login ID</label>
                <input name="loginId" className="w-full p-4 bg-slate-50 border-2 border-slate-100 rounded-xl font-bold text-lg focus:border-red-600 outline-none transition-all" placeholder="admin" required />
              </div>
              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1 block">Password</label>
                <input name="password" type="password" className="w-full p-4 bg-slate-50 border-2 border-slate-100 rounded-xl font-bold text-lg focus:border-red-600 outline-none transition-all" placeholder="••••" required />
              </div>
              <button disabled={loading} className="w-full bg-slate-900 text-white py-5 rounded-2xl font-black text-xl hover:bg-red-600 shadow-xl transition-all disabled:opacity-50">
                {loading ? 'AUTHENTICATING...' : 'ENTER SYSTEM'}
              </button>
            </form>
          </div>
          <footer className="mt-12 text-[10px] text-slate-400 font-bold uppercase tracking-[0.2em]">Tsukisamu Material Future 2030</footer>
        </main>
      )}

      {/* 管理者・会員モード（統合ビュー） */}
      {role !== 'GUEST' && (
        <main className="p-6 max-w-5xl mx-auto space-y-6 animate-in fade-in duration-700">
          <div className="bg-slate-900 text-white p-10 rounded-[2.5rem] shadow-2xl relative overflow-hidden">
            <div className="relative z-10 flex justify-between items-start">
              <div>
                <span className="text-red-500 font-black text-xs tracking-widest uppercase mb-2 block">{user.rank} MODE</span>
                <h2 className="text-5xl font-black italic tracking-tighter mb-4">{user.companyName} 様</h2>
                <div className="flex gap-4">
                  <div className="bg-white/10 px-4 py-2 rounded-lg text-sm font-bold border border-white/5">
                    ID: {user.clientId}
                  </div>
                  <div className="bg-white/10 px-4 py-2 rounded-lg text-sm font-bold border border-white/5">
                    POINTS: {Number(user.points || 0).toLocaleString()} pt
                  </div>
                </div>
              </div>
              <button onClick={() => setRole('GUEST')} className="bg-white/10 hover:bg-red-600 text-white px-6 py-2 rounded-full font-bold text-xs transition-all border border-white/10">ログアウト</button>
            </div>
            {/* 装飾 */}
            <div className="absolute top-[-20%] right-[-10%] w-64 h-64 bg-red-600 rounded-full blur-[100px] opacity-20"></div>
          </div>

          {/* 現場・経営管理（Admin専用表示） */}
          {role === 'ADMIN' && (
            <div className="grid md:grid-cols-2 gap-6 mt-12">
              <div className="bg-white border-2 p-8 rounded-3xl">
                <h3 className="font-black text-xl mb-4 italic">Next Step:</h3>
                <p className="text-slate-500 text-sm leading-relaxed">
                  認証が確立されました。ここから「現場サポート機能」として、提供された **Transactions** と **Batches** シートへの書き込みロジックを実装します。
                </p>
              </div>
            </div>
          )}
        </main>
      )}
    </div>
  );
}
