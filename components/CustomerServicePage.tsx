
import React from 'react';
import { ArrowLeftIcon, ChevronRightIcon } from './Icons';

interface CustomerServicePageProps {
  onClose: () => void;
}

interface ListItemProps {
    icon: React.ReactNode;
    label: string;
    onClick?: () => void;
    href?: string;
}

const ListItem: React.FC<ListItemProps> = ({ icon, label, onClick, href }) => (
  <a 
    href={href || "#"} 
    target={href ? "_blank" : undefined}
    rel={href ? "noopener noreferrer" : undefined}
    onClick={(e) => { 
        if (!href) {
            e.preventDefault(); 
            onClick?.(); 
        }
    }} 
    className="w-full flex items-center justify-between text-left p-4 bg-white hover:bg-gray-50 transition-colors rounded-lg shadow-sm"
  >
    <div className="flex items-center">
      {icon}
      <span className="ml-4 text-gray-800 font-semibold">{label}</span>
    </div>
    <ChevronRightIcon className="w-5 h-5 text-gray-400" />
  </a>
);

const CustomerServicePage: React.FC<CustomerServicePageProps> = ({ onClose }) => {
  const telegramImage = "https://iili.io/fFXMMq7.png";

  return (
    <div className="bg-gray-100 min-h-screen">
      <header className="bg-white flex items-center p-4 border-b sticky top-0 z-10">
        <button onClick={onClose} className="p-2 -ml-2">
          <ArrowLeftIcon className="w-6 h-6 text-gray-800" />
        </button>
        <h1 className="text-lg font-semibold text-gray-800 text-center flex-grow -ml-6">Customer Service</h1>
      </header>

      <main className="p-4 space-y-4">
        <div className="rounded-lg shadow-md overflow-hidden">
          <img 
            src="https://iili.io/fFXQymb.png" 
            alt="Customer service representative" 
            className="w-full h-40 object-cover" 
          />
        </div>

        <a 
            href="https://t.me/Meta_Customer_Service" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="flex items-center p-4 bg-white rounded-lg shadow-sm text-left"
        >
          <img src={telegramImage} alt="Telegram" className="w-12 h-12 mr-4 rounded-full" />
          <div>
            <p className="font-bold text-gray-800">Telegram</p>
            <p className="text-sm text-gray-500">Customer Service</p>
          </div>
        </a>
        
        <div className="bg-white rounded-lg shadow-sm p-4 text-center">
            <h2 className="text-3xl font-bold text-gray-800">9:00-18:00</h2>
            <p className="text-sm text-gray-500 mt-1">Pickup hours: 24 hours.</p>
            <p className="text-sm text-gray-500">Customer service hours: 9 a.m. - 6 p.m.</p>
        </div>

        <div className="space-y-3">
             <ListItem 
                icon={<img src={telegramImage} alt="Telegram Channel" className="w-8 h-8 rounded-full" />}
                label="Telegram Channel" 
                href="https://t.me/+shjiQ54gnag0N2E8"
             />
             <ListItem 
                icon={<img src={telegramImage} alt="Telegram Group" className="w-8 h-8 rounded-full" />}
                label="Telegram Group" 
                href="https://t.me/+qV-Lxi-qsJM2N2Q8"
             />
        </div>
      </main>
    </div>
  );
};

export default CustomerServicePage;
