
import React from 'react';
import { CopyIcon, InfoIcon } from './Icons';
import type { User } from './storageService';

interface TeamPageProps {
  user: User | null;
  onShowToast: (message: string, type: 'success' | 'error') => void;
}

const TeamPage: React.FC<TeamPageProps> = ({ user, onShowToast }) => {

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    onShowToast(`Copied: ${text}`, 'success');
  };

  const referralCode = user?.referralCode || '...';
  const referralLink = `https://meta-investemt.vercel.app/?ref=${referralCode}`;
  const referralCount = user?.referrals?.length || 0;
  const totalIncome = user?.referralIncome || 0;

  return (
    <div className="bg-white min-h-screen pb-20 text-gray-800">
      {/* Header */}
      <header className="p-4 flex justify-between items-center">
        <h1 className="text-lg font-semibold">Invitation activity</h1>
        <button className="text-sm font-semibold text-[#0066FF] hover:underline">
          My Team &gt;
        </button>
      </header>

      <main className="p-4 space-y-6">
        {/* Invitation Code & Link */}
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 text-center relative shadow-sm">
          <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-white px-3 py-1 text-sm font-semibold text-gray-600 rounded-full border border-gray-200">
            Rule description
          </div>
          <p className="text-2xl font-bold tracking-widest my-4">{referralCode}</p>
          <button 
            onClick={() => handleCopy(referralCode)}
            className="w-full mb-3 text-white font-bold py-2 px-4 rounded-lg bg-gradient-to-r from-[#2CACFF] to-[#0066FF] hover:from-[#0066FF] hover:to-[#004bb5] transition-all"
          >
            Copy code
          </button>
          <p className="text-sm text-gray-500 truncate mb-3">{referralLink}</p>
          <button 
            onClick={() => handleCopy(referralLink)}
            className="w-full text-white font-bold py-2 px-4 rounded-lg bg-gradient-to-r from-[#2CACFF] to-[#0066FF] hover:from-[#0066FF] hover:to-[#004bb5] transition-all"
          >
            Copy link
          </button>
        </div>

        {/* Team Information */}
        <div className="bg-gray-50 rounded-lg p-4 border border-gray-200 shadow-sm">
          <h2 className="text-lg font-bold mb-4 text-center">Team Information</h2>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="bg-blue-100 text-blue-800 p-4 rounded-lg text-center">
              <p className="text-2xl font-bold">{referralCount}</p>
              <p className="text-sm">People</p>
            </div>
            <div className="bg-blue-100 text-blue-800 p-4 rounded-lg text-center">
              <p className="text-2xl font-bold">GHS {totalIncome.toFixed(2)}</p>
              <p className="text-sm">Total income</p>
            </div>
          </div>
          
          <div className="text-sm text-gray-600">
            <div className="grid grid-cols-3 text-center font-semibold mb-2 pb-2 border-b">
              <span>Commission rate</span>
              <span>Valid users</span>
              <span>Income</span>
            </div>
            <div className="grid grid-cols-3 text-center py-2">
              <span>Level 1 Team 5%</span>
              <span>{referralCount}</span>
              <span>{totalIncome.toFixed(2)}</span>
            </div>
            <div className="grid grid-cols-3 text-center py-2">
              <span>Level 2 Team 1%</span>
              <span>0</span>
              <span>0</span>
            </div>
            <div className="grid grid-cols-3 text-center py-2">
              <span>Level 3 Team 1%</span>
              <span>0</span>
              <span>0</span>
            </div>
          </div>
        </div>

        {/* Invitation Bonus */}
        <div className="bg-gray-50 rounded-lg p-4 border border-gray-200 shadow-sm">
            <div className="flex items-center mb-3">
                 <InfoIcon className="w-5 h-5 mr-2 text-[#0066FF]" />
                 <h2 className="text-lg font-bold">Invitation Bonus</h2>
            </div>
            <div className="text-sm text-gray-700 space-y-2">
                <p>When a friend you invite signs up and invests, you immediately receive a cash reward of 5% of their investment amount.</p>
                <p>When your Tier 2 team members invest, you receive a 1% cash bonus.</p>
                <p>When your Tier 3 team members invest, you receive a 1% cash bonus.</p>
                <p>Once your team member invests, the cash bonus is instantly credited to your account and you can withdraw it immediately.</p>
            </div>
        </div>
      </main>
    </div>
  );
};

export default TeamPage;
