
import React, { useState, useEffect } from 'react';
import { getRechargeRecords, updateRechargeRecord, getUsers, updateUser } from './storageService';
import type { RechargeRecord, User } from './storageService';

interface UserRechargePageProps {
    refreshTrigger: number;
}

const UserRechargePage: React.FC<UserRechargePageProps> = ({ refreshTrigger }) => {
    const [records, setRecords] = useState<RechargeRecord[]>([]);
    const [activeTab, setActiveTab] = useState<'pending' | 'all'>('pending');
    const [searchTerm, setSearchTerm] = useState('');
    
    const fetchRecords = async () => {
        const allRecords = await getRechargeRecords();
        setRecords(allRecords.sort((a, b) => b.timestamp - a.timestamp));
    };

    useEffect(() => {
        fetchRecords();
    }, [refreshTrigger]);
    
    const handleApprove = async (record: RechargeRecord) => {
        const users = await getUsers();
        const userToUpdate = users.find(u => u.mobile === record.userMobile);
        
        if (!userToUpdate) {
            alert('Error: Could not find the user to update.');
            return;
        }
        
        const updatedUser: User = {
            ...userToUpdate,
            balance: userToUpdate.balance + record.amount,
        };
        await updateUser(updatedUser);
        
        const updatedRecord: RechargeRecord = { ...record, status: 'successful' };
        await updateRechargeRecord(updatedRecord);
        
        fetchRecords();
    };
    
    const handleReject = async (record: RechargeRecord) => {
        const updatedRecord: RechargeRecord = { ...record, status: 'failed' };
        await updateRechargeRecord(updatedRecord);
        fetchRecords();
    };

    const recordsByTab = activeTab === 'all' 
        ? records 
        : records.filter(r => r.status === activeTab);

    const filteredRecords = recordsByTab.filter(record => 
        record.userMobile.toLowerCase().includes(searchTerm.toLowerCase()) ||
        record.txnId.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const getStatusClass = (status: 'pending' | 'successful' | 'failed') => {
        switch (status) {
            case 'pending': return 'text-yellow-300 bg-yellow-800/50';
            case 'successful': return 'text-green-300 bg-green-800/50';
            case 'failed': return 'text-red-300 bg-red-800/50';
            default: return 'text-gray-300 bg-gray-700';
        }
    }

    return (
        <div className="bg-gray-800 shadow-lg rounded-lg overflow-hidden">
            <div className="p-4 sm:p-6 border-b border-gray-700">
                <h2 className="text-xl font-bold text-white">User Recharge Requests</h2>
                 <div className="mt-4">
                    <input
                        type="text"
                        placeholder="Search by Mobile or TXN ID..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full max-w-lg px-4 py-2 border border-gray-600 bg-gray-900 text-white placeholder-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>
                <div className="flex border-b border-gray-700 mt-4">
                    <button 
                        onClick={() => setActiveTab('pending')}
                        className={`flex-1 py-2 text-sm font-semibold transition-colors ${activeTab === 'pending' ? 'text-blue-400 border-b-2 border-blue-400' : 'text-gray-400'}`}
                    >
                        Pending
                    </button>
                    <button 
                        onClick={() => setActiveTab('all')}
                        className={`flex-1 py-2 text-sm font-semibold transition-colors ${activeTab === 'all' ? 'text-blue-400 border-b-2 border-blue-400' : 'text-gray-400'}`}
                    >
                        All Records
                    </button>
                </div>
            </div>
            
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-700">
                    <thead className="bg-gray-700/50 hidden md:table-header-group">
                        <tr>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">User Mobile</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Amount</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Txn ID</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Date</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Status</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="bg-gray-800 divide-y divide-gray-700">
                        {filteredRecords.length > 0 ? (
                            filteredRecords.map(record => (
                                <tr key={record.id} className="block md:table-row hover:bg-gray-700/50 transition-colors p-4 md:p-0 border-b md:border-none border-gray-700">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white block md:table-cell" data-label="User Mobile">{record.userMobile}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300 block md:table-cell" data-label="Amount">{record.amount.toFixed(2)}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300 block md:table-cell" data-label="Txn ID">
                                        <span className="font-mono text-blue-400 bg-gray-900 px-2 py-1 rounded">{record.txnId}</span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400 block md:table-cell" data-label="Date">{new Date(record.timestamp).toLocaleString()}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm block md:table-cell" data-label="Status">
                                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusClass(record.status)}`}>
                                            {record.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium block md:table-cell" data-label="Actions">
                                        {record.status === 'pending' && (
                                            <div className="flex space-x-4">
                                                <button onClick={() => handleApprove(record)} className="text-green-400 hover:text-green-300 transition-colors font-semibold">Approve</button>
                                                <button onClick={() => handleReject(record)} className="text-red-400 hover:text-red-300 transition-colors font-semibold">Reject</button>
                                            </div>
                                        )}
                                    </td>
                                </tr>
                            ))
                        ) : (
                             <tr>
                                <td colSpan={6} className="px-6 py-10 text-center text-sm text-gray-500">
                                    {searchTerm ? 'No records found matching your search.' : 'No records found.'}
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default UserRechargePage;
