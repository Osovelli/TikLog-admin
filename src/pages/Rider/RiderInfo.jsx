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
    status: null,
    driversLicense: null,
  });
  const [riderDeliveries, setRiderDeliveries] = useState([]);
  const [riderWallet, setRiderWallet] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false)

  const tabs = [
    { id: 'profile', label: 'Profile Information' },
    { id: 'requests', label: 'All Requests' },
    { id: 'wallet', label: 'Wallet Information' },
    { id: 'license', label: 'License Information' },
    { id: 'vehicles', label: 'All Vehicles' },
  ]

  const { 
    getRiderById,
    singleRider: riderInfo,
    updateRider,
    activateRider, 
    deactivateRider,
    getRiderDeliveriesById,
    getUserWalletById,
    getRiderWalletById,
    loading,
    getVendorVehicleById,
  } = useUserStore();

  useEffect(() => {
    /* console.log("Fetching rider data for ID:", riderId)
    console.log(typeof userid, riderId) */
    getVendorVehicleById(riderId)
  }, [riderId])

  // Helper function to normalize status
  const normalizeStatus = (status) => {
    if (typeof status === "string") {
      const lowerStatus = status.toLowerCase()
      if (lowerStatus === "activated") return "active"
      if (lowerStatus === "deactivated") return "inactive"
      if (lowerStatus === "pending") return "pending"
    }
    if (status === true) return "active"
    if (status === false) return "inactive"
    return "pending" // Default fallback
  }

  // Memoized fetch functions to prevent unnecessary re-renders

  // Fetch user data when component mounts
  const fetchRiderData = useCallback(async () => {
      try {
        setIsLoading(true)
        const riderData = await getRiderById(riderId);
         //console.log("Riders Details Response: ", riderData)
        
        if (riderData) {
          setFormData({
            firstName: riderData.firstname || '',
            lastName: riderData.lastname || '',
            email: riderData.email || '',
            phone: riderData.phone || '',
            countryCode: riderData.country_code || '',
            birthDate: riderData.dob || '',
            gender: riderData.gender || 'Male',
            address: riderData.address || '56 Opebi road, Sabo Yaba.',
            startDate: riderData.start_date || '22-02-2022',
            expiryDate: riderData.expiry_date || '22-02-2022',
            avatar: riderData.profileImage?.url || '',
            status: normalizeStatus(riderData.status),
            driversLicense: riderData.driver_license || null,
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
        const data = await getRiderDeliveriesById(riderId)
        console.log("Rider Deliveries Response: ", data)
        if (data?.data) {
          setRiderDeliveries(data.data)
        }
      } catch (error) {
        console.error("Error fetching rider deliveries:", error)
        setRiderDeliveries([])
      }
    }, [getRiderDeliveriesById, riderId])

  //fetch Rider wallet data
   const fetchRiderWallet = useCallback(async () => {
      try {
        const data = await getRiderWalletById(riderId)
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
  const handleSaveChanges = async() => {
    console.log('Saving changes:', formData);
    await updateRider(riderId, formData)
  };

  //activates rider status 
  const handleActivateUser = async () => {
    try {
      setIsUpdatingStatus(true)
      console.log("Activating Rider...")
      await activateRider(riderId)

      // Update local state immediately for better UX
      setFormData((prev) => ({
        ...prev,
        status: "active", // Set status to active
      }))

      // Refresh user data to get the latest status from server
      await fetchRiderData()
    } catch (error) {
      console.error("Error activating rider:", error)
      // Revert local state if API call failed
      /* setFormData((prev) => ({
        ...prev,
        isActive: false,
      })) */
     await fetchRiderData()
    } finally {
      setIsUpdatingStatus(false)
    }
  }


  //deactivates rider status
  const handleDeactivateUser = async () => {
    try {
      setIsUpdatingStatus(true)
      console.log("Deactivating rider...")
      await deactivateRider(riderId)

      // Update local state immediately for better UX
      setFormData((prev) => ({
        ...prev,
        status: "inactive", // Set status to inactive
      }))

      // Refresh user data to get the latest status from server
      await fetchRiderData()
    } catch (error) {
      console.error("Error deactivating rider:", error)
      // Revert local state if API call failed
      /* setFormData((prev) => ({
        ...prev,
        status: "inactive", // Set status to inactive
      })) */
     await fetchRiderData()
    } finally {
      setIsUpdatingStatus(false)
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

    console.log("Rider Deliveries: ", riderDeliveries)

  return (
    <AppLayout showBackButton={false}>
    <div className="min-h-screen bg-gray-50 md:px-6">

      {/* Profile Header */}
      <ProfileHeader
        info={riderInfo}
        name={`${formData.firstName} ${formData.lastName}`}
        email={formData.email}
        imageUrl={formData.avatar}
        status={formData.status}
        onActivate={handleActivateUser}
        onDeactivate={handleDeactivateUser}
        loading={isUpdatingStatus}
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
            <SwiperSlide key={tab.id} className="w-auto px-4 sm:px-6">
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
        <RiderRequests
         deliveries={riderDeliveries} 
        />
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
          formData={formData?.driversLicense}
          onInputChange={handleInputChange}
          onSave={handleSaveChanges}
          loading={loading}
         />
      )}


      {/* wallet */}
      {activeTab === 'vehicles' && (
        <VehiclesInfo riderId={riderId} />
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