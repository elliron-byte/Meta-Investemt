
import React, { useState } from 'react';
import { ArrowLeftIcon, InfoIcon, HeadsetIcon } from './Icons';

interface RechargePageProps {
  onClose: () => void;
  onDeposit: (amount: string) => void;
  onShowToast: (message: string, type: 'success' | 'error') => void;
}

const RechargePage: React.FC<RechargePageProps> = ({ onClose, onDeposit, onShowToast }) => {
    const [amount, setAmount] = useState<string>('40');
    const [selectedPreset, setSelectedPreset] = useState<number | null>(40);
    const [selectedChannel, setSelectedChannel] = useState<number>(1);
    
    const presetAmounts = [40, 100, 200, 500, 1000, 2000, 4000, 10000];

    const handlePresetClick = (presetAmount: number) => {
        setSelectedPreset(presetAmount);
        setAmount(presetAmount.toString());
    };

    const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        if (/^\d*$/.test(value)) {
            setAmount(value);
            const numericValue = parseInt(value, 10);
            if (!isNaN(numericValue) && presetAmounts.includes(numericValue)) {
                setSelectedPreset(numericValue);
            } else {
                setSelectedPreset(null);
            }
        }
    };

    const handleDepositClick = () => {
        if (!amount || parseInt(amount, 10) < 40) {
            onShowToast('Minimum deposit amount is GHS 40.', 'error');
            return;
        }
        onDeposit(amount);
    }
    
    return (
        <div className="bg-gray-50 min-h-screen">
            <div className="bg-white">
                <header className="flex items-center justify-between p-4 border-b">
                    <button onClick={onClose} className="p-2 -ml-2"><ArrowLeftIcon className="w-6 h-6 text-gray-800" /></button>
                    <h1 className="text-lg font-semibold text-gray-800">Recharge</h1>
                    <button className="p-2 -mr-2"><InfoIcon className="w-6 h-6 text-gray-500" /></button>
                </header>
            </div>
            
            <main className="p-4 space-y-8 bg-gray-50 pb-24">
                <section className="bg-white p-4 rounded-lg shadow-sm">
                    <h2 className="font-semibold mb-3 text-gray-800">Recharge amount <span className="text-gray-500 font-normal text-sm">(Minimum GHS 40)</span></h2>
                    <div className="grid grid-cols-4 gap-3 mb-4">
                        {presetAmounts.map(p => (
                            <button 
                                key={p} 
                                onClick={() => handlePresetClick(p)}
                                className={`py-2 px-1 text-sm border rounded-md transition-all duration-200 ${selectedPreset === p ? 'bg-[#0066FF] text-white border-[#0066FF] ring-2 ring-offset-1 ring-[#0066FF]' : 'bg-white border-gray-300 text-gray-700 hover:border-[#0066FF]'}`}
                            >
                                {p}
                            </button>
                        ))}
                    </div>
                    <div className="relative flex items-center">
                        <span className="absolute left-4 font-semibold text-gray-600">GHS</span>
                        <input 
                            type="text"
                            inputMode="numeric"
                            value={amount}
                            onChange={handleAmountChange}
                            placeholder="Please enter the recharge amount"
                            className="w-full pl-14 pr-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0066FF] focus:border-transparent text-gray-800 bg-white"
                        />
                    </div>
                </section>

                <section className="bg-white p-4 rounded-lg shadow-sm">
                    <h2 className="font-semibold mb-3 text-gray-800">Recharge channels</h2>
                    <button 
                        onClick={() => setSelectedChannel(1)}
                        className={`w-full py-3 rounded-md transition-colors text-white font-semibold ${selectedChannel === 1 ? 'bg-gradient-to-r from-[#2CACFF] to-[#0066FF] shadow-md' : 'bg-gray-400'}`}
                    >
                       Recharge Channel 1
                    </button>
                </section>

                <button 
                    onClick={handleDepositClick}
                    className="w-full py-4 rounded-md text-white text-lg font-semibold bg-gradient-to-r from-[#2CACFF] to-[#0066FF] shadow-lg hover:from-[#0066FF] hover:to-[#004bb5] transition-all"
                >
                    Deposit now
                </button>

                <section className="pt-4 text-left">
                    <h2 className="font-semibold text-center mb-4 text-gray-800">Recharge Instructions</h2>
                    <ol className="text-sm text-gray-600 space-y-3 list-decimal list-inside bg-white p-4 rounded-lg shadow-sm">
                        <li>Minimum deposit amount: 40 (Please do not deposit amounts less than 40; otherwise, these amounts will not be credited to your account balance, and we will not be responsible for such deposits.)</li>
                        <li>All deposits must be made through the app. Do not transfer funds privately.</li>
                        <li>Please create a new account before each deposit; do not save your account and reuse the same account for deposits.</li>
                        <li>If your deposit does not arrive within 10 minutes, please contact official customer service for further assistance.</li>
                    </ol>
                </section>
            </main>
             <button className="fixed bottom-24 right-4 bg-white w-14 h-14 rounded-full shadow-lg flex items-center justify-center text-gray-600 border-2 border-gray-200 z-10 hover:bg-gray-100 transition-colors">
                <HeadsetIcon className="w-7 h-7 text-gray-500" />
            </button>
        </div>
    );
};

export default RechargePage;
