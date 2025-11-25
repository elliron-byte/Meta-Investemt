
import React, { useEffect } from 'react';
import { CheckCircleIcon, ExclamationCircleIcon, CloseIcon } from './Icons';

interface ToastProps {
  message: string;
  type: 'success' | 'error';
  onClose: () => void;
}

const Toast: React.FC<ToastProps> = ({ message, type, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 3000); // Auto-close after 3 seconds

    return () => {
      clearTimeout(timer);
    };
  }, [onClose]);

  const successColors = 'bg-green-500';
  const errorColors = 'bg-red-500';

  const bgColor = type === 'success' ? successColors : errorColors;
  const Icon = type === 'success' ? CheckCircleIcon : ExclamationCircleIcon;

  return (
    <div className={`fixed bottom-5 right-5 flex items-center p-4 rounded-lg shadow-lg text-white ${bgColor} animate-fade-in-up z-50 max-w-sm`}>
      <div className="flex-shrink-0">
        <Icon className="w-6 h-6" />
      </div>
      <p className="flex-grow mx-3">{message}</p>
      <button onClick={onClose} className="ml-auto -mr-2 p-1 rounded-md hover:bg-white/20 flex-shrink-0">
        <CloseIcon className="w-5 h-5" />
      </button>
    </div>
  );
};

export default Toast;
