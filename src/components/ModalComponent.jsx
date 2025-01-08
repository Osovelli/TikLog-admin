import React from 'react';
import { X } from 'lucide-react';

const Modal = ({ isOpen, onClose, title, children, icon, buttons}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-[60]">
      <div className='bg-white rounded-lg w-full max-w-md flex flex-col max-h-[calc(100vh-2rem)]'>
        <div className="flex justify-end p-2">
          <button 
            onClick={onClose} 
            className="text-gray-500 hover:text-gray-700">
            <X size={24} />
          </button>
        </div>
        <div className="px-6 pb-6 text-center">
          {icon && (
            <div className="flex justify-center mb-4">
              {icon}
            </div>
          )}
          {title && <h2 className="text-xl font-semibold mb-2">{title}</h2>}
          <div className="text-gray-600 mb-6">{children}</div>
          <div className="flex flex-col md:flex-row w-full px-10 gap-2">
            {buttons?.map((button, index) => {
               // Base styles that will always be applied
               const baseStyles = "py-3 px-4 rounded-lg w-full flex-shrink";
              
               // Default variant styles
               const variantStyles = button.primary
                 ? 'bg-[#1F1F76] text-white hover:bg-indigo-700'
                 : 'bg-gray-200 text-gray-800 hover:bg-gray-300';
               
               // Combine all styles, with custom styles taking precedence
               const finalClassName = `${baseStyles} ${button.style || ''} ${variantStyles}`;

              return(
              <button
                key={index}
                onClick={button.onClick}
                className={finalClassName}
              >
                {button.label}
              </button>
            )})}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Modal;