import React, { useState } from 'react';
import ReactDOM from 'react-dom/client';
import AdminLoginPage from './components/AdminLoginPage';
import AdminDashboardPage from './components/AdminDashboardPage';

const AdminApp: React.FC = () => {
    const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);
    const [error, setError] = useState('');

    const handleAdminLogin = (credentials: { mobile: string; pass: string }) => {
        if (credentials.mobile === '0256414239' && credentials.pass === '1mymomisBerniceAbenaBentum') {
            setIsAdminLoggedIn(true);
            setError('');
        } else {
            setError('Invalid admin credentials.');
        }
    };

    const handleLogout = () => {
        setIsAdminLoggedIn(false);
    }

    const handleNavigateToUserLogin = () => {
        // Redirect to the main application root
        window.location.href = '/';
    };

    return (
        <div>
            {isAdminLoggedIn ? (
                <AdminDashboardPage onLogout={handleLogout} />
            ) : (
                <AdminLoginPage 
                    onLogin={handleAdminLogin} 
                    error={error} 
                    onNavigateToUserLogin={handleNavigateToUserLogin}
                />
            )}
        </div>
    );
};

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <AdminApp />
  </React.StrictMode>
);