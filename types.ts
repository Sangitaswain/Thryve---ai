
import 'react-native';

/**
 * Navigation & UI Types
 */
export type TabType = 'home' | 'track' | 'insights' | 'profile' | 'chat';

/**
 * AI & Chat Types
 */
export type GeminiModel =
  | 'gemini-3-flash-preview'
  | 'gemini-3-pro-preview'
  | 'gemini-2.5-flash-native-audio-preview-09-2025';

export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  isThinking?: boolean;
}

/**
 * Domain-Specific AI Response Types
 */
export interface MealAnalysis {
  foodName: string;
  protein: string;
  carbs: string;
  fats: string;
  healthRating: number;
  summary: string;
}

export interface GroundingSource {
  web?: {
    uri: string;
    title: string;
  };
  maps?: {
    uri: string;
    title: string;
    placeAnswerSources?: Array<{
      reviewSnippets?: string[];
    }>;
  };
}

export interface ResearchResult {
  text: string;
  sources: GroundingSource[];
}

/**
 * Health & Wellness Metrics
 */
export interface MetricCard {
  title: string;
  value: string;
  unit: string;
  icon: string;
  color: string;
  trend?: 'up' | 'down' | 'stable';
  trendValue?: string;
}

export interface Habit {
  id: string;
  name: string;
  completed: boolean;
  category: 'Circadian' | 'Nutrition' | 'Mental' | 'Physical' | 'Hydration';
  icon: string;
}

export interface AIInsight {
  id: string;
  type: 'sleep' | 'mood' | 'activity' | 'hydration' | 'journaling';
  content: string;
  suggestion: string;
  icon: string;
  impactLevel: 'low' | 'medium' | 'high';
}

/**
 * User Profile Types
 */
export interface UserProfile {
  name: string;
  avatar: string;
  streak: number;
  activeMinutes: number;
  goalCompletion: number;
  settings: {
    darkMode: boolean;
    notifications: boolean;
    privacyMode: boolean;
  };
}
