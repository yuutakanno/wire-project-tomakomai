"use client";

import React, { useState, useEffect, useMemo } from 'react';
import { 
  Search, FileText, TrendingUp, Users, Package, RefreshCw, 
  ChevronRight, Phone, MapPin, Lock, CheckCircle, Clock, Zap, AlertTriangle 
} from 'lucide-react';

// ==========================================
// 【設定】 
// ==========================================
const GAS_API_URL = "https://script.google.com/macros/s/AKfycbyfYM8q6t7Q7UwIRORFBNOCA-mMpVFE1Z3oLzCJp5GNiYI9_CMy4767p9am2iMY70kl/exec";
const WN800_CAPACITY = 300; // kg/h
const HOURLY_COST = 5000;   // 円/h (電気+人)

// --- 型定義 ---
interface Product {
  id: string; maker: string; name: string; year: string; 
  sq: string; core: string; ratio: number; category: string; source: string;
}
interface Transaction {
  transactionId: string; date: string; clientId: string; status: string;
  totalWeight: number; totalPrice: number; inputDetails_json: string;
}
interface MarketConfig { price: number; lastUpdate: string; }

// ==========================================
//  Main Entry
// ==========================================
export default function WireProjectApp() {
  const [viewMode, setViewMode] = useState<'LP' | 'DASHBOARD'>('LP');
  const [products, setProducts] = useState<Product[]>([]);
  const [config, setConfig] = useState<MarketConfig>({ price: 0, lastUpdate: "" });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function init() {
      try {
        const [pRes, cRes] = await Promise.all([
          fetch(`${GAS_API_URL}?action=get_products`).then(r => r.json()),
          fetch(`${GAS_API_URL}?action=get_config`).then(r => r.json())
        ]);
        setProducts(pRes.products || []);
        setConfig({ price: Number(cRes.price) || 0, lastUpdate: cRes.description || "" });
      } catch (e) {
        console.error("Init failed", e);
      } finally {
        setLoading(false);
      }
    }
    init();
  }, []);

  if (loading) return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center text-red-600 animate-pulse font-black italic text-3xl">
      TSUKISAMU SYSTEM LOADING...
    </div>
  );

  return viewMode === 'LP' 
    ? <LandingPage config={config} onSwitch={() => setViewMode('DASHBOARD')} />
    : <Dashboard products={products} config={config} onBack={() => setViewMode('LP')} />;
}

// ==========================================
//  1. Landing Page (集客面)
// ==========================================
function LandingPage({ config, onSwitch }: { config: MarketConfig, onSwitch: () => void }) {
  const [weight, setWeight] = useState(100);
  const [type, setType] = useState(75);
  const estimate = Math.floor(weight * (type / 100) * config.price);

  return (
    <div className="min-h-screen bg-white text-neutral-900 font-sans">
      <header className="fixed top-0 w-full bg-white border-b p-4 flex justify-between items-center z-50">
        <h1 className="font-black text-2xl tracking-tighter">TSUKISAMU <span className="text-red-600">TOMAKOMAI</span></h1>
        <div className="flex items-center gap-4">
          <div className="text-right hidden sm:block">
            <p className="text-[10px] text-neutral-400">CURRENT COPPER PRICE</p>
            <p className="font-bold text-red-600">¥{config.price.toLocaleString()} /kg</p>
          </div>
          <a href="tel:0144-55-5544" className="bg-red-600 text-white px-4 py-2 rounded-full font-bold text-sm flex items-center gap-2">
            <Phone size={14}/> 0144-55-5544
          </a>
        </div>
      </header>

      <section className="pt-32 pb-20 px-4 bg-neutral-900 text-white text-center">
        <h2 className="text-5xl md:text-7xl font-black mb-6 tracking-tighter italic">RE-DEFINE RECYCLING.</h2>
        <p className="text-neutral-400 text-xl max-w-2xl mx-auto mb-12">創業1961年。熟練の選別技術と、最新鋭ナゲット機WN-800で、あなたの廃電線を最高値で資源へと昇華させます。</p>
        
        <div className="max-w-2xl mx-auto bg-white text-neutral-900 p-8 rounded-3xl shadow-2xl">
          <h3 className="font-bold text-lg mb-6 flex items-center justify-center gap-2"><TrendingUp className="text-red-600"/> かんたん見積もり</h3>
          <div className="grid grid-cols-2 gap-4 mb-6">
            <button onClick={()=>setType(75)} className={`p-3 rounded-xl border font-bold ${type===75?'bg-red-50 border-red-600 text-red-600':'bg-neutral-50'}`}>上線ミックス</button>
            <button onClick={()=>setType(42)} className={`p-3 rounded-xl border font-bold ${type===42?'bg-red-50 border-red-600 text-red-600':'bg-neutral-50'}`}>並線(VA/VVF)</button>
          </div>
          <input type="number" value={weight} onChange={e=>setWeight(Number(e.target.value))} className="w-full text-center text-4xl font-black p-4 bg-neutral-100 rounded-2xl mb-4" />
          <div className="text-xs text-neutral-400 mb-2">概算買取額</div>
          <div className="text-5xl font-black text-red-600">¥{estimate.toLocaleString()}</div>
        </div>
      </section>

      <footer className="bg-neutral-100 py-10 text-center">
        <button onClick={onSwitch} className="text-neutral-300 hover:text-neutral-500 flex items-center gap-2 mx-auto text-xs">
          <Lock size={12}/> STAFF PORTAL
        </button>
      </footer>
    </div>
  );
}

