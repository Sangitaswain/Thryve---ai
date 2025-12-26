
import React, { useState } from 'react';
import { AreaChart, Area, XAxis, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { AIInsight } from '../types';

const data = [
  { name: 'Mon', mood: 6, steps: 4200 },
  { name: 'Tue', mood: 5, steps: 5500 },
  { name: 'Wed', mood: 8, steps: 8200 },
  { name: 'Thu', mood: 7, steps: 6100 },
  { name: 'Fri', mood: 6, steps: 9500 },
  { name: 'Sat', mood: 9, steps: 3200 },
  { name: 'Sun', mood: 8, steps: 4800 },
];

const mockInsights: AIInsight[] = [
  {
    id: 'i1',
    type: 'journaling',
    icon: '✍️',
    content: "Journaling for 3 consecutive days shows a positive mood trend. You are 15% more radiant on these days.",
    suggestion: "Maintain your 3-day streak (demo)"
  },
  {
    id: 'i2',
    type: 'activity',
    icon: '⚡',
    content: "You feel more energetic on days with light physical activity before noon.",
    suggestion: "A 10-minute walk after lunch (demo)"
  },
  {
    id: 'i3',
    type: 'hydration',
    icon: '💧',
    content: "Hydration goals are missed more often on busy weekdays compared to weekends.",
    suggestion: "Keep a water bottle at your desk (demo)"
  }
];

const InsightsScreen: React.FC = () => {
  const [hasData, setHasData] = useState(true);

  if (!hasData) {
    return (
      <div className="p-6 pt-12 flex flex-col items-center justify-center min-h-[80vh] text-center animate-in fade-in duration-500">
        <div className="w-24 h-24 bg-slate-50 dark:bg-[#1E293B] rounded-3xl flex items-center justify-center text-4xl mb-6">📊</div>
        <h2 className="text-2xl font-semibold text-[#1F2933] dark:text-[#E5E7EB] transition-colors">Awaiting History</h2>
        <p className="text-[#6B7280] dark:text-[#9CA3AF] text-sm mt-2 px-8 transition-colors">Patterns will appear once you have 3+ logs.</p>
        <button onClick={() => setHasData(true)} className="mt-8 text-[#4CB8A4] font-bold text-[10px] uppercase tracking-widest">Simulate Data</button>
      </div>
    );
  }

  return (
    <div className="p-6 pt-12 space-y-10 pb-32">
      <header className="animate-in fade-in duration-500">
        <h1 className="text-[28px] font-semibold text-[#1F2933] dark:text-[#E5E7EB] tracking-tight transition-colors">Your Progress</h1>
        <p className="text-[#6B7280] dark:text-[#9CA3AF] text-sm mt-1 transition-colors">Holistic patterns for the week.</p>
      </header>

      <section className="bg-white dark:bg-[#1E293B] border border-transparent dark:border-slate-800 rounded-[2rem] p-7 shadow-[0_8px_20px_rgb(0,0,0,0.02)] dark:shadow-none transition-colors">
        <div className="flex justify-between items-center mb-8 px-1">
          <div>
            <h3 className="font-semibold text-[#1F2933] dark:text-[#E5E7EB] text-lg transition-colors">Mood Flow</h3>
            <p className="text-[10px] text-[#6B7280] dark:text-[#9CA3AF] font-bold uppercase tracking-widest transition-colors">Past 7 Days</p>
          </div>
        </div>
        <div className="h-44 w-full -ml-4">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data}>
              <defs>
                <linearGradient id="colorMood" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#4CB8A4" stopOpacity={0.2}/>
                  <stop offset="95%" stopColor="#4CB8A4" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <XAxis dataKey="name" stroke="#6B7280" fontSize={10} axisLine={false} tickLine={false} dy={10} />
              <Tooltip contentStyle={{ borderRadius: '16px', border: 'none', backgroundColor: '#1E293B', color: '#E5E7EB', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }} />
              <Area type="monotone" dataKey="mood" stroke="#4CB8A4" strokeWidth={3} fill="url(#colorMood)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </section>

      {/* AI Insight Cards Section */}
      <section className="space-y-6">
        <div className="flex items-center justify-between px-2">
           <h3 className="font-semibold text-[#1F2933] dark:text-[#E5E7EB] text-xl transition-colors">AI Insights</h3>
           <span className="text-[9px] font-bold text-[#6B7280] dark:text-[#9CA3AF] uppercase tracking-widest">Mock Demo</span>
        </div>
        
        <div className="space-y-4">
          {mockInsights.map((insight) => (
            <div key={insight.id} className="bg-white dark:bg-[#1E293B] border border-slate-100 dark:border-slate-800 p-6 rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.02)] transition-all animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <span className="text-xl">{insight.icon}</span>
                  <h4 className="text-sm font-semibold text-[#1F2933] dark:text-[#E5E7EB]">AI Insight</h4>
                </div>
                <span className="text-[9px] font-bold text-[#6B7280] dark:text-[#9CA3AF] uppercase tracking-wider">Pattern Found</span>
              </div>
              <p className="text-[#1F2933] dark:text-[#E5E7EB] text-sm leading-relaxed font-normal mb-5">
                {insight.content}
              </p>
              <div className="h-px bg-slate-100 dark:bg-slate-800 w-full mb-4"></div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold text-[#4CB8A4] uppercase tracking-widest">Try this:</span>
                <span className="text-xs text-[#6B7280] dark:text-[#9CA3AF] font-medium">{insight.suggestion}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-white dark:bg-[#1E293B] border border-transparent dark:border-slate-800 rounded-[2rem] p-7 shadow-[0_8px_20px_rgb(0,0,0,0.02)] dark:shadow-none transition-colors">
        <div className="flex justify-between items-baseline mb-8 px-1">
          <h3 className="font-semibold text-[#1F2933] dark:text-[#E5E7EB] text-lg transition-colors">Activity</h3>
          <span className="text-[9px] text-[#4CB8A4] font-bold uppercase tracking-widest bg-[#A8E6CF]/10 px-3 py-1 rounded-full border border-[#A8E6CF]/30 transition-colors">+12% vs last week</span>
        </div>
        <div className="h-44 w-full -ml-4">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data}>
              <XAxis dataKey="name" stroke="#6B7280" fontSize={10} axisLine={false} tickLine={false} dy={10} />
              <Bar dataKey="steps" fill="#6EC1E4" radius={[8, 8, 8, 8]} barSize={20} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </section>
    </div>
  );
};

export default InsightsScreen;
