import React, { useCallback, useEffect, useState } from 'react';
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
  const [riderDeliveries, setRiderDeliveries] = useState([]);
  const [riderWallet, setRiderWallet] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  const tabs = [
    { id: 'profile', label: 'Profile Information' },
    { id: 'requests', label: 'All Requests' },
    { id: 'wallet', label: 'Wallet Information' },
    { id: 'license', label: 'License Information' },
    { id: 'vehicles', label: 'All Vehicles' },
  ]

  const { 
    getRiderById, 
    activateRider, 
    deactivateRider,
    getUserDeliveriesById,
    getUserWalletById, 
    loading
  } = useUserStore();

  // Memoized fetch functions to prevent unnecessary re-renders

  // Fetch user data when component mounts
  const fetchRiderData = useCallback(async () => {
      try {
        setIsLoading(true)
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
        console.error("Error fetching rider data:", error)
      } finally {
        setIsLoading(false)
      }
    }, [getRiderById, riderId])

  //fetch Rider deliveries data
  const fetchRiderDeliveries = useCallback(async () => {
      try {
        const data = await getUserDeliveriesById(riderId)
        console.log("Rider Deliveries Response: ", data)
        if (data?.data) {
          setRiderDeliveries(data.data)
        }
      } catch (error) {
        console.error("Error fetching rider deliveries:", error)
        setRiderDeliveries([])
      }
    }, [getUserDeliveriesById, riderId])

  //fetch Rider wallet data
   const fetchRiderWallet = useCallback(async () => {
      try {
        const data = await getUserWalletById(riderId)
        console.log("Rider Wallet Response: ", data)
        if (data?.data) {
          setRiderWallet(data.data)
        }
      } catch (error) {
        console.error("Error fetching user wallet info:", error)
        setRiderWallet([])
      }
    }, [getUserWalletById, riderId])

  // Fetch all data when component mounts or userid changes
    useEffect(() => {
      if (riderId) {
        fetchRiderData()
        fetchRiderDeliveries()
        fetchRiderWallet()
      }
    }, [riderId, fetchRiderData, fetchRiderDeliveries, fetchRiderWallet])


  //handle changes in inputs  
  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };


  //this is suppose to handle/send the changes made in the rider form to the database
  const handleSaveChanges = () => {
    console.log('Saving changes:', formData);
  };

  //activates rider status
  const handleActivateUser = async () => {
    try {
      console.log('activating user...');
      await activateRider(riderId)  
    } catch (error) {
      console.error('Error activating user:', error);
    }
  }


  //deactivates rider status
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

  // Refresh data function for manual refresh
    const refreshData = useCallback(() => {
      fetchRiderData()
      fetchRiderDeliveries()
      fetchRiderWallet()
    }, [fetchRiderData, fetchRiderDeliveries, fetchRiderWallet])
  
    //loading state check
    if (isLoading) {
      return (
        <AppLayout showBackButton={false} showAppHeader={true}>
          <div className="min-h-screen bg-gray-50 md:px-6">
            <div className="animate-pulse space-y-6">
              <div className="h-32 bg-gray-200 rounded-lg"></div>
              <div className="h-8 bg-gray-200 rounded w-1/3"></div>
              <div className="h-64 bg-gray-200 rounded-lg"></div>
            </div>
          </div>
        </AppLayout>
      )
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
        <RiderWalletInfo 
        wallet={riderWallet} 
        />
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

      {/* Refresh Button (Optional) */}
        <button
          onClick={refreshData}
          className="fixed bottom-6 right-6 bg-indigo-600 text-white p-3 rounded-full shadow-lg hover:bg-indigo-700 transition-colors"
          title="Refresh Data"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
            />
          </svg>
        </button>
    </div>
    </AppLayout>
  );
};