// ==========================================
//  2. Dashboard (司令塔面)
// ==========================================
function Dashboard({ products, config, onBack }: { products: Product[], config: MarketConfig, onBack: () => void }) {
  const [tab, setTab] = useState<'QUEUE' | 'SMART_LABOR'>('QUEUE');
  const [tx, setTx] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchTx = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${GAS_API_URL}?action=get_transactions`).then(r => r.json());
      setTx(res.transactions || []);
    } finally { setLoading(false); }
  };

  useEffect(() => { fetchTx(); }, []);

  const pending = tx.filter(t => t.status === 'Pending');

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 font-sans flex flex-col">
      <header className="p-4 border-b border-red-900/30 bg-black flex justify-between items-center sticky top-0 z-50">
        <div className="flex items-center gap-4">
          <button onClick={onBack} className="p-2 bg-neutral-900 rounded-full"><ChevronRight className="rotate-180 w-4 h-4"/></button>
          <h2 className="font-black tracking-tighter text-xl italic">FACTORY <span className="text-red-500">COMMAND</span></h2>
        </div>
        <div className="flex bg-neutral-900 rounded-lg p-1">
          <button onClick={()=>setTab('QUEUE')} className={`px-4 py-1.5 rounded-md text-sm font-bold transition ${tab==='QUEUE'?'bg-red-600 text-white':'text-neutral-500'}`}>案件待ち行列</button>
          <button onClick={()=>setTab('SMART_LABOR')} className={`px-4 py-1.5 rounded-md text-sm font-bold transition ${tab==='SMART_LABOR'?'bg-red-600 text-white':'text-neutral-500'}`}>Smart Labor</button>
        </div>
      </header>

      <main className="flex-grow p-4 max-w-7xl mx-auto w-full">
        {tab === 'QUEUE' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-sm font-bold text-neutral-500 tracking-widest flex items-center gap-2"><Clock size={16}/> PENDING JOBS</h3>
              <button onClick={fetchTx} className="text-xs text-red-500 flex items-center gap-1"><RefreshCw size={12} className={loading?'animate-spin':''}/> リロード</button>
            </div>
            {pending.length === 0 ? (
              <div className="h-64 flex flex-col items-center justify-center border-2 border-dashed border-neutral-900 rounded-3xl text-neutral-700">
                <CheckCircle size={48} className="mb-4 opacity-20"/>
                <p>現在、待機中の案件はありません</p>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {pending.map(job => <PendingCard key={job.transactionId} job={job} config={config} onRefresh={fetchTx}/>)}
              </div>
            )}
          </div>
        )}

        {tab === 'SMART_LABOR' && (
          <SmartLaborAnalysis products={products} config={config} />
        )}
      </main>
    </div>
  );
}

// --- サブコンポーネント: Pending Card ---
function PendingCard({ job, config, onRefresh }: { job: Transaction, config: MarketConfig, onRefresh: () => void }) {
  const details = useMemo(() => {
    try { return JSON.parse(job.inputDetails_json); } catch { return []; }
  }, [job]);

  const approve = async () => {
    if(!confirm("検収を完了し、在庫を確定させますか？")) return;
    await fetch(GAS_API_URL, { method: 'POST', body: JSON.stringify({ action: 'approve_job', transactionId: job.transactionId }) });
    onRefresh();
  };

  // 利益シミュレーション (仮定: 歩留まり60%)
  const processTime = job.totalWeight / WN800_CAPACITY;
  const cost = processTime * HOURLY_COST;
  const marketVal = (job.totalWeight * 0.6) * config.price;
  const profit = marketVal - job.totalPrice - cost;

  return (
    <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6 hover:border-red-600/50 transition-all">
      <div className="flex justify-between items-start mb-4">
        <div>
          <p className="text-[10px] text-neutral-500">{job.date}</p>
          <h4 className="font-bold text-lg">{job.clientId} 様</h4>
        </div>
        <div className="bg-red-600/10 text-red-500 text-[10px] font-bold px-2 py-1 rounded animate-pulse">PENDING</div>
      </div>
      <div className="flex justify-between border-b border-neutral-800 pb-4 mb-4">
        <div><p className="text-[10px] text-neutral-500">総重量</p><p className="text-2xl font-black">{job.totalWeight}kg</p></div>
        <div className="text-right"><p className="text-[10px] text-neutral-400">買取提示額</p><p className="text-xl font-bold text-red-500">¥{job.totalPrice.toLocaleString()}</p></div>
      </div>
      <div className="bg-black/50 p-4 rounded-xl mb-6 space-y-2">
        <div className="flex justify-between text-xs text-neutral-500"><span>WN-800 コスト</span><span>-¥{Math.floor(cost).toLocaleString()}</span></div>
        <div className="flex justify-between font-bold text-sm"><span>予想営業利益</span><span className={profit>0?'text-green-500':'text-red-500'}>¥{Math.floor(profit).toLocaleString()}</span></div>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <button className="bg-neutral-800 py-3 rounded-xl text-xs font-bold">詳細・写真</button>
        <button onClick={approve} className="bg-red-600 py-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1"><CheckCircle size={14}/> 検収完了</button>
      </div>
    </div>
  );
}

// --- サブコンポーネント: Smart Labor Analysis ---
function SmartLaborAnalysis({ products, config }: { products: Product[], config: MarketConfig }) {
  const [search, setSearch] = useState("");
  const [cart, setCart] = useState<{ p: Product, w: number }[]>([]);

  const filtered = useMemo(() => {
    if(search.length < 2) return [];
    return products.filter(p => p.name.includes(search) || p.maker.includes(search)).slice(0, 5);
  }, [search, products]);

  const totalW = cart.reduce((s, c) => s + c.w, 0);
  const totalCu = cart.reduce((s, c) => s + (c.w * c.p.ratio / 100), 0);
  const cost = (totalW / WN800_CAPACITY) * HOURLY_COST;
  const purchase = cart.reduce((s, c) => s + (c.w * (c.p.ratio/100) * config.price * 0.9), 0); // 10%粗利を想定した仕入
  const sales = totalCu * config.price;
  const profit = sales - purchase - cost;

  return (
    <div className="grid lg:grid-cols-2 gap-8 animate-in fade-in slide-in-from-bottom-4">
      <div className="space-y-6">
        <div className="bg-neutral-900 p-6 rounded-2xl border border-neutral-800">
          <h4 className="font-bold mb-4 flex items-center gap-2 text-red-500"><Search size={18}/> 実測データから投入</h4>
          <input className="w-full bg-black border border-neutral-800 p-4 rounded-xl mb-4" placeholder="メーカー・型番検索..." value={search} onChange={e=>setSearch(e.target.value)}/>
          <div className="space-y-2">
            {filtered.map(p => (
              <div key={p.id} className="p-3 bg-neutral-800 rounded-lg flex justify-between items-center cursor-pointer hover:bg-red-900/20" onClick={()=>{
                const w = Number(prompt("重量(kg)?"));
                if(w) setCart([...cart, {p, w}]);
                setSearch("");
              }}>
                <div><span className="text-[10px] text-neutral-500">{p.maker}</span><p className="font-bold">{p.name} ({p.ratio}%)</p></div>
                <ChevronRight size={16} className="text-neutral-600"/>
              </div>
            ))}
          </div>
          <div className="mt-6 space-y-2">
            {cart.map((c, i) => (
              <div key={i} className="flex justify-between text-sm border-b border-neutral-800 pb-2"><span>{c.p.name}</span><span className="font-bold">{c.w}kg</span></div>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-gradient-to-b from-neutral-900 to-black p-8 rounded-3xl border border-red-900/20">
        <h4 className="text-xl font-black mb-8 italic flex items-center gap-2"><Zap className="text-yellow-500"/> SMART LABOR ANALYSIS</h4>
        <div className="space-y-6">
          <div className="flex justify-between text-neutral-400"><span>予想純銅回収量</span><span className="text-white font-mono text-xl">{totalCu.toFixed(1)} kg</span></div>
          <div className="flex justify-between text-neutral-400"><span>ナゲット市場価値</span><span className="text-white font-mono text-xl">¥{Math.floor(sales).toLocaleString()}</span></div>
          <div className="flex justify-between text-red-500"><span>推定仕入原価</span><span className="font-mono text-xl">-¥{Math.floor(purchase).toLocaleString()}</span></div>
          <div className="flex justify-between text-yellow-500"><span>WN-800 加工費</span><span className="font-mono text-xl">-¥{Math.floor(cost).toLocaleString()}</span></div>
          <div className="pt-6 border-t border-neutral-800">
            <div className="flex justify-between items-end">
              <span className="font-bold text-lg">最終営業利益</span>
              <span className={`text-5xl font-black ${profit>0?'text-green-500':'text-red-600'}`}>¥{Math.floor(profit).toLocaleString()}</span>
            </div>
          </div>
        </div>
        {profit < 0 && totalW > 0 && (
          <div className="mt-8 p-4 bg-red-900/20 border border-red-900 text-red-500 rounded-xl flex items-center gap-3 text-sm">
            <AlertTriangle size={24}/>
            <p>警告: 加工コストが利益を圧迫しています。仕入単価の調整、または歩留まりの再検証が必要です。</p>
          </div>
        )}
      </div>
    </div>
  );
}
