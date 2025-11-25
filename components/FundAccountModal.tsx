
import React, { useState } from 'react';
import type { User } from './storageService';

interface FundAccountModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (amount: number) => void;
  user: User | null;
}

const FundAccountModal: React.FC<FundAccountModalProps> = ({ isOpen, onClose, onConfirm, user }) => {
  const [amount, setAmount] = useState('');
  const [error, setError] = useState('');

  if (!isOpen || !user) return null;

  const handleConfirm = () => {
    const fundAmount = parseFloat(amount);
    if (isNaN(fundAmount) || fundAmount <= 0) {
      setError('Please enter a valid positive amount.');
      return;
    }
    onConfirm(fundAmount);
    setAmount('');
    setError('');
  };

  const handleClose = () => {
    setAmount('');
    setError('');
    onClose();
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex justify-center items-center z-50 p-4" aria-modal="true" role="dialog">
      <div className="bg-gray-800 rounded-lg shadow-xl w-full max-w-md p-6 relative">
        <h2 className="text-2xl font-bold text-white mb-4">Fund Account</h2>
        <p className="text-gray-400 mb-6">You are funding the account for user: <span className="font-semibold text-white">{user.mobile}</span></p>
        
        <div>
          <label htmlFor="fund-amount" className="block text-sm font-medium text-gray-300 mb-2">
            Amount to Add (GHS)
          </label>
          <input 
            type="number"
            id="fund-amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="e.g. 100"
            className="w-full px-4 py-3 border border-gray-700 bg-gray-900 text-white placeholder-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            autoFocus
          />
        </div>

        {error && <p className="text-red-400 text-sm mt-3">{error}</p>}
        
        <div className="mt-8 flex justify-end space-x-4">
          <button
            onClick={handleClose}
            className="px-6 py-2 text-sm font-medium rounded-md text-gray-300 bg-gray-700 hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-gray-500"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            className="px-6 py-2 text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-blue-500"
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
};

export default FundAccountModal;
