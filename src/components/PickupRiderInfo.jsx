import React from 'react';
import { FiPhone, FiMail } from 'react-icons/fi';
import RatingViewer from './RatingViewer';

const PickupRiderInfo = ({ riderName, vehicleType, plateNumber, phoneNumber, email }) => {
  return (
    <div className='p-2 bg-gray-100 rounded-md shadow-md'>
        <span className='text-sm'>Going to <a href="#" target="_blank" rel="noopener noreferrer">pickup location</a></span>
        <div className="flex items-center justify-between">
        <div className="flex items-center">
            <div className="mr-4">
            <img src="Avatar1.png" alt={riderName} className="w-12 h-12 rounded-full" />
            </div>
            <div>
            <h3 className="text-xl font-bold">{riderName}</h3>
            <p className="text-gray-500">{vehicleType} - {plateNumber}</p>
            <RatingViewer rating={4}/>
            </div>
        </div>
        <div className="flex items-center space-x-4">
            <a href={`tel:${phoneNumber}`} className="text-gray-500 hover:text-gray-700">
            <FiPhone size={18} />
            </a>
            <a href={`mailto:${email}`} className="text-gray-500 hover:text-gray-700">
            <FiMail size={18} />
            </a>
        </div>
        </div>
    </div>
  );
};

export default PickupRiderInfo;