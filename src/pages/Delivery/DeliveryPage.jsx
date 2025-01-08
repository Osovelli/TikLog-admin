import React, { useState, useMemo } from 'react';
import { Eye } from 'lucide-react';
import { Table } from '@/components/Table';
import { AppLayout } from '@/components/AppLayout';
import { useNavigate } from 'react-router';

const TabButton = ({ label, active, onClick }) => (
  <button
    onClick={onClick}
    className={`px-4 py-2 text-sm font-medium transition-colors rounded-lg ${
      active 
        ? 'bg-white shadow' 
        : 'text-gray-500 hover:text-gray-700'
    }`}
  >
    {label}
  </button>
);

export const DeliveryPage = () => {
  const [activeTab, setActiveTab] = useState('all');
  const navigate = useNavigate()

  const columns = [
    { key: 'vendorName', label: 'Vendor name' },
    { key: 'customerName', label: 'Customer Name' },
    { key: 'rider', label: 'Rider' },
    { key: 'date', label: 'Date' },
    { key: 'status', label: 'Status' }
  ];

  const deliveriesData = [
    {
      id: 1,
      vendorName: '#1234567890',
      customerName: 'Ojemba Taiwo-Kudus',
      rider: 'Joshua Ejembi',
      date: 'Dec 6, 2024 12:45:59',
      status: 'Ongoing'
    },
    {
      id: 2,
      vendorName: '#1234567890',
      customerName: 'Ojemba Taiwo-Kudus',
      rider: 'Joshua Ejembi',
      date: 'Dec 6, 2024 12:45:59',
      status: 'Successful'
    },
    ...Array(3).fill(null).map((_, index) => ({
      id: index + 3,
      vendorName: '#1234567890',
      customerName: 'Ojemba Taiwo-Kudus',
      rider: 'Joshua Ejembi',
      date: 'Dec 6, 2024 12:45:59',
      status: 'Ongoing'
    })),
    ...Array(4).fill(null).map((_, index) => ({
      id: index + 6,
      vendorName: '#1234567890',
      customerName: 'Ojemba Taiwo-Kudus',
      rider: 'Joshua Ejembi',
      date: 'Dec 6, 2024 12:45:59',
      status: 'Cancelled'
    })),
    {
      id: 10,
      vendorName: '#1234567890',
      customerName: 'Ojemba Taiwo-Kudus',
      rider: 'Joshua Ejembi',
      date: 'Dec 6, 2024 12:45:59',
      status: 'Successful'
    }
  ];

  const filteredData = useMemo(() => {
    switch (activeTab) {
      case 'ongoing':
        return deliveriesData.filter(delivery => delivery.status === 'Ongoing');
      case 'completed':
        return deliveriesData.filter(delivery => delivery.status === 'Successful');
      case 'cancelled':
        return deliveriesData.filter(delivery => delivery.status === 'Cancelled');
      default:
        return deliveriesData;
    }
  }, [activeTab]);

  const renderCustomCell = (key, value, row) => {
    if (key === 'customerName' || key === 'rider') {
      return <span className="text-indigo-600">{value}</span>;
    }
    if (key === 'status') {
      return (
        <span className={`px-3 py-1 rounded-full text-sm ${
          value === 'Successful' 
            ? 'bg-green-50 text-green-700' 
            : value === 'Ongoing'
            ? 'bg-orange-50 text-orange-700'
            : 'bg-red-50 text-red-700'
        }`}>
          {value}
        </span>
      );
    }
    return value;
  };

  const handleViewClick = (row) => {
    navigate(`/deliveries/${row.id}`)
    console.log('View delivery:', row);
  };

  const ActionButtons = ({ row }) => (
    <button 
      onClick={(e) => {
        e.stopPropagation(); // Prevent row click from triggering
        handleViewClick(row);
      }}
      className="text-indigo-600 hover:text-indigo-800"
    >
      <Eye size={16} />
    </button>
  );

  const tabs = [
    { id: 'all', label: 'All Deliveries' },
    { id: 'ongoing', label: 'Ongoing Deliveries' },
    { id: 'completed', label: 'Completed Deliveries' },
    { id: 'cancelled', label: 'Canceled Transactions' }
  ];

  return (
    <AppLayout title={"Deliveries Management"}>
    <div className="space-y-6 bg-white p-8 rounded-lg">
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

      <Table
        name={"Deliveries"}
        columns={columns}
        data={filteredData}
        renderCustomCell={renderCustomCell}
        showSearch={false}
        itemsPerPage={10}
        className="mt-4"
        onRowClick={handleViewClick}
        renderActions={(row) => <ActionButtons row={row} />}
      />
    </div>
    </AppLayout>
  );
};
