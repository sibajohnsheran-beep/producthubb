import React from 'react';
import { Search, Bell, Menu, User } from 'lucide-react';

interface HeaderProps {
  onOpenMobileMenu?: () => void;
  searchTerm?: string;
  onSearchChange?: (term: string) => void;
  onSelectTab?: (tab: string) => void;
  currentTab?: string;
  unreadCount?: number;
  onOpenNotifications?: () => void;
  onOpenProfile?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenMobileMenu,
  searchTerm = '',
  onSearchChange,
  onSelectTab,
  currentTab = 'products',
  unreadCount = 1,
  onOpenNotifications,
  onOpenProfile
}) => {
  return (
    <header className="bg-white border-b border-[#c7c4d8]/50 h-16 px-4 md:px-10 sticky top-0 z-10 flex items-center justify-between shadow-[0px_2px_10px_rgba(0,0,0,0.02)]">
      {/* Left side: Mobile Toggle & Global Search */}
      <div className="flex items-center gap-4 flex-1 max-w-lg">
        <button
          onClick={onOpenMobileMenu}
          className="md:hidden p-2 text-[#464555] hover:text-[#191c1d] hover:bg-[#f3f4f5] rounded-lg"
          aria-label="Open menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="relative w-full max-w-xs focus-within:ring-2 focus-within:ring-[#3e32d3]/15 rounded-lg transition-all">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#777587]" />
          <input
            id="global-header-search"
            type="text"
            value={searchTerm}
            onChange={(e) => onSearchChange?.(e.target.value)}
            placeholder="Search..."
            className="w-full pl-10 pr-4 py-2 bg-[#f3f4f5] text-sm text-[#191c1d] rounded-lg border-0 placeholder-[#777587] focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#3e32d3] transition-all"
          />
        </div>

        {/* Desktop Workspace & Products nav links */}
        <nav className="hidden lg:flex items-center gap-6 ml-4">
          <button
            onClick={() => onSelectTab?.('overview')}
            className={`text-xs font-semibold tracking-wide transition-colors ${
              currentTab === 'overview' ? 'text-[#3e32d3] font-bold' : 'text-[#464555] hover:text-[#3e32d3]'
            }`}
          >
            Workspace
          </button>
          <button
            onClick={() => onSelectTab?.('products')}
            className={`text-xs font-semibold tracking-wide transition-colors ${
              currentTab === 'products' ? 'text-[#3e32d3] font-bold' : 'text-[#464555] hover:text-[#3e32d3]'
            }`}
          >
            Products
          </button>
        </nav>
      </div>

      {/* Right side: Notifications & Avatar */}
      <div className="flex items-center gap-3">
        <button
          id="header-notifications-btn"
          onClick={onOpenNotifications}
          className="relative p-2 text-[#464555] hover:text-[#3e32d3] hover:bg-[#f3f4f5] rounded-full transition-colors"
          title="Notifications"
        >
          <Bell className="w-5 h-5" />
          {unreadCount > 0 && (
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#EF4444] rounded-full ring-2 ring-white" />
          )}
        </button>

        <button
          id="header-profile-btn"
          onClick={onOpenProfile}
          className="w-8 h-8 rounded-full bg-[#d9dff5] text-[#5c6274] hover:ring-2 hover:ring-[#3e32d3]/30 transition-all flex items-center justify-center font-medium overflow-hidden border border-[#c7c4d8]/40"
          title="Jane Doe (Product Manager)"
        >
          <User className="w-4 h-4 text-[#3e32d3]" />
        </button>
      </div>
    </header>
  );
};
