import React, { useState } from 'react';
import { Eye, Trash2, ClipboardEdit } from 'lucide-react';
import { Table } from '../Table';
import { VehicleInfoModal } from './VehicleInfoModal';

export const VehiclesInfo = () => {
  const [isVehicleModalOpen, setIsVehicleModalOpen] = useState(false);
  const [selectedVehicle, setSelectedVehicle] = useState(null);

  const columns = [
    { key: 'vehicleType', label: 'Vehicle Type' },
    { key: 'vehicleMake', label: 'Vehicle Make' },
    { key: 'plateNumber', label: 'Plate Number' },
    { key: 'speed', label: 'Speed' },
    { key: 'costPerKm', label: 'Cost per Km' },
    { key: 'status', label: 'Status' }
  ];

  const vehiclesData = [
    {
      id: 1,
      vehicleType: 'Car',
      vehicleMake: 'Toyota Matrix',
      plateNumber: 'XL235ABC',
      speed: '60km/h',
      costPerKm: '₦100',
      status: 'Inactive'
    },
    {
      id: 2,
      vehicleType: 'Bike',
      vehicleMake: 'Toyota Matrix',
      plateNumber: 'XL235ABC',
      speed: '40km/h',
      costPerKm: '₦80',
      status: 'Active'
    },
    {
      id: 3,
      vehicleType: 'Van',
      vehicleMake: 'Toyota Matrix',
      plateNumber: 'XL235ABC',
      speed: '50km/h',
      costPerKm: '₦120',
      status: 'Inactive'
    },
    {
      id: 4,
      vehicleType: 'Truck',
      vehicleMake: 'Toyota Matrix',
      plateNumber: 'XL235ABC',
      speed: '45km/h',
      costPerKm: '₦150',
      status: 'Ongoing'
    }
  ];

  const renderCustomCell = (key, value, row) => {
    if (key === 'status') {
      const statusColors = {
        'Active': 'bg-green-50 text-green-700',
        'Inactive': 'bg-yellow-50 text-yellow-700',
        'Ongoing': 'bg-orange-50 text-orange-700'
      };
      
      return (
        <span className={`px-3 py-1 rounded-full text-sm ${statusColors[value]}`}>
          {value}
        </span>
      );
    }
    return value;
  };

  const handleViewClick = (vehicle) => {
    setSelectedVehicle(vehicle);
    setIsVehicleModalOpen(true);
  };

  const ActionButtons = ({ row }) => {
    const isActive = row.status === 'Active';
    
    return (
      <div className="flex items-center gap-6">
        <button 
        className="text-indigo-600 hover:text-indigo-800"
        onClick={() => handleViewClick(row)}
        >
          <Eye size={16} />
        </button>
        <button className="text-red-600 hover:text-red-800">
            <Trash2 size={16} />
        </button>
      </div>
    );
  };

  return (
    <div className="space-y-6 bg-white p-6 rounded-lg">
      <Table
        name={"Vehicles"}
        columns={columns}
        data={vehiclesData}
        renderCustomCell={renderCustomCell}
        showSearch={false}
        itemsPerPage={10}
        className="mt-4"
        renderActions={(row) => <ActionButtons row={row} />}
      />
      <VehicleInfoModal 
        isOpen={isVehicleModalOpen}
        onClose={() => setIsVehicleModalOpen(false)}
        vehicle={selectedVehicle}
      />
    </div>
  );
};