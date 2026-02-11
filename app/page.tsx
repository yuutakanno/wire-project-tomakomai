"use client";

import React, { useState, useEffect } from 'react';

const GAS_API_URL = 'https://script.google.com/macros/s/AKfycbyfYM8q6t7Q7UwIRORFBNOCA-mMpVFE1Z3oLzCJp5GNiYI9_CMy4767p9am2iMY70kl/exec';

export default function WireMasterCloud() {
  const [role, setRole] = useState<'GUEST' | 'MEMBER' | 'ADMIN'>('GUEST');
  const [user, setUser] = useState<any>(null);
  const [adminStats, setAdminStats] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  // 認証ロジック
  const onLogin = async (e: any) => {
    e.preventDefault();
    setLoading(true);
    const payload = {
      action: 'AUTH_LOGIN',
      loginId: e.target.loginId.value,
      password: e.target.password.value
    };

    try {
      const res = await fetch(GAS_API_URL, { method: 'POST', body: JSON.stringify(payload) });
      const result = await res.json();
      if (result.status === 'success') {
        setUser(result.user);
        setRole(result.user.role === 'ADMIN' ? 'ADMIN' : 'MEMBER');
        if (result.user.role === 'ADMIN') loadAdminStats();
      } else {
        alert(result.message);
      }
    } catch (err) {
      alert("システム接続エラー");
    } finally {
      setLoading(false);
    }
  };

  // 管理者ダッシュボード読み込み
  const loadAdminStats = async () => {
    const res = await fetch(GAS_API_URL, { method: 'POST', body: JSON.stringify({ action: 'GET_ADMIN_STATS' }) });
    const result = await res.json();
    setAdminStats(result);
  };

  return (
    <div className="min-h-screen bg-white text-gray-900">
      {/* 共通Header */}
      <header className="border-b px-6 py-4 flex justify-between items-center sticky top-0 bg-white z-50">
        <div className="flex items-center gap-2">
          <div className="bg-red-700 text-white p-2 font-bold rounded">月</div>
          <h1 className="text-xl font-black">月寒製作所 <span className="text-red-600 text-sm">苫小牧工場 DX</span></h1>
        </div>
        {role !== 'GUEST' && <button onClick={() => setRole('GUEST')} className="text-xs underline">ログアウト</button>}
      </header>

      {/* --- ADMIN: 工場・経営コックピット --- */}
      {role === 'ADMIN' && (
        <main className="p-6 max-w-7xl mx-auto space-y-6">
          <h2 className="text-2xl font-black border-l-8 border-red-600 pl-4 uppercase tracking-tighter italic">Admin Cockpit</h2>
          
          {/* Dashboard Cards */}
          <div className="grid md:grid-cols-4 gap-4">
            <div className="bg-neutral-900 text-white p-6 rounded-2xl shadow-xl">
              <p className="text-[10px] font-bold text-gray-500 uppercase">Copper Market</p>
              <div className="text-3xl font-mono font-black text-red-500">¥{adminStats?.copperPrice}</div>
            </div>
            <div className="bg-white border-2 border-neutral-100 p-6 rounded-2xl shadow-sm">
              <p className="text-[10px] font-bold text-gray-400 uppercase">Avg Yield (WN-800)</p>
              <div className="text-3xl font-mono font-black text-cyan-600">{adminStats?.avgYield}%</div>
            </div>
            <div className="bg-white border-2 border-neutral-100 p-6 rounded-2xl shadow-sm">
              <p className="text-[10px] font-bold text-gray-400 uppercase">Pending Tasks</p>
              <div className="text-3xl font-mono font-black text-orange-500">{adminStats?.pendingTasks}</div>
            </div>
            <div className="bg-green-50 p-6 rounded-2xl border-2 border-green-200">
              <p className="text-[10px] font-bold text-green-600 uppercase">Profit (Monthly)</p>
              <div className="text-3xl font-mono font-black text-green-700">¥1,850k</div>
            </div>
          </div>

          {/* Task Management & Analysis */}
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white border-4 border-black p-6 rounded-2xl">
              <h3 className="font-black mb-4">タスク管理（買取予約・入荷）</h3>
              <div className="space-y-2">
                <div className="p-3 bg-gray-50 rounded border flex justify-between items-center text-sm">
                  <div><b>TRX-102: 山田建設</b> (VVF 100kg)</div>
                  <button className="bg-black text-white px-3 py-1 rounded text-xs">投入開始</button>
                </div>
              </div>
            </div>
            <div className="bg-neutral-50 p-6 rounded-2xl border">
              <h3 className="font-black mb-4">WN-800 個別歩留まり解析入力</h3>
              <div className="grid grid-cols-2 gap-4">
                <input className="p-3 border rounded font-mono" placeholder="投入重量(kg)" />
                <input className="p-3 border rounded font-mono" placeholder="回収銅重量(kg)" />
              </div>
              <button className="w-full mt-4 bg-red-600 text-white py-3 rounded font-black">実績確定・歩留まり反映</button>
            </div>
          </div>
        </main>
      )}

      {/* --- MEMBER: 会員マイページ --- */}
      {role === 'MEMBER' && (
        <main className="p-6 max-w-3xl mx-auto space-y-6">
          <div className="bg-slate-900 text-white p-10 rounded-3xl shadow-2xl relative overflow-hidden">
            <h2 className="text-4xl font-black italic">{user.rank} MEMBER</h2>
            <p className="mt-2 font-bold opacity-70">{user.company} 様、お疲れ様です。</p>
            <div className="mt-8 grid grid-cols-2 gap-4">
              <div className="bg-white/10 p-4 rounded-xl">
                <p className="text-xs opacity-50">累計ポイント</p>
                <p className="text-2xl font-mono font-black">{user.points} pt</p>
              </div>
              <div className="bg-white/10 p-4 rounded-xl">
                <p className="text-xs opacity-50">現在の優遇</p>
                <p className="text-2xl font-black">＋5円/kg</p>
              </div>
            </div>
          </div>
          <div className="bg-white border-2 border-slate-100 p-8 rounded-3xl shadow-lg">
            <h3 className="font-black text-xl mb-6 flex items-center gap-2">
              <span className="text-red-600">📊</span> 実績フィードバック
            </h3>
            <div className="text-center py-10 text-slate-400">
              前回の持ち込み歩留まり：<b className="text-slate-900">62.5% (特A判定)</b><br />
              丁寧な選別ありがとうございます。
            </div>
          </div>
        </main>
      )}

      {/* --- GUEST: ログイン・LP --- */}
      {role === 'GUEST' && (
        <main className="max-w-md mx-auto py-20 px-6">
          <div className="bg-white border-4 border-black p-10 rounded-2xl shadow-2xl">
            <h2 className="text-3xl font-black text-center mb-8 italic">AUTHENTICATION</h2>
            <form onSubmit={onLogin} className="space-y-6">
              <div>
                <label className="text-xs font-bold text-gray-400 block mb-1">LOGIN ID</label>
                <input name="loginId" className="w-full p-4 bg-gray-100 rounded border-none font-bold" required />
              </div>
              <div>
                <label className="text-xs font-bold text-gray-400 block mb-1">PASSWORD</label>
                <input name="password" type="password" className="w-full p-4 bg-gray-100 rounded border-none font-bold" required />
              </div>
              <button disabled={loading} className="w-full bg-red-600 text-white py-5 rounded font-black text-lg hover:bg-black transition">
                {loading ? 'CONNECTING...' : 'ENTER SYSTEM'}
              </button>
            </form>
          </div>
        </main>
      )}
    </div>
  );
}
