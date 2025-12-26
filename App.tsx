
import React, { useState } from 'react';
import { TabType } from './types';
import HomeScreen from './screens/HomeScreen';
import TrackScreen from './screens/TrackScreen';
import InsightsScreen from './screens/InsightsScreen';
import ProfileScreen from './screens/ProfileScreen';
import ChatScreen from './screens/ChatScreen';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>('home');
  const [isDarkMode, setIsDarkMode] = useState(false);

  const toggleTheme = () => setIsDarkMode(!isDarkMode);

  const renderScreen = () => {
    switch (activeTab) {
      case 'home': 
        return <div key="home" className="animate-in fade-in slide-in-from-bottom-2 duration-500 bg-[#F7F9FB] dark:bg-[#0F172A]">
          <HomeScreen onNavigateToChat={() => setActiveTab('chat')} isDarkMode={isDarkMode} toggleTheme={toggleTheme} />
        </div>;
      case 'track': 
        return <div key="track" className="animate-in fade-in slide-in-from-bottom-2 duration-500 bg-[#F7F9FB] dark:bg-[#0F172A]">
          <TrackScreen />
        </div>;
      case 'insights': 
        return <div key="insights" className="animate-in fade-in slide-in-from-bottom-2 duration-500 bg-[#F7F9FB] dark:bg-[#0F172A]">
          <InsightsScreen />
        </div>;
      case 'profile': 
        return <div key="profile" className="animate-in fade-in slide-in-from-bottom-2 duration-500 bg-[#F7F9FB] dark:bg-[#0F172A]">
          <ProfileScreen isDarkMode={isDarkMode} toggleTheme={toggleTheme} />
        </div>;
      case 'chat': 
        return <div key="chat" className="animate-in fade-in duration-300 bg-[#F7F9FB] dark:bg-[#0F172A]">
          <ChatScreen onBack={() => setActiveTab('home')} isDarkMode={isDarkMode} />
        </div>;
      default: 
        return <HomeScreen onNavigateToChat={() => setActiveTab('chat')} isDarkMode={isDarkMode} toggleTheme={toggleTheme} />;
    }
  };

  return (
    <div className={isDarkMode ? 'dark' : ''}>
      <div className="flex flex-col h-screen overflow-hidden bg-[#F7F9FB] dark:bg-[#0F172A] text-[#1F2933] dark:text-[#E5E7EB] transition-colors duration-500">
        <main className="flex-1 overflow-y-auto pb-24 scroll-smooth">
          {renderScreen()}
        </main>

        <nav className="fixed bottom-0 left-0 right-0 max-w-[480px] mx-auto bg-white/95 dark:bg-[#1E293B]/95 backdrop-blur-xl border-t border-slate-100 dark:border-slate-800 flex justify-around items-center py-4 px-2 z-50 rounded-t-[2.5rem] shadow-[0_-8px_30px_rgb(0,0,0,0.03)] dark:shadow-none transition-colors duration-500">
          <TabButton 
            isActive={activeTab === 'home'} 
            onClick={() => setActiveTab('home')} 
            label="Home" 
            icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>} 
          />
          <TabButton 
            isActive={activeTab === 'track'} 
            onClick={() => setActiveTab('track')} 
            label="Log" 
            icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" /></svg>} 
          />
          <div className="relative -mt-10">
            <button 
              onClick={() => setActiveTab('chat')}
              className={`w-14 h-14 rounded-full flex items-center justify-center shadow-xl transition-all active:scale-90 ${activeTab === 'chat' ? 'bg-[#4CB8A4] text-white shadow-[#4CB8A4]/40' : 'bg-[#4CB8A4] text-white shadow-[#4CB8A4]/20'}`}
            >
              <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" /></svg>
            </button>
          </div>
          <TabButton 
            isActive={activeTab === 'insights'} 
            onClick={() => setActiveTab('insights')} 
            label="Stats" 
            icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>} 
          />
          <TabButton 
            isActive={activeTab === 'profile'} 
            onClick={() => setActiveTab('profile')} 
            label="Profile" 
            icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>} 
          />
        </nav>
      </div>
    </div>
  );
};

interface TabButtonProps {
  isActive: boolean;
  onClick: () => void;
  label: string;
  icon: React.ReactNode;
}

const TabButton: React.FC<TabButtonProps> = ({ isActive, onClick, label, icon }) => (
  <button 
    onClick={onClick}
    className={`flex flex-col items-center gap-0.5 transition-all active:scale-95 ${isActive ? 'text-[#4CB8A4]' : 'text-[#6B7280] dark:text-[#9CA3AF] hover:text-[#1F2933] dark:hover:text-[#E5E7EB]'}`}
  >
    <div className={`p-1.5 rounded-xl transition-colors ${isActive ? 'bg-[#4CB8A4]/10' : 'bg-transparent'}`}>
      {icon}
    </div>
    <span className={`text-[9px] font-bold uppercase tracking-wider transition-opacity ${isActive ? 'opacity-100' : 'opacity-70'}`}>{label}</span>
  </button>
);

export default App;
