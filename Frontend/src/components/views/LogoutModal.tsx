import { LogOut } from 'lucide-react';

interface LogoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirmLogout: () => void;
}

export const LogoutModal: React.FC<LogoutModalProps> = ({
  isOpen,
  onClose,
  onConfirmLogout,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white w-full max-w-sm rounded-2xl shadow-2xl border border-gray-100 p-6 text-center">
        <div className="w-12 h-12 rounded-full bg-red-50 text-red-600 flex items-center justify-center mx-auto mb-4">
          <LogOut className="w-6 h-6" />
        </div>

        <h3 className="text-base font-bold text-gray-900 mb-1">
          Log out of Editor?
        </h3>
        <p className="text-xs text-gray-500 mb-6 leading-relaxed">
          You are currently signed in as <strong className="text-gray-800">Ani Vex</strong>. You can sign back in at any time to manage your channel and active client projects.
        </p>

        <div className="grid grid-cols-2 gap-2.5">
          <button
            onClick={onClose}
            className="px-4 py-2.5 text-xs font-semibold text-gray-700 hover:bg-gray-100 rounded-xl transition"
          >
            Cancel
          </button>
          <button
            onClick={onConfirmLogout}
            className="px-4 py-2.5 text-xs font-semibold bg-red-600 hover:bg-red-700 text-white rounded-xl shadow-xs transition active:scale-95"
          >
            Log Out
          </button>
        </div>
      </div>
    </div>
  );
};
