
import React, { useState, useEffect } from 'react';
import { CloseIcon, ChevronLeftIcon, ChevronRightIcon, CopyIcon, CameraIcon } from './Icons';
import EWalletModal from './EWalletModal';

interface RepaymentPageProps {
  onClose: () => void;
  amount: number;
  onShowToast: (message: string, type: 'success' | 'error') => void;
  onSubmit: (txnId: string) => void;
}

const RepaymentPage: React.FC<RepaymentPageProps> = ({ onClose, amount, onShowToast, onSubmit }) => {
    const [timeLeft, setTimeLeft] = useState(29 * 60 + 31);
    const [isEWalletModalOpen, setIsEWalletModalOpen] = useState(true);
    const [currentSlide, setCurrentSlide] = useState(0);
    const [txnId, setTxnId] = useState('');
    const [ewalletNumber, setEwalletNumber] = useState<string | null>(null);

    const slides = [
        'https://i.im.ge/2025/11/15/nGeOdr.Screenshot-2025-11-14-14-45-35.png',
        'https://i.im.ge/2025/11/15/nGeuJm.Screenshot-2025-11-14-14-45-27.png'
    ];

    useEffect(() => {
        if (timeLeft === 0) return;
        const timerId = setInterval(() => setTimeLeft(prev => (prev > 0 ? prev - 1 : 0)), 1000);
        return () => clearInterval(timerId);
    }, [timeLeft]);

    const formatTime = (seconds: number) => {
        const minutes = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    const nextSlide = () => setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
    const prevSlide = () => setCurrentSlide((prev) => (prev === 0 ? slides.length - 1 : prev - 1));

    useEffect(() => {
        const slideInterval = setInterval(nextSlide, 3000); // Auto-scroll every 3 seconds
        return () => clearInterval(slideInterval);
    }, []);

    const handleCopy = (text: string) => {
      navigator.clipboard.writeText(text);
      onShowToast('Copied!', 'success');
    };

    const handleEWalletConfirm = (details: { operator: string; ewallet: string; }) => {
        setEwalletNumber(details.ewallet);
        setIsEWalletModalOpen(false);
    };

    const handleSubmit = () => {
        if (!txnId.trim()) {
          onShowToast('Please enter the Transaction ID.', 'error');
          return;
        }
        onSubmit(txnId);
    };

    return (
        <div className="fixed inset-0 bg-[#42817A] text-gray-800 font-sans z-40 flex flex-col">
            {isEWalletModalOpen && <EWalletModal onClose={() => setIsEWalletModalOpen(false)} onConfirm={handleEWalletConfirm} onShowToast={onShowToast} />}
            
            <button className="fixed right-0 top-1/2 -translate-y-1/2 bg-white/80 p-2 rounded-l-full shadow-lg backdrop-blur-sm z-50">
                <CameraIcon className="w-6 h-6 text-gray-700" />
            </button>

            <header className="flex-shrink-0 bg-gray-100/80 backdrop-blur-sm h-12 flex items-center justify-center relative">
                <span className="font-mono text-lg">{formatTime(timeLeft)}</span>
                <button onClick={onClose} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-800">
                    <CloseIcon className="w-6 h-6" />
                </button>
            </header>
            
            <main className="flex-grow overflow-y-auto p-4 space-y-4">
                <div className="bg-[#FDF6E4] rounded-lg p-4">
                    <h3 className="font-bold text-sm mb-2">Important Reminder</h3>
                    <p className="text-xs mb-3">When you have completed the payment, please backfill the Txn ID (11 or 16 digits) here from MoMo pay or Vodafone (Telecel Play Ghana) such as:</p>
                    <div className="relative h-40">
                        <button onClick={prevSlide} className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/20 text-white p-1 rounded-full z-10">
                            <ChevronLeftIcon className="w-5 h-5" />
                        </button>
                        <div className="w-full h-full overflow-hidden rounded-lg relative">
                           {slides.map((slide, index) => (
                                <img
                                    key={slide}
                                    src={slide}
                                    alt="Transaction ID Example"
                                    className={`absolute inset-0 w-full h-full object-contain transition-opacity duration-700 ease-in-out ${currentSlide === index ? 'opacity-100' : 'opacity-0'}`}
                                />
                            ))}
                        </div>
                        <button onClick={nextSlide} className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/20 text-white p-1 rounded-full z-10">
                            <ChevronRightIcon className="w-5 h-5" />
                        </button>
                         <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex space-x-2">
                            {slides.map((_, index) => (
                                <div key={index} className={`w-2 h-2 rounded-full ${currentSlide === index ? 'bg-white' : 'bg-white/50'}`}></div>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="relative">
                    <span className="absolute -top-2 left-4 bg-red-500 text-white text-xs font-semibold px-3 py-1 rounded-full z-10">It is important!</span>
                    <div className="bg-white rounded-lg p-4 pt-6">
                        <label className="text-sm font-semibold">Transaction ID (Txn ID 11 or 16 digits)</label>
                        <div className="relative mt-1">
                            <input 
                                type="text"
                                value={txnId}
                                onChange={(e) => setTxnId(e.target.value)}
                                className="w-full border-b-2 border-gray-200 focus:border-teal-500 outline-none p-2 bg-white"
                            />
                            {txnId && (
                                <button onClick={() => setTxnId('')} className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400">
                                    <CloseIcon className="w-5 h-5"/>
                                </button>
                            )}
                        </div>
                    </div>
                </div>

                <div className="bg-[#FDF6E4] rounded-lg p-4 space-y-3">
                    <p className="text-sm">Please repay to <a href="#" className="text-teal-600 font-semibold">MoMo Pay</a> account.</p>
                    <div className="flex items-center justify-between bg-white p-2 rounded-md">
                        <div className="flex items-center">
                            <img src="https://iili.io/fFj53uI.png" alt="MoMo Pay" className="w-10 h-10 mr-2 flex-shrink-0 object-contain rounded-md" />
                            <div>
                                <p className="text-xs text-gray-500">MoMo Pay</p>
                                <p className="font-bold text-lg text-gray-800">020 719 2366</p>
                            </div>
                        </div>
                        <button onClick={() => handleCopy('020 719 2366')} className="bg-teal-100 text-teal-600 font-semibold px-3 py-1.5 rounded text-sm flex items-center space-x-1">
                            <CopyIcon className="w-4 h-4" />
                            <span>Copy</span>
                        </button>
                    </div>
                    <div className="flex items-center justify-between bg-white p-2 rounded-md">
                        <p className="font-bold text-gray-800">GHS {amount.toFixed(2)}</p>
                        <button onClick={() => handleCopy(amount.toFixed(2))} className="bg-teal-100 text-teal-600 font-semibold px-3 py-1.5 rounded text-sm flex items-center space-x-1">
                             <CopyIcon className="w-4 h-4" />
                            <span>Copy</span>
                        </button>
                    </div>
                </div>
            </main>
            
            <footer className="flex-shrink-0 bg-white p-3 shadow-[0_-2px_5px_rgba(0,0,0,0.05)]">
                <button onClick={handleSubmit} className="w-full bg-teal-500 hover:bg-teal-600 text-white font-bold py-3.5 rounded-lg transition-colors">
                    SUBMIT
                </button>
            </footer>
        </div>
    );
};

export default RepaymentPage;
