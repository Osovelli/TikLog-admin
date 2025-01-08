import React, { useState } from 'react';
import { Plus, MessageSquare, ChevronLeft, ChevronRight } from 'lucide-react';
import { Table } from '../Table';
import { CustomButton } from '../CustomButton';

export const CustomersTable = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = 10; // This would typically come from your backend

  const columns = [
    { key: 'fullName', label: 'Full Name' },
    { key: 'email', label: 'Email' },
    { key: 'phoneNumber', label: 'Phone number' },
    { key: 'status', label: 'Status' },
    { key: 'state', label: 'State' }
  ];

  const customersData = [
    {
      id: 1,
      fullName: 'Ojemba Taiwo Kudus',
      email: 'ojembakudus@gma...',
      phoneNumber: '0810 000 0000',
      status: 'Active',
      state: 'Lagos State',
      avatar: '/Avatar.png'
    },
    // Duplicate the data to match the image
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
    return value;
  };

  const handleViewClick = (row) => {
    console.log('View clicked:', row);
  };

  const handleAddNew = () => {
    console.log('Add new clicked');
  };

  const ActionButtons = ({ row }) => (
    <div className="flex items-center gap-2">
      <button 
        onClick={() => handleViewClick(row)}
        className="text-indigo-600 hover:text-indigo-800"
      >
        <MessageSquare size={16} />
      </button>
    </div>
  );

  return (
    <div className="space-y-6 bg-white p-6 rounded-lg">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold text-gray-900">Customers</h2>
        <CustomButton
          onClick={handleAddNew}
          buttonVariant={"primary"}
          className=" text-white rounded-xl  transition-colors px-8 py-6"
        >
          <Plus size={20} />
          <span>Add New</span>
        </CustomButton>
      </div>

      <Table
        columns={columns}
        data={customersData}
        name={'Customers'}
        renderCustomCell={renderCustomCell}
        showSearch={false}
        showPasscode={true}
        showDelete={true}
        itemsPerPage={10}
        className="mt-4"
        onRowClick={handleViewClick}
        renderActions={(row) => <ActionButtons row={row} />}
      />
    </div>
  );
};