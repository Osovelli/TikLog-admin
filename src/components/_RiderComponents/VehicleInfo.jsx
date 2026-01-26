import React, { useEffect, useMemo, useState } from 'react';
import { Eye, Trash2, ClipboardEdit } from 'lucide-react';
import { Table } from '../Table';
import { VehicleInfoModal } from './VehicleInfoModal';
import useVehicleStore from '@/store/VehicleStore';

export const VehiclesInfo = ({riderId}) => {
  const [isVehicleModalOpen, setIsVehicleModalOpen] = useState(false);
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [riderVehicles, setRiderVehicles] = useState([])

  const {getRiderVehicle, loading} = useVehicleStore()

  const fetchRiderVehicles = useMemo(() => {
    console.log("Fetching rider vehicles", riderId)
    return async () => {
      try {
        const data = await getRiderVehicle("68800ff8dc54a19b4e04cfbf")
        console.log("Rider Vehicles Response: ", data)
        if (data) {
          setRiderVehicles(data)
        }
      } catch (error) {
        console.error("Error fetching rider vehicles:", error)
        setRiderVehicles([])
      }
    }
  }, [getRiderVehicle])

  useEffect(() => {
    fetchRiderVehicles()
  }, [fetchRiderVehicles])

  const columns = [
    { key: 'vehicleType', label: 'Vehicle Type' },
    { key: 'vehicleMake', label: 'Vehicle Make' },
    { key: 'plateNumber', label: 'Plate Number' },
    { key: 'speed', label: 'Speed' },
    { key: 'costPerKm', label: 'Cost per Km' },
    { key: 'status', label: 'Status' }
  ];

  // Transform API data to match table structure
  const transformedVehiclesData = useMemo(() => {
    return riderVehicles.map((vehicle) => ({
      id: vehicle._id,
      vehicleType: vehicle.vehicle_type
        ? vehicle.vehicle_type.charAt(0).toUpperCase() + vehicle.vehicle_type.slice(1)
        : "N/A",
      vehicleMake: vehicle.vehicleDetails ? `${vehicle.vehicleDetails.make} ${vehicle.vehicleDetails.model}` : "N/A",
      plateNumber: vehicle.vehicleDetails?.plate_number || "N/A",
      speed: "N/A", // This field doesn't exist in API response, you might need to add it or remove from columns
      costPerKm: "N/A", // This field doesn't exist in API response, you might need to add it or remove from columns
      status: vehicle.status || (vehicle.is_active ? "Active" : "Inactive"),
      // Keep original data for modal
      originalData: vehicle,
    }))
  }, [riderVehicles])

  /* const vehiclesData = [
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
  ]; */

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
    // Pass the original API data to the modal
    setSelectedVehicle(vehicle.originalData || vehicle)
    setIsVehicleModalOpen(true)
  }

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

  if (loading) {
    return (
      <div className="space-y-6 bg-white p-6 rounded-lg">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
          <span className="ml-2 text-gray-600">Loading vehicles...</span>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6 bg-white p-6 rounded-lg">
      <Table
        name={"Vehicles"}
        columns={columns}
        data={transformedVehiclesData}
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