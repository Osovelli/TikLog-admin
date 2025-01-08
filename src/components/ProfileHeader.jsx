import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { CustomButton } from './CustomButton';

export const ProfileHeader = ({ 
  name, 
  email, 
  imageUrl, 
  isActive = true,
  onActivate,
  onDeactivate 
}) => {
  return (
    <div className='p-2'>
      <div className="relative bg-blue-400 h-40">
        {/* Background with illustration */}
        <div className="absolute right-0 bottom-0 w-80">
          <img
            src="/profileheader.png"
            alt=""
            className="w-full h-full object-contain"
          />
        </div>

        <div className="relative">
          {/* Back Button */}
          <Link 
            to="/customers" 
            className="inline-flex items-center gap-2 px-4 py-2 bg-white rounded-lg text-gray-600 hover:text-gray-900 my-6 mx-2"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back</span>
          </Link>
        </div>
      </div>
      {/* Profile Info */}
      <div className="relative bg-white border rounded-t-lg p-2 sm:p-6">
          <div className="flex flex-col sm:flex-row mt-6 items-start justify-between">
            <div className="flex sm:flex-row sm:items-center gap-4 ">
              <img
                src={imageUrl || "/college girl.jpeg"}
                alt={name}
                className="absolute -top-12 sm:w-40 w-24 h-24 sm:h-40 rounded-full object-cover"
              />
              <div className='mt-4 sm:mt-0 sm:ml-48'>
                <h1 className="text-2xl font-semibold text-gray-900">
                  {name}
                </h1>
                <p className="text-gray-500">{email}</p>
              </div>
            </div>
            <div className="flex flex-col md:flex-row gap-2">
              <CustomButton
                buttonVariant={'outlined'}
                onClick={onDeactivate}
                className="py-2 text-red-600 border border-red-200 rounded-lg hover:bg-red-50 transition-colors flex-shrink w-44"
              >
                Deactivate user
              </CustomButton>
              <CustomButton
                buttonVariant={'primary'}
                onClick={onActivate}
                className="py-2 text-white bg-[#27115F] rounded-lg  flex-shrink w-44"
              >
                Activate user
              </CustomButton>
            </div>
          </div>
        </div>
    </div>
  );
};