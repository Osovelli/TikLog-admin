import React, { useCallback, useEffect, useState } from 'react';
import { ProfileForm } from '@/components/ProfileForm';
import { ProfileHeader } from '@/components/ProfileHeader';
import { Swiper, SwiperSlide } from 'swiper/react';
import { FreeMode } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/free-mode';
import { OrganisationInfo } from '@/components/_VendorComponents/OrganisationInfo';
import { Riders } from '@/components/_VendorComponents/RiderRequests';
import { VendorWalletInfo } from '@/components/_VendorComponents/VendorWalletInfo';
import { LicenseForm } from '@/components/_VendorComponents/LicenseInfo';
import { VehiclesInfo } from '@/components/_VendorComponents/VehicleInfo';
import { Requests } from '@/components/_VendorComponents/AllRequests';
import useUserStore from '@/store/UserStore';
import { useLocation } from 'react-router';
import { AppLayout } from '@/components/AppLayout';

export const VendorInfo = ({ customerId }) => {
  const location = useLocation();
  const vendorId = location.pathname.split('/').pop();
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
    businessName: '',
    businessType: "",
    businessRegNumber: ''
  });
  const [vendorDeliveries, setVendorDeliveries] = useState([]);
  const [vendorWallet, setVendorWallet] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  const tabs = [
    { id: 'profile', label: 'Profile Information' },
    { id: 'organisation', label: 'Organisation Info'},
    { id: 'requests', label: 'All Requests' },
    { id: 'wallet', label: 'Wallet Information' },
    { id: 'license', label: 'License Information' },
    { id: 'vehicles', label: 'All Vehicles' },
    { id: 'riders', label: 'Riders' },
  ]

  const { 
    getVendorById, 
    activateVendor, 
    deactivateVendor,
    getVendorDeliveriesById,
    getUserWalletById, 
    loading 
  } = useUserStore();

  // Fetch user data when component mounts
  /* useEffect(() => {
    console.log('Fetching user data for ID:', vendorId);
    console.log(typeof vendorId, vendorId);
    const fetchVendorData = async () => { 
      try {
        const vendorData = await getVendorById(vendorId);
        if (vendorData) {
          setFormData({
            firstName: vendorData.firstname || 'James',
            lastName: vendorData.lastname || 'Okpeba',
            email: vendorData.email || 'user@tiklog.com',
            phone: vendorData.phone_number || '8100441503',
            countryCode: vendorData.country_code || '+234',
            birthDate: vendorData.date_of_birth || '22-02-2022',
            gender: vendorData.gender || 'Male',
            address: vendorData.address || '56 Opebi road, Sabo Yaba.',
            startDate: vendorData.start_date || '22-02-2022',
            expiryDate: vendorData.expiry_date || '22-02-2022',
            businessName: vendorData.business_name || 'ABC Inc',
            businessType: vendorData.business_type || "Logistics",
            businessRegNumber: vendorData.business_reg_number || '103222455'
          });
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };
    fetchVendorData();
  }, [getVendorById, vendorId]); */

  // Memoized fetch functions to prevent unnecessary re-renders
  // Fetch user data when component mounts
  const fetchVendorData = useCallback(async () => {
    console.log('Fetching user data for ID:', vendorId);
    console.log(typeof vendorId, vendorId);
    try {
      setIsLoading(true)
      const vendorData = await getVendorById(vendorId);
      
      if (vendorData) {
      setFormData({
        firstName: vendorData.firstname || 'James',
        lastName: vendorData.lastname || 'Okpeba',
        email: vendorData.email || 'user@tiklog.com',
        phone: vendorData.phone_number || '8100441503',
        countryCode: vendorData.country_code || '+234',
        birthDate: vendorData.date_of_birth || '22-02-2022',
        gender: vendorData.gender || 'Male',
        address: vendorData.address || '56 Opebi road, Sabo Yaba.',
        startDate: vendorData.start_date || '22-02-2022',
        expiryDate: vendorData.expiry_date || '22-02-2022',
        businessName: vendorData.business_name || 'ABC Inc',
        businessType: vendorData.business_type || "Logistics",
        businessRegNumber: vendorData.business_reg_number || '103222455'
      });
    }
    } catch (error) {
      console.error("Error fetching vendor data:", error)
    } finally {
      setIsLoading(false)
    }
  }, [getVendorById, vendorId])

  //fetch Rider deliveries data
    const fetchVendorDeliveries = useCallback(async () => {
        try {
          const data = await getVendorDeliveriesById(vendorId)
          console.log("Vendor Deliveries Response: ", data)
          if (data?.data) {
            setVendorDeliveries(data.data)
          }
        } catch (error) {
          console.error("Error fetching vendor deliveries:", error)
          setVendorDeliveries([])
        }
      }, [getVendorDeliveriesById, vendorId])
  
    //fetch Rider wallet data
     const fetchVendorWallet = useCallback(async () => {
        try {
          const data = await getUserWalletById(vendorId)
          console.log("Vendor Wallet Response: ", data)
          if (data?.data) {
            setVendorWallet(data.data)
          }
        } catch (error) {
          console.error("Error fetching vendor wallet info:", error)
          setVendorWallet([])
        }
      }, [getUserWalletById, vendorId])
  
    // Fetch all data when component mounts or userid changes
      useEffect(() => {
        if (vendorId) {
          fetchVendorData()
          fetchVendorDeliveries()
          fetchVendorWallet()
        }
      }, [vendorId, fetchVendorData, fetchVendorDeliveries, fetchVendorWallet])

  // Handle input changes for profile and organisation forms
  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    console.log(formData)
  };

  const handleDropdownChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    console.log(`Dropdown changed: ${field} = ${value}`);
  };

  const handleSaveChanges = () => {
    console.log('Saving changes:', formData);
  };

  const handleActivateVendor = async () => {
    try {
      console.log('activating vendor...');
      await activateVendor(vendorId)  
    } catch (error) {
      console.error('Error activating Vendor:', error);
    }
  }

  const handleDeactivateVendor = async () => {
    try {
      console.log('deactivating vendor...');
      await deactivateVendor(vendorId);
      // Optionally, you can update the local state to reflect the change
      /* setFormData(prev => ({
        ...prev,
        isActive: false
      })); */
    } catch (error) {
      console.error('Error deactivating vendor:', error);
    }
  }

  // Refresh data function for manual refresh
      const refreshData = useCallback(() => {
        fetchVendorData()
        fetchVendorDeliveries()
        fetchVendorWallet()
      }, [fetchVendorData, fetchVendorDeliveries, fetchVendorWallet])
    
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
        onActivate={handleActivateVendor}
        onDeactivate={handleDeactivateVendor}
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

      {/* Profile Form */}
      {activeTab === 'profile' && (
        <ProfileForm 
          formData={formData}
          onInputChange={handleInputChange}
          onSave={handleSaveChanges}
        />
      )}

      {/* organisation Form */}
      {activeTab === 'organisation' && (
        <OrganisationInfo 
        formData={formData}
        onDropdownChange={handleDropdownChange}
        onInputChange={handleInputChange}
        onSave={handleSaveChanges}
        />
      )}

      {/*Requests*/}
      {activeTab === 'requests' && (
        <Requests 
          deliveries={vendorDeliveries}  
        />
      )}

      {/* wallet */}
      {activeTab === 'wallet' && (
        <VendorWalletInfo wallet={vendorWallet} />
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
        <VehiclesInfo 
        />
      )}

      {/* Deliveries */}
      {activeTab === 'riders' && (
        <Riders />
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