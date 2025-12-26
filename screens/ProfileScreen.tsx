
import React from 'react';

const ProfileScreen: React.FC = () => {
  return (
    <div className="p-6 pt-12 space-y-8 pb-24 animate-in fade-in duration-500">
      {/* Header / Avatar Section */}
      <header className="flex flex-col items-center text-center">
        <div className="relative mb-4 group">
          <div className="w-28 h-28 rounded-[2.5rem] bg-indigo-50 border-4 border-white shadow-xl overflow-hidden flex items-center justify-center">
            <img 
              src="https://api.dicebear.com/7.x/avataaars/svg?seed=Alex" 
              alt="Profile" 
              className="w-full h-full object-cover"
            />
          </div>
          <button className="absolute -bottom-1 -right-1 w-10 h-10 bg-indigo-600 rounded-2xl border-4 border-white flex items-center justify-center text-white shadow-lg shadow-indigo-200 hover:bg-indigo-700 transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
          </button>
        </div>
        <h1 className="text-2xl font-black text-slate-900 tracking-tight">Alex Thompson</h1>
        <p className="text-slate-400 text-sm font-medium">Joined January 2024</p>
      </header>

      {/* Wellness Stats Summary */}
      <section className="bg-white rounded-[2rem] p-6 border border-slate-100 shadow-sm flex justify-around items-center">
        <div className="text-center space-y-1">
          <p className="text-indigo-600 text-2xl font-black">14</p>
          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Day Streak</p>
        </div>
        <div className="w-px h-8 bg-slate-100"></div>
        <div className="text-center space-y-1">
          <p className="text-emerald-600 text-2xl font-black">42</p>
          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Days Active</p>
        </div>
        <div className="w-px h-8 bg-slate-100"></div>
        <div className="text-center space-y-1">
          <p className="text-rose-600 text-2xl font-black">89%</p>
          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Goal Rate</p>
        </div>
      </section>

      {/* Settings Options List */}
      <section className="space-y-4">
        <h3 className="text-slate-800 font-bold text-lg ml-2">Preferences</h3>
        <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
          <SettingsItem 
            icon={<svg className="w-5 h-5 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>} 
            label="Notifications" 
            description="Manage your daily reminders"
          />
          <SettingsItem 
            icon={<svg className="w-5 h-5 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 3v1m0 16v1m9-9h-1M4 9H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" /></svg>} 
            label="Theme" 
            description="Light mode enabled"
          />
          <SettingsItem 
            icon={<svg className="w-5 h-5 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>} 
            label="Privacy" 
            description="Control your data visibility"
          />
          <SettingsItem 
            icon={<svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>} 
            label="About Thryve" 
            description="Version 1.2.4 (Latest)"
            border={false}
          />
        </div>
      </section>

      {/* Support Section */}
      <section className="space-y-4">
        <h3 className="text-slate-800 font-bold text-lg ml-2">Support</h3>
        <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
          <SettingsItem 
            icon={<svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>} 
            label="Help Center" 
          />
          <SettingsItem 
            icon={<svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" /></svg>} 
            label="Send Feedback" 
            border={false}
          />
        </div>
      </section>

      {/* Action Button */}
      <div className="pt-4">
        <button className="w-full bg-rose-50 text-rose-600 font-bold py-5 rounded-[2rem] border border-rose-100 hover:bg-rose-100 transition-colors active:scale-[0.98]">
          Sign Out
        </button>
        <p className="text-center text-[10px] text-slate-300 font-bold uppercase tracking-widest mt-6">
          Thryve Health • Encrypted & Private
        </p>
      </div>
    </div>
  );
};

interface SettingsItemProps {
  icon: React.ReactNode;
  label: string;
  description?: string;
  border?: boolean;
}

const SettingsItem: React.FC<SettingsItemProps> = ({ icon, label, description, border = true }) => (
  <button className={`w-full flex items-center justify-between p-5 hover:bg-slate-50 transition-colors ${border ? 'border-b border-slate-50' : ''}`}>
    <div className="flex items-center gap-4">
      <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center">
        {icon}
      </div>
      <div className="text-left">
        <span className="text-sm font-bold text-slate-800 block">{label}</span>
        {description && <span className="text-[10px] text-slate-400 font-medium uppercase tracking-wider">{description}</span>}
      </div>
    </div>
    <svg className="w-5 h-5 text-slate-200" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7" /></svg>
  </button>
);

export default ProfileScreen;
