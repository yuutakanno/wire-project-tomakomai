// @ts-nocheck
/* eslint-disable */
'use client';

import React, { useState, useEffect } from 'react';

// ==========================================
//  設定エリア
// ==========================================
const API_ENDPOINT = "https://script.google.com/macros/s/AKfycbyfYM8q6t7Q7UwIRORFBNOCA-mMpVFE1Z3oLzCJp5GNiYI9_CMy4767p9am2iMY70kl/exec";

// --- Icons ---
const IconRefresh = () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M23 4v6h-6"></path><path d="M1 20v-6h6"></path><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"></path></svg>;
const IconPlay = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>;
const IconCheck = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>;
const IconHome = () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>;
const IconUsers = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>;
const IconFileText = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>;
const IconPrinter = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 6 2 18 2 18 9"></polyline><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"></path><rect x="6" y="14" width="12" height="8"></rect></svg>;
const IconLock = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>;

// --- Components ---
const CircleChart = ({ percent, label, subLabel, color }) => {
  const r = 40;
  const c = 2 * Math.PI * r;
  const offset = c - (percent / 100) * c;
  return (
    <div className="relative flex items-center justify-center w-32 h-32">
      <svg className="w-full h-full transform -rotate-90">
        <circle cx="64" cy="64" r={r} stroke="currentColor" strokeWidth="8" fill="transparent" className="text-slate-700" />
        <circle cx="64" cy="64" r={r} stroke="currentColor" strokeWidth="8" fill="transparent" strokeDasharray={c} strokeDashoffset={offset} className={`${color} transition-all duration-1000 ease-out`} strokeLinecap="round" />
      </svg>
      <div className="absolute text-center">
        <div className="text-2xl font-black text-white">{percent}%</div>
        <div className="text-[10px] text-slate-400 uppercase">{label}</div>
      </div>
    </div>
  );
};

