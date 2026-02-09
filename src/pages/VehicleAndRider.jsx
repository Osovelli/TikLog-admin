
import { AddVehicleModal } from "@/components/_VehicleRiderComponents/AddVehicleModal";
import { VehicleDetailsSheet } from "@/components/_VehicleRiderComponents/VehicleDetailsSheet";
import { RiderDetailsSheet } from "@/components/_VehicleRiderComponents/RiderDetailsSheet";
import { AppLayout } from "@/components/AppLayout";
import { ButtonComponent } from "@/components/ButtonComponent";
import { Table } from "@/components/Table";
import { Badge } from "@/components/ui/badge";
import useVehicleStore from "@/store/vehicleStore";
import useRiderStore from "@/store/riderStore";
import { Plus, Loader2, Eye, Edit2, Trash2, Star, AlertTriangle, User } from "lucide-react";
import { useEffect, useState } from "react";
import { FaCar } from "react-icons/fa";
import AddRiderModal from "@/components/_VehicleRiderComponents/AddRiderModal";

// Custom Confirmation Modal Component
const DeleteConfirmModal = ({ isOpen, onClose, onConfirm, isDeleting, itemName, itemType = "vehicle" }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4 overflow-hidden">
        <div className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-red-100 rounded-full">
              <AlertTriangle className="h-6 w-6 text-red-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">
              Delete {itemType === "rider" ? "Rider" : "Vehicle"}
            </h3>
          </div>
          <p className="text-gray-600 mb-6">
            Are you sure you want to delete {itemName ? `"${itemName}"` : `this ${itemType}`}? 
            This action cannot be undone.
          </p>
          <div className="flex justify-end gap-3">
            <button
              onClick={onClose}
              disabled={isDeleting}
              className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              disabled={isDeleting}
              className="px-4 py-2 bg-red-600 text-white hover:bg-red-700 rounded-lg transition-colors disabled:opacity-50 flex items-center gap-2"
            >
              {isDeleting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Deleting...
                </>
              ) : (
                <>
                  <Trash2 className="h-4 w-4" />
                  Delete
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export const VehicleAndRider = () => {
  const [activeTab, setActiveTab] = useState("vehicles");
  const [isAddVehicleModalOpen, setIsAddVehicleModalOpen] = useState(false);
  const [isAddRiderModalOpen, setIsAddRiderModalOpen] = useState(false);
  const [isVehicleDetailsOpen, setIsVehicleDetailsOpen] = useState(false);
  const [isRiderDetailsOpen, setIsRiderDetailsOpen] = useState(false);
  const [selectedVehicleId, setSelectedVehicleId] = useState(null);
  const [selectedRiderId, setSelectedRiderId] = useState(null);
  
  // Delete confirmation state
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [deleteType, setDeleteType] = useState("vehicle"); // "vehicle" or "rider"

  // Vehicle store
  const { 
    getOwnerVehicle, 
    deleteVehicle,
    vehiclesData, 
    loading: vehicleLoading, 
    isDeleting: isVehicleDeleting,
    error: vehicleError 
  } = useVehicleStore();

  // Rider store
  const {
    getRiders,
    deleteRider,
    ridersData,
    loading: riderLoading,
    isDeleting: isRiderDeleting,
    error: riderError
  } = useRiderStore();

  // Fetch data on mount
  useEffect(() => {
    getOwnerVehicle();
    getRiders();
  }, []);

  // Handle view vehicle
  const handleViewVehicle = (vehicleId) => {
    setSelectedVehicleId(vehicleId);
    setIsVehicleDetailsOpen(true);
  };

  // Handle view rider
  const handleViewRider = (riderId) => {
    setSelectedRiderId(riderId);
    setIsRiderDetailsOpen(true);
  };

  // Open delete confirmation modal for vehicle
  const openVehicleDeleteModal = (vehicle, e) => {
    e?.stopPropagation();
    setItemToDelete(vehicle);
    setDeleteType("vehicle");
    setDeleteModalOpen(true);
  };

  // Open delete confirmation modal for rider
  const openRiderDeleteModal = (rider, e) => {
    e?.stopPropagation();
    setItemToDelete(rider);
    setDeleteType("rider");
    setDeleteModalOpen(true);
  };

  // Handle confirm delete
  const handleConfirmDelete = async () => {
    if (!itemToDelete) return;
    
    try {
      if (deleteType === "vehicle") {
        await deleteVehicle(itemToDelete.id);
      } else {
        await deleteRider(itemToDelete.id);
      }
      setDeleteModalOpen(false);
      setItemToDelete(null);
    } catch (error) {
      console.error(`Error deleting ${deleteType}:`, error);
    }
  };

  // Close delete modal
  const closeDeleteModal = () => {
    setDeleteModalOpen(false);
    setItemToDelete(null);
  };

  // Transform vehicle data for table display
  const transformVehicleData = (vehicles) => {
    if (!vehicles || !Array.isArray(vehicles)) return [];

    return vehicles.map((vehicle) => {
      const vehicleType = vehicle.type || vehicle.vehicle_type || "N/A";
      const make = vehicle.make || vehicle.vehicleDetails?.make || "";
      const model = vehicle.model || vehicle.vehicleDetails?.model || "";
      
      return {
        id: vehicle._id || vehicle.id,
        "vehicle type": vehicleType,
        model: `${make} ${model}`.trim() || "N/A",
        "plate number": vehicle.plateNumber || vehicle.vehicleDetails?.plate_number || "N/A",
        date: vehicle.createdAt
          ? new Date(vehicle.createdAt).toLocaleDateString("en-US", {
              year: "numeric",
              month: "short",
              day: "numeric",
            })
          : "N/A",
        status: vehicle.status || "Active",
        isDefault: vehicle.isDefault || false,
        originalData: vehicle,
      };
    });
  };

  // Transform rider data for table display
  const transformRiderData = (riders) => {
    if (!riders || !Array.isArray(riders)) return [];

    return riders.map((rider) => {
      const fullName = `${rider.firstname || ''} ${rider.lastname || ''}`.trim() || rider.name || "N/A";
      
      return {
        id: rider._id || rider.id,
        name: fullName,
        phone: rider.phone || rider.phoneNumber || "N/A",
        email: rider.email || "N/A",
        status: rider.status || "Active",
        address: rider.address?.street 
          ? `${rider.address.street}, ${rider.address.city || ''}, ${rider.address.state || ''}`
          : rider.address || "N/A",
        date: rider.createdAt
          ? new Date(rider.createdAt).toLocaleDateString("en-US", {
              year: "numeric",
              month: "short",
              day: "numeric",
            })
          : "N/A",
        originalData: rider,
      };
    });
  };

  const vehicleColumns = [
    { key: "vehicle type", label: "Vehicle Type" },
    { key: "model", label: "Model" },
    { key: "plate number", label: "Plate Number" },
    { key: "date", label: "Date Added" },
    { key: "status", label: "Status" },
    { key: "actions", label: "Actions" },
  ];

  const riderColumns = [
    { key: "name", label: "Rider Name" },
    { key: "phone", label: "Phone Number" },
    { key: "email", label: "Email" },
    { key: "status", label: "Status" },
    { key: "date", label: "Date Added" },
    { key: "actions", label: "Actions" },
  ];

  // Render custom cell for vehicles
  const renderVehicleCell = (key, value, item) => {
    if (key === "vehicle type") {
      return (
        <div className="flex items-center gap-2">
          <span className="capitalize">{value}</span>
          {item.isDefault && (
            <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
          )}
        </div>
      );
    }

    if (key === "status") {
      const isActive = value?.toLowerCase() === "active";
      const badgeColor = isActive 
        ? "bg-green-100 text-green-800" 
        : "bg-red-100 text-red-800";
      return (
        <Badge className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${badgeColor}`}>
          {value}
        </Badge>
      );
    }

    if (key === "actions") {
      return (
        <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleViewVehicle(item.id);
            }}
            className="p-2 hover:bg-blue-50 rounded-md transition-colors"
            title="Edit vehicle"
          >
            <Edit2 className="h-4 w-4 text-blue-600" />
          </button>
          <button
            onClick={(e) => openVehicleDeleteModal(item, e)}
            className="p-2 hover:bg-red-50 rounded-md transition-colors"
            title="Delete vehicle"
          >
            <Trash2 className="h-4 w-4 text-red-600" />
          </button>
        </div>
      );
    }

    return value;
  };

  // Render custom cell for riders
  const renderRiderCell = (key, value, item) => {
    if (key === "name") {
      return (
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
            {item.originalData?.profileImage?.url ? (
              <img 
                src={item.originalData.profileImage.url} 
                alt={value}
                className="w-full h-full rounded-full object-cover"
              />
            ) : (
              <User className="h-4 w-4 text-gray-500" />
            )}
          </div>
          <span>{value}</span>
        </div>
      );
    }

    if (key === "status") {
      const statusLower = value?.toLowerCase();
      let badgeColor = "bg-gray-100 text-gray-800";
      
      if (statusLower === "active") {
        badgeColor = "bg-green-100 text-green-800";
      } else if (statusLower === "inactive") {
        badgeColor = "bg-red-100 text-red-800";
      } else if (statusLower === "pending") {
        badgeColor = "bg-yellow-100 text-yellow-800";
      } else if (statusLower === "suspended") {
        badgeColor = "bg-orange-100 text-orange-800";
      }

      return (
        <Badge className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${badgeColor}`}>
          {value}
        </Badge>
      );
    }

    if (key === "actions") {
      return (
        <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleViewRider(item.id);
            }}
            className="p-2 hover:bg-blue-50 rounded-md transition-colors"
            title="View/Edit rider"
          >
            <Edit2 className="h-4 w-4 text-blue-600" />
          </button>
          <button
            onClick={(e) => openRiderDeleteModal(item, e)}
            className="p-2 hover:bg-red-50 rounded-md transition-colors"
            title="Delete rider"
          >
            <Trash2 className="h-4 w-4 text-red-600" />
          </button>
        </div>
      );
    }

    return value;
  };

  const transformedVehicleData = transformVehicleData(vehiclesData);
  const transformedRiderData = transformRiderData(ridersData);

  return (
    <AppLayout title={"Vehicles & Rider"} icon={<FaCar />}>
      <div className="p-8">
        <div className="flex justify-between items-start mb-8">
          <div className="max-w-[10rem] sm:max-w-full">
            {/* <h2 className="sm:text-2xl text-base font-semibold">Vehicles & Riders</h2> */}
            <span className="sm:text-sm text-xs text-[#868C98]">
              Keep track of all your vehicles and riders
            </span>
          </div>
          <div className="flex flex-col lg:flex-row gap-2">
            <ButtonComponent
              variant="secondary"
              icon={<Plus size={16} />}
              label={"Add Rider"}
              buttonStyles="sm:px-4 px-2 h-[30px] sm:h-[52px]"
              onClick={() => setIsAddRiderModalOpen(true)}
            />
            <ButtonComponent
              variant="primary"
              icon={<Plus size={16} />}
              label={"Add Vehicle"}
              buttonStyles="sm:px-4 px-2 h-[30px] sm:h-[52px]"
              onClick={() => setIsAddVehicleModalOpen(true)}
            />
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b mb-6">
          <div className="flex gap-8">
            <button
              className={`pb-2 px-1 flex items-center gap-2 transition-colors ${
                activeTab === "vehicles"
                  ? "border-b-2 border-blue-600 text-blue-600 font-medium"
                  : "text-gray-500 hover:text-gray-700"
              }`}
              onClick={() => setActiveTab("vehicles")}
            >
              Vehicles ({transformedVehicleData.length})
            </button>
            <button
              className={`pb-2 px-1 transition-colors ${
                activeTab === "riders"
                  ? "border-b-2 border-blue-600 text-blue-600 font-medium"
                  : "text-gray-500 hover:text-gray-700"
              }`}
              onClick={() => setActiveTab("riders")}
            >
              Riders ({transformedRiderData.length})
            </button>
          </div>
        </div>

        {/* Vehicles Tab */}
        {activeTab === "vehicles" && (
          <>
            {vehicleLoading && (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
                <span className="ml-2 text-gray-600">Loading vehicles...</span>
              </div>
            )}

            {vehicleError && !vehicleLoading && (
              <div className="bg-red-50 border border-red-200 rounded-md p-4 mb-6">
                <p className="text-red-600">Error loading vehicles: {vehicleError}</p>
                <button
                  onClick={() => getOwnerVehicle()}
                  className="mt-2 text-red-600 underline hover:text-red-800"
                >
                  Try again
                </button>
              </div>
            )}

            {!vehicleLoading && !vehicleError && transformedVehicleData.length === 0 && (
              <div className="text-center py-12 bg-gray-50 rounded-lg">
                <FaCar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No vehicles yet</h3>
                <p className="text-gray-500 mb-4">Get started by adding your first vehicle</p>
                <ButtonComponent
                  variant="primary"
                  icon={<Plus size={16} />}
                  label="Add Vehicle"
                  onClick={() => setIsAddVehicleModalOpen(true)}
                  buttonStyles={'w-72 mx-auto'}
                />
              </div>
            )}

            {!vehicleLoading && !vehicleError && transformedVehicleData.length > 0 && (
              <Table
                data={transformedVehicleData}
                columns={vehicleColumns}
                onRowClick={(item) => handleViewVehicle(item.id)}
                itemsPerPage={10}
                renderCustomCell={renderVehicleCell}
                showSearch={true}
              />
            )}
          </>
        )}

        {/* Riders Tab */}
        {activeTab === "riders" && (
          <>
            {riderLoading && (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
                <span className="ml-2 text-gray-600">Loading riders...</span>
              </div>
            )}

            {riderError && !riderLoading && (
              <div className="bg-red-50 border border-red-200 rounded-md p-4 mb-6">
                <p className="text-red-600">Error loading riders: {riderError}</p>
                <button
                  onClick={() => getRiders()}
                  className="mt-2 text-red-600 underline hover:text-red-800"
                >
                  Try again
                </button>
              </div>
            )}

            {!riderLoading && !riderError && transformedRiderData.length === 0 && (
              <div className="text-center py-12 bg-gray-50 rounded-lg">
                <User className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No riders yet</h3>
                <p className="text-gray-500 mb-4">Get started by adding your first rider</p>
                <ButtonComponent
                  variant="primary"
                  icon={<Plus size={16} />}
                  label="Add Rider"
                  onClick={() => setIsAddRiderModalOpen(true)}
                  buttonStyles={'w-72 mx-auto'}
                />
              </div>
            )}

            {!riderLoading && !riderError && transformedRiderData.length > 0 && (
              <Table
                data={transformedRiderData}
                columns={riderColumns}
                onRowClick={(item) => handleViewRider(item.id)}
                itemsPerPage={10}
                renderCustomCell={renderRiderCell}
                showSearch={true}
              />
            )}
          </>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={deleteModalOpen}
        onClose={closeDeleteModal}
        onConfirm={handleConfirmDelete}
        isDeleting={deleteType === "vehicle" ? isVehicleDeleting : isRiderDeleting}
        itemName={itemToDelete?.name || itemToDelete?.model}
        itemType={deleteType}
      />

      {/* Add Rider Modal */}
      <AddRiderModal
        isOpen={isAddRiderModalOpen}
        onClose={() => setIsAddRiderModalOpen(false)}
      />

      {/* Add Vehicle Modal */}
      <AddVehicleModal
        isOpen={isAddVehicleModalOpen}
        onClose={() => setIsAddVehicleModalOpen(false)}
      />

      {/* Vehicle Details Sheet */}
      <VehicleDetailsSheet
        isOpen={isVehicleDetailsOpen}
        onClose={() => {
          setIsVehicleDetailsOpen(false);
          setSelectedVehicleId(null);
        }}
        vehicleId={selectedVehicleId}
      />

      {/* Rider Details Sheet */}
      <RiderDetailsSheet
        isOpen={isRiderDetailsOpen}
        onClose={() => {
          setIsRiderDetailsOpen(false);
          setSelectedRiderId(null);
        }}
        riderId={selectedRiderId}
      />
    </AppLayout>
  );
};

export default VehicleAndRider;