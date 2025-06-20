import React, { useEffect, useState } from 'react';
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
import { useLocation } from 'react-router';
import useUserStore from '@/store/UserStore';
import { AppLayout } from '@/components/AppLayout';

export const RiderInfo = () => {
  const location = useLocation();
  const riderId = location.pathname.split('/').pop();
  const [activeTab, setActiveTab] = useState('profile');
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    countryCode: '',
    birthDate: '',
    gender: '',
    address: '',
    startDate: '',
    expiryDate: '',
    isActive: null,
  });

  const tabs = [
    { id: 'profile', label: 'Profile Information' },
    { id: 'requests', label: 'All Requests' },
    { id: 'wallet', label: 'Wallet Information' },
    { id: 'license', label: 'License Information' },
    { id: 'vehicles', label: 'All Vehicles' },
  ]

  const { getRiderById, activateRider, deactivateRider, loading } = useUserStore();

  // Fetch user data when component mounts
  useEffect(() => {
    console.log('Fetching user data for ID:', riderId);
    console.log(typeof riderId, riderId);
    const fetchRiderData = async () => { 
      try {
        const riderData = await getRiderById(riderId);
        if (riderData) {
          setFormData({
            firstName: riderData.firstname || 'James',
            lastName: riderData.lastname || 'Okpeba',
            email: riderData.email || 'user@tiklog.com',
            phone: riderData.phone_number || '8100441503',
            countryCode: riderData.country_code || '+234',
            birthDate: riderData.date_of_birth || '22-02-2022',
            gender: riderData.gender || 'Male',
            address: riderData.address || '56 Opebi road, Sabo Yaba.',
            startDate: riderData.start_date || '22-02-2022',
            expiryDate: riderData.expiry_date || '22-02-2022',
          });
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };
    fetchRiderData();
  }, [getRiderById, riderId]);



  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSaveChanges = () => {
    console.log('Saving changes:', formData);
  };

  const handleActivateUser = async () => {
    try {
      console.log('activating user...');
      await activateRider(riderId)  
    } catch (error) {
      console.error('Error activating user:', error);
    }
  }

  const handleDeactivateUser = async () => {
    try {
      console.log('deactivating user...');
      await deactivateRider(riderId);
      // Optionally, you can update the local state to reflect the change
      setFormData(prev => ({
        ...prev,
        isActive: false
      }));
    } catch (error) {
      console.error('Error deactivating user:', error);
    }
  }

  return (
    <AppLayout showBackButton={false}>
    <div className="min-h-screen bg-gray-50 md:px-6">

      {/* Profile Header */}
      <ProfileHeader
        name={`${formData.firstName} ${formData.lastName}`}
        email={formData.email}
        imageUrl="/Avatar3.png"
        isActive={formData.isActive}
        onActivate={handleActivateUser}
        onDeactivate={handleDeactivateUser}
      />

      {/* Navigation Tabs */}
      <div className="my-4">
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
    </AppLayout>
  );
};