import React from 'react';
import SideSheet from '../SheetComponent';
import { CustomButton } from '../CustomButton';

const DetailField = ({ label, value, isStatus }) => (
  <div className="border-b border-gray-100 py-3">
    <div className="text-gray-500 text-sm mb-1">{label}</div>
    {isStatus ? (
      <span className={`inline-flex px-3 py-1 rounded-full text-sm ${
        value === 'Successful' 
          ? 'bg-green-50 text-green-700' 
          : 'bg-red-50 text-red-700'
      }`}>
        {value}
      </span>
    ) : (
      <div className="text-gray-900">{value}</div>
    )}
  </div>
);

export const VehicleDetails = ({ isOpen, onClose, vehicle }) => {
  if (!vehicle) return null;

  return (
    <SideSheet
      isOpen={isOpen}
      onClose={onClose}
      title="Vehicle details"
    >
      <div className="space-y-2">
        {/* Vehicle Image/Placeholder */}
        <div className="pb-4">
          {/* You might want to add an image of the vehicle here if available */}
          <img
            src={vehicle.imageUrl || '/placeholder-vehicle.png'} // Replace with actual image or a placeholder
            alt="Vehicle"
            className="w-full h-48 object-cover rounded-lg"
          />
        </div>

        {/* Vehicle Details Section */}
        <div className=''>
          <div className="text-sm font-medium text-gray-500 mb-2">
            VEHICLE DETAILS
          </div>
          
          <DetailField 
            label="Vehicle Type" 
            value={vehicle.vehicle_type} 
          />
          
          <DetailField 
            label="Make" 
            value={vehicle.vehicleDetails?.make}
          />
          
          <DetailField 
            label="Model" 
            value={vehicle.vehicleDetails?.model} 
          />
          
          <DetailField 
            label="Plate Number" 
            value={vehicle.vehicleDetails?.plate_number} 
          />
          
          <DetailField 
            label="Color" 
            value={vehicle.vehicleDetails?.color} 
          />
          
          <DetailField 
            label="Status" 
            value={vehicle.status} 
            isStatus 
          />
          
          <DetailField 
            label="Year" 
            value={vehicle.vehicleDetails?.year} 
          />

          <DetailField 
            label="Registered On" 
            value={new Date(vehicle.createdAt).toLocaleDateString()} 
          />

        </div>

        {/* Close Button */}
        <div className="absolute bottom-0 left-0 right-0 p-4 bg-white border-t">
          <CustomButton
            onClick={onClose}
            buttonVariant={"primary"}
            className="w-full py-3 px-4 rounded-lg border border-gray-200  transition-colors"
          >
            Close
          </CustomButton>
        </div>
      </div>
    </SideSheet>
  );
};