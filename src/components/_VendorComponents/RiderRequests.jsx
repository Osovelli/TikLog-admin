import React, { useEffect, useState } from 'react';
import { Eye, Trash2 } from 'lucide-react';
import { Table } from '../Table';
import { PasscodeLock } from '@/icon/PasscodeLock';
import useUserStore from '@/store/UserStore';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';

export const Riders = ({ vendorId }) => {
  const { getVendorRiderById, loading } = useUserStore();
  const [ridersData, setRidersData] = useState([]);

  const columns = [
    { key: 'fullName', label: 'Full Name' },
    { key: 'email', label: 'Email' },
    { key: 'phoneNumber', label: 'Phone number' },
    { key: 'status', label: 'Status' },
    { key: 'address', label: 'Address' }
  ];

  useEffect(() => {
    const fetchRiders = async () => {
      if (!vendorId) return

      try {
        const response = await getVendorRiderById(vendorId);
        console.log("Fetched Riders:", response);

        // Handle both response.data and direct array
        const riders = response?.data || response || []

        if (Array.isArray(riders)) {
          const transformedRiders = riders.map((rider) => ({
            id: rider._id,
            fullName: [rider.firstname, rider.othername, rider.lastname]
              .filter(Boolean)
              .join(' '),
            email: rider.email || 'N/A',
            phoneNumber: rider.phone
              ? `${rider.countryCode || ''} ${rider.phone}`.trim()
              : 'N/A',
            status: rider.status || 'N/A',
            address: rider.address || 'N/A',
            avatar: rider.profileImage?.url || '/default-avatar.png',
            isVerified: rider.isVerified,
            isOnline: rider.isOnline,
            nationality: rider.nationality,
            kycLevel: rider.kycLevel,
            originalData: rider, // Keep reference for actions
          }));
          setRidersData(transformedRiders);
        }
      } catch (error) {
        console.error("Error fetching vendor riders:", error);
      }
    };

    fetchRiders();
  }, [getVendorRiderById, vendorId]);

  const renderCustomCell = (key, value, row) => {
    if (key === 'fullName') {
      return (
        <div className="flex items-center gap-3">
          <div className="relative">
            {/* <img
              src={row.avatar || 'generic-avatar.png'}
              alt={value}
              className="w-8 h-8 rounded-full object-cover"
            /> */} 
            <Avatar className="relative" width={12} height={12}>
              <AvatarImage src={row.avatar || '/default-avatar.png'} alt={value} />
              <AvatarFallback className="bg-gray-200 text-gray-700">{value.charAt(0)}</AvatarFallback>
            </Avatar>

            {/* Online indicator */}
            {row.isOnline && (
              <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 border-2 border-white rounded-full" />
            )}
          </div>
          <div>
            <span className="font-medium line-clamp-1">{value}</span>
            {row.kycLevel && row.kycLevel !== 'none' && (
              <span className="text-xs text-blue-600 capitalize">{row.kycLevel}</span>
            )}
          </div>
        </div>
      );
    }
    if (key === 'email') {
      return <span className="line-clamp-1" title={value}>{value}</span>;
    }
    if (key === 'status') {
      const statusStyles = {
        activated: 'bg-green-50 text-green-700',
        pending: 'bg-yellow-50 text-yellow-700',
        deactivated: 'bg-red-50 text-red-700',
        suspended: 'bg-gray-100 text-gray-700',
      }
      const style = statusStyles[value?.toLowerCase()] || 'bg-gray-100 text-gray-700'

      return (
        <span className={`px-3 py-1 rounded-full text-sm capitalize ${style}`}>
          {value}
        </span>
      );
    }
    if (key === 'address') {
      return <span className="line-clamp-1" title={value}>{value}</span>;
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
        title="View"
      >
        <Eye size={16} />
      </button>
      <button
        onClick={() => handleMessageClick(row)}
        className="text-green-600 hover:text-green-800"
        title="Message"
      >
        <PasscodeLock size={16} color={'#23AA26'} />
      </button>
      <button
        onClick={() => handleDeleteClick(row)}
        className="text-red-600 hover:text-red-800"
        title="Delete"
      >
        <Trash2 size={16} />
      </button>
    </div>
  );

  if (ridersData.length === 0 && !loading) {
    return (
      <div className="flex items-center justify-center h-48">
        <span className="text-gray-600">No riders found.</span>
      </div>
    );
  }

  return (
    <div className="space-y-6 bg-white p-6 rounded-lg">
      {loading ? (
        <div className="flex items-center justify-center h-48">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
          <span className="ml-2 text-gray-600">Loading riders...</span>
        </div>
      ) : (
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
      )}
    </div>
  );
};