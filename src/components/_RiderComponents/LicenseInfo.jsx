import React from 'react';
import { Calendar, ChevronDown, MapPin } from 'lucide-react';
import { CustomButton } from '../CustomButton';
import { DatePicker } from '../DatePickerComponent';

export const LicenseForm = ({ formData, onInputChange, onSave, loading }) => {
  if (loading) {
    return (
      <div className="space-y-6 bg-white p-6 rounded-lg">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
          <span className="ml-2 text-gray-600">Loading vehicles...</span>
        </div>
      </div>
    )
  }

  if (!formData) {
    return (
      <div className="flex items-center justify-center h-64">
      <div className="text-center">
        <div className="text-lg font-semibold text-gray-500 mb-2">
        No License Data Available
        </div>
        {/* <div className="text-sm text-gray-400">
        Please provide license information to continue.
        </div> */}
      </div>
      </div>
    );
  }

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
              type="text"
              value={formData?.license_number}
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
            value={formData.issue_date}
            onChange={(date) => onInputChange('birthDate', date)}
           />
        </div>
        <div className='w-[40%]'>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Expiry Date
          </label>
          <DatePicker
            value={formData.expiry_date}
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
