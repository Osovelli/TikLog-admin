import React, { useCallback, useEffect, useState } from 'react';
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
  const [userDeliveries, setUserDeliveries] = useState([]);
  const [userWallet, setUserWallet] = useState([])
  const [isLoading, setIsLoading] = useState(true)


  const { getUserById, 
    activateUser, 
    deactivateUser, 
    loading, 
    getUserDeliveriesById, 
    getUserWalletById
   } = useUserStore()

  // Fetch user data when component mounts
  /* useEffect(() => {
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
  }, [getUserById, userid]); */

  // Memoized fetch functions to prevent unnecessary re-renders
  const fetchUserData = useCallback(async () => {
    try {
      setIsLoading(true)
      const userData = await getUserById(userid)
      if (userData) {
        setFormData({
          firstName: userData.firstname || "Ojemba",
          lastName: userData.lastname || "Taiwo-Kudus",
          email: userData.email || "user@tiklog.com",
          phone: userData.phone_number || "8100441503",
          countryCode: userData.country_code || "+234",
          birthDate: userData.date_of_birth || "22-02-2022",
          gender: userData.gender || "Male",
          address: userData.address || "56 Opebi road, Sabo Yaba.",
          isActive: userData.status || false,
        })
      }
    } catch (error) {
      console.error("Error fetching user data:", error)
    } finally {
      setIsLoading(false)
    }
  }, [getUserById, userid])


  //fetch user deliveries
  /* useEffect(() => {
    console.log('Fetching user deliveries for ID:', userid);
    console.log(typeof userid, userid);
    const fetchUserDeliveries = async() => {
      try {
        const data = await getUserDeliveriesById(userid);
        console.log("user DeliverieS: ", data)
        if (data) {
          setUserDeliveries(data);
          console.log("USER DELIVERIES: ", userDeliveries)
        }
      } catch (error) {
        console.error('Error fetching user deliveries:', error);
      }
    };
    fetchUserDeliveries();
  }, [getUserDeliveriesById, userid]); */

  const fetchUserDeliveries = useCallback(async () => {
    try {
      const data = await getUserDeliveriesById(userid)
      console.log("User Deliveries Response: ", data)
      if (data?.data) {
        setUserDeliveries(data.data)
      }
    } catch (error) {
      console.error("Error fetching user deliveries:", error)
      setUserDeliveries([])
    }
  }, [getUserDeliveriesById, userid])


  //fetch user wallet info
  /* useEffect(() => {
    console.log('Fetching user wallet info for ID:', userid);
    console.log(typeof userid, userid);
    const fetchUserWallet = async() => {
      try {
        const data = await getUserWalletById(userid);
        console.log("User Wallet: ", data)
        if (data) {
          setUserWallet(data);
          console.log("USER WALLET: ", userWallet)
        }
      } catch (error) {
        console.error('Error fetching user wallet info:', error);
      }
    };
    fetchUserWallet();
  }, [getUserWalletById, userid]); */
  
  const fetchUserWallet = useCallback(async () => {
    try {
      const data = await getUserWalletById(userid)
      console.log("User Wallet Response: ", data)
      if (data?.data) {
        setUserWallet(data.data)
      }
    } catch (error) {
      console.error("Error fetching user wallet info:", error)
      setUserWallet([])
    }
  }, [getUserWalletById, userid])

  // Fetch all data when component mounts or userid changes
  useEffect(() => {
    if (userid) {
      fetchUserData()
      fetchUserDeliveries()
      fetchUserWallet()
    }
  }, [userid, fetchUserData, fetchUserDeliveries, fetchUserWallet])


  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSaveChanges = () => {
    console.log('Saving changes:', formData);
  };

  // Handle activation and deactivation
  const handleActivateUser = async () => {
    try {
      console.log('activating user...');
      await activateUser(userid)  
      // Refresh user data after activation
      await fetchUserData()
    } catch (error) {
      console.error('Error activating user:', error);
    }
  }

  // Handle activation and deactivation
  const handleDeactivateUser = async () => {
    try {
      console.log('deactivating user...');
      await deactivateUser(userid);
       // Refresh user data after deactivation
      await fetchUserData()
    } catch (error) {
      console.error('Error deactivating user:', error);
    }
  }

  // Refresh data function for manual refresh
  const refreshData = useCallback(() => {
    fetchUserData()
    fetchUserDeliveries()
    fetchUserWallet()
  }, [fetchUserData, fetchUserDeliveries, fetchUserWallet])

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
        <nav className="flex gap-8 px-3">
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
          deliveries={userDeliveries}
        />
      )}


      {/* wallet */}
      {activeTab === 'wallet' && (
        <CustomerWalletInfo
          wallet={userWallet}
        />
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