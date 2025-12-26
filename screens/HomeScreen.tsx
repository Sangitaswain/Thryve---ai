
import React from 'react';
import { MetricCard } from '../types';

interface HomeScreenProps {
  onNavigateToChat: () => void;
}

const wellnessMetrics: MetricCard[] = [
  { title: 'Mood', value: 'Radiant', unit: '', icon: '✨', color: 'bg-rose-50 text-rose-600' },
  { title: 'Sleep', value: '7h 45m', unit: '', icon: '🌙', color: 'bg-indigo-50 text-indigo-600' },
  { title: 'Steps', value: '8,432', unit: '', icon: '🏃', color: 'bg-emerald-50 text-emerald-600' },
  { title: 'Hydration', value: '1.5', unit: 'L', icon: '💧', color: 'bg-blue-50 text-blue-600' },
];

const HomeScreen: React.FC<HomeScreenProps> = ({ onNavigateToChat }) => {
  const today = new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });

  return (
    <div className="p-6 pt-12 space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-24">
      {/* Header */}
      <header className="flex justify-between items-start">
        <div>
          <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-1">{today}</p>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Good Morning,<br/>Alex</h1>
        </div>
        <button className="w-12 h-12 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center shadow-sm text-xl hover:bg-white transition-colors">
          🔔
        </button>
      </header>

      {/* Today's Streak Card */}
      <section className="bg-gradient-to-br from-indigo-500 to-indigo-700 rounded-[2rem] p-6 text-white shadow-xl shadow-indigo-100 relative overflow-hidden group">
        <div className="relative z-10 flex items-center justify-between">
          <div className="space-y-1">
            <h3 className="text-indigo-100 text-xs font-bold uppercase tracking-widest">Today's Streak</h3>
            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-black">14</span>
              <span className="text-lg font-medium">Days</span>
            </div>
            <p className="text-indigo-100 text-sm">You're on fire! 3 days to a new badge.</p>
          </div>
          <div className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center text-3xl">
            🔥
          </div>
        </div>
        {/* Abstract decoration */}
        <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-white/10 rounded-full blur-2xl group-hover:scale-110 transition-transform"></div>
      </section>

      {/* Wellness Summary Grid */}
      <section>
        <h3 className="text-slate-800 font-bold mb-4 text-lg">Daily Summary</h3>
        <div className="grid grid-cols-2 gap-4">
          {wellnessMetrics.map((m, idx) => (
            <div key={idx} className="bg-white border border-slate-100 rounded-[2rem] p-5 shadow-sm hover:shadow-md transition-shadow">
              <div className={`${m.color} w-10 h-10 rounded-xl flex items-center justify-center mb-4 text-xl`}>
                {m.icon}
              </div>
              <p className="text-slate-400 text-xs font-semibold mb-1 uppercase tracking-wider">{m.title}</p>
              <div className="flex items-baseline gap-1">
                <span className="text-xl font-bold text-slate-800">{m.value}</span>
                {m.unit && <span className="text-slate-400 text-sm">{m.unit}</span>}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Motivational Quote */}
      <section className="bg-emerald-50/50 border border-emerald-100 rounded-[2rem] p-6 relative overflow-hidden">
        <div className="text-emerald-800 relative z-10">
          <span className="text-4xl font-serif text-emerald-200 absolute -top-2 -left-2 leading-none">“</span>
          <p className="text-lg font-medium italic leading-relaxed pl-4 mb-2">
            The secret of your future is hidden in your daily routine.
          </p>
          <p className="text-xs font-bold uppercase tracking-widest text-emerald-600 pl-4">— Mike Murdock</p>
        </div>
      </section>

      {/* Quick Action / AI Nudge */}
      <section 
        onClick={onNavigateToChat}
        className="bg-slate-900 rounded-[2rem] p-6 text-white cursor-pointer hover:bg-slate-800 transition-colors flex items-center justify-between"
      >
        <div className="space-y-1">
          <p className="text-indigo-400 text-[10px] font-bold uppercase tracking-widest">AI Suggestion</p>
          <h4 className="font-bold text-lg leading-tight">Improve your deep sleep</h4>
          <p className="text-slate-400 text-xs">Based on your activity, try this 5m routine.</p>
        </div>
        <div className="w-10 h-10 bg-indigo-500 rounded-full flex items-center justify-center">
          <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7" />
          </svg>
        </div>
      </section>
    </div>
  );
};

export default HomeScreen;
