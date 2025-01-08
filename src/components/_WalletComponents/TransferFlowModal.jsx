import { useState} from "react";
import { Input } from "../ui/input";
import { ButtonComponent } from "../ButtonComponent";

// Create a TransferForm component (can be in the same file or separate)
export const TransferForm = ({ onContinue }) => {
  const [phoneNumber, setPhoneNumber] = useState('');
  
  return (
    <div className='w-full flex items-center flex-col gap-2 space-y-10'>
      <p className='text-sm'>Transfer funds securely to other Tiklog users..</p>
      <Input 
        className="w-72" 
        placeholder="Recipient's Phone number"
        value={phoneNumber}
        onChange={(e) => setPhoneNumber(e.target.value)}
      />
      <ButtonComponent
        className="w-72 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
        onClick={() => onContinue(phoneNumber)}
        label={"Continue"}
        variant={"primary"}
      />
    </div>
  );
};

// New component for the amount form
export const AmountForm = ({ userData, onConfirm }) => {
  const [amount, setAmount] = useState('');

  const predefinedAmounts = [
    { value: 1000, label: 'N1,000.00' },
    { value: 2000, label: 'N2,000.00' },
    { value: 5000, label: 'N5,000.00' },
    { value: 10000, label: 'N10,000.00' }
  ];

  return (
    <div className='w-full flex flex-col items-center gap-2'>
      <p>Transfer funds securely to other Tiklog users..</p>
      <div className="bg-gray-50 p-4 rounded-lg w-72 mt-6">
        <p className="font-medium">{userData.name}</p>
        <p className="text-gray-600">{userData.phoneNumber}</p>
      </div>
      
      <Input 
        className="w-72 h-12" 
        placeholder="Enter amount" 
        type="number"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
      />
      
      <div className="grid grid-cols-2 md:flex gap-2 mt-4">
        {predefinedAmounts.map((preset) => (
          <button 
            key={preset.value}
            className="p-2 border rounded-lg hover:bg-gray-50"
            onClick={() => setAmount(preset.value)}
          >
            {preset.label}
          </button>
        ))}
      </div>

      <ButtonComponent
        variant={"primary"}
        className="w-72 mt-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
        onClick={() => onConfirm(amount)}
        label={"confirm"}
      />
    </div>
  );
};