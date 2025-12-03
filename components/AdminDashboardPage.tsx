import React, { useState, useEffect, useRef } from 'react';
import { getUsers, updateUser, deleteUser } from './storageService';
import type { User } from './storageService';
import FundAccountModal from './FundAccountModal';
import UserRechargePage from './UserRechargePage';
import { RefreshIcon } from './Icons';

interface AdminDashboardPageProps {
    onLogout: () => void;
}

const AdminDashboardPage: React.FC<AdminDashboardPageProps> = ({ onLogout }) => {
    const [users, setUsers] = useState<User[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [isFundModalOpen, setIsFundModalOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const [adminView, setAdminView] = useState<'users' | 'recharges'>('users');
    const [refreshKey, setRefreshKey] = useState(0);
    const [isRefreshing, setIsRefreshing] = useState(false);
    
    // Selection and Deletion State
    const [selectedUsers, setSelectedUsers] = useState<Set<string>>(new Set());
    const [isDeleting, setIsDeleting] = useState(false);
    
    // Fetch users whenever refreshKey changes
    useEffect(() => {
        const fetchUsers = async () => {
            const data = await getUsers();
            setUsers(data);
        };
        fetchUsers();
    }, [refreshKey]);

    // Setup auto-refresh interval
    useEffect(() => {
        const intervalId = setInterval(() => {
            handleRefresh();
        }, 10000); // Auto-refresh every 10 seconds

        return () => clearInterval(intervalId);
    }, []);

    const handleRefresh = () => {
        setIsRefreshing(true);
        setRefreshKey(prevKey => prevKey + 1);
        setTimeout(() => setIsRefreshing(false), 500);
    };

    const handleOpenFundModal = (user: User) => {
        setSelectedUser(user);
        setIsFundModalOpen(true);
    };

    const handleCloseFundModal = () => {
        setSelectedUser(null);
        setIsFundModalOpen(false);
    };

    const handleFundAccount = async (amount: number) => {
        if (!selectedUser) return;

        const updatedUser = {
            ...selectedUser,
            balance: selectedUser.balance + amount,
        };
        
        await updateUser(updatedUser);

        setUsers(prevUsers => 
            prevUsers.map(u => u.mobile === updatedUser.mobile ? updatedUser : u)
        );

        handleCloseFundModal();
    };

    const filteredUsers = users.filter(user =>
        user.mobile.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Selection Handlers
    const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.checked) {
            const newSelected = new Set(selectedUsers);
            filteredUsers.forEach(u => newSelected.add(u.mobile));
            setSelectedUsers(newSelected);
        } else {
            const newSelected = new Set(selectedUsers);
            filteredUsers.forEach(u => newSelected.delete(u.mobile));
            setSelectedUsers(newSelected);
        }
    };

    const handleSelectUser = (mobile: string) => {
        const newSelected = new Set(selectedUsers);
        if (newSelected.has(mobile)) {
            newSelected.delete(mobile);
        } else {
            newSelected.add(mobile);
        }
        setSelectedUsers(newSelected);
    };

    const handleDeleteSelected = async () => {
        if (selectedUsers.size === 0) return;
        if (!window.confirm(`Are you sure you want to permanently delete ${selectedUsers.size} users? This action cannot be undone.`)) return;

        setIsDeleting(true);
        const mobiles = Array.from(selectedUsers) as string[];
        let deletedCount = 0;

        for (const mobile of mobiles) {
            const success = await deleteUser(mobile);
            if (success) deletedCount++;
        }

        setSelectedUsers(new Set());
        handleRefresh();
        setIsDeleting(false);
        if (deletedCount > 0) {
            alert(`Successfully deleted ${deletedCount} users.`);
        }
    };

    const allVisibleSelected = filteredUsers.length > 0 && filteredUsers.every(u => selectedUsers.has(u.mobile));
    
    return (
        <div className="min-h-screen bg-gray-900 text-gray-200 p-4 sm:p-6 lg:p-8">
            <header className="flex justify-between items-center mb-6 pb-4 border-b border-gray-700">
                <div className="flex items-center space-x-4">
                    <h1 className="text-2xl sm:text-3xl font-bold text-white">Admin Dashboard</h1>
                    <button
                        onClick={handleRefresh}
                        className="p-2 rounded-full text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-blue-500"
                        aria-label="Refresh data"
                    >
                        <RefreshIcon className={`w-6 h-6 transition-transform ${isRefreshing ? 'animate-spin' : ''}`} />
                    </button>
                </div>
                <button
                    onClick={onLogout}
                    className="px-4 py-2 text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-blue-500"
                >
                    Logout
                </button>
            </header>

            <nav className="mb-6 flex space-x-2 sm:space-x-4 border-b border-gray-700">
                <button 
                    onClick={() => setAdminView('users')}
                    className={`px-3 sm:px-4 py-2 text-sm font-medium rounded-t-md transition-colors ${adminView === 'users' ? 'bg-gray-800 text-white' : 'text-gray-400 hover:bg-gray-800/50 hover:text-white'}`}
                >
                    User List
                </button>
                <button 
                    onClick={() => setAdminView('recharges')}
                    className={`px-3 sm:px-4 py-2 text-sm font-medium rounded-t-md transition-colors ${adminView === 'recharges' ? 'bg-gray-800 text-white' : 'text-gray-400 hover:bg-gray-800/50 hover:text-white'}`}
                >
                    User Recharge
                </button>
            </nav>

            {adminView === 'users' && (
                <>
                    <div className="mb-6 flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
                        <input
                            type="text"
                            placeholder="Search by mobile number..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full sm:max-w-md px-4 py-3 border border-gray-700 bg-gray-800 text-white placeholder-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        {selectedUsers.size > 0 && (
                            <button
                                onClick={handleDeleteSelected}
                                disabled={isDeleting}
                                className="w-full sm:w-auto ml-0 sm:ml-4 px-4 py-3 bg-red-600 hover:bg-red-700 text-white font-medium rounded-md shadow-sm transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:ring-offset-gray-900 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isDeleting ? 'Deleting...' : `Delete Selected (${selectedUsers.size})`}
                            </button>
                        )}
                    </div>

                    <div className="bg-gray-800 shadow-lg rounded-lg overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-700">
                                <thead className="bg-gray-700/50">
                                    <tr>
                                        <th scope="col" className="px-6 py-3 text-left">
                                             <input 
                                                type="checkbox" 
                                                className="form-checkbox h-4 w-4 text-blue-600 transition duration-150 ease-in-out bg-gray-900 border-gray-600 rounded focus:ring-blue-500"
                                                checked={allVisibleSelected}
                                                onChange={handleSelectAll}
                                            />
                                        </th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Mobile Number</th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Balance (GHS)</th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Investments</th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Wallets</th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-gray-800 divide-y divide-gray-700">
                                    {filteredUsers.length > 0 ? (
                                        filteredUsers.map((user) => (
                                            <tr key={user.mobile} className="hover:bg-gray-700/50 transition-colors">
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <input 
                                                        type="checkbox" 
                                                        className="form-checkbox h-4 w-4 text-blue-600 transition duration-150 ease-in-out bg-gray-900 border-gray-600 rounded focus:ring-blue-500"
                                                        checked={selectedUsers.has(user.mobile)}
                                                        onChange={() => handleSelectUser(user.mobile)}
                                                    />
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">{user.mobile}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{user.balance.toFixed(2)}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{user.investments?.length || 0}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{user.wallets?.length || 0}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                    <button 
                                                        onClick={() => handleOpenFundModal(user)}
                                                        className="text-blue-400 hover:text-blue-300 transition-colors"
                                                    >
                                                        Fund Account
                                                    </button>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan={6} className="px-6 py-10 text-center text-sm text-gray-500">
                                                No users found.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                    <footer className="text-center mt-8 text-sm text-gray-500">
                        <p>Total Users: {users.length}</p>
                    </footer>
                </>
            )}

            {adminView === 'recharges' && <UserRechargePage refreshTrigger={refreshKey} />}
            
            <FundAccountModal 
                isOpen={isFundModalOpen}
                onClose={handleCloseFundModal}
                onConfirm={handleFundAccount}
                user={selectedUser}
            />
        </div>
    );
};

export default AdminDashboardPage;