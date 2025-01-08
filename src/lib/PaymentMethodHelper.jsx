import React from 'react';

// Helper component for payment method items
export const PaymentMethodItem = ({ type, number, expiryDate }) => {
  const CardIcon = () => {
    if (type.toLowerCase() === 'visa') {
      return (
        <div className="w-10 h-6 bg-[#1A1F71] flex items-center justify-center rounded">
          <span className="text-white text-sm font-bold">VISA</span>
        </div>
      );
    } else if (type.toLowerCase() === 'mastercard') {
      return (
        <div className="w-8 h-8">
          <div className="flex -space-x-3">
            <div className="w-5 h-5 bg-[#EB001B] rounded-full opacity-80"></div>
            <div className="w-5 h-5 bg-[#F79E1B] rounded-full opacity-80"></div>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
      <CardIcon />
      <div>
        <div className="text-sm font-medium text-gray-900">XXXX {number}</div>
        <div className="text-sm text-gray-500">Expires on {expiryDate}</div>
      </div>
    </div>
  );
};