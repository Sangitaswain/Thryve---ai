
import React, { useState, useEffect } from 'react';
import { MetricCard } from '../types';

interface HomeScreenProps {
  onNavigateToChat: () => void;
  isDarkMode: boolean;
  toggleTheme: () => void;
}

const wellnessMetrics: MetricCard[] = [
  { title: 'Mood', value: 'Radiant', unit: '', icon: '✨', color: 'bg-[#A8E6CF]/10 text-[#4CB8A4] border-[#A8E6CF]/30' },
  { title: 'Sleep', value: '7h 45m', unit: '', icon: '🌙', color: 'bg-[#6EC1E4]/10 text-[#6EC1E4] border-[#6EC1E4]/30' },
  { title: 'Steps', value: '8,432', unit: '', icon: '🏃', color: 'bg-[#4CB8A4]/10 text-[#4CB8A4] border-[#4CB8A4]/30' },
  { title: 'Hydration', value: '1.5', unit: 'L', icon: '💧', color: 'bg-[#6EC1E4]/10 text-[#6EC1E4] border-[#6EC1E4]/30' },
];

const HomeScreen: React.FC<HomeScreenProps> = ({ onNavigateToChat, isDarkMode, toggleTheme }) => {
  const [isLoading, setIsLoading] = useState(true);
  
  const today = new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1200);
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <div className="p-6 pt-12 space-y-8 pb-32 bg-[#EEF2F6] dark:bg-[#0F172A] min-h-screen">
        <header className="flex justify-between items-start animate-pulse">
          <div className="space-y-3">
            <div className="h-3 w-24 bg-slate-100 dark:bg-slate-800 rounded-full"></div>
            <div className="h-10 w-48 bg-slate-100 dark:bg-slate-800 rounded-2xl"></div>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-slate-100 dark:bg-slate-800"></div>
        </header>
        <div className="h-44 w-full bg-slate-100 dark:bg-slate-800 rounded-[2.5rem] animate-pulse"></div>
        <div className="grid grid-cols-2 gap-4">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="h-32 bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-[2.2rem] animate-pulse"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 pt-12 space-y-8 pb-32 bg-[#EEF2F6] dark:bg-[#0F172A] min-h-screen transition-colors duration-500">
      <header className="flex justify-between items-start animate-in fade-in slide-in-from-top-4 duration-500">
        <div>
          <p className="text-[#4CB8A4] text-[10px] font-bold uppercase tracking-[0.2em] mb-1.5">{today}</p>
          <h1 className="text-[28px] font-semibold text-[#1F2933] dark:text-[#E5E7EB] tracking-tight leading-tight transition-colors">Good Morning,<br/>Alex</h1>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={toggleTheme}
            className="w-12 h-12 rounded-2xl bg-white dark:bg-[#1E293B] border border-slate-100 dark:border-slate-800 flex items-center justify-center shadow-sm text-xl active:scale-90 transition-all hover:border-[#4CB8A4]/30"
          >
            {isDarkMode ? '☀️' : '🌙'}
          </button>
          <button className="w-12 h-12 rounded-2xl bg-white dark:bg-[#1E293B] border border-slate-100 dark:border-slate-800 flex items-center justify-center shadow-sm text-xl active:scale-90 transition-all hover:border-[#4CB8A4]/30 group">
            <span className="group-hover:rotate-12 transition-transform">🔔</span>
          </button>
        </div>
      </header>

      <section className="bg-gradient-to-br from-[#4CB8A4] to-[#6EC1E4] rounded-[2.5rem] p-7 text-white shadow-xl shadow-[#4CB8A4]/20 relative overflow-hidden group animate-in fade-in zoom-in-95 duration-700">
        <div className="relative z-10 flex items-center justify-between">
          <div className="space-y-1">
            <h3 className="text-white/70 text-[10px] font-bold uppercase tracking-[0.2em]">Current Streak</h3>
            <div className="flex items-baseline gap-2">
              <span className="text-5xl font-bold tracking-tighter">14</span>
              <span className="text-white/80 font-semibold text-lg">Days</span>
            </div>
            <p className="text-white/70 text-sm font-normal mt-2">You're doing great!</p>
          </div>
          <div className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-3xl flex items-center justify-center text-3xl shadow-inner group-hover:scale-110 transition-transform">
            🔥
          </div>
        </div>
        <div className="absolute -top-12 -right-12 w-48 h-48 bg-white/10 rounded-full blur-3xl"></div>
      </section>

      {/* AI Insight Highlight Card */}
      <section className="animate-in fade-in slide-in-from-bottom-4 duration-700 delay-100">
        <div className="bg-white dark:bg-[#1E293B] border border-slate-100 dark:border-slate-800 rounded-[2rem] p-6 shadow-[0_16px_48px_rgba(0,0,0,0.05)] transition-all">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <span className="text-lg">✨</span>
              <h4 className="text-sm font-semibold text-[#1F2933] dark:text-[#E5E7EB]">AI Insight</h4>
            </div>
            <span className="text-[9px] font-bold text-[#6B7280] dark:text-[#9CA3AF] uppercase tracking-wider">AI-generated insight (mock)</span>
          </div>
          <p className="text-[#1F2933] dark:text-[#E5E7EB] text-sm leading-relaxed font-normal mb-5">
            We noticed that on days when you sleep less than 6 hours, your mood score tends to be 20% lower.
          </p>
          <div className="h-px bg-slate-100 dark:bg-slate-800 w-full mb-4"></div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold text-[#4CB8A4] uppercase tracking-widest">Try this:</span>
            <span className="text-xs text-[#6B7280] dark:text-[#9CA3AF] font-medium">Sleep 30 minutes earlier tonight (demo)</span>
          </div>
        </div>
      </section>

      <section className="animate-in fade-in slide-in-from-bottom-4 duration-700 delay-200">
        <div className="flex justify-between items-center mb-5">
          <h3 className="text-[#1F2933] dark:text-[#E5E7EB] font-semibold text-xl tracking-tight transition-colors">Daily Summary</h3>
        </div>
        <div className="grid grid-cols-2 gap-4">
          {wellnessMetrics.map((m, idx) => (
            <div key={idx} className="bg-white dark:bg-[#1E293B] border border-slate-50 dark:border-slate-800 rounded-[2rem] p-6 shadow-[0_12px_30px_rgba(0,0,0,0.04)] dark:shadow-none transition-all group active:scale-[0.98]">
              <div className={`${m.color} w-10 h-10 rounded-2xl flex items-center justify-center mb-4 text-2xl border transition-transform group-hover:-translate-y-1`}>
                {m.icon}
              </div>
              <p className="text-[#6B7280] dark:text-[#9CA3AF] text-[10px] font-bold mb-1 uppercase tracking-widest">{m.title}</p>
              <div className="flex items-baseline gap-1">
                <span className="text-2xl font-semibold text-[#1F2933] dark:text-[#E5E7EB] tracking-tight">{m.value}</span>
                {m.unit && <span className="text-[#6B7280] dark:text-[#9CA3AF] font-medium text-xs">{m.unit}</span>}
              </div>
            </div>
          ))}
        </div>
      </section>

      <section 
        onClick={onNavigateToChat}
        className="bg-white dark:bg-[#1E293B] rounded-[2rem] p-7 text-[#1F2933] dark:text-[#E5E7EB] border border-slate-100 dark:border-slate-800 cursor-pointer hover:bg-slate-50 dark:hover:bg-[#263345] transition-all flex items-center justify-between shadow-[0_12px_30px_rgba(0,0,0,0.04)] dark:shadow-none active:scale-95"
      >
        <div className="space-y-1">
          <p className="text-[#4CB8A4] text-[10px] font-bold uppercase tracking-widest">AI Wellness Coach</p>
          <h4 className="font-semibold text-xl tracking-tight">Personalized Chat</h4>
          <p className="text-[#6B7280] dark:text-[#9CA3AF] text-sm font-normal">Ask anything about your health.</p>
        </div>
        <div className="w-12 h-12 bg-[#4CB8A4]/10 dark:bg-[#4CB8A4]/10 rounded-2xl flex items-center justify-center border border-[#4CB8A4]/20 dark:border-[#4CB8A4]/30">
          <svg className="w-5 h-5 text-[#4CB8A4] dark:text-[#4CB8A4]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7" /></svg>
        </div>
      </section>
    </div>
  );
};

export default HomeScreen;