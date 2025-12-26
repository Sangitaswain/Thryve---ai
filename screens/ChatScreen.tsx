
import React, { useState, useRef, useEffect } from 'react';
import { Message } from '../types';
import { getGeminiResponse } from '../services/geminiService';

interface ChatScreenProps {
  onBack: () => void;
  isDarkMode: boolean;
}

const ChatScreen: React.FC<ChatScreenProps> = ({ onBack, isDarkMode }) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: "Hello! I'm Thryve AI, your personal wellness coach. How can I help you today? You can ask me about sleep optimization, nutrition, stress management, or building better habits.",
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    const responseText = await getGeminiResponse(input);
    
    const assistantMessage: Message = {
      id: (Date.now() + 1).toString(),
      role: 'assistant',
      content: responseText || "I'm sorry, I couldn't generate a response. Please try again.",
      timestamp: new Date()
    };

    setMessages(prev => [...prev, assistantMessage]);
    setIsLoading(false);
  };

  return (
    <div className="flex flex-col h-screen bg-[#EEF2F6] dark:bg-[#0F172A] transition-colors duration-500">
      {/* Header */}
      <header className="bg-white dark:bg-[#1E293B] p-4 border-b border-slate-100 dark:border-slate-800 flex items-center gap-4 sticky top-0 z-20 transition-colors">
        <button onClick={onBack} className="p-2 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-full text-slate-500 dark:text-[#9CA3AF] transition-colors">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" /></svg>
        </button>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-[#4CB8A4] flex items-center justify-center text-white text-xl shadow-lg shadow-[#4CB8A4]/20">✨</div>
          <div>
            <h2 className="font-semibold text-[#1F2933] dark:text-[#E5E7EB] leading-tight transition-colors">Thryve AI</h2>
            <div className="flex items-center gap-1.5">
              <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
              <span className="text-[10px] text-[#6B7280] dark:text-[#9CA3AF] font-bold uppercase tracking-wider transition-colors">Thinking Enabled</span>
            </div>
          </div>
        </div>
      </header>

      {/* Chat Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[85%] p-4 rounded-3xl ${
              msg.role === 'user' 
              ? 'bg-[#4CB8A4] text-white rounded-br-none shadow-md' 
              : 'bg-white dark:bg-[#1E293B] text-[#1F2933] dark:text-[#E5E7EB] border border-slate-100 dark:border-slate-800 shadow-[0_4px_12px_rgba(0,0,0,0.03)] rounded-bl-none transition-colors'
            }`}>
              <p className="text-sm leading-relaxed whitespace-pre-wrap font-normal">{msg.content}</p>
              <p className={`text-[9px] mt-2 font-medium opacity-50 ${msg.role === 'user' ? 'text-white/80' : 'text-[#6B7280] dark:text-[#9CA3AF] transition-colors'}`}>
                {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </p>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-[#4CB8A4]/10 border border-[#4CB8A4]/20 p-4 rounded-3xl rounded-bl-none max-w-[85%] flex flex-col gap-2">
               <div className="flex gap-1.5">
                  <div className="w-1.5 h-1.5 bg-[#4CB8A4] rounded-full animate-bounce"></div>
                  <div className="w-1.5 h-1.5 bg-[#4CB8A4] rounded-full animate-bounce delay-75"></div>
                  <div className="w-1.5 h-1.5 bg-[#4CB8A4] rounded-full animate-bounce delay-150"></div>
               </div>
               <p className="text-[10px] font-bold text-[#4CB8A4] uppercase tracking-widest">AI is thinking...</p>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 bg-white dark:bg-[#1E293B] border-t border-slate-100 dark:border-slate-800 flex items-center gap-3 transition-colors">
        <div className="flex-1 bg-[#EEF2F6] dark:bg-[#0F172A] rounded-2xl px-4 py-3 flex items-center gap-2 border border-slate-100 dark:border-slate-800 focus-within:border-[#4CB8A4] transition-colors">
          <input 
            type="text" 
            placeholder="Ask anything about your health..." 
            className="flex-1 bg-transparent text-sm text-[#1F2933] dark:text-[#E5E7EB] outline-none placeholder-[#6B7280] dark:placeholder-[#9CA3AF] transition-colors"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          />
        </div>
        <button 
          onClick={handleSend}
          disabled={isLoading || !input.trim()}
          className="w-12 h-12 rounded-2xl bg-[#4CB8A4] text-white flex items-center justify-center shadow-lg shadow-[#4CB8A4]/20 disabled:opacity-50 disabled:shadow-none transform active:scale-95 transition-all"
        >
          <svg className="w-6 h-6 transform rotate-90" fill="currentColor" viewBox="0 0 24 24"><path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" /></svg>
        </button>
      </div>
      {/* Safe Area Spacer for Bottom Nav */}
      <div className="h-20 bg-white dark:bg-[#1E293B] transition-colors"></div>
    </div>
  );
};

export default ChatScreen;