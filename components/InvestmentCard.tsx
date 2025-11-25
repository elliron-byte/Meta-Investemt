
import React, { useState, useEffect } from 'react';
import type { Investment } from './storageService';

interface InvestmentCardProps {
    investment: Investment;
}

const InvestmentCard: React.FC<InvestmentCardProps> = ({ investment }) => {
    const { product, purchaseTimestamp, creditsReceived } = investment;
    const msInDay = 24 * 60 * 60 * 1000;
    const totalCredits = 30;

    const calculateTimeLeft = () => {
        const nextCreditTimestamp = purchaseTimestamp + (creditsReceived + 1) * msInDay;
        const timeLeft = nextCreditTimestamp - Date.now();
        return timeLeft > 0 ? timeLeft : 0;
    };

    const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());
    const isCompleted = creditsReceived >= totalCredits;

    useEffect(() => {
        if (isCompleted) {
            setTimeLeft(0);
            return;
        }

        const timerId = setInterval(() => {
            setTimeLeft(calculateTimeLeft());
        }, 1000);

        return () => clearInterval(timerId);
    }, [investment]);

    const formatTime = (ms: number) => {
        const totalSeconds = Math.floor(ms / 1000);
        const hours = Math.floor(totalSeconds / 3600);
        const minutes = Math.floor((totalSeconds % 3600) / 60);
        const seconds = totalSeconds % 60;
        return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    };


    return (
        <div className="bg-white rounded-lg shadow-md overflow-hidden p-4 space-y-3 animate-fade-in-up">
            <div className="flex items-center space-x-4">
                <img src={product.imageUrl} alt={`VIP${product.vip}`} className="w-20 h-20 object-cover rounded-md" />
                <div>
                    <h3 className="font-bold text-lg">VIP{product.vip}</h3>
                    <p className="text-sm text-gray-600">Daily income: <span className="font-semibold text-[#0066FF]">GHS {product.dailyIncome.toFixed(2)}</span></p>
                    <p className="text-sm text-gray-500">Total income: GHS {product.totalIncome.toLocaleString()}</p>
                </div>
            </div>
            
            <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                <div 
                    className="h-full bg-gradient-to-r from-[#2CACFF] to-[#0066FF]" 
                    style={{ width: `${(creditsReceived / totalCredits) * 100}%` }}
                ></div>
            </div>
            <div className="flex justify-between text-sm text-gray-500">
                <span>Progress</span>
                <span>{creditsReceived} / {totalCredits} days</span>
            </div>

            <div className="text-center bg-gray-100 p-3 rounded-lg">
                {isCompleted ? (
                    <p className="font-bold text-green-600">Investment Completed</p>
                ) : (
                    <>
                        <p className="text-sm text-gray-600">Next income in:</p>
                        <p className="font-mono text-2xl font-bold text-[#0066FF] tracking-wider">{formatTime(timeLeft)}</p>
                    </>
                )}
            </div>
        </div>
    );
};

export default InvestmentCard;
