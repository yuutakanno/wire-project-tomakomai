'use client';

import React, { useState, useEffect } from 'react';

export default function LandingPage() {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-orange-200">
      
      {/* 1. ナビゲーションバー & ティッカー */}
      <header className={`fixed top-0 w-full z-50 transition-all duration-300 ${isScrolled ? 'bg-white/90 backdrop-blur-md shadow-sm py-2' : 'bg-transparent py-4'}`}>
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex justify-between items-center">
            {/* ロゴエリア */}
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-orange-600 rounded-sm flex items-center justify-center">
                <span className="text-white font-bold">T</span>
              </div>
              <span className={`text-lg font-bold tracking-tight ${isScrolled ? 'text-slate-900' : 'text-slate-900'}`}>
                TSUKISAMU <span className="font-light text-slate-500">RECYCLE</span>
              </span>
            </div>

            {/* PCメニュー */}
            <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-600">
              <a href="#market" className="hover:text-orange-600 transition-colors">相場情報</a>
              <a href="#process" className="hover:text-orange-600 transition-colors">買取の流れ</a>
              <a href="#access" className="hover:text-orange-600 transition-colors">アクセス</a>
              <button className="bg-slate-900 text-white px-5 py-2.5 rounded-full hover:bg-slate-800 transition-all flex items-center gap-2 text-sm shadow-lg shadow-slate-900/20">
                <span>📱</span>
                LINE査定・予約
              </button>
            </nav>
          </div>
        </div>

        {/* ティッカー（相場情報） */}
        <div className="w-full bg-slate-900 text-slate-400 text-xs py-1.5 overflow-hidden border-t border-slate-800 mt-2 md:mt-4">
          <div className="flex gap-8 items-center justify-center md:justify-start px-4">
            <span className="flex items-center gap-1"><span className="text-orange-500">●</span> LME COPPER: $12,821/t (+1.2%)</span>
            <span className="hidden md:inline text-slate-700">|</span>
            <span className="flex items-center gap-1">USD/JPY: 148.50 (+0.32)</span>
            <span className="hidden md:inline text-slate-700">|</span>
            <span className="flex items-center gap-1 text-white font-bold">国内銅建値: ¥2,060,000/t (高値更新中)</span>
          </div>
        </div>
      </header>

      <main>
        {/* 2. ヒーローセクション */}
        <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 px-4 overflow-hidden">
          <div className="container mx-auto md:px-6 grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-100 text-orange-800 text-xs font-bold uppercase tracking-wider">
                <span>⚡</span>
                2026 Strategy Ready
              </div>
              <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-slate-900 leading-[1.1]">
                銅の価値を、<br/>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-600 to-orange-400">
                  技術で証明する。
                </span>
              </h1>
              <p className="text-lg text-slate-600 leading-relaxed max-w-lg">
                月寒製作所は、ただのスクラップ回収ではありません。<br className="hidden md:block"/>
                製造業のノウハウで廃電線を「資源」へと再生し、<br className="hidden md:block"/>
                LME連動の適正価格で、あなたの資産価値を最大化します。
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <button className="bg-slate-900 text-white px-8 py-4 rounded-lg font-semibold hover:bg-slate-800 transition-all shadow-xl shadow-slate-900/10 flex items-center justify-center gap-2">
                  買取単価を見る
                  <span>👉</span>
                </button>
                <button className="bg-white border border-slate-200 text-slate-700 px-8 py-4 rounded-lg font-semibold hover:bg-slate-50 transition-all flex items-center justify-center gap-2">
                  <span>📍</span>
                  持込場所（江別・清田）
                </button>
              </div>
            </div>

            {/* 右側：ダッシュボード風カード */}
            <div className="relative">
              <div className="bg-white p-6 rounded-2xl shadow-2xl border border-slate-100 relative z-10">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="font-bold text-slate-700">本日の買取参考価格</h3>
                  <span className="text-xs text-slate-400">2026.02.08 更新</span>
                </div>
                
                <div className="space-y-4">
                  {[
                    { name: 'ピカ線 (1号銅)', price: '1,450', unit: '円/kg', trend: 'up' },
                    { name: 'CVTケーブル (一本物)', price: '920~', unit: '円/kg', trend: 'up' },
                    { name: 'VA線 (Fケーブル)', price: '480~', unit: '円/kg', trend: 'flat' },
                  ].map((item, i) => (
                    <div key={i} className="flex justify-between items-center p-4 bg-slate-50 rounded-xl hover:bg-orange-50/50 transition-colors cursor-default border border-transparent hover:border-orange-100">
                      <div>
                        <p className="font-bold text-slate-900">{item.name}</p>
                        <p className="text-xs text-slate-500">歩留まり基準による変動あり</p>
                      </div>
                      <div className="text-right">
                        <p className="font-mono text-xl font-bold text-slate-900">{item.price}<span className="text-sm font-normal text-slate-500 ml-1">{item.unit}</span></p>
                        <div className="flex items-center justify-end gap-1 text-xs font-medium text-emerald-600">
                           {item.trend === 'up' && <span>📈</span>}
                           <span>前日比 +12円</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="mt-6 pt-6 border-t border-slate-100 text-center">
                  <p className="text-sm text-slate-500">
                    ※上記は参考価格です。実際の買取価格は銅建値と為替によりリアルタイムに変動します。
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 3. 信頼の証 */}
        <section className="py-20 bg-slate-50 border-t border-slate-200">
          <div className="container mx-auto px-4 md:px-6">
            <div className="text-center max-w-2xl mx-auto mb-16">
              <h2 className="text-3xl font-bold text-slate-900 mb-4">なぜ、プロは月寒製作所を選ぶのか</h2>
              <p className="text-slate-600">
                不透明な査定、待たされる時間、根拠のない減額。<br/>
                これまでのスクラップ業界の「当たり前」を、私たちは廃止しました。
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  icon: "🚚",
                  title: "デジタル・スムーズ",
                  desc: "LINEで事前予約すれば、現場での待ち時間はほぼゼロ。ドライブスルー感覚で、計量から支払いまで完結します。"
                },
                {
                  icon: "🛡️",
                  title: "メーカー基準の透明性",
                  desc: "配電盤メーカーとしての知見を活かし、電線の構造に基づいた論理的な査定（グレーディング）を行います。"
                },
                {
                  icon: "⚡",
                  title: "即時現金化・適法処理",
                  desc: "その場で現金をお支払い。もちろん、産廃マニフェストの発行やリサイクル証明書にも完全対応しています。"
                }
              ].map((feature, i) => (
                <div key={i} className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
                  <div className="bg-orange-50 w-16 h-16 rounded-xl flex items-center justify-center mb-6 text-2xl">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-3">{feature.title}</h3>
                  <p className="text-slate-600 leading-relaxed text-sm">
                    {feature.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
      
      <footer className="bg-slate-950 text-slate-400 py-12 border-t border-slate-900 text-center text-sm">
        <p>&copy; 2026 Tsukisamu Seisakusho Co., Ltd.</p>
      </footer>
    </div>
  );
}
