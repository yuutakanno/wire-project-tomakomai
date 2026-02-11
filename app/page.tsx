"use client";

import React, { useState, useEffect } from 'react';

export default function WireMasterCloud() {
  const [role, setRole] = useState<'GUEST' | 'MEMBER' | 'ADMIN'>('GUEST');
  const [user, setUser] = useState<any>(null);
  const [marketPrice, setMarketPrice] = useState<number>(0);
  const [loading, setLoading] = useState(false);
  const [sysLog, setSysLog] = useState<string>('システム起動中...');

  // 1. 初期データ（建値）のロード
  useEffect(() => {
    fetch('/api/gas')
      .then(res => res.json())
      .then(data => {
        if (data.status === 'success' && data.config.market_price) {
          setMarketPrice(Number(data.config.market_price));
          setSysLog('システム準備完了');
        }
      })
      .catch(() => setSysLog('データ接続エラー'));
  }, []);

  // 2. ログイン処理
  const onLogin = async (e: any) => {
    e.preventDefault();
    setLoading(true);
    setSysLog('認証中...');
    
    try {
      const res = await fetch('/api/gas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'AUTH_LOGIN',
          loginId: e.target.loginId.value,
          password: e.target.password.value
        })
      });
      const result = await res.json();

      if (result.status === 'success') {
        setUser(result.user);
        // rankがADMINなら管理者、それ以外は会員
        setRole(result.user.rank === 'ADMIN' ? 'ADMIN' : 'MEMBER');
        setSysLog('ログイン成功');
      } else {
        setSysLog(`認証拒否: ${result.message}`);
      }
    } catch (err) {
      setSysLog('通信エラーが発生しました');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans">
      <header className="border-b bg-white px-6 py-4 flex justify-between items-center sticky top-0 z-50 shadow-sm">
        <div className="font-black text-xl italic italic">月寒製作所 <span className="text-red-600">苫小牧工場</span></div>
        <div className="text-right">
          <span className="text-[10px] text-slate-400 block font-bold">LME COPPER JPY/KG</span>
          <span className="text-xl font-mono text-red-600 font-black">
            ¥{marketPrice.toLocaleString()}
          </span>
        </div>
      </header>

      {role === 'GUEST' && (
        <main className="max-w-md mx-auto py-24 px-6">
          <div className="bg-white border-4 border-black p-10 rounded-2xl shadow-2xl">
            <h2 className="text-3xl font-black text-center mb-8 italic">LOGIN</h2>
            <form onSubmit={onLogin} className="space-y-6">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase">Login ID</label>
                <input name="loginId" className="w-full p-4 bg-slate-50 rounded border-2 border-slate-100 font-bold" placeholder="admin" required />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase">Password</label>
                <input name="password" type="password" className="w-full p-4 bg-slate-50 rounded border-2 border-slate-100 font-bold" placeholder="user" required />
              </div>
              <button disabled={loading} className="w-full bg-red-600 text-white py-5 rounded font-black text-lg hover:bg-black transition-all">
                {loading ? 'WAIT...' : 'ENTER'}
              </button>
            </form>
          </div>
          <div className="mt-8 p-4 bg-slate-900 text-cyan-400 text-[10px] font-mono rounded-lg">
            [SYSTEM_LOG]: {sysLog}
          </div>
        </main>
      )}

      {/* 管理者モード：経営ダッシュボード */}
      {role === 'ADMIN' && (
        <main className="p-6 max-w-7xl mx-auto space-y-6">
          <h2 className="text-2xl font-black border-l-8 border-red-600 pl-4 uppercase italic">Admin Cockpit</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white p-8 rounded-3xl border-4 border-black shadow-xl">
              <h3 className="font-black text-xl mb-4">現場タスク管理</h3>
              <p className="text-sm text-slate-500">入荷した電線の処理状況をリアルタイムで管理します。</p>
              {/* ここにBatchesシートの内容を表示する機能を次に追加します */}
            </div>
          </div>
          <button onClick={() => setRole('GUEST')} className="text-xs underline text-slate-400">ログアウト</button>
        </main>
      )}

      {/* 会員モード：マイページ */}
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
            </div>
            <button onClick={() => setRole('GUEST')} className="mt-10 text-xs opacity-30 underline">ログアウト</button>
          </div>
        </main>
      )}
    </div>
  );
}
