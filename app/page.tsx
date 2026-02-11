"use client";

import React, { useState, useEffect } from 'react';

const GAS_API_URL = 'https://script.google.com/macros/s/AKfycbyfYM8q6t7Q7UwIRORFBNOCA-mMpVFE1Z3oLzCJp5GNiYI9_CMy4767p9am2iMY70kl/exec';

export default function WireMasterCloud() {
  const [isLogged, setIsLogged] = useState(false);
  const [mode, setMode] = useState<'PUBLIC' | 'MEMBER' | 'ADMIN'>('PUBLIC');
  const [subView, setSubView] = useState<'DASHBOARD' | 'POS' | 'FACTORY'>('DASHBOARD');
  const [user, setUser] = useState<any>(null);
  const [copperPrice, setCopperPrice] = useState(1360); // 市場連動（本来はConfigから）

  // LPデザインを保持したシミュレーター
  const [calc, setCalc] = useState({ type: 'CV', weight: 0 });
  const [calcResult, setCalcResult] = useState(0);

  useEffect(() => {
    const rate = calc.type === 'CV' ? 0.8 : calc.type === 'VVF' ? 0.65 : 0.45;
    setCalcResult(Math.floor(copperPrice * rate * calc.weight));
  }, [calc, copperPrice]);

  const handleLogin = async (e: any) => {
    e.preventDefault();
    // ここで認証。管理者Email（例: boss@tsukisamu.co.jp）ならADMINへ
    const email = e.target.email.value;
    if (email.includes('boss')) {
      setUser({ name: "月寒製作所 管理者", rank: "SYSTEM", email: email });
      setMode('ADMIN');
    } else {
      setUser({ name: "テスト会員A", rank: "GOLD", email: email, points: 1250 });
      setMode('MEMBER');
    }
    setIsLogged(true);
  };

  return (
    <div className="min-h-screen bg-white font-sans text-slate-900">
      {/* 共通ヘッダー（LPの質を維持） */}
      <header className="border-b sticky top-0 bg-white/95 backdrop-blur z-50 px-6 py-4 flex justify-between items-center shadow-sm">
        <div className="logo cursor-pointer" onClick={() => setMode('PUBLIC')}>
          <h1 className="text-xl font-black leading-tight tracking-tighter">株式会社月寒製作所<br />
          <span className="text-red-600 text-sm">苫小牧工場</span></h1>
        </div>
        <div className="flex items-center gap-6">
          <div className="text-right hidden md:block">
            <span className="text-[10px] text-slate-400 block font-bold">LME COPPER PRICE</span>
            <span className="text-lg font-mono text-red-600 font-black">¥{copperPrice.toLocaleString()}<small className="text-xs ml-1">/kg</small></span>
          </div>
          {!isLogged ? (
            <a href="#login" className="bg-slate-900 text-white px-6 py-2 rounded font-bold hover:bg-slate-700 transition">会員ログイン</a>
          ) : (
            <div className="flex items-center gap-3">
              <span className="text-sm font-bold bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full">{user.rank}</span>
              <button onClick={() => setIsLogged(false)} className="text-xs text-slate-400 underline">ログアウト</button>
            </div>
          )}
        </div>
      </header>

      {/* モード切り替え（メインコンテンツ） */}
      {mode === 'PUBLIC' && (
        <>
          {/* Hero Section */}
          <section className="bg-slate-900 text-white py-32 px-6 text-center relative overflow-hidden">
            <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]"></div>
            <div className="max-w-4xl mx-auto relative z-10">
              <h2 className="text-6xl md:text-8xl font-black mb-8 italic tracking-tighter">BEYOND RESOURCES.</h2>
              <p className="text-xl md:text-2xl opacity-80 font-medium mb-12">1961年創業。半世紀以上の歴史と最新のナゲットプラントが、<br />あなたの廃棄物を価値ある資源へと変貌させます。</p>
              <div className="flex justify-center gap-4">
                <a href="#simulator" className="bg-red-600 text-white px-10 py-4 rounded font-bold text-lg hover:bg-red-700 shadow-xl">買取査定シミュレーター</a>
                <a href="tel:0144-55-5544" className="bg-white text-slate-900 px-10 py-4 rounded font-bold text-lg shadow-xl">📞 0144-55-5544</a>
              </div>
            </div>
          </section>

          {/* 誰でも使えるシミュレーター（信頼の種火） */}
          <section id="simulator" className="max-w-5xl mx-auto py-24 px-6">
            <h3 className="text-3xl font-black text-center mb-16 underline decoration-red-600 decoration-8 underline-offset-8">概算買取シミュレーター</h3>
            <div className="grid md:grid-cols-2 gap-12 bg-slate-50 p-12 rounded-3xl border border-slate-200 shadow-2xl">
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-bold text-slate-500 mb-2 uppercase tracking-widest">被覆線の種類</label>
                  <select className="w-full p-4 rounded-xl border-2 border-slate-200 bg-white font-bold focus:border-red-600 outline-none"
                    onChange={(e) => setCalc({ ...calc, type: e.target.value })}>
                    <option value="CV">特一重銅 / CV系 (銅率80%)</option>
                    <option value="VVF">一重銅 / VVF・IV系 (銅率65%)</option>
                    <option value="MIX">雑線 / 家電線 (銅率40%)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-500 mb-2 uppercase tracking-widest">重量 (kg)</label>
                  <input type="number" className="w-full p-4 rounded-xl border-2 border-slate-200 bg-white font-bold text-2xl focus:border-red-600 outline-none"
                    placeholder="例: 150" onChange={(e) => setCalc({ ...calc, weight: Number(e.target.value) })} />
                </div>
              </div>
              <div className="flex flex-col justify-center items-center bg-white rounded-2xl border-2 border-red-600 p-8 shadow-inner animate-pulse">
                <span className="text-slate-400 font-bold mb-2">推定買取価格（税込）</span>
                <span className="text-5xl font-black text-red-600 font-mono">¥{calcResult.toLocaleString()}</span>
                <p className="text-[10px] text-slate-400 mt-4 text-center">※相場により変動。会員登録でさらに高価買取キャンペーン適用！</p>
              </div>
            </div>
          </section>

          {/* ログインゲート */}
          <section id="login" className="bg-slate-100 py-24 px-6 text-center">
            <div className="max-w-md mx-auto bg-white p-12 rounded-3xl shadow-2xl border border-slate-200">
              <h4 className="text-2xl font-black mb-6">会員ポータル認証</h4>
              <p className="text-sm text-slate-500 mb-8 font-medium">初回取引完了後に発行されたIDで、ポイント管理・優先査定が可能です。</p>
              <form onSubmit={handleLogin} className="space-y-4 text-left">
                <input name="email" type="email" placeholder="Email Address" className="w-full p-4 border rounded-xl font-bold bg-slate-50" required />
                <button className="w-full bg-slate-900 text-white py-5 rounded-xl font-black text-lg hover:shadow-lg transition">ENTER PLATFORM</button>
              </form>
            </div>
          </section>
        </>
      )}

      {/* 会員マイページ（顧客を育てる） */}
      {mode === 'MEMBER' && (
        <main className="max-w-4xl mx-auto py-12 px-6">
          <div className="bg-gradient-to-br from-slate-900 to-slate-800 text-white p-8 rounded-3xl shadow-2xl mb-8">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-yellow-400 font-black tracking-widest text-xs mb-2">CURRENT MEMBERSHIP RANK</p>
                <h2 className="text-4xl font-black italic">{user.rank} MEMBER</h2>
                <p className="mt-4 font-bold opacity-70">お疲れ様です、{user.name} 様。</p>
              </div>
              <div className="text-right">
                <span className="text-xs opacity-50 block mb-1 uppercase">Total Points</span>
                <span className="text-3xl font-mono font-black">{user.points} pt</span>
              </div>
            </div>
            <div className="mt-8 pt-8 border-t border-white/10 flex gap-4 overflow-x-auto">
              <div className="bg-white/10 p-4 rounded-xl min-w-[200px]">
                <span className="text-[10px] font-bold block opacity-60">今月の限定特典</span>
                <p className="text-sm font-black mt-1">VVF剥離済み持ち込みで+5円増額中</p>
              </div>
              <div className="bg-red-600/20 p-4 rounded-xl min-w-[200px] border border-red-500/50">
                <span className="text-[10px] font-bold block text-red-400">ランクアップまで</span>
                <p className="text-sm font-black mt-1">あと 450kg の取引で PLATINUM</p>
              </div>
            </div>
          </div>
        </main>
      )}

      {/* 管理者モード（工場コックピット：手袋でも押せるUI） */}
      {mode === 'ADMIN' && (
        <main className="max-w-6xl mx-auto py-12 px-6">
          <nav className="flex gap-2 mb-8 bg-slate-100 p-2 rounded-2xl">
            <button onClick={() => setSubView('DASHBOARD')} className={`flex-1 py-4 rounded-xl font-black transition ${subView==='DASHBOARD'?'bg-white shadow-md text-red-600':'text-slate-500'}`}>経営Dashboard</button>
            <button onClick={() => setSubView('POS')} className={`flex-1 py-4 rounded-xl font-black transition ${subView==='POS'?'bg-white shadow-md text-red-600':'text-slate-500'}`}>1. 買取POS</button>
            <button onClick={() => setSubView('FACTORY')} className={`flex-1 py-4 rounded-xl font-black transition ${subView==='FACTORY'?'bg-white shadow-md text-red-600':'text-slate-500'}`}>2. 工場処理</button>
          </nav>

          {subView === 'DASHBOARD' && (
            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-slate-900 text-white p-8 rounded-3xl shadow-xl">
                <h5 className="text-xs font-black text-slate-500 mb-4 tracking-widest">今月の処理目標</h5>
                <div className="text-5xl font-mono font-black mb-4">12.5 <small className="text-xl">/ 30.0 t</small></div>
                <div className="w-full bg-white/10 h-3 rounded-full overflow-hidden">
                  <div className="bg-red-600 h-full w-[42%]"></div>
                </div>
              </div>
              <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-xl">
                <h5 className="text-xs font-black text-slate-400 mb-4 tracking-widest">本日の処理ノルマ</h5>
                <div className="text-5xl font-mono font-black text-slate-800">1,450 <small className="text-xl">kg</small></div>
                <p className="text-xs mt-4 text-red-600 font-bold">残り営業日 14日 | 1日あたり 1,250kg 必須</p>
              </div>
              <div className="bg-green-50 p-8 rounded-3xl border border-green-200 shadow-xl">
                <h5 className="text-xs font-black text-green-600 mb-4 tracking-widest">推定累積粗利 (2月)</h5>
                <div className="text-5xl font-mono font-black text-green-700">¥1.82 <small className="text-xl">M</small></div>
                <p className="text-xs mt-4 text-green-600 font-bold font-mono">Yield Avg: 64.2%</p>
              </div>
            </div>
          )}

          {subView === 'POS' && (
            <div className="bg-white p-8 rounded-3xl border-4 border-slate-900 shadow-2xl space-y-8">
              <h4 className="text-2xl font-black border-l-8 border-red-600 pl-4">買取POSレジ入力</h4>
              <div className="grid md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-xs font-black mb-2">顧客 Email</label>
                  <input className="w-full p-6 text-2xl font-bold border-2 rounded-2xl bg-slate-50" placeholder="customer@email.com" />
                </div>
                <div>
                  <label className="block text-xs font-black mb-2">コンディション判定</label>
                  <div className="flex gap-2 h-[80px]">
                    <button className="flex-1 bg-green-600 text-white rounded-2xl font-black text-2xl">A</button>
                    <button className="flex-1 bg-slate-200 text-slate-600 rounded-2xl font-black text-2xl">B</button>
                    <button className="flex-1 bg-slate-200 text-slate-600 rounded-2xl font-black text-2xl">C</button>
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-black mb-2">重量 (kg)</label>
                  <input type="number" className="w-full p-6 text-4xl font-mono font-black border-2 rounded-2xl bg-slate-50 text-red-600" placeholder="0.0" />
                </div>
              </div>
              <button className="w-full bg-slate-900 text-white py-8 rounded-2xl font-black text-3xl shadow-2xl hover:bg-slate-800">買取確定・ID発行</button>
            </div>
          )}
        </main>
      )}

      <footer className="bg-slate-900 text-slate-500 py-20 px-6 text-center text-sm">
        <p>© 2026 株式会社月寒製作所 苫小牧工場<br />Material Strategy & DX Platform Solution</p>
      </footer>
    </div>
  );
}
