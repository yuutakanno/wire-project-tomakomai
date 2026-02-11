"use client";

import React, { useState, useEffect } from 'react';

export default function WireMasterCloud() {
  const [role, setRole] = useState<'GUEST' | 'MEMBER' | 'ADMIN'>('GUEST');
  const [user, setUser] = useState<any>(null);
  const [db, setDb] = useState<any>({ config: { market_price: 0 }, products: [] });
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // 起動時に建値を取得
  useEffect(() => {
    fetch('/api/gas')
      .then(res => res.json())
      .then(data => {
        if (data.status === 'success') setDb(data);
      })
      .catch(() => setErrorMsg("初期データ取得に失敗しました"));
  }, []);

  const handleLogin = async (e: any) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg(null);
    
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
        setErrorMsg(result.message);
      }
    } catch (err) {
      setErrorMsg("認証通信に失敗しました");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white text-gray-900 font-sans">
      <header className="border-b bg-white px-6 py-4 flex justify-between items-center sticky top-0 z-50">
        <div className="font-black text-xl italic tracking-tighter">月寒製作所 <span className="text-red-600">苫小牧工場</span></div>
        <div className="text-right">
          <span className="text-[10px] text-gray-400 block font-bold tracking-widest uppercase">LME Copper</span>
          <span className="text-lg font-mono text-red-600 font-black">
            ¥{Number(db.config.market_price || 0).toLocaleString()}
          </span>
        </div>
      </header>

      {role === 'GUEST' && (
        <main className="max-w-md mx-auto py-24 px-6">
          <div className="bg-white border-4 border-black p-10 rounded-2xl shadow-2xl">
            <h2 className="text-2xl font-black text-center mb-8 italic uppercase tracking-tighter">Login Portal</h2>
            
            {errorMsg && (
              <div className="mb-6 p-4 bg-red-50 text-red-600 text-xs font-bold rounded border border-red-200">
                {errorMsg}
              </div>
            )}

            <form onSubmit={handleLogin} className="space-y-6">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-gray-400 uppercase">Login ID</label>
                <input name="loginId" className="w-full p-4 bg-gray-100 rounded border-none font-bold" required />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-gray-400 uppercase">Password</label>
                <input name="password" type="password" className="w-full p-4 bg-gray-100 rounded border-none font-bold" required />
              </div>
              <button disabled={loading} className="w-full bg-red-600 text-white py-5 rounded font-black text-lg hover:bg-black transition-colors">
                {loading ? 'Authenticating...' : 'Enter System'}
              </button>
            </form>
          </div>
        </main>
      )}

      {role !== 'GUEST' && (
        <main className="p-10 text-center">
          <div className="bg-slate-50 border-4 border-black p-10 rounded-3xl inline-block text-left min-w-[320px]">
            <span className="text-[10px] font-bold text-red-600 uppercase tracking-widest">{user.rank} MODE</span>
            <h2 className="text-3xl font-black mt-2 mb-6 italic">{user.companyName} 様</h2>
            <div className="space-y-2 mb-10">
              <p className="text-sm font-bold">保有ポイント: {Number(user.points || 0).toLocaleString()} pt</p>
              <p className="text-sm font-bold">ID: {user.clientId}</p>
            </div>
            <button onClick={() => setRole('GUEST')} className="w-full bg-black text-white py-3 rounded font-bold">Logout</button>
          </div>
        </main>
      )}
    </div>
  );
}
