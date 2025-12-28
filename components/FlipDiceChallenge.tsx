
import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withSpring, 
  withSequence, 
  withTiming, 
  runOnJS,
  FadeIn
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { Audio } from 'expo-av';
import '../types';

declare var require: any;

const challenges = [
  "Drink 2 glasses of water 💧",
  "Write one short journal entry ✍️",
  "Take a 5-minute walk 🚶‍♀️",
  "Do 3 deep breaths 🧘‍♂️",
  "Stretch for 2 minutes 🤸",
  "Eat one serving of fruit 🍏",
];

// Dot patterns for dice faces 1-6
const diceDots = [
  [4], // 1
  [0, 8], // 2
  [0, 4, 8], // 3
  [0, 2, 6, 8], // 4
  [0, 2, 4, 6, 8], // 5
  [0, 2, 3, 5, 6, 8], // 6
];

const FlipDiceChallenge: React.FC = () => {
  const [currentChallenge, setCurrentChallenge] = useState<string | null>(null);
  const [isRolling, setIsRolling] = useState(false);
  const [dotsIndex, setDotsIndex] = useState(0);
  const [sound, setSound] = useState<Audio.Sound | null>(null);
  
  const rotateX = useSharedValue(20);
  const rotateY = useSharedValue(-25);
  const scale = useSharedValue(1);

  useEffect(() => {
    return sound ? () => { sound.unloadAsync(); } : undefined;
  }, [sound]);

  const playSound = async () => {
    try {
      const asset = require('../assets/dice_roll.mp3');
      const { sound: newSound } = await Audio.Sound.createAsync(asset);
      setSound(newSound);
      await newSound.playAsync();
    } catch (e) {
      console.warn("Audio asset missing - skipping sound.");
    }
  };

  const rollDice = () => {
    if (isRolling) return;
    setIsRolling(true);
    setCurrentChallenge(null);
    
    // Initial haptic impact
    if (Haptics?.impactAsync) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy).catch(() => {});
    }
    
    playSound();

    // Randomize face during roll
    const rollInterval = setInterval(() => {
      setDotsIndex(Math.floor(Math.random() * 6));
    }, 100);

    const targetX = rotateX.value + (Math.floor(Math.random() * 4) + 8) * 90;
    const targetY = rotateY.value + (Math.floor(Math.random() * 4) + 8) * 90;

    scale.value = withSequence(
      withSpring(1.4, { damping: 10, stiffness: 100 }), 
      withSpring(1)
    );
    
    rotateX.value = withTiming(targetX, { duration: 1200 });
    rotateY.value = withTiming(targetY, { duration: 1200 }, (finished) => {
      if (finished) {
        runOnJS(clearInterval)(rollInterval);
        runOnJS(finishRoll)();
      }
    });
  };

  const finishRoll = () => {
    setIsRolling(false);
    const finalIndex = Math.floor(Math.random() * 6);
    setDotsIndex(finalIndex);
    setCurrentChallenge(challenges[finalIndex]);
    
    if (Haptics?.notificationAsync) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});
    }
  };

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { perspective: 1000 },
      { rotateX: `${rotateX.value}deg` },
      { rotateY: `${rotateY.value}deg` },
      { scale: scale.value }
    ] as any,
  }));

  return (
    <View style={styles.card} className="bg-white dark:bg-slate-800 border border-slate-50 dark:border-slate-700 shadow-sm">
      <View className="mb-8 items-center">
        <Text className="text-slate-400 text-[9px] font-bold uppercase tracking-widest mb-1">Stuck? Try a</Text>
        <Text className="text-slate-800 dark:text-white font-bold text-2xl">Habit Roll</Text>
      </View>
      
      <TouchableOpacity onPress={rollDice} activeOpacity={0.9} style={styles.diceWrapper}>
        <Animated.View style={[styles.dice, animatedStyle]}>
          <View style={styles.face} className="bg-[#4CB8A4] shadow-2xl">
            <View style={styles.dotsGrid}>
              {[...Array(9)].map((_, i) => (
                <View key={i} style={styles.dotContainer}>
                  {diceDots[dotsIndex].includes(i) && (
                    <View style={styles.dot} className="bg-white" />
                  )}
                </View>
              ))}
            </View>
          </View>
        </Animated.View>
      </TouchableOpacity>

      <View style={styles.challengeContainer}>
        {isRolling ? (
          <View className="items-center">
            <Text className="text-[#4CB8A4] font-bold text-[10px] uppercase tracking-[4px]">Shaking...</Text>
          </View>
        ) : currentChallenge ? (
          // Use FadeIn layout animation instead of withDelay(..., withTiming) to fix Type 'number' is not assignable to type 'EntryOrExitLayoutType'
          <Animated.View entering={FadeIn.delay(200)} className="items-center">
            <Text className="text-center text-slate-800 dark:text-white font-bold text-lg mb-6 px-4">
              {currentChallenge}
            </Text>
            <TouchableOpacity onPress={rollDice} style={styles.button} className="bg-[#4CB8A4]">
              <Text className="text-white font-bold text-[10px] uppercase tracking-widest">Roll Again</Text>
            </TouchableOpacity>
          </Animated.View>
        ) : (
          <TouchableOpacity onPress={rollDice} style={styles.buttonLarge} className="bg-[#4CB8A4]">
            <Text className="text-white font-bold text-xs uppercase tracking-widest">Tap to Gamble on a Habit</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 40,
    padding: 32,
    alignItems: 'center',
    marginBottom: 24,
  },
  diceWrapper: {
    padding: 20,
  },
  dice: {
    width: 100,
    height: 100,
    justifyContent: 'center',
    alignItems: 'center',
  },
  face: {
    width: 100,
    height: 100,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
    elevation: 12,
  },
  dotsGrid: {
    flexWrap: 'wrap',
    flexDirection: 'row',
    width: '100%',
    height: '100%',
  },
  dotContainer: {
    width: '33.33%',
    height: '33.33%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  dot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  challengeContainer: {
    marginTop: 40,
    minHeight: 120,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  button: {
    paddingHorizontal: 28,
    paddingVertical: 14,
    borderRadius: 20,
    shadowColor: '#4CB8A4',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 4,
  },
  buttonLarge: {
    paddingHorizontal: 36,
    paddingVertical: 20,
    borderRadius: 25,
    shadowColor: '#4CB8A4',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 15,
    elevation: 6,
  }
});

export default FlipDiceChallenge;
