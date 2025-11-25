
import React, { useState, useEffect } from 'react';
import { ArrowLeftIcon, InfoIcon } from './Icons';
import type { User, Wallet } from './storageService';

interface WithdrawalPageProps {
  user: User | null;
  onClose: () => void;
  onShowToast: (message: string, type: 'success' | 'error') => void;
  selectedWallet: Wallet | null;
  onManageWallets: () => void;
  onProcessWithdrawal: (amount: number) => void;
}

const WithdrawalPage: React.FC<WithdrawalPageProps> = ({ user, onClose, onShowToast, selectedWallet, onManageWallets, onProcessWithdrawal }) => {
  const [amount, setAmount] = useState('');
  const [receivedAmount, setReceivedAmount] = useState(0);
  const taxRate = 0.15; // 15%

  useEffect(() => {
    const numericAmount = parseFloat(amount);
    if (!isNaN(numericAmount) && numericAmount > 0) {
      setReceivedAmount(numericAmount * (1 - taxRate));
    } else {
      setReceivedAmount(0);
    }
  }, [amount]);

  const handleWithdraw = () => {
    if (!user) {
        onShowToast('User not found. Please log in again.', 'error');
        return;
    }
    
    // Check if the user has made any investments
    if (!user.investments || user.investments.length === 0) {
        onShowToast('You have to Invest in a product before you can withdraw money', 'error');
        return;
    }
      
    const numericAmount = parseFloat(amount);
    if (!selectedWallet) {
      onShowToast('Please select a withdrawal wallet account.', 'error');
      return;
    }
    if (isNaN(numericAmount) || numericAmount <= 0) {
      onShowToast('Please enter a valid amount.', 'error');
      return;
    }
    if (numericAmount < 20) {
      onShowToast('Minimum withdrawal amount is GHS 20.', 'error');
      return;
    }
    if (numericAmount > user.balance) {
      onShowToast('Insufficient balance.', 'error');
      return;
    }
    
    onProcessWithdrawal(numericAmount);
  };

  return (
    <div className="bg-gray-100 min-h-screen">
      <header className="bg-white flex items-center justify-between p-4 border-b sticky top-0 z-10">
        <button onClick={onClose} className="p-2 -ml-2">
          <ArrowLeftIcon className="w-6 h-6 text-gray-800" />
        </button>
        <h1 className="text-lg font-semibold text-gray-800">Withdrawal</h1>
        <button className="p-2 -mr-2">
          <InfoIcon className="w-6 h-6 text-gray-500" />
        </button>
      </header>
      
      <main className="p-4 space-y-4 pb-20">
        <div className="bg-white p-4 rounded-lg shadow-sm flex justify-between items-center">
          <div>
            <p className="text-sm text-gray-500">Account balance</p>
            <p className="text-2xl font-bold text-gray-800">GHS {user?.balance.toFixed(2) ?? '0.00'}</p>
          </div>
          <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-[#0066FF]">
             <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow-sm space-y-2">
          <h2 className="font-semibold text-gray-800">Withdrawal Method <span className="text-sm text-gray-500 font-normal">(Minimum GHS 20)</span></h2>
          <button className="bg-gradient-to-r from-[#2CACFF] to-[#0066FF] text-white font-semibold py-2 px-4 rounded-md text-sm">
            Withdrawal Channel 1
          </button>
        </div>

        <div className="bg-white p-4 rounded-lg shadow-sm space-y-2">
          <h2 className="font-semibold text-gray-800">Withdrawal account</h2>
          <button onClick={onManageWallets} className="w-full flex justify-between items-center p-3 border border-gray-200 rounded-md text-gray-500">
            {selectedWallet ? (
              <div className="text-left text-gray-800">
                <p className="font-semibold">{selectedWallet.name} ({selectedWallet.type})</p>
                <p className="text-sm text-gray-500">{selectedWallet.accountNumber}</p>
              </div>
            ) : (
              <span>Select the withdrawal wallet account</span>
            )}
            <ChevronRightIcon className="w-5 h-5" />
          </button>
        </div>

        <div className="bg-white p-4 rounded-lg shadow-sm space-y-1">
            <div className="flex justify-between items-baseline">
                <h2 className="font-semibold text-gray-800">Withdrawal amount</h2>
                <span className="text-xs text-gray-500">Tax: 15%</span>
            </div>
          <div className="relative flex items-center">
            <span className="absolute left-4 font-semibold text-gray-600">GHS</span>
            <input 
              type="text"
              inputMode="numeric"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="Please choose the withdrawal amount"
              className="w-full pl-14 pr-4 py-3 border-b border-gray-200 focus:outline-none focus:border-[#0066FF] text-gray-800 bg-white"
            />
          </div>
          <p className="text-xs text-gray-500 pt-2">Amount received: GHS {receivedAmount.toFixed(2)}</p>
        </div>
        
        <button 
          onClick={handleWithdraw}
          className="w-full bg-gradient-to-r from-[#2CACFF] to-[#0066FF] text-white font-bold py-3.5 rounded-lg shadow-md hover:from-[#0066FF] hover:to-[#004bb5] transition-colors mt-4">
          Withdraw money now
        </button>

        <div className="text-left space-y-2 text-xs text-gray-600">
            <h2 className="font-bold text-sm text-center text-gray-800 mb-2">Withdrawal Instructions</h2>
            <ol className="list-decimal list-inside space-y-1 bg-white p-4 rounded-lg shadow-sm">
                <li>Minimum Withdrawal Amount: GHS 20</li>
                <li>Withdrawal Hours: 9:00 AM to 6:00 PM (Monday to Sunday)</li>
                <li>Withdrawal Fee: 15% (Government Fee, used for product maintenance)</li>
                <li>All withdrawals will be processed within 1 hour, in special circumstances, processing may be completed within 24 hours.</li>
                <li><span role="img" aria-label="gift">🎁🎁</span> Once the product countdown ends, your investment will be automatically returned to your wallet!</li>
            </ol>
        </div>
      </main>
    </div>
  );
};

const ChevronRightIcon: React.FC<{className?: string}> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
    </svg>
);


export default WithdrawalPage;
