
import { db, auth } from '../firebase';
import { 
  doc, 
  setDoc, 
  getDoc, 
  getDocs, 
  collection, 
  query, 
  where, 
  updateDoc, 
  deleteDoc,
  runTransaction,
  serverTimestamp,
  increment,
  limit,
  onSnapshot
} from 'firebase/firestore';
import type { Product } from './ProductDetailsPage';

// Firebase-integrated storage service

export type Wallet = {
  id?: number;
  type: 'MTN' | 'TELECEL' | 'AIRTELTIGO';
  name: string;
  accountNumber: string;
};

export type Investment = {
  id?: number;
  productId: number; // VIP level
  purchaseTimestamp: number;
  creditsReceived: number;
  product: Product;
};

export type Withdrawal = {
  id?: number;
  amount: number;
  date: number; // timestamp
  status: 'pending' | 'successful' | 'failed';
  wallet: Wallet;
};

export type RechargeRecord = {
  id: string;
  userMobile: string;
  amount: number;
  txnId: string;
  status: 'pending' | 'successful' | 'failed';
  timestamp: number;
};

export type BonusCode = {
  code: string;
  uses: number;
  maxUses: number;
};

export type User = {
  mobile: string;
  password: string;
  balance: number;
  investments: Investment[];
  wallets: Wallet[];
  withdrawals: Withdrawal[];
  referralCode: string;
  bonusRedeemed: boolean;
  referredBy?: string;
  referrals: string[];
  referralIncome: number;
  lastTxnId?: string;
};

// Helper: Normalize mobile
const normalizeMobile = (mobile: string): string => {
  const cleaned = mobile.replace(/\s+/g, '');
  if (cleaned.length === 10 && cleaned.startsWith('0')) {
    return cleaned.substring(1);
  }
  return cleaned;
};

const generateUniqueReferralCode = async (): Promise<string> => {
  let isUnique = false;
  let code = '';
  let attempts = 0;
  while (!isUnique && attempts < 10) {
    attempts++;
    code = Math.floor(10000 + Math.random() * 90000).toString();
    const q = query(collection(db, 'users'), where('referralCode', '==', code), limit(1));
    const querySnapshot = await getDocs(q);
    
    if (querySnapshot.empty) {
      isUnique = true;
    }
  }
  if (!isUnique) throw new Error('Could not generate a unique referral code. Please try again.');
  return code;
};

export const initializeStorage = async (): Promise<void> => {
  console.log("Verifying Firestore connection...");
  try {
    // Simple check to see if we can reach the server
    await getDoc(doc(db, 'system', 'health'));
  } catch (error) {
    console.warn("Firestore connection check failed, but continuing:", error);
  }
};

export const getUsers = async (): Promise<User[]> => {
  try {
    const querySnapshot = await getDocs(collection(db, 'users'));
    return querySnapshot.docs.map(doc => doc.data() as User);
  } catch (error) {
    console.error('Error fetching users:', error);
    return [];
  }
};

export const addUser = async (newUser: { mobile: string; password: string; invitationCode?: string }): Promise<{ success: boolean; error?: string }> => {
  const normalizedMobile = normalizeMobile(newUser.mobile);
  
  try {
    const userRef = doc(db, 'users', normalizedMobile);
    const userDoc = await getDoc(userRef);
    
    if (userDoc.exists()) {
      console.log('User already exists:', normalizedMobile);
      return { success: false, error: 'User already exists' };
    }

    const referralCode = await generateUniqueReferralCode();

    const userData: User = {
      mobile: normalizedMobile,
      password: newUser.password,
      balance: 20, // Registration bonus
      referralCode: referralCode,
      bonusRedeemed: false,
      referredBy: newUser.invitationCode || null,
      referralIncome: 0,
      investments: [],
      wallets: [],
      withdrawals: [],
      referrals: []
    };

    await setDoc(userRef, userData);
    
    return { success: true };
  } catch (err) {
    console.error('Unexpected error in addUser:', err);
    return { success: false, error: 'An unexpected error occurred' };
  }
};

export const subscribeToUser = (mobile: string, callback: (user: User) => void) => {
  const userRef = doc(db, 'users', mobile);
  return onSnapshot(userRef, (snapshot) => {
    if (snapshot.exists()) {
      callback(snapshot.data() as User);
    }
  });
};

export const subscribeToRechargeRecords = (callback: (records: RechargeRecord[]) => void) => {
  const q = query(collection(db, 'recharge_records'));
  return onSnapshot(q, (snapshot) => {
    const records = snapshot.docs.map(doc => doc.data() as RechargeRecord);
    callback(records.sort((a, b) => b.timestamp - a.timestamp));
  });
};

export const subscribeToUserRechargeRecords = (mobile: string, callback: (records: RechargeRecord[]) => void) => {
  const q = query(collection(db, 'recharge_records'), where('userMobile', '==', mobile));
  return onSnapshot(q, (snapshot) => {
    const records = snapshot.docs.map(doc => doc.data() as RechargeRecord);
    callback(records.sort((a, b) => b.timestamp - a.timestamp));
  });
};

export const findUser = async (credentials: { mobile: string; password: string }): Promise<User | null> => {
  const normalizedMobile = normalizeMobile(credentials.mobile);

  try {
    const userRef = doc(db, 'users', normalizedMobile);
    const userDoc = await getDoc(userRef);

    if (!userDoc.exists()) return null;

    const user = userDoc.data() as User;
    if (user.password !== credentials.password) return null;

    return user;
  } catch (error) {
    console.error('Error finding user:', error);
    return null;
  }
};

