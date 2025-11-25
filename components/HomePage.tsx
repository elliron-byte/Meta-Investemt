
import React from 'react';
import { BellIcon, RechargeIcon, WithdrawalIcon, CustomerServiceIcon } from './Icons';
import type { Product } from './ProductDetailsPage';

const products: Product[] = [
    { vip: 1, dailyIncome: 9, totalIncome: 270, price: 60, imageUrl: "https://iili.io/fFXxuXR.png" },
    { vip: 2, dailyIncome: 25, totalIncome: 750, price: 100, imageUrl: "https://iili.io/fFXoKSn.png" },
    { vip: 3, dailyIncome: 30, totalIncome: 900, price: 150, imageUrl: "https://iili.io/fFXnRTv.png" },
    { vip: 4, dailyIncome: 40, totalIncome: 1200, price: 200, imageUrl: "https://iili.io/fFXBSf9.png" },
    { vip: 5, dailyIncome: 45, totalIncome: 1350, price: 400, imageUrl: "https://iili.io/fFXq2kv.png" },
];

interface ProductCardProps {
    product: Product;
    onBuyClick: (product: Product) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onBuyClick }) => {
    return (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <img src={product.imageUrl} alt={`VIP${product.vip} Property`} className="w-full h-32 object-cover" />
            <div className="p-4">
                <h3 className="font-bold text-lg">VIP{product.vip}</h3>
                <p className="text-sm text-gray-600">Daily income: <span className="font-semibold text-[#0066FF]">GHS {product.dailyIncome}</span></p>
                <p className="text-sm text-gray-600">Total income: <span className="font-semibold text-[#0066FF]">GHS {product.totalIncome.toLocaleString()}</span></p>
                <div className="flex justify-between items-center mt-4">
                    <p className="font-bold text-xl text-[#0066FF]">GHS {product.price}</p>
                    <button 
                        onClick={() => onBuyClick(product)}
                        className="bg-gradient-to-r from-[#2CACFF] to-[#0066FF] text-white font-bold py-2 px-6 rounded-lg hover:from-[#0066FF] hover:to-[#004bb5] transition-all">
                        Buy
                    </button>
                </div>
            </div>
        </div>
    );
};


interface HomePageProps {
  onRechargeClick: () => void;
  onWithdrawalClick: () => void;
  onBuyClick: (product: Product) => void;
  onOpenCustomerService: () => void;
}


const HomePage: React.FC<HomePageProps> = ({ onRechargeClick, onWithdrawalClick, onBuyClick, onOpenCustomerService }) => {
  return (
    <div className="pb-20">
      <header className="p-4 flex justify-between items-center text-white bg-white/80 backdrop-blur-sm">
        <h1 className="font-semibold text-gray-800">To welcome</h1>
        <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-sm font-bold text-gray-700">
            A
        </div>
      </header>

      <main className="p-4">
        <div className="rounded-lg overflow-hidden shadow-lg mb-4 bg-white">
            <img src="https://iili.io/fFWEKo7.png" alt="Meta Investment Banner" className="w-full h-auto" />
        </div>
        
        <div className="grid grid-cols-3 gap-4 text-center mb-6">
            <button onClick={onRechargeClick} className="bg-white rounded-lg shadow p-3 flex flex-col items-center justify-center w-full">
                <RechargeIcon className="w-8 h-8 text-[#0066FF] mb-1" />
                <span className="text-xs font-medium">Recharge</span>
            </button>
            <button onClick={onWithdrawalClick} className="bg-white rounded-lg shadow p-3 flex flex-col items-center justify-center w-full">
                <WithdrawalIcon className="w-8 h-8 text-[#0066FF] mb-1" />
                <span className="text-xs font-medium">Withdrawal</span>
            </button>
            <button onClick={onOpenCustomerService} className="bg-white rounded-lg shadow p-3 flex flex-col items-center justify-center w-full">
                <CustomerServiceIcon className="w-8 h-8 text-[#0066FF] mb-1" />
                <span className="text-xs font-medium">Customer Service</span>
            </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {products.map(product => (
                <ProductCard key={product.vip} product={product} onBuyClick={onBuyClick} />
            ))}
        </div>

      </main>
    </div>
  );
};

export default HomePage;
