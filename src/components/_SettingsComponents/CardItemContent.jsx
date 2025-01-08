import React, { useState } from 'react';
import { X } from 'lucide-react';

const CardItemContent = ({ onClose, cardNumber = "0000 0000 0000 0000", expiryDate = "12/23", cvv = "123", isDefault = false, onSetDefault }) => {
  const [showCardNumber, setShowCardNumber] = useState(false);
  const [showCVV, setShowCVV] = useState(false);

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      {/* <div className="flex items-center justify-between p-4 border-b">
        <h2 className="text-lg font-medium">View card details</h2>
        <button onClick={onClose} className="text-gray-400 hover:text-gray-500">
          <X size={20} />
        </button>
      </div> */}

      {/* Content */}
      <div className="flex-1 p-4">
        <div className="space-y-6">
          {/* Card Number Section */}
          <div className="space-y-2">
            <div className="relative">
              <input
                type="text"
                value={cardNumber}
                className="w-full p-3 bg-gray-50 rounded-lg text-gray-900 font-medium"
                disabled
              />
            </div>
          </div>

          {/* CVV and Expiry Date Section */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="relative">
                <input
                  type={showCVV ? "text" : "password"}
                  value={cvv}
                  className="w-full p-3 bg-gray-50 rounded-lg text-gray-900 font-medium"
                  disabled
                />
              </div>
            </div>
            <div className="space-y-2">
              <div className="relative">
                <input
                  type="text"
                  value={expiryDate}
                  className="w-full p-3 bg-gray-50 rounded-lg text-gray-900 font-medium"
                  disabled
                />
              </div>
            </div>
          </div>

          {/* Set as Default Section */}
          <div className="pt-4">
            <label className="flex items-center space-x-3">
              <input
                type="checkbox"
                checked={isDefault}
                onChange={() => onSetDefault?.()}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <span className="text-gray-700">Set as default</span>
            </label>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="p-4 border-t mt-auto">
        <button
          onClick={onClose}
          className="w-full flex items-center justify-center px-4 py-3 my-6 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
        >
          DELETE
        </button>
      </div>
    </div>
  );
};

export default CardItemContent;