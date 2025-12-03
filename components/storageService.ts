
import { supabase } from './supabaseClient';
import type { Product } from './ProductDetailsPage';

// Supabase-integrated storage service

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
  while (!isUnique) {
    code = Math.floor(10000 + Math.random() * 90000).toString();
    const { data } = await supabase.from('users').select('mobile').eq('referral_code', code);
    if (!data || data.length === 0) {
      isUnique = true;
    }
  }
  return code;
};

export const initializeStorage = async (): Promise<void> => {
  // Logic to seed initial data handled via SQL script, 
  // but we can verify connection here.
  console.log("Initializing Supabase connection...");
};

export const getUsers = async (): Promise<User[]> => {
  // Fetch users with their related data for the Admin Dashboard
  const { data: users, error } = await supabase
    .from('users')
    .select('*, investments(*), wallets(*), withdrawals(*)');
    
  if (error) {
    console.error('Error fetching users:', error);
    return [];
  }

  return users.map((u: any) => ({
    mobile: u.mobile,
    password: u.password,
    balance: u.balance,
    referralCode: u.referral_code,
    bonusRedeemed: u.bonus_redeemed,
    referredBy: u.referred_by,
    referralIncome: u.referral_income,
    // Map relations and handle potential nulls if the relation return structure varies
    investments: (u.investments || []).map((i: any) => ({
      id: i.id,
      productId: i.product_id,
      purchaseTimestamp: i.purchase_timestamp,
      creditsReceived: i.credits_received,
      product: i.product_json
    })),
    wallets: (u.wallets || []).map((w: any) => ({
      id: w.id,
      type: w.type,
      name: w.name,
      accountNumber: w.account_number
    })),
    withdrawals: (u.withdrawals || []).map((w: any) => ({
      id: w.id,
      amount: w.amount,
      date: w.date,
      status: w.status,
      wallet: w.wallet_json
    })),
    referrals: [] // Still expensive to calc recursive referrals here, leaving empty for list view
  }));
};

export const addUser = async (newUser: { mobile: string; password: string; invitationCode?: string }): Promise<boolean> => {
  const normalizedMobile = normalizeMobile(newUser.mobile);
  
  // Check existence
  const { data: existing } = await supabase.from('users').select('mobile').eq('mobile', normalizedMobile).maybeSingle();
  if (existing) return false;

  const referralCode = await generateUniqueReferralCode();

  const { error } = await supabase.from('users').insert({
    mobile: normalizedMobile,
    password: newUser.password,
    balance: 20, // Registration bonus
    referral_code: referralCode,
    referred_by: newUser.invitationCode || null,
    bonus_redeemed: false,
    referral_income: 0
  });

  if (error) {
    console.error('Error creating user:', error);
    return false;
  }
  return true;
};

export const findUser = async (credentials: { mobile: string; password: string }): Promise<User | null> => {
  const normalizedMobile = normalizeMobile(credentials.mobile);

  // Fetch User
  const { data: user, error } = await supabase
    .from('users')
    .select('*')
    .eq('mobile', normalizedMobile)
    .eq('password', credentials.password)
    .maybeSingle();

  if (error || !user) return null;

  // Fetch Relations in parallel
  const [invRes, walRes, withRes, refRes] = await Promise.all([
    supabase.from('investments').select('*').eq('user_mobile', normalizedMobile),
    supabase.from('wallets').select('*').eq('user_mobile', normalizedMobile),
    supabase.from('withdrawals').select('*').eq('user_mobile', normalizedMobile),
    supabase.from('users').select('mobile').eq('referred_by', user.referral_code)
  ]);

  const investments: Investment[] = (invRes.data || []).map((i: any) => ({
    id: i.id,
    productId: i.product_id,
    purchaseTimestamp: i.purchase_timestamp,
    creditsReceived: i.credits_received,
    product: i.product_json
  }));

  const wallets: Wallet[] = (walRes.data || []).map((w: any) => ({
    id: w.id,
    type: w.type,
    name: w.name,
    accountNumber: w.account_number
  }));

  const withdrawals: Withdrawal[] = (withRes.data || []).map((w: any) => ({
    id: w.id,
    amount: w.amount,
    date: w.date,
    status: w.status,
    wallet: w.wallet_json
  }));
  
  const referrals = (refRes.data || []).map((r: any) => r.mobile);

  return {
    mobile: user.mobile,
    password: user.password,
    balance: user.balance,
    referralCode: user.referral_code,
    bonusRedeemed: user.bonus_redeemed,
    referredBy: user.referred_by,
    referralIncome: user.referral_income,
    investments,
    wallets,
    withdrawals,
    referrals
  };
};

// Generic update for simple fields on the User table
export const updateUser = async (updatedUser: User): Promise<void> => {
  await supabase.from('users').update({
    balance: updatedUser.balance,
    bonus_redeemed: updatedUser.bonusRedeemed,
    referral_income: updatedUser.referralIncome
  }).eq('mobile', updatedUser.mobile);
};

