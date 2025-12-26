
export type TabType = 'home' | 'track' | 'insights' | 'profile' | 'chat';

export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  isThinking?: boolean;
}

export interface MetricCard {
  title: string;
  value: string;
  unit: string;
  icon: string;
  color: string;
  trend?: string;
}

export interface Habit {
  id: string;
  name: string;
  completed: boolean;
  category: string;
}

export interface AIInsight {
  id: string;
  type: 'sleep' | 'mood' | 'activity' | 'hydration' | 'journaling';
  content: string;
  suggestion: string;
  icon: string;
}
