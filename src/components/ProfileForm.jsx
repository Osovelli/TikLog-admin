import React from 'react';
import { Calendar, ChevronDown, MapPin } from 'lucide-react';
import { CustomButton } from './CustomButton';
import { DatePicker } from './DatePickerComponent';

export const ProfileForm = ({ formData, onInputChange, onSave }) => {
  return (
    <div className="bg-white rounded-lg p-8 sm:flex gap-52 border">
      <h2 className="text-lg font-medium text-gray-900 mb-6">Personal Info</h2>
      <div className="grid grid-cols-2 gap-6 flex-1">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            First Name
          </label>
          <input
            type="text"
            value={formData.firstName}
            onChange={(e) => onInputChange('firstName', e.target.value)}
            className="w-full p-2 border rounded-lg focus:ring-0"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Last Name
          </label>
          <input
            type="text"
            value={formData.lastName}
            onChange={(e) => onInputChange('lastName', e.target.value)}
            className="w-full p-2 border rounded-lg focus:ring-0 "
          />
        </div>
        <div className="col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Email
          </label>
          <input
            type="email"
            value={formData.email}
            onChange={(e) => onInputChange('email', e.target.value)}
            className="w-full p-2 border rounded-lg focus:ring-0"
          />
        </div>
        <div className="col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Phone Number
          </label>
          <div className="flex gap-2">
            <div className="relative w-24">
              <select
                value={formData.countryCode}
                onChange={(e) => onInputChange('countryCode', e.target.value)}
                className="w-full p-2 border rounded-lg appearance-none focus:ring-0"
              >
                <option value="+234">+234</option>
                <option value="+1">+1</option>
              </select>
              <ChevronDown className="absolute right-2 top-3 w-4 h-4 text-gray-500" />
            </div>
            <input
              type="tel"
              value={formData.phone}
              onChange={(e) => onInputChange('phone', e.target.value)}
              className="flex-1 p-2 border rounded-lg focus:ring-0"
            />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Date of Birth
          </label>
          <DatePicker
            value={formData.birthDate}
            onChange={(date) => onInputChange('birthDate', date)}
           />
          {/* <div className="relative">
            <input
              type="text"
              value={formData.birthDate}
              onChange={(e) => onInputChange('birthDate', e.target.value)}
              className="w-full p-2 border rounded-lg focus:ring-0"
            />
            <Calendar className="absolute right-2 top-2.5 w-5 h-5 text-gray-400" />
          </div> */}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Gender
          </label>
          <div className="relative">
            <select
              value={formData.gender}
              onChange={(e) => onInputChange('gender', e.target.value)}
              className="w-full p-2 border rounded-lg appearance-none focus:ring-0"
            >
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
            <ChevronDown className="absolute right-2 top-3 w-4 h-4 text-gray-500" />
          </div>
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
