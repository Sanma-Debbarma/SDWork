import React, { useState } from 'react';
import {
  MessageSquare,
  Search,
  Send,
  Paperclip,
  CheckCheck,
  Circle,
  MoreVertical,
  Briefcase
} from 'lucide-react';

interface Conversation {
  id: string;
  senderName: string;
  avatar: string;
  projectTitle: string;
  lastMessage: string;
  time: string;
  unreadCount: number;
  online: boolean;
}

const SAMPLE_CONVERSATIONS: Conversation[] = [
  {
    id: 'conv-1',
    senderName: 'Marques Media Labs',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
    projectTitle: 'YouTube Tech Review Dynamic Motion Edit',
    lastMessage: 'The color grading looks exceptional. Can we get the final 4K export render by tomorrow morning?',
    time: '2:40 PM',
    unreadCount: 1,
    online: true,
  },
  {
    id: 'conv-2',
    senderName: 'AuraPay Capital',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80',
    projectTitle: 'Minimalist Fintech Brand Identity Kit',
    lastMessage: 'Escrow payment has been funded for Milestone 2.',
    time: 'Yesterday',
    unreadCount: 0,
    online: false,
  },
  {
    id: 'conv-3',
    senderName: 'Zenith Health Labs',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80',
    projectTitle: 'iOS Habit Tracker UI/UX Prototype',
    lastMessage: 'Reviewed the prototype animations—smooth 60fps!',
    time: 'Aug 28',
    unreadCount: 0,
    online: true,
  },
  {
    id: 'conv-4',
    senderName: 'Nordic Apparel Co.',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=80',
    projectTitle: 'E-commerce Headless Storefront',
    lastMessage: 'Thanks for sending over the revised asset package.',
    time: 'Aug 19',
    unreadCount: 0,
    online: false,
  },
];

