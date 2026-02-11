"use client";

import React, { useState, useEffect } from 'react';

export default function WireMasterCloud() {
  const [role, setRole] = useState<'GUEST' | 'MEMBER' | 'ADMIN'>('GUEST');
  const [user, setUser] = useState<any>(null);
  const [marketPrice, setMarketPrice] = useState<string>('---');
  const [loading, setLoading] = useState(false);
  const [debugLog, setDebugLog] = useState<string>('システム待機中');

  // 建値ロード
  useEffect(() => {
    fetch('/api/gas')
      .then(res => res.json())
      .then(data => {
        if (data.config && data.config.market_price) {
          setMarketPrice(Number(data.config.market_price).toLocaleString());
          setDebugLog('データ接続完了');
        } else {
          setDebugLog('建値データが空です');
        }
      })
      .catch(e => setDebugLog('サーバー接続エラー: ' + e.message));
  }, []);

  const onLogin = async (e: any) => {
    e.preventDefault();
    setLoading(true);
    setDebugLog('認証リクエスト送信...');
    
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
        setDebugLog(`❌ ${result.message}`);
      }
    } catch (err: any) {
      setDebugLog(`通信失敗: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans">
      <header className="border-b bg-white px-6 py-4 flex justify-between items-center sticky top-0 z-50 shadow-sm">
        <div className="font-black text-xl italic tracking-tighter">月寒製作所 <span className="text-red-600">苫小牧工場</span></div>
        <div className="text-right">
          <span className="text-[10px] text-slate-400 block font-bold">LME COPPER JPY/KG</span>
          <span className="text-xl font-mono text-red-600 font-black">¥{marketPrice}</span>
        </div>
      </header>

      {role === 'GUEST' && (
        <main className="max-w-md mx-auto py-24 px-6">
          <div className="bg-white border-4 border-black p-10 rounded-2xl shadow-2xl">
            <h2 className="text-3xl font-black text-center mb-8 italic">LOGIN</h2>
            <form onSubmit={onLogin} className="space-y-6">
              <input name="loginId" className="w-full p-4 bg-slate-50 border-2 border-slate-100 font-bold" placeholder="ID (admin)" required />
              <input name="password" type="password" className="w-full p-4 bg-slate-50 border-2 border-slate-100 font-bold" placeholder="PASS (user)" required />
              <button disabled={loading} className="w-full bg-red-600 text-white py-5 rounded font-black text-lg shadow-xl hover:bg-black transition-all">
                {loading ? 'WAIT...' : 'ENTER'}
              </button>
            </form>
          </div>
          {/* このデバッグログが原因を突き止めます */}
          <div className="mt-8 p-4 bg-slate-900 text-cyan-400 text-[10px] font-mono rounded-lg border-t-4 border-cyan-500 shadow-inner">
            [DEBUG_LOG]: {debugLog}
          </div>
        </main>
      )}

      {role !== 'GUEST' && (
        <div className="p-20 text-center">
          <h2 className="text-3xl font-black italic">{user.companyName} 様</h2>
          <p className="mt-4 font-bold text-red-600">認証成功: {role}モード</p>
          <button onClick={() => setRole('GUEST')} className="mt-10 underline text-xs opacity-50">ログアウト</button>
        </div>
      )}
    </div>
  );
}
