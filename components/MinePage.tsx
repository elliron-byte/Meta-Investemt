
import React from 'react';
import { DiamondIcon, PlayIcon, HistoryIcon, BankIcon, InfoIcon, HeadsetIcon, LogoutIcon, ChevronRightIcon, TicketIcon } from './Icons';

type User = {
    mobile: string;
    balance: number;
};

interface MinePageProps {
    user: User;
    onLogout: () => void;
    onRechargeClick: () => void;
    onWithdrawalClick: () => void;
    onNavigateToProject: () => void;
    onOpenRechargeRecords: () => void;
    onOpenWithdrawalRecords: () => void;
    onShowToast: (message: string, type: 'success' | 'error') => void;
    onManageWallets: () => void;
    onOpenCustomerService: () => void;
    onOpenBonusCodePage: () => void;
}

const MinePage: React.FC<MinePageProps> = ({ user, onLogout, onRechargeClick, onWithdrawalClick, onNavigateToProject, onOpenRechargeRecords, onOpenWithdrawalRecords, onShowToast, onManageWallets, onOpenCustomerService, onOpenBonusCodePage }) => {

  const handleCopy = () => {
    navigator.clipboard.writeText(user.mobile);
    onShowToast('Mobile number copied!', 'success');
  };

  const ListItem: React.FC<{ icon: React.ReactNode; label: string; onClick?: () => void; }> = ({ icon, label, onClick }) => (
    <button onClick={onClick} className="w-full flex items-center justify-between text-left p-4 hover:bg-gray-100 transition-colors rounded-lg">
      <div className="flex items-center">
        {icon}
        <span className="ml-4 text-gray-800">{label}</span>
      </div>
      <ChevronRightIcon className="w-5 h-5 text-gray-400" />
    </button>
  );

  return (
    <div className="bg-gray-50 pb-20 min-h-screen">
      <header className="p-4 flex justify-between items-center bg-white shadow-sm">
        <h1 className="font-bold text-lg text-gray-800">User Center</h1>
        <DiamondIcon className="w-6 h-6 text-[#0066FF]" />
      </header>

      <main className="p-4">
        <div className="bg-cover bg-center rounded-2xl shadow-lg p-5 text-white mb-6" style={{backgroundImage: "url('https://iili.io/fFX8vQn.png')"}}>
            <div className="flex justify-between items-start">
                <div>
                    <p className="text-sm opacity-90">Mobile</p>
                    <div className="flex items-center space-x-2">
                        <p className="text-2xl font-bold tracking-wider">{user.mobile}</p>
                        <button onClick={handleCopy} className="bg-white/30 text-white text-xs font-semibold px-3 py-1 rounded-full backdrop-blur-sm hover:bg-white/50 transition">Copy</button>
                    </div>
                </div>
                <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center text-xl font-bold text-gray-700 border-2 border-white">A</div>
            </div>
            <div className="mt-6">
                <p className="text-sm opacity-90">Account balance</p>
                <div className="flex justify-between items-end">
                    <p className="text-4xl font-bold">GHS {user.balance.toFixed(2)}</p>
                    <div className="flex space-x-2">
                        <button onClick={onRechargeClick} className="bg-white/90 text-[#0066FF] font-bold px-4 py-2 rounded-full text-sm hover:bg-white transition">Recharge</button>
                        <button onClick={onWithdrawalClick} className="bg-white/90 text-[#0066FF] font-bold px-4 py-2 rounded-full text-sm hover:bg-white transition">Withdrawal</button>
                    </div>
                </div>
            </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm p-2 mb-4">
            <h2 className="font-bold text-gray-800 px-4 py-2">Banking and Payment</h2>
            <ListItem icon={<PlayIcon className="w-6 h-6 text-[#0066FF]" />} label="My project" onClick={onNavigateToProject} />
            <ListItem icon={<TicketIcon className="w-6 h-6 text-[#0066FF]" />} label="Bonus code" onClick={onOpenBonusCodePage} />
            <ListItem icon={<BankIcon className="w-6 h-6 text-[#0066FF]" />} label="Bank account management" onClick={onManageWallets} />
        </div>

        <div className="bg-white rounded-2xl shadow-sm p-2">
            <h2 className="font-bold text-gray-800 px-4 py-2">Information</h2>
            <ListItem icon={<HistoryIcon className="w-6 h-6 text-[#0066FF]" />} label="Recharge records" onClick={onOpenRechargeRecords} />
            <ListItem icon={<HistoryIcon className="w-6 h-6 text-[#0066FF]" />} label="Withdrawal records" onClick={onOpenWithdrawalRecords} />
            <ListItem icon={<HeadsetIcon className="w-6 h-6 text-[#0066FF]" />} label="Customer Service" onClick={onOpenCustomerService} />
            <ListItem icon={<LogoutIcon className="w-6 h-6 text-gray-500" />} label="Safe exit" onClick={onLogout} />
        </div>
      </main>
    </div>
  );
};

export default MinePage;
