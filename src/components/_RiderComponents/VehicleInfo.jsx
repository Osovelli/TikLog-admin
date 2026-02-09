import React, { useEffect, useMemo, useState } from 'react';
import { Eye, Trash2, ClipboardEdit, Car } from 'lucide-react';
import { Table } from '../Table';
import { VehicleInfoModal } from './VehicleInfoModal';
import useVehicleStore from '@/store/VehicleStore';
import useUserStore from '@/store/UserStore';

export const VehiclesInfo = ({riderId}) => {
  const [isVehicleModalOpen, setIsVehicleModalOpen] = useState(false);
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [riderVehicles, setRiderVehicles] = useState([])

  //const {getRiderVehicle, loading} = useVehicleStore()
  const {getRiderVehicleById, loading: vehicleLoading} = useUserStore()

  const fetchRiderVehicles = useMemo(() => {
    //console.log("Fetching rider vehicles", riderId)
    return async () => {
      try {
        const data = await getRiderVehicleById(riderId)
        //console.log("Rider Vehicles Response: ", data)
        if (data) {
          setRiderVehicles(data)
        }
      } catch (error) {
        console.error("Error fetching rider vehicles:", error)
        setRiderVehicles([])
      }
    }
  }, [getRiderVehicleById, riderId])

  useEffect(() => {
    fetchRiderVehicles()
  }, [fetchRiderVehicles])

  const columns = [
    { key: 'vehicleType', label: 'Vehicle Type' },
    { key: 'vehicleMake', label: 'Vehicle Make' },
    { key: 'plateNumber', label: 'Plate Number' },
    { key: 'color', label: 'Color' },
    { key: 'default', label: 'Default' },
    /* { key: 'speed', label: 'Speed' },
    { key: 'costPerKm', label: 'Cost per Km' },
    { key: 'status', label: 'Status' } */
  ];

  // Transform API data to match table structure
  const transformedVehiclesData = useMemo(() => {
    return riderVehicles.map((vehicle) => ({
      id: vehicle._id,
      vehicleType: vehicle.type
        ? vehicle.type.charAt(0).toUpperCase() + vehicle.type.slice(1)
        : "N/A",
      vehicleMake: vehicle.make ? `${vehicle.make} ${vehicle.vehicleDetails?.model || "N/A"}` : "N/A",
      plateNumber: vehicle.plateNumber || "N/A",
      speed: "N/A", // keep if later added to API, otherswise remove from columns
      costPerKm: "N/A", // keep if later added to API, otherswise remove from columns
      default: vehicle.isDefault ? "Default" : "",
      color: vehicle.color || "N/A",
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
    if (key === 'default') {
      return value === "Default" ? (
        <span className="px-3 py-1 rounded-full text-sm bg-blue-50 text-blue-700">
          {value}
        </span>
      ) : (
        <span className="px-3 py-1 rounded-full text-sm bg-gray-50 text-gray-700">
          {value}
        </span>
      );
    }
    if (key === 'color') {
      return (
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full" style={{ backgroundColor: value }}></div>
          <span>{value}</span>
        </div>
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

  if (vehicleLoading) {
    return (
      <div className="space-y-6 bg-white p-6 rounded-lg">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
          <span className="ml-2 text-gray-600">Loading vehicles...</span>
        </div>
      </div>
    )
  }

  if (riderVehicles.length === 0) {
    return (
      <div className="space-y-6 bg-white p-6 rounded-lg">
        <div className="text-center py-12">
          <div className="mx-auto h-12 w-12 text-gray-400">
            <Car size={24} className="mx-auto" />
          </div>
          <h3 className="mt-2 text-sm font-medium text-gray-900">No vehicles</h3>
          <p className="mt-1 text-sm text-gray-500">This rider has no vehicles registered.</p>
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