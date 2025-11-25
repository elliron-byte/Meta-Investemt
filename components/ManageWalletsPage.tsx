
import React from 'react';
import { ArrowLeftIcon, BankIcon, ChevronRightIcon } from './Icons';
import type { User, Wallet } from './storageService';

interface ManageWalletsPageProps {
  user: User | null;
  onClose: () => void;
  onAdd: () => void;
  onSelectWallet: (wallet: Wallet) => void;
}

const ManageWalletsPage: React.FC<ManageWalletsPageProps> = ({ user, onClose, onAdd, onSelectWallet }) => {
  const wallets = user?.wallets || [];

  return (
    <div className="bg-gray-100 min-h-screen">
      <header className="bg-white flex items-center justify-between p-4 border-b sticky top-0 z-10">
        <button onClick={onClose} className="p-2 -ml-2">
          <ArrowLeftIcon className="w-6 h-6 text-gray-800" />
        </button>
        <h1 className="text-lg font-semibold text-gray-800">Managing the withdrawal wallet account</h1>
        <div className="w-6 h-6"></div>
      </header>
      
      <main className="p-4 space-y-4">
        {wallets.length > 0 ? (
          wallets.map((wallet, index) => (
            <button key={index} onClick={() => onSelectWallet(wallet)} className="w-full bg-white p-4 rounded-lg shadow-sm flex justify-between items-center text-left">
              <div className="flex items-center">
                <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center mr-4">
                    <BankIcon className="w-6 h-6 text-gray-600" />
                </div>
                <div>
                  <p className="font-bold text-gray-800">{wallet.type}</p>
                  <p className="text-sm text-gray-600">{wallet.name}</p>
                  <p className="text-sm text-gray-500">{wallet.accountNumber}</p>
                </div>
              </div>
               <ChevronRightIcon className="w-5 h-5 text-gray-400" />
            </button>
          ))
        ) : (
          <div className="text-center text-gray-500 py-10">
            <p>No withdrawal wallets added yet.</p>
          </div>
        )}

        <button 
          onClick={onAdd}
          className="w-full bg-gradient-to-r from-[#2CACFF] to-[#0066FF] text-white font-bold py-3.5 rounded-lg shadow-md hover:from-[#0066FF] hover:to-[#004bb5] transition-colors mt-4">
          Add
        </button>
      </main>
    </div>
  );
};

export default ManageWalletsPage;
