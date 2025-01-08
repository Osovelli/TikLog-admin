import React from 'react';
import { Calendar, ChevronDown, MapPin } from 'lucide-react';
import { CustomButton } from '../CustomButton';
import { DatePicker } from '../DatePickerComponent';

export const LicenseForm = ({ formData, onInputChange, onSave }) => {
  return (
    <div className="bg-white rounded-lg p-8 sm:flex gap-52 border">
      <h2 className="text-lg font-medium text-gray-900 mb-6">License Info</h2>
      <div className="grid grid-cols-2 gap-6 flex-1">
        <div className="col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            License Number
          </label>
          <div className="flex gap-2">
            <input
              type="tel"
              value={formData.phone}
              onChange={(e) => onInputChange('phone', e.target.value)}
              className="flex-1 p-2 border rounded-lg focus:ring-0"
            />
          </div>
        </div>
        <div className='flex flex-col gap-4 sm:flex-row col-span-2'>
        <div className='w-[40%]'>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Start Date
          </label>
          <DatePicker
            value={formData.startDate}
            onChange={(date) => onInputChange('birthDate', date)}
           />
        </div>
        <div className='w-[40%]'>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Expiry Date
          </label>
          <DatePicker
            value={formData.expiryDate}
            onChange={(date) => onInputChange('birthDate', date)}
           />
        </div>
        </div>
        <div className="col-span-2 mt-6 flex justify-center sm:justify-end ">
        <CustomButton
          onClick={onSave}
          buttonVariant={'primary'}
          className="px-4 py-2 hover:text-white rounded-lg hover:bg-indigo-700"
        >
          Save changes
        </CustomButton>
      </div>
      </div>
      
    </div>
  );
};
