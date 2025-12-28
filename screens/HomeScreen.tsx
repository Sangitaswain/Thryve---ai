
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
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => { });
      } else {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => { });
      }
    }
    setHabits(prev => prev.map(h => h.id === id ? { ...h, completed: !h.completed } : h));
  };

  const handleAnalyze = async () => {
    setIsAnalyzing(true);
    if (Haptics?.notificationAsync) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => { });
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
      <Animated.View entering={FadeInUp.delay(100)}>
        <View>
          <Text>{today}</Text>
          <Text>Good Morning,{'\n'}Alex</Text>
        </View>
        <TouchableOpacity
          onPress={toggleTheme}
          style={styles.themeToggle}
        >
          <Text style={{ fontSize: 20 }}>{isDarkMode ? '☀️' : '🌙'}</Text>
        </TouchableOpacity>
      </Animated.View>

      {/* Progress Card */}
      <Animated.View entering={FadeInUp.delay(200)}>
        <View>
          <View>
            <View>
              <Text>Consistency Tracker</Text>
            </View>
            <Text>Thryve Protocol</Text>
            <Text>
              {completedCount} of {habits.length} habits locked in.
            </Text>
          </View>
          <View style={styles.progressCircle}>
            <Text>{progressPercent}%</Text>
          </View>
        </View>

        <View>
          <Animated.View style={[styles.progressLine, progressStyle]} />
        </View>
      </Animated.View>

      {/* AI Strategy Section */}
      <Animated.View
        entering={FadeInUp.delay(300)}
        layout={Layout.springify()}
      >
        <View>
          <View>
            <View>
              <Sparkles size={20} color="#4CB8A4" />
            </View>
            <View>
              <Text>Daily Optimization</Text>
              <Text>Powered by Gemini</Text>
            </View>
          </View>
          <TouchableOpacity
            onPress={handleAnalyze}
            disabled={isAnalyzing}
          >
            <Text>
              {isAnalyzing ? 'Analyzing...' : 'Refresh'}
            </Text>
          </TouchableOpacity>
        </View>

        {isAnalyzing ? (
          <View>
            <ActivityIndicator color="#4CB8A4" />
            <Text>Synthesizing Bio-data...</Text>
          </View>
        ) : aiInsight ? (
          <Animated.View entering={FadeIn.duration(400)}>
            <Text>
              {aiInsight}
            </Text>
            <TouchableOpacity
              onPress={onNavigateToChat}
            >
              <Text>Deep Dive with AI Coach</Text>
              <ChevronRight size={14} color="#4CB8A4" />
            </TouchableOpacity>
          </Animated.View>
        ) : (
          <View>
            <Text>Tap 'Refresh' to generate a real-time protocol based on your current vital markers.</Text>
          </View>
        )}
      </Animated.View>

      {/* Habit List */}
      <Animated.View entering={FadeInUp.delay(400)}>
        <View>
          <Text>Action Plan</Text>
          <Zap size={18} color="#94A3B8" />
        </View>

        <View>
          {habits.map((habit) => (
            <TouchableOpacity
              key={habit.id}
              onPress={() => toggleHabit(habit.id)}
              activeOpacity={0.7}
            >
              <View>
                <View>
                  <Text style={{ fontSize: 24 }}>{habit.icon}</Text>
                </View>
                <View>
                  <Text style={{ fontWeight: 'bold', fontSize: 15, color: habit.completed ? '#CBD5E1' : '#1E293B', textDecorationLine: habit.completed ? 'line-through' : 'none' }}>
                    {habit.name}
                  </Text>
                  <Text>{habit.category}</Text>
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
        <Text>Biological Vitals</Text>
        <View>
          {wellnessMetrics.map((m, idx) => (
            <View
              key={idx}
            >
              <View>
                <View style={{ width: 48, height: 48, borderRadius: 16, alignItems: 'center', justifyContent: 'center', backgroundColor: '#EEF2F6' }}>
                  <Text style={{ fontSize: 20 }}>{m.icon}</Text>
                </View>
                {m.trend && (
                  <View>
                    {m.trend === 'up' ? <TrendingUp size={12} color="#4CB8A4" /> : <TrendingDown size={12} color="#EF4444" />}
                    <Text style={{ fontSize: 9, fontWeight: 'bold', color: m.trend === 'up' ? '#4CB8A4' : '#EF4444' }}>
                      {m.trendValue}
                    </Text>
                  </View>
                )}
              </View>
              <Text>{m.title}</Text>
              <View>
                <Text>{m.value}</Text>
                {m.unit !== '' && <Text>{m.unit}</Text>}
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
