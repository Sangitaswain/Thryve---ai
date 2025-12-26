
import React from 'react';
import { 
  AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, 
  BarChart, Bar, LineChart, Line, CartesianGrid 
} from 'recharts';

const data = [
  { name: 'Mon', mood: 6, sleep: 7.2, steps: 4200 },
  { name: 'Tue', mood: 5, sleep: 6.8, steps: 5500 },
  { name: 'Wed', mood: 8, sleep: 8.0, steps: 8200 },
  { name: 'Thu', mood: 7, sleep: 7.5, steps: 6100 },
  { name: 'Fri', mood: 6, sleep: 6.5, steps: 9500 },
  { name: 'Sat', mood: 9, sleep: 9.0, steps: 3200 },
  { name: 'Sun', mood: 8, sleep: 8.5, steps: 4800 },
];

const InsightsScreen: React.FC = () => {
  return (
    <div className="p-6 pt-12 space-y-8 pb-24 animate-in fade-in duration-700">
      <header>
        <h1 className="text-2xl font-black text-slate-900 tracking-tight">Wellness Trends</h1>
        <p className="text-slate-500 text-sm font-medium">Data-driven paths to a better you.</p>
      </header>

      {/* Weekly Mood Flow */}
      <section className="bg-white rounded-[2rem] p-6 border border-slate-100 shadow-sm">
        <div className="flex justify-between items-center mb-6">
          <h3 className="font-bold text-slate-800 flex items-center gap-2">
             <span className="text-xl">✨</span>
             Mood Flow
          </h3>
          <span className="text-[10px] font-bold text-rose-500 bg-rose-50 px-2 py-1 rounded-full uppercase">Overall: Radiant</span>
        </div>
        <div className="h-48 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data}>
              <defs>
                <linearGradient id="colorMood" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.2}/>
                  <stop offset="95%" stopColor="#f43f5e" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <XAxis dataKey="name" stroke="#cbd5e1" fontSize={10} axisLine={false} tickLine={false} />
              <Tooltip 
                contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)', fontSize: '12px' }}
                cursor={{ stroke: '#f43f5e', strokeWidth: 1 }}
              />
              <Area type="monotone" dataKey="mood" stroke="#f43f5e" strokeWidth={3} fillOpacity={1} fill="url(#colorMood)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </section>

      {/* Sleep vs Mood Comparison */}
      <section className="bg-indigo-900 rounded-[2rem] p-6 text-white shadow-xl shadow-indigo-100">
        <div className="mb-4">
          <h3 className="font-bold text-lg">Sleep vs. Mood</h3>
          <p className="text-indigo-300 text-xs">Visualizing the correlation this week</p>
        </div>
        <div className="h-40 w-full mb-4">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
              <XAxis dataKey="name" hide />
              <Tooltip 
                contentStyle={{ backgroundColor: '#1e1b4b', border: 'none', borderRadius: '12px' }}
                itemStyle={{ fontSize: '10px' }}
              />
              <Line type="monotone" dataKey="sleep" stroke="#818cf8" strokeWidth={2} dot={{ r: 4, fill: '#818cf8' }} name="Sleep Hrs" />
              <Line type="monotone" dataKey="mood" stroke="#fbbf24" strokeWidth={2} dot={{ r: 4, fill: '#fbbf24' }} name="Mood Index" />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <div className="bg-white/10 rounded-2xl p-4">
           <p className="text-sm font-medium leading-relaxed">
             <span className="text-yellow-400">Pro Tip:</span> Your mood peaked on Saturday after 9 hours of sleep. Quality rest directly fuels your happiness.
           </p>
        </div>
      </section>

      {/* Activity Bar Chart */}
      <section className="bg-white rounded-[2rem] p-6 border border-slate-100 shadow-sm">
        <h3 className="font-bold text-slate-800 mb-6 flex items-center gap-2">
           <span className="text-xl">🏃</span>
           Activity Levels
        </h3>
        <div className="h-44 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data}>
              <XAxis dataKey="name" stroke="#cbd5e1" fontSize={10} axisLine={false} tickLine={false} />
              <Tooltip 
                cursor={{fill: '#f8fafc'}}
                contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
              />
              <Bar dataKey="steps" fill="#10b981" radius={[8, 8, 8, 8]} barSize={20} />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="mt-6 flex justify-between gap-4">
           <div className="flex-1 bg-emerald-50 rounded-2xl p-3">
              <p className="text-[10px] text-emerald-600 font-bold uppercase">Avg Steps</p>
              <p className="text-lg font-bold text-emerald-900">5,871</p>
           </div>
           <div className="flex-1 bg-slate-50 rounded-2xl p-3">
              <p className="text-[10px] text-slate-400 font-bold uppercase">Total Dist</p>
              <p className="text-lg font-bold text-slate-900">24.2<span className="text-xs ml-1">km</span></p>
           </div>
        </div>
      </section>

      {/* Insight Cards */}
      <section className="space-y-4">
        <h3 className="font-bold text-slate-800 text-lg">Smart Insights</h3>
        
        <div className="bg-white border border-slate-100 p-5 rounded-3xl flex items-start gap-4 shadow-sm group hover:border-indigo-200 transition-colors">
          <div className="w-12 h-12 rounded-2xl bg-indigo-50 flex items-center justify-center text-xl shrink-0 group-hover:scale-110 transition-transform">
            ⚡
          </div>
          <div>
            <h4 className="font-bold text-slate-800 text-sm">Consistent Hydration</h4>
            <p className="text-slate-500 text-xs leading-relaxed mt-1">
              On days you logged 2L+ of water, your fatigue levels dropped by 15%. Keep it up!
            </p>
          </div>
        </div>

        <div className="bg-white border border-slate-100 p-5 rounded-3xl flex items-start gap-4 shadow-sm group hover:border-emerald-200 transition-colors">
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 flex items-center justify-center text-xl shrink-0 group-hover:scale-110 transition-transform">
            📈
          </div>
          <div>
            <h4 className="font-bold text-slate-800 text-sm">Weekend Recovery</h4>
            <p className="text-slate-500 text-xs leading-relaxed mt-1">
              Your "Sleep Quality" score is 30% higher on weekends. Consider an earlier bedtime on Thursdays to bridge the gap.
            </p>
          </div>
        </div>

        <div className="bg-amber-50 border border-amber-100 p-5 rounded-3xl flex items-start gap-4 shadow-sm">
          <div className="w-12 h-12 rounded-2xl bg-amber-100 flex items-center justify-center text-xl shrink-0">
            🧩
          </div>
          <div>
            <h4 className="font-bold text-amber-900 text-sm">Missing Pattern</h4>
            <p className="text-amber-700/70 text-xs leading-relaxed mt-1">
              You haven't logged your mood for 2 days. Completing your logs helps Thryve AI provide better advice!
            </p>
          </div>
        </div>
      </section>

      <div className="text-center">
        <button className="text-indigo-600 font-bold text-sm hover:underline">Download Weekly Report (PDF)</button>
      </div>
    </div>
  );
};

export default InsightsScreen;
