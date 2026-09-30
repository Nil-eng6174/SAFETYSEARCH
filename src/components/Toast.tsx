import React from 'react';

interface ToastProps {
  message: string | null;
  type?: 'success' | 'warning' | 'info';
}

export const Toast: React.FC<ToastProps> = ({ message, type = 'success' }) => {
  if (!message) return null;

  const iconName = type === 'warning' ? 'warning' : type === 'info' ? 'info' : 'check_circle';
  const iconColor = type === 'warning' ? 'text-status-warning' : type === 'info' ? 'text-tertiary' : 'text-status-safe';

  return (
    <div className="fixed bottom-6 right-6 z-50 transform transition-all duration-300 flex items-center gap-2 bg-[#0b1c30] text-white px-4 py-3 rounded-lg shadow-xl font-label-md text-sm border border-slate-700 animate-in fade-in slide-in-from-bottom-4">
      <span className={`material-symbols-outlined ${iconColor} text-lg`}>
        {iconName}
      </span>
      <span>{message}</span>
    </div>
  );
};
