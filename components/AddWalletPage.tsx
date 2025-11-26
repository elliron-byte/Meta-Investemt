
import React, { useState } from 'react';
import { ArrowLeftIcon } from './Icons';
import type { Wallet } from './storageService';

interface AddWalletPageProps {
  onClose: () => void;
  onAddWallet: (wallet: Wallet) => void;
}

const AddWalletPage: React.FC<AddWalletPageProps> = ({ onClose, onAddWallet }) => {
  const [walletType, setWalletType] = useState<'MTN' | 'TELECEL' | 'AIRTELTIGO' | ''>('');
  const [name, setName] = useState('');
  const [accountNumber, setAccountNumber] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!walletType || !name || !accountNumber) {
      // Simple validation, a toast could be shown here in a real app
      return;
    }
    onAddWallet({
      type: walletType,
      name,
      accountNumber,
    });
  };

  return (
    <div className="bg-gray-100 min-h-screen">
      <header className="bg-white flex items-center p-4 border-b sticky top-0 z-10">
        <button onClick={onClose} className="p-2 -ml-2">
          <ArrowLeftIcon className="w-6 h-6 text-gray-800" />
        </button>
        <h1 className="text-lg font-semibold text-gray-800 text-center flex-grow -ml-6">Add a withdrawal wallet account</h1>
      </header>

      <form onSubmit={handleSubmit} className="p-4 space-y-6">
        <div className="bg-white p-4 rounded-lg shadow-sm">
          <label htmlFor="walletType" className="block text-sm font-medium text-gray-700 mb-1">
            *Select the wallet type
          </label>
          <select
            id="walletType"
            value={walletType}
            onChange={(e) => setWalletType(e.target.value as any)}
            required
            className="w-full border-gray-300 rounded-md shadow-sm p-3 bg-white focus:border-[#0066FF] focus:ring-[#0066FF]"
          >
            <option value="" disabled>Please select</option>
            <option value="MTN">MTN</option>
            <option value="TELECEL">Telecel</option>
            <option value="AIRTELTIGO">AirtelTigo</option>
          </select>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow-sm">
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
            *name
          </label>
          <input
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Please enter your name"
            required
            className="w-full border-gray-300 rounded-md shadow-sm p-3 bg-white focus:border-[#0066FF] focus:ring-[#0066FF]"
          />
        </div>

        <div className="bg-white p-4 rounded-lg shadow-sm">
          <label htmlFor="accountNumber" className="block text-sm font-medium text-gray-700 mb-1">
            *Account number
          </label>
          <input
            id="accountNumber"
            type="text"
            inputMode="numeric"
            value={accountNumber}
            onChange={(e) => setAccountNumber(e.target.value)}
            placeholder="Please enter your wallet account"
            required
            className="w-full border-gray-300 rounded-md shadow-sm p-3 bg-white focus:border-[#0066FF] focus:ring-[#0066FF]"
          />
        </div>

        <div className="pt-4">
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-[#2CACFF] to-[#0066FF] text-white font-bold py-3.5 rounded-lg shadow-md hover:from-[#0066FF] hover:to-[#004bb5] transition-colors"
          >
            Add
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddWalletPage;
