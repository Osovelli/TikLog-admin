import { useState, useEffect } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  X, Loader2, Star, Calendar, Car, Palette, Hash, 
  FileText, Edit2, Save, XCircle, Trash2, AlertTriangle 
} from "lucide-react";
import useVehicleStore from "@/store/vehicleStore";
import useUploadStore from "@/store/uploadStore";
import { format } from "date-fns";
import toast from "react-hot-toast";

export function VehicleDetailsSheet({ isOpen, onClose, vehicleId }) {
  const [isEditing, setIsEditing] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [editData, setEditData] = useState({});
  
  const { 
    singleVehicleData, 
    loading, 
    isUpdating, 
    isDeleting,
    getSingleVehicle, 
    updateVehicle, 
    deleteVehicle,
    setDefaultVehicle,
    clearSingleVehicle 
  } = useVehicleStore();
  
  const { uploadFiles } = useUploadStore();

  // Fetch vehicle details when sheet opens
  useEffect(() => {
    if (isOpen && vehicleId) {
      getSingleVehicle(vehicleId);
    }
    return () => {
      if (!isOpen) {
        clearSingleVehicle();
        setIsEditing(false);
        setShowDeleteConfirm(false);
      }
    };
  }, [isOpen, vehicleId]);

  // Populate edit data when vehicle data loads
  useEffect(() => {
    if (singleVehicleData) {
      setEditData({
        type: singleVehicleData.type || singleVehicleData.vehicle_type || "",
        make: singleVehicleData.make || singleVehicleData.vehicleDetails?.make || "",
        model: singleVehicleData.model || singleVehicleData.vehicleDetails?.model || "",
        year: singleVehicleData.year || singleVehicleData.vehicleDetails?.year || "",
        color: singleVehicleData.color || singleVehicleData.vehicleDetails?.color || "",
        plateNumber: singleVehicleData.plateNumber || singleVehicleData.vehicleDetails?.plate_number || "",
      });
    }
  }, [singleVehicleData]);

  const handleEditChange = (field, value) => {
    setEditData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSaveEdit = async () => {
    try {
      const payload = {
        type: editData.type,
        make: editData.make,
        model: editData.model,
        year: parseInt(editData.year, 10),
        color: editData.color,
        plateNumber: editData.plateNumber,
      };

      await updateVehicle(vehicleId, payload);
      setIsEditing(false);
    } catch (error) {
      console.error("Error updating vehicle:", error);
    }
  };

  const handleDelete = async () => {
    try {
      await deleteVehicle(vehicleId);
      onClose();
    } catch (error) {
      console.error("Error deleting vehicle:", error);
    }
  };

  const handleSetDefault = async () => {
    try {
      await setDefaultVehicle(vehicleId);
    } catch (error) {
      console.error("Error setting default vehicle:", error);
    }
  };

  const handleClose = () => {
    setIsEditing(false);
    setShowDeleteConfirm(false);
    onClose();
  };

  // Get vehicle data with fallbacks
  const vehicle = singleVehicleData || {};
  const vehicleType = vehicle.type || vehicle.vehicle_type || "N/A";
  const make = vehicle.make || vehicle.vehicleDetails?.make || "N/A";
  const model = vehicle.model || vehicle.vehicleDetails?.model || "N/A";
  const year = vehicle.year || vehicle.vehicleDetails?.year || "N/A";
  const color = vehicle.color || vehicle.vehicleDetails?.color || "N/A";
  const plateNumber = vehicle.plateNumber || vehicle.vehicleDetails?.plate_number || "N/A";
  const images = vehicle.images || vehicle.vehicleDetails?.vehicle_images || [];
  const isDefault = vehicle.isDefault || false;
  const status = vehicle.status || "Active";
  const createdAt = vehicle.createdAt ? format(new Date(vehicle.createdAt), "dd MMM yyyy") : "N/A";
  
  // License data
  const license = vehicle.vehicleLicense || {};
  const licenseNumber = license.licenseNumber || "N/A";
  const licenseIssueDate = license.issueDate ? format(new Date(license.issueDate), "dd MMM yyyy") : "N/A";
  const licenseExpiryDate = license.expiryDate ? format(new Date(license.expiryDate), "dd MMM yyyy") : "N/A";
  const licenseImages = license.images || [];

  const vehicleTypes = ["car", "motorcycle", "bicycle", "van", "truck"];
  const colors = ["Red", "Blue", "Black", "White", "Silver", "Gray", "Green", "Yellow"];

  return (
    <Sheet open={isOpen} onOpenChange={handleClose}>
      <SheetContent className="w-full sm:max-w-lg overflow-y-auto">
        <SheetHeader className="mb-6">
          <div className="flex items-center justify-between">
            <SheetTitle className="text-xl font-semibold">Vehicle Details</SheetTitle>
            {isDefault && (
              <Badge className="bg-yellow-100 text-yellow-800 flex items-center gap-1">
                <Star className="h-3 w-3 fill-current" />
                Default
              </Badge>
            )}
          </div>
        </SheetHeader>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
            <span className="ml-2 text-gray-600">Loading vehicle details...</span>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Vehicle Images */}
            {images.length > 0 && (
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-2">Vehicle Images</h4>
                <div className="grid grid-cols-3 gap-2">
                  {images.map((img, index) => (
                    <img
                      key={index}
                      src={typeof img === 'string' ? img : img.url}
                      alt={`Vehicle ${index + 1}`}
                      className="w-full aspect-square object-cover rounded-lg border"
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Status & Actions */}
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-3">
                <Badge className={status === "Active" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}>
                  {status}
                </Badge>
                <span className="text-sm text-gray-500">Added {createdAt}</span>
              </div>
              {!isDefault && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleSetDefault}
                  disabled={isUpdating}
                  className="flex items-center gap-1"
                >
                  {isUpdating ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Star className="h-4 w-4" />
                  )}
                  Set Default
                </Button>
              )}
            </div>

            {/* Vehicle Info */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="text-lg font-semibold text-gray-900">Vehicle Information</h4>
                {!isEditing ? (
                  <Button variant="ghost" size="sm" onClick={() => setIsEditing(true)}>
                    <Edit2 className="h-4 w-4 mr-1" />
                    Edit
                  </Button>
                ) : (
                  <div className="flex gap-2">
                    <Button variant="ghost" size="sm" onClick={() => setIsEditing(false)}>
                      <XCircle className="h-4 w-4 mr-1" />
                      Cancel
                    </Button>
                    <Button variant="default" size="sm" onClick={handleSaveEdit} disabled={isUpdating}>
                      {isUpdating ? (
                        <Loader2 className="h-4 w-4 animate-spin mr-1" />
                      ) : (
                        <Save className="h-4 w-4 mr-1" />
                      )}
                      Save
                    </Button>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                {/* Vehicle Type */}
                <div>
                  <label className="text-sm text-gray-500 flex items-center gap-1">
                    <Car className="h-4 w-4" />
                    Type
                  </label>
                  {isEditing ? (
                    <select
                      value={editData.type}
                      onChange={(e) => handleEditChange("type", e.target.value)}
                      className="w-full mt-1 px-3 py-2 border rounded-md text-sm"
                    >
                      {vehicleTypes.map((type) => (
                        <option key={type} value={type}>
                          {type.charAt(0).toUpperCase() + type.slice(1)}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <p className="font-medium capitalize">{vehicleType}</p>
                  )}
                </div>

                {/* Make */}
                <div>
                  <label className="text-sm text-gray-500">Make</label>
                  {isEditing ? (
                    <Input
                      value={editData.make}
                      onChange={(e) => handleEditChange("make", e.target.value)}
                      className="mt-1"
                    />
                  ) : (
                    <p className="font-medium">{make}</p>
                  )}
                </div>

                {/* Model */}
                <div>
                  <label className="text-sm text-gray-500">Model</label>
                  {isEditing ? (
                    <Input
                      value={editData.model}
                      onChange={(e) => handleEditChange("model", e.target.value)}
                      className="mt-1"
                    />
                  ) : (
                    <p className="font-medium">{model}</p>
                  )}
                </div>

                {/* Year */}
                <div>
                  <label className="text-sm text-gray-500 flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    Year
                  </label>
                  {isEditing ? (
                    <Input
                      type="number"
                      value={editData.year}
                      onChange={(e) => handleEditChange("year", e.target.value)}
                      className="mt-1"
                    />
                  ) : (
                    <p className="font-medium">{year}</p>
                  )}
                </div>

                {/* Color */}
                <div>
                  <label className="text-sm text-gray-500 flex items-center gap-1">
                    <Palette className="h-4 w-4" />
                    Color
                  </label>
                  {isEditing ? (
                    <select
                      value={editData.color}
                      onChange={(e) => handleEditChange("color", e.target.value)}
                      className="w-full mt-1 px-3 py-2 border rounded-md text-sm"
                    >
                      {colors.map((c) => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                  ) : (
                    <p className="font-medium">{color}</p>
                  )}
                </div>

                {/* Plate Number */}
                <div>
                  <label className="text-sm text-gray-500 flex items-center gap-1">
                    <Hash className="h-4 w-4" />
                    Plate Number
                  </label>
                  {isEditing ? (
                    <Input
                      value={editData.plateNumber}
                      onChange={(e) => handleEditChange("plateNumber", e.target.value.toUpperCase())}
                      className="mt-1"
                    />
                  ) : (
                    <p className="font-medium">{plateNumber}</p>
                  )}
                </div>
              </div>
            </div>

            {/* License Info */}
            <div className="space-y-4 pt-4 border-t">
              <h4 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Vehicle License
              </h4>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-gray-500">License Number</label>
                  <p className="font-medium">{licenseNumber}</p>
                </div>
                <div>
                  <label className="text-sm text-gray-500">Issue Date</label>
                  <p className="font-medium">{licenseIssueDate}</p>
                </div>
                <div>
                  <label className="text-sm text-gray-500">Expiry Date</label>
                  <p className="font-medium">{licenseExpiryDate}</p>
                </div>
              </div>

              {licenseImages.length > 0 && (
                <div>
                  <label className="text-sm text-gray-500 mb-2 block">License Images</label>
                  <div className="grid grid-cols-2 gap-2">
                    {licenseImages.map((img, index) => (
                      <img
                        key={index}
                        src={typeof img === 'string' ? img : img.url}
                        alt={`License ${index === 0 ? "Front" : "Back"}`}
                        className="w-full aspect-video object-cover rounded-lg border"
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Delete Section */}
            <div className="pt-4 border-t">
              {!showDeleteConfirm ? (
                <Button
                  variant="outline"
                  className="w-full text-red-600 border-red-200 hover:bg-red-50 hover:border-red-300"
                  onClick={() => setShowDeleteConfirm(true)}
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete Vehicle
                </Button>
              ) : (
                <div className="p-4 bg-red-50 rounded-lg border border-red-200">
                  <div className="flex items-center gap-2 text-red-800 mb-3">
                    <AlertTriangle className="h-5 w-5" />
                    <span className="font-medium">Confirm Deletion</span>
                  </div>
                  <p className="text-sm text-red-700 mb-4">
                    Are you sure you want to delete this vehicle? This action cannot be undone.
                  </p>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setShowDeleteConfirm(false)}
                      className="flex-1"
                    >
                      Cancel
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={handleDelete}
                      disabled={isDeleting}
                      className="flex-1"
                    >
                      {isDeleting ? (
                        <Loader2 className="h-4 w-4 animate-spin mr-1" />
                      ) : (
                        <Trash2 className="h-4 w-4 mr-1" />
                      )}
                      Delete
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}