import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import {
  LayoutDashboard,
  FolderPlus,
  Briefcase,
  Bookmark,
  DollarSign,
  Settings,
  LogOut,
  X
} from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  activeItem?: string;
  onSelectItem?: (item: string) => void;
  savedCount?: number;
  onLogoutClick: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  isOpen,
  onClose,
  activeItem: _activeItem,
  onSelectItem,
  savedCount = 0,
  onLogoutClick,
}) => {
  const navItems = [
    {
      id: 'dashboard',
      to: '/',
      label: 'Dashboard',
      icon: LayoutDashboard,
      tooltip: 'Main overview & project feed',
    },
    {
      id: 'content',
      to: '/content',
      label: 'Content',
      icon: FolderPlus,
      badge: 'Client',
      badgeColor: 'bg-purple-100 text-purple-700',
      tooltip: 'Post & create services/projects',
    },
    {
      id: 'my-projects',
      to: '/projects',
      label: 'My Projects',
      icon: Briefcase,
      badge: '2 Active',
      badgeColor: 'bg-blue-100 text-blue-700',
      tooltip: 'Active editor jobs & milestones',
    },
    {
      id: 'saved',
      to: '/saved',
      label: 'Saved',
      icon: Bookmark,
      count: savedCount,
      tooltip: 'Bookmarked projects & services',
    },
    {
      id: 'earn',
      to: '/earn',
      label: 'Earn',
      icon: DollarSign,
      tooltip: 'Freelancer earnings & payouts',
    },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40 lg:hidden transition-opacity backdrop-blur-xs"
          onClick={onClose}
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-14 left-0 bottom-0 z-40 w-[196px] bg-white border-r border-[#EAEAEA] flex flex-col justify-between select-none transition-transform duration-200 ease-in-out lg:translate-x-0 ${
          isOpen ? 'translate-x-0 shadow-xl lg:shadow-none' : '-translate-x-full'
        }`}
      >
        <div className="flex-1 overflow-y-auto no-scrollbar pt-5 pb-3">
          {/* Close button on mobile */}
          <div className="flex justify-end px-3 lg:hidden -mt-2 mb-1">
            <button
              onClick={onClose}
              aria-label="Close sidebar"
              className="p-1 text-gray-500 hover:bg-gray-100 rounded-full"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Profile / Channel Area */}
          <Link
            to="/settings"
            onClick={() => {
              if (onSelectItem) onSelectItem('settings');
              if (window.innerWidth < 1024) onClose();
            }}
            className="flex flex-col items-center mb-6 px-4 text-center cursor-pointer group"
          >
            <div className="w-[84px] h-[84px] rounded-full overflow-hidden border-[2.5px] border-purple-500/60 p-0.5 shadow-lg bg-[#0F081D] group-hover:border-purple-400 group-hover:shadow-purple-500/30 transition-all flex items-center justify-center">
              <img
                src="/assets/anivex-avatar.png"
                alt="Ani Vex"
                className="w-full h-full rounded-full object-cover group-hover:scale-105 transition-transform duration-300"
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).src =
                    'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=150&auto=format&fit=crop&q=80';
                }}
              />
            </div>
            <span className="text-[11px] font-medium text-gray-500 mt-2.5 tracking-tight group-hover:text-gray-700 transition">
              Your channel
            </span>
            <h2 className="text-[13px] font-bold text-[#0F0F0F] tracking-tight group-hover:text-purple-700 transition">
              Ani Vex
            </h2>
          </Link>

          {/* Main Navigation Menu */}
          <nav className="px-2 space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.id}
                  to={item.to}
                  end={item.to === '/'}
                  onClick={() => {
                    if (onSelectItem) onSelectItem(item.id);
                    if (window.innerWidth < 1024) onClose();
                  }}
                  title={item.tooltip}
                  className={({ isActive }) =>
                    `w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-[12.5px] font-medium transition-colors ${
                      isActive
                        ? 'bg-[#F2F2F2] text-[#0F0F0F] font-semibold'
                        : 'text-[#606060] hover:bg-[#F9F9F9] hover:text-[#0F0F0F]'
                    }`
                  }
                >
                  {({ isActive }) => (
                    <>
                      <div className="flex items-center gap-3.5 min-w-0">
                        <Icon
                          className={`w-[18px] h-[18px] flex-shrink-0 ${
                            isActive
                              ? 'text-[#0F0F0F]'
                              : 'text-[#606060]'
                          }`}
                        />
                        <span className="truncate">{item.label}</span>
                      </div>

                      {/* Badge or Counter */}
                      {item.count !== undefined && item.count > 0 && (
                        <span className="px-1.5 py-0.5 text-[10px] font-bold bg-purple-100 text-purple-700 rounded-full">
                          {item.count}
                        </span>
                      )}
                      {item.badge && !isActive && (
                        <span className={`px-1.5 py-0.5 text-[9.5px] font-semibold rounded-md ${item.badgeColor}`}>
                          {item.badge}
                        </span>
                      )}
                    </>
                  )}
                </NavLink>
              );
            })}
          </nav>
        </div>

        {/* Bottom Pinned Items: Settings & Logout */}
        <div className="p-2 border-t border-[#F0F0F0] space-y-1">
          {/* Settings */}
          <NavLink
            to="/settings"
            onClick={() => {
              if (onSelectItem) onSelectItem('settings');
              if (window.innerWidth < 1024) onClose();
            }}
            className={({ isActive }) =>
              `w-full flex items-center gap-3.5 px-3.5 py-2.5 rounded-xl text-[12.5px] font-medium transition-colors ${
                isActive
                  ? 'bg-[#F2F2F2] text-[#0F0F0F] font-semibold'
                  : 'text-[#606060] hover:bg-[#F9F9F9] hover:text-[#0F0F0F]'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <Settings
                  className={`w-[18px] h-[18px] flex-shrink-0 ${
                    isActive ? 'text-[#0F0F0F]' : 'text-[#606060]'
                  }`}
                />
                <span className="truncate">Settings</span>
              </>
            )}
          </NavLink>

          {/* Logout */}
          <button
            onClick={() => {
              onLogoutClick();
              if (window.innerWidth < 1024) onClose();
            }}
            className="w-full flex items-center gap-3.5 px-3.5 py-2.5 rounded-xl text-[12.5px] font-medium text-red-600 hover:bg-red-50 hover:text-red-700 transition-colors"
          >
            <LogOut className="w-[18px] h-[18px] flex-shrink-0 text-red-500" />
            <span className="truncate">Logout</span>
          </button>
        </div>
      </aside>
    </>
  );
};

