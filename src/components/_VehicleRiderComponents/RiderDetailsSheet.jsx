// components/_VehicleRiderComponents/RiderDetailsSheet.jsx
import { useEffect, useState } from 'react';
import { format } from 'date-fns';
import { 
  X, 
  User, 
  Phone, 
  Mail, 
  MapPin, 
  Calendar, 
  Car, 
  FileText,
  Loader2,
  Edit2,
  Save,
  ChevronDown
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import useRiderStore from '@/store/riderStore';
import { cn } from '@/lib/utils';

const statusOptions = [
  { value: 'activated', label: 'Active' },
  { value: 'inactive', label: 'Inactive' },
  { value: 'pending', label: 'Pending' },
  { value: 'suspended', label: 'Suspended' },
];

export const RiderDetailsSheet = ({ isOpen, onClose, riderId }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    firstname: '',
    lastname: '',
    email: '',
    phone: '',
  });
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);
  const [showStatusDropdown, setShowStatusDropdown] = useState(false);

  const { 
    getSingleRider, 
    updateRiderDetails, 
    updateRiderStatus,
    singleRiderData,
    loading,
    isUpdating 
  } = useRiderStore();

  useEffect(() => {
    if (isOpen && riderId) {
      getSingleRider(riderId);
    }
  }, [isOpen, riderId, getSingleRider]);

  useEffect(() => {
    if (singleRiderData) {
      setEditData({
        firstname: singleRiderData.firstname || '',
        lastname: singleRiderData.lastname || '',
        email: singleRiderData.email || '',
        phone: singleRiderData.phone || '',
      });
    }
  }, [singleRiderData]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditData(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    try {
      await updateRiderDetails(riderId, editData);
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating rider:', error);
    }
  };

  const handleStatusChange = async (newStatus) => {
    setIsUpdatingStatus(true);
    try {
      await updateRiderStatus(riderId, newStatus);
      setShowStatusDropdown(false);
    } catch (error) {
      console.error('Error updating status:', error);
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  const handleClose = () => {
    setIsEditing(false);
    setShowStatusDropdown(false);
    onClose();
  };

  const getStatusBadgeColor = (status) => {
    const statusLower = status?.toLowerCase();
    
    switch (statusLower) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'inactive':
        return 'bg-red-100 text-red-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'suspended':
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatAddress = (address) => {
    if (!address) return 'No address';
    if (typeof address === 'string') return address;
    
    const parts = [address.street, address.city, address.state].filter(Boolean);
    return parts.length > 0 ? parts.join(', ') : 'No address';
  };

  const getFullName = (rider) => {
    if (!rider) return 'N/A';
    const firstName = rider.firstname || '';
    const lastName = rider.lastname || '';
    return `${firstName} ${lastName}`.trim() || 'N/A';
  };

  if (!isOpen) return null;

  const rider = singleRiderData;

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 z-50"
        onClick={handleClose}
      />

      {/* Sheet */}
      <div className="fixed right-0 top-0 h-full w-full max-w-md bg-white shadow-xl z-50 overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-semibold text-gray-900">Rider Details</h2>
          <button
            onClick={handleClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="h-5 w-5 text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
            </div>
          ) : rider ? (
            <div className="p-6 space-y-6">
              {/* Profile Header */}
              <div className="flex items-center gap-4">
                <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center overflow-hidden flex-shrink-0">
                  {rider.profileImage?.url ? (
                    <img 
                      src={rider.profileImage.url} 
                      alt={getFullName(rider)}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <User className="w-8 h-8 text-gray-400" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-lg font-semibold text-gray-900 truncate">
                    {getFullName(rider)}
                  </h3>
                  <p className="text-sm text-gray-500 truncate">
                    Rider ID: {rider._id || rider.id || 'N/A'}
                  </p>
                  
                  {/* Status Badge with Dropdown */}
                  <div className="relative mt-2">
                    <button
                      onClick={() => setShowStatusDropdown(!showStatusDropdown)}
                      className={cn(
                        'inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium cursor-pointer',
                        getStatusBadgeColor(rider.status)
                      )}
                      disabled={isUpdatingStatus}
                    >
                      {isUpdatingStatus ? (
                        <Loader2 className="w-3 h-3 animate-spin" />
                      ) : (
                        <>
                          <span>{rider.status || 'Unknown'}</span>
                          <ChevronDown className="w-3 h-3" />
                        </>
                      )}
                    </button>

                    {showStatusDropdown && (
                      <div className="absolute top-full left-0 mt-1 bg-white border rounded-lg shadow-lg z-10 min-w-32">
                        {statusOptions.map((option) => (
                          <button
                            key={option.value}
                            onClick={() => handleStatusChange(option.value)}
                            className={cn(
                              'w-full px-4 py-2 text-left text-sm hover:bg-gray-50 first:rounded-t-lg last:rounded-b-lg',
                              rider.status?.toLowerCase() === option.value && 'bg-gray-100'
                            )}
                          >
                            {option.label}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Personal Information */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium text-gray-900">Personal Information</h4>
                  <button
                    onClick={() => setIsEditing(!isEditing)}
                    className="text-blue-600 hover:text-blue-700 text-sm flex items-center gap-1"
                  >
                    <Edit2 className="w-4 h-4" />
                    <span>{isEditing ? 'Cancel' : 'Edit'}</span>
                  </button>
                </div>

                {isEditing ? (
                  <div className="space-y-3">
                    <div className="grid grid-cols-2 gap-3">
                      <Input
                        name="firstname"
                        value={editData.firstname}
                        onChange={handleInputChange}
                        placeholder="First name"
                        className="h-10"
                      />
                      <Input
                        name="lastname"
                        value={editData.lastname}
                        onChange={handleInputChange}
                        placeholder="Last name"
                        className="h-10"
                      />
                    </div>
                    <Input
                      name="email"
                      type="email"
                      value={editData.email}
                      onChange={handleInputChange}
                      placeholder="Email"
                      className="h-10"
                    />
                    <Input
                      name="phone"
                      value={editData.phone}
                      onChange={handleInputChange}
                      placeholder="Phone"
                      className="h-10"
                    />
                    <Button
                      onClick={handleSave}
                      disabled={isUpdating}
                      className="w-full bg-blue-600 hover:bg-blue-700"
                    >
                      {isUpdating ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          <span>Saving...</span>
                        </>
                      ) : (
                        <>
                          <Save className="w-4 h-4 mr-2" />
                          <span>Save Changes</span>
                        </>
                      )}
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 text-gray-600">
                      <Mail className="w-4 h-4 text-gray-400 flex-shrink-0" />
                      <span className="truncate">{rider.email || 'No email'}</span>
                    </div>
                    <div className="flex items-center gap-3 text-gray-600">
                      <Phone className="w-4 h-4 text-gray-400 flex-shrink-0" />
                      <span>{rider.phone || rider.phoneNumber || 'No phone'}</span>
                    </div>
                    <div className="flex items-start gap-3 text-gray-600">
                      <MapPin className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                      <span>{formatAddress(rider.address)}</span>
                    </div>
                    {rider.createdAt && (
                      <div className="flex items-center gap-3 text-gray-600">
                        <Calendar className="w-4 h-4 text-gray-400 flex-shrink-0" />
                        <span>Joined {format(new Date(rider.createdAt), 'PPP')}</span>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Vehicle Information */}
              {(rider.vehicle || rider.type || rider.make) && (
                <div className="space-y-4 pt-4 border-t">
                  <h4 className="font-medium text-gray-900">Vehicle Information</h4>
                  <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                    <div className="flex items-center gap-3">
                      <Car className="w-4 h-4 text-gray-400" />
                      <span className="capitalize">
                        {rider.vehicle?.type || rider.type || 'N/A'}
                      </span>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      {(rider.vehicle?.make || rider.make) && (
                        <div>
                          <span className="text-gray-500">Make: </span>
                          <span>{rider.vehicle?.make || rider.make}</span>
                        </div>
                      )}
                      {(rider.vehicle?.model || rider.model) && (
                        <div>
                          <span className="text-gray-500">Model: </span>
                          <span>{rider.vehicle?.model || rider.model}</span>
                        </div>
                      )}
                      {(rider.vehicle?.year || rider.year) && (
                        <div>
                          <span className="text-gray-500">Year: </span>
                          <span>{rider.vehicle?.year || rider.year}</span>
                        </div>
                      )}
                      {(rider.vehicle?.color || rider.color) && (
                        <div>
                          <span className="text-gray-500">Color: </span>
                          <span>{rider.vehicle?.color || rider.color}</span>
                        </div>
                      )}
                    </div>
                    
                    {(rider.vehicle?.plateNumber || rider.plateNumber) && (
                      <div className="text-sm">
                        <span className="text-gray-500">Plate Number: </span>
                        <span className="font-medium">
                          {rider.vehicle?.plateNumber || rider.plateNumber}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Vehicle Images */}
                  {renderVehicleImages(rider)}
                </div>
              )}

              {/* License Information */}
              {rider.vehicleLicense && (
                <div className="space-y-4 pt-4 border-t">
                  <h4 className="font-medium text-gray-900">License Information</h4>
                  <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                    <div className="flex items-center gap-3">
                      <FileText className="w-4 h-4 text-gray-400" />
                      <span>{rider.vehicleLicense.licenseNumber || 'N/A'}</span>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      {rider.vehicleLicense.issueDate && (
                        <div>
                          <span className="text-gray-500">Issue Date: </span>
                          <span>
                            {format(new Date(rider.vehicleLicense.issueDate), 'PP')}
                          </span>
                        </div>
                      )}
                      {rider.vehicleLicense.expiryDate && (
                        <div>
                          <span className="text-gray-500">Expiry Date: </span>
                          <span
                            className={
                              new Date(rider.vehicleLicense.expiryDate) < new Date()
                                ? 'text-red-600 font-medium'
                                : ''
                            }
                          >
                            {format(new Date(rider.vehicleLicense.expiryDate), 'PP')}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* License Images */}
                  {renderLicenseImages(rider)}
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center justify-center h-64 text-gray-500">
              No rider data found
            </div>
          )}
        </div>
      </div>
    </>
  );
};

// Helper function to render vehicle images
const renderVehicleImages = (rider) => {
  const images = rider.vehicle?.images || rider.images;
  
  if (!images || images.length === 0) return null;
  
  return (
    <div className="mt-3">
      <p className="text-sm text-gray-500 mb-2">Vehicle Images</p>
      <div className="grid grid-cols-3 gap-2">
        {images.map((img, index) => (
          <img
            key={index}
            src={img.url}
            alt={`Vehicle ${index + 1}`}
            className="w-full h-20 object-cover rounded-lg"
          />
        ))}
      </div>
    </div>
  );
};

// Helper function to render license images
const renderLicenseImages = (rider) => {
  const images = rider.vehicleLicense?.images;
  
  if (!images || images.length === 0) return null;
  
  return (
    <div className="mt-3">
      <p className="text-sm text-gray-500 mb-2">License Documents</p>
      <div className="grid grid-cols-2 gap-2">
        {images.map((img, index) => (
          <img
            key={index}
            src={img.url}
            alt={`License ${index + 1}`}
            className="w-full h-24 object-cover rounded-lg"
          />
        ))}
      </div>
    </div>
  );
};

export default RiderDetailsSheet;