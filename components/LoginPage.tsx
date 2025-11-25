
import React, { useState } from 'react';
import { UserIcon, LockIcon, MetaLogo } from './Icons';

interface LoginPageProps {
  onNavigateToSignUp: () => void;
  onLogin: (credentials: { mobile: string; password: string }) => void;
  error: string;
  onShowToast: (message: string, type: 'success' | 'error') => void;
  isLoading?: boolean;
}

const CustomCheckbox: React.FC<{ checked: boolean; onChange: (checked: boolean) => void; label: string; }> = ({ checked, onChange, label }) => {
  return (
    <label className="flex items-center cursor-pointer text-sm text-white/90 hover:text-white transition-colors">
      <div className="relative">
        <input type="checkbox" className="sr-only" checked={checked} onChange={(e) => onChange(e.target.checked)} />
        <div className={`w-5 h-5 border-2 rounded ${checked ? 'bg-white border-white' : 'bg-transparent border-white/60'}`}>
          {checked && (
            <svg className="w-full h-full text-[#0081fb] p-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
            </svg>
          )}
        </div>
      </div>
      <span className="ml-2 font-medium">{label}</span>
    </label>
  );
};


const LoginPage: React.FC<LoginPageProps> = ({ onNavigateToSignUp, onLogin, error, onShowToast, isLoading = false }) => {
  const [remember, setRemember] = useState(false);
  const [mobile, setMobile] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onLogin({ mobile, password });
  };

  return (
    <main className="relative flex flex-col items-center justify-center min-h-screen p-4 bg-[#0081fb]">
      <div className="w-full max-w-sm flex flex-col items-center animate-fade-in-up">
        <MetaLogo className="w-28 h-auto mb-8 text-white drop-shadow-md" />
        <h1 className="text-4xl font-bold text-white text-center mb-10 tracking-tight">Welcome Back</h1>
        
        <form className="space-y-5 w-full" onSubmit={handleSubmit}>
          <div className="relative flex items-center bg-white rounded-xl shadow-lg p-3.5 transition-transform focus-within:scale-[1.02]">
            <UserIcon className="w-5 h-5 text-gray-400" />
            <span className="text-gray-600 pl-3 pr-2 border-r border-gray-300 font-medium">+233</span>
            <input 
              type="text" 
              placeholder="Please enter your mobile" 
              className="w-full pl-3 bg-transparent focus:outline-none text-gray-800 placeholder-gray-400 font-medium"
              value={mobile}
              onChange={(e) => setMobile(e.target.value)}
              required
            />
          </div>

          <div className="relative flex items-center bg-white rounded-xl shadow-lg p-3.5 transition-transform focus-within:scale-[1.02]">
            <LockIcon className="w-5 h-5 text-gray-400" />
            <input 
              type="password" 
              placeholder="Please enter your password" 
              className="w-full pl-3 bg-transparent focus:outline-none text-gray-800 placeholder-gray-400 font-medium"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          
          <div className="flex justify-between items-center px-1">
            <CustomCheckbox checked={remember} onChange={setRemember} label="Remember me" />
            <button type="button" className="text-sm text-white/90 hover:text-white font-medium hover:underline">Forgot Password?</button>
          </div>

          {error && <div className="text-center text-red-600 bg-red-100 border border-red-200 p-3 rounded-lg font-semibold text-sm animate-pulse">{error}</div>}

          <button 
            type="submit" 
            disabled={isLoading}
            className={`w-full text-[#0081fb] font-bold py-4 px-4 rounded-xl bg-white shadow-xl hover:bg-gray-50 hover:shadow-2xl transition-all duration-300 ease-in-out transform hover:-translate-y-1 ${isLoading ? 'opacity-70 cursor-wait' : ''}`}
          >
            {isLoading ? 'Logging in...' : 'Log In'}
          </button>
        </form>

        <p className="text-center text-white/90 mt-8 font-medium">
          Don't have an account? <button type="button" onClick={onNavigateToSignUp} className="text-white font-bold hover:underline ml-1">Sign Up</button>
        </p>
      </div>
    </main>
  );
};

export default LoginPage;
