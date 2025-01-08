import React, { useState } from 'react';
import { Eye, Trash2, Plus } from 'lucide-react';
import { Button } from "@/components/ui/button"
import { Table } from '@/components/Table';
import { AppLayout } from '@/components/AppLayout';
import { AddVehicleModal } from '@/components/_VehicleComponents/AddVehicleModal';
import { VehicleModal } from '@/components/_VehicleComponents/VehicleModal';
import { VehicleTypeModal } from '@/components/_VehicleComponents/VehicleTypeModal';

const TabButton = ({ label, active, onClick }) => (
  <button
    onClick={onClick}
    className={`px-4 py-2 text-sm font-medium rounded-lg ${
      active 
        ? 'bg-white shadow' 
        : 'text-gray-500 hover:text-gray-700'
    }`}
  >
    {label}
  </button>
);

export const VehicleManagementPage = () => {
  const [activeTab, setActiveTab] = useState('vehicles');
  const [isVehicleModalOpen, setIsVehicleModalOpen] = useState(false);
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [isTypeModalOpen, setIsTypeModalOpen] = useState(false)

  const vehicleColumns = [
    { key: 'vehicleType', label: 'Vehicle Type' },
    { key: 'vehicleMake', label: 'Vehicle Make' },
    { key: 'plateNumber', label: 'Plate Number' },
    { key: 'status', label: 'Status' }
  ];

  const typeColumns = [
    { key: 'vehicleType', label: 'Vehicle Type' },
    { key: 'speed', label: 'Speed' },
    { key: 'costPerKm', label: 'Cost/KM' }
  ];

  const vehiclesData = [
    {
      id: 1,
      vehicleType: 'Car',
      vehicleMake: 'Toyota Matrix',
      plateNumber: 'XL235ABC',
      status: 'Inactive'
    },
    {
      id: 2,
      vehicleType: 'Bike',
      vehicleMake: 'Toyota Matrix',
      plateNumber: 'XL235ABC',
      status: 'Active'
    },
    // Add more sample data
    ...Array(8).fill(null).map((_, index) => ({
      id: index + 3,
      vehicleType: ['Car', 'Van', 'Truck', 'Car'][index % 4],
      vehicleMake: 'Toyota Matrix',
      plateNumber: 'XL235ABC',
      status: ['Active', 'Inactive'][index % 2]
    }))
  ];

  const typesData = [
    { id: 1, vehicleType: 'Car', speed: '20', costPerKm: 'XL235ABC' },
    { id: 2, vehicleType: 'Bike', speed: '18', costPerKm: 'XL235ABC' },
    { id: 3, vehicleType: 'Van', speed: '15', costPerKm: 'XL235ABC' },
    { id: 4, vehicleType: 'Truck', speed: '12', costPerKm: 'XL235ABC' },
    { id: 5, vehicleType: 'Van', speed: '8', costPerKm: 'XL235ABC' }
  ];

  const renderCustomCell = (key, value, row) => {
    if (key === 'status') {
      return (
        <span className={`px-3 py-1 rounded-full text-sm ${
          value === 'Active' 
            ? 'bg-green-50 text-green-700' 
            : 'bg-orange-50 text-orange-500'
        }`}>
          {value}
        </span>
      );
    }
    return value;
  };

  const handleView = (row) => {
    console.log('View:', row);
  };

  const handleNewClick = () => {
    if (activeTab === 'vehicles') {
      setIsVehicleModalOpen(true)
    } else {
      setIsTypeModalOpen(true)
    }
  }  

  /* const handleAddVehicle = (vehicle) => {
    setSelectedVehicle(vehicle);
    setIsVehicleModalOpen(true);
  }; */

  const handleDelete = (row) => {
    console.log('Delete:', row);
  };

  const ActionButtons = ({ row }) => (
    <div className="flex items-center gap-8">
      <button 
        onClick={() => handleView(row)}
        className="text-gray-500 hover:text-gray-700"
      >
        <Eye size={16} />
      </button>
      <button 
        onClick={() => handleDelete(row)}
        className="text-red-500 hover:text-red-700"
      >
        <Trash2 size={16} />
      </button>
    </div>
  );

  return (
    <AppLayout title={"Vehicle Management"}>
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex gap-2 p-1 bg-gray-100 rounded-lg">
          <TabButton
            label="Vehicle List"
            active={activeTab === 'vehicles'}
            onClick={() => setActiveTab('vehicles')}
          />
          <TabButton
            label="Vehicle Type"
            active={activeTab === 'types'}
            onClick={() => setActiveTab('types')}
          />
        </div>

        <Button className="bg-indigo-600 hover:bg-indigo-700"
          /* onClick={() =>  handleAddVehicle()} */
          onClick={handleNewClick}
          >
          <Plus className="w-4 h-4 mr-2" />
          New {activeTab === 'vehicles' ? 'Vehicle' : 'Vehicle Type'}
        </Button>
      </div>

      <div className="bg-white rounded-lg border">
        <Table
          name={"Vehicle"}
          columns={activeTab === 'vehicles' ? vehicleColumns : typeColumns}
          data={activeTab === 'vehicles' ? vehiclesData : typesData}
          renderCustomCell={renderCustomCell}
          showSearch={false}
          itemsPerPage={10}
          renderActions={(row) => <ActionButtons row={row} />}
        />
      </div>
      {/* <AddVehicleModal 
      isOpen={isVehicleModalOpen}
      onClose={() => setIsVehicleModalOpen(false)}
      vehicle={selectedVehicle}
      /> */}
      <VehicleModal 
        isOpen={isVehicleModalOpen} 
        onClose={() => setIsVehicleModalOpen(false)} 
      />
      
      <VehicleTypeModal
        isOpen={isTypeModalOpen}
        onClose={() => setIsTypeModalOpen(false)}
      />
    </div>
    </AppLayout>
  );
};