import React, { useEffect, useState } from 'react';
import { ProfileForm } from '@/components/ProfileForm';
import { ProfileHeader } from '@/components/ProfileHeader';
import { Swiper, SwiperSlide } from 'swiper/react';
import { FreeMode } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/free-mode';
import { OrganisationInfo } from '@/components/_VendorComponents/OrganisationInfo';
import { Riders } from '@/components/_VendorComponents/RiderRequests';
import { RiderWalletInfo } from '@/components/_VendorComponents/RiderWalletInfo';
import { LicenseForm } from '@/components/_VendorComponents/LicenseInfo';
import { VehiclesInfo } from '@/components/_VendorComponents/VehicleInfo';
import { Requests } from '@/components/_VendorComponents/AllRequests';
import useUserStore from '@/store/UserStore';
import { useLocation } from 'react-router';

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

  const tabs = [
    { id: 'profile', label: 'Profile Information' },
    { id: 'organisation', label: 'Organisation Info'},
    { id: 'requests', label: 'All Requests' },
    { id: 'wallet', label: 'Wallet Information' },
    { id: 'license', label: 'License Information' },
    { id: 'vehicles', label: 'All Vehicles' },
    { id: 'riders', label: 'Riders' },
  ]

  const { getVendorById, activateVendor, deactivateVendor, loading } = useUserStore();

  // Fetch user data when component mounts
  useEffect(() => {
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
  }, [getVendorById, vendorId]);

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

  return (
    <div className="min-h-screen bg-gray-50 p-6">

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
        <Requests />
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

      {/* Deliveries */}
      {activeTab === 'riders' && (
        <Riders />
      )}
    </div>
  );
};