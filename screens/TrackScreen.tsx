
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
    if (Haptics?.notificationAsync) Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => { });
    moodScale.value = withSpring(1.2, { damping: 10 }, () => {
      moodScale.value = withSpring(1);
    });
  };

  const adjustWater = (amount: number) => {
    if (Haptics?.impactAsync) Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => { });
    setWaterAmount(prev => Math.max(0, prev + amount));
  };

  const simulateMealUpload = async () => {
    setIsAnalyzingMeal(true);
    if (Haptics?.impactAsync) Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy).catch(() => { });

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
    if (Haptics?.notificationAsync) Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => { });
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={false}
    >
      <Animated.View entering={FadeInUp.delay(100)} style={styles.header}>
        <Text style={styles.title}>Daily Log</Text>
        <Text style={styles.subtitle}>Sync your biological markers.</Text>
      </Animated.View>

      {/* Meal Tracker Module */}
      <Animated.View
        entering={FadeInUp.delay(200)}
        style={styles.card}
      >
        <View>
          <View>
            <View>
              <PieChart size={16} color="#4CB8A4" style={{ marginRight: 6 }} />
              <Text>Nutrition Scan</Text>
            </View>
            <Text>Track Your Meal</Text>
          </View>
          <TouchableOpacity
            onPress={simulateMealUpload}
            style={styles.scanButton}
          >
            <Camera color="white" size={24} />
          </TouchableOpacity>
        </View>

        {isAnalyzingMeal ? (
          <View>
            <ActivityIndicator color="#4CB8A4" size="large" />
            <Text>Gemini Vision Analyzing...</Text>
          </View>
        ) : mealResult ? (
          <View style={styles.resultBox}>
            <View>
              <Text>{mealResult.foodName}</Text>
              <View>
                <Sparkles size={12} color="#10B981" />
                <Text>{mealResult.healthRating}/10</Text>
              </View>
            </View>
            <View>
              <LogMetric label="Protein" value={mealResult.protein} color="#4CB8A4" />
              <LogMetric label="Carbs" value={mealResult.carbs} color="#6EC1E4" />
              <LogMetric label="Fats" value={mealResult.fats} color="#94A3B8" />
            </View>
            <Text>
              "{mealResult.summary}"
            </Text>
          </View>
        ) : (
          <View>
            <Text>
              Use Gemini Vision to identify macros and health scores from a simple photo.
            </Text>
          </View>
        )}
      </Animated.View>

      {/* Mood Tracker Module */}
      <Animated.View entering={FadeInUp.delay(300)}>
        <View>
          <Smile size={18} color="#94A3B8" style={{ marginRight: 8 }} />
          <Text>Psychological State</Text>
        </View>
        <View>
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
      >
        <View>
          <View>
            <View>
              <Moon size={18} color="#6EC1E4" />
            </View>
            <View>
              <Text>Restorative Sleep</Text>
              <Text>Duration</Text>
            </View>
          </View>
          <Text>{sleepHours}<Text>h</Text></Text>
        </View>

        <View style={styles.stepperContainer}>
          <TouchableOpacity
            onPress={() => {
              if (sleepHours > 0) {
                setSleepHours(prev => prev - 0.5);
                if (Haptics?.selectionAsync) Haptics.selectionAsync().catch(() => { });
              }
            }}
            style={styles.stepBtn}
          >
            <Minus color="#94A3B8" size={20} />
          </TouchableOpacity>
          <View style={styles.progressTrack}>
            <View style={{ width: `${(sleepHours / 12) * 100}%` }} />
          </View>
          <TouchableOpacity
            onPress={() => {
              if (sleepHours < 12) {
                setSleepHours(prev => prev + 0.5);
                if (Haptics?.selectionAsync) Haptics.selectionAsync().catch(() => { });
              }
            }}
            style={styles.stepBtn}
          >
            <Plus color="#6EC1E4" size={20} />
          </TouchableOpacity>
        </View>
      </Animated.View>

      {/* Hydration Tracker Module */}
      <Animated.View
        entering={FadeInUp.delay(500)}
        style={styles.card}
      >
        <View>
          <View>
            <View>
              <Droplets size={18} color="#4CB8A4" />
            </View>
            <View>
              <Text>Cellular Hydration</Text>
              <Text>Water Intake</Text>
            </View>
          </View>
          <Text>{(waterAmount / 1000).toFixed(1)}<Text>L</Text></Text>
        </View>

        <View>
          <TouchableOpacity
            onPress={() => adjustWater(250)}
          >
            <Plus size={14} color="#4CB8A4" style={{ marginRight: 6 }} />
            <Text>Small (250ml)</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => adjustWater(500)}
          >
            <Plus size={14} color="white" style={{ marginRight: 6 }} />
            <Text>Large (500ml)</Text>
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
    <Text>{label}</Text>
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
        style={[animatedStyle, { padding: 16, borderRadius: 25, borderWidth: 2, borderColor: isSelected ? 'transparent' : '#E2E8F0', alignItems: 'center' }]}>
        <Text style={{ fontSize: 26 }}>{item.emoji}</Text>
        <Text style={{ fontSize: 8, fontWeight: 'bold', textTransform: 'uppercase', marginTop: 8, letterSpacing: 2, textAlign: 'center', color: isSelected ? '#000' : '#94A3B8' }}>
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
