import React, { useState } from 'react';
import { View, TouchableOpacity, Text, SafeAreaView, StatusBar, Dimensions, StyleSheet } from 'react-native';
import { Home, PlusSquare, BarChart2, User, MessageCircle } from 'lucide-react-native';
import { TabType } from './types';
import HomeScreen from './screens/HomeScreen';
import TrackScreen from './screens/TrackScreen';
import InsightsScreen from './screens/InsightsScreen';
import ProfileScreen from './screens/ProfileScreen';
import ChatScreen from './screens/ChatScreen';
import * as Haptics from 'expo-haptics';

const { width } = Dimensions.get('window');

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>('home');
  const [isDarkMode, setIsDarkMode] = useState(false);

  const toggleTheme = () => {
    if (Haptics?.impactAsync) Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => { });
    setIsDarkMode(!isDarkMode);
  };

  const handleTabChange = (tab: TabType) => {
    if (Haptics?.impactAsync) Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium).catch(() => { });
    setActiveTab(tab);
  };

  const renderScreen = () => {
    switch (activeTab) {
      case 'home': return <HomeScreen onNavigateToChat={() => handleTabChange('chat')} isDarkMode={isDarkMode} toggleTheme={toggleTheme} />;
      case 'track': return <TrackScreen />;
      case 'insights': return <InsightsScreen />;
      case 'profile': return <ProfileScreen isDarkMode={isDarkMode} toggleTheme={toggleTheme} />;
      case 'chat': return <ChatScreen onBack={() => handleTabChange('home')} isDarkMode={isDarkMode} />;
      default: return <HomeScreen onNavigateToChat={() => handleTabChange('chat')} isDarkMode={isDarkMode} toggleTheme={toggleTheme} />;
    }
  };

  const bgColor = isDarkMode ? '#0F172A' : '#EEF2F6';

  return (
    <View style={[styles.container, { backgroundColor: bgColor }]}>
      <SafeAreaView style={styles.safeArea}>
        <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
        <View style={styles.content}>
          {renderScreen()}
        </View>

        {activeTab !== 'chat' && (
          <View style={[styles.tabBar, { backgroundColor: isDarkMode ? '#0F172A' : '#FFFFFF', borderTopColor: isDarkMode ? '#1E293B' : '#F1F5F9' }]}>
            <TabButton
              isActive={activeTab === 'home'}
              onClick={() => handleTabChange('home')}
              label="Home"
              Icon={Home}
            />
            <TabButton
              isActive={activeTab === 'track'}
              onClick={() => handleTabChange('track')}
              label="Log"
              Icon={PlusSquare}
            />

            <TouchableOpacity
              onPress={() => handleTabChange('chat')}
              style={[styles.chatFab, { backgroundColor: '#4CB8A4' }]}>
              <MessageCircle color="white" size={28} />
            </TouchableOpacity>

            <TabButton
              isActive={activeTab === 'insights'}
              onClick={() => handleTabChange('insights')}
              label="Stats"
              Icon={BarChart2}
            />
            <TabButton
              isActive={activeTab === 'profile'}
              onClick={() => handleTabChange('profile')}
              label="Profile"
              Icon={User}
            />
          </View>
        )}
      </SafeAreaView>
    </View>
  );
};

const TabButton: React.FC<{ isActive: boolean, onClick: () => void, label: string, Icon: any }> = ({ isActive, onClick, label, Icon }) => (
  <TouchableOpacity onPress={onClick} style={styles.tabButton}>
    <Icon
      size={22}
      color={isActive ? '#4CB8A4' : '#94A3B8'}
      strokeWidth={isActive ? 2.5 : 2}
    />
    <Text style={[styles.tabLabel, { color: isActive ? '#4CB8A4' : '#94A3B8' }]}>
      {label}
    </Text>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  content: {
    flex: 1,
  },
  tabBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    borderTopWidth: 1,
    height: 85,
    elevation: 20, // Critical for Android shadow
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  tabButton: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 10,
  },
  tabLabel: {
    fontSize: 10,
    fontWeight: 'bold',
    marginTop: 4,
  },
  chatFab: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: -45,
    elevation: 8,
    shadowColor: '#4CB8A4',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  }
});

export default App;