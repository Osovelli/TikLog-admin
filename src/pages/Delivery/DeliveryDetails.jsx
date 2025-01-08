import React from 'react';
import { ArrowLeft, Bell, Settings, Star, StarHalf } from 'lucide-react';
import { Link } from 'react-router-dom';
import Map from 'react-map-gl';
import { AppLayout } from '@/components/AppLayout';
import DeliveryMap from '@/components/DeliveryMap';
import { PickupRiderInfo } from '@/components/_DeliveriesComponents/PickUpRiderInfo';
import { StepIndicator } from '@/components/_DeliveriesComponents/StepIndicator';
import DeliveryDetails from '@/components/_DeliveriesComponents/DeliveryDetails';



const ProgressStep = ({ number, label, status, isLast }) => (
  <div className="flex items-center">
    <div className="flex flex-col items-center">
      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
        status === 'completed' ? 'bg-green-100 text-green-600' :
        status === 'current' ? 'bg-blue-100 text-blue-600' :
        'bg-gray-100 text-gray-400'
      }`}>
        {number}
      </div>
      <div className="text-sm mt-1 text-gray-600">{label}</div>
    </div>
    {!isLast && (
      <div className={`h-0.5 w-full mx-2 ${
        status === 'completed' ? 'bg-green-500' : 'bg-gray-200'
      }`} />
    )}
  </div>
);

const InfoSection = ({ title, children }) => (
  <div className="border rounded-lg p-4">
    <h3 className="text-sm font-medium text-blue-600 mb-4">{title}</h3>
    {children}
  </div>
);

const InfoRow = ({ label, value }) => (
  <div className="flex justify-between py-2">
    <span className="text-sm text-gray-500">{label}</span>
    <span className="text-sm font-medium">{value}</span>
  </div>
);

export const DeliveryDetail = () => {
  return (
    <AppLayout title={
        (<div className="flex items-center gap-4">
            <Link to="/deliveries" className="text-gray-500 hover:text-gray-700">
              <ArrowLeft size={20} />
            </Link>
            <h1 className="text-lg font-semibold">#1234567890</h1>
          </div>
          )
    }>
      <div className="min-h-screen bg-gray-50">
        {/* Map */}
        <DeliveryMap />

        {/* Content */}
        <div className="mx-auto px-4 py-6 space-y-6">
          {/* Driver Info */}
          <PickupRiderInfo />

          {/* Progress Tracker */}
          <StepIndicator />

          {/* Info Grid */}
          <DeliveryDetails />

        </div>
      </div>
    </AppLayout>
  );
};