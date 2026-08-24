import React, { useState, useCallback } from 'react';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { ToastContainer } from './components/Toast';
import { DevToolbar } from './components/DevToolbar';
import { ProductsPage } from './pages/ProductsPage';
import { OverviewPage } from './pages/OverviewPage';
import { CategoriesPage } from './pages/CategoriesPage';
import { SettingsPage } from './pages/SettingsPage';
import { LoginPage } from './pages/LoginPage';
import { ToastNotification, ToastType } from './types';
import { productService } from './services/productService';

export default function App() {
  // Navigation & view state
  const [currentTab, setCurrentTab] = useState<string>('products');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);
  const [globalSearchTerm, setGlobalSearchTerm] = useState<string>('');
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<string>('all');
  
  // QA Testing forced states
  const [forceLoading, setForceLoading] = useState<boolean>(false);
  const [forceError, setForceError] = useState<boolean>(false);
  const [dataVersion, setDataVersion] = useState<number>(0);

  // Toast notifications queue
  const [toasts, setToasts] = useState<ToastNotification[]>([]);

  const addToast = useCallback((message: string, type: ToastType = 'success') => {
    const newToast: ToastNotification = {
      id: 'toast-' + Date.now() + '-' + Math.random().toString(36).substr(2, 4),
      message,
      type
    };
    setToasts((prev) => [...prev, newToast]);
  }, []);

  const dismissToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const handleResetData = useCallback(() => {
    productService.resetToDefault();
    setDataVersion((v) => v + 1);
    setForceError(false);
    setForceLoading(false);
    addToast('Catalog dataset restored to default mock data.', 'info');
  }, [addToast]);

  // If viewing standalone login page preview
  if (currentTab === 'login') {
    return (
      <div className="min-h-screen bg-[#f8f9fa] relative">
        <LoginPage onLoginSuccess={() => setCurrentTab('products')} />
        <DevToolbar
          onToggleLoading={() => setForceLoading(!forceLoading)}
          isLoadingForced={forceLoading}
          onToggleError={() => setForceError(!forceError)}
          isErrorForced={forceError}
          onResetData={handleResetData}
          currentTab={currentTab}
          onSelectTab={setCurrentTab}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8f9fa] flex text-[#191c1d]">
      {/* Sidebar Navigation matching Figma */}
      <Sidebar
        currentTab={currentTab}
        onSelectTab={(tab) => {
          setCurrentTab(tab);
          setIsMobileMenuOpen(false);
        }}
        isOpenMobile={isMobileMenuOpen}
        onCloseMobile={() => setIsMobileMenuOpen(false)}
        onLogout={() => {
          setCurrentTab('login');
          addToast('Logged out of ProductHub.', 'info');
        }}
        onOpenHelp={() => addToast('ProductHub documentation & help center available.', 'info')}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col md:pl-[280px] min-w-0 transition-all">
        {/* Sticky Top Header */}
        <Header
          currentTab={currentTab}
          onSelectTab={setCurrentTab}
          searchTerm={globalSearchTerm}
          onSearchChange={(term) => {
            setGlobalSearchTerm(term);
            if (currentTab !== 'products') {
              setCurrentTab('products');
            }
          }}
          onOpenMobileMenu={() => setIsMobileMenuOpen(true)}
          unreadCount={1}
          onOpenNotifications={() => addToast('You have 1 unread stock audit notification.', 'info')}
          onOpenProfile={() => setCurrentTab('settings')}
        />

        {/* Dynamic Page Views */}
        <main className="flex-1 p-4 sm:p-6 md:p-10 max-w-7xl w-full mx-auto">
          {currentTab === 'products' && (
            <ProductsPage
              key={`products-${dataVersion}-${selectedCategoryFilter}`}
              onAddToast={addToast}
              onNavigateTab={setCurrentTab}
              externalSearch={globalSearchTerm}
              initialCategory={selectedCategoryFilter}
              forceLoading={forceLoading}
              forceError={forceError}
            />
          )}

          {currentTab === 'overview' && (
            <OverviewPage
              key={`overview-${dataVersion}`}
              onNavigateTab={setCurrentTab}
              onOpenAddProduct={() => {
                setSelectedCategoryFilter('all');
                setCurrentTab('products');
              }}
            />
          )}

          {currentTab === 'categories' && (
            <CategoriesPage
              key={`categories-${dataVersion}`}
              onSelectCategoryFilter={(catName) => {
                setSelectedCategoryFilter(catName);
                setCurrentTab('products');
              }}
              onAddToast={addToast}
            />
          )}

          {currentTab === 'settings' && (
            <SettingsPage
              onAddToast={addToast}
              onResetData={handleResetData}
            />
          )}
        </main>
      </div>

      {/* Global Toast Notifications Container */}
      <ToastContainer toasts={toasts} onDismiss={dismissToast} />

      {/* Dev QA State Simulator Toolbar */}
      <DevToolbar
        onToggleLoading={() => setForceLoading(!forceLoading)}
        isLoadingForced={forceLoading}
        onToggleError={() => setForceError(!forceError)}
        isErrorForced={forceError}
        onResetData={handleResetData}
        currentTab={currentTab}
        onSelectTab={setCurrentTab}
      />
    </div>
  );
}
