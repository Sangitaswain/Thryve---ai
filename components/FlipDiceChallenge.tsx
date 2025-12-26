
import React, { useState, useRef } from 'react';

const challenges = [
  "Drink 2 glasses of water 💧",
  "Write one short journal entry ✍️",
  "Take a 5-minute walk 🚶‍♀️",
  "Do 3 deep breaths 🧘‍♂️",
  "Stretch for 2 minutes 🤸",
  "Eat one serving of fruit 🍏",
  "Stand up and move for 2 mins 🧘",
  "Write down one thing you're grateful for 🙏",
  "Avoid screens for 15 minutes 📵",
  "Compliment someone today 😊"
];

// Dot positions for 3x3 grid
const pips = {
  1: [4],
  2: [0, 8],
  3: [0, 4, 8],
  4: [0, 2, 6, 8],
  5: [0, 2, 4, 6, 8],
  6: [0, 3, 6, 2, 5, 8],
};

const DiceFace: React.FC<{ value: number; transform: string; bgColor: string }> = ({ value, transform, bgColor }) => (
  <div 
    className="absolute inset-0 rounded-2xl flex items-center justify-center border border-black/5 shadow-inner"
    style={{ 
      transform, 
      backfaceVisibility: 'hidden',
      backgroundColor: bgColor,
    }}
  >
    {/* Matte finish overlay */}
    <div className="absolute inset-0 rounded-2xl shadow-[inset_0_2px_12px_rgba(0,0,0,0.08)] pointer-events-none" />
    
    <div className="grid grid-cols-3 grid-rows-3 w-12 h-12 p-1 relative z-10">
      {Array.from({ length: 9 }).map((_, i) => (
        <div key={i} className="flex items-center justify-center">
          {pips[value as keyof typeof pips].includes(i) && (
            <div className="w-2.5 h-2.5 bg-white rounded-full shadow-sm" />
          )}
        </div>
      ))}
    </div>
  </div>
);

