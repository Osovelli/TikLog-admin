import { useState, useRef } from "react";
import { Input } from "@/components/ui/input";
import { ImagePlus, X, Loader2, FileText, Calendar } from "lucide-react";
import Modal from "../ModalComponent";
import useVehicleStore from "@/store/vehicleStore";
import useUploadStore from "@/store/uploadStore";
import useAuthStore from "@/store/authStore";
import { format } from "date-fns";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import toast from "react-hot-toast";

export function AddVehicleModal({ isOpen, onClose }) {
  const [loading, setLoading] = useState(false);
  const [vehicleData, setVehicleData] = useState({
    type: "",
    make: "",
    model: "",
    year: "",
    color: "",
    plateNumber: "",
  });
  
  const [licenseData, setLicenseData] = useState({
    licenseNumber: "",
    issueDate: null,
    expiryDate: null,
  });
  
  const [vehicleImages, setVehicleImages] = useState([]); // Array of File objects
  const [licenseImages, setLicenseImages] = useState([]); // Array of File objects (front & back)
  const [errors, setErrors] = useState({});
  
  const vehicleImageInputRef = useRef(null);
  const licenseImageInputRef = useRef(null);

  const { createVehicle, isCreating } = useVehicleStore();
  const { uploadFile, uploadFiles } = useUploadStore();
  const { user } = useAuthStore(); // Get current user for ownerId

  const handleInputChange = (field, value) => {
    setVehicleData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const handleLicenseInputChange = (field, value) => {
    setLicenseData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const handleVehicleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    const remainingSlots = 5 - vehicleImages.length;
    
    if (files.length > remainingSlots) {
      toast.error(`You can only upload ${remainingSlots} more image(s)`);
    }
    
    const validFiles = files.slice(0, remainingSlots).filter(file => {
      if (!file.type.startsWith('image/')) {
        toast.error(`${file.name} is not an image`);
        return false;
      }
      if (file.size > 5 * 1024 * 1024) {
        toast.error(`${file.name} exceeds 5MB limit`);
        return false;
      }
      return true;
    });
    
    setVehicleImages((prev) => [...prev, ...validFiles]);
  };

  const handleLicenseImageUpload = (e) => {
    const files = Array.from(e.target.files);
    const remainingSlots = 2 - licenseImages.length;
    
    if (files.length > remainingSlots) {
      toast.error(`You can only upload ${remainingSlots} more license image(s)`);
    }
    
    const validFiles = files.slice(0, remainingSlots).filter(file => {
      if (!file.type.startsWith('image/')) {
        toast.error(`${file.name} is not an image`);
        return false;
      }
      if (file.size > 5 * 1024 * 1024) {
        toast.error(`${file.name} exceeds 5MB limit`);
        return false;
      }
      return true;
    });
    
    setLicenseImages((prev) => [...prev, ...validFiles]);
  };

  const removeVehicleImage = (index) => {
    setVehicleImages((prev) => prev.filter((_, i) => i !== index));
  };

  const removeLicenseImage = (index) => {
    setLicenseImages((prev) => prev.filter((_, i) => i !== index));
  };

  const validateForm = () => {
    const newErrors = {};

    if (!vehicleData.type) newErrors.type = "Vehicle type is required";
    if (!vehicleData.make) newErrors.make = "Make is required";
    if (!vehicleData.model) newErrors.model = "Model is required";
    if (!vehicleData.year) newErrors.year = "Year is required";
    if (!vehicleData.color) newErrors.color = "Color is required";
    if (!vehicleData.plateNumber) newErrors.plateNumber = "Plate number is required";
    if (vehicleImages.length === 0) newErrors.vehicleImages = "At least one vehicle image is required";
    
    // License validation
    if (!licenseData.licenseNumber) newErrors.licenseNumber = "License number is required";
    if (!licenseData.issueDate) newErrors.issueDate = "Issue date is required";
    if (!licenseData.expiryDate) newErrors.expiryDate = "Expiry date is required";
    if (licenseImages.length === 0) newErrors.licenseImages = "At least one license image is required";
    
    // Validate expiry date is after issue date
    if (licenseData.issueDate && licenseData.expiryDate && licenseData.issueDate > licenseData.expiryDate) {
      newErrors.expiryDate = "Expiry date must be after issue date";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validateForm()) {
      toast.error("Please fill in all required fields");
      return;
    }
    setLoading(true);
    try {
      // Upload vehicle images
      const uploadedVehicleImages = await uploadFiles(vehicleImages, "vehicles");
      
      // Upload license images
      const uploadedLicenseImages = await uploadFiles(licenseImages, "vehicle-licenses");

      // Build payload matching API structure
      const payload = {
        ownerId: user?._id || user?.id, // Get from auth store
        type: vehicleData.type,
        images: uploadedVehicleImages, // Array of { url, publicId }
        plateNumber: vehicleData.plateNumber,
        color: vehicleData.color,
        make: vehicleData.make,
        model: vehicleData.model,
        year: parseInt(vehicleData.year, 10),
        vehicleLicense: {
          images: uploadedLicenseImages, // Array of { url, publicId }
          issueDate: format(licenseData.issueDate, "yyyy-MM-dd"),
          expiryDate: format(licenseData.expiryDate, "yyyy-MM-dd"),
          licenseNumber: licenseData.licenseNumber,
        },
      };

      console.log("Creating vehicle with payload:", payload);
      await createVehicle(payload);

      // Reset form and close modal
      resetForm();
      onClose();
    } catch (error) {
      setLoading(false);
      console.error("Error creating vehicle:", error);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setVehicleData({
      type: "",
      make: "",
      model: "",
      year: "",
      color: "",
      plateNumber: "",
    });
    setLicenseData({
      licenseNumber: "",
      issueDate: null,
      expiryDate: null,
    });
    setVehicleImages([]);
    setLicenseImages([]);
    setErrors({});
  };

  const vehicleTypes = [
    { value: "car", label: "Car" },
    { value: "motorcycle", label: "Motorcycle" },
    { value: "bicycle", label: "Bicycle" },
    { value: "van", label: "Van" },
    { value: "truck", label: "Truck" },
  ];

  const carMakes = [
    { value: "Toyota", label: "Toyota" },
    { value: "Honda", label: "Honda" },
    { value: "Ford", label: "Ford" },
    { value: "Nissan", label: "Nissan" },
    { value: "Hyundai", label: "Hyundai" },
    { value: "Kia", label: "Kia" },
    { value: "Mercedes-Benz", label: "Mercedes-Benz" },
    { value: "BMW", label: "BMW" },
    { value: "Volkswagen", label: "Volkswagen" },
    { value: "Lexus", label: "Lexus" },
  ];

  const colors = [
    { value: "Red", label: "Red", hex: "#EF4444" },
    { value: "Blue", label: "Blue", hex: "#3B82F6" },
    { value: "Black", label: "Black", hex: "#1F2937" },
    { value: "White", label: "White", hex: "#F9FAFB" },
    { value: "Silver", label: "Silver", hex: "#9CA3AF" },
    { value: "Gray", label: "Gray", hex: "#6B7280" },
    { value: "Green", label: "Green", hex: "#22C55E" },
    { value: "Yellow", label: "Yellow", hex: "#EAB308" },
  ];

  const years = Array.from({ length: 25 }, (_, i) => new Date().getFullYear() - i);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title=""
      size="lg"
      buttons={[
        {
          label: "Clear Form",
          onClick: resetForm,
          style: "bg-white text-red-600 border border-red-600 hover:bg-red-50",
          disabled: isCreating,
        },
        {
          label: isCreating || loading ? (
            <div className="flex items-center">
              <Loader2 className="w-4 h-4 animate-spin mr-2" />
              Creating...
            </div>
          ) : (
            "Create Vehicle"
          ),
          onClick: handleSave,
          primary: true,
          disabled: isCreating,
        },
      ]}
    >
      <div className="space-y-6 max-h-[70vh] px-8">
        {/* Vehicle Details Section */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Vehicle Details</h3>
          
          <div className="space-y-4">
            {/* Vehicle Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Vehicle Type <span className="text-red-500">*</span>
              </label>
              <select
                value={vehicleData.type}
                onChange={(e) => handleInputChange("type", e.target.value)}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.type ? "border-red-500" : "border-gray-300"
                }`}
              >
                <option value="">Select vehicle type</option>
                {vehicleTypes.map((type) => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
              {errors.type && <p className="text-red-500 text-sm mt-1">{errors.type}</p>}
            </div>

            {/* Make and Model */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Make <span className="text-red-500">*</span>
                </label>
                <select
                  value={vehicleData.make}
                  onChange={(e) => handleInputChange("make", e.target.value)}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.make ? "border-red-500" : "border-gray-300"
                  }`}
                >
                  <option value="">Select make</option>
                  {carMakes.map((make) => (
                    <option key={make.value} value={make.value}>
                      {make.label}
                    </option>
                  ))}
                </select>
                {errors.make && <p className="text-red-500 text-sm mt-1">{errors.make}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Model <span className="text-red-500">*</span>
                </label>
                <Input
                  placeholder="e.g., Corolla, Civic"
                  value={vehicleData.model}
                  onChange={(e) => handleInputChange("model", e.target.value)}
                  className={errors.model ? "border-red-500" : ""}
                />
                {errors.model && <p className="text-red-500 text-sm mt-1">{errors.model}</p>}
              </div>
            </div>

            {/* Year and Color */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Year <span className="text-red-500">*</span>
                </label>
                <select
                  value={vehicleData.year}
                  onChange={(e) => handleInputChange("year", e.target.value)}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.year ? "border-red-500" : "border-gray-300"
                  }`}
                >
                  <option value="">Select year</option>
                  {years.map((year) => (
                    <option key={year} value={year.toString()}>
                      {year}
                    </option>
                  ))}
                </select>
                {errors.year && <p className="text-red-500 text-sm mt-1">{errors.year}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Color <span className="text-red-500">*</span>
                </label>
                <select
                  value={vehicleData.color}
                  onChange={(e) => handleInputChange("color", e.target.value)}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.color ? "border-red-500" : "border-gray-300"
                  }`}
                >
                  <option value="">Select color</option>
                  {colors.map((color) => (
                    <option key={color.value} value={color.value}>
                      {color.label}
                    </option>
                  ))}
                </select>
                {errors.color && <p className="text-red-500 text-sm mt-1">{errors.color}</p>}
              </div>
            </div>

            {/* Plate Number */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Plate Number <span className="text-red-500">*</span>
              </label>
              <Input
                placeholder="e.g., ABC-123-XYZ"
                value={vehicleData.plateNumber}
                onChange={(e) => handleInputChange("plateNumber", e.target.value.toUpperCase())}
                className={errors.plateNumber ? "border-red-500" : ""}
              />
              {errors.plateNumber && <p className="text-red-500 text-sm mt-1">{errors.plateNumber}</p>}
            </div>

            {/* Vehicle Images */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Vehicle Images <span className="text-red-500">*</span> (Max 5)
              </label>
              <div className="grid grid-cols-5 gap-2">
                {[...Array(5)].map((_, index) => (
                  <div key={index} className="relative aspect-square">
                    {index < vehicleImages.length ? (
                      <div className="relative w-full h-full">
                        <img
                          src={URL.createObjectURL(vehicleImages[index])}
                          alt={`Vehicle ${index + 1}`}
                          className="w-full h-full object-cover rounded-lg border-2 border-blue-500"
                        />
                        <button
                          type="button"
                          onClick={() => removeVehicleImage(index)}
                          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 shadow-md"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </div>
                    ) : (
                      <label
                        className="w-full h-full rounded-lg border-2 border-dashed border-gray-300 
                          flex items-center justify-center cursor-pointer hover:border-gray-400 hover:bg-gray-50"
                      >
                        <ImagePlus className="h-6 w-6 text-gray-400" />
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={handleVehicleImageUpload}
                          multiple
                        />
                      </label>
                    )}
                  </div>
                ))}
              </div>
              {errors.vehicleImages && <p className="text-red-500 text-sm mt-1">{errors.vehicleImages}</p>}
              <p className="text-sm text-gray-500 mt-1">{vehicleImages.length}/5 images uploaded</p>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-200" />

        {/* Vehicle License Section */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Vehicle License</h3>
          
          <div className="space-y-4">
            {/* License Number */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                License Number <span className="text-red-500">*</span>
              </label>
              <Input
                placeholder="Enter license number"
                value={licenseData.licenseNumber}
                onChange={(e) => handleLicenseInputChange("licenseNumber", e.target.value.toUpperCase())}
                className={errors.licenseNumber ? "border-red-500" : ""}
              />
              {errors.licenseNumber && <p className="text-red-500 text-sm mt-1">{errors.licenseNumber}</p>}
            </div>

            {/* Issue Date and Expiry Date */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Issue Date <span className="text-red-500">*</span>
                </label>
                <Popover>
                  <PopoverTrigger asChild>
                    <div
                      className={`h-10 w-full rounded-md border px-3 flex items-center justify-between cursor-pointer hover:bg-gray-50 ${
                        errors.issueDate ? "border-red-500" : "border-gray-300"
                      }`}
                    >
                      <span className={licenseData.issueDate ? "text-gray-900" : "text-gray-400"}>
                        {licenseData.issueDate ? format(licenseData.issueDate, "dd MMM yyyy") : "Select date"}
                      </span>
                      <Calendar className="h-4 w-4 text-gray-400" />
                    </div>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0 z-[999]" align="start">
                    <CalendarComponent
                      mode="single"
                      className=""
                      selected={licenseData.issueDate}
                      onSelect={(date) => handleLicenseInputChange("issueDate", date)}
                      initialFocus

                    />
                  </PopoverContent>
                </Popover>
                {errors.issueDate && <p className="text-red-500 text-sm mt-1">{errors.issueDate}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Expiry Date <span className="text-red-500">*</span>
                </label>
                <Popover>
                  <PopoverTrigger asChild>
                    <div
                      className={`h-10 w-full rounded-md border px-3 flex items-center justify-between cursor-pointer hover:bg-gray-50 ${
                        errors.expiryDate ? "border-red-500" : "border-gray-300"
                      }`}
                    >
                      <span className={licenseData.expiryDate ? "text-gray-900" : "text-gray-400"}>
                        {licenseData.expiryDate ? format(licenseData.expiryDate, "dd MMM yyyy") : "Select date"}
                      </span>
                      <Calendar className="h-4 w-4 text-gray-400" />
                    </div>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0 z-[999]" align="start">
                    <CalendarComponent
                      mode="single"
                      className=""
                      selected={licenseData.expiryDate}
                      onSelect={(date) => handleLicenseInputChange("expiryDate", date)}
                      initialFocus
                      disabled={(date) => licenseData.issueDate && date < licenseData.issueDate}
                    />
                  </PopoverContent>
                </Popover>
                {errors.expiryDate && <p className="text-red-500 text-sm mt-1">{errors.expiryDate}</p>}
              </div>
            </div>

            {/* License Images */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                License Images <span className="text-red-500">*</span> (Front & Back)
              </label>
              <div className="grid grid-cols-2 gap-4">
                {[0, 1].map((index) => (
                  <div key={index} className="relative">
                    {index < licenseImages.length ? (
                      <div className="relative aspect-video">
                        <img
                          src={URL.createObjectURL(licenseImages[index])}
                          alt={`License ${index === 0 ? "Front" : "Back"}`}
                          className="w-full h-full object-cover rounded-lg border-2 border-blue-500"
                        />
                        <button
                          type="button"
                          onClick={() => removeLicenseImage(index)}
                          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 shadow-md"
                        >
                          <X className="h-3 w-3" />
                        </button>
                        <span className="absolute bottom-1 left-1 text-xs bg-black/50 text-white px-2 py-0.5 rounded">
                          {index === 0 ? "Front" : "Back"}
                        </span>
                      </div>
                    ) : (
                      <label
                        className="aspect-video rounded-lg border-2 border-dashed border-gray-300 
                          flex flex-col items-center justify-center cursor-pointer hover:border-gray-400 hover:bg-gray-50"
                      >
                        <FileText className="h-8 w-8 text-gray-400 mb-1" />
                        <span className="text-sm text-gray-500">{index === 0 ? "Front" : "Back"}</span>
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={handleLicenseImageUpload}
                        />
                      </label>
                    )}
                  </div>
                ))}
              </div>
              {errors.licenseImages && <p className="text-red-500 text-sm mt-1">{errors.licenseImages}</p>}
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
}