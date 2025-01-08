import React from 'react';
import { Calendar, ChevronDown, MapPin } from 'lucide-react';
import { CustomButton } from '../CustomButton';
import { DatePicker } from '../DatePickerComponent';
import { CustomDropdown } from '../CustomDropDown';

export const OrganisationInfo = ({ formData, onInputChange, onDropdownChange, onSave }) => {

  const businessTypes = [
    "Logistics",
    "Food delivery",
    "Footwear and clothing"
  ]

  return (
    <div className="bg-white rounded-lg p-8 sm:flex gap-52 border">
      <h2 className="text-lg font-medium text-gray-900 mb-6">Organisation Info</h2>
      <div className="grid grid-cols-2 gap-6 flex-1">
        <div className=' col-span-2'>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Business Name
          </label>
          <input
            type="text"
            value={formData.businessName}
            onChange={(e) => onInputChange('businessName', e.target.value)}
            className="w-full p-2 border rounded-lg focus:ring-0"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Business Type
          </label>
          <div className="relative">
            <CustomDropdown
              value={formData?.businessType}
              options={businessTypes}
              onChange={(value) => onDropdownChange('businessType', value)}

            />
            {/*<select
              value={formData.gender}
              onChange={(e) => onInputChange('businessType', e.target.value)}
              className="w-full p-2 border rounded-lg appearance-none focus:ring-0"
            >
              <option value="Logistics">Logistics</option>
              <option value="Food delivery">Food Delivery</option>
              <option value="Footwear and clothing">Shoes & Clothing</option>
            </select>
            <ChevronDown className="absolute right-2 top-3 w-4 h-4 text-gray-500" /> */}
          </div>
        </div>
        <div className="">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Business Registration Number
          </label>
          <input
            type="email"
            value={formData.businessRegNumber}
            onChange={(e) => onInputChange('businessRegNumber', e.target.value)}
            className="w-full p-2 border rounded-lg focus:ring-0"
          />
        </div>
        <div className="col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Address
          </label>
          <div className="relative">
            <input
              type="text"
              value={formData.address}
              onChange={(e) => onInputChange('address', e.target.value)}
              className="w-full p-2 pl-10 border rounded-lg focus:ring-0"
            />
            <MapPin className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" />
          </div>
        </div>
        <div className=" col-span-2 mt-6 flex justify-center sm:justify-end ">
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
