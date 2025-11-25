
import React, { useState, useEffect } from 'react';
import LoginPage from './components/LoginPage';
import SignUpPage from './components/SignUpPage';
import HomePage from './components/HomePage';
import ProjectPage from './components/ProjectPage';
import MinePage from './components/MinePage';
import TeamPage from './components/TeamPage';
import { HomeIcon, ProjectIcon, TeamIcon, MineIcon } from './components/Icons';
import NotificationModal from './components/NotificationModal';
import RechargeModal from './components/RechargeModal';
import RepaymentPage from './components/RepaymentPage';
import RechargePage from './components/RechargePage';
import RechargeRecordsPage from './components/RechargeRecordsPage';
import WithdrawalRecordsPage from './components/WithdrawalRecordsPage';
import ProductDetailsPage from './components/ProductDetailsPage';
import type { Product } from './components/ProductDetailsPage';
import { 
  addUser, 
  findUser, 
  updateUser, 
  initializeStorage, 
  addRechargeRecord, 
  getBonusCodes, 
  incrementBonusCodeUses, 
  addInvestment,
  addWallet,
  addWithdrawal
} from './components/storageService';
import type { User, Wallet } from './components/storageService';
import Toast from './components/Toast';
import WithdrawalPage from './components/WithdrawalPage';
import ManageWalletsPage from './components/ManageWalletsPage';
import AddWalletPage from './components/AddWalletPage';
import AdminLoginPage from './components/AdminLoginPage';
import AdminDashboardPage from './components/AdminDashboardPage';
import CustomerServicePage from './components/CustomerServicePage';
import BonusCodePage from './components/BonusCodePage';

type ActiveTab = 'home' | 'project' | 'team' | 'mine';
type Page = 'login' | 'signup' | 'adminLogin';

