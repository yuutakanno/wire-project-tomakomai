"use client";

import React, { useState, useEffect, useMemo } from 'react';
import { 
  Search, FileText, TrendingUp, Users, Package, RefreshCw, ChevronRight, 
  Phone, MapPin, Lock, CheckCircle, Clock, Zap, Menu, X, Shield, History, Star, Info
} from 'lucide-react';

// --- 設定 ---
const GAS_API_URL = "https://script.google.com/macros/s/AKfycbyfYM8q6t7Q7UwIRORFBNOCA-mMpVFE1Z3oLzCJp5GNiYI9_CMy4767p9am2iMY70kl/exec";
const PRIMARY_RED = "#D32F2F";

export default function WireProjectApp() {
  const [view, setView] = useState<'LP' | 'CLIENT_PORTAL' | 'ADMIN_DASHBOARD'>('LP');
  const [user, setUser] = useState<any>(null);
  const [config, setConfig] = useState({ price: 0, lastUpdate: "" });
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function init() {
      try {
        const [cRes, pRes] = await Promise.all([
          fetch(`${GAS_API_URL}?action=get_config`).then(r => r.json()),
          fetch(`${GAS_API_URL}?action=get_products`).then(r => r.json())
        ]);
        setConfig({ price: cRes.price, lastUpdate: cRes.description });
        setProducts(pRes.products || []);
      } catch (e) { console.error(e); } finally { setLoading(false); }
    }
    init();
  }, []);

  const handleLogin = async (id: string, pw: string) => {
    const res = await fetch(GAS_API_URL, { 
      method: 'POST', body: JSON.stringify({ action: 'login', userId: id, password: pw }) 
    }).then(r => r.json());
    
    if (res.success) {
      setUser(res.user);
      setView(res.user.role === 'ADMIN' ? 'ADMIN_DASHBOARD' : 'CLIENT_PORTAL');
    } else {
      alert(res.message);
    }
  };

  if (loading) return <div className="min-h-screen bg-neutral-900 flex items-center justify-center text-white">SYSTEM LOADING...</div>;

  return (
    <div className="font-sans antialiased text-neutral-900">
      {view === 'LP' && <LandingPage config={config} onLogin={handleLogin} />}
      {view === 'CLIENT_PORTAL' && <ClientPortal user={user} config={config} products={products} onLogout={() => setView('LP')} />}
      {view === 'ADMIN_DASHBOARD' && <AdminDashboard user={user} config={config} products={products} onLogout={() => setView('LP')} />}
    </div>
  );
}

// ==========================================
// 1. 公開LP (信頼・集客・Q&A)
// ==========================================
function LandingPage({ config, onLogin }: any) {
  const [showLogin, setShowLogin] = useState(false);

  return (
    <div className="bg-white">
      {/* Header */}
      <nav className="border-b sticky top-0 bg-white/95 z-50 p-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-red-700 text-white flex items-center justify-center font-black rounded">月</div>
            <div>
              <p className="font-black text-xl tracking-tighter">月寒製作所 <span className="text-red-600 font-normal text-sm">苫小牧工場</span></p>
              <p className="text-[9px] text-neutral-400 tracking-widest">SINCE 1961 RE-DEFINE RECYCLING</p>
            </div>
          </div>
          <div className="flex gap-6 items-center">
            <div className="hidden md:block text-right">
              <p className="text-[10px] text-neutral-500">本日の銅買取参考単価</p>
              <p className="font-black text-red-600 text-lg">¥{config.price.toLocaleString()}/kg</p>
            </div>
            <button onClick={() => setShowLogin(true)} className="flex items-center gap-2 font-bold text-sm bg-neutral-900 text-white px-4 py-2 rounded-lg hover:bg-neutral-800 transition">
              <Lock size={14}/> ログイン
            </button>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="bg-neutral-950 text-white py-24 px-4 text-center relative overflow-hidden">
        <div className="relative z-10">
          <h2 className="text-6xl md:text-8xl font-black italic mb-6 tracking-tighter uppercase">Beyond Resources</h2>
          <p className="text-xl text-neutral-400 max-w-2xl mx-auto mb-10">
            1961年創業。半世紀以上の歴史と最新のWN-800ナゲットプラントが、<br/>
            あなたの廃棄物を価値ある資源へと変貌させます。
          </p>
          <div className="flex justify-center gap-4">
            <a href="tel:0144-55-5544" className="bg-red-600 px-8 py-4 rounded-full font-black text-lg flex items-center gap-2 hover:bg-red-700"><Phone/> 0144-55-5544</a>
          </div>
        </div>
      </section>

      {/* Features: Trust & Technology */}
      <section className="py-20 max-w-7xl mx-auto px-4 grid md:grid-cols-3 gap-12">
        <FeatureCard icon={<Shield className="text-red-600" size={32}/>} title="60年の信頼" desc="創業以来培ってきた非鉄金属の目利き技術により、他社で断られた品目も正確に査定します。"/>
        <FeatureCard icon={<Zap className="text-red-600" size={32}/>} title="自社ナゲット加工" desc="最新鋭WN-800を完備。中間マージンを徹底排除し、製錬メーカー直結の買取価格を実現。"/>
        <FeatureCard icon={<History className="text-red-600" size={32}/>} title="完全トレーサビリティ" desc="全ての取引をデジタル管理。排出事業者様のコンプライアンス遵守を強力にサポートします。"/>
      </section>

      {/* Login Modal */}
      {showLogin && <LoginModal onClose={() => setShowLogin(false)} onLogin={onLogin} />}
    </div>
  );
}

