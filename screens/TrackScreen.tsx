
import React, { useState } from 'react';

const moods = [
  { emoji: '😔', label: 'Low', color: 'bg-slate-100' },
  { emoji: '😐', label: 'Okay', color: 'bg-blue-50' },
  { emoji: '🙂', label: 'Good', color: 'bg-emerald-50' },
  { emoji: '😊', label: 'Great', color: 'bg-yellow-50' },
  { emoji: '🤩', label: 'Radiant', color: 'bg-rose-50' },
];

const TrackScreen: React.FC = () => {
  // Local state for UI feedback (non-persistent)
  const [selectedMood, setSelectedMood] = useState<number | null>(null);
  const [sleepHours, setSleepHours] = useState(7);
  const [waterAmount, setWaterAmount] = useState(1250); // in ml
  const [activityMinutes, setActivityMinutes] = useState('30');
  const [activityType, setActivityType] = useState('Walking');
  const [journalText, setJournalText] = useState('');

  const addWater = (amount: number) => {
    setWaterAmount(prev => Math.max(0, prev + amount));
  };

  return (
    <div className="p-6 pt-12 space-y-8 pb-28 animate-in fade-in duration-500">
      <header>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Log Your Day</h1>
        <p className="text-slate-500 text-sm">Small actions lead to big changes.</p>
      </header>

      {/* Mood Selector */}
      <section className="space-y-4">
        <label className="text-sm font-bold text-slate-800 uppercase tracking-wider">How are you feeling?</label>
        <div className="flex justify-between items-center gap-2">
          {moods.map((m, idx) => (
            <button
              key={idx}
              onClick={() => setSelectedMood(idx)}
              className={`flex-1 flex flex-col items-center gap-2 p-3 rounded-2xl transition-all border-2 ${
                selectedMood === idx 
                ? 'border-indigo-500 bg-indigo-50 shadow-sm scale-105' 
                : 'border-transparent bg-white shadow-sm'
              }`}
            >
              <span className="text-2xl">{m.emoji}</span>
              <span className={`text-[10px] font-bold ${selectedMood === idx ? 'text-indigo-600' : 'text-slate-400'}`}>
                {m.label}
              </span>
            </button>
          ))}
        </div>
      </section>

      {/* Sleep Slider */}
      <section className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm space-y-4">
        <div className="flex justify-between items-center">
          <label className="text-sm font-bold text-slate-800 uppercase tracking-wider">Sleep Quality</label>
          <span className="text-indigo-600 font-bold">{sleepHours} Hours</span>
        </div>
        <input 
          type="range" 
          min="0" 
          max="12" 
          step="0.5"
          value={sleepHours}
          onChange={(e) => setSleepHours(parseFloat(e.target.value))}
          className="w-full h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-indigo-600"
        />
        <div className="flex justify-between text-[10px] text-slate-400 font-bold uppercase">
          <span>Restless</span>
          <span>Deep Rest</span>
        </div>
      </section>

      {/* Activity Input */}
      <section className="space-y-4">
        <label className="text-sm font-bold text-slate-800 uppercase tracking-wider">Activity</label>
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
            <p className="text-[10px] text-slate-400 font-bold uppercase mb-2">Duration (Min)</p>
            <input 
              type="number" 
              value={activityMinutes}
              onChange={(e) => setActivityMinutes(e.target.value)}
              className="w-full text-xl font-bold text-slate-800 outline-none bg-transparent"
              placeholder="0"
            />
          </div>
          <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
            <p className="text-[10px] text-slate-400 font-bold uppercase mb-2">Type</p>
            <select 
              value={activityType}
              onChange={(e) => setActivityType(e.target.value)}
              className="w-full text-sm font-bold text-slate-800 outline-none bg-transparent border-none appearance-none"
            >
              <option>Walking</option>
              <option>Running</option>
              <option>Yoga</option>
              <option>Cycling</option>
              <option>Gym</option>
              <option>Other</option>
            </select>
          </div>
        </div>
      </section>

      {/* Water Intake */}
      <section className="bg-blue-50/50 p-6 rounded-[2rem] border border-blue-100 shadow-sm space-y-6">
        <div className="flex justify-between items-end">
          <div>
            <label className="text-sm font-bold text-blue-800 uppercase tracking-wider">Hydration</label>
            <div className="flex items-baseline gap-1">
              <span className="text-3xl font-black text-blue-900">{(waterAmount / 1000).toFixed(1)}</span>
              <span className="text-blue-600 font-bold text-sm">Liters</span>
            </div>
          </div>
          <div className="text-right">
            <p className="text-[10px] text-blue-400 font-bold uppercase">Goal: 2.5L</p>
            <div className="w-24 h-2 bg-blue-100 rounded-full mt-1 overflow-hidden">
               <div className="bg-blue-500 h-full transition-all duration-500" style={{ width: `${Math.min(100, (waterAmount / 2500) * 100)}%` }}></div>
            </div>
          </div>
        </div>
        
        <div className="flex gap-3">
          <button 
            onClick={() => addWater(250)}
            className="flex-1 bg-white py-3 rounded-2xl text-blue-600 font-bold text-xs shadow-sm active:scale-95 transition-all border border-blue-100"
          >
            + 250ml
          </button>
          <button 
            onClick={() => addWater(500)}
            className="flex-1 bg-white py-3 rounded-2xl text-blue-600 font-bold text-xs shadow-sm active:scale-95 transition-all border border-blue-100"
          >
            + 500ml
          </button>
          <button 
            onClick={() => setWaterAmount(0)}
            className="w-12 bg-white/50 flex items-center justify-center rounded-2xl text-blue-400 text-sm border border-blue-100"
          >
            ↺
          </button>
        </div>
      </section>

      {/* Journaling */}
      <section className="space-y-4">
        <label className="text-sm font-bold text-slate-800 uppercase tracking-wider">Mindful Journal</label>
        <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm p-4 overflow-hidden focus-within:border-indigo-300 transition-colors">
          <textarea 
            className="w-full min-h-[120px] bg-transparent outline-none text-slate-700 text-sm leading-relaxed resize-none"
            placeholder="What made you smile today? Any challenges you overcame?"
            value={journalText}
            onChange={(e) => setJournalText(e.target.value)}
          />
        </div>
      </section>

      {/* Save Button */}
      <button className="w-full bg-slate-900 text-white py-5 rounded-[2rem] font-bold text-lg shadow-xl shadow-slate-200 active:scale-95 transition-all flex items-center justify-center gap-3">
        <span>Complete Entry</span>
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
        </svg>
      </button>

      <p className="text-center text-[10px] text-slate-400 font-medium pb-4 uppercase tracking-widest">
        Entry #142 • Locked & Secure
      </p>
    </div>
  );
};

export default TrackScreen;
