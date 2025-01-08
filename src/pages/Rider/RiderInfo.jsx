import React, { useState } from 'react';
import { ProfileForm } from '@/components/ProfileForm';
import { ProfileHeader } from '@/components/ProfileHeader';
import { RiderRequests } from '@/components/_RiderComponents/RiderRequests';
import { RiderWalletInfo } from '@/components/_RiderComponents/RiderWalletInfo';
import { LicenseForm } from '@/components/_RiderComponents/LicenseInfo';
import { VehiclesInfo } from '@/components/_RiderComponents/VehicleInfo';
import { Swiper, SwiperSlide } from 'swiper/react';
import { FreeMode } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/free-mode';

export const RiderInfo = ({ customerId }) => {
  const [activeTab, setActiveTab] = useState('profile');
  const [formData, setFormData] = useState({
    firstName: 'James',
    lastName: 'Okpeba',
    email: 'user@tiklog.com',
    phone: '8100441503',
    countryCode: '+234',
    birthDate: '22-02-2022',
    gender: 'Male',
    address: '56 Opebi road, Sabo Yaba.',
    startDate: '22-02-2022',
    expiryDate: '22-02-2022',
  });

  const tabs = [
    { id: 'profile', label: 'Profile Information' },
    { id: 'requests', label: 'All Requests' },
    { id: 'wallet', label: 'Wallet Information' },
    { id: 'license', label: 'License Information' },
    { id: 'vehicles', label: 'All Vehicles' },
  ]

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSaveChanges = () => {
    console.log('Saving changes:', formData);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">

      {/* Profile Header */}
      <ProfileHeader
        name="James Okpeba"
        email="user@tiklog.com"
        imageUrl="/Avatar3.png"
        isActive={true}
        onActivate={() => console.log('Activate user')}
        onDeactivate={() => console.log('Deactivate user')}
      />

      {/* Navigation Tabs */}
      <div className="border-b mb-6">
        <Swiper
          slidesPerView="auto"
          spaceBetween={32}
          freeMode={true}
          modules={[FreeMode]}
          className="mySwiper"
        >
          {tabs.map(tab => (
            <SwiperSlide key={tab.id} className="w-auto">
              <button
                onClick={() => setActiveTab(tab.id)}
                className={`pb-4 px-1 text-xs sm:text-base whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'text-indigo-600 border-b-2 border-indigo-600 font-medium'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                {tab.label}
              </button>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
      {/* <div className="border-b mb-6">
        <nav className="flex gap-8 overflow-x-scroll">
          {[
            { id: 'profile', label: 'Profile Information' },
            { id: 'requests', label: 'All Requests' },
            { id: 'wallet', label: 'Wallet Information' },
            { id: 'license', label: 'License Information' },
            { id: 'vehicles', label: 'All Vehicles' },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`pb-4 px-1 text-xs sm:text-base ${
                activeTab === tab.id
                  ? 'text-indigo-600 border-b-2 border-indigo-600 font-medium'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div> */}

      {/* Profile Form */}
      {activeTab === 'profile' && (
        <ProfileForm 
          formData={formData}
          onInputChange={handleInputChange}
          onSave={handleSaveChanges}
        />
      )}

      {/* Deliveries */}
      {activeTab === 'requests' && (
        <RiderRequests />
      )}


      {/* wallet */}
      {activeTab === 'wallet' && (
        <RiderWalletInfo />
      )}


      {/* license */}
      {activeTab === 'license' && (
        <LicenseForm
          formData={formData}
          onInputChange={handleInputChange}
          onSave={handleSaveChanges}
         />
      )}


      {/* wallet */}
      {activeTab === 'vehicles' && (
        <VehiclesInfo />
      )}
    </div>
  );
};