export const MessagesView: React.FC = () => {
  const [conversations] = useState<Conversation[]>(SAMPLE_CONVERSATIONS);
  const [activeConvId, setActiveConvId] = useState<string>('conv-1');
  const [searchQuery, setSearchQuery] = useState('');
  const [messages, setMessages] = useState<Record<string, { id: string; sender: 'me' | 'them'; text: string; time: string }[]>>({
    'conv-1': [
      {
        id: 'm1',
        sender: 'them',
        text: 'Hi Ani, we reviewed the initial draft for the YouTube review video. Incredible pacing!',
        time: '1:15 PM',
      },
      {
        id: 'm2',
        sender: 'me',
        text: 'Thanks! I added dynamic sound design hits and keyframed smooth zoom-ins on the product closeups.',
        time: '1:32 PM',
      },
      {
        id: 'm3',
        sender: 'them',
        text: 'The color grading looks exceptional. Can we get the final 4K export render by tomorrow morning?',
        time: '2:40 PM',
      },
    ],
  });
  const [inputText, setInputText] = useState('');

  const activeConv = conversations.find((c) => c.id === activeConvId) || conversations[0];
  const activeMessages = messages[activeConvId] || [];

  const handleSendMessage = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputText.trim()) return;

    const newMsg = {
      id: `m-${Date.now()}`,
      sender: 'me' as const,
      text: inputText.trim(),
      time: 'Just now',
    };

    setMessages((prev) => ({
      ...prev,
      [activeConvId]: [...(prev[activeConvId] || []), newMsg],
    }));

    setInputText('');
  };

  const filteredConversations = conversations.filter(
    (c) =>
      c.senderName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.projectTitle.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-4 animate-in fade-in duration-200">
      {/* View Header */}
      <div>
        <h1 className="text-xl font-bold text-gray-900 tracking-tight flex items-center gap-2">
          <MessageSquare className="w-5 h-5 text-purple-600" />
          <span>Messages & Inquiries</span>
        </h1>
        <p className="text-xs text-gray-500 mt-0.5">
          Communicate directly with clients and collaborators across your active projects
        </p>
      </div>

      {/* Main Messaging Container */}
      <div className="bg-white border border-gray-200 rounded-2xl shadow-xs overflow-hidden h-[620px] flex">
        {/* Left: Conversations Sidebar */}
        <div className="w-full sm:w-[320px] border-r border-gray-100 flex flex-col flex-shrink-0">
          {/* Search bar */}
          <div className="p-3 border-b border-gray-100">
            <div className="relative flex items-center">
              <Search className="w-4 h-4 absolute left-3 text-gray-400 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search conversations..."
                className="w-full pl-9 pr-3 py-1.5 bg-gray-50 hover:bg-gray-100/70 focus:bg-white text-xs text-gray-800 rounded-lg border border-transparent focus:border-purple-300 focus:ring-1 focus:ring-purple-200 outline-none transition"
              />
            </div>
          </div>

          {/* Conversation List */}
          <div className="flex-1 overflow-y-auto divide-y divide-gray-50">
            {filteredConversations.map((conv) => {
              const isSelected = conv.id === activeConvId;
              return (
                <button
                  key={conv.id}
                  onClick={() => setActiveConvId(conv.id)}
                  className={`w-full text-left p-3.5 flex items-start gap-3 transition-colors ${
                    isSelected ? 'bg-purple-50/70' : 'hover:bg-gray-50'
                  }`}
                >
                  <div className="relative flex-shrink-0">
                    <img
                      src={conv.avatar}
                      alt={conv.senderName}
                      className="w-10 h-10 rounded-full object-cover border border-gray-200"
                    />
                    {conv.online && (
                      <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 border-2 border-white rounded-full"></span>
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-0.5">
                      <span className={`text-xs font-semibold truncate ${isSelected ? 'text-purple-950' : 'text-gray-900'}`}>
                        {conv.senderName}
                      </span>
                      <span className="text-[10px] text-gray-400 flex-shrink-0 ml-1">
                        {conv.time}
                      </span>
                    </div>

                    <div className="text-[11px] text-purple-700 font-medium truncate mb-1 flex items-center gap-1">
                      <Briefcase className="w-3 h-3 flex-shrink-0" />
                      <span className="truncate">{conv.projectTitle}</span>
                    </div>

                    <p className="text-[11.5px] text-gray-500 truncate leading-tight">
                      {conv.lastMessage}
                    </p>
                  </div>

                  {conv.unreadCount > 0 && (
                    <span className="w-4 h-4 rounded-full bg-purple-600 text-white text-[9.5px] font-bold flex items-center justify-center flex-shrink-0 mt-1">
                      {conv.unreadCount}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Right: Active Chat View */}
        <div className="hidden sm:flex flex-1 flex-col bg-[#FAFAFA]">
          {/* Chat Header */}
          <div className="h-14 px-5 bg-white border-b border-gray-100 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative">
                <img
                  src={activeConv.avatar}
                  alt={activeConv.senderName}
                  className="w-9 h-9 rounded-full object-cover border border-gray-200"
                />
                {activeConv.online && (
                  <span className="absolute bottom-0 right-0 w-2 h-2 bg-emerald-500 rounded-full ring-2 ring-white"></span>
                )}
              </div>
              <div>
                <h2 className="text-xs font-bold text-gray-900 leading-tight">
                  {activeConv.senderName}
                </h2>
                <span className="text-[10px] text-gray-400 flex items-center gap-1">
                  <Circle className={`w-1.5 h-1.5 ${activeConv.online ? 'fill-emerald-500 text-emerald-500' : 'fill-gray-300 text-gray-300'}`} />
                  {activeConv.online ? 'Online now' : 'Offline'} • {activeConv.projectTitle}
                </span>
              </div>
            </div>

            <button className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-lg">
              <MoreVertical className="w-4 h-4" />
            </button>
          </div>

          {/* Messages Feed */}
          <div className="flex-1 p-5 overflow-y-auto space-y-3.5">
            {activeMessages.map((msg) => {
              const isMe = msg.sender === 'me';
              return (
                <div
                  key={msg.id}
                  className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}
                >
                  <div
                    className={`max-w-md px-4 py-2.5 rounded-2xl text-xs leading-relaxed ${
                      isMe
                        ? 'bg-purple-600 text-white rounded-br-xs shadow-xs'
                        : 'bg-white text-gray-800 border border-gray-100 rounded-bl-xs shadow-2xs'
                    }`}
                  >
                    {msg.text}
                  </div>
                  <span className="text-[9.5px] text-gray-400 mt-1 px-1 flex items-center gap-1">
                    {msg.time}
                    {isMe && <CheckCheck className="w-3 h-3 text-purple-600" />}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Chat Input Bar */}
          <form
            onSubmit={handleSendMessage}
            className="p-3 bg-white border-t border-gray-100 flex items-center gap-2"
          >
            <button
              type="button"
              className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-lg transition"
              title="Attach file"
            >
              <Paperclip className="w-4 h-4" />
            </button>
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Type your message..."
              className="flex-1 px-3 py-2 text-xs bg-gray-50 focus:bg-white text-gray-800 rounded-xl border border-transparent focus:border-purple-300 focus:ring-1 focus:ring-purple-200 outline-none transition"
            />
            <button
              type="submit"
              disabled={!inputText.trim()}
              className="px-3.5 py-2 bg-purple-600 hover:bg-purple-700 disabled:opacity-40 disabled:hover:bg-purple-600 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 transition shadow-xs active:scale-95"
            >
              <span>Send</span>
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
