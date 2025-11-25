
import React, { useState, useEffect } from 'react';
import { ArrowLeftIcon } from './Icons';
import { getRechargeRecords } from './storageService';
import type { User, RechargeRecord } from './storageService';

interface RechargeRecordsPageProps {
  onClose: () => void;
  user: User | null;
}

const RechargeRecordsPage: React.FC<RechargeRecordsPageProps> = ({ onClose, user }) => {
  const [activeTab, setActiveTab] = useState<'pending' | 'successful'>('pending');
  const [records, setRecords] = useState<RechargeRecord[]>([]);

  useEffect(() => {
    const fetchRecords = async () => {
        if (user) {
            const allRecords = await getRechargeRecords();
            const userRecords = allRecords.filter(rec => rec.userMobile === user.mobile);
            setRecords(userRecords.sort((a, b) => b.timestamp - a.timestamp));
        }
    }
    fetchRecords();
  }, [user]);

  const filteredRecords = records.filter(record => record.status === activeTab);

  const renderContent = () => {
    if (filteredRecords.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center text-center mt-12 p-4">
          <img 
            src="https://img.icons8.com/ios/100/000000/empty-box.png" 
            alt="No records" 
            className="w-24 h-24 mb-4 text-gray-400"
          />
          <p className="text-gray-500">No records yet.</p>
        </div>
      );
    }
    
    return (
      <div className="p-4 space-y-3">
        {filteredRecords.map(record => (
          <div key={record.id} className="bg-white p-4 rounded-lg shadow-sm animate-fade-in-up">
            <div className="flex justify-between items-center">
              <div>
                <p className="font-semibold text-gray-800">GHS {record.amount.toFixed(2)}</p>
                <p className="text-xs text-gray-500">{new Date(record.timestamp).toLocaleString()}</p>
                <p className="text-xs text-gray-500 mt-1">Txn ID: {record.txnId}</p>
              </div>
              <span className={`text-sm font-bold capitalize px-3 py-1 rounded-full ${
                  record.status === 'pending' ? 'text-yellow-800 bg-yellow-100' : 
                  record.status === 'successful' ? 'text-green-800 bg-green-100' :
                  'text-red-800 bg-red-100'
              }`}>
                  {record.status}
              </span>
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      <header className="bg-white flex items-center justify-between p-4 border-b">
        <button onClick={onClose} className="p-2 -ml-2"><ArrowLeftIcon className="w-6 h-6 text-gray-800" /></button>
        <h1 className="text-lg font-semibold text-gray-800">Recharge Records</h1>
        <div className="w-6 h-6"></div>
      </header>

      <div className="flex border-b bg-white">
        <button 
          onClick={() => setActiveTab('pending')}
          className={`flex-1 py-3 text-sm font-semibold transition-colors ${activeTab === 'pending' ? 'text-[#0066FF] border-b-2 border-[#0066FF]' : 'text-gray-500'}`}
        >
          Pending recharge
        </button>
        <button 
          onClick={() => setActiveTab('successful')}
          className={`flex-1 py-3 text-sm font-semibold transition-colors ${activeTab === 'successful' ? 'text-[#0066FF] border-b-2 border-[#0066FF]' : 'text-gray-500'}`}
        >
          Successful recharge
        </button>
      </div>

      <main>
        {renderContent()}
      </main>
    </div>
  );
};

export default RechargeRecordsPage;
