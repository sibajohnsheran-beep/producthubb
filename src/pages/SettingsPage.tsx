import React, { useState } from 'react';
import { User, Bell, Shield, Sliders, CheckCircle2, Save, RefreshCw } from 'lucide-react';
import { productService } from '../services/productService';

interface SettingsPageProps {
  onAddToast: (msg: string, type?: 'success' | 'error' | 'info' | 'warning') => void;
  onResetData: () => void;
}

export const SettingsPage: React.FC<SettingsPageProps> = ({
  onAddToast,
  onResetData
}) => {
  const [firstName, setFirstName] = useState('Sheran');
  const [lastName, setLastName] = useState('Fernando');
  const [email, setEmail] = useState('sheran.fernando@producthub.io');
  const [role, setRole] = useState('Lead Product Operations');
  const [bio, setBio] = useState('Managing hardware inventories and enterprise SaaS product line for regional teams.');
  const [currency, setCurrency] = useState('LKR (Rs.)');
  const [defaultSort, setDefaultSort] = useState('newest');
  const [lowStockThreshold, setLowStockThreshold] = useState('10');

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    onAddToast('Profile settings updated successfully.', 'success');
  };

  const handleSavePreferences = (e: React.FormEvent) => {
    e.preventDefault();
    onAddToast('Application preferences saved.', 'success');
  };

  return (
    <div className="space-y-8 max-w-4xl animate-in fade-in duration-200">
      {/* Header */}
      <div>
        <h1 className="font-space font-bold text-3xl sm:text-4xl text-[#191c1d] tracking-tight">
          Settings
        </h1>
        <p className="text-sm font-medium text-[#464555] mt-1">
          Manage your account profile and catalog preferences.
        </p>
      </div>

      {/* 1. Profile Information Card */}
      <div className="bg-white rounded-2xl border border-[#c7c4d8]/50 shadow-[0px_4px_24px_rgba(0,0,0,0.02)] p-6 sm:p-8">
        <div className="border-b border-[#c7c4d8]/40 pb-5 mb-6">
          <h3 className="font-space font-bold text-xl text-[#191c1d]">
            Profile Information
          </h3>
          <p className="text-xs text-[#464555] mt-0.5">
            Update your public profile and personal information.
          </p>
        </div>

        <form onSubmit={handleSaveProfile} className="space-y-6">
          {/* Avatar Section */}
          <div className="flex items-center gap-5">
            <div className="w-16 h-16 rounded-full bg-[#d9dff5] text-[#3e32d3] flex items-center justify-center font-bold text-xl ring-4 ring-[#3e32d3]/10">
              {firstName[0]}{lastName[0]}
            </div>
            <div>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => onAddToast('Photo upload dialog simulated.', 'info')}
                  className="px-3.5 py-1.5 rounded-lg border border-[#c7c4d8] text-xs font-semibold text-[#191c1d] hover:bg-[#f3f4f5] transition-colors"
                >
                  Change Photo
                </button>
                <button
                  type="button"
                  className="text-xs font-semibold text-[#777587] hover:text-[#EF4444] transition-colors"
                >
                  Remove
                </button>
              </div>
              <p className="text-[11px] text-[#777587] mt-1.5">
                JPG, PNG or GIF. 1MB max.
              </p>
            </div>
          </div>

          {/* Form Fields */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[#191c1d] mb-1.5">
                First Name
              </label>
              <input
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-white text-sm rounded-lg border border-[#c7c4d8] focus:border-[#3e32d3] focus:ring-2 focus:ring-[#3e32d3]/15 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#191c1d] mb-1.5">
                Last Name
              </label>
              <input
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-white text-sm rounded-lg border border-[#c7c4d8] focus:border-[#3e32d3] focus:ring-2 focus:ring-[#3e32d3]/15 focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[#191c1d] mb-1.5">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-white text-sm rounded-lg border border-[#c7c4d8] focus:border-[#3e32d3] focus:ring-2 focus:ring-[#3e32d3]/15 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#191c1d] mb-1.5">
                Job Role / Title
              </label>
              <input
                type="text"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-white text-sm rounded-lg border border-[#c7c4d8] focus:border-[#3e32d3] focus:ring-2 focus:ring-[#3e32d3]/15 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#191c1d] mb-1.5">
              Bio
            </label>
            <textarea
              rows={3}
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-white text-sm rounded-lg border border-[#c7c4d8] focus:border-[#3e32d3] focus:ring-2 focus:ring-[#3e32d3]/15 focus:outline-none resize-none"
            />
          </div>

          <div className="pt-2 flex justify-end">
            <button
              type="submit"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[#3e32d3] text-white text-sm font-semibold hover:bg-[#342ab3] transition-colors shadow-xs"
            >
              <Save className="w-4 h-4" />
              Save Changes
            </button>
          </div>
        </form>
      </div>

      {/* 2. Catalog & System Preferences */}
      <div className="bg-white rounded-2xl border border-[#c7c4d8]/50 shadow-[0px_4px_24px_rgba(0,0,0,0.02)] p-6 sm:p-8">
        <div className="border-b border-[#c7c4d8]/40 pb-5 mb-6">
          <h3 className="font-space font-bold text-xl text-[#191c1d]">
            Catalog Preferences
          </h3>
          <p className="text-xs text-[#464555] mt-0.5">
            Configure default currency, sorting, and inventory notifications.
          </p>
        </div>

        <form onSubmit={handleSavePreferences} className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[#191c1d] mb-1.5">
                Display Currency
              </label>
              <select
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-white text-sm rounded-lg border border-[#c7c4d8] focus:border-[#3e32d3] focus:outline-none"
              >
                <option value="LKR (Rs.)">LKR (Rs.) - Sri Lankan Rupee</option>
                <option value="USD ($)">USD ($) - US Dollar</option>
                <option value="EUR (€)">EUR (€) - Euro</option>
                <option value="GBP (£)">GBP (£) - British Pound</option>
                <option value="AUD ($)">AUD ($) - Australian Dollar</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#191c1d] mb-1.5">
                Default Sort Order
              </label>
              <select
                value={defaultSort}
                onChange={(e) => setDefaultSort(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-white text-sm rounded-lg border border-[#c7c4d8] focus:border-[#3e32d3] focus:outline-none"
              >
                <option value="newest">Newest Added First</option>
                <option value="price-desc">Highest Price First</option>
                <option value="name-asc">Alphabetical (A-Z)</option>
              </select>
            </div>
          </div>

          <div className="pt-2 flex items-center justify-between">
            <div>
              <h4 className="text-sm font-bold text-[#191c1d]">Reset Demo Catalog</h4>
              <p className="text-xs text-[#777587]">
                Restore the default products and categories if you modified them.
              </p>
            </div>
            <button
              type="button"
              onClick={onResetData}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-[#c7c4d8] text-xs font-semibold text-[#575e70] hover:bg-[#f3f4f5] hover:text-[#191c1d]"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              Reset to Mock Data
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
