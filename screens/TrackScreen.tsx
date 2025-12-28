
import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Dimensions, StyleSheet, ActivityIndicator } from 'react-native';
import FlipDiceChallenge from '../components/FlipDiceChallenge';
import { analyzeMealImage } from '../services/geminiService';
import * as Haptics from 'expo-haptics';
import { MealAnalysis } from '../types';
import { Camera, Plus, Minus, Droplets, Moon, Smile, PieChart, Sparkles } from 'lucide-react-native';
import Animated, { FadeInUp, useAnimatedStyle, withSpring, useSharedValue } from 'react-native-reanimated';

const { width } = Dimensions.get('window');

const moods = [
  { emoji: '😔', label: 'Low', activeColor: 'bg-rose-50 border-rose-200 text-rose-500' },
  { emoji: '😐', label: 'Okay', activeColor: 'bg-blue-50 border-blue-200 text-blue-500' },
  { emoji: '🙂', label: 'Good', activeColor: 'bg-teal-50 border-teal-200 text-[#4CB8A4]' },
  { emoji: '😊', label: 'Great', activeColor: 'bg-teal-100 border-[#4CB8A4] text-[#4CB8A4]' },
  { emoji: '🤩', label: 'Radiant', activeColor: 'bg-teal-200 border-[#4CB8A4] text-[#4CB8A4]' },
];

