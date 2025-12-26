
import React, { useState, useRef, useEffect } from 'react';
import { Message } from '../types';
import { getGeminiResponse } from '../services/geminiService';

interface ChatScreenProps {
  onBack: () => void;
}

const ChatScreen: React.FC<ChatScreenProps> = ({ onBack }) => {
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
    <div className="flex flex-col h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white p-4 border-b border-slate-100 flex items-center gap-4 sticky top-0 z-20">
        <button onClick={onBack} className="p-2 hover:bg-slate-50 rounded-full text-slate-500">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" /></svg>
        </button>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-indigo-600 flex items-center justify-center text-white text-xl shadow-lg shadow-indigo-200">✨</div>
          <div>
            <h2 className="font-bold text-slate-800 leading-tight">Thryve AI</h2>
            <div className="flex items-center gap-1.5">
              <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Thinking Enabled</span>
            </div>
          </div>
        </div>
      </header>

      {/* Chat Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[85%] p-4 rounded-3xl ${msg.role === 'user' ? 'bg-indigo-600 text-white rounded-br-none' : 'bg-white text-slate-800 border border-slate-100 shadow-sm rounded-bl-none'}`}>
              <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.content}</p>
              <p className={`text-[9px] mt-2 font-medium opacity-50 ${msg.role === 'user' ? 'text-indigo-100' : 'text-slate-400'}`}>
                {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </p>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-indigo-50 border border-indigo-100 p-4 rounded-3xl rounded-bl-none max-w-[85%] flex flex-col gap-2">
               <div className="flex gap-1.5">
                  <div className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce"></div>
                  <div className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce delay-75"></div>
                  <div className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce delay-150"></div>
               </div>
               <p className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest">AI is thinking...</p>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 bg-white border-t border-slate-100 flex items-center gap-3">
        <div className="flex-1 bg-slate-50 rounded-2xl px-4 py-3 flex items-center gap-2 border border-slate-100 focus-within:border-indigo-300 transition-colors">
          <input 
            type="text" 
            placeholder="Ask anything about your health..." 
            className="flex-1 bg-transparent text-sm text-slate-700 outline-none"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          />
        </div>
        <button 
          onClick={handleSend}
          disabled={isLoading || !input.trim()}
          className="w-12 h-12 rounded-2xl bg-indigo-600 text-white flex items-center justify-center shadow-lg shadow-indigo-200 disabled:opacity-50 disabled:shadow-none transform active:scale-95 transition-all"
        >
          <svg className="w-6 h-6 transform rotate-90" fill="currentColor" viewBox="0 0 24 24"><path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" /></svg>
        </button>
      </div>
      {/* Safe Area Spacer for Bottom Nav */}
      <div className="h-20 md:hidden bg-white"></div>
    </div>
  );
};

export default ChatScreen;
