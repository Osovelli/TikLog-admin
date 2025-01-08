import React from 'react';
import { Check } from 'lucide-react';
import { Button } from "@/components/ui/button"

export const StepIndicator = ({
  steps = [
    "Order Placement",
    "Rider Assigned", 
    "Pick Up",
    "In-Transit",
    "Delivered"
  ],
  currentStep = 2,
  onCancel
}) => {
  return (
    <div className="flex flex-col md:flex-row items-start md:items-center justify-between w-full gap-4">
      <div className="flex flex-col md:flex-row items-start md:items-center gap-2 md:gap-1 w-full md:w-auto">
        {steps.map((step, index) => {
          const stepNumber = index + 1;
          const isCompleted = stepNumber < currentStep;
          const isCurrent = stepNumber === currentStep;
          
          return (
            <div key={step} className="flex items-center w-full md:w-auto">
              <div className="flex items-center gap-2">
                <div className={`
                  w-6 h-6 rounded-full flex items-center justify-center text-sm
                  ${isCompleted ? 'bg-green-500 text-white' : 
                    isCurrent ? 'bg-orange-500 text-white' : 
                    'bg-gray-200 text-gray-600'}
                `}>
                  {isCompleted ? (
                    <Check className="w-4 h-4" />
                  ) : (
                    stepNumber
                  )}
                </div>
                <span className={`text-sm font-medium
                  ${isCompleted ? 'text-green-500' : 
                    isCurrent ? 'text-orange-500' : 
                    'text-gray-600'}
                `}>
                  {step}
                </span>
              </div>
              
              {index < steps.length - 1 && (
                <div className={`hidden md:block mx-1
                  ${isCompleted ? 'text-green-500' : 'text-gray-300'}
                `}>
                  {'>'}
                </div>
              )}
            </div>
          );
        })}
      </div>

      <Button 
        variant="ghost" 
        className="text-red-600 hover:text-red-700 hover:bg-red-50 px-0 md:px-4"
        onClick={onCancel}
      >
        Cancel Order
      </Button>
    </div>
  );
};