const TrackScreen: React.FC = () => {
  const [selectedMood, setSelectedMood] = useState<number | null>(null);
  const [sleepHours, setSleepHours] = useState(7);
  const [waterAmount, setWaterAmount] = useState(1250);
  const [isAnalyzingMeal, setIsAnalyzingMeal] = useState(false);
  const [mealResult, setMealResult] = useState<MealAnalysis | null>(null);

  const moodScale = useSharedValue(1);

  const handleMoodSelect = (idx: number) => {
    setSelectedMood(idx);
    if (Haptics?.notificationAsync) Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});
    moodScale.value = withSpring(1.2, { damping: 10 }, () => {
      moodScale.value = withSpring(1);
    });
  };

  const adjustWater = (amount: number) => {
    if (Haptics?.impactAsync) Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
    setWaterAmount(prev => Math.max(0, prev + amount));
  };

  const simulateMealUpload = async () => {
    setIsAnalyzingMeal(true);
    if (Haptics?.impactAsync) Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy).catch(() => {});
    
    // Simulating camera/Gemini analysis
    const result = await analyzeMealImage("iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==");
    
    setMealResult(result as MealAnalysis || {
      foodName: "Quinoa Harvest Bowl",
      protein: "18g",
      carbs: "45g",
      fats: "12g",
      healthRating: 9,
      summary: "Excellent choice! High in fiber and complete protein."
    });
    setIsAnalyzingMeal(false);
    if (Haptics?.notificationAsync) Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});
  };

  return (
    <ScrollView 
      style={styles.container} 
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={false}
    >
      <Animated.View entering={FadeInUp.delay(100)} style={styles.header}>
        <Text style={styles.title} className="text-slate-900 dark:text-white">Daily Log</Text>
        <Text style={styles.subtitle} className="text-slate-500 dark:text-slate-400">Sync your biological markers.</Text>
      </Animated.View>

      {/* Meal Tracker Module */}
      <Animated.View 
        entering={FadeInUp.delay(200)}
        style={styles.card} 
        className="bg-white dark:bg-slate-800 border border-slate-50 dark:border-slate-700 shadow-xl"
      >
        <View className="flex-row justify-between items-center mb-6">
          <View>
            <View className="flex-row items-center mb-1">
              <PieChart size={16} color="#4CB8A4" style={{ marginRight: 6 }} />
              <Text className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Nutrition Scan</Text>
            </View>
            <Text className="text-xl font-bold text-slate-900 dark:text-white">Track Your Meal</Text>
          </View>
          <TouchableOpacity 
            onPress={simulateMealUpload}
            style={styles.scanButton}
            className="bg-[#4CB8A4]"
          >
            <Camera color="white" size={24} />
          </TouchableOpacity>
        </View>

        {isAnalyzingMeal ? (
          <View className="items-center py-8">
            <ActivityIndicator color="#4CB8A4" size="large" />
            <Text className="text-[10px] text-slate-400 mt-6 font-bold uppercase tracking-[4px]">Gemini Vision Analyzing...</Text>
          </View>
        ) : mealResult ? (
          <View style={styles.resultBox} className="bg-slate-50 dark:bg-slate-900/50">
            <View className="flex-row justify-between items-center mb-4">
              <Text className="font-bold text-[#4CB8A4] text-lg">{mealResult.foodName}</Text>
              <View className="bg-emerald-100 dark:bg-emerald-900/30 px-3 py-1.5 rounded-xl flex-row items-center">
                <Sparkles size={12} color="#10B981" />
                <Text className="text-emerald-700 dark:text-emerald-400 text-xs font-bold ml-1">{mealResult.healthRating}/10</Text>
              </View>
            </View>
            <View className="flex-row justify-between mb-4">
              <LogMetric label="Protein" value={mealResult.protein} color="#4CB8A4" />
              <LogMetric label="Carbs" value={mealResult.carbs} color="#6EC1E4" />
              <LogMetric label="Fats" value={mealResult.fats} color="#94A3B8" />
            </View>
            <Text className="text-[12px] text-slate-500 dark:text-slate-400 leading-5 italic">
              "{mealResult.summary}"
            </Text>
          </View>
        ) : (
          <View className="items-center py-4 bg-slate-50 dark:bg-slate-900/30 rounded-2xl">
            <Text className="text-slate-400 text-[11px] font-medium text-center px-6">
              Use Gemini Vision to identify macros and health scores from a simple photo.
            </Text>
          </View>
        )}
      </Animated.View>

      {/* Mood Tracker Module */}
      <Animated.View entering={FadeInUp.delay(300)} className="mb-8">
        <View className="flex-row items-center mb-5 ml-2">
          <Smile size={18} color="#94A3B8" style={{ marginRight: 8 }} />
          <Text className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Psychological State</Text>
        </View>
        <View className="flex-row justify-between">
          {moods.map((m, idx) => (
            <MoodButton 
              key={idx}
              item={m}
              isSelected={selectedMood === idx}
              onPress={() => handleMoodSelect(idx)}
            />
          ))}
        </View>
      </Animated.View>

      {/* Sleep Tracker Module */}
      <Animated.View 
        entering={FadeInUp.delay(400)}
        style={styles.card} 
        className="bg-white dark:bg-slate-800 border border-slate-50 dark:border-slate-700 shadow-xl"
      >
        <View className="flex-row justify-between items-center mb-6">
          <View className="flex-row items-center">
            <View className="w-10 h-10 bg-blue-50 dark:bg-blue-900/30 rounded-xl items-center justify-center mr-3">
              <Moon size={18} color="#6EC1E4" />
            </View>
            <View>
              <Text className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Restorative Sleep</Text>
              <Text className="text-lg font-bold text-slate-900 dark:text-white">Duration</Text>
            </View>
          </View>
          <Text className="text-[#6EC1E4] font-bold text-2xl">{sleepHours}<Text className="text-sm font-medium">h</Text></Text>
        </View>
        
        <View style={styles.stepperContainer}>
          <TouchableOpacity 
            onPress={() => {
              if (sleepHours > 0) {
                setSleepHours(prev => prev - 0.5);
                if (Haptics?.selectionAsync) Haptics.selectionAsync().catch(() => {});
              }
            }} 
            style={styles.stepBtn} 
            className="bg-slate-50 dark:bg-slate-900"
          >
             <Minus color="#94A3B8" size={20} />
          </TouchableOpacity>
          <View style={styles.progressTrack} className="bg-slate-100 dark:bg-slate-900">
            <View style={{ width: `${(sleepHours / 12) * 100}%` }} className="h-full bg-[#6EC1E4] rounded-full" />
          </View>
          <TouchableOpacity 
             onPress={() => {
              if (sleepHours < 12) {
                setSleepHours(prev => prev + 0.5);
                if (Haptics?.selectionAsync) Haptics.selectionAsync().catch(() => {});
              }
            }} 
            style={styles.stepBtn} 
            className="bg-slate-50 dark:bg-slate-900"
          >
             <Plus color="#6EC1E4" size={20} />
          </TouchableOpacity>
        </View>
      </Animated.View>

      {/* Hydration Tracker Module */}
      <Animated.View 
        entering={FadeInUp.delay(500)}
        style={styles.card} 
        className="bg-white dark:bg-slate-800 border border-slate-50 dark:border-slate-700 shadow-xl"
      >
        <View className="flex-row justify-between items-center mb-6">
          <View className="flex-row items-center">
            <View className="w-10 h-10 bg-teal-50 dark:bg-teal-900/30 rounded-xl items-center justify-center mr-3">
              <Droplets size={18} color="#4CB8A4" />
            </View>
            <View>
              <Text className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Cellular Hydration</Text>
              <Text className="text-lg font-bold text-slate-900 dark:text-white">Water Intake</Text>
            </View>
          </View>
          <Text className="text-[#4CB8A4] font-bold text-2xl">{(waterAmount / 1000).toFixed(1)}<Text className="text-sm font-medium">L</Text></Text>
        </View>
        
        <View className="flex-row justify-between gap-4">
          <TouchableOpacity 
            onPress={() => adjustWater(250)}
            className="flex-1 bg-teal-50 dark:bg-teal-900/10 h-14 rounded-2xl items-center justify-center flex-row"
          >
            <Plus size={14} color="#4CB8A4" style={{ marginRight: 6 }} />
            <Text className="text-[#4CB8A4] font-bold text-xs uppercase tracking-widest">Small (250ml)</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            onPress={() => adjustWater(500)}
            className="flex-1 bg-[#4CB8A4] h-14 rounded-2xl items-center justify-center flex-row"
          >
            <Plus size={14} color="white" style={{ marginRight: 6 }} />
            <Text className="text-white font-bold text-xs uppercase tracking-widest">Large (500ml)</Text>
          </TouchableOpacity>
        </View>
      </Animated.View>

      <FlipDiceChallenge />
      
      <View style={{ height: 120 }} />
    </ScrollView>
  );
};

