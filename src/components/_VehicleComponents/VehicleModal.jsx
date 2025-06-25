import { useEffect, useState, useCallback } from "react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Modal from "../ModalComponent"
import useVehicleStore from "@/store/VehicleStore"
import { toast } from "react-hot-toast"
import { debounce } from "lodash"

export const VehicleModal = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState({
    vehicle_type: "",
    make: "",
    model: "",
    year: "",
    color: "",
    plate_number: "",
    issue_date: "",
    expiry_date: "",
  })

  const [phoneNumber, setPhoneNumber] = useState("")
  const [selectedRider, setSelectedRider] = useState(null)
  const [riderSearching, setRiderSearching] = useState(false)
  const [vehicleImages, setVehicleImages] = useState([])
  const [frontImage, setFrontImage] = useState(null)
  const [backImage, setBackImage] = useState(null)

  const { createVehicle, getRiderByPhone, loading, fetchVehicles } = useVehicleStore()

  // Debounced rider search
  const debouncedRiderSearch = useCallback(
    debounce(async (phone) => {
      if (phone.length >= 6) {
        setRiderSearching(true)
        try {
          const rider = await getRiderByPhone(phone)
          if (rider) {
            setSelectedRider(rider)
            //toast.success(`Rider found: ${rider.firstName || rider.first_name} ${rider.lastName || rider.last_name}`)
          } else {
            setSelectedRider(null)
            toast.error("No rider found with this phone number")
          }
        } catch (error) {
          setSelectedRider(null)
        } finally {
          setRiderSearching(false)
        }
      } else {
        setSelectedRider(null)
      }
    }, 800),
    [getRiderByPhone],
  )

  useEffect(() => {
    if (phoneNumber) {
      debouncedRiderSearch(phoneNumber)
    }
    return () => {
      debouncedRiderSearch.cancel()
    }
  }, [phoneNumber, debouncedRiderSearch])

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleImageUpload = (event, type) => {
    const files = Array.from(event.target.files)

    if (type === "vehicle") {
      setVehicleImages((prev) => [...prev, ...files].slice(0, 5)) // Max 5 images
    } else if (type === "front") {
      setFrontImage(files[0])
    } else if (type === "back") {
      setBackImage(files[0])
    }
  }

  const removeImage = (index, type) => {
    if (type === "vehicle") {
      setVehicleImages((prev) => prev.filter((_, i) => i !== index))
    } else if (type === "front") {
      setFrontImage(null)
    } else if (type === "back") {
      setBackImage(null)
    }
  }

  const validateForm = () => {
    const requiredFields = ["vehicle_type", "make", "model", "year", "color", "plate_number"]
    const missingFields = requiredFields.filter((field) => !formData[field])

    if (missingFields.length > 0) {
      toast.error(`Please fill in: ${missingFields.join(", ")}`)
      return false
    }

    if (!selectedRider) {
      toast.error("Please select a rider by entering their phone number")
      return false
    }

    if (vehicleImages.length === 0) {
      toast.error("Please upload at least one vehicle image")
      return false
    }

    return true
  }

  const handleSave = async () => {
    if (!validateForm()) return

    try {
      const vehicleData = {
        ...formData,
        vehicle_images: vehicleImages,
        front_image: frontImage,
        back_image: backImage,
        rider_id: selectedRider._id,
      }

      console.log("Creating vehicle with data:", vehicleData)

      await createVehicle(vehicleData)
      toast.success("Vehicle created successfully!")

      // Refresh the vehicles list
      await fetchVehicles()

      // Reset form and close modal
      handleClose()
    } catch (error) {
      toast.error("Failed to create vehicle")
    }
  }

  const handleClose = () => {
    // Reset all form data
    setFormData({
      vehicle_type: "",
      make: "",
      model: "",
      year: "",
      color: "",
      plate_number: "",
      issue_date: "",
      expiry_date: "",
    })
    setPhoneNumber("")
    setSelectedRider(null)
    setVehicleImages([])
    setFrontImage(null)
    setBackImage(null)
    onClose()
  }

  const currentYear = new Date().getFullYear()
  const years = Array.from({ length: 30 }, (_, i) => currentYear - i)

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Add New Vehicle"
      buttons={[
        {
          label: "Cancel",
          onClick: handleClose,
          style: "text-gray-600 hover:text-gray-700 hover:bg-gray-50 bg-white border border-gray-200",
        },
        {
          label: loading ? "Creating..." : "Create Vehicle",
          onClick: handleSave,
          primary: true,
          disabled: loading,
        },
      ]}
    >
      <div className="space-y-4 p-4">
        {/* Rider Phone Number Search */}
        <div className="space-y-2">
          <Label htmlFor="phone">Rider Phone Number</Label>
          <Input
            id="phone"
            type="tel"
            placeholder="Enter rider's phone number"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
          />
          {riderSearching && <p className="text-sm text-blue-600">Searching for rider...</p>}
          {selectedRider && (
            <div className="p-2 bg-green-50 border border-green-200 rounded">
              <p className="text-sm text-green-800">
                ✓ Rider found: {selectedRider.firstName || selectedRider.first_name || ""}{" "}
                {selectedRider.lastName || selectedRider.last_name || ""}
              </p>
              <p className="text-xs text-green-600">ID: {selectedRider._id}</p>
            </div>
          )}
        </div>

        {/* Vehicle Type */}
        <div className="space-y-2 text-left">
          <Label>Vehicle Type</Label>
          <Select value={formData.vehicle_type} onValueChange={(value) => handleInputChange("vehicle_type", value)}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select vehicle type" />
            </SelectTrigger>
            <SelectContent className="z-[200]">
              <SelectItem value="car">Car</SelectItem>
              <SelectItem value="bike">Bike</SelectItem>
              <SelectItem value="van">Van</SelectItem>
              <SelectItem value="truck">Truck</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Vehicle Make */}
        <div className="space-y-2 text-left">
          <Label>Vehicle Make</Label>
          <Select value={formData.make} onValueChange={(value) => handleInputChange("make", value)}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select make" />
            </SelectTrigger>
            <SelectContent className="z-[200]">
              <SelectItem value="toyota">Toyota</SelectItem>
              <SelectItem value="honda">Honda</SelectItem>
              <SelectItem value="ford">Ford</SelectItem>
              <SelectItem value="nissan">Nissan</SelectItem>
              <SelectItem value="hyundai">Hyundai</SelectItem>
              <SelectItem value="kia">Kia</SelectItem>
              <SelectItem value="mercedes">Mercedes</SelectItem>
              <SelectItem value="bmw">BMW</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="grid grid-cols-2 gap-4 text-left">
          {/* Vehicle Model */}
          <div className="space-y-2">
            <Label>Vehicle Model</Label>
            <Input
              placeholder="Enter model"
              value={formData.model}
              onChange={(e) => handleInputChange("model", e.target.value)}
            />
          </div>

          {/* Year */}
          <div className="space-y-2 text-left">
            <Label>Year</Label>
            <Select value={formData.year} onValueChange={(value) => handleInputChange("year", value)}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select year" />
              </SelectTrigger>
              <SelectContent className="z-[200] max-h-[200px]">
                {years.map((year) => (
                  <SelectItem key={year} value={year.toString()}>
                    {year}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Color */}
        <div className="space-y-2 text-left">
          <Label>Color</Label>
          <Select value={formData.color} onValueChange={(value) => handleInputChange("color", value)}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select color">
                {formData.color && (
                  <div className="flex items-center gap-2">
                    <div
                      className={`w-4 h-4 rounded-full ${
                        formData.color === "red"
                          ? "bg-red-500"
                          : formData.color === "blue"
                            ? "bg-blue-500"
                            : formData.color === "black"
                              ? "bg-black"
                              : formData.color === "white"
                                ? "bg-white border"
                                : formData.color === "silver"
                                  ? "bg-gray-400"
                                  : "bg-gray-300"
                      }`}
                    />
                    {formData.color.charAt(0).toUpperCase() + formData.color.slice(1)}
                  </div>
                )}
              </SelectValue>
            </SelectTrigger>
            <SelectContent className="z-[200]">
              <SelectItem value="red">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full bg-red-500" />
                  Red
                </div>
              </SelectItem>
              <SelectItem value="blue">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full bg-blue-500" />
                  Blue
                </div>
              </SelectItem>
              <SelectItem value="black">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full bg-black" />
                  Black
                </div>
              </SelectItem>
              <SelectItem value="white">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full bg-white border" />
                  White
                </div>
              </SelectItem>
              <SelectItem value="silver">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full bg-gray-400" />
                  Silver
                </div>
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* License Plate */}
        <div className="space-y-2 text-left">
          <Label>License Plate Number</Label>
          <Input
            placeholder="Enter plate number"
            value={formData.plate_number}
            onChange={(e) => handleInputChange("plate_number", e.target.value.toUpperCase())}
          />
        </div>

        {/* License Dates */}
        <div className="grid grid-cols-2 gap-4 text-left">
          <div className="space-y-2">
            <Label>License Issue Date</Label>
            <Input
              type="date"
              value={formData.issue_date}
              onChange={(e) => handleInputChange("issue_date", e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label>License Expiry Date</Label>
            <Input
              type="date"
              value={formData.expiry_date}
              onChange={(e) => handleInputChange("expiry_date", e.target.value)}
            />
          </div>
        </div>

        {/* Vehicle Images Upload */}
        <div className="space-y-2">
          <Label>Vehicle Images (Max 5)</Label>
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={(e) => handleImageUpload(e, "vehicle")}
            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
          />
          <div className="grid grid-cols-5 gap-2 mt-2">
            {vehicleImages.map((image, index) => (
              <div key={index} className="relative aspect-square bg-gray-100 rounded-lg overflow-hidden">
                <img
                  src={URL.createObjectURL(image) || "/placeholder.svg"}
                  alt={`Vehicle ${index + 1}`}
                  className="w-full h-full object-cover"
                />
                <button
                  onClick={() => removeImage(index, "vehicle")}
                  className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs"
                >
                  ×
                </button>
              </div>
            ))}
            {Array(5 - vehicleImages.length)
              .fill(0)
              .map((_, index) => (
                <div
                  key={`empty-${index}`}
                  className="aspect-square bg-gray-100 rounded-lg flex items-center justify-center"
                >
                  <div className="w-8 h-8 bg-gray-200 rounded" />
                </div>
              ))}
          </div>
        </div>

        {/* License Images */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>License Front Image</Label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => handleImageUpload(e, "front")}
              className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            />
            {frontImage && (
              <div className="relative aspect-video bg-gray-100 rounded-lg overflow-hidden">
                <img
                  src={URL.createObjectURL(frontImage) || "/placeholder.svg"}
                  alt="License Front"
                  className="w-full h-full object-cover"
                />
                <button
                  onClick={() => removeImage(0, "front")}
                  className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs"
                >
                  ×
                </button>
              </div>
            )}
          </div>

          <div className="space-y-2">
            <Label>License Back Image</Label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => handleImageUpload(e, "back")}
              className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            />
            {backImage && (
              <div className="relative aspect-video bg-gray-100 rounded-lg overflow-hidden">
                <img
                  src={URL.createObjectURL(backImage) || "/placeholder.svg"}
                  alt="License Back"
                  className="w-full h-full object-cover"
                />
                <button
                  onClick={() => removeImage(0, "back")}
                  className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs"
                >
                  ×
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </Modal>
  )
}
