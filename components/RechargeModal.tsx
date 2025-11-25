import React, { useState, useEffect } from 'react';
import { ThumbsUpIcon } from './Icons';

interface RechargeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

const RechargeModal: React.FC<RechargeModalProps> = ({ isOpen, onClose, onConfirm }) => {
  const [countdown, setCountdown] = useState(3);

  useEffect(() => {
    if (isOpen) {
      setCountdown(3); // Reset countdown when modal opens
      const timer = setInterval(() => {
        setCountdown(prev => (prev > 0 ? prev - 1 : 0));
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const isButtonDisabled = countdown > 0;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50 p-4" aria-modal="true" role="dialog" onClick={onClose}>
      <div className="bg-white rounded-lg shadow-xl w-full max-w-sm p-6 relative animate-fade-in-up" onClick={e => e.stopPropagation()}>
        <h2 className="text-xl font-bold text-gray-800 text-center mb-4">Reminder</h2>
        
        <div className="space-y-3 text-sm text-gray-700">
          <div className="bg-red-100 text-red-800 p-3 rounded-lg flex items-start">
            <ThumbsUpIcon className="w-6 h-6 mr-2 mt-0.5 flex-shrink-0 text-red-500" />
            <p className="font-semibold">Please use MoMo pay or Vodafone (Telecel Play Ghana) for payment</p>
          </div>
          <p>After completing the repayment, please <span className="text-teal-500 font-semibold">backfill</span> your Transaction ID (Txn ID 11 or 16 digits).</p>
          <p className="text-teal-500">If you do not backfill, your repayment will not be review quickly.</p>
          <p>Do not close the APP before backfill</p>
        </div>

        <button
          onClick={onConfirm}
          disabled={isButtonDisabled}
          className={`mt-6 w-full text-white font-bold py-3 px-4 rounded-lg transition-all duration-300 ease-in-out
            ${isButtonDisabled 
              ? 'bg-gray-400 cursor-not-allowed' 
              : 'bg-teal-500 hover:bg-teal-600'
            }`}
        >
          {isButtonDisabled ? `I KNOW & CONTINUE TO REPAY (${countdown}S)` : 'I KNOW & CONTINUE TO REPAY'}
        </button>
      </div>
    </div>
  );
};

export default RechargeModal;
