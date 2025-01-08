import React from 'react';
import { Phone, Mail, Star, StarHalf } from 'lucide-react';
import { Button } from "@/components/ui/button"

const LocationTab = ({ number, label, active }) => (
  <button
    className={`px-4 py-2 text-sm ${
      active 
        ? 'bg-white shadow rounded-lg' 
        : 'text-gray-500 hover:text-gray-700'
    }`}
  >
    {label}
  </button>
);

export const PickupRiderInfo = ({ 
  riderName = "Jane Doe",
  vehicleType = "Toyota Corolla",
  plateNumber = "ABC 123",
  phoneNumber = "+1234567890",
  email = "jane@example.com"
}) => {
  return (
    <div className="space-y-4">
      <div className="text-sm">
        Going to <a href="#" className="text-blue-600 hover:underline">Pickup location</a>
      </div>
      
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-4">
          <img 
            src="/Avatar3.png"
            alt={riderName} 
            className="w-12 h-12 rounded-full"
          />
          <div>
            <h2 className="font-semibold">{riderName}</h2>
            <div className="flex items-center gap-1">
              <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
              <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
              <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
              <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
              <StarHalf className="w-4 h-4 fill-yellow-400 text-yellow-400" />
            </div>
          </div>
        </div>
        
        <Button variant="outline" className="text-blue-600 border-blue-600">
          View contact information
        </Button>
      </div>

      <div className="flex gap-4">
        <LocationTab number="1" label="Location 1" active />
        <LocationTab number="2" label="Location 2" />
        <LocationTab number="3" label="Location 3" />
        <LocationTab number="4" label="Location 4" />
      </div>
    </div>
  );
};