import { AppLayout } from '@/components/AppLayout'
import { CustomButton } from '@/components/CustomButton';
import { Table } from '@/components/Table';
import { PasscodeLock } from '@/icon/PasscodeLock';
import { Eye, MessageSquare, Plus, Trash2 } from 'lucide-react';
import React, { useMemo, useState } from 'react'
import { useNavigate } from 'react-router';

const TabButton = ({ label, active, onClick }) => (
  <button
    onClick={onClick}
    className={`px-3 py-2 text-sm font-medium rounded-md transition-colors ${
      active 
        ? 'bg-white text-blue-900 shadow' 
        : 'text-gray-500 hover:text-gray-700'
    }`}
  >
    {label}
  </button>
);

export const CustomerPage = () => {
  const [activeTab, setActiveTab] = useState('all');
  //const [filteredCustomers, setFilteredCustomers] = useState([])
  const navigate = useNavigate()

  const tabs = [
    { id: 'all', label: 'All Customers' },
    { id: 'active', label: 'Active Customers' },
    { id: 'inactive', label: 'Inactive Customers' }
  ];

  const columns = [
    { key: 'fullName', label: 'Full Name' },
    { key: 'email', label: 'Email' },
    { key: 'phoneNumber', label: 'Phone number' },
    { key: 'status', label: 'Status' },
    { key: 'state', label: 'State' }
  ];

  const allCustomers = [
    {
      id: 1,
      fullName: 'Ojemba Taiwo Kudus',
      email: 'ojembakudus@gma...',
      phoneNumber: '0810 000 0000',
      status: 'Active',
      state: 'Lagos State',
      avatar: '/Avatar.png'
    },
    // Duplicate the data
    ...Array(9).fill(null).map((_, index) => ({
      id: index + 2,
      fullName: 'Ojemba Taiwo Kudus',
      email: 'ojembakudus@gma...',
      phoneNumber: '0810 000 0000',
      status: index === 3 || index === 6 ? 'Inactive' : 'Active',
      state: 'Lagos State',
      avatar: '/Avatar.png'
    }))
  ];

  const filteredCustomers = useMemo(() => {
    switch (activeTab) {
      case 'active':
        return allCustomers.filter(customer => customer.status === 'Active');
      case 'inactive':
        return allCustomers.filter(customer => customer.status === 'Inactive');
      default:
        return allCustomers;
    }
  }, [activeTab]);

  const renderCustomCell = (key, value, row) => {
    if (key === 'fullName') {
      return (
        <div className="flex items-center gap-3">
          <img 
            src={row.avatar} 
            alt={value} 
            className="w-8 h-8 rounded-full"
          />
          <span>{value}</span>
        </div>
      );
    }
    else if (key === 'status') {
      const statusColors = {
        'Active': 'border-green-200 text-green-700',
        'Inactive': 'border-red-200 text-red-700',
        'Ongoing': 'border-orange-200 text-orange-700'
      };
      
      return (
        <span className={`px-3 border-2 py-1 rounded-full text-sm ${statusColors[value]}`}>
          {value}
        </span>
      );
    }
    return value;
  };

  const handleViewClick = (row) => {
    console.log('View clicked:', row);
  };


  const handleManageUser = (user) => {
    navigate(`/customers/${user.id}`);
  };

  const handleDeleteClick = (row) => {
    console.log('Delete clicked:', row);
  };

  const ActionButtons = ({ row }) => (
    <div className="flex items-center gap-2">
      <button 
        onClick={() => handleViewClick(row)}
        className="text-indigo-600 hover:text-indigo-800"
      >
        <Eye size={16} />
      </button>
      <button
        onClick={() => handleManageUser(row)}
        className="text-blue-600 hover:text-blue-900 w-full flex items-center justify-center bg-white"
      >
        <PasscodeLock size={18} color={'#23AA26'} />
      </button>
      <button 
        /* onClick={() => onDeleteClick?.(item)} */
        onClick={() => handleDeleteClick(row)}
        className="text-red-600 hover:text-red-900 flex items-center"
      >
        <Trash2 size={16} />
      </button>
    </div>
  );

/*   const renderActions = (row) => (
    <div className="flex items-center gap-4">
      <button 
        onClick={() => handleViewClick(row)}
        className="text-indigo-600 hover:text-indigo-800"
      >
        <Eye size={16} />
      </button>
      <button 
        onClick={() => handleChatClick(row)}
        className="text-green-600 hover:text-green-800"
      >
        <MessageSquare size={16} />
      </button>
      <button 
        onClick={() => handleDeleteClick(row)}
        className="text-red-600 hover:text-red-800"
      >
        <Trash2 size={16} />
      </button>
    </div>
  ); */

  return (
    <AppLayout title="Customer">
    <div className="p-4 sm:p-6 bg-gray-50 min-h-screen">
      <div className="bg-white rounded-lg shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-4 sm:p-6 border-b">
          <div className="mb-4 sm:mb-0 overflow-x-auto">
            <div className="flex gap-2 p-1 bg-gray-100 rounded-lg">
              {tabs.map(tab => (
                <TabButton
                  key={tab.id}
                  label={tab.label}
                  active={activeTab === tab.id}
                  onClick={() => setActiveTab(tab.id)}
                />
              ))}
            </div>
          </div>
          <CustomButton
            onClick={() => console.log('Add New clicked')}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2 bg-blue-900 text-white rounded-lg hover:bg-indigo-700 transition-colors"
          >
            <Plus size={20} />
            <span>Add New</span>
          </CustomButton>
        </div>

        <div className="overflow-x-auto">
          <Table
            columns={columns}
            data={filteredCustomers}
            renderCustomCell={renderCustomCell}
            showSearch={false}
            itemsPerPage={10}
            showManage={true}
            showDelete={true}
            renderActions={(row) => <ActionButtons row={row} />}
          />
        </div>
      </div>
    </div>
  </AppLayout>

  )
}
