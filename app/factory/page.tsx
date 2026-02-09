// @ts-nocheck
/* eslint-disable */
'use client';

import React, { useState, useEffect } from 'react';

// ==========================================
//  設定エリア
// ==========================================
// GASのウェブアプリURLをここに貼る（mainのpage.tsxと同じもの）
const API_ENDPOINT = "https://script.google.com/macros/s/AKfycbyfYM8q6t7Q7UwIRORFBNOCA-mMpVFE1Z3oLzCJp5GNiYI9_CMy4767p9am2iMY70kl/exec";

// --- アイコン ---
const IconRefresh = () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M23 4v6h-6"></path><path d="M1 20v-6h6"></path><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"></path></svg>;
const IconPlay = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>;
const IconCheck = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>;
const IconHome = () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>;

export default function FactoryDashboard() {
  const [loading, setLoading] = useState(true);
  const [dashboard, setDashboard] = useState({ target:0, current:0, progress:0, remainingDays:0, dailyQuota:0 });
  const [jobs, setJobs] = useState([]);
  
  // 作業中状態
  const [activeJob, setActiveJob] = useState(null); // { id, weight, startTime }
  const [elapsed, setElapsed] = useState(0);
  const [finishModalOpen, setFinishModalOpen] = useState(false);
  const [resultCopper, setResultCopper] = useState('');
  const [resultElec, setResultElec] = useState('0'); // 簡易的に0
  
  // 認証チェック
  const [user, setUser] = useState(null);

  useEffect(() => {
    // ログイン確認
    const stored = localStorage.getItem('tsukisamu_user');
    if (!stored) {
      window.location.href = '/'; // ログインしてなければトップへ
      return;
    }
    setUser(JSON.parse(stored));

    fetchData();
    
    // タイマー
    const timer = setInterval(() => {
      if(activeJob) {
        const diff = Math.floor((new Date() - activeJob.startTime) / 1000);
        setElapsed(diff);
      }
    }, 1000);
    return () => clearInterval(timer);
  }, [activeJob]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [dashRes, jobsRes] = await Promise.all([
        fetch(`${API_ENDPOINT}?action=get_dashboard`).then(r => r.json()),
        fetch(`${API_ENDPOINT}?action=get_pending_jobs`).then(r => r.json())
      ]);

      if(dashRes.success) setDashboard(dashRes);
      if(jobsRes.success) setJobs(jobsRes.jobs);
    } catch(e) {
      console.error(e);
      alert("データ取得エラー");
    } finally {
      setLoading(false);
    }
  };

  const startJob = (job) => {
    if(!confirm(`ID: ${job.id} の処理を開始しますか？`)) return;
    setActiveJob({ ...job, startTime: new Date() });
    setResultCopper(''); // リセット
  };

  const finishJob = async () => {
    if(!resultCopper) return alert("回収重量を入力してください");
    
    setLoading(true);
    try {
      const res = await fetch(`${API_ENDPOINT}?action=finish_job`, {
        method: 'POST',
        body: JSON.stringify({
          id: activeJob.id,
          inputWeight: activeJob.weight,
          startTime: activeJob.startTime,
          copperWeight: Number(resultCopper),
          electricity: Number(resultElec)
        })
      });
      const data = await res.json();
      if(data.success) {
        alert(`処理完了！\n歩留まり: ${data.yield}%`);
        setActiveJob(null);
        setFinishModalOpen(false);
        fetchData(); // データ更新
      }
    } catch(e) {
      alert("送信エラー");
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (sec) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}`;
  };

  if(!user) return <div className="p-10 text-center">認証中...</div>;

  return (
    <div className="min-h-screen bg-slate-900 text-white font-sans selection:bg-red-500 selection:text-white">
      {/* Header */}
      <header className="bg-slate-800 border-b border-slate-700 p-4 flex justify-between items-center sticky top-0 z-50 shadow-lg">
        <div className="flex items-center gap-2">
           <h1 className="text-xl font-black tracking-wider text-red-500">FACTORY <span className="text-white">COCKPIT</span></h1>
           <span className="text-xs bg-slate-700 px-2 py-1 rounded text-slate-300">Manager: {user.name}</span>
        </div>
        <div className="flex gap-4">
           <button onClick={fetchData} disabled={loading} className="p-2 hover:bg-slate-700 rounded transition-colors"><IconRefresh /></button>
           <a href="/" className="p-2 hover:bg-slate-700 rounded transition-colors text-slate-400"><IconHome /></a>
        </div>
      </header>

      <div className="container mx-auto p-4 md:p-6 space-y-8">
        
        {/* 1. Dashboard Metrics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
           {/* 月間進捗 */}
           <div className="col-span-2 bg-slate-800 p-5 rounded-xl border border-slate-700 shadow-lg relative overflow-hidden group">
              <div className="absolute top-0 left-0 h-1 bg-red-500 transition-all duration-1000" style={{width: `${dashboard.progress}%`}}></div>
              <div className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-1">Monthly Progress</div>
              <div className="flex items-end gap-2 mb-2">
                 <span className="text-4xl font-black">{dashboard.current.toLocaleString()}</span>
                 <span className="text-sm text-slate-500 mb-1">/ {dashboard.target.toLocaleString()} kg</span>
              </div>
              <div className="w-full bg-slate-700 h-2 rounded-full overflow-hidden">
                 <div className="bg-gradient-to-r from-red-600 to-orange-500 h-full" style={{width: `${dashboard.progress}%`}}></div>
              </div>
              <div className="mt-2 text-right text-xs text-red-400 font-bold">{dashboard.progress}% 達成</div>
           </div>

           {/* 今日のノルマ (Pace Maker) */}
           <div className="bg-slate-800 p-5 rounded-xl border border-slate-700 shadow-lg">
              <div className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-2">Today's Mission</div>
              <div className="text-3xl font-black text-orange-400">{dashboard.dailyQuota.toLocaleString()} <span className="text-sm text-slate-500">kg</span></div>
              <div className="text-xs text-slate-500 mt-2">残り営業日: {dashboard.remainingDays}日</div>
           </div>

           {/* 未処理在庫 */}
           <div className="bg-slate-800 p-5 rounded-xl border border-slate-700 shadow-lg">
              <div className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-2">Pending Jobs</div>
              <div className="text-3xl font-black text-white">{jobs.length} <span className="text-sm text-slate-500">件</span></div>
              <div className="text-xs text-slate-500 mt-2">ヤード在庫</div>
           </div>
        </div>

        {/* 2. Active Job Controller (作業中のみ表示) */}
        {activeJob && (
          <div className="bg-gradient-to-r from-red-900/50 to-slate-800 border border-red-500/50 p-6 rounded-2xl shadow-2xl animate-pulse ring-1 ring-red-500/30">
             <div className="flex flex-col md:flex-row justify-between items-center gap-6">
                <div>
                   <div className="flex items-center gap-2 mb-1">
                      <span className="bg-red-600 text-white text-xs px-2 py-0.5 rounded font-bold animate-pulse">PROCESSING</span>
                      <span className="font-mono text-lg font-bold">{activeJob.id}</span>
                   </div>
                   <div className="text-3xl font-black">{activeJob.weight.toLocaleString()} <span className="text-sm text-slate-400">kg (投入)</span></div>
                </div>
                
                <div className="text-center">
                   <div className="text-slate-400 text-xs uppercase mb-1">Elapsed Time</div>
                   <div className="font-mono text-5xl font-black tracking-widest">{formatTime(elapsed)}</div>
                </div>

                <button onClick={() => setFinishModalOpen(true)} className="w-full md:w-auto bg-red-600 hover:bg-red-500 text-white px-8 py-4 rounded-xl font-bold shadow-lg text-lg flex items-center justify-center gap-2 transition-transform active:scale-95">
                   <IconCheck /> FINISH JOB
                </button>
             </div>
          </div>
        )}

        {/* 3. Job List (未処理一覧) */}
        {!activeJob && (
          <div className="bg-slate-800 rounded-xl border border-slate-700 overflow-hidden shadow-lg">
             <div className="p-4 border-b border-slate-700 flex justify-between items-center bg-slate-800/50">
                <h3 className="font-bold text-slate-200">未処理キュー (FIFO)</h3>
                <span className="text-xs text-slate-500">古い順に表示</span>
             </div>
             <div className="divide-y divide-slate-700">
               {jobs.length === 0 ? (
                 <div className="p-8 text-center text-slate-500">現在、処理待ちの在庫はありません。</div>
               ) : (
                 jobs.map((job) => (
                   <div key={job.id} className="p-4 flex flex-col md:flex-row justify-between items-center hover:bg-slate-700/50 transition-colors gap-4">
                      <div className="flex-1">
                         <div className="flex items-center gap-3 mb-1">
                            <span className="font-mono text-orange-400 font-bold">{job.id}</span>
                            <span className="text-xs text-slate-400">{new Date(job.date).toLocaleDateString()}</span>
                         </div>
                         <div className="text-xs text-slate-500 truncate max-w-md">
                            {JSON.parse(job.items).map(i=>`${i.name}(${i.weight}kg)`).join(', ')}
                         </div>
                      </div>
                      <div className="text-xl font-bold font-mono">{job.weight.toLocaleString()} <span className="text-sm text-slate-500">kg</span></div>
                      <button onClick={() => startJob(job)} className="bg-slate-100 text-slate-900 hover:bg-white px-6 py-2 rounded font-bold shadow flex items-center gap-2">
                         <IconPlay /> START
                      </button>
                   </div>
                 ))
               )}
             </div>
          </div>
        )}
      </div>

      {/* Finish Modal */}
      {finishModalOpen && (
         <div className="fixed inset-0 z-[60] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-slate-800 border border-slate-600 w-full max-w-md rounded-2xl p-6 shadow-2xl">
               <h3 className="text-xl font-bold mb-6 text-center text-white">実績入力</h3>
               
               <div className="space-y-6">
                  <div>
                     <label className="text-xs text-slate-400 font-bold uppercase block mb-2">回収銅重量 (kg)</label>
                     <input type="number" autoFocus className="w-full bg-slate-900 border border-slate-600 rounded-lg p-4 text-3xl font-mono text-white text-center focus:border-red-500 outline-none" placeholder="0" value={resultCopper} onChange={e=>setResultCopper(e.target.value)} />
                  </div>
                  
                  {/* 電力は任意または日次管理なので、一旦簡易入力または非表示でもOK */}
                  {/* <div>
                     <label className="text-xs text-slate-400 font-bold uppercase block mb-2">消費電力 (kWh) - 任意</label>
                     <input type="number" className="w-full bg-slate-900 border border-slate-600 rounded p-2 text-white" value={resultElec} onChange={e=>setResultElec(e.target.value)} />
                  </div> */}

                  <div className="grid grid-cols-2 gap-4 pt-4">
                     <button onClick={() => setFinishModalOpen(false)} className="py-3 rounded-lg font-bold text-slate-400 hover:bg-slate-700">キャンセル</button>
                     <button onClick={finishJob} className="py-3 rounded-lg font-bold bg-red-600 hover:bg-red-500 text-white shadow-lg shadow-red-900/50">確定・完了</button>
                  </div>
               </div>
            </div>
         </div>
      )}
    </div>
  );
}
