
import React, { useState, useRef, useEffect } from 'react';
import { View, Text, ScrollView, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, Modal, StyleSheet, SafeAreaView, ActivityIndicator } from 'react-native';
import { ChevronLeft, Mic, Send, Camera, Sparkles } from 'lucide-react-native';
import { Message, MealAnalysis } from '../types';
import { createChatSession, analyzeMealImage } from '../services/geminiService';
import VoiceCoachOverlay from '../components/VoiceCoachOverlay';
import * as Haptics from 'expo-haptics';
import Animated, { FadeIn } from 'react-native-reanimated';

interface ChatScreenProps {
  onBack: () => void;
  isDarkMode: boolean;
}

const ChatScreen: React.FC<ChatScreenProps> = ({ onBack, isDarkMode }) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: "Hello! I'm Coach Thryve. I'm here to help you optimize your health markers and daily performance. How are you feeling today?",
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [isStreaming, setIsStreaming] = useState(false);
  const [showVoiceSession, setShowVoiceSession] = useState(false);
  const scrollViewRef = useRef<ScrollView>(null);
  
  // Persistent chat session to maintain history
  const chatSessionRef = useRef<any>(null);

  useEffect(() => {
    chatSessionRef.current = createChatSession();
  }, []);

  const handleSend = async () => {
    if (!input.trim() || isStreaming) return;

    const userMessageId = Date.now().toString();
    const userMessage: Message = {
      id: userMessageId,
      role: 'user',
      content: input,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    const currentInput = input;
    setInput('');
    setIsStreaming(true);
    
    if (Haptics?.impactAsync) Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium).catch(() => {});

    try {
      const assistantMessageId = (Date.now() + 1).toString();
      // Initialize an empty message for the streaming response
      setMessages(prev => [...prev, {
        id: assistantMessageId,
        role: 'assistant',
        content: '',
        timestamp: new Date(),
        isThinking: true
      }]);

      const stream = await chatSessionRef.current.sendMessageStream({ message: currentInput });
      let fullText = '';

      for await (const chunk of stream) {
        const textChunk = chunk.text;
        if (textChunk) {
          fullText += textChunk;
          // Update the specific message in state
          setMessages(prev => prev.map(msg => 
            msg.id === assistantMessageId 
              ? { ...msg, content: fullText, isThinking: false } 
              : msg
          ));
        }
      }
      
      if (Haptics?.notificationAsync) Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});
    } catch (error) {
      console.error("Streaming error:", error);
      setMessages(prev => [...prev, {
        id: Date.now().toString(),
        role: 'assistant',
        content: "I'm sorry, I'm having trouble connecting to the network. Could you try that again?",
        timestamp: new Date()
      }]);
    } finally {
      setIsStreaming(false);
    }
  };

  const handleCameraScan = async () => {
    if (Haptics?.impactAsync) Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy).catch(() => {});
    
    // Simulate meal analysis flow
    setIsStreaming(true);
    const mockImage = "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==";
    
    try {
      const analysis: MealAnalysis = await analyzeMealImage(mockImage);
      const foodContext = `I just ate ${analysis.foodName}. It has ${analysis.protein} protein, ${analysis.carbs} carbs, and ${analysis.fats} fats. Health rating: ${analysis.healthRating}/10. Summary: ${analysis.summary}`;
      
      // Add the user "scan" as a message
      setMessages(prev => [...prev, {
        id: Date.now().toString(),
        role: 'user',
        content: `📸 Scanned my meal: ${analysis.foodName}`,
        timestamp: new Date()
      }]);

      // Trigger AI coach response about the meal
      setInput(`Can you give me a coaching tip based on this ${analysis.foodName}?`);
      // We don't call handleSend directly here to avoid state race, 
      // instead we can just trigger the flow manually if needed or set input for user to confirm.
      // For UX, let's auto-send the query.
      setTimeout(() => handleSend(), 100);
    } catch (e) {
      setIsStreaming(false);
    }
  };

  const startVoiceSession = () => {
    if (Haptics?.impactAsync) Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy).catch(() => {});
    setShowVoiceSession(true);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.container}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}
      >
        <Modal visible={showVoiceSession} animationType="slide" transparent={false}>
          <VoiceCoachOverlay onClose={() => setShowVoiceSession(false)} />
        </Modal>

        <View style={styles.header} className="bg-white dark:bg-slate-800 border-b border-slate-100 dark:border-slate-700">
          <View style={styles.headerLeft}>
            <TouchableOpacity onPress={onBack} style={styles.backButton}>
              <ChevronLeft color={isDarkMode ? 'white' : '#1E293B'} size={24} />
            </TouchableOpacity>
            <View>
              <Text style={styles.headerTitle} className="text-slate-900 dark:text-white">Coach Thryve</Text>
              <View className="flex-row items-center gap-1">
                <View style={styles.statusDot} className="bg-emerald-500" />
                <Text style={styles.statusLabel}>Live Intelligence</Text>
              </View>
            </View>
          </View>
          <TouchableOpacity 
            onPress={startVoiceSession}
            style={styles.voiceFab}
            className="bg-teal-50 dark:bg-slate-900 border border-[#4CB8A4]/20"
          >
            <Mic color="#4CB8A4" size={20} />
          </TouchableOpacity>
        </View>

        <ScrollView 
          ref={scrollViewRef}
          style={styles.chatArea}
          contentContainerStyle={styles.chatContent}
          onContentSizeChange={() => scrollViewRef.current?.scrollToEnd({ animated: true })}
          showsVerticalScrollIndicator={false}
        >
          {messages.map((msg) => (
            <Animated.View 
              entering={FadeIn.duration(300)}
              key={msg.id} 
              style={[styles.messageRow, msg.role === 'user' ? styles.messageRowUser : styles.messageRowAssistant]}
            >
              <View 
                style={[styles.messageBubble, msg.role === 'user' ? styles.bubbleUser : styles.bubbleAssistant]}
                className={msg.role === 'user' ? 'bg-[#4CB8A4]' : 'bg-white dark:bg-slate-800 border-slate-100 dark:border-slate-700'}
              >
                {msg.isThinking ? (
                  <View className="flex-row items-center space-x-2 py-1">
                    <ActivityIndicator size="small" color="#4CB8A4" />
                    <Text className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Processing...</Text>
                  </View>
                ) : (
                  <>
                    <Text style={[styles.messageText, msg.role === 'user' ? styles.textUser : styles.textAssistant]} className={msg.role !== 'user' ? 'text-slate-800 dark:text-slate-200' : ''}>
                      {msg.content}
                    </Text>
                    <Text style={[styles.timestamp, msg.role === 'user' ? styles.timeUser : styles.timeAssistant]}>
                      {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </Text>
                  </>
                )}
              </View>
            </Animated.View>
          ))}
        </ScrollView>

        <View style={styles.inputArea} className="bg-white dark:bg-slate-800 border-t border-slate-100 dark:border-slate-700">
          <TouchableOpacity 
            onPress={handleCameraScan}
            style={styles.actionButton}
            className="bg-slate-50 dark:bg-slate-900"
          >
            <Camera color="#94A3B8" size={22} />
          </TouchableOpacity>

          <View style={styles.inputWrapper} className="bg-slate-50 dark:bg-slate-900">
            {/* Fix: moved maxHeight from prop to style object to fix TypeScript error */}
            <TextInput 
              style={[styles.textInput, { maxHeight: 100 }]}
              className="text-slate-800 dark:text-white"
              placeholder="Ask Coach Thryve..." 
              placeholderTextColor="#94A3B8"
              value={input}
              onChangeText={setInput}
              multiline
            />
          </View>

          <TouchableOpacity 
            onPress={handleSend}
            disabled={isStreaming || !input.trim()}
            style={styles.sendButton}
            className="bg-[#4CB8A4] shadow-teal-500/20 disabled:opacity-30"
          >
            {isStreaming ? (
              <ActivityIndicator color="white" size="small" />
            ) : (
              <Send color="white" size={20} />
            )}
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
  header: {
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    zIndex: 10,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  statusLabel: {
    fontSize: 9,
    fontWeight: 'bold',
    color: '#94A3B8',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  voiceFab: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  chatArea: {
    flex: 1,
  },
  chatContent: {
    padding: 20,
    paddingBottom: 40,
  },
  messageRow: {
    marginBottom: 20,
    flexDirection: 'row',
  },
  messageRowUser: {
    justifyContent: 'flex-end',
  },
  messageRowAssistant: {
    justifyContent: 'flex-start',
  },
  messageBubble: {
    maxWidth: '85%',
    padding: 16,
    borderRadius: 25,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
  },
  bubbleUser: {
    borderBottomRightRadius: 4,
  },
  bubbleAssistant: {
    borderBottomLeftRadius: 4,
    borderWidth: 1,
  },
  messageText: {
    fontSize: 14,
    lineHeight: 22,
  },
  textUser: {
    color: 'white',
  },
  textAssistant: {
    color: '#1E293B',
  },
  timestamp: {
    fontSize: 8,
    marginTop: 8,
    fontWeight: 'bold',
    textTransform: 'uppercase',
    opacity: 0.5,
  },
  timeUser: {
    color: 'white',
    textAlign: 'right',
  },
  timeAssistant: {
    color: '#94A3B8',
  },
  inputArea: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: Platform.OS === 'ios' ? 34 : 16,
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 10,
  },
  actionButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 5,
  },
  inputWrapper: {
    flex: 1,
    borderRadius: 25,
    paddingHorizontal: 16,
    paddingVertical: Platform.OS === 'ios' ? 10 : 5,
    minHeight: 44,
    justifyContent: 'center',
  },
  textInput: {
    fontSize: 14,
    paddingTop: 5,
    paddingBottom: 5,
  },
  sendButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 5,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 3,
  }
});

export default ChatScreen;