const LogMetric = ({ label, value, color }: { label: string, value: string, color: string }) => (
  <View style={styles.metricItem}>
    <Text className="text-[9px] text-slate-400 font-bold uppercase tracking-widest mb-1">{label}</Text>
    <Text style={{ color, fontSize: 16, fontWeight: 'bold' }}>{value}</Text>
  </View>
);

interface MoodButtonProps {
  item: any;
  isSelected: boolean;
  onPress: () => void;
}

// Fixed: Added explicit React.FC typing to resolve "Property 'key' does not exist" in JSX iterations
const MoodButton: React.FC<MoodButtonProps> = ({ item, isSelected, onPress }) => {
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: isSelected ? withSpring(1.1) : withSpring(1) }],
  }));

  return (
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={onPress}
      style={{ width: (width - 64) / 5 }}
    >
      <Animated.View
        className={`items-center p-4 rounded-3xl border-2 ${
          isSelected ? item.activeColor : 'border-transparent bg-white dark:bg-slate-800 shadow-sm'
        }`}
        style={animatedStyle}
      >
        <Text style={{ fontSize: 26 }}>{item.emoji}</Text>
        <Text className={`text-[8px] font-bold uppercase mt-2 tracking-widest text-center ${isSelected ? '' : 'text-slate-400'}`}>
          {item.label}
        </Text>
      </Animated.View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: 24,
  },
  header: {
    marginBottom: 32,
    paddingHorizontal: 4,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 14,
    marginTop: 4,
  },
  card: {
    borderRadius: 35,
    padding: 24,
    marginBottom: 24,
  },
  scanButton: {
    width: 60,
    height: 60,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#4CB8A4',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  resultBox: {
    padding: 20,
    borderRadius: 25,
  },
  metricItem: {
    alignItems: 'flex-start',
  },
  stepperContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  stepBtn: {
    width: 50,
    height: 50,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  progressTrack: {
    flex: 1,
    height: 10,
    borderRadius: 5,
    overflow: 'hidden',
  }
});

export default TrackScreen;
