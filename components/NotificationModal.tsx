
import React from 'react';
import { CloseIcon } from './Icons';

interface NotificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenCustomerService: () => void;
}

const NotificationModal: React.FC<NotificationModalProps> = ({ isOpen, onClose, onOpenCustomerService }) => {
  if (!isOpen) return null;

  const handleJoinClick = () => {
    onClose();
    onOpenCustomerService();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4" aria-modal="true" role="dialog">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 sm:p-8 relative animate-fade-in-up">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
          aria-label="Close notification"
        >
          <CloseIcon className="w-6 h-6" />
        </button>

        <h2 className="text-3xl font-bold text-[#0066FF] text-center mb-6">Notification</h2>
        
        <div className="text-gray-700 space-y-3 text-sm">
          <p className="font-semibold">Welcome to Airbnb Investment Platform! Special notes:</p>
          <ol className="list-decimal list-inside space-y-2 text-left">
            <li>Registration Bonus: 20 GHS</li>
            <li>Referral Commission: 5% - 1% - 1%</li>
            <li>Minimum Deposit: 40 GHS, Minimum Withdrawal: 20 GHS</li>
            <li>🎁🎁 After the product countdown ends, your investment funds will be automatically refunded to your wallet!</li>
            <li>Withdrawal fee: 15% (Used for government fees and product maintenance)</li>
            <li>Join our official Telegram group to learn more about making money.</li>
          </ol>
        </div>

        <button
          onClick={handleJoinClick}
          className="mt-8 w-full text-white font-bold py-3 px-4 rounded-lg bg-gradient-to-r from-[#2CACFF] to-[#0066FF] hover:from-[#0066FF] hover:to-[#004bb5] shadow-lg transition-all duration-300 ease-in-out"
        >
          Join Telegram groups
        </button>
      </div>
    </div>
  );
};

export default NotificationModal;
