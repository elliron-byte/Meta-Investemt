
import React, { useState } from 'react';
import { ArrowLeftIcon, TicketIcon } from './Icons';

interface BonusCodePageProps {
  onClose: () => void;
  onRedeem: (code: string) => void;
}

const BonusCodePage: React.FC<BonusCodePageProps> = ({ onClose, onRedeem }) => {
  const [code, setCode] = useState('');

  const handleSubmit = () => {
    if (code.trim()) {
      onRedeem(code.trim());
    }
  };

  return (
    <div className="bg-gray-100 min-h-screen">
      <header className="bg-white flex items-center p-4 border-b sticky top-0 z-10">
        <button onClick={onClose} className="p-2 -ml-2">
          <ArrowLeftIcon className="w-6 h-6 text-gray-800" />
        </button>
        <h1 className="text-lg font-semibold text-gray-800 text-center flex-grow -ml-6">Bonus Code</h1>
      </header>
      <main className="p-4 space-y-6">
        <div className="bg-white p-6 rounded-lg shadow-sm text-center">
            <TicketIcon className="w-16 h-16 text-[#0066FF] mx-auto mb-4" />
            <h2 className="text-xl font-bold text-gray-800">Redeem Your Bonus</h2>
            <p className="text-sm text-gray-500 mt-2">Enter your bonus code below to claim your reward. Bonus codes can be found in our official Telegram group.</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm">
          <label htmlFor="bonus-code" className="block text-sm font-medium text-gray-700 mb-2">
            Enter Bonus Code
          </label>
          <input
            id="bonus-code"
            type="text"
            value={code}
            onChange={(e) => setCode(e.target.value.toUpperCase())}
            placeholder="e.g. BONUS2024"
            className="w-full border-gray-300 rounded-md shadow-sm p-3 bg-white focus:border-[#0066FF] focus:ring-[#0066FF] text-center font-semibold tracking-wider"
          />
        </div>
        <div className="pt-2">
          <button
            onClick={handleSubmit}
            disabled={!code.trim()}
            className="w-full bg-gradient-to-r from-[#2CACFF] to-[#0066FF] text-white font-bold py-3.5 rounded-lg shadow-md hover:from-[#0066FF] hover:to-[#004bb5] transition-colors disabled:bg-gray-400 disabled:from-gray-400 disabled:to-gray-500"
          >
            Redeem Now
          </button>
        </div>
      </main>
    </div>
  );
};

export default BonusCodePage;
