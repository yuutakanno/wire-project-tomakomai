"use client";

import React, { useState, useEffect } from 'react';

export default function WireMasterCloud() {
  const [role, setRole] = useState<'GUEST' | 'MEMBER' | 'ADMIN'>('GUEST');
  const [db, setDb] = useState<any>({ config: { market_price: '0' } });
  const [loading, setLoading] = useState(false);
  const [sysLog, setSysLog] = useState<string>('');

  useEffect(() => {
    setSysLog('システム初期化中...');
    fetch('/api/gas')
      .then(res => res.json())
      .then(data => {
        if (data.status === 'success') {
          setDb(data);
          setSysLog('システム準備完了');
        } else {
          setSysLog(`データ取得失敗: ${data.message}`);
        }
      })
      .catch(e => setSysLog(`サーバー接続エラー: ${e.message}`));
  }, []);

  const onLogin = async (e: any) => {
    e.preventDefault();
    setLoading(true);
    setSysLog('認証中...');
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
        setRole(result.user.rank === 'ADMIN' ? 'ADMIN' : 'MEMBER');
        setSysLog('認証成功');
      } else {
        setSysLog(`認証拒否: ${result.message}`);
      }
    } catch (err) {
      setSysLog('認証通信エラー');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white text-gray-900 font-sans">
      <header className="border-b px-6 py-4 flex justify-between items-center bg-white">
        <div className="font-black text-xl italic italic">月寒製作所 <span className="text-red-600">苫小牧工場</span></div>
        <div className="text-right">
          <span className="text-[10px] text-gray-400 block font-bold">LME COPPER JPY/KG</span>
          <span className="text-xl font-mono text-red-600 font-black">
            ¥{Number(db.config.market_price || 0).toLocaleString()}
          </span>
        </div>
      </header>

      {role === 'GUEST' && (
        <main className="max-w-md mx-auto py-24 px-6">
          <div className="bg-white border-4 border-black p-10 rounded-2xl shadow-2xl">
            <h2 className="text-3xl font-black text-center mb-8 italic">LOGIN</h2>
            <form onSubmit={onLogin} className="space-y-6">
              <input name="loginId" className="w-full p-4 bg-gray-100 rounded border-none font-bold" placeholder="admin" required />
              <input name="password" type="password" className="w-full p-4 bg-gray-100 rounded border-none font-bold" placeholder="user" required />
              <button disabled={loading} className="w-full bg-red-600 text-white py-5 rounded font-black text-lg">
                {loading ? 'WAIT...' : 'ENTER'}
              </button>
            </form>
          </div>
          
          {/* デバッグ表示：これが命命綱です */}
          {sysLog && (
            <div className="mt-8 p-4 bg-gray-900 text-cyan-400 text-[10px] font-mono rounded-lg shadow-inner">
              [SYSTEM_LOG]: {sysLog}
            </div>
          )}
        </main>
      )}

      {role !== 'GUEST' && (
        <div className="p-20 text-center">
          <h2 className="text-3xl font-black uppercase italic tracking-widest">{role} MODE ACTIVE</h2>
          <button onClick={() => setRole('GUEST')} className="mt-10 underline text-sm">Logout</button>
        </div>
      )}
    </div>
  );
}
