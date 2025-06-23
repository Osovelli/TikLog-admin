/* import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { icons, MapPinCheck, MapPinIcon, MapPinnedIcon } from 'lucide-react';

const createCustomIcon = (iconUrl, iconSize) => {
  return L.icon({
    iconUrl,
    iconSize: [iconSize, iconSize],
    iconAnchor: [iconSize / 2, iconSize],
    popupAnchor: [0, -iconSize]
  });
};

const pickupIcon = createCustomIcon('/location-line.svg', 30);
const deliveryIcon = createCustomIcon('/location.svg', 30);
const pickupLocation = [40.6234, -74.1368]; // Example: West New Brighton area
const deliveryLocation = [40.5651, -74.1140]; // Example: Fort Wadsworth area

const routeCoordinates = [
    pickupLocation, // West New Brighton
    deliveryLocation, // George Brighton Heights
  ];

const DeliveryMap = ({deliveryData}) => {

  const center = [40.6132, -74.1420]; // Default center for Staten Island
  const zoom = 13;



  return (
    <MapContainer center={center} zoom={zoom} style={{ height: '500px', width: '100%', zIndex: '5' }}>
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      
      {pickupLocation && (
        <Marker position={pickupLocation} icon={pickupIcon} inter>
          <Popup>Pickup Location</Popup>
        </Marker>
      )}

      {deliveryLocation && (
        <Marker position={deliveryLocation} icon={deliveryIcon}>
          <Popup>Delivery Location</Popup>
        </Marker>
      )}
      <Polyline positions={routeCoordinates} color="#FF9800" weight={4} />
    </MapContainer>
  );
};

export default DeliveryMap */

import { useState, useEffect, useMemo } from "react"
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from "react-leaflet"
import "leaflet/dist/leaflet.css"
import L from "leaflet"
import {
  MapPin,
  User,
  Clock,
  Package,
  Car,
  Bike,
  Truck,
  Navigation,
  Phone,
  CheckCircle,
  AlertCircle,
  Loader2,
} from "lucide-react"

// Fix for default markers in react-leaflet
delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
})

// Enhanced custom icon creation with better styling
const createCustomIcon = (color, iconType = "pickup", size = 40) => {
  const svgIcon = `
    <svg width="${size}" height="${size + 10}" viewBox="0 0 ${size} ${size + 10}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <filter id="shadow-${iconType}" x="-50%" y="-50%" width="200%" height="200%">
          <feDropShadow dx="0" dy="2" stdDeviation="3" floodColor="rgba(0,0,0,0.3)"/>
        </filter>
      </defs>
      <path d="M${size / 2} 0C${size / 2 - size / 2.67} 0 0 ${size / 2.67} 0 ${size / 2}c0 ${size / 2.4} ${size / 2} ${size / 1.6} ${size / 2} ${size / 1.6}s${size / 2}-${size / 2.5} ${size / 2}-${size / 1.6}C${size} ${size / 2.67} ${size - size / 2.67} 0 ${size / 2} 0z" 
            fill="${color}" 
            filter="url(#shadow-${iconType})"
            stroke="white" 
            strokeWidth="2"/>
      <circle cx="${size / 2}" cy="${size / 2}" r="${size / 4}" fill="white"/>
      <text x="${size / 2}" y="${size / 2 + 4}" textAnchor="middle" fontSize="${size / 4}" fontWeight="bold" fill="${color}">
        ${iconType === "pickup" ? "P" : iconType === "delivery" ? "D" : "R"}
      </text>
    </svg>
  `
  return L.divIcon({
    html: svgIcon,
    iconSize: [size, size + 10],
    iconAnchor: [size / 2, size + 10],
    popupAnchor: [0, -(size + 10)],
    className: "custom-delivery-marker",
  })
}

// Calculate distance between two coordinates (Haversine formula)
const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371 // Radius of the Earth in kilometers
  const dLat = ((lat2 - lat1) * Math.PI) / 180
  const dLon = ((lon2 - lon1) * Math.PI) / 180
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLon / 2) * Math.sin(dLon / 2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  return R * c // Distance in kilometers
}

