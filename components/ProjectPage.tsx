
import React from 'react';
import { ChartBarIcon } from './Icons';
import InvestmentCard from './InvestmentCard';
import type { User, Investment } from './storageService';

interface ProjectPageProps {
    user: User | null;
}

const ProjectPage: React.FC<ProjectPageProps> = ({ user }) => {
    const investments = user?.investments || [];
    const totalDailyIncome = investments.reduce((sum, inv) => inv.creditsReceived < 30 ? sum + inv.product.dailyIncome : sum, 0);

    return (
        <div className="p-4 text-gray-800 pb-20 min-h-screen bg-gray-50">
            <header className="flex justify-between items-start mb-4">
                <div>
                    <h1 className="text-2xl font-bold">My investment list</h1>
                    <p className="text-sm text-gray-500">quantity ordered: {investments.length}</p>
                </div>
                <div className="bg-gradient-to-r from-[#2CACFF] to-[#0066FF] text-white p-3 rounded-lg shadow-md flex items-center space-x-2">
                    <div>
                        <p className="text-xs">Daily income</p>
                        <p className="font-bold text-lg">GHS {totalDailyIncome.toFixed(2)}</p>
                    </div>
                    <ChartBarIcon className="w-8 h-8 opacity-70" />
                </div>
            </header>

            {investments.length > 0 ? (
                <div className="space-y-4">
                    {investments.map((investment) => (
                        <InvestmentCard
                            key={investment.purchaseTimestamp}
                            investment={investment}
                        />
                    ))}
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center text-center mt-12">
                    <img
                        src="https://iili.io/fFWEKo7.png"
                        alt="Meta Logo"
                        className="rounded-lg shadow-lg w-full max-w-sm object-contain h-48 mb-8"
                    />
                    <p className="text-gray-600">You are not currently purchasing a Meta Plan.</p>
                </div>
            )}
        </div>
    );
};

export default ProjectPage;
