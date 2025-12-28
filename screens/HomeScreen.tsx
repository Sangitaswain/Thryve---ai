
import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator, StyleSheet, Dimensions } from 'react-native';
import { MetricCard, Habit } from '../types';
import * as Haptics from 'expo-haptics';
import { generateDailyStrategy } from '../services/geminiService';
import { Sparkles, CheckCircle2, Circle, ChevronRight, Zap, TrendingUp, TrendingDown } from 'lucide-react-native';
import Animated, { 
  FadeInUp, 
  Layout, 
  useAnimatedStyle, 
  useSharedValue, 
  withSpring,
  withDelay,
  FadeIn
} from 'react-native-reanimated';

const { width } = Dimensions.get('window');

interface HomeScreenProps {
  onNavigateToChat: () => void;
  isDarkMode: boolean;
  toggleTheme: () => void;
}

const wellnessMetrics: MetricCard[] = [
  { title: 'Mood', value: 'Radiant', unit: '', icon: '✨', color: 'bg-teal-50 text-[#4CB8A4]', trend: 'up', trendValue: '12%' },
  { title: 'Sleep', value: '7h 45m', unit: '', icon: '🌙', color: 'bg-blue-50 text-[#6EC1E4]', trend: 'stable' },
  { title: 'Steps', value: '8,432', unit: '', icon: '🏃', color: 'bg-teal-50 text-[#4CB8A4]', trend: 'up', trendValue: '2k' },
  { title: 'Water', value: '1.5', unit: 'L', icon: '💧', color: 'bg-blue-50 text-[#6EC1E4]', trend: 'down', trendValue: '0.5L' },
];

const INITIAL_HABITS: Habit[] = [
  { id: '1', name: 'Morning Sunlight', completed: false, category: 'Circadian', icon: '☀️' },
  { id: '2', name: 'High Protein Breakfast', completed: true, category: 'Nutrition', icon: '🍳' },
  { id: '3', name: '10 min Meditation', completed: false, category: 'Mental', icon: '🧘' },
];

