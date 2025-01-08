import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { ButtonComponent } from '@/components/ButtonComponent';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';

export const FundWalletForm = ({ onContinue }) => {
  const [amount, setAmount] = useState('');
  const [selectedCard, setSelectedCard] = useState('');
  
  const quickAmounts = [
    { value: '1000.00', label: '₦1,000.00' },
    { value: '2000.00', label: '₦2,000.00' },
    { value: '5000.00', label: '₦5,000.00' },
    { value: '10000.00', label: '₦10,000.00' },
  ];

  const handleQuickAmountClick = (value) => {
    setAmount(value);
  };

  return (
    <div className="space-y-4">
      <Input
        type="number"
        placeholder="Enter amount"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        className="w-full"
      />
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
        {quickAmounts.map((amt) => (
          <button
            key={amt.value}
            onClick={() => handleQuickAmountClick(amt.value)}
            className="py-2 px-3 text-sm border rounded-lg hover:bg-gray-50"
          >
            {amt.label}
          </button>
        ))}
      </div>
      
      <Select value={selectedCard} onValueChange={setSelectedCard}>
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Select card" />
        </SelectTrigger>
        <SelectContent position="popper" sideOffset={1} className="z-[70]">
          <SelectItem value="card1">**** **** **** 9235 (Visa)</SelectItem>
          <SelectItem value="card2">**** **** **** 9235 (Mastercard)</SelectItem>
        </SelectContent>
      </Select>
      
      <ButtonComponent
        onClick={() => onContinue(amount)}
        label="Continue"
        variant="primary"
        buttonStyles="w-full"
      />
    </div>
  );
};