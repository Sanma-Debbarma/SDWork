import React, { useState } from 'react';
import { User, Bell, Shield, Save, Check } from 'lucide-react';

export const SettingsView: React.FC = () => {
  const [saved, setSaved] = useState(false);
  const [name, setName] = useState('Ani Vex');
  const [handle, setHandle] = useState('@anivex_edits');
  const [hourlyRate, setHourlyRate] = useState('85');
  const [bio, setBio] = useState('Senior Video Editor & Modern UI/UX Designer creating high-converting digital experiences.');

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="max-w-4xl space-y-6 animate-in fade-in duration-200">
      <div>
        <h2 className="text-xl font-bold text-gray-900 tracking-tight">Channel & Account Settings</h2>
        <p className="text-xs text-gray-500 mt-0.5">Manage your channel profile, services, and payout preferences</p>
      </div>

      {saved && (
        <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-xs flex items-center gap-2">
          <Check className="w-4 h-4 text-emerald-600" />
          <span>Your settings have been saved successfully.</span>
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-6">
        {/* Profile Card */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-xs space-y-5">
          <div className="flex items-center gap-2 border-b border-gray-100 pb-3">
            <User className="w-4 h-4 text-purple-600" />
            <h3 className="text-sm font-bold text-gray-900">Profile Information</h3>
          </div>

          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-purple-500 p-0.5 bg-[#0F081D]">
              <img
                src="/assets/anivex-avatar.png"
                alt="Ani Vex"
                className="w-full h-full rounded-full object-cover"
              />
            </div>
            <div>
              <button
                type="button"
                className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-lg text-xs font-semibold transition"
              >
                Change Avatar
              </button>
              <p className="text-[11px] text-gray-400 mt-1">Recommended 500x500px PNG or JPG</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Display Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3.5 py-2 text-xs border border-gray-200 rounded-xl focus:border-purple-500 outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Channel Handle</label>
              <input
                type="text"
                value={handle}
                onChange={(e) => setHandle(e.target.value)}
                className="w-full px-3.5 py-2 text-xs border border-gray-200 rounded-xl focus:border-purple-500 outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Standard Hourly Rate ($)</label>
              <input
                type="number"
                value={hourlyRate}
                onChange={(e) => setHourlyRate(e.target.value)}
                className="w-full px-3.5 py-2 text-xs border border-gray-200 rounded-xl focus:border-purple-500 outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Contact Email</label>
              <input
                type="email"
                defaultValue="anivex.creations@gmail.com"
                className="w-full px-3.5 py-2 text-xs border border-gray-200 rounded-xl focus:border-purple-500 outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">Channel Bio</label>
            <textarea
              rows={3}
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              className="w-full px-3.5 py-2 text-xs border border-gray-200 rounded-xl focus:border-purple-500 outline-none resize-none"
            />
          </div>
        </div>

        {/* Preferences */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-xs space-y-4">
          <div className="flex items-center gap-2 border-b border-gray-100 pb-3">
            <Bell className="w-4 h-4 text-purple-600" />
            <h3 className="text-sm font-bold text-gray-900">Notifications & Alerts</h3>
          </div>

          <div className="space-y-3">
            <label className="flex items-center justify-between text-xs text-gray-700 cursor-pointer">
              <span>Notify when client submits a project proposal</span>
              <input type="checkbox" defaultChecked className="w-4 h-4 accent-purple-600 rounded" />
            </label>
            <label className="flex items-center justify-between text-xs text-gray-700 cursor-pointer">
              <span>Send instant alert for escrow deposit clearance</span>
              <input type="checkbox" defaultChecked className="w-4 h-4 accent-purple-600 rounded" />
            </label>
            <label className="flex items-center justify-between text-xs text-gray-700 cursor-pointer">
              <span>Weekly digest of trending projects in your categories</span>
              <input type="checkbox" defaultChecked className="w-4 h-4 accent-purple-600 rounded" />
            </label>
          </div>
        </div>

        {/* Security */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-xs space-y-4">
          <div className="flex items-center gap-2 border-b border-gray-100 pb-3">
            <Shield className="w-4 h-4 text-purple-600" />
            <h3 className="text-sm font-bold text-gray-900">Security & 2-Factor Authentication</h3>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <span className="text-xs font-semibold text-gray-900 block">Two-factor authentication (2FA)</span>
              <span className="text-[11px] text-gray-500">Adds an extra layer of security to Ani Vex channel account</span>
            </div>
            <span className="px-2.5 py-1 rounded-md text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
              Enabled
            </span>
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            className="flex items-center gap-2 px-6 py-2.5 bg-gray-950 hover:bg-black text-white rounded-xl text-xs font-semibold shadow-xs transition active:scale-95"
          >
            <Save className="w-4 h-4" />
            <span>Save Preferences</span>
          </button>
        </div>
      </form>
    </div>
  );
};