// Generic update for simple fields on the User table
export const updateUser = async (updatedUser: User): Promise<void> => {
  const userRef = doc(db, 'users', updatedUser.mobile);
  await updateDoc(userRef, {
    balance: updatedUser.balance,
    bonusRedeemed: updatedUser.bonusRedeemed,
    referralIncome: updatedUser.referralIncome,
    investments: updatedUser.investments,
    wallets: updatedUser.wallets,
    withdrawals: updatedUser.withdrawals,
    referrals: updatedUser.referrals,
    lastTxnId: updatedUser.lastTxnId || null
  });
};

// Secure Atomic Purchase Transaction
export const purchaseProduct = async (mobile: string, product: Product): Promise<{ success: boolean; message: string }> => {
  try {
    const userRef = doc(db, 'users', mobile);
    
    const result = await runTransaction(db, async (transaction) => {
      const userDoc = await transaction.get(userRef);
      if (!userDoc.exists()) {
        throw new Error("User does not exist");
      }
      
      const userData = userDoc.data() as User;
      if (userData.balance < product.price) {
        return { success: false, message: 'Insufficient balance.' };
      }
      
      const newInvestment: Investment = {
        productId: product.vip,
        purchaseTimestamp: Date.now(),
        creditsReceived: 0,
        product: product
      };
      
      const updatedInvestments = [...(userData.investments || []), newInvestment];
      const newBalance = userData.balance - product.price;
      
      transaction.update(userRef, {
        balance: newBalance,
        investments: updatedInvestments
      });
      
      return { success: true, message: 'Purchase successful!' };
    });
    
    return result;
  } catch (error) {
    console.error('Purchase error:', error);
    return { success: false, message: 'Transaction failed. Please try again.' };
  }
};

// Specific Methods for Relations to avoid complex object diffing
export const addInvestment = async (mobile: string, investment: Investment): Promise<void> => {
  const userRef = doc(db, 'users', mobile);
  const userDoc = await getDoc(userRef);
  if (userDoc.exists()) {
    const userData = userDoc.data() as User;
    await updateDoc(userRef, {
      investments: [...(userData.investments || []), investment]
    });
  }
};

export const updateInvestment = async (mobile: string, investment: Investment): Promise<void> => {
  const userRef = doc(db, 'users', mobile);
  const userDoc = await getDoc(userRef);
  if (userDoc.exists()) {
    const userData = userDoc.data() as User;
    const updatedInvestments = userData.investments.map(inv => 
      (inv.productId === investment.productId && inv.purchaseTimestamp === investment.purchaseTimestamp) 
      ? investment : inv
    );
    await updateDoc(userRef, {
      investments: updatedInvestments
    });
  }
};

export const addWallet = async (mobile: string, wallet: Wallet): Promise<void> => {
  const userRef = doc(db, 'users', mobile);
  const userDoc = await getDoc(userRef);
  if (userDoc.exists()) {
    const userData = userDoc.data() as User;
    await updateDoc(userRef, {
      wallets: [...(userData.wallets || []), wallet]
    });
  }
};

export const addWithdrawal = async (mobile: string, withdrawal: Withdrawal): Promise<void> => {
  const userRef = doc(db, 'users', mobile);
  const userDoc = await getDoc(userRef);
  if (userDoc.exists()) {
    const userData = userDoc.data() as User;
    await updateDoc(userRef, {
      withdrawals: [...(userData.withdrawals || []), withdrawal]
    });
  }
};

// --- Recharge Records ---

export const getRechargeRecords = async (): Promise<RechargeRecord[]> => {
  try {
    const querySnapshot = await getDocs(collection(db, 'recharge_records'));
    return querySnapshot.docs.map(doc => doc.data() as RechargeRecord);
  } catch (error) {
    console.error('Error fetching recharge records:', error);
    return [];
  }
};

export const addRechargeRecord = async (record: Omit<RechargeRecord, 'id' | 'status' | 'timestamp'>): Promise<boolean> => {
  try {
    // Check if TxnID exists
    const q = query(collection(db, 'recharge_records'), where('txnId', '==', record.txnId), limit(1));
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      return false; // Duplicate transaction ID
    }

    const id = `rec_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const newRecord: RechargeRecord = {
      ...record,
      id,
      status: 'pending',
      timestamp: Date.now()
    };

    await setDoc(doc(db, 'recharge_records', id), newRecord);
    return true;
  } catch (err) {
    console.error("Unexpected error in addRechargeRecord:", err);
    return false;
  }
};

export const updateRechargeRecord = async (updatedRecord: RechargeRecord): Promise<void> => {
  await updateDoc(doc(db, 'recharge_records', updatedRecord.id), {
    status: updatedRecord.status
  });
};

// --- Bonus Codes ---

export const getBonusCodes = async (): Promise<BonusCode[]> => {
  try {
    const querySnapshot = await getDocs(collection(db, 'bonus_codes'));
    return querySnapshot.docs.map(doc => doc.data() as BonusCode);
  } catch (error) {
    console.error('Error fetching bonus codes:', error);
    return [];
  }
};

export const incrementBonusCodeUses = async (code: string): Promise<void> => {
  const q = query(collection(db, 'bonus_codes'), where('code', '==', code), limit(1));
  const querySnapshot = await getDocs(q);
  if (!querySnapshot.empty) {
    const codeDoc = querySnapshot.docs[0];
    await updateDoc(codeDoc.ref, {
      uses: increment(1)
    });
  }
};

// Delete user functionality
export const deleteUser = async (mobile: string): Promise<boolean> => {
  const normalizedMobile = normalizeMobile(mobile);
  try {
    await deleteDoc(doc(db, 'users', normalizedMobile));
    return true;
  } catch (error) {
    console.error('Error deleting user:', error);
    return false;
  }
};