const HomeScreen: React.FC<HomeScreenProps> = ({ onNavigateToChat, isDarkMode, toggleTheme }) => {
  const [habits, setHabits] = useState<Habit[]>(INITIAL_HABITS);
  const [aiInsight, setAiInsight] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  
  const today = new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });
  const completedCount = habits.filter(h => h.completed).length;
  const progressPercent = Math.round((completedCount / habits.length) * 100);
  
  const progressShared = useSharedValue(0);

  useEffect(() => {
    progressShared.value = withSpring(progressPercent / 100, { damping: 15 });
  }, [progressPercent]);

  const toggleHabit = (id: string) => {
    const habit = habits.find(h => h.id === id);
    if (Haptics?.impactAsync) {
      if (!habit?.completed) {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});
      } else {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
      }
    }
    setHabits(prev => prev.map(h => h.id === id ? { ...h, completed: !h.completed } : h));
  };

  const handleAnalyze = async () => {
    setIsAnalyzing(true);
    if (Haptics?.notificationAsync) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});
    }
    const result = await generateDailyStrategy({ metrics: wellnessMetrics, habits });
    setAiInsight(result);
    setIsAnalyzing(false);
  };

  const progressStyle = useAnimatedStyle(() => ({
    width: `${progressShared.value * 100}%`,
  }));

  return (
    <ScrollView 
      style={styles.scrollContainer} 
      contentContainerStyle={styles.scrollContent} 
      showsVerticalScrollIndicator={false}
    >
      {/* Header */}
      <Animated.View entering={FadeInUp.delay(100)} className="flex-row justify-between items-start mb-8">
        <View>
          <Text className="text-[#4CB8A4] text-[10px] font-bold uppercase tracking-[3px] mb-1">{today}</Text>
          <Text className="text-3xl font-bold text-slate-900 dark:text-white leading-tight">Good Morning,{'\n'}Alex</Text>
        </View>
        <TouchableOpacity 
          onPress={toggleTheme} 
          style={styles.themeToggle}
          className="bg-white dark:bg-slate-800 shadow-sm"
        >
          <Text style={{ fontSize: 20 }}>{isDarkMode ? '☀️' : '🌙'}</Text>
        </TouchableOpacity>
      </Animated.View>

      {/* Progress Card */}
      <Animated.View entering={FadeInUp.delay(200)} className="bg-[#4CB8A4] rounded-[40px] p-8 mb-8 shadow-2xl overflow-hidden">
        <View className="flex-row items-center justify-between mb-6">
          <View className="flex-1 pr-4">
            <View className="bg-white/20 self-start px-3 py-1 rounded-full mb-3">
              <Text className="text-white text-[8px] font-bold uppercase tracking-wider">Consistency Tracker</Text>
            </View>
            <Text className="text-2xl font-bold text-white mb-1">Thryve Protocol</Text>
            <Text className="text-white/80 text-xs font-medium">
              {completedCount} of {habits.length} habits locked in.
            </Text>
          </View>
          <View style={styles.progressCircle} className="bg-white/10">
            <Text className="text-white font-bold text-xl">{progressPercent}%</Text>
          </View>
        </View>
        
        <View className="h-2 bg-black/10 rounded-full overflow-hidden">
          <Animated.View style={[styles.progressLine, progressStyle]} className="bg-white" />
        </View>
      </Animated.View>

      {/* AI Strategy Section */}
      <Animated.View 
        entering={FadeInUp.delay(300)}
        layout={Layout.springify()} 
        className="bg-white dark:bg-slate-800 rounded-[35px] p-7 mb-8 border border-slate-50 dark:border-slate-700 shadow-xl"
      >
        <View className="flex-row items-center justify-between mb-5">
          <View className="flex-row items-center">
            <View className="w-10 h-10 bg-teal-50 dark:bg-teal-900/30 rounded-xl items-center justify-center mr-3">
              <Sparkles size={20} color="#4CB8A4" />
            </View>
            <View>
              <Text className="font-bold text-slate-900 dark:text-white">Daily Optimization</Text>
              <Text className="text-[9px] text-slate-400 font-bold uppercase tracking-widest">Powered by Gemini</Text>
            </View>
          </View>
          <TouchableOpacity 
            onPress={handleAnalyze} 
            disabled={isAnalyzing}
            className="bg-slate-50 dark:bg-slate-900 px-4 py-2 rounded-full"
          >
            <Text className="text-[#4CB8A4] text-[10px] font-bold uppercase tracking-widest">
              {isAnalyzing ? 'Analyzing...' : 'Refresh'}
            </Text>
          </TouchableOpacity>
        </View>
        
        {isAnalyzing ? (
          <View className="py-8 items-center">
            <ActivityIndicator color="#4CB8A4" />
            <Text className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-4">Synthesizing Bio-data...</Text>
          </View>
        ) : aiInsight ? (
          <Animated.View entering={FadeIn.duration(400)}>
            <Text className="text-slate-600 dark:text-slate-300 text-[13px] leading-6 mb-5">
              {aiInsight}
            </Text>
            <TouchableOpacity 
              onPress={onNavigateToChat} 
              className="flex-row items-center self-start bg-teal-50/50 dark:bg-teal-900/10 px-4 py-2 rounded-xl"
            >
              <Text className="text-[#4CB8A4] text-[11px] font-bold mr-2">Deep Dive with AI Coach</Text>
              <ChevronRight size={14} color="#4CB8A4" />
            </TouchableOpacity>
          </Animated.View>
        ) : (
          <View className="py-4 px-2 items-center">
            <Text className="text-slate-400 text-xs italic text-center">Tap 'Refresh' to generate a real-time protocol based on your current vital markers.</Text>
          </View>
        )}
      </Animated.View>

      {/* Habit List */}
      <Animated.View entering={FadeInUp.delay(400)}>
        <View className="flex-row justify-between items-center mb-5 px-1">
          <Text className="text-xl font-bold text-slate-900 dark:text-white">Action Plan</Text>
          <Zap size={18} color="#94A3B8" />
        </View>
        
        <View className="mb-8">
          {habits.map((habit) => (
            <TouchableOpacity 
              key={habit.id}
              onPress={() => toggleHabit(habit.id)}
              activeOpacity={0.7}
              className="bg-white dark:bg-slate-800 p-5 rounded-[25px] mb-4 flex-row items-center justify-between shadow-sm border border-slate-50 dark:border-slate-700"
            >
              <View className="flex-row items-center">
                <View className="w-14 h-14 rounded-2xl bg-slate-50 dark:bg-slate-900 items-center justify-center mr-4">
                  <Text style={{ fontSize: 24 }}>{habit.icon}</Text>
                </View>
                <View>
                  <Text className={`font-bold text-[15px] ${habit.completed ? 'text-slate-300 line-through' : 'text-slate-800 dark:text-white'}`}>
                    {habit.name}
                  </Text>
                  <Text className="text-[9px] text-slate-400 font-bold uppercase tracking-widest mt-1">{habit.category}</Text>
                </View>
              </View>
              {habit.completed ? (
                <CheckCircle2 color="#4CB8A4" size={28} fill="rgba(76, 184, 164, 0.1)" />
              ) : (
                <Circle color="#E2E8F0" size={28} />
              )}
            </TouchableOpacity>
          ))}
        </View>
      </Animated.View>

      {/* Metrics Grid */}
      <Animated.View entering={FadeInUp.delay(500)}>
        <Text className="text-xl font-bold text-slate-900 dark:text-white mb-5 px-1">Biological Vitals</Text>
        <View className="flex-row flex-wrap justify-between">
          {wellnessMetrics.map((m, idx) => (
            <View 
              key={idx} 
              className="w-[48%] bg-white dark:bg-slate-800 p-6 rounded-[35px] mb-4 shadow-sm border border-slate-50 dark:border-slate-700"
            >
              <View className="flex-row justify-between items-start mb-4">
                <View className={`w-12 h-12 rounded-2xl items-center justify-center ${m.color}`}>
                  <Text style={{ fontSize: 20 }}>{m.icon}</Text>
                </View>
                {m.trend && (
                  <View className="flex-row items-center gap-1">
                    {m.trend === 'up' ? <TrendingUp size={12} color="#4CB8A4" /> : <TrendingDown size={12} color="#EF4444" />}
                    <Text className={`text-[9px] font-bold ${m.trend === 'up' ? 'text-[#4CB8A4]' : 'text-red-500'}`}>
                      {m.trendValue}
                    </Text>
                  </View>
                )}
              </View>
              <Text className="text-slate-400 text-[10px] font-bold uppercase tracking-widest mb-1">{m.title}</Text>
              <View className="flex-row items-baseline">
                <Text className="text-xl font-bold text-slate-900 dark:text-white">{m.value}</Text>
                {m.unit !== '' && <Text className="text-slate-400 text-[10px] ml-1 font-bold">{m.unit}</Text>}
              </View>
            </View>
          ))}
        </View>
      </Animated.View>
      
      <View style={{ height: 140 }} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    flex: 1,
  },
  scrollContent: {
    padding: 24,
  },
  themeToggle: {
    width: 54,
    height: 54,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  progressCircle: {
    width: 84,
    height: 84,
    borderRadius: 42,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 6,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  progressLine: {
    height: '100%',
    borderRadius: 5,
  }
});

export default HomeScreen;
