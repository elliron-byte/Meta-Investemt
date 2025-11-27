
import React, { useState } from 'react';
import { ArrowLeftIcon } from './Icons';

export type Product = {
  vip: number;
  dailyIncome: number;
  totalIncome: number;
  price: number;
  imageUrl: string;
};

interface ProductDetailsPageProps {
  product: Product;
  onClose: () => void;
  onConfirm: (product: Product) => Promise<void>;
}

const ProductDetailsPage: React.FC<ProductDetailsPageProps> = ({ product, onClose, onConfirm }) => {
  const duration = 30; // As requested
  const [isProcessing, setIsProcessing] = useState(false);

  const handleConfirm = async () => {
      setIsProcessing(true);
      await onConfirm(product);
      // We don't necessarily need to set false here as the parent will likely unmount this component on success,
      // but it's safe to do if the parent logic handles errors without unmounting.
      setIsProcessing(false);
  };

  return (
    <div className="bg-gray-100 min-h-screen">
      <header className="bg-white flex items-center p-4 border-b sticky top-0 z-10">
        <button onClick={onClose} className="p-2 -ml-2" disabled={isProcessing}>
          <ArrowLeftIcon className="w-6 h-6 text-gray-800" />
        </button>
        <h1 className="text-lg font-semibold text-gray-800 text-center flex-grow -ml-6">Details</h1>
      </header>

      <main className="p-4 space-y-4">
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <img src={product.imageUrl} alt={`VIP${product.vip} Property`} className="w-full h-48 object-cover" />
          <div className="p-4">
            <h2 className="text-xl font-bold">VIP{product.vip}</h2>
            <p className="text-lg font-semibold text-gray-700">GHS {product.price}</p>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-4 flex justify-between items-center text-center">
          <div>
            <p className="text-sm text-gray-500">Daily income(GHS)</p>
            <p className="text-xl font-bold text-[#0066FF]">{product.dailyIncome.toFixed(2)}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Number of Days</p>
            <p className="text-xl font-bold text-[#0066FF]">{duration} days</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Total income(GHS)</p>
            <p className="text-xl font-bold text-[#0066FF]">{product.totalIncome.toLocaleString()}</p>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-4">
            <div className="bg-gray-100 text-gray-600 text-sm p-3 rounded-md space-y-2">
                <p>1. Each type of gold can be purchased multiple times. You can purchase multiple gold coins to generate profits.</p>
                <p>2. After purchasing gold, you will receive your rewards within 24 hours. The more gold you buy, the more rewards you will earn.</p>
            </div>
        </div>

        <div className="pt-4">
            <button 
                onClick={handleConfirm}
                disabled={isProcessing}
                className={`w-full text-white font-bold py-3.5 rounded-lg shadow-md transition-colors ${isProcessing ? 'bg-gray-400 cursor-wait' : 'bg-gradient-to-r from-[#2CACFF] to-[#0066FF] hover:from-[#0066FF] hover:to-[#004bb5]'}`}>
                {isProcessing ? 'Processing...' : 'Confirm'}
            </button>
        </div>
      </main>
    </div>
  );
};

export default ProductDetailsPage;