// Secure Atomic Purchase Transaction
export const purchaseProduct = async (mobile: string, product: Product): Promise<{ success: boolean; message: string }> => {
  // RPC call to the PostgreSQL function 'purchase_product'
  // This function MUST be created in Supabase SQL editor for this to work.
  const { data, error } = await supabase.rpc('purchase_product', {
    p_user_mobile: mobile,
    p_product_id: product.vip,
    p_product_price: product.price,
    p_product_json: product
  });

  if (error) {
    console.error('Purchase error:', error);
    // Return a generic error if the RPC fails (e.g., function not found, network error)
    return { success: false, message: 'Transaction failed. Please try again.' };
  }

  // The RPC returns true (success) or false (insufficient funds/failure)
  if (data === true) {
    return { success: true, message: 'Purchase successful!' };
  } else {
    return { success: false, message: 'Insufficient balance or purchase failed.' };
  }
};

// Specific Methods for Relations to avoid complex object diffing
export const addInvestment = async (mobile: string, investment: Investment): Promise<void> => {
  await supabase.from('investments').insert({
    user_mobile: mobile,
    product_id: investment.productId,
    purchase_timestamp: investment.purchaseTimestamp,
    credits_received: investment.creditsReceived,
    product_json: investment.product
  });
};

export const updateInvestment = async (investment: Investment): Promise<void> => {
  // Assumes investment has an ID from database
  if (!investment.id) return;
  await supabase.from('investments').update({
    credits_received: investment.creditsReceived
  }).eq('id', investment.id);
};

export const addWallet = async (mobile: string, wallet: Wallet): Promise<void> => {
  await supabase.from('wallets').insert({
    user_mobile: mobile,
    type: wallet.type,
    name: wallet.name,
    account_number: wallet.accountNumber
  });
};

export const addWithdrawal = async (mobile: string, withdrawal: Withdrawal): Promise<void> => {
  await supabase.from('withdrawals').insert({
    user_mobile: mobile,
    amount: withdrawal.amount,
    date: withdrawal.date,
    status: withdrawal.status,
    wallet_json: withdrawal.wallet
  });
};

// --- Recharge Records ---

export const getRechargeRecords = async (): Promise<RechargeRecord[]> => {
  const { data, error } = await supabase.from('recharge_records').select('*');
  if (error) return [];
  return data.map((r: any) => ({
    id: r.id,
    userMobile: r.user_mobile,
    amount: r.amount,
    txnId: r.txn_id,
    status: r.status,
    timestamp: r.timestamp
  }));
};

export const addRechargeRecord = async (record: Omit<RechargeRecord, 'id' | 'status' | 'timestamp'>): Promise<boolean> => {
  // Check if TxnID exists
  const { data: existing } = await supabase
    .from('recharge_records')
    .select('id')
    .eq('txn_id', record.txnId)
    .maybeSingle();

  if (existing) {
    return false; // Duplicate transaction ID
  }

  const { error } = await supabase.from('recharge_records').insert({
    id: `rec_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    user_mobile: record.userMobile,
    amount: record.amount,
    txn_id: record.txnId,
    status: 'pending',
    timestamp: Date.now()
  });

  if (error) {
    console.error("Error adding recharge record:", error);
    return false;
  }
  return true;
};

export const updateRechargeRecord = async (updatedRecord: RechargeRecord): Promise<void> => {
  await supabase.from('recharge_records').update({
    status: updatedRecord.status
  }).eq('id', updatedRecord.id);
};

// --- Bonus Codes ---

export const getBonusCodes = async (): Promise<BonusCode[]> => {
  const { data } = await supabase.from('bonus_codes').select('*');
  return (data || []).map((b: any) => ({
    code: b.code,
    uses: b.uses,
    maxUses: b.max_uses
  }));
};

export const incrementBonusCodeUses = async (code: string): Promise<void> => {
  // RPC or simple fetch-update. Using simple fetch-update for now to avoid custom SQL functions.
  const { data } = await supabase.from('bonus_codes').select('uses').eq('code', code).single();
  if (data) {
    await supabase.from('bonus_codes').update({ uses: data.uses + 1 }).eq('code', code);
  }
};

// Delete user functionality
export const deleteUser = async (mobile: string): Promise<boolean> => {
  const normalizedMobile = normalizeMobile(mobile);
  
  // We attempt to delete the user. 
  // If Cascade delete is configured on FKs (which is typical for user_mobile), this deletes everything.
  // If not, this might fail, but we'll try it.
  const { error } = await supabase.from('users').delete().eq('mobile', normalizedMobile);
  
  if (error) {
    console.error('Error deleting user:', error);
    return false;
  }
  return true;
};