// Component to dynamically adjust map view
const MapViewController = ({ bounds, center, zoom }) => {
  const map = useMap()

  useEffect(() => {
    if (bounds && bounds.length > 1) {
      // Fit bounds with padding for better visibility
      map.fitBounds(bounds, {
        padding: [50, 50],
        maxZoom: 16,
      })
    } else if (center) {
      map.setView(center, zoom)
    }
  }, [map, bounds, center, zoom])

  return null
}

// Enhanced status indicator with animations
const StatusIndicator = ({ status, tripStartedAt, tripEndedAt, className = "" }) => {
  const getStatusConfig = (status) => {
    switch (status?.toLowerCase()) {
      case "completed":
        return {
          color: "bg-green-500",
          textColor: "text-green-800",
          bgColor: "bg-green-50",
          icon: <CheckCircle size={16} className="text-green-600" />,
        }
      case "in-progress":
        return {
          color: "bg-blue-500",
          textColor: "text-blue-800",
          bgColor: "bg-blue-50",
          icon: <Navigation size={16} className="text-blue-600 animate-pulse" />,
        }
      case "accepted":
        return {
          color: "bg-purple-500",
          textColor: "text-purple-800",
          bgColor: "bg-purple-50",
          icon: <CheckCircle size={16} className="text-purple-600" />,
        }
      case "arrived":
        return {
          color: "bg-orange-500",
          textColor: "text-orange-800",
          bgColor: "bg-orange-50",
          icon: <MapPin size={16} className="text-orange-600" />,
        }
      case "pending":
        return {
          color: "bg-yellow-500",
          textColor: "text-yellow-800",
          bgColor: "bg-yellow-50",
          icon: <Clock size={16} className="text-yellow-600" />,
        }
      default:
        return {
          color: "bg-gray-500",
          textColor: "text-gray-800",
          bgColor: "bg-gray-50",
          icon: <AlertCircle size={16} className="text-gray-600" />,
        }
    }
  }

  const formatDuration = () => {
    if (!tripStartedAt || !tripEndedAt) return null
    const start = new Date(tripStartedAt)
    const end = new Date(tripEndedAt)
    const duration = Math.round((end - start) / (1000 * 60)) // minutes
    return duration > 60 ? `${Math.floor(duration / 60)}h ${duration % 60}m` : `${duration}m`
  }

  const statusConfig = getStatusConfig(status)

  return (
    <div className={`absolute top-4 left-4 z-[1000] ${className}`}>
      <div
        className={`${statusConfig.bgColor} backdrop-blur-sm rounded-xl shadow-lg border border-white/20 p-4 min-w-[200px]`}
      >
        <div className="flex items-center gap-3 mb-3">
          <div className={`w-3 h-3 ${statusConfig.color} rounded-full animate-pulse`}></div>
          <span className={`font-semibold capitalize ${statusConfig.textColor}`}>{status}</span>
          {statusConfig.icon}
        </div>

        {formatDuration() && (
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Clock size={14} />
            <span>Duration: {formatDuration()}</span>
          </div>
        )}

        {status?.toLowerCase() === "in-progress" && (
          <div className="mt-2 text-xs text-blue-600 animate-pulse">🚚 En route to destination</div>
        )}
      </div>
    </div>
  )
}

// Enhanced vehicle indicator
const VehicleIndicator = ({ vehicleType, className = "" }) => {
  const getVehicleConfig = () => {
    switch (vehicleType?.toLowerCase()) {
      case "car":
        return { icon: <Car size={18} />, color: "text-blue-600", bg: "bg-blue-50" }
      case "bike":
      case "motorcycle":
        return { icon: <Bike size={18} />, color: "text-green-600", bg: "bg-green-50" }
      case "truck":
        return { icon: <Truck size={18} />, color: "text-orange-600", bg: "bg-orange-50" }
      default:
        return { icon: <Car size={18} />, color: "text-gray-600", bg: "bg-gray-50" }
    }
  }

  const vehicleConfig = getVehicleConfig()

  return (
    <div className={`absolute top-4 right-4 z-[1000] ${className}`}>
      <div className={`${vehicleConfig.bg} backdrop-blur-sm rounded-xl shadow-lg border border-white/20 p-3`}>
        <div className={`flex items-center gap-2 ${vehicleConfig.color}`}>
          {vehicleConfig.icon}
          <span className="text-sm font-medium capitalize">{vehicleType || "Car"}</span>
        </div>
      </div>
    </div>
  )
}

