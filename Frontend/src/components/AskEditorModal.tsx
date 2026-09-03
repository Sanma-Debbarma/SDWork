import React, { useState } from 'react';
import { X, Sparkles, Send, Bot } from 'lucide-react';

interface AskEditorModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AskEditorModal: React.FC<AskEditorModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [messages, setMessages] = useState<{ sender: 'ai' | 'user'; text: string }[]>([
    {
      sender: 'ai',
      text: 'Hello Ani Vex! I am your Editor AI Assistant. How can I help you manage or optimize your creative projects today?',
    },
  ]);
  const [input, setInput] = useState('');

  if (!isOpen) return null;

  const quickPrompts = [
    'How should I price a mobile UI/UX redesign?',
    'What are trending design styles this month?',
    'Tips for writing higher converting project briefs',
    'Best tech stacks for SaaS MVPs',
  ];

  const handleSend = (textToSend?: string) => {
    const q = textToSend || input;
    if (!q.trim()) return;

    const newMessages = [...messages, { sender: 'user' as const, text: q }];
    setMessages(newMessages);
    setInput('');

    setTimeout(() => {
      let reply = 'Here is an insight from Editor: based on current channel data, projects with interactive Figma prototypes and clear milestones convert 42% faster.';
      if (q.toLowerCase().includes('price') || q.toLowerCase().includes('budget')) {
        reply = 'For mobile UI/UX redesigns, typical market rates in Editor range between $1,500 - $3,500 depending on screen counts and native design token deliverables.';
      } else if (q.toLowerCase().includes('trend') || q.toLowerCase().includes('style')) {
        reply = 'Current top trends include 3D tactile isometric icons, glassmorphic HUD overlays, clean bento-box layouts, and pastel high-contrast typography.';
      }

      setMessages((prev) => [...prev, { sender: 'ai', text: reply }]);
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl border border-gray-100 overflow-hidden flex flex-col h-[520px]">
        {/* Header */}
        <div className="px-5 py-3.5 border-b border-gray-100 flex items-center justify-between bg-gradient-to-r from-purple-50 via-white to-indigo-50">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-purple-600 text-white flex items-center justify-center shadow-xs">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-gray-900">Ask Editor AI</h3>
              <p className="text-[11px] text-gray-500">Intelligent channel & project advisor</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Chat Body */}
        <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-[#FAF9FC]">
          {messages.map((m, idx) => (
            <div
              key={idx}
              className={`flex items-start gap-2.5 ${
                m.sender === 'user' ? 'justify-end' : 'justify-start'
              }`}
            >
              {m.sender === 'ai' && (
                <div className="w-7 h-7 rounded-full bg-purple-100 text-purple-700 flex items-center justify-center flex-shrink-0 text-xs mt-0.5">
                  <Bot className="w-4 h-4" />
                </div>
              )}
              <div
                className={`max-w-[80%] rounded-2xl px-3.5 py-2.5 text-xs leading-relaxed ${
                  m.sender === 'user'
                    ? 'bg-purple-600 text-white rounded-tr-xs'
                    : 'bg-white text-gray-800 border border-gray-100 rounded-tl-xs shadow-xs'
                }`}
              >
                {m.text}
              </div>
            </div>
          ))}
        </div>

        {/* Quick Prompts */}
        <div className="px-4 py-2 bg-white border-t border-gray-100 flex items-center gap-1.5 overflow-x-auto no-scrollbar">
          {quickPrompts.map((prompt, idx) => (
            <button
              key={idx}
              onClick={() => handleSend(prompt)}
              className="text-[10.5px] whitespace-nowrap bg-gray-50 hover:bg-purple-50 hover:text-purple-700 text-gray-600 px-2.5 py-1 rounded-full border border-gray-200 transition-colors"
            >
              {prompt}
            </button>
          ))}
        </div>

        {/* Input Footer */}
        <div className="p-3 bg-white border-t border-gray-100">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask anything about projects, budgets, or strategy..."
              className="flex-1 px-3.5 py-2 text-xs border border-gray-200 rounded-xl focus:border-purple-500 focus:ring-1 focus:ring-purple-500 outline-none"
            />
            <button
              type="submit"
              disabled={!input.trim()}
              className="p-2 bg-purple-600 hover:bg-purple-700 disabled:opacity-40 text-white rounded-xl transition"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