const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<Page>('login');
  const [loginError, setLoginError] = useState<string>('');
  const [adminLoginError, setAdminLoginError] = useState('');
  const [isNotificationVisible, setIsNotificationVisible] = useState(false);
  const [isRechargeModalVisible, setIsRechargeModalVisible] = useState(false);
  const [showRepaymentPage, setShowRepaymentPage] = useState(false);
  const [showRechargePage, setShowRechargePage] = useState(false);
  const [showRechargeRecords, setShowRechargeRecords] = useState(false);
  const [showWithdrawalRecords, setShowWithdrawalRecords] = useState(false);
  const [showWithdrawalPage, setShowWithdrawalPage] = useState(false);
  const [showCustomerService, setShowCustomerService] = useState(false);
  const [showBonusCodePage, setShowBonusCodePage] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  const [activeTab, setActiveTab] = useState<ActiveTab>('home');
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState<'success' | 'error'>('success');

  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [currentRechargeAmount, setCurrentRechargeAmount] = useState(0);

  const [showManageWallets, setShowManageWallets] = useState(false);
  const [showAddWallet, setShowAddWallet] = useState(false);
  const [selectedWithdrawalWallet, setSelectedWithdrawalWallet] = useState<Wallet | null>(null);
  const [initialInvitationCode, setInitialInvitationCode] = useState('');
  const [isLoginLoading, setIsLoginLoading] = useState(false);

  useEffect(() => {
    initializeStorage();
    
    // Check for admin path
    const params = new URLSearchParams(window.location.search);
    const path = params.get('path');
    if (path === 'admin') {
      setCurrentPage('adminLogin');
    }

    // Check for referral code
    const ref = params.get('ref');
    if (ref) {
      setInitialInvitationCode(ref);
      setCurrentPage('signup');
    }
  }, []);

  const handleShowToast = (message: string, type: 'success' | 'error') => {
    setToastMessage(message);
    setToastType(type);
    setShowToast(true);
  };

  const refreshUserData = async () => {
    if (currentUser) {
      // Re-fetch user data to get latest updates (balance etc)
      const freshUser = await findUser({ mobile: currentUser.mobile, password: currentUser.password });
      if (freshUser) {
        setCurrentUser(freshUser);
      }
    }
  }

  const handleLogin = async (credentials: { mobile: string; password: string }) => {
    setIsLoginLoading(true);
    try {
      const user = await findUser(credentials);
      if (user) {
        setCurrentUser(user);
        setIsLoggedIn(true);
        setLoginError('');
        setIsNotificationVisible(true);
      } else {
        setLoginError('Invalid mobile number or password.');
      }
    } catch (error) {
       console.error(error);
       setLoginError('An error occurred. Please try again.');
    } finally {
      setIsLoginLoading(false);
    }
  };

  const handleSignUp = async (newUser: { mobile: string; password: string; invitationCode: string }) => {
    try {
        const success = await addUser(newUser);
        if (success) {
            handleShowToast('Registration successful! Please log in.', 'success');
            setCurrentPage('login');
            return true;
        }
        return false;
    } catch (error) {
        console.error(error);
        return false;
    }
  };
  
  const handleAdminLogin = (credentials: { mobile: string; pass: string }) => {
      // Hardcoded admin credentials for simplicity as per request context
      if (credentials.mobile === '0256414239' && credentials.pass === '1mymomisBerniceAbenaBentum') {
          setIsAdminLoggedIn(true);
          setAdminLoginError('');
      } else {
          setAdminLoginError('Invalid admin credentials.');
      }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setCurrentUser(null);
    setActiveTab('home');
    setLoginError('');
    setIsNotificationVisible(false);
    setShowRepaymentPage(false);
    setShowRechargePage(false);
    setShowRechargeRecords(false);
    setShowWithdrawalRecords(false);
    setShowWithdrawalPage(false);
    setShowCustomerService(false);
    setShowBonusCodePage(false);
  };

  const handleAdminLogout = () => {
      setIsAdminLoggedIn(false);
      // Optional: redirect to home or login
      window.location.href = '/';
  }

  const handleRechargeClick = () => {
      setShowRechargePage(true);
  };

  const handleDeposit = (amount: string) => {
      setCurrentRechargeAmount(parseFloat(amount));
      setShowRechargePage(false);
      setIsRechargeModalVisible(true);
  };

  const handleRechargeConfirm = () => {
      setIsRechargeModalVisible(false);
      setShowRepaymentPage(true);
  };

  const handleRepaymentSubmit = async (txnId: string) => {
      if (currentUser) {
          await addRechargeRecord({
              userMobile: currentUser.mobile,
              amount: currentRechargeAmount,
              txnId: txnId
          });
          setShowRepaymentPage(false);
          setShowRechargeRecords(true); // Redirect to recharge records
          handleShowToast('Recharge submitted for review!', 'success');
      }
  };

  const handleWithdrawalClick = () => {
      setShowWithdrawalPage(true);
  }

  const handleBuyClick = (product: Product) => {
    setSelectedProduct(product);
  };
  
  const handleProductConfirm = async (product: Product) => {
    if (!currentUser) return;
    
    if (currentUser.balance >= product.price) {
        const updatedUser = { ...currentUser, balance: currentUser.balance - product.price };
        await updateUser(updatedUser);
        
        await addInvestment(currentUser.mobile, {
            productId: product.vip,
            purchaseTimestamp: Date.now(),
            creditsReceived: 0,
            product: product
        });
        
        await refreshUserData();
        
        setSelectedProduct(null);
        handleShowToast(`Successfully purchased VIP${product.vip}!`, 'success');
    } else {
        handleShowToast('Insufficient balance!', 'error');
    }
  };

  const handleProcessWithdrawal = async (amount: number) => {
      if (currentUser && selectedWithdrawalWallet) {
          const updatedUser = { ...currentUser, balance: currentUser.balance - amount };
          await updateUser(updatedUser);
          
          await addWithdrawal(currentUser.mobile, {
              amount: amount,
              date: Date.now(),
              status: 'pending',
              wallet: selectedWithdrawalWallet
          });

          await refreshUserData();

          setShowWithdrawalPage(false);
          handleShowToast('Withdrawal request submitted!', 'success');
      }
  }
  
  const handleAddWallet = async (wallet: Wallet) => {
      if (currentUser) {
          await addWallet(currentUser.mobile, wallet);
          await refreshUserData();
          setShowAddWallet(false);
          handleShowToast('Wallet added successfully!', 'success');
      }
  }

  const handleRedeemBonus = async (code: string) => {
      if (!currentUser) return;

      if (currentUser.bonusRedeemed) {
           handleShowToast('You have already redeemed a bonus code.', 'error');
           return;
      }
      
      const codes = await getBonusCodes();
      const bonusCode = codes.find(c => c.code === code);
      
      if (bonusCode && bonusCode.uses < bonusCode.maxUses) {
           await incrementBonusCodeUses(code);
           const updatedUser = { ...currentUser, balance: currentUser.balance + 1, bonusRedeemed: true };
           await updateUser(updatedUser);
           await refreshUserData();
           
           handleShowToast('Bonus redeemed successfully! GHS 1.00 added.', 'success');
           setShowBonusCodePage(false);
      } else {
          handleShowToast('Invalid or expired bonus code.', 'error');
      }
  }

  if (isAdminLoggedIn) {
      return <AdminDashboardPage onLogout={handleAdminLogout} />;
  }

  if (currentPage === 'adminLogin') {
      return (
          <AdminLoginPage 
            onLogin={handleAdminLogin} 
            error={adminLoginError}
            onNavigateToUserLogin={() => setCurrentPage('login')}
           />
      );
  }

  if (!isLoggedIn) {
    if (currentPage === 'signup') {
      return <SignUpPage onNavigateToLogin={() => setCurrentPage('login')} onSignUp={handleSignUp} initialInvitationCode={initialInvitationCode} />;
    }
    return (
        <>
            <LoginPage 
                onNavigateToSignUp={() => setCurrentPage('signup')} 
                onLogin={handleLogin} 
                error={loginError}
                onShowToast={handleShowToast}
                isLoading={isLoginLoading}
            />
             {showToast && <Toast message={toastMessage} type={toastType} onClose={() => setShowToast(false)} />}
        </>
    );
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'home':
        return <HomePage onRechargeClick={handleRechargeClick} onWithdrawalClick={handleWithdrawalClick} onBuyClick={handleBuyClick} onOpenCustomerService={() => setShowCustomerService(true)} />;
      case 'project':
        return <ProjectPage user={currentUser} />;
      case 'team':
        return <TeamPage user={currentUser} onShowToast={handleShowToast} />;
      case 'mine':
        return <MinePage 
            user={currentUser!} 
            onLogout={handleLogout} 
            onRechargeClick={handleRechargeClick} 
            onWithdrawalClick={handleWithdrawalClick}
            onNavigateToProject={() => setActiveTab('project')}
            onOpenRechargeRecords={() => setShowRechargeRecords(true)}
            onOpenWithdrawalRecords={() => setShowWithdrawalRecords(true)}
            onShowToast={handleShowToast}
            onManageWallets={() => setShowManageWallets(true)}
            onOpenCustomerService={() => setShowCustomerService(true)}
            onOpenBonusCodePage={() => setShowBonusCodePage(true)}
        />;
      default:
        return <HomePage onRechargeClick={handleRechargeClick} onWithdrawalClick={handleWithdrawalClick} onBuyClick={handleBuyClick} onOpenCustomerService={() => setShowCustomerService(true)} />;
    }
  };

  return (
    <div className="bg-gray-100 min-h-screen font-sans text-gray-900 relative">
      {/* Modals and Full Screen Pages */}
      {showManageWallets && (
        <div className="fixed inset-0 z-30 bg-white overflow-y-auto">
           <ManageWalletsPage 
              user={currentUser} 
              onClose={() => setShowManageWallets(false)} 
              onAdd={() => setShowAddWallet(true)}
              onSelectWallet={(wallet) => {
                  setSelectedWithdrawalWallet(wallet);
                  setShowManageWallets(false);
              }}
           />
           {showAddWallet && (
               <div className="fixed inset-0 z-40 bg-white overflow-y-auto">
                   <AddWalletPage onClose={() => setShowAddWallet(false)} onAddWallet={handleAddWallet} />
               </div>
           )}
        </div>
      )}

      {showWithdrawalPage && (
          <div className="fixed inset-0 z-20 bg-white overflow-y-auto">
              <WithdrawalPage 
                user={currentUser} 
                onClose={() => setShowWithdrawalPage(false)} 
                onShowToast={handleShowToast}
                selectedWallet={selectedWithdrawalWallet}
                onManageWallets={() => setShowManageWallets(true)}
                onProcessWithdrawal={handleProcessWithdrawal}
              />
          </div>
      )}

      {selectedProduct && (
        <div className="fixed inset-0 z-50 bg-white overflow-y-auto">
          <ProductDetailsPage 
            product={selectedProduct} 
            onClose={() => setSelectedProduct(null)} 
            onConfirm={handleProductConfirm} 
          />
        </div>
      )}

      {showRepaymentPage && (
        <div className="fixed inset-0 z-50 bg-white overflow-y-auto">
            <RepaymentPage onClose={() => setShowRepaymentPage(false)} amount={currentRechargeAmount} onShowToast={handleShowToast} onSubmit={handleRepaymentSubmit} />
        </div>
      )}
      
      {showRechargePage && (
          <div className="fixed inset-0 z-20 bg-white overflow-y-auto">
              <RechargePage onClose={() => setShowRechargePage(false)} onDeposit={handleDeposit} onShowToast={handleShowToast} />
          </div>
      )}

      {showRechargeRecords && (
          <div className="fixed inset-0 z-20 bg-white overflow-y-auto">
              <RechargeRecordsPage onClose={() => setShowRechargeRecords(false)} user={currentUser} />
          </div>
      )}

      {showWithdrawalRecords && (
          <div className="fixed inset-0 z-20 bg-white overflow-y-auto">
              <WithdrawalRecordsPage onClose={() => setShowWithdrawalRecords(false)} user={currentUser} />
          </div>
      )}

      {showCustomerService && (
          <div className="fixed inset-0 z-50 bg-white overflow-y-auto">
              <CustomerServicePage onClose={() => setShowCustomerService(false)} />
          </div>
      )}

      {showBonusCodePage && (
          <div className="fixed inset-0 z-50 bg-white overflow-y-auto">
              <BonusCodePage onClose={() => setShowBonusCodePage(false)} onRedeem={handleRedeemBonus} />
          </div>
      )}

      <NotificationModal 
        isOpen={isNotificationVisible} 
        onClose={() => setIsNotificationVisible(false)} 
        onOpenCustomerService={() => setShowCustomerService(true)}
      />
      
      <RechargeModal 
        isOpen={isRechargeModalVisible} 
        onClose={() => setIsRechargeModalVisible(false)} 
        onConfirm={handleRechargeConfirm} 
      />

      {showToast && <Toast message={toastMessage} type={toastType} onClose={() => setShowToast(false)} />}

      {/* Main Content */}
      <div className="pb-16">
        {renderContent()}
      </div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 flex justify-around py-2 z-10">
        <button onClick={() => setActiveTab('home')} className={`flex flex-col items-center space-y-1 ${activeTab === 'home' ? 'text-[#0066FF]' : 'text-gray-400'}`}>
          <HomeIcon className="w-6 h-6" />
          <span className="text-xs">Home</span>
        </button>
        <button onClick={() => setActiveTab('project')} className={`flex flex-col items-center space-y-1 ${activeTab === 'project' ? 'text-[#0066FF]' : 'text-gray-400'}`}>
          <ProjectIcon className="w-6 h-6" />
          <span className="text-xs">Project</span>
        </button>
        <button onClick={() => setActiveTab('team')} className={`flex flex-col items-center space-y-1 ${activeTab === 'team' ? 'text-[#0066FF]' : 'text-gray-400'}`}>
          <TeamIcon className="w-6 h-6" />
          <span className="text-xs">Team</span>
        </button>
        <button onClick={() => setActiveTab('mine')} className={`flex flex-col items-center space-y-1 ${activeTab === 'mine' ? 'text-[#0066FF]' : 'text-gray-400'}`}>
          <MineIcon className="w-6 h-6" />
          <span className="text-xs">Mine</span>
        </button>
      </div>
    </div>
  );
};

export default App;