export default function FactoryDashboard() {
  const [isAdmin, setIsAdmin] = useState(false); // 管理者ログイン状態
  const [authId, setAuthId] = useState('');
  const [authPw, setAuthPw] = useState('');
  const [authLoading, setAuthLoading] = useState(false);

  const [loading, setLoading] = useState(true);
  const [dashboard, setDashboard] = useState({ 
    target:30000, current:0, progress:0, remainingDays:0, dailyQuota:0, 
    clientStats: { total: 0, newThisMonth: 0 } 
  });
  const [jobs, setJobs] = useState([]);
  const [activeJob, setActiveJob] = useState(null); 
  const [elapsed, setElapsed] = useState(0);
  const [finishModalOpen, setFinishModalOpen] = useState(false);
  const [resultCopper, setResultCopper] = useState('');
  const [processingAction, setProcessingAction] = useState(null);
  const [user, setUser] = useState(null);

  useEffect(() => {
    // セッションチェック（リロードしてもログイン維持）
    const session = sessionStorage.getItem('factory_admin_session');
    if (session) {
      const userData = JSON.parse(session);
      setUser(userData);
      setIsAdmin(true);
      fetchData();
    }
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      if(activeJob) {
        setElapsed(Math.floor((new Date() - activeJob.startTime) / 1000));
      }
    }, 1000);
    return () => clearInterval(timer);
  }, [activeJob]);

  // ★管理者ログイン処理
  const handleAdminLogin = async (e) => {
    e.preventDefault();
    setAuthLoading(true);
    try {
      const res = await fetch(`${API_ENDPOINT}?action=login&id=${authId}&pw=${authPw}`);
      const data = await res.json();
      
      if (data.success && data.user) {
        // 管理者権限チェック (ADMIN か IDが admin)
        if (data.user.rank === 'ADMIN' || data.user.id === 'admin') {
          setUser(data.user);
          setIsAdmin(true);
          sessionStorage.setItem('factory_admin_session', JSON.stringify(data.user)); // セッション保存
          fetchData(); // データ取得開始
        } else {
          alert("このアカウントには管理者権限がありません。");
        }
      } else {
        alert("IDまたはパスワードが違います。");
      }
    } catch (err) {
      alert("ログインエラー");
    } finally {
      setAuthLoading(false);
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem('factory_admin_session');
    setIsAdmin(false);
    setUser(null);
  };

  const fetchData = async () => {
    setLoading(true);
    try {
      const [dashRes, jobsRes] = await Promise.all([
        fetch(`${API_ENDPOINT}?action=get_dashboard`).then(r => r.json()),
        fetch(`${API_ENDPOINT}?action=get_pending_jobs`).then(r => r.json())
      ]);
      if(dashRes.success) setDashboard(prev => ({...prev, ...dashRes}));
      if(jobsRes.success) setJobs(jobsRes.jobs);
    } catch(e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const startJob = (job) => {
    if(!confirm(`ID: ${job.id} の処理を開始しますか？`)) return;
    setActiveJob({ ...job, startTime: new Date() });
    setResultCopper('');
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
          electricity: 0
        })
      });
      const data = await res.json();
      if(data.success) {
        alert(`処理完了！\n歩留まり: ${data.yield}%`);
        setActiveJob(null);
        setFinishModalOpen(false);
        fetchData(); 
      }
    } catch(e) {
      alert("送信エラー");
    } finally {
      setLoading(false);
    }
  };

  const handleAdminAction = (actionName) => {
    setProcessingAction(actionName);
    setTimeout(() => {
      alert(`${actionName} が完了しました。\n(※デモ機能のため実際にはPDF生成などは行われていません)`);
      setProcessingAction(null);
    }, 1500);
  };

  const formatTime = (sec) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}`;
  };

  // ==========================================
  //  Gatekeeper View (ログイン画面)
  // ==========================================
  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-[#0f172a] text-white flex items-center justify-center p-4">
        <div className="w-full max-w-sm bg-[#1e293b] p-8 rounded-3xl border border-slate-700 shadow-2xl">
          <div className="text-center mb-8">
            <div className="inline-block p-4 bg-slate-800 rounded-2xl mb-4 border border-slate-700">
               <IconLock />
            </div>
            <h1 className="text-2xl font-black tracking-widest text-white">FACTORY <span className="text-red-600">GATE</span></h1>
            <p className="text-xs text-slate-500 mt-2 uppercase tracking-wide">Authorized Personnel Only</p>
          </div>
          <form onSubmit={handleAdminLogin} className="space-y-4">
            <div>
               <label className="text-xs font-bold text-slate-400 ml-1">ADMIN ID</label>
               <input 
                 type="text" 
                 value={authId} 
                 onChange={e=>setAuthId(e.target.value)}
                 className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-white focus:border-red-500 outline-none transition-colors" 
                 placeholder="Enter ID"
               />
            </div>
            <div>
               <label className="text-xs font-bold text-slate-400 ml-1">PASSWORD</label>
               <input 
                 type="password" 
                 value={authPw} 
                 onChange={e=>setAuthPw(e.target.value)}
                 className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-white focus:border-red-500 outline-none transition-colors" 
                 placeholder="Enter Password"
               />
            </div>
            <button 
              type="submit" 
              disabled={authLoading}
              className="w-full bg-red-600 hover:bg-red-500 text-white font-bold py-4 rounded-xl transition-all shadow-lg shadow-red-900/30 flex justify-center"
            >
              {authLoading ? 'VERIFYING...' : 'UNLOCK SYSTEM'}
            </button>
          </form>
          <div className="mt-8 text-center">
            <a href="/" className="text-xs text-slate-500 hover:text-white transition-colors border-b border-transparent hover:border-slate-500 pb-0.5">Back to Customer Site</a>
          </div>
        </div>
      </div>
    );
  }

  // ==========================================
  //  Dashboard View (管理画面)
  // ==========================================
  return (
    <div className="min-h-screen bg-[#0f172a] text-white font-sans selection:bg-cyan-500 selection:text-white">
      {/* Header */}
      <header className="bg-[#1e293b] border-b border-slate-700 p-4 flex justify-between items-center sticky top-0 z-50 shadow-xl">
        <div className="flex items-center gap-3">
           <div className="bg-gradient-to-br from-red-600 to-orange-600 p-2 rounded-lg shadow-lg shadow-red-500/20">
             <IconCheck />
           </div>
           <div>
             <h1 className="text-xl font-black tracking-widest text-white leading-none">FACTORY <span className="text-red-500">OS</span></h1>
             <span className="text-[10px] text-slate-400 font-mono tracking-wider">VER 2.0.3 [SECURE]</span>
           </div>
        </div>
        <div className="flex gap-4 items-center">
           <div className="hidden md:block text-right">
             <div className="text-xs text-slate-400">ADMINISTRATOR</div>
             <div className="font-bold text-sm text-cyan-400">{user.name}</div>
           </div>
           <button onClick={fetchData} disabled={loading} className="p-2 bg-slate-800 hover:bg-slate-700 rounded-full transition-all border border-slate-700"><IconRefresh /></button>
           <button onClick={handleLogout} className="text-xs bg-red-900/30 text-red-400 border border-red-900/50 px-3 py-2 rounded-lg hover:bg-red-900/50 transition-colors">LOGOUT</button>
        </div>
      </header>

      <div className="container mx-auto p-4 md:p-8 space-y-8">
        
        {/* 1. Dashboard Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
           <div className="md:col-span-1 lg:col-span-1 bg-[#1e293b] p-6 rounded-2xl border border-slate-700 shadow-xl flex flex-col items-center justify-center relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-cyan-500 to-blue-500"></div>
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4 w-full text-center">Monthly Target</h3>
              <CircleChart percent={dashboard.progress} label="ACHIEVED" color="text-cyan-500" />
              <div className="mt-4 text-center">
                 <div className="text-2xl font-black text-white">{dashboard.current.toLocaleString()} <span className="text-sm text-slate-500">kg</span></div>
                 <div className="text-xs text-slate-500">Target: {dashboard.target.toLocaleString()} kg</div>
              </div>
           </div>

           <div className="md:col-span-2 lg:col-span-3 grid grid-cols-1 sm:grid-cols-3 gap-6">
              <div className="bg-[#1e293b] p-6 rounded-2xl border border-slate-700 shadow-xl flex flex-col justify-between group hover:border-orange-500/50 transition-colors">
                 <div>
                   <div className="text-xs font-bold text-orange-400 uppercase tracking-widest mb-1">Today's Mission</div>
                   <div className="text-4xl font-black text-white mt-2">{dashboard.dailyQuota.toLocaleString()} <span className="text-lg text-slate-500">kg</span></div>
                 </div>
                 <div className="w-full bg-slate-700 h-1.5 rounded-full mt-4 overflow-hidden">
                    <div className="bg-orange-500 h-full w-2/3"></div>
                 </div>
                 <div className="text-xs text-slate-500 mt-2 text-right">残り営業日: {dashboard.remainingDays}日</div>
              </div>

              <div className="bg-[#1e293b] p-6 rounded-2xl border border-slate-700 shadow-xl flex flex-col justify-between group hover:border-blue-500/50 transition-colors">
                 <div className="flex justify-between items-start">
                   <div className="text-xs font-bold text-blue-400 uppercase tracking-widest">Members</div>
                   <IconUsers className="text-slate-600" />
                 </div>
                 <div className="mt-2">
                   <div className="text-4xl font-black text-white">{dashboard.clientStats.total} <span className="text-lg text-slate-500">社</span></div>
                   <div className="text-sm text-blue-400 font-bold mt-1">+{dashboard.clientStats.newThisMonth} <span className="text-xs text-slate-500">New (今月)</span></div>
                 </div>
              </div>

              <div className="bg-[#1e293b] p-6 rounded-2xl border border-slate-700 shadow-xl flex flex-col gap-3">
                 <div className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Quick Actions</div>
                 <button onClick={() => handleAdminAction("請求書一括発行")} disabled={!!processingAction} className="flex items-center gap-3 bg-slate-800 hover:bg-slate-700 p-3 rounded-lg transition-colors text-sm font-bold text-left border border-slate-700">
                    <IconPrinter className="text-emerald-500" /> 
                    {processingAction === "請求書一括発行" ? "生成中..." : "請求書発行"}
                 </button>
                 <button onClick={() => handleAdminAction("月次レポート作成")} disabled={!!processingAction} className="flex items-center gap-3 bg-slate-800 hover:bg-slate-700 p-3 rounded-lg transition-colors text-sm font-bold text-left border border-slate-700">
                    <IconFileText className="text-purple-500" /> 
                    {processingAction === "月次レポート作成" ? "集計中..." : "月報作成"}
                 </button>
              </div>
           </div>
        </div>

        {/* 2. Active Job Controller */}
        {activeJob && (
          <div className="bg-gradient-to-r from-red-900/40 to-slate-900 border border-red-500/50 p-8 rounded-3xl shadow-2xl relative overflow-hidden">
             <div className="absolute top-0 right-0 p-4 opacity-10"><IconPlay width={200} height={200} /></div>
             <div className="flex flex-col md:flex-row justify-between items-center gap-8 relative z-10">
                <div>
                   <div className="flex items-center gap-3 mb-2">
                      <span className="bg-red-600 text-white text-[10px] px-3 py-1 rounded-full font-black tracking-widest animate-pulse">LIVE PROCESSING</span>
                      <span className="font-mono text-xl font-bold text-slate-200">{activeJob.id}</span>
                   </div>
                   <div className="text-5xl md:text-6xl font-black text-white tracking-tight">{activeJob.weight.toLocaleString()} <span className="text-xl text-slate-400 font-medium">kg</span></div>
                   <div className="text-slate-400 mt-2 text-sm">Target: Copper Recovery Process</div>
                </div>
                
                <div className="text-center bg-black/30 p-6 rounded-2xl border border-white/10 backdrop-blur-sm">
                   <div className="text-slate-400 text-xs uppercase tracking-widest mb-2">Operation Time</div>
                   <div className="font-mono text-5xl md:text-6xl font-black text-cyan-400 tabular-nums">{formatTime(elapsed)}</div>
                </div>

                <button onClick={() => setFinishModalOpen(true)} className="w-full md:w-auto bg-red-600 hover:bg-red-500 text-white px-10 py-6 rounded-2xl font-black shadow-lg shadow-red-900/50 text-xl flex items-center justify-center gap-3 transition-transform active:scale-95">
                   <IconCheck /> COMPLETED
                </button>
             </div>
          </div>
        )}

        {/* 3. Job List */}
        {!activeJob && (
          <div className="bg-[#1e293b] rounded-2xl border border-slate-700 overflow-hidden shadow-xl">
             <div className="p-5 border-b border-slate-700 flex justify-between items-center bg-slate-800/50">
                <div className="flex items-center gap-3">
                   <div className="w-3 h-3 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]"></div>
                   <h3 className="font-bold text-slate-200 tracking-wide">PENDING JOBS QUEUE</h3>
                </div>
                <span className="text-xs bg-slate-800 px-3 py-1 rounded-full text-slate-400 border border-slate-700">{jobs.length} TASKS</span>
             </div>
             <div className="divide-y divide-slate-700/50">
               {jobs.length === 0 ? (
                 <div className="p-16 text-center text-slate-500 flex flex-col items-center">
                    <IconCheck className="mb-4 opacity-20 w-16 h-16" />
                    <p className="font-bold">ALL TASKS CLEARED</p>
                    <p className="text-sm opacity-50">現在、処理待ちの在庫はありません。</p>
                 </div>
               ) : (
                 jobs.map((job) => (
                   <div key={job.id} className="p-5 flex flex-col md:flex-row justify-between items-center hover:bg-slate-700/30 transition-colors gap-6 group">
                      <div className="flex-1">
                         <div className="flex items-center gap-4 mb-2">
                            <span className="font-mono text-orange-400 font-bold bg-orange-400/10 px-2 py-0.5 rounded text-sm">{job.id}</span>
                            <span className="text-xs text-slate-500">{new Date(job.date).toLocaleString()}</span>
                         </div>
                         <div className="text-sm text-slate-300 font-medium">
                            {JSON.parse(job.items).map(i=>`${i.name} (${i.weight}kg)`).join(' + ')}
                         </div>
                      </div>
                      <div className="flex items-center gap-6">
                        <div className="text-right">
                           <div className="text-2xl font-black text-white">{job.weight.toLocaleString()} <span className="text-sm text-slate-500">kg</span></div>
                           <div className="text-[10px] text-slate-500 uppercase tracking-wider">Total Weight</div>
                        </div>
                        <button onClick={() => startJob(job)} className="bg-cyan-600 hover:bg-cyan-500 text-white px-6 py-3 rounded-xl font-bold shadow-lg shadow-cyan-900/20 flex items-center gap-2 transition-all transform group-hover:scale-105">
                           <IconPlay className="w-5 h-5" /> START
                        </button>
                      </div>
                   </div>
                 ))
               )}
             </div>
          </div>
        )}
      </div>

      {finishModalOpen && (
         <div className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-md flex items-center justify-center p-4">
            <div className="bg-[#1e293b] border border-slate-600 w-full max-w-lg rounded-3xl p-8 shadow-2xl relative">
               <div className="text-center mb-8">
                  <div className="inline-block p-3 rounded-full bg-red-500/10 text-red-500 mb-4"><IconCheck className="w-8 h-8"/></div>
                  <h3 className="text-2xl font-black text-white tracking-wide">MISSION COMPLETE</h3>
                  <p className="text-slate-400 text-sm mt-2">加工実績を入力してデータを確定してください</p>
               </div>
               
               <div className="space-y-6">
                  <div className="bg-slate-900/50 p-6 rounded-2xl border border-slate-700">
                     <label className="text-xs text-slate-400 font-bold uppercase block mb-3 text-center">Recovered Copper (回収重量)</label>
                     <div className="relative">
                        <input type="number" autoFocus className="w-full bg-transparent border-b-2 border-slate-600 py-2 text-5xl font-mono text-white text-center focus:border-red-500 outline-none transition-colors" placeholder="0" value={resultCopper} onChange={e=>setResultCopper(e.target.value)} />
                        <span className="absolute right-0 bottom-4 text-slate-500 font-bold">kg</span>
                     </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 pt-2">
                     <button onClick={() => setFinishModalOpen(false)} className="py-4 rounded-xl font-bold text-slate-400 hover:bg-slate-800 transition-colors">キャンセル</button>
                     <button onClick={finishJob} className="py-4 rounded-xl font-bold bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-500 hover:to-orange-500 text-white shadow-lg shadow-red-900/40 transform active:scale-95 transition-all">データ確定・保存</button>
                  </div>
               </div>
            </div>
         </div>
      )}
    </div>
  );
}
