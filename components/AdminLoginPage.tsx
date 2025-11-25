
import React, { useState } from 'react';

interface AdminLoginPageProps {
  onLogin: (credentials: { mobile: string; pass: string }) => void;
  error: string;
  onNavigateToUserLogin: () => void;
}

const AdminLoginPage: React.FC<AdminLoginPageProps> = ({ onLogin, error, onNavigateToUserLogin }) => {
  const [mobile, setMobile] = useState('');
  const [pass, setPass] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onLogin({ mobile, pass });
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900">
      <div className="w-full max-w-md p-8 space-y-8 bg-gray-800 rounded-lg shadow-lg">
        <div>
          <h2 className="text-3xl font-extrabold text-center text-white">
            Admin Dashboard Login
          </h2>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <input
                id="mobile-number"
                name="mobile"
                type="text"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-3 border border-gray-700 bg-gray-900 text-white placeholder-gray-500 focus:outline-none focus:ring-[#0066FF] focus:border-[#0066FF] focus:z-10 sm:text-sm rounded-t-md"
                placeholder="Admin number"
                value={mobile}
                onChange={(e) => setMobile(e.target.value)}
              />
            </div>
            <div>
              <input
                id="password"
                name="password"
                type="password"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-3 border border-gray-700 bg-gray-900 text-white placeholder-gray-500 focus:outline-none focus:ring-[#0066FF] focus:border-[#0066FF] focus:z-10 sm:text-sm rounded-b-md"
                placeholder="Password"
                value={pass}
                onChange={(e) => setPass(e.target.value)}
              />
            </div>
          </div>
          
          {error && <p className="text-center text-red-400 text-sm">{error}</p>}

          <div>
            <button
              type="submit"
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-blue-500"
            >
              Log in
            </button>
          </div>
        </form>
         <p className="text-center text-sm text-gray-400">
          Not an admin? <button type="button" onClick={onNavigateToUserLogin} className="font-medium text-blue-500 hover:text-blue-400 transition-colors">Go to User Login</button>
        </p>
      </div>
    </div>
  );
};

export default AdminLoginPage;
