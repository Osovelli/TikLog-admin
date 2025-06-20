import React, { useEffect, useState } from 'react';
import { ArrowLeft, Calendar, ChevronDown, MapPin } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { ProfileForm } from '@/components/ProfileForm';
import { ProfileHeader } from '@/components/ProfileHeader';
import { CustomerDeliveries } from '@/components/_CustomerComponents/CustomerDeliveries';
import { CustomerWalletInfo } from '@/components/_CustomerComponents/CustomerWalletInfo';
import useUserStore from '@/store/UserStore';
import { AppLayout } from '@/components/AppLayout';

export const CustomerInfo = ({ customerId }) => {
  const location = useLocation();
  const userid = location.pathname.split('/').pop();
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
    isActive: null,
  });


  const { getUserById, activateUser, deactivateUser, loading } = useUserStore()

  // Fetch user data when component mounts
  useEffect(() => {
    console.log('Fetching user data for ID:', userid);
    console.log(typeof userid, userid);
    console.log("FORMDATA:", formData)
    const fetchUserData = async() => {
      try {
        const userData = await getUserById(userid);
        if (userData) {
          setFormData({
            firstName: userData.firstname || 'Ojemba',
            lastName: userData.lastname || 'Taiwo-Kudus',
            email: userData.email || 'user@tiklog.com',
            phone: userData.phone_number || '8100441503',
            countryCode: userData.country_code || '+234',
            birthDate: userData.date_of_birth || '22-02-2022',
            gender: userData.gender || 'Male',
            address: userData.address || '56 Opebi road, Sabo Yaba.',
            isActive: userData.status || false,
          });
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };
    fetchUserData();
  }, [getUserById, userid]);


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
      await activateUser(userid)  
    } catch (error) {
      console.error('Error activating user:', error);
    }
  }

  const handleDeactivateUser = async () => {
    try {
      console.log('deactivating user...');
      await deactivateUser(userid);
      // Optionally, you can update the local state to reflect the change
      /* setFormData(prev => ({
        ...prev,
        isActive: false
      })); */
    } catch (error) {
      console.error('Error deactivating user:', error);
    }
  }

  return (
    <AppLayout showBackButton={false} showAppHeader={true}>
    <div className="min-h-screen bg-gray-50 md:px-6">
      {/* Header */}
      {/* <div className="mb-8">
        <Link 
          to="/customers" 
          className="inline-flex items-center text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          <span>Back</span>
        </Link>
      </div> */}

      {/* Profile Header */}
      <ProfileHeader
        name={`${formData.firstName} ${formData.lastName}`}
        email={formData.email}
        imageUrl={"/Avatar2.png"}
        isActive={formData.isActive}
        onActivate={handleActivateUser}
        onDeactivate={handleDeactivateUser}
      />

      {/* <div className="bg-yellow-400 rounded-lg p-6 mb-6">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-4">
            <img
              src="/placeholder.svg?height=80&width=80"
              alt="Profile"
              className="w-20 h-20 rounded-full"
            />
            <div>
              <h1 className="text-2xl font-semibold text-gray-900">
                {formData.firstName} {formData.lastName}
              </h1>
              <p className="text-gray-500">{formData.email}</p>
            </div>
          </div>
          <div className="space-x-4">
            <button className="px-4 py-2 text-red-600 border border-red-200 rounded-lg hover:bg-red-50">
              Deactivate user
            </button>
            <button className="px-4 py-2 text-white bg-indigo-600 rounded-lg hover:bg-indigo-700">
              Activate user
            </button>
          </div>
        </div>
      </div>
 */}
      {/* Navigation Tabs */}
      <div className="my-4">
        <nav className="flex gap-8">
          {[
            { id: 'profile', label: 'Profile Information' },
            { id: 'deliveries', label: 'All Deliveries' },
            { id: 'wallet', label: 'Wallet Information' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`pb-4 px-1 ${
                activeTab === tab.id
                  ? 'text-indigo-600 border-b-2 border-indigo-600 font-medium'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Profile Form */}
      {activeTab === 'profile' && (
        <ProfileForm 
          formData={formData}
          onInputChange={handleInputChange}
          onSave={handleSaveChanges}
        />
      )}
      
      {/* Deliveries */}
      {activeTab === 'deliveries' && (
        <CustomerDeliveries
        />
      )}


      {/* wallet */}
      {activeTab === 'wallet' && (
        <CustomerWalletInfo />
      )}
    </div>
    </AppLayout>
  );
};