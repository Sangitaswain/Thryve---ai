
import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TextInput, TouchableOpacity, ActivityIndicator, Linking, StyleSheet, Dimensions } from 'react-native';
import { searchHealthResearch } from '../services/geminiService';
import { Search, ExternalLink, BookOpen, BarChart3, Info, Globe, MapPin } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import Animated, { FadeInUp, FadeIn, Layout, useAnimatedStyle, useSharedValue, withTiming, withDelay } from 'react-native-reanimated';

const { width } = Dimensions.get('window');

const weeklyData = [
  { day: 'Mon', mood: 60, activity: 40 },
  { day: 'Tue', mood: 50, activity: 70 },
  { day: 'Wed', mood: 80, activity: 85 },
  { day: 'Thu', mood: 70, activity: 60 },
  { day: 'Fri', mood: 65, activity: 90 },
  { day: 'Sat', mood: 90, activity: 30 },
  { day: 'Sun', mood: 85, activity: 45 },
];

const suggestedTopics = ["Deep Sleep Protocol", "VO2 Max Training", "Glycemic Index", "Cortisol Spikes"];

const InsightsScreen: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [researchData, setResearchData] = useState<any>(null);
  const [isSearching, setIsSearching] = useState(false);
  
  // Animation values for chart
  const chartProgress = useSharedValue(0);

  useEffect(() => {
    chartProgress.value = withDelay(500, withTiming(1, { duration: 1000 }));
  }, []);

  const handleSearch = async (queryOverride?: string) => {
    const query = queryOverride || searchQuery;
    if (!query.trim()) return;
    
    setIsSearching(true);
    if (Haptics?.impactAsync) Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium).catch(() => {});
    
    const result = await searchHealthResearch(query);
    setResearchData(result);
    setIsSearching(false);
    
    if (Haptics?.notificationAsync) Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});
  };

  return (
    <ScrollView 
      style={styles.container} 
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={false}
    >
      <Animated.View entering={FadeInUp.delay(100)} style={styles.header}>
        <Text style={styles.title} className="text-slate-900 dark:text-white">Health Intelligence</Text>
        <Text style={styles.subtitle} className="text-slate-500 dark:text-slate-400">Discover the science behind your vitals.</Text>
      </Animated.View>

      {/* Research Card */}
      <Animated.View 
        entering={FadeInUp.delay(200)}
        style={styles.card} 
        className="bg-white dark:bg-slate-800 border border-slate-50 dark:border-slate-700 shadow-xl"
      >
        <View className="flex-row items-center mb-6">
          <BookOpen size={20} color="#4CB8A4" style={{ marginRight: 10 }} />
          <Text className="font-bold text-slate-800 dark:text-white text-lg">Bio-Research Library</Text>
        </View>

        <View style={styles.searchBar}>
          <View style={styles.inputWrapper} className="bg-slate-50 dark:bg-slate-900">
            <TextInput 
              style={styles.input}
              className="text-slate-800 dark:text-white"
              placeholder="Query physiological topics..."
              placeholderTextColor="#94A3B8"
              value={searchQuery}
              onChangeText={setSearchQuery}
              onSubmitEditing={() => handleSearch()}
              returnKeyType="search"
              autoCapitalize="none"
            />
          </View>
          <TouchableOpacity 
            onPress={() => handleSearch()}
            disabled={isSearching}
            style={styles.searchButton}
            className="bg-[#4CB8A4]"
          >
            {isSearching ? <ActivityIndicator size="small" color="white" /> : <Search color="white" size={20} />}
          </TouchableOpacity>
        </View>

        {!researchData && !isSearching && (
          <View className="flex-row flex-wrap gap-2 mb-4">
            {suggestedTopics.map((topic, i) => (
              <TouchableOpacity 
                key={topic}
                onPress={() => {
                  setSearchQuery(topic);
                  handleSearch(topic);
                }}
                className="bg-slate-50 dark:bg-slate-900 px-3 py-2 rounded-xl border border-slate-100 dark:border-slate-800"
              >
                <Text className="text-[10px] font-bold text-slate-500 dark:text-slate-400">#{topic}</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}

        {isSearching ? (
          <View className="py-12 items-center">
            <ActivityIndicator color="#4CB8A4" size="large" />
            <Text className="text-[10px] text-slate-400 font-bold uppercase tracking-[4px] mt-6">Indexing Peer-Reviewed Data...</Text>
          </View>
        ) : researchData ? (
          <Animated.View entering={FadeIn.duration(400)}>
            <Text style={styles.researchText} className="text-slate-600 dark:text-slate-300">
              {researchData.text}
            </Text>
            
            <View style={styles.divider} className="bg-slate-100 dark:bg-slate-700" />
            
            <View className="flex-row items-center mb-4">
              <Info size={12} color="#94A3B8" style={{ marginRight: 6 }} />
              <Text className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Grounding Citations</Text>
            </View>

            <View style={styles.sourcesContainer}>
              {researchData.sources.map((src: any, i: number) => {
                const isMap = !!src.maps;
                const uri = src.web?.uri || src.maps?.uri;
                const title = src.web?.title || src.maps?.title || 'Scientific Publication';
                if (!uri) return null;

                return (
                  <TouchableOpacity 
                    key={i} 
                    onPress={() => Linking.openURL(uri).catch(err => console.error("Couldn't load page", err))}
                    style={styles.sourceLink}
                    className="bg-slate-50 dark:bg-slate-900/50"
                  >
                    <View className="flex-row items-center flex-1">
                      {isMap ? <MapPin size={12} color="#4CB8A4" /> : <Globe size={12} color="#4CB8A4" />}
                      <Text numberOfLines={1} style={styles.sourceText} className="ml-2">{title}</Text>
                    </View>
                    <ExternalLink size={12} color="#94A3B8" />
                  </TouchableOpacity>
                );
              })}
            </View>
          </Animated.View>
        ) : (
          <View style={styles.emptyState} className="bg-slate-50 dark:bg-slate-900/30">
            <Text className="text-slate-400 text-[11px] italic text-center leading-5">
              Enter a wellness topic to synthesize a multi-source research report. Thryve cross-references medical databases to provide the most current insights.
            </Text>
          </View>
        )}
      </Animated.View>

      {/* Correlation Chart Card */}
      <Animated.View 
        entering={FadeInUp.delay(300)}
        style={styles.card} 
        className="bg-white dark:bg-slate-800 border border-slate-50 dark:border-slate-700 shadow-xl"
      >
        <View className="flex-row justify-between items-start mb-8">
          <View>
            <View className="flex-row items-center mb-1">
              <BarChart3 size={20} color="#6EC1E4" style={{ marginRight: 10 }} />
              <Text className="font-bold text-slate-800 dark:text-white text-lg">Biometric Flow</Text>
            </View>
            <Text className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Mood & Physical Activity Correlation</Text>
          </View>
        </View>

        <View style={styles.chartArea}>
          <View style={styles.yAxis}>
            <Text style={styles.axisLabel}>Peak</Text>
            <Text style={styles.axisLabel}>Mid</Text>
            <Text style={styles.axisLabel}>Base</Text>
          </View>
          
          <View style={styles.chartBars}>
            {weeklyData.map((d, i) => (
              <BarGroup key={i} data={d} progress={chartProgress} />
            ))}
          </View>
        </View>

        <View style={styles.legend}>
          <View className="flex-row items-center mr-4">
            <View className="w-2 h-2 rounded-full bg-[#4CB8A4] mr-2" />
            <Text style={styles.legendText}>Mood</Text>
          </View>
          <View className="flex-row items-center">
            <View className="w-2 h-2 rounded-full bg-[#6EC1E4] mr-2" />
            <Text style={styles.legendText}>Activity</Text>
          </View>
        </View>
      </Animated.View>
      
      <View style={{ height: 120 }} />
    </ScrollView>
  );
};

interface BarGroupProps {
  data: any;
  progress: any;
}

// Fixed: Added explicit React.FC typing to resolve "Property 'key' does not exist" in JSX iterations
const BarGroup: React.FC<BarGroupProps> = ({ data, progress }) => {
  const moodStyle = useAnimatedStyle(() => ({
    height: `${data.mood * progress.value}%`,
  }));

  const activityStyle = useAnimatedStyle(() => ({
    height: `${data.activity * progress.value}%`,
  }));

  return (
    <View style={styles.barGroupWrapper}>
      <View style={styles.barPair}>
        <View style={styles.barTrack} className="bg-slate-50 dark:bg-slate-900">
          <Animated.View style={[styles.bar, moodStyle]} className="bg-[#4CB8A4]" />
        </View>
        <View style={styles.barTrack} className="bg-slate-50 dark:bg-slate-900">
          <Animated.View style={[styles.bar, activityStyle]} className="bg-[#6EC1E4]" />
        </View>
      </View>
      <Text style={styles.chartLabel}>{data.day}</Text>
    </View>
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
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 14,
    marginTop: 4,
    lineHeight: 20,
  },
  card: {
    borderRadius: 35,
    padding: 24,
    marginBottom: 24,
  },
  searchBar: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  inputWrapper: {
    flex: 1,
    borderRadius: 18,
    paddingHorizontal: 16,
    height: 54,
    justifyContent: 'center',
  },
  input: {
    fontSize: 14,
    fontWeight: '500',
  },
  searchButton: {
    width: 54,
    height: 54,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#4CB8A4',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  emptyState: {
    padding: 24,
    borderRadius: 20,
    marginTop: 8,
  },
  researchText: {
    fontSize: 13,
    lineHeight: 24,
    marginBottom: 20,
    fontWeight: '400',
  },
  divider: {
    height: 1,
    width: '100%',
    marginBottom: 16,
  },
  sourcesContainer: {
    gap: 8,
  },
  sourceLink: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 12,
    borderRadius: 14,
  },
  sourceText: {
    fontSize: 11,
    color: '#4CB8A4',
    fontWeight: 'bold',
    maxWidth: '85%',
  },
  chartArea: {
    height: 200,
    flexDirection: 'row',
    marginTop: 10,
  },
  yAxis: {
    justifyContent: 'space-between',
    paddingVertical: 10,
    marginRight: 15,
  },
  axisLabel: {
    fontSize: 9,
    fontWeight: 'bold',
    color: '#94A3B8',
    textTransform: 'uppercase',
  },
  chartBars: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  barGroupWrapper: {
    alignItems: 'center',
    flex: 1,
  },
  barPair: {
    flexDirection: 'row',
    gap: 4,
    height: 140,
    alignItems: 'flex-end',
  },
  barTrack: {
    width: 8,
    height: '100%',
    borderRadius: 4,
    overflow: 'hidden',
    justifyContent: 'flex-end',
  },
  bar: {
    width: '100%',
    borderRadius: 4,
  },
  chartLabel: {
    fontSize: 9,
    fontWeight: 'bold',
    color: '#94A3B8',
    marginTop: 12,
  },
  legend: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 24,
  },
  legendText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#64748B',
    textTransform: 'uppercase',
  }
});

export default InsightsScreen;
