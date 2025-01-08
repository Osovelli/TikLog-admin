import React from 'react';
import SideSheet from '../SheetComponent';
import { CustomButton } from '../CustomButton';

const DetailField = ({ label, value, isStatus }) => (
  <div className="border-b border-gray-100 py-3">
    <div className="text-gray-500 text-sm mb-1">{label}</div>
    {isStatus ? (
      <span className={`inline-flex px-3 py-1 rounded-full text-sm ${
        value === 'Successful' 
          ? 'bg-green-50 text-green-700' 
          : 'bg-red-50 text-red-700'
      }`}>
        {value}
      </span>
    ) : (
      <div className="text-gray-900">{value}</div>
    )}
  </div>
);

export const TransactionDetails = ({ isOpen, onClose, transaction }) => {
  if (!transaction) return null;

  return (
    <SideSheet
      isOpen={isOpen}
      onClose={onClose}
      title="Transaction details"
    >
      <div className="space-y-2">
        {/* Amount */}
        <div className="pb-4">
          <div className="text-4xl font-bold">
            ₦{transaction.amount}
          </div>
        </div>

        {/* Transaction Details Section */}
        <div className=''>
          <div className="text-sm font-medium text-gray-500 mb-2">
            TRANSACTION DETAILS
          </div>
          
          <DetailField 
            label="Transaction ID" 
            value={transaction.vendorName} 
          />
          
          <DetailField 
            label="Name" 
            value="James Okbepa" 
          />
          
          <DetailField 
            label="Email" 
            value={transaction.email} 
          />
          
          <DetailField 
            label="Payment Method" 
            value={transaction.paymentType} 
          />
          
          <DetailField 
            label="Status" 
            value={transaction.status} 
            isStatus 
          />
          
          <DetailField 
            label="Date and Time" 
            value={transaction.dateTime} 
          />
        </div>

        {/* Close Button */}
        <div className="absolute bottom-0 left-0 right-0 p-4 bg-white border-t">
          <CustomButton
            onClick={onClose}
            buttonVariant={"primary"}
            className="w-full py-3 px-4 rounded-lg border border-gray-200  transition-colors"
          >
            Close
          </CustomButton>
        </div>
      </div>
    </SideSheet>
  );
};