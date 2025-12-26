
import React from 'react';

const ProfileScreen: React.FC = () => {
  return (
    <div className="p-6 pt-12 space-y-8 pb-24 animate-in fade-in duration-500">
      <header className="flex flex-col items-center text-center">
        <div className="relative mb-4">
          <div className="w-28 h-28 rounded-[2.5rem] bg-[#4CB8A4]/10 border-4 border-white shadow-xl overflow-hidden flex items-center justify-center">
            <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Alex" alt="Profile" className="w-full h-full object-cover" />
          </div>
          <button className="absolute -bottom-1 -right-1 w-10 h-10 bg-[#4CB8A4] rounded-2xl border-4 border-white flex items-center justify-center text-white shadow-lg shadow-[#4CB8A4]/20">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
          </button>
        </div>
        <h1 className="text-2xl font-semibold text-[#1F2933] tracking-tight">Alex Thompson</h1>
        <p className="text-[#6B7280] text-sm font-medium">Wellness Enthusiast</p>
      </header>

      <section className="bg-white rounded-[2rem] p-6 shadow-[0_8px_30px_rgb(0,0,0,0.02)] flex justify-around items-center">
        <div className="text-center">
          <p className="text-[#4CB8A4] text-2xl font-bold">14</p>
          <p className="text-[10px] text-[#6B7280] font-bold uppercase tracking-widest">Streak</p>
        </div>
        <div className="w-px h-8 bg-slate-50"></div>
        <div className="text-center">
          <p className="text-[#6EC1E4] text-2xl font-bold">42</p>
          <p className="text-[10px] text-[#6B7280] font-bold uppercase tracking-widest">Active</p>
        </div>
        <div className="w-px h-8 bg-slate-50"></div>
        <div className="text-center">
          <p className="text-[#4CB8A4] text-2xl font-bold">89%</p>
          <p className="text-[10px] text-[#6B7280] font-bold uppercase tracking-widest">Goal</p>
        </div>
      </section>

      <section className="space-y-4">
        <h3 className="text-[#1F2933] font-semibold text-lg ml-2">Settings</h3>
        <div className="bg-white rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.02)] overflow-hidden">
          <SettingsItem 
            icon={<svg className="w-5 h-5 text-[#4CB8A4]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>} 
            label="Notifications" 
            description="Daily wellness nudges"
          />
          <SettingsItem 
            icon={<svg className="w-5 h-5 text-[#6EC1E4]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 3v1m0 16v1m9-9h-1M4 9H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" /></svg>} 
            label="Privacy" 
            description="Secure health data"
            border={false}
          />
        </div>
      </section>

      <div className="pt-4">
        <button className="w-full bg-[#FF8A80]/10 text-[#FF8A80] font-bold py-5 rounded-[2rem] active:scale-[0.98] transition-all">
          Sign Out
        </button>
      </div>
    </div>
  );
};

const SettingsItem: React.FC<{ icon: any, label: string, description: string, border?: boolean }> = ({ icon, label, description, border = true }) => (
  <button className={`w-full flex items-center justify-between p-5 hover:bg-slate-50 transition-colors ${border ? 'border-b border-slate-50' : ''}`}>
    <div className="flex items-center gap-4">
      <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center">{icon}</div>
      <div className="text-left">
        <span className="text-sm font-semibold text-[#1F2933] block">{label}</span>
        <span className="text-[10px] text-[#6B7280] font-bold uppercase tracking-wider">{description}</span>
      </div>
    </div>
    <svg className="w-5 h-5 text-slate-200" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7" /></svg>
  </button>
);

export default ProfileScreen;
