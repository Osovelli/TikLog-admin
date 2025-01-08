import React from 'react';
import { ButtonComponent } from './ButtonComponent';
import { ArrowRightToLineIcon } from 'lucide-react';
import { FaGreaterThan } from 'react-icons/fa';

const DeliveryProcessProgress = ({ currentStep }) => {
  const steps = [
    { label: 'Order Placement', icon: '1' },
    { label: 'Rider Assigned', icon: '2' },
    { label: 'Pick Up', icon: '3' },
    { label: 'In-Transit', icon: '4' },
    { label: 'Delivered', icon: '5' },
  ];

  return (
    <div className='flex justify-between items-center p-4'>
        <div className="flex space-x-16 items-center p-2">
            {steps.map((step, index) => (
                <div
                key={index}
                className={`flex flex-col items-center ${
                    index < currentStep ? 'text-blue-500' : 'text-gray-400'
                }`}
                >
                <div
                    className={`w-4 h-4 rounded-full flex items-center justify-center mb-2 ${
                    index < currentStep ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-400'
                    }`}
                >
                    <p className='text-xs'>{step.icon}</p>
                    
                </div>
                <div className='flex items-center gap-8'>
                    <p className='text-xs'>{step.label}</p>
                    {step.icon < 5 && <FaGreaterThan className='h-3 w-3' />}
                </div>
            </div>
            ))}
        </div>
        <ButtonComponent label={"Cancel order"} buttonStyles={'bg-white text-red-500 h-10 shadow-sm'}/>
    </div>
    
  );
};

export default DeliveryProcessProgress;
