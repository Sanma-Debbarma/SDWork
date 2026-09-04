import React from 'react';
import { Link } from 'react-router-dom';
import { Menu, Search, HelpCircle, Bell, Plus, Sparkles, X } from 'lucide-react';

interface HeaderProps {
  onToggleSidebar: () => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onOpenCreateModal: () => void;
  onOpenAskEditor: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  onToggleSidebar,
  searchQuery,
  onSearchChange,
  onOpenCreateModal,
  onOpenAskEditor,
}) => {
  return (
    <header className="sticky top-0 z-40 h-14 bg-white border-b border-[#EAEAEA] flex items-center justify-between px-4 sm:px-6 select-none">
      {/* Left section: Hamburger + Brand */}
      <div className="flex items-center gap-4">
        <button
          onClick={onToggleSidebar}
          aria-label="Toggle sidebar"
          className="p-2 -ml-1 text-gray-700 hover:bg-gray-100 rounded-full transition-colors active:bg-gray-200 focus:outline-none"
        >
          <Menu className="w-5 h-5" />
        </button>

        <Link to="/" className="flex items-center gap-2 cursor-pointer group">
          {/* Red Play Logo */}
          <div className="w-[30px] h-[21px] bg-[#FF0000] rounded-[6px] flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform">
            <svg
              className="w-3.5 h-3.5 text-white ml-0.5 fill-current"
              viewBox="0 0 24 24"
            >
              <polygon points="6 4, 20 12, 6 20" />
            </svg>
          </div>
          {/* Brand Name */}
          <span className="text-[19px] font-bold text-[#0F0F0F] tracking-tight font-sans">
            Editor
          </span>
        </Link>
      </div>

      {/* Center section: Large Rounded Search Bar */}
      <div className="flex-1 max-w-[540px] mx-4 hidden md:block">
        <div className="relative flex items-center">
          <div className="absolute left-3.5 pointer-events-none text-gray-400">
            <Search className="w-4 h-4" />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search across your channel"
            className="w-full h-10 pl-10 pr-9 bg-[#F2F2F2] hover:bg-[#EAEAEA] focus:bg-white text-sm text-[#0F0F0F] placeholder-gray-500 rounded-full border border-transparent focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => onSearchChange('')}
              className="absolute right-3 p-0.5 text-gray-400 hover:text-gray-700 rounded-full hover:bg-gray-200 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Right section: Icons & Action Buttons */}
      <div className="flex items-center gap-1.5 sm:gap-2">
        {/* Help icon */}
        <button
          aria-label="Help"
          className="p-2 text-gray-600 hover:bg-gray-100 rounded-full transition-colors hidden sm:flex items-center justify-center"
          title="Help & documentation"
        >
          <HelpCircle className="w-5 h-5" />
        </button>

        {/* Notifications Bell */}
        <button
          aria-label="Notifications"
          className="p-2 text-gray-600 hover:bg-gray-100 rounded-full transition-colors relative flex items-center justify-center"
          title="Notifications"
        >
          <Bell className="w-5 h-5" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#FF0000] rounded-full ring-2 ring-white"></span>
        </button>

        {/* Ask Editor Button */}
        <button
          onClick={onOpenAskEditor}
          className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-gradient-to-r from-purple-50 to-indigo-50 text-indigo-700 border border-indigo-200/80 hover:bg-indigo-100/70 transition-all shadow-sm"
        >
          <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
          <span>Ask Editor</span>
        </button>

        {/* + Create Button */}
        <button
          onClick={onOpenCreateModal}
          className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-white hover:bg-gray-50 text-[#0F0F0F] border border-gray-300 transition-all shadow-sm active:scale-95"
        >
          <Plus className="w-4 h-4 text-gray-700 stroke-[2.5]" />
          <span>Create</span>
        </button>

        {/* Profile Avatar */}
        <Link
          to="/settings"
          className="w-8 h-8 rounded-full overflow-hidden border border-purple-400/50 cursor-pointer ml-1 hover:ring-2 hover:ring-purple-400 transition-all flex-shrink-0 bg-[#0F081D]"
          title="Ani Vex Channel - Settings"
        >
          <img
            src="/assets/anivex-avatar.png"
            alt="Ani Vex"
            className="w-full h-full object-cover"
            onError={(e) => {
              (e.currentTarget as HTMLImageElement).src =
                'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=100&auto=format&fit=crop&q=80';
            }}
          />
        </Link>
      </div>
    </header>
  );
};
