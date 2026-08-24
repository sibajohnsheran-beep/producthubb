import React from 'react';
import { 
  LayoutDashboard, 
  Package, 
  Layers, 
  Settings, 
  HelpCircle, 
  LogOut, 
  X,
  Boxes
} from 'lucide-react';

interface SidebarProps {
  currentTab: string;
  onSelectTab: (tab: string) => void;
  isOpenMobile?: boolean;
  onCloseMobile?: () => void;
  onLogout?: () => void;
  onOpenHelp?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentTab,
  onSelectTab,
  isOpenMobile = false,
  onCloseMobile,
  onLogout,
  onOpenHelp
}) => {
  const navItems = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'products', label: 'Products', icon: Package },
    { id: 'categories', label: 'Categories', icon: Layers },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  const sidebarContent = (
    <div className="flex flex-col h-full p-6 justify-between bg-white border-r border-[#c7c4d8]/60 shadow-[0px_4px_20px_rgba(0,0,0,0.02)]">
      <div>
        {/* Brand Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-[#5850ec] flex items-center justify-center text-white shadow-sm shrink-0">
              <Boxes className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="font-space font-bold text-xl text-[#191c1d] tracking-tight leading-tight">ProductHub</h1>
              <p className="text-xs font-semibold text-[#464555] tracking-wide">IT Management</p>
            </div>
          </div>
          {isOpenMobile && onCloseMobile && (
            <button 
              onClick={onCloseMobile}
              className="md:hidden p-1.5 text-[#464555] hover:text-[#191c1d] hover:bg-[#f3f4f5] rounded-lg"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Navigation items */}
        <nav className="flex flex-col gap-1.5 mt-6">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                id={`sidebar-nav-${item.id}`}
                onClick={() => {
                  onSelectTab(item.id);
                  if (onCloseMobile) onCloseMobile();
                }}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm transition-all duration-200 text-left w-full ${
                  isActive
                    ? 'text-[#3e32d3] font-bold border-r-[3px] border-[#3e32d3] bg-[#3e32d3]/5 shadow-xs'
                    : 'text-[#464555] font-medium hover:text-[#3e32d3] hover:bg-[#f3f4f5]'
                }`}
              >
                <Icon className={`w-5 h-5 ${isActive ? 'text-[#3e32d3]' : 'text-[#575e70]'}`} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Bottom Actions */}
      <div className="mt-auto pt-6 border-t border-[#c7c4d8]/40 flex flex-col gap-2.5">
        <button
          id="sidebar-help-btn"
          onClick={onOpenHelp}
          className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg border border-[#c7c4d8] text-[#575e70] font-semibold text-xs hover:bg-[#f3f4f5] hover:text-[#191c1d] transition-colors"
        >
          <HelpCircle className="w-4 h-4" />
          <span>Help Center</span>
        </button>

        <button
          id="sidebar-logout-btn"
          onClick={onLogout}
          className="flex items-center gap-3 px-4 py-2.5 rounded-lg text-[#464555] text-xs font-semibold hover:text-[#EF4444] hover:bg-[#ffdad6]/30 transition-colors w-full text-left"
        >
          <LogOut className="w-4 h-4" />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sticky Sidebar */}
      <aside className="hidden md:flex flex-col w-[280px] h-screen fixed left-0 top-0 z-20">
        {sidebarContent}
      </aside>

      {/* Mobile Drawer Overlay */}
      {isOpenMobile && (
        <div className="fixed inset-0 z-50 md:hidden flex">
          <div 
            className="fixed inset-0 bg-black/30 backdrop-blur-xs transition-opacity"
            onClick={onCloseMobile}
          />
          <div className="relative w-[280px] max-w-[80vw] h-full z-10">
            {sidebarContent}
          </div>
        </div>
      )}
    </>
  );
};
