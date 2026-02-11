"use client";

import React, { useState, useEffect } from 'react';

const GAS_API_URL = 'https://script.google.com/macros/s/AKfycbyfYM8q6t7Q7UwIRORFBNOCA-mMpVFE1Z3oLzCJp5GNiYI9_CMy4767p9am2iMY70kl/exec';

export default function WireMasterCloud() {
  const [role, setRole] = useState<'GUEST' | 'MEMBER' | 'ADMIN'>('GUEST');
  const [user, setUser] = useState<any>(null);
  const [db, setDb] = useState<any>({ config: { market_price: '---' }, products: [] });
  const [loading, setLoading] = useState(false);

  // 【重要】ページロード時に建値を取得
  useEffect(() => {
    fetch(GAS_API_URL) // doGetを叩く
      .then(res => res.json())
      .then(data => setDb(data))
      .catch(e => console.error("Initial load error:", e));
  }, []);

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
      } else {
        alert(result.message);
      }
    } catch (err) {
      alert("通信に失敗しました。GASの公開設定を確認してください。");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white text-gray-900">
      <header className="border-b px-6 py-4 flex justify-between items-center sticky top-0 bg-white z-50">
        <div className="font-black text-xl italic tracking-tighter">月寒製作所 <span className="text-red-600">苫小牧工場</span></div>
        <div className="text-right">
          <span className="text-[10px] text-gray-400 block font-bold">LME COPPER JPY/KG</span>
          <span className="text-lg font-mono text-red-600 font-black">¥{Number(db.config.market_price).toLocaleString()}</span>
        </div>
      </header>

      {role === 'GUEST' && (
        <main className="max-w-md mx-auto py-24 px-6 text-center">
          <div className="bg-white border-4 border-black p-10 rounded-2xl shadow-2xl">
            <h2 className="text-3xl font-black mb-8 italic">LOGIN</h2>
            <form onSubmit={login} className="space-y-6 text-left">
              <input name="loginId" className="w-full p-4 bg-gray-100 rounded border-none font-bold" placeholder="ID (admin 等)" required />
              <input name="password" type="password" className="w-full p-4 bg-gray-100 rounded border-none font-bold" placeholder="PASS (user 等)" required />
              <button disabled={loading} className="w-full bg-red-600 text-white py-5 rounded font-black text-lg">
                {loading ? '認証中...' : 'システムにアクセス'}
              </button>
            </form>
          </div>
          <p className="mt-8 text-xs text-gray-400 font-bold uppercase tracking-widest">Tomakomai DX Project 2026</p>
        </main>
      )}

      {/* ログイン後のADMIN/MEMBER表示（省略、認証成功時に表示） */}
      {role !== 'GUEST' && (
        <div className="p-20 text-center">
          <h2 className="text-3xl font-black">LOGIN SUCCESS: {user.companyName}</h2>
          <p className="mt-4 text-slate-500">ロール: {role} / ランク: {user.rank}</p>
          <button onClick={() => setRole('GUEST')} className="mt-10 underline text-sm">Logout</button>
        </div>
      )}
    </div>
  );
}
