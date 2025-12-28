
import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView, ScrollView, Platform, Dimensions } from 'react-native';
import * as Haptics from 'expo-haptics';
import { Mic, X, Activity, AlertCircle, Volume2 } from 'lucide-react-native';
import Animated, { useSharedValue, useAnimatedStyle, withRepeat, withTiming, interpolate, withSpring } from 'react-native-reanimated';
import { GoogleGenAI, Modality, LiveServerMessage, Blob } from '@google/genai';
import { atob, btoa } from '../services/geminiService';
import '../types';

const { height } = Dimensions.get('window');

interface VoiceCoachOverlayProps {
  onClose: () => void;
}

// Efficient PCM Blob creation for Gemini Live API
function createBlob(data: Float32Array): Blob {
  const l = data.length;
  const int16 = new Int16Array(l);
  for (let i = 0; i < l; i++) {
    // Clamp values to prevent distortion and ensure valid Int16 range
    int16[i] = Math.max(-1, Math.min(1, data[i])) * 32767;
  }
  
  // Convert Int16Array buffer to base64 via a more robust method
  const uint8 = new Uint8Array(int16.buffer);
  let binary = '';
  const step = 8192; // Chunking to prevent string length limits
  for (let i = 0; i < uint8.length; i += step) {
    binary += String.fromCharCode.apply(null, Array.from(uint8.subarray(i, i + step)));
  }
  
  return {
    data: btoa(binary),
    mimeType: 'audio/pcm;rate=16000',
  };
}

function decodeBase64(base64: string): Uint8Array {
  try {
    const binaryString = atob(base64);
    const len = binaryString.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    return bytes;
  } catch (e) {
    console.error("Base64 decoding failed:", e);
    return new Uint8Array();
  }
}

async function decodeAudioData(
  data: Uint8Array,
  ctx: any,
  sampleRate: number,
  numChannels: number,
): Promise<any> {
  const dataInt16 = new Int16Array(data.buffer);
  const frameCount = dataInt16.length / numChannels;
  const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);

  for (let channel = 0; channel < numChannels; channel++) {
    const channelData = buffer.getChannelData(channel);
    for (let i = 0; i < frameCount; i++) {
      channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
    }
  }
  return buffer;
}

