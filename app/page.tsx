"use client";

import React, { useState } from 'react';

const GAS_API_URL = 'https://script.google.com/macros/s/AKfycbyfYM8q6t7Q7UwIRORFBNOCA-mMpVFE1Z3oLzCJp5GNiYI9_CMy4767p9am2iMY70kl/exec';

export default function TomakomaiDXPage() {
  const [loading, setLoading] = useState(false);
  const [calcResult, setCalcResult] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    company: '',
    phone: '',
    email: '',
    wireType: '1100', // 初期値: 一重銅
    weight: '',
    message: ''
  });

  // 簡易計算ロジック（DX初期フェーズ用）
  const handleCalculate = () => {
    const rate = parseInt(formData.wireType);
    const weight = parseFloat(formData.weight);
    if (weight > 0) {
      setCalcResult(rate * weight);
    } else {
      alert("重量を入力してください");
    }
  };

  // フォーム送信処理（Vercel -> GAS）
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await fetch(GAS_API_URL, {
        method: 'POST',
        mode: 'no-cors', // GAS送信の標準
        body: JSON.stringify(formData),
      });

      alert('査定依頼を送信しました。データをシステムに登録し、担当者よりご連絡いたします。');
      setFormData({ ...formData, message: '', weight: '' }); // 一部リセット
    } catch (error) {
      alert('システムエラーが発生しました。お電話にてお問い合わせください。');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white text-gray-900 font-sans">
      {/* Header */}
      <header className="border-b sticky top-0 bg-white/90 backdrop-blur-md z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-xl font-black leading-tight">株式会社月寒製作所</h1>
            <p className="text-xs text-red-600 font-bold tracking-widest">苫小牧工場 DX PLATFORM</p>
          </div>
          <a href="tel:0144-55-5544" className="bg-red-600 text-white px-6 py-2 rounded font-bold hover:bg-red-700 transition">
            0144-55-5544
          </a>
        </div>
      </header>

      {/* Hero */}
      <section className="relative bg-neutral-900 text-white py-24 px-6 overflow-hidden">
        <div className="absolute inset-0 opacity-30 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]"></div>
        <div className="max-w-4xl mx-auto relative z-10 text-center">
          <h2 className="text-5xl md:text-7xl font-black mb-6 italic">RE-DEFINE VALUE.</h2>
          <p className="text-xl opacity-80 leading-relaxed">
            1961年創業。資源を価値に、現場をデータに。<br />
            WN-800プラントが生み出す純度99.9%の未来。
          </p>
        </div>
      </section>

      {/* Main Content */}
      <main className="max-w-5xl mx-auto py-20 px-6 grid md:grid-cols-2 gap-12">
        
        {/* Left: Simulator */}
        <div className="bg-neutral-50 p-8 border rounded-xl shadow-sm">
          <h3 className="text-2xl font-bold mb-8 border-l-4 border-red-600 pl-4">買取査定シミュレーター</h3>
          
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-bold mb-2">電線の種類（目安の銅率）</label>
              <select 
                className="w-full p-3 border rounded bg-white"
                value={formData.wireType}
                onChange={(e) => setFormData({...formData, wireType: e.target.value})}
              >
                <option value="1300">特一重銅 / CV相当 (約80%)</option>
                <option value="1100">一重銅 / VVF・IV相当 (約65%)</option>
                <option value="650">雑線 / キャブタイヤ相当 (約40%)</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-bold mb-2">重量 (kg)</label>
              <input 
                type="number" 
                className="w-full p-3 border rounded bg-white"
                placeholder="例: 100"
                value={formData.weight}
                onChange={(e) => setFormData({...formData, weight: e.target.value})}
              />
            </div>

            <button 
              onClick={handleCalculate}
              className="w-full bg-neutral-800 text-white py-4 rounded font-bold hover:bg-black transition"
            >
              概算価格を計算
            </button>

            {calcResult !== null && (
              <div className="mt-8 p-6 bg-white border-2 border-red-600 rounded-lg text-center animate-pulse">
                <p className="text-sm text-gray-500 mb-1">現在の推定買取価格(税込)</p>
                <p className="text-4xl font-black text-red-600">¥{calcResult.toLocaleString()}</p>
              </div>
            )}
          </div>
        </div>

        {/* Right: Form */}
        <div className="bg-white p-8 border rounded-xl shadow-sm">
          <h3 className="text-2xl font-bold mb-8 border-l-4 border-red-600 pl-4">査定依頼 / データ送信</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <input 
              type="text" placeholder="お名前 *" required
              className="w-full p-3 border rounded"
              value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})}
            />
            <input 
              type="text" placeholder="会社名" 
              className="w-full p-3 border rounded"
              value={formData.company} onChange={(e) => setFormData({...formData, company: e.target.value})}
            />
            <input 
              type="tel" placeholder="電話番号 *" required
              className="w-full p-3 border rounded"
              value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})}
            />
            <input 
              type="email" placeholder="メールアドレス *" required
              className="w-full p-3 border rounded"
              value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})}
            />
            <textarea 
              placeholder="備考・ご要望" rows={4}
              className="w-full p-3 border rounded"
              value={formData.message} onChange={(e) => setFormData({...formData, message: e.target.value})}
            ></textarea>
            
            <button 
              type="submit"
              disabled={loading}
              className="w-full bg-red-600 text-white py-5 rounded font-bold text-lg hover:bg-red-700 disabled:bg-gray-400 transition"
            >
              {loading ? '送信中...' : 'DXシステムへ送信'}
            </button>
          </form>
        </div>
      </main>

      <footer className="bg-neutral-900 text-gray-500 py-12 text-center text-sm">
        <p>© 2026 株式会社月寒製作所 苫小牧工場<br />Material Strategy & DX Solution</p>
      </footer>
    </div>
  );
}
