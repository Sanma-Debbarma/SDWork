import React, { useState } from 'react';
import { Film, Briefcase, Check, ArrowRight, Loader2, LogOut, Sparkles } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

interface RoleSelectionViewProps {
  onRoleSelected?: (role: 'editor' | 'creator') => void;
}

export const RoleSelectionView: React.FC<RoleSelectionViewProps> = ({ onRoleSelected }) => {
  const { user, setRole, logout } = useAuth();
  const [selectedRole, setSelectedRole] = useState<'editor' | 'creator'>('editor');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleConfirm = async () => {
    setIsSubmitting(true);
    setError(null);
    try {
      await setRole(selectedRole);
      if (onRoleSelected) {
        onRoleSelected(selectedRole);
      }
    } catch (err: any) {
      setError(err?.message || 'Failed to save role. Please try again.');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex flex-col justify-center items-center px-4 py-12 bg-[#FAFAFC] relative overflow-hidden font-sans select-none">
      {/* Subtle Glow Background */}
      <div
        className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-purple-500/10 blur-3xl pointer-events-none"
        aria-hidden="true"
      />
      <div
        className="absolute -bottom-32 -right-32 w-96 h-96 rounded-full bg-indigo-500/10 blur-3xl pointer-events-none"
        aria-hidden="true"
      />

      <div className="w-full max-w-xl relative z-10">
        {/* Brand Header */}
        <div className="flex flex-col items-center text-center mb-8">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-9 h-[26px] bg-[#FF0000] rounded-[7px] flex items-center justify-center shadow-sm">
              <svg className="w-3.5 h-3.5 text-white ml-0.5 fill-current" viewBox="0 0 24 24">
                <polygon points="6 4, 20 12, 6 20" />
              </svg>
            </div>
            <span className="text-2xl font-bold text-[#0F0F0F] tracking-tight">
              Edit<span className="text-purple-600">.com</span>
            </span>
          </div>

          <span className="px-3 py-1 bg-purple-50 text-purple-700 border border-purple-100/80 rounded-full text-xs font-semibold mb-3 inline-flex items-center gap-1.5">
            <Sparkles className="w-3 h-3" /> Step 2: Role Selection
          </span>

          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0F0F0F] tracking-tight">
            Choose how you want to use the platform
          </h1>
          <p className="text-sm text-gray-500 mt-2 max-w-md leading-relaxed">
            Welcome, <span className="font-semibold text-gray-800">{user?.email}</span>. Select your primary role to customize your workspace experience.
          </p>
        </div>

        {/* Error message if any */}
        {error && (
          <div className="mb-6 p-3.5 bg-red-50 border border-red-200 text-red-700 text-xs font-medium rounded-xl text-center animate-in fade-in">
            {error}
          </div>
        )}

        {/* Role Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
          {/* Option 1: Editor */}
          <div
            onClick={() => setSelectedRole('editor')}
            className={`relative p-6 rounded-2xl border-2 transition-all cursor-pointer flex flex-col justify-between ${
              selectedRole === 'editor'
                ? 'bg-white border-purple-600 shadow-[0_12px_30px_rgb(124,58,237,0.12)] ring-1 ring-purple-600/20 scale-[1.02]'
                : 'bg-white/80 border-gray-200/80 hover:border-gray-300 hover:bg-white shadow-xs'
            }`}
          >
            {selectedRole === 'editor' && (
              <div className="absolute top-4 right-4 w-6 h-6 rounded-full bg-purple-600 text-white flex items-center justify-center shadow-sm">
                <Check className="w-3.5 h-3.5 stroke-[3]" />
              </div>
            )}

            <div>
              <div
                className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 transition-colors ${
                  selectedRole === 'editor'
                    ? 'bg-purple-100 text-purple-700'
                    : 'bg-gray-100 text-gray-600'
                }`}
              >
                <Film className="w-6 h-6" />
              </div>

              <span className="text-[11px] font-bold uppercase tracking-wider text-purple-600 block mb-1">
                Freelancer / Talent
              </span>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Editor</h3>
              <p className="text-xs text-gray-500 leading-relaxed">
                Browse available projects created by Creators, inspect project budgets and deadlines, view requirements, and collaborate.
              </p>
            </div>

            <div className="mt-6 pt-4 border-t border-gray-100 flex items-center text-xs font-semibold text-gray-600">
              <span className="text-[11px] bg-purple-50 text-purple-700 px-2 py-0.5 rounded-md">
                Browse & Earn
              </span>
            </div>
          </div>

          {/* Option 2: Creator */}
          <div
            onClick={() => setSelectedRole('creator')}
            className={`relative p-6 rounded-2xl border-2 transition-all cursor-pointer flex flex-col justify-between ${
              selectedRole === 'creator'
                ? 'bg-white border-purple-600 shadow-[0_12px_30px_rgb(124,58,237,0.12)] ring-1 ring-purple-600/20 scale-[1.02]'
                : 'bg-white/80 border-gray-200/80 hover:border-gray-300 hover:bg-white shadow-xs'
            }`}
          >
            {selectedRole === 'creator' && (
              <div className="absolute top-4 right-4 w-6 h-6 rounded-full bg-purple-600 text-white flex items-center justify-center shadow-sm">
                <Check className="w-3.5 h-3.5 stroke-[3]" />
              </div>
            )}

            <div>
              <div
                className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 transition-colors ${
                  selectedRole === 'creator'
                    ? 'bg-purple-100 text-purple-700'
                    : 'bg-gray-100 text-gray-600'
                }`}
              >
                <Briefcase className="w-6 h-6" />
              </div>

              <span className="text-[11px] font-bold uppercase tracking-wider text-purple-600 block mb-1">
                Client / Brand
              </span>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Creator</h3>
              <p className="text-xs text-gray-500 leading-relaxed">
                Create and publish new project briefs, set budgets and deadlines, upload project files, and hire top verified editors.
              </p>
            </div>

            <div className="mt-6 pt-4 border-t border-gray-100 flex items-center text-xs font-semibold text-gray-600">
              <span className="text-[11px] bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded-md">
                Post & Manage
              </span>
            </div>
          </div>
        </div>

        {/* Action Button */}
        <div className="flex flex-col items-center gap-3">
          <button
            onClick={handleConfirm}
            disabled={isSubmitting}
            className="w-full h-12 bg-[#0F0F0F] hover:bg-black text-white text-sm font-semibold rounded-xl flex items-center justify-center gap-2 shadow-sm transition active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Setting up your {selectedRole === 'creator' ? 'Creator' : 'Editor'} workspace...</span>
              </>
            ) : (
              <>
                <span>Continue as {selectedRole === 'creator' ? 'Creator' : 'Editor'}</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>

          <button
            onClick={logout}
            className="inline-flex items-center gap-1.5 text-xs text-gray-400 hover:text-gray-700 transition mt-2 py-1"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign out / switch account</span>
          </button>
        </div>
      </div>
    </div>
  );
};
