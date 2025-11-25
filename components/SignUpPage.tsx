
import React, { useState, useEffect } from 'react';
import { UserIcon, LockIcon, ArrowLeftIcon, ShieldCheckIcon, TicketIcon, MetaLogo } from './Icons';

interface SignUpPageProps {
  onNavigateToLogin: () => void;
  onSignUp: (newUser: { mobile: string; password: string; invitationCode: string }) => Promise<boolean>;
  initialInvitationCode?: string;
}

const SignUpPage: React.FC<SignUpPageProps> = ({ onNavigateToLogin, onSignUp, initialInvitationCode }) => {
  const [numberCaptcha, setNumberCaptcha] = useState('');

  const [mobile, setMobile] = useState('');
  const [password, setPassword] = useState('');
  const [repeatPassword, setRepeatPassword] = useState('');
  const [invitationCode, setInvitationCode] = useState(initialInvitationCode || '');
  const [numberCaptchaInput, setNumberCaptchaInput] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const generateCaptchas = () => {
    const randomNumber = Math.floor(1000 + Math.random() * 9000).toString();
    setNumberCaptcha(randomNumber);
  };

  useEffect(() => {
    generateCaptchas();
    const intervalId = setInterval(generateCaptchas, 45000); // Refresh every 45 seconds
    return () => clearInterval(intervalId); // Cleanup on unmount
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Mobile number validation
    const mobileRegex = /^\d{9,10}$/;
    if (!mobileRegex.test(mobile)) {
        setError('Please enter a valid 9 or 10 digit mobile number.');
        return;
    }
    if (mobile.length === 10 && !mobile.startsWith('0')) {
        setError('A 10-digit number must start with 0.');
        return;
    }

    // Password validation
    if (password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    if (password !== repeatPassword) {
      setError('Passwords do not match.');
      return;
    }
    
    if (numberCaptchaInput !== numberCaptcha) {
      setError('Incorrect number captcha.');
      generateCaptchas(); // regenerate on failure
      return;
    }

    setIsSubmitting(true);
    try {
      const success = await onSignUp({ mobile, password, invitationCode });

      if (!success) {
        setError('A user with this mobile number already exists.');
      }
    } catch (err) {
      setError('An error occurred during registration.');
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="flex flex-col items-center justify-center min-h-screen p-4 bg-[#0081fb]">
      <div className="w-full max-w-sm animate-fade-in-up">
        <button onClick={onNavigateToLogin} className="absolute top-6 left-6 text-white hover:text-white/80 transition-colors p-2 rounded-full hover:bg-white/10">
          <ArrowLeftIcon className="w-6 h-6" />
        </button>

        <MetaLogo className="w-28 h-auto mx-auto mb-6 text-white drop-shadow-md" />

        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white tracking-tight">Create Account</h1>
          <p className="text-white/80 text-sm mt-2">Join us and start investing today</p>
        </div>
        
        <form className="space-y-4" onSubmit={handleSubmit}>
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
              placeholder="Password" 
              className="w-full pl-3 bg-transparent focus:outline-none text-gray-800 placeholder-gray-400 font-medium"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <div className="relative flex items-center bg-white rounded-xl shadow-lg p-3.5 transition-transform focus-within:scale-[1.02]">
            <LockIcon className="w-5 h-5 text-gray-400" />
            <input 
              type="password" 
              placeholder="Repeat password" 
              className="w-full pl-3 bg-transparent focus:outline-none text-gray-800 placeholder-gray-400 font-medium"
              value={repeatPassword}
              onChange={(e) => setRepeatPassword(e.target.value)}
              required
            />
          </div>

          <div className="relative flex items-center bg-white rounded-xl shadow-lg p-3.5 transition-transform focus-within:scale-[1.02]">
            <TicketIcon className="w-5 h-5 text-gray-400" />
            <input 
              type="text" 
              placeholder="Invitation code (Optional)" 
              className="w-full pl-3 bg-transparent focus:outline-none text-gray-800 placeholder-gray-400 font-medium"
              value={invitationCode}
              onChange={(e) => setInvitationCode(e.target.value)}
            />
          </div>

          <div className="flex items-center space-x-3">
            <div className="relative flex items-center bg-white rounded-xl shadow-lg p-3.5 flex-grow transition-transform focus-within:scale-[1.02]">
              <ShieldCheckIcon className="w-5 h-5 text-gray-400" />
              <input 
                type="text" 
                placeholder="Captcha" 
                className="w-full pl-3 bg-transparent focus:outline-none text-gray-800 placeholder-gray-400 font-medium"
                value={numberCaptchaInput}
                onChange={(e) => setNumberCaptchaInput(e.target.value)}
                required
              />
            </div>
            <div className="bg-white/20 backdrop-blur-sm text-white font-bold tracking-widest text-xl rounded-xl p-3.5 select-none border border-white/30 min-w-[100px] text-center" style={{ fontFamily: 'monospace' }}>
              {numberCaptcha}
            </div>
          </div>
          
          {error && <div className="text-center text-red-600 bg-red-100 border border-red-200 p-3 rounded-lg font-semibold text-sm animate-pulse">{error}</div>}

          <button 
            type="submit" 
            disabled={isSubmitting}
            className={`w-full text-[#0081fb] font-bold py-4 px-4 rounded-xl bg-white shadow-xl hover:bg-gray-50 hover:shadow-2xl transition-all duration-300 ease-in-out transform hover:-translate-y-1 mt-4 ${isSubmitting ? 'opacity-70 cursor-wait' : ''}`}
          >
            {isSubmitting ? 'Registering...' : 'Register Now'}
          </button>
        </form>

        <p className="text-center text-white/90 mt-8 font-medium">
          Already have an account? <button type="button" onClick={onNavigateToLogin} className="text-white font-bold hover:underline ml-1">Log In</button>
        </p>
      </div>
    </main>
  );
};

export default SignUpPage;
