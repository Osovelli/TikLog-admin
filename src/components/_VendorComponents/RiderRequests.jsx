import React from 'react';
import { Eye, MessageSquare, Trash2 } from 'lucide-react';
import { Table } from '../Table';
import { PasscodeLock } from '@/icon/PasscodeLock';

export const Riders = () => {
  const columns = [
    { key: 'fullName', label: 'Full Name' },
    { key: 'email', label: 'Email' },
    { key: 'phoneNumber', label: 'Phone number' },
    { key: 'status', label: 'Status' },
    { key: 'state', label: 'State' }
  ];

  const ridersData = [
    {
      id: 1,
      fullName: 'James Okbepa',
      email: 'jamesokbepa@gmai...',
      phoneNumber: '0810 000 0000',
      status: 'Active',
      state: 'Lagos State',
      avatar: '/Avatar3.png'
    },
    ...Array(4).fill(null).map((_, index) => ({
      id: index + 2,
      fullName: 'James Okbepa',
      email: 'jamesokbepa@gmai...',
      phoneNumber: '0810 000 0000',
      status: 'Active',
      state: 'Lagos State',
      avatar: '/Avatar3.png'
    })),
    {
      id: 6,
      fullName: 'James Okbepa',
      email: 'jamesokbepa@gmai...',
      phoneNumber: '0810 000 0000',
      status: 'Inactive',
      state: 'Lagos State',
      avatar: '/Avatar3.png'
    }
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
    if (key === 'status') {
      return (
        <span className={`px-3 py-1 rounded-full text-sm ${
          value === 'Active' 
            ? 'bg-green-50 text-green-700' 
            : 'bg-red-50 text-red-700'
        }`}>
          {value}
        </span>
      );
    }
    return value;
  };

  const handleViewClick = (row) => {
    console.log('View clicked:', row);
  };

  const handleMessageClick = (row) => {
    console.log('Message clicked:', row);
  };

  const handleDeleteClick = (row) => {
    console.log('Delete clicked:', row);
  };

  const ActionButtons = ({ row }) => (
    <div className="flex items-center gap-4">
      <button 
        onClick={() => handleViewClick(row)}
        className="text-indigo-600 hover:text-indigo-800"
      >
        <Eye size={16} />
      </button>
      <button 
        onClick={() => handleMessageClick(row)}
        className="text-green-600 hover:text-green-800"
      >
        <PasscodeLock size={16} color={'#23AA26'} />
      </button>
      <button 
        onClick={() => handleDeleteClick(row)}
        className="text-red-600 hover:text-red-800"
      >
        <Trash2 size={16} />
      </button>
    </div>
  );

  return (
    <div className="space-y-6 bg-white p-6 rounded-lg">
      <Table
        name={'Riders'}
        columns={columns}
        data={ridersData}
        renderCustomCell={renderCustomCell}
        showSearch={false}
        itemsPerPage={10}
        className="mt-4"
        onRowClick={handleViewClick}
        renderActions={(row) => <ActionButtons row={row} />}
      />
    </div>
  );
};