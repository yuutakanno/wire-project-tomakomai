"use client";

import React, { useState } from 'react';

const GAS_API_URL = 'https://script.google.com/macros/s/AKfycbyfYM8q6t7Q7UwIRORFBNOCA-mMpVFE1Z3oLzCJp5GNiYI9_CMy4767p9am2iMY70kl/exec';

export default function WireMasterCloud() {
  const [role, setRole] = useState<'GUEST' | 'MEMBER' | 'ADMIN'>('GUEST');
  const [user, setUser] = useState<any>(null);
  const [db, setDb] = useState<any>({ config: {}, products: [] });
  const [loading, setLoading] = useState(false);
  const [debugMsg, setDebugMsg] = useState(''); // デバッグ用表示

  const login = async (e: any) => {
    e.preventDefault();
    setLoading(true);
    setDebugMsg('GASに接続中...');
    
    const payload = { 
      action: 'AUTH_LOGIN', 
      loginId: e.target.loginId.value, 
      password: e.target.password.value 
    };

    try {
      // no-corsではエラーが拾えないため、通常のfetchでレスポンスを確認
      const res = await fetch(GAS_API_URL, {
        method: 'POST',
        body: JSON.stringify(payload)
      });
      
      const result = await res.json();
      
      if (result.status === 'success') {
        setDebugMsg('認証成功。初期データ取得中...');
        setUser(result.user);
        
        // 初期データの取得
        const initRes = await fetch(GAS_API_URL, { 
          method: 'POST', 
          body: JSON.stringify({ action: 'GET_INIT_DATA' }) 
        });
        const initData = await initRes.json();
        
        setDb(initData);
        setRole(result.user.rank === 'ADMIN' ? 'ADMIN' : 'MEMBER');
        setDebugMsg('');
      } else {
        setDebugMsg('認証拒否: ' + result.message);
      }
    } catch (err: any) {
      setDebugMsg('通信エラー: ' + err.toString() + '。GASが「全員」に公開されているか確認してください。');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white text-gray-900 font-sans">
      <header className="border-b px-6 py-4 flex justify-between items-center bg-white shadow-sm">
        <div className="font-black text-xl italic tracking-tighter">月寒製作所 <span className="text-red-600">苫小牧工場</span></div>
        {db.config.market_price && (
          <div className="text-right">
            <span className="text-[10px] text-gray-400 block font-bold tracking-widest">LME COPPER JPY/KG</span>
            <span className="text-lg font-mono text-red-600 font-black">¥{Number(db.config.market_price).toLocaleString()}</span>
          </div>
        )}
      </header>

      {role === 'GUEST' && (
        <main className="max-w-md mx-auto py-24 px-6">
          <div className="bg-white border-4 border-black p-10 rounded-2xl shadow-2xl">
            <h2 className="text-3xl font-black text-center mb-8 italic">AUTHENTICATION</h2>
            <form onSubmit={login} className="space-y-6">
              <input name="loginId" className="w-full p-4 bg-gray-100 rounded border-none font-bold" placeholder="ID" required />
              <input name="password" type="password" className="w-full p-4 bg-gray-100 rounded border-none font-bold" placeholder="PASS" required />
              <button disabled={loading} className="w-full bg-red-600 text-white py-5 rounded font-black text-lg shadow-lg">
                {loading ? 'CONNECTING...' : 'ENTER SYSTEM'}
              </button>
            </form>
            
            {/* デバッグ用表示：本番では消します */}
            {debugMsg && (
              <div className="mt-6 p-4 bg-red-50 text-red-600 text-xs font-mono rounded border border-red-200">
                [SYSTEM LOG]: {debugMsg}
              </div>
            )}
          </div>
        </main>
      )}

      {/* ADMIN/MEMBER画面は以前のロジックを継承 */}
      {role !== 'GUEST' && (
        <div className="p-10 text-center">
          <h2 className="text-2xl font-black">Welcome, {user.companyName}</h2>
          <p className="mt-4">認証・建値取得の疎通が確認できました。</p>
          <button onClick={() => setRole('GUEST')} className="mt-8 text-sm underline text-gray-400">Logout</button>
        </div>
      )}
    </div>
  );
}