// ==========================================
// 2. 顧客用ポータル (実績・見積・会員ランク)
// ==========================================
function ClientPortal({ user, config, products, onLogout }: any) {
  return (
    <div className="min-h-screen bg-neutral-50 flex flex-col">
      <header className="bg-white border-b p-4 flex justify-between items-center">
        <div className="font-black italic text-xl">CLIENT <span className="text-red-600">PORTAL</span></div>
        <div className="flex items-center gap-4">
          <div className="text-right">
            <p className="text-xs text-neutral-500">{user.name} 様</p>
            <span className="bg-yellow-400 text-xs font-black px-2 py-0.5 rounded italic">{user.rank} MEMBER</span>
          </div>
          <button onClick={onLogout} className="text-neutral-400 hover:text-red-600"><X size={20}/></button>
        </div>
      </header>
      <main className="p-8 max-w-5xl mx-auto w-full grid md:grid-cols-2 gap-8">
        <div className="bg-white p-6 rounded-2xl shadow-sm border space-y-4">
          <h3 className="font-bold flex items-center gap-2"><TrendingUp className="text-red-600"/> 見積・シミュレーター</h3>
          <p className="text-sm text-neutral-500">あなたのランク（{user.rank}）に基づいた特別単価が適用されています。</p>
          {/* 見積もりロジックが入るエリア */}
          <div className="h-40 bg-neutral-50 rounded-xl border-2 border-dashed flex items-center justify-center text-neutral-300 italic">Calculator Module Loaded</div>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border">
          <h3 className="font-bold flex items-center gap-2 mb-4"><History className="text-red-600"/> 取引実績</h3>
          <div className="space-y-3">
             {[1,2,3].map(i => (
               <div key={i} className="flex justify-between border-b pb-2 text-sm">
                 <span>2026/02/0{i} 取引</span>
                 <span className="font-bold">¥124,000</span>
               </div>
             ))}
          </div>
        </div>
      </main>
    </div>
  );
}

// ==========================================
// 3. 管理者用コマンドセンター (CRM・収支・Pending)
// ==========================================
function AdminDashboard({ user, config, products, onLogout }: any) {
  return (
    <div className="min-h-screen bg-neutral-950 text-white flex">
      <aside className="w-64 border-r border-neutral-900 flex flex-col p-6 space-y-8">
        <h2 className="font-black italic text-2xl tracking-tighter">FACTORY <span className="text-red-600">HQ</span></h2>
        <nav className="space-y-4 flex-grow">
          <div className="text-red-500 text-[10px] font-bold tracking-widest uppercase">Operations</div>
          <button className="flex items-center gap-3 w-full text-left font-bold text-sm"><Package size={18}/> Job Queue</button>
          <button className="flex items-center gap-3 w-full text-left font-bold text-sm text-red-500"><Users size={18}/> Area CRM</button>
          <button className="flex items-center gap-3 w-full text-left font-bold text-sm"><TrendingUp size={18}/> Finance</button>
        </nav>
        <button onClick={onLogout} className="text-neutral-600 text-sm">Logout</button>
      </aside>
      <main className="flex-grow p-8">
        <div className="flex justify-between items-center mb-12">
          <h2 className="text-3xl font-black italic">COMMAND CENTER</h2>
          <div className="text-right">
            <p className="text-[10px] text-neutral-500">MARKET PRICE</p>
            <p className="text-2xl font-black text-red-600">¥{config.price.toLocaleString()}</p>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-6">
           <div className="bg-neutral-900 p-6 rounded-2xl border border-neutral-800">
             <p className="text-xs text-neutral-500 uppercase mb-2 font-bold">Pending Jobs</p>
             <p className="text-4xl font-black">12</p>
           </div>
           <div className="bg-neutral-900 p-6 rounded-2xl border border-neutral-800">
             <p className="text-xs text-neutral-500 uppercase mb-2 font-bold">Monthly Profit</p>
             <p className="text-4xl font-black text-green-500">¥4.2M</p>
           </div>
           <div className="bg-neutral-900 p-6 rounded-2xl border border-neutral-800">
             <p className="text-xs text-neutral-500 uppercase mb-2 font-bold">CRM Targets</p>
             <p className="text-4xl font-black text-red-600">282</p>
           </div>
        </div>
        {/* ここに以前作成した CRM Map 等のコードを統合する */}
      </main>
    </div>
  );
}

// --- UI Parts ---
function FeatureCard({ icon, title, desc }: any) {
  return (
    <div className="space-y-4">
      <div className="w-16 h-16 bg-red-50 rounded-2xl flex items-center justify-center">{icon}</div>
      <h3 className="text-xl font-bold">{title}</h3>
      <p className="text-neutral-600 text-sm leading-relaxed">{desc}</p>
    </div>
  );
}

function LoginModal({ onClose, onLogin }: any) {
  const [id, setId] = useState('');
  const [pw, setPw] = useState('');
  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-sm rounded-3xl p-8 shadow-2xl relative">
        <button onClick={onClose} className="absolute top-6 right-6 text-neutral-400"><X size={20}/></button>
        <h3 className="text-2xl font-black italic mb-8">LOGIN</h3>
        <div className="space-y-4">
          <input placeholder="Login ID" className="w-full border rounded-xl p-4 bg-neutral-50" onChange={e=>setId(e.target.value)} />
          <input type="password" placeholder="Password" className="w-full border rounded-xl p-4 bg-neutral-50" onChange={e=>setPw(e.target.value)} />
          <button onClick={() => onLogin(id, pw)} className="w-full bg-red-600 text-white font-black py-4 rounded-xl shadow-lg shadow-red-900/20 hover:bg-red-700 transition">SIGN IN</button>
        </div>
        <p className="text-center text-[10px] text-neutral-400 mt-6">月寒製作所 認証ゲートウェイ</p>
      </div>
    </div>
  );
}
