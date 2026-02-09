import React, { useEffect, useState, useMemo } from 'react';
import { Calendar, ChevronDown, MapPin, Car, FileText } from 'lucide-react';
import { CustomButton } from '../CustomButton';
import { DatePicker } from '../DatePickerComponent';
import useUserStore from '@/store/UserStore';

export const LicenseForm = ({ formData, onInputChange, onSave, loading, vendorId }) => {
  const { getVendorVehicleById, loading: vehicleLoading, vendorVehicles } = useUserStore()
  const [selectedVehicleIndex, setSelectedVehicleIndex] = useState(0)

  useEffect(() => {
    const id = vendorId || formData?.vendorId
   
    if (id) {
      getVendorVehicleById(id)
    }
  }, [getVendorVehicleById, vendorId, formData?.vendorId])
  // Get the vehicles array from the API response
  const vehicles = useMemo(() => {
    console.log("Vendor Vehicle Data:", vendorVehicles)
    if (!vendorVehicles) return []
    // Handle both response.data (array) and direct array
    return Array.isArray(vendorVehicles) ? vendorVehicles : vendorVehicles?.data || []
  }, [vendorVehicles])

  // Get the selected vehicle and its license
  const selectedVehicle = vehicles[selectedVehicleIndex] || null
  const vehicleLicense = selectedVehicle?.vehicleLicense || null

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A'
    const date = new Date(dateString)
    if (isNaN(date.getTime())) return 'N/A'
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })
  }

  // Check if a license has data
  const hasLicenseData = (license) => {
    return license && (license.licenseNumber || license.issueDate || license.expiryDate)
  }

  if (vehicleLoading) {
    return (
      <div className="space-y-6 bg-white p-6 rounded-lg">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
          <span className="ml-2 text-gray-600">Loading vehicle & license info...</span>
        </div>
      </div>
    )
  }

  if (vehicles.length === 0) {
    return (
      <div className="bg-white rounded-lg p-8 border">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <Car size={24} className="mx-auto" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No vehicles available </h3>
            <div className="text-sm text-gray-400">
              This rider has no registered vehicles or license information.
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Vehicle Selector - Only show if multiple vehicles */}
      {vehicles.length > 1 && (
        <div className="bg-white rounded-lg p-4 border">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Select Vehicle ({vehicles.length} registered)
          </label>
          <div className="flex flex-wrap gap-2">
            {vehicles.map((vehicle, index) => (
              <button
                key={vehicle._id}
                onClick={() => setSelectedVehicleIndex(index)}
                className={`px-4 py-2 rounded-lg text-sm font-medium border transition-colors ${
                  selectedVehicleIndex === index
                    ? 'bg-[#1F1F76] text-white border-[#1F1F76]'
                    : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                }`}
              >
                {vehicle.make} {vehicle.model} ({vehicle.year}) - {vehicle.plateNumber}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Vehicle Info Card */}
      <div className="bg-white rounded-lg p-8 border">
        <h2 className="text-lg font-medium text-gray-900 mb-6 flex items-center gap-2">
          <Car className="w-5 h-5 text-gray-600" />
          Vehicle Info
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3  gap-8">
          <div>
            <label className="block text-sm font-medium text-gray-500 mb-1">Make</label>
            <p className="text-sm text-gray-900">{selectedVehicle?.make || 'N/A'}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-500 mb-1">Model</label>
            <p className="text-sm text-gray-900">{selectedVehicle?.model || 'N/A'}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-500 mb-1">Year</label>
            <p className="text-sm text-gray-900">{selectedVehicle?.year || 'N/A'}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-500 mb-1">Plate Number</label>
            <p className="text-sm text-gray-900">{selectedVehicle?.plateNumber || 'N/A'}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-500 mb-1">Color</label>
            <div className="flex items-center gap-2">
              <div 
                className="w-4 h-4 rounded-full border border-gray-300" 
                style={{ backgroundColor: selectedVehicle?.color?.toLowerCase() || '#ccc' }}
              />
              <p className="text-sm text-gray-900">{selectedVehicle?.color || 'N/A'}</p>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-500 mb-1">Type</label>
            <p className="text-sm text-gray-900 capitalize">{selectedVehicle?.type || 'N/A'}</p>
          </div>
        </div>

        {/* Vehicle Images */}
        {selectedVehicle?.images?.length > 0 && (
          <div className="mt-6">
            <label className="block text-sm font-medium text-gray-500 mb-2">Vehicle Images</label>
            <div className="flex flex-wrap gap-3">
              {selectedVehicle.images.map((image, idx) => (
                <img
                  key={image._id || idx}
                  src={image.url}
                  alt={`Vehicle image ${idx + 1}`}
                  className="w-24 h-24 object-cover rounded-lg border"
                  onError={(e) => {
                    e.target.style.display = 'none'
                  }}
                />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* License Info Card */}
      <div className="bg-white rounded-lg p-8 lg:flex gap-52 border">
        <h2 className="text-lg font-medium text-gray-900 mb-6 flex items-center gap-2">
          <FileText className="w-5 h-5 text-gray-600" />
          License Info
        </h2>
        
        {hasLicenseData(vehicleLicense) ? (
          <div className="grid lg:grid-cols-2 gap-6 flex-1 flex-wrap">
            {/* License Number */}
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                License Number
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={vehicleLicense?.licenseNumber || ''}
                  onChange={(e) => onInputChange('licenseNumber', e.target.value)}
                  className="flex-1 p-2 border rounded-lg focus:ring-0"
                  placeholder="Enter license number"
                />
              </div>
            </div>

            {/* Date Fields */}
            <div className="flex flex-col gap-4 lg:flex-row col-span-2">
              <div className="w-full sm:w-[40%]">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Issue Date
                </label>
                <DatePicker
                  value={vehicleLicense?.issueDate ? new Date(vehicleLicense.issueDate) : null}
                  onChange={(date) => onInputChange('issueDate', date)}
                />
              </div>
              <div className="w-full sm:w-[40%]">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Expiry Date
                </label>
                <DatePicker
                  value={vehicleLicense?.expiryDate ? new Date(vehicleLicense.expiryDate) : null}
                  onChange={(date) => onInputChange('expiryDate', date)}
                />
              </div>
            </div>

            {/* License Images */}
            {vehicleLicense?.images?.length > 0 && (
              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  License Images
                </label>
                <div className="flex flex-wrap gap-3">
                  {vehicleLicense.images.map((image, idx) => (
                    <img
                      key={image._id || idx}
                      src={image.url}
                      alt={`License image ${idx + 1}`}
                      className="w-24 h-24 object-cover rounded-lg border"
                      onError={(e) => {
                        e.target.style.display = 'none'
                      }}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Save Button */}
            <div className="col-span-2 mt-6 flex justify-start lg:justify-end">
              <CustomButton
                onClick={onSave}
                buttonVariant={'primary'}
                disabled={loading}
                className="px-4 py-2 hover:text-white rounded-lg hover:bg-indigo-700"
              >
                {loading ? 'Saving...' : 'Save changes'}
              </CustomButton>
            </div>
          </div>
        ) : (
          <div className="flex-1 flex items-center justify-center py-12">
            <div className="text-center">
              <FileText className="w-10 h-10 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500 font-medium">No License Data</p>
              <p className="text-sm text-gray-400 mt-1">
                No license information available for this vehicle.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}