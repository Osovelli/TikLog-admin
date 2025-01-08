import React, { useState } from 'react';
import { ArrowLeft, Calendar, ChevronDown, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';
import { ProfileForm } from '@/components/ProfileForm';
import { ProfileHeader } from '@/components/ProfileHeader';
import { CustomerDeliveries } from '@/components/_CustomerComponents/CustomerDeliveries';
import { CustomerWalletInfo } from '@/components/_CustomerComponents/CustomerWalletInfo';

export const CustomerInfo = ({ customerId }) => {
  const [activeTab, setActiveTab] = useState('profile');
  const [formData, setFormData] = useState({
    firstName: 'Ojemba',
    lastName: 'Taiwo-Kudus',
    email: 'user@tiklog.com',
    phone: '8100441503',
    countryCode: '+234',
    birthDate: '22-02-2022',
    gender: 'Male',
    address: '56 Opebi road, Sabo Yaba.'
  });

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
        name="Ojemba Taiwo-Kudus"
        email="user@tiklog.com"
        imageUrl="/Avatar2.png"
        isActive={true}
        onActivate={() => console.log('Activate user')}
        onDeactivate={() => console.log('Deactivate user')}
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
      <div className="border-b mb-6">
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
  );
};