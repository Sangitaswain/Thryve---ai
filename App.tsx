
import React, { useState } from 'react';
import { TabType } from './types';
import HomeScreen from './screens/HomeScreen';
import TrackScreen from './screens/TrackScreen';
import InsightsScreen from './screens/InsightsScreen';
import ProfileScreen from './screens/ProfileScreen';
import ChatScreen from './screens/ChatScreen';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>('home');

  const renderScreen = () => {
    switch (activeTab) {
      case 'home': return <HomeScreen onNavigateToChat={() => setActiveTab('chat')} />;
      case 'track': return <TrackScreen />;
      case 'insights': return <InsightsScreen />;
      case 'profile': return <ProfileScreen />;
      case 'chat': return <ChatScreen onBack={() => setActiveTab('home')} />;
      default: return <HomeScreen onNavigateToChat={() => setActiveTab('chat')} />;
    }
  };

  return (
    <div className="flex flex-col h-screen overflow-hidden">
      {/* Content Area */}
      <main className="flex-1 overflow-y-auto pb-20">
        {renderScreen()}
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 max-w-[480px] mx-auto bg-white border-t border-slate-100 flex justify-around items-center py-3 px-2 z-50">
        <TabButton 
          isActive={activeTab === 'home'} 
          onClick={() => setActiveTab('home')} 
          label="Home" 
          icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>} 
        />
        <TabButton 
          isActive={activeTab === 'track'} 
          onClick={() => setActiveTab('track')} 
          label="Track" 
          icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" /></svg>} 
        />
        <TabButton 
          isActive={activeTab === 'chat'} 
          onClick={() => setActiveTab('chat')} 
          label="AI" 
          icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" /></svg>} 
        />
        <TabButton 
          isActive={activeTab === 'insights'} 
          onClick={() => setActiveTab('insights')} 
          label="Stats" 
          icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>} 
        />
        <TabButton 
          isActive={activeTab === 'profile'} 
          onClick={() => setActiveTab('profile')} 
          label="Profile" 
          icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>} 
        />
      </nav>
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
    className={`flex flex-col items-center gap-1 transition-colors ${isActive ? 'text-indigo-600 font-semibold' : 'text-slate-400 hover:text-slate-600'}`}
  >
    {icon}
    <span className="text-[10px] uppercase tracking-wider">{label}</span>
  </button>
);

export default App;
