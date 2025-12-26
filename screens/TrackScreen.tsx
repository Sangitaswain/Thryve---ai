
import React, { useState } from 'react';

const moods = [
  { emoji: '😔', label: 'Low', activeColor: 'bg-[#FF8A80]/10 border-[#FF8A80] text-[#FF8A80]' },
  { emoji: '😐', label: 'Okay', activeColor: 'bg-[#6EC1E4]/10 border-[#6EC1E4] text-[#6EC1E4]' },
  { emoji: '🙂', label: 'Good', activeColor: 'bg-[#A8E6CF]/10 border-[#A8E6CF] text-[#4CB8A4]' },
  { emoji: '😊', label: 'Great', activeColor: 'bg-[#A8E6CF]/20 border-[#4CB8A4] text-[#4CB8A4]' },
  { emoji: '🤩', label: 'Radiant', activeColor: 'bg-[#4CB8A4]/20 border-[#4CB8A4] text-[#4CB8A4]' },
];

const TrackScreen: React.FC = () => {
  const [selectedMood, setSelectedMood] = useState<number | null>(null);
  const [sleepHours, setSleepHours] = useState(7);
  const [waterAmount, setWaterAmount] = useState(1250);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const addWater = (amount: number) => setWaterAmount(prev => Math.max(0, prev + amount));

  const handleComplete = () => {
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    }, 1200);
  };

  if (showSuccess) {
    return (
      <div className="p-6 pt-12 flex flex-col items-center justify-center min-h-[80vh] text-center animate-in zoom-in-95 duration-500">
        <div className="w-32 h-32 bg-[#A8E6CF]/20 rounded-[2.5rem] flex items-center justify-center text-6xl shadow-xl shadow-[#A8E6CF]/10 mb-8 animate-bounce">
          ✨
        </div>
        <h2 className="text-[28px] font-semibold text-[#1F2933] tracking-tight mb-2">Well Logged!</h2>
        <p className="text-[#6B7280] font-normal leading-relaxed px-8">
          Your entry is saved. Consistency is the key to thriving.
        </p>
        <button 
          onClick={() => setShowSuccess(false)}
          className="mt-10 text-[#4CB8A4] font-bold text-[10px] uppercase tracking-[0.3em] bg-[#4CB8A4]/10 px-6 py-3 rounded-full"
        >
          Dismiss
        </button>
      </div>
    );
  }

  return (
    <div className="p-6 pt-12 space-y-10 pb-32">
      <header className="animate-in fade-in duration-500">
        <h1 className="text-[28px] font-semibold text-[#1F2933] tracking-tight leading-tight">Daily Log</h1>
        <p className="text-[#6B7280] text-sm font-normal mt-1">Check-in with yourself.</p>
      </header>

      <section className="space-y-4">
        <label className="text-[10px] font-bold text-[#6B7280] uppercase tracking-[0.2em] ml-2">How are you feeling?</label>
        <div className="flex justify-between items-center gap-2">
          {moods.map((m, idx) => (
            <button
              key={idx}
              onClick={() => setSelectedMood(idx)}
              className={`flex-1 flex flex-col items-center gap-2 p-4 rounded-3xl transition-all border-2 active:scale-90 ${
                selectedMood === idx ? m.activeColor : 'border-transparent bg-white text-slate-300'
              }`}
            >
              <span className="text-3xl">{m.emoji}</span>
              <span className="text-[9px] font-bold uppercase tracking-widest">{m.label}</span>
            </button>
          ))}
        </div>
      </section>

      <section className="bg-white p-7 rounded-[2rem] shadow-[0_8px_20px_rgb(0,0,0,0.02)] space-y-5">
        <div className="flex justify-between items-center px-1">
          <label className="text-[10px] font-bold text-[#6B7280] uppercase tracking-[0.2em]">Sleep Quality</label>
          <span className="text-[#4CB8A4] font-bold text-lg">{sleepHours} hrs</span>
        </div>
        <input 
          type="range" min="0" max="12" step="0.5" value={sleepHours}
          onChange={(e) => setSleepHours(parseFloat(e.target.value))}
          className="w-full h-2 bg-slate-100 rounded-full appearance-none cursor-pointer accent-[#4CB8A4]"
        />
      </section>

      <section className="bg-white p-7 rounded-[2rem] shadow-[0_8px_20px_rgb(0,0,0,0.02)] space-y-6">
        <div className="flex justify-between items-end px-1">
          <div>
            <label className="text-[10px] font-bold text-[#6B7280] uppercase tracking-[0.2em]">Hydration</label>
            <div className="flex items-baseline gap-1 mt-1">
              <span className="text-4xl font-bold text-[#1F2933]">{(waterAmount / 1000).toFixed(1)}</span>
              <span className="text-[#6B7280] font-bold text-sm uppercase">Liters</span>
            </div>
          </div>
          <div className="w-24 h-2 bg-slate-100 rounded-full overflow-hidden">
             <div className="bg-[#6EC1E4] h-full transition-all duration-700" style={{ width: `${Math.min(100, (waterAmount / 2500) * 100)}%` }}></div>
          </div>
        </div>
        <div className="flex gap-3">
          <button onClick={() => addWater(250)} className="flex-1 bg-[#F7F9FB] py-4 rounded-2xl text-[#6EC1E4] font-bold text-[10px] uppercase tracking-widest active:scale-95 transition-all">+ 250ml</button>
          <button onClick={() => addWater(500)} className="flex-1 bg-[#F7F9FB] py-4 rounded-2xl text-[#6EC1E4] font-bold text-[10px] uppercase tracking-widest active:scale-95 transition-all">+ 500ml</button>
        </div>
      </section>

      <div className="pt-4">
        <button 
          onClick={handleComplete}
          disabled={isSubmitting}
          className="w-full bg-[#4CB8A4] text-white py-5 rounded-full font-bold text-lg shadow-lg shadow-[#4CB8A4]/20 active:scale-[0.98] transition-all flex items-center justify-center gap-3 disabled:opacity-70"
        >
          {isSubmitting ? 'Syncing...' : 'Complete Daily Log'}
        </button>
      </div>
    </div>
  );
};

export default TrackScreen;