const VoiceCoachOverlay: React.FC<VoiceCoachOverlayProps> = ({ onClose }) => {
  const [status, setStatus] = useState<'connecting' | 'listening' | 'speaking' | 'error' | 'unsupported'>('connecting');
  const [transcription, setTranscription] = useState<string[]>([]);
  const pulse = useSharedValue(1);
  const micLevel = useSharedValue(0);
  const sessionPromiseRef = useRef<Promise<any> | null>(null);
  const scrollRef = useRef<ScrollView>(null);
  
  const inputContextRef = useRef<any>(null);
  const outputContextRef = useRef<any>(null);
  const nextStartTimeRef = useRef<number>(0);
  const sourcesRef = useRef<Set<any>>(new Set());

  useEffect(() => {
    const AudioContextClass = (window as any).AudioContext || (window as any).webkitAudioContext;
    
    if (AudioContextClass) {
      inputContextRef.current = new AudioContextClass({ sampleRate: 16000 });
      outputContextRef.current = new AudioContextClass({ sampleRate: 24000 });
      connectToLiveAI();
    } else {
      setStatus('unsupported');
    }
    
    return () => {
      if (inputContextRef.current) inputContextRef.current.close();
      if (outputContextRef.current) outputContextRef.current.close();
    };
  }, []);

  const connectToLiveAI = async () => {
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      sessionPromiseRef.current = ai.live.connect({
        model: 'gemini-2.5-flash-native-audio-preview-09-2025',
        callbacks: {
          onopen: () => {
            setStatus('listening');
            pulse.value = withRepeat(withTiming(1.2, { duration: 1200 }), -1, true);
            startMicrophone();
            if (Haptics?.impactAsync) Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium).catch(() => {});
          },
          onmessage: async (message: LiveServerMessage) => {
            if (message.serverContent?.outputTranscription) {
              const text = message.serverContent.outputTranscription.text;
              setTranscription(prev => [...prev, `Coach: ${text}`]);
              setStatus('speaking');
              setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 100);
            }
            
            const base64Audio = message.serverContent?.modelTurn?.parts?.[0]?.inlineData?.data;
            if (base64Audio && outputContextRef.current) {
              const ctx = outputContextRef.current;
              // Resume context if suspended by browser policy
              if (ctx.state === 'suspended') ctx.resume();
              
              nextStartTimeRef.current = Math.max(nextStartTimeRef.current, ctx.currentTime);
              
              const audioBuffer = await decodeAudioData(
                decodeBase64(base64Audio),
                ctx,
                24000,
                1
              );
              
              const source = ctx.createBufferSource();
              source.buffer = audioBuffer;
              source.connect(ctx.destination);
              source.addEventListener('ended', () => {
                sourcesRef.current.delete(source);
                if (sourcesRef.current.size === 0) setStatus('listening');
              });
              
              source.start(nextStartTimeRef.current);
              nextStartTimeRef.current += audioBuffer.duration;
              sourcesRef.current.add(source);
            }

            if (message.serverContent?.interrupted) {
              for (const source of sourcesRef.current.values()) {
                try { source.stop(); } catch (e) {}
              }
              sourcesRef.current.clear();
              nextStartTimeRef.current = 0;
              setStatus('listening');
            }
          },
          onerror: (e) => {
            console.error('Live API Error:', e);
            setStatus('error');
          },
          onclose: () => setStatus('connecting'),
        },
        config: {
          responseModalities: [Modality.AUDIO],
          outputAudioTranscription: {},
          speechConfig: {
            voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Zephyr' } },
          },
          systemInstruction: 'You are Coach Thryve, an elite wellness strategist. Be pithy, warm, and hyper-focused on preventive health. Speak in 1-2 short sentences.',
        },
      });
    } catch (e) {
      console.error('Failed to connect to Live AI:', e);
      setStatus('error');
    }
  };

  const startMicrophone = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const ctx = inputContextRef.current;
      if (ctx.state === 'suspended') ctx.resume();

      const source = ctx.createMediaStreamSource(stream);
      const scriptProcessor = ctx.createScriptProcessor(4096, 1, 1);
      
      scriptProcessor.onaudioprocess = (e: any) => {
        const inputData = e.inputBuffer.getChannelData(0);
        
        // Simple mic level visualization
        let sum = 0;
        for (let i = 0; i < inputData.length; i++) sum += inputData[i] * inputData[i];
        micLevel.value = withSpring(Math.sqrt(sum / inputData.length) * 10);

        const pcmBlob = createBlob(inputData);
        // CRITICAL: Ensure data is sent via the session promise as per guidelines
        sessionPromiseRef.current?.then((session) => {
          session.sendRealtimeInput({ media: pcmBlob });
        });
      };
      
      source.connect(scriptProcessor);
      scriptProcessor.connect(ctx.destination);
    } catch (e) {
      console.error("Mic access denied:", e);
      setStatus('error');
    }
  };

  const animatedOrbStyle = useAnimatedStyle(() => ({
    transform: [{ scale: pulse.value + micLevel.value * 0.5 }],
    backgroundColor: status === 'speaking' ? '#6EC1E4' : '#4CB8A4',
    opacity: interpolate(pulse.value, [1, 1.2], [1, 0.8]),
  }));

  const animatedRingStyle = useAnimatedStyle(() => ({
    transform: [{ scale: interpolate(pulse.value, [1, 1.2], [1, 1.5]) }],
    opacity: interpolate(pulse.value, [1, 1.2], [0.4, 0]),
  }));

  const handleEnd = () => {
    if (Haptics?.notificationAsync) Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning).catch(() => {});
    onClose();
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.main}>
        <View style={styles.header}>
          <TouchableOpacity onPress={handleEnd} style={styles.miniClose}>
            <X size={20} color="#94A3B8" />
          </TouchableOpacity>
          <Text style={styles.label}>AI Preventive Coach</Text>
          <Text style={styles.title}>
            {status === 'connecting' ? 'Calibrating...' : 
             status === 'listening' ? 'Listening' : 
             status === 'speaking' ? 'Coach Speaking' :
             status === 'unsupported' ? 'Mobile Bridge Required' : 'Session Ready'}
          </Text>
        </View>

        <View style={styles.visualizer}>
          {status === 'unsupported' ? (
            <View>
              <AlertCircle size={44} color="#EF4444" />
              <Text style={styles.errorText}>
                Live PCM Audio requires a native hardware bridge. Please test in a compatible environment.
              </Text>
            </View>
          ) : (
            <View style={styles.orbContainer}>
              <Animated.View style={[styles.ring, animatedRingStyle]} />
              <Animated.View style={[styles.orb, animatedOrbStyle]}>
                {status === 'speaking' ? <Volume2 color="white" size={40} /> : <Mic color="white" size={40} />}
              </Animated.View>
            </View>
          )}
        </View>

        <View style={styles.chatWindow}>
          <ScrollView 
            ref={scrollRef}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.scrollContent}
          >
            {transcription.length === 0 ? (
              <Text style={styles.hintText}>
                "What's my strategy for today?"{'\n'}
                "Tell me about circadian hygiene."
              </Text>
            ) : (
              transcription.map((line, idx) => (
                <View key={idx} style={styles.bubble}>
                  <Text style={styles.bubbleText}>
                    {line}
                  </Text>
                </View>
              ))
            )}
          </ScrollView>
        </View>

        <TouchableOpacity 
          onPress={handleEnd} 
          style={styles.endButton}
        >
          <Text style={styles.endButtonText}>Finish Chat</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#EEF2F6',
  },
  main: {
    flex: 1,
    padding: 24,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  header: {
    alignItems: 'center',
    width: '100%',
  },
  miniClose: {
    position: 'absolute',
    left: 0,
    top: 0,
    padding: 10,
  },
  label: {
    fontSize: 9,
    fontWeight: 'bold',
    textTransform: 'uppercase',
    letterSpacing: 3,
    color: '#94A3B8',
    marginBottom: 6,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
  },
  visualizer: {
    height: 300,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  orbContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  ring: {
    position: 'absolute',
    width: 140,
    height: 140,
    borderRadius: 70,
    borderWidth: 2,
    borderColor: '#4CB8A4',
  },
  orb: {
    width: 100,
    height: 100,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
  },
  errorText: {
    textAlign: 'center',
    fontSize: 12,
    lineHeight: 18,
    color: '#94A3B8',
    fontStyle: 'italic',
  },
  chatWindow: {
    width: '100%',
    height: height * 0.25,
    borderRadius: 30,
    overflow: 'hidden',
  },
  scrollContent: {
    padding: 20,
  },
  bubble: {
    padding: 16,
    borderRadius: 20,
    borderBottomLeftRadius: 4,
    marginBottom: 12,
    alignSelf: 'flex-start',
    maxWidth: '90%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
  },
  bubbleText: {
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '500',
  },
  hintText: {
    textAlign: 'center',
    fontSize: 12,
    color: '#94A3B8',
    lineHeight: 22,
    marginTop: 20,
    fontStyle: 'italic',
  },
  endButton: {
    width: '100%',
    height: 64,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  endButtonText: {
    fontSize: 13,
    fontWeight: 'bold',
    textTransform: 'uppercase',
    letterSpacing: 1,
  }
});

export default VoiceCoachOverlay;
