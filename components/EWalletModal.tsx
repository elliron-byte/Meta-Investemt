import React, { useState } from 'react';

interface EWalletModalProps {
  onClose: () => void;
  onConfirm: (details: { operator: string, ewallet: string }) => void;
  onShowToast: (message: string, type: 'success' | 'error') => void;
}

const EWalletModal: React.FC<EWalletModalProps> = ({ onClose, onConfirm, onShowToast }) => {
  const [operator, setOperator] = useState('');
  const [ewallet, setEwallet] = useState('');

  const handleSubmit = () => {
    if (!operator || !ewallet) {
      onShowToast('Please select an operator and enter an e-wallet number.', 'error');
      return;
    }
    if (!/^\d{9,10}$/.test(ewallet)) {
      onShowToast('Please enter a valid 9 or 10 digit e-wallet number.', 'error');
      return;
    }
    onConfirm({ operator, ewallet });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-sm p-6 space-y-4 animate-fade-in-up">
        <p className="font-bold text-center text-gray-800">
          Please fill in the <span className="text-red-500">correct payment e-wallet number</span> to confirm your repayment.
        </p>
        <p className="text-sm text-center text-gray-600">
          If you ask someone else to repay on your behalf, please confirm that the <span className="text-red-500">payment e-wallet number is correct.</span>
        </p>

        <div className="space-y-4 pt-2">
          <div>
            <label htmlFor="operator" className="text-sm font-medium text-gray-700">Operator</label>
            <select 
              id="operator" 
              value={operator}
              onChange={(e) => setOperator(e.target.value)}
              className="w-full border border-gray-300 rounded-md p-2.5 mt-1 focus:outline-none focus:ring-2 focus:ring-teal-500 bg-white"
            >
              <option value="">Select Operator</option>
              <option value="MTN">MTN Mobile Money</option>
              <option value="VODAFONE">Vodafone Cash (Telecel)</option>
              <option value="AIRTELTIGO">AirtelTigo Money</option>
            </select>
          </div>
          <div>
            <label htmlFor="e-wallet" className="text-sm font-medium text-gray-700">e-wallet Number</label>
            <input 
              id="e-wallet" 
              type="tel" 
              placeholder="e.g. 0241234567"
              value={ewallet}
              onChange={(e) => setEwallet(e.target.value)}
              className="w-full border border-gray-300 rounded-md p-2.5 mt-1 focus:outline-none focus:ring-2 focus:ring-teal-500 bg-white" 
            />
          </div>
        </div>

        <button 
          onClick={handleSubmit}
          className="w-full bg-teal-500 text-white font-semibold py-3 rounded-md hover:bg-teal-600 transition-colors mt-4"
        >
          CONFIRMED THEN SUBMIT
        </button>
      </div>
    </div>
  );
};

export default EWalletModal;