const FlipDiceChallenge: React.FC = () => {
  const [currentChallenge, setCurrentChallenge] = useState<string | null>(null);
  const [isRolling, setIsRolling] = useState(false);
  const [rotation, setRotation] = useState({ x: 20, y: -25, z: 0 });
  const audioContextRef = useRef<AudioContext | null>(null);

  const playRollSound = () => {
    try {
      if (!audioContextRef.current) {
        audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      }
      const ctx = audioContextRef.current;
      
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'triangle'; 
      osc.frequency.setValueAtTime(220, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(80, ctx.currentTime + 0.12);

      gain.gain.setValueAtTime(0.05, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.12);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 0.12);
    } catch (e) {
      console.warn("Audio feedback failed:", e);
    }
  };

  const rollDice = () => {
    if (isRolling) return;

    setIsRolling(true);
    setCurrentChallenge(null);
    playRollSound();

    // Fun tumble: random multiples of 90 degrees
    const extraX = (Math.floor(Math.random() * 5) + 6) * 90;
    const extraY = (Math.floor(Math.random() * 5) + 6) * 90;
    const extraZ = (Math.floor(Math.random() * 3) + 3) * 90;

    setRotation(prev => ({
      x: prev.x + extraX,
      y: prev.y + extraY,
      z: prev.z + extraZ
    }));

    // Tumble duration matching the CSS transition
    setTimeout(() => {
      setIsRolling(false);
      setCurrentChallenge(challenges[Math.floor(Math.random() * challenges.length)]);
      
      if ('vibrate' in navigator) {
        navigator.vibrate(25);
      }
    }, 850);
  };

  return (
    <div className="relative bg-white dark:bg-[#1E293B] border border-slate-100 dark:border-slate-800 rounded-[2.5rem] p-8 shadow-[0_4px_30px_rgba(0,0,0,0.02)] transition-all overflow-hidden group">
      <div className="flex flex-col items-center text-center space-y-1 mb-8">
        <h4 className="text-base font-semibold text-[#1F2933] dark:text-[#E5E7EB] tracking-tight transition-colors">Habit Dice</h4>
        <p className="text-[10px] font-bold text-[#3FB7A3] uppercase tracking-[0.2em] transition-colors">Tap the colorful dice to roll</p>
      </div>

      <div className="flex flex-col items-center justify-center py-4 min-h-[260px]">
        {/* Dice Container with Perspective */}
        <div style={{ perspective: '1200px' }} className="mb-14 relative">
          <div 
            onClick={rollDice}
            className={`relative w-20 h-20 transition-transform duration-[850ms] cursor-pointer ${isRolling ? 'scale-110' : 'scale-100 active:scale-90'}`}
            style={{ 
              transformStyle: 'preserve-3d',
              transform: `rotateX(${rotation.x}deg) rotateY(${rotation.y}deg) rotateZ(${rotation.z}deg)`,
              // Fun bounce-back settle effect
              transitionTimingFunction: 'cubic-bezier(0.175, 0.885, 0.32, 1.15)'
            }}
          >
            {/* 6 Multi-color Matte Faces */}
            <DiceFace value={1} bgColor="#3FB7A3" transform="translateZ(40px)" />
            <DiceFace value={6} bgColor="#6EC1E4" transform="rotateY(180deg) translateZ(40px)" />
            <DiceFace value={3} bgColor="#F6D365" transform="rotateY(90deg) translateZ(40px)" />
            <DiceFace value={4} bgColor="#F4A261" transform="rotateY(-90deg) translateZ(40px)" />
            <DiceFace value={2} bgColor="#A8E6CF" transform="rotateX(90deg) translateZ(40px)" />
            <DiceFace value={5} bgColor="#94A3B8" transform="rotateX(-90deg) translateZ(40px)" />
          </div>
          
          {/* Natural Weight Shadow */}
          <div className={`w-14 h-3 bg-black/5 dark:bg-black/40 blur-lg rounded-full mt-16 mx-auto transition-all duration-500 ${isRolling ? 'scale-150 opacity-10 translate-y-3' : 'scale-100 opacity-60 translate-y-0'}`} />
        </div>

        {/* Result Area */}
        <div className="h-24 flex flex-col items-center justify-center text-center px-4 w-full">
          {isRolling ? (
            <p className="text-[11px] font-bold text-[#3FB7A3] uppercase tracking-[0.3em] animate-pulse">Tumbling...</p>
          ) : currentChallenge ? (
            <div className="animate-in fade-in zoom-in-95 duration-500 flex flex-col items-center space-y-5 w-full">
              <p className="text-lg font-medium text-[#1F2933] dark:text-[#E5E7EB] max-w-[300px] leading-snug transition-colors">
                {currentChallenge}
              </p>
              <button 
                onClick={rollDice}
                className="group w-full max-w-[180px] bg-[#3FB7A3] text-white text-[11px] font-bold uppercase tracking-[0.2em] py-4 rounded-2xl shadow-lg shadow-[#3FB7A3]/20 active:scale-95 transition-all flex items-center justify-center gap-2"
              >
                <span>Roll Again</span>
                <span className="group-hover:rotate-12 transition-transform">🎲</span>
              </button>
            </div>
          ) : (
            <button 
              onClick={rollDice}
              className="group w-full max-w-[200px] bg-[#3FB7A3] text-white text-[11px] font-bold uppercase tracking-[0.2em] py-4.5 rounded-2xl shadow-lg shadow-[#3FB7A3]/20 active:scale-95 transition-all flex items-center justify-center gap-3"
            >
              <span>Roll the Dice</span>
              <span className="group-hover:translate-y-[-2px] transition-transform">🎲</span>
            </button>
          )}
        </div>
      </div>

      <div className="mt-4 pt-6 border-t border-slate-50 dark:border-slate-800 text-center opacity-60 transition-colors">
        <p className="text-[9px] font-bold text-[#6B7280] dark:text-[#9CA3AF] uppercase tracking-[0.2em]">
          Gamify your wellness journey
        </p>
      </div>
    </div>
  );
};

export default FlipDiceChallenge;