// Enhanced popup content component
const LocationPopup = ({ type, data, deliveryData }) => {
  const isPickup = type === "pickup"
  const location = isPickup ? deliveryData.pickupLocation : deliveryData.deliveryLocation
  const user = isPickup ? deliveryData.user : null
  const receiver = !isPickup ? deliveryData.delivery_id : null

  return (
    <div className="p-3 min-w-[280px] max-w-[320px]">
      <div className="flex items-center gap-2 mb-3">
        <div className={`w-3 h-3 rounded-full ${isPickup ? "bg-green-500" : "bg-red-500"}`}></div>
        <span className={`font-bold text-lg ${isPickup ? "text-green-700" : "text-red-700"}`}>
          {isPickup ? "Pickup Location" : "Delivery Location"}
        </span>
      </div>

      <div className="space-y-3">
        <div>
          <p className="text-sm font-medium text-gray-700 mb-1">Address</p>
          <p className="text-sm text-gray-600 leading-relaxed">{location?.address}</p>
        </div>

        {user && isPickup && (
          <div className="border-t pt-3">
            <div className="flex items-center gap-2 mb-2">
              <User size={16} className="text-blue-600" />
              <span className="text-sm font-semibold text-gray-700">Customer Details</span>
            </div>
            <div className="space-y-1">
              <p className="text-sm font-medium text-gray-800">
                {user.firstname} {user.lastname}
              </p>
              <div className="flex items-center gap-1">
                <Phone size={12} className="text-gray-500" />
                <p className="text-sm text-gray-600">{user.phone_number}</p>
              </div>
            </div>
          </div>
        )}

        {receiver && !isPickup && (
          <div className="border-t pt-3">
            <div className="flex items-center gap-2 mb-2">
              <Package size={16} className="text-purple-600" />
              <span className="text-sm font-semibold text-gray-700">Delivery Details</span>
            </div>
            <div className="space-y-1">
              <p className="text-sm font-medium text-gray-800">{receiver.reciever_name}</p>
              <p className="text-sm text-gray-600 capitalize">
                Type: <span className="font-medium">{receiver.delivery_type}</span>
              </p>
            </div>
          </div>
        )}

        {deliveryData.order_verification_code && !isPickup && (
          <div className="border-t pt-3">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">Verification Code</span>
              {deliveryData.is_code_verified && <CheckCircle size={14} className="text-green-600" />}
            </div>
            <div className="bg-gray-50 rounded-lg p-2">
              <p className="text-lg font-mono font-bold text-center text-indigo-600 tracking-wider">
                {deliveryData.order_verification_code}
              </p>
            </div>
            <p className={`text-xs mt-1 ${deliveryData.is_code_verified ? "text-green-600" : "text-orange-600"}`}>
              {deliveryData.is_code_verified ? "✓ Verified" : "⏳ Pending verification"}
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

// Loading component
const MapLoading = () => (
  <div className="relative h-[500px] w-full bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl flex items-center justify-center">
    <div className="text-center">
      <Loader2 className="h-12 w-12 animate-spin text-indigo-600 mx-auto mb-4" />
      <p className="text-gray-600 font-medium">Loading delivery map...</p>
      <p className="text-sm text-gray-500 mt-1">Preparing route visualization</p>
    </div>
  </div>
)

// Error component
const MapError = ({ message }) => (
  <div className="relative h-[500px] w-full bg-gradient-to-br from-red-50 to-orange-50 rounded-xl flex items-center justify-center border-2 border-red-100">
    <div className="text-center max-w-md">
      <AlertCircle size={48} className="text-red-400 mx-auto mb-4" />
      <h3 className="text-lg font-semibold text-red-800 mb-2">Unable to Load Map</h3>
      <p className="text-red-600 mb-4">{message || "Location data is not available for this delivery."}</p>
      <div className="bg-red-100 rounded-lg p-3">
        <p className="text-sm text-red-700">
          Please check the delivery details or contact support if this issue persists.
        </p>
      </div>
    </div>
  </div>
)

const DeliveryMap = ({ deliveryData, className = "" }) => {
  const [isLoading, setIsLoading] = useState(true)
  const [mapError, setMapError] = useState(null)

  // Calculate map configuration based on delivery data
  const mapConfig = useMemo(() => {
    if (!deliveryData) {
      return {
        center: [9.0765, 7.3986], // Abuja, Nigeria default
        zoom: 12,
        pickupCoords: null,
        deliveryCoords: null,
        bounds: [],
        routeCoordinates: [],
        distance: 0,
      }
    }

    try {
      const pickup = deliveryData.pickupLocation?.coordinates
      const delivery = deliveryData.deliveryLocation?.coordinates

      // Handle coordinate conversion: API returns [lng, lat], Leaflet expects [lat, lng]
      const pickupCoords = pickup && pickup.length === 2 ? [pickup[1], pickup[0]] : null
      const deliveryCoords = delivery && delivery.length === 2 ? [delivery[1], delivery[0]] : null

      const bounds = []
      if (pickupCoords) bounds.push(pickupCoords)
      if (deliveryCoords) bounds.push(deliveryCoords)

      const routeCoordinates = pickupCoords && deliveryCoords ? [pickupCoords, deliveryCoords] : []

      // Calculate center and zoom based on locations
      let center = [9.0765, 7.3986] // Default to Abuja
      let zoom = 12
      let distance = 0

      if (pickupCoords && deliveryCoords) {
        // Calculate center point
        center = [(pickupCoords[0] + deliveryCoords[0]) / 2, (pickupCoords[1] + deliveryCoords[1]) / 2]

        // Calculate distance and adjust zoom
        distance = calculateDistance(pickupCoords[0], pickupCoords[1], deliveryCoords[0], deliveryCoords[1])

        // Adjust zoom based on distance
        if (distance < 2) zoom = 15
        else if (distance < 5) zoom = 14
        else if (distance < 10) zoom = 13
        else if (distance < 20) zoom = 12
        else zoom = 11
      } else if (pickupCoords) {
        center = pickupCoords
        zoom = 15
      } else if (deliveryCoords) {
        center = deliveryCoords
        zoom = 15
      }

      return {
        center,
        zoom,
        pickupCoords,
        deliveryCoords,
        bounds,
        routeCoordinates,
        distance,
      }
    } catch (error) {
      console.error("Error processing delivery location data:", error)
      setMapError("Invalid location data format")
      return {
        center: [9.0765, 7.3986],
        zoom: 12,
        pickupCoords: null,
        deliveryCoords: null,
        bounds: [],
        routeCoordinates: [],
        distance: 0,
      }
    }
  }, [deliveryData])

  // Simulate loading delay for better UX
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 1000)

    return () => clearTimeout(timer)
  }, [deliveryData])

  // Handle loading state
  if (isLoading) {
    return <MapLoading />
  }

  // Handle error state
  if (mapError || (!mapConfig.pickupCoords && !mapConfig.deliveryCoords)) {
    return <MapError message={mapError} />
  }

  return (
    <div className={`relative w-full rounded-xl z-0 overflow-hidden shadow-2xl border border-gray-200 ${className}`}>
      <div className="h-[500px] w-full">
        <MapContainer
          center={mapConfig.center}
          zoom={mapConfig.zoom}
          style={{ height: "100%", width: "100%" }}
          className="z-0"
          zoomControl={false}
          attributionControl={false}
        >
          {/* Custom tile layer with better styling */}
          <TileLayer
            url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
            subdomains="abcd"
            maxZoom={19}
          />

          {/* Map view controller */}
          <MapViewController bounds={mapConfig.bounds} center={mapConfig.center} zoom={mapConfig.zoom} />

          {/* Pickup Location Marker */}
          {mapConfig.pickupCoords && (
            <Marker position={mapConfig.pickupCoords} icon={createCustomIcon("#10B981", "pickup", 45)}>
              <Popup maxWidth={350} className="custom-popup">
                <LocationPopup type="pickup" deliveryData={deliveryData} />
              </Popup>
            </Marker>
          )}

          {/* Delivery Location Marker */}
          {mapConfig.deliveryCoords && (
            <Marker position={mapConfig.deliveryCoords} icon={createCustomIcon("#EF4444", "delivery", 45)}>
              <Popup maxWidth={350} className="custom-popup">
                <LocationPopup type="delivery" deliveryData={deliveryData} />
              </Popup>
            </Marker>
          )}

          {/* Enhanced Route Line */}
          {mapConfig.routeCoordinates.length === 2 && (
            <>
              {/* Shadow line for depth */}
              <Polyline
                positions={mapConfig.routeCoordinates}
                color="#000000"
                weight={8}
                opacity={0.1}
                lineCap="round"
                lineJoin="round"
              />
              {/* Main route line */}
              <Polyline
                positions={mapConfig.routeCoordinates}
                color="#6366F1"
                weight={5}
                opacity={0.8}
                dashArray="10, 15"
                lineCap="round"
                lineJoin="round"
              />
            </>
          )}
        </MapContainer>
      </div>

      {/* Enhanced overlay components */}
      <div className="z-0">
      <StatusIndicator
        status={deliveryData?.status}
        tripStartedAt={deliveryData?.tripStartedAt}
        tripEndedAt={deliveryData?.tripEndedAt}
      />

      <VehicleIndicator vehicleType={deliveryData?.vehicle_type} />
      </div>

      {/* Enhanced delivery info panel */}
      <div className="absolute bottom-4 left-4 right-4 z-0">
        <div className="bg-white/95 backdrop-blur-sm rounded-xl shadow-xl border border-white/20 p-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Payment Info */}
            <div className="text-center sm:text-left">
              <p className="text-xs text-gray-500 uppercase tracking-wide font-medium mb-1">Payment</p>
              <p className="text-lg font-bold text-gray-900">₦{deliveryData?.payment?.amount?.toLocaleString()}</p>
              <p className="text-xs text-gray-600 capitalize">
                {deliveryData?.payment?.method} • {deliveryData?.payment?.status}
              </p>
            </div>

            {/* Rider Info */}
            {deliveryData?.rider && (
              <div className="text-center sm:text-left">
                <p className="text-xs text-gray-500 uppercase tracking-wide font-medium mb-1">Rider</p>
                <p className="text-sm font-semibold text-gray-900">
                  {deliveryData.rider.firstname} {deliveryData.rider.lastname}
                </p>
                <p className="text-xs text-gray-600">{deliveryData.rider.phone_number}</p>
              </div>
            )}

            {/* Distance Info */}
            {mapConfig.distance > 0 && (
              <div className="text-center sm:text-left">
                <p className="text-xs text-gray-500 uppercase tracking-wide font-medium mb-1">Distance</p>
                <p className="text-sm font-semibold text-gray-900">{mapConfig.distance.toFixed(1)} km</p>
                <p className="text-xs text-gray-600">Estimated route</p>
              </div>
            )}

            {/* Items Info */}
            {deliveryData?.items && deliveryData.items.length > 0 && (
              <div className="text-center sm:text-left">
                <p className="text-xs text-gray-500 uppercase tracking-wide font-medium mb-1">Items</p>
                <p className="text-sm font-semibold text-gray-900">
                  {deliveryData.items.length} item{deliveryData.items.length !== 1 ? "s" : ""}
                </p>
                <p className="text-xs text-gray-600 truncate">{deliveryData.items[0]?.description || "Package"}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default DeliveryMap
