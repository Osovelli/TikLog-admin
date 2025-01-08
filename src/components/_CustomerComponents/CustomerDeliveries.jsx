import React from 'react';
import { Eye } from 'lucide-react';
import { Table } from '../Table';

export const CustomerDeliveries = () => {
  const columns = [
    { key: 'rideId', label: 'Ride ID' },
    { key: 'from', label: 'From' },
    { key: 'to', label: 'To' },
    { key: 'vehicle', label: 'Vehicle' },
    { key: 'passengers', label: ''},
    { key: 'status', label: 'Status' },
    { key: 'fee', label: 'Fee' }
  ];

  const deliveriesData = [
    {
      id: 1,
      rideId: '#123354',
      from: 'Ikeja, Lagos',
      fromDate: 'Dec 6, 2024',
      to: 'Lekki, Lagos',
      toDate: 'Dec 6, 2024',
      vehicle: 'Car',
      passengers: '2',
      status: 'Delivered',
      fee: '1,600'
    },
    {
      id: 2,
      rideId: '#123354',
      from: 'Ikeja, Lagos',
      fromDate: 'Dec 6, 2024',
      to: 'Lekki, Lagos',
      toDate: 'Dec 6, 2024',
      vehicle: 'Car',
      passengers: '2',
      status: 'Cancelled',
      fee: '1,600'
    },
    ...Array(6).fill(null).map((_, index) => ({
      id: index + 3,
      rideId: '#123354',
      from: 'Ikeja, Lagos',
      fromDate: 'Dec 6, 2024',
      to: 'Lekki, Lagos',
      toDate: 'Dec 6, 2024',
      vehicle: 'Car',
      passengers: '2',
      status: 'On Going',
      fee: '1,600'
    }))
  ];

  const renderCustomCell = (key, value, row) => {
    switch (key) {
      case 'from':
        return (
          <div>
            <div>{value}</div>
            <div className="text-sm text-gray-500">{row.fromDate}</div>
          </div>
        );
      case 'to':
        return (
          <div>
            <div>{value}</div>
            <div className="text-sm text-gray-500">{row.toDate}</div>
          </div>
        );
      case 'fee':
        return <span className="text-blue-600">N {value}</span>;
      case 'passengers':
        return <span className="text-gray-500">{value}</span>;
      default:
        return value;
    }
  };

  const handleViewClick = (row) => {
    console.log('View clicked:', row);
  };

  const ActionButtons = ({ row }) => (
    <div className="flex items-center gap-2">
      <button 
        onClick={() => handleViewClick(row)}
        className=" flex items-center gap-1"
      >
        <Eye size={16} />
        <span className='text-indigo-600 hover:text-indigo-800'>View</span>
      </button>
    </div>
  );

  return (
    <div className="space-y-6 bg-white p-6 rounded-lg">
      <Table
        name={"Deliveries"}
        columns={columns}
        data={deliveriesData}
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