/* import React from 'react';
import { Phone, Mail, Star, StarHalf } from 'lucide-react';
import { Button } from "@/components/ui/button"

const LocationTab = ({ number, label, active }) => (
  <button
    className={`px-4 py-2 text-sm ${
      active 
        ? 'bg-white shadow rounded-lg' 
        : 'text-gray-500 hover:text-gray-700'
    }`}
  >
    {label}
  </button>
);

export const PickupRiderInfo = ({ 
  riderName = "Jane Doe",
  vehicleType = "Toyota Corolla",
  plateNumber = "ABC 123",
  phoneNumber = "+1234567890",
  email = "jane@example.com"
}) => {
  return (
    <div className="space-y-4">
      <div className="text-sm">
        Going to <a href="#" className="text-blue-600 hover:underline">Pickup location</a>
      </div>
      
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-4">
          <img 
            src="/Avatar3.png"
            alt={riderName} 
            className="w-12 h-12 rounded-full"
          />
          <div>
            <h2 className="font-semibold">{riderName}</h2>
            <div className="flex items-center gap-1">
              <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
              <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
              <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
              <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
              <StarHalf className="w-4 h-4 fill-yellow-400 text-yellow-400" />
            </div>
          </div>
        </div>
        
        <Button variant="outline" className="text-blue-600 border-blue-600">
          View contact information
        </Button>
      </div>

      <div className="flex gap-4">
        <LocationTab number="1" label="Location 1" active />
        <LocationTab number="2" label="Location 2" />
        <LocationTab number="3" label="Location 3" />
        <LocationTab number="4" label="Location 4" />
      </div>
    </div>
  );
}; */

"use client"

import { useState } from "react"
import {
  Phone,
  Mail,
  Star,
  StarHalf,
  MapPin,
  Clock,
  User,
  Car,
  Bike,
  Truck,
  MessageCircle,
  Navigation,
} from "lucide-react"
import { Button } from "@/components/ui/button"

const LocationTab = ({ icon, label, address, active, onClick }) => (
  <button
    onClick={onClick}
    className={`flex items-center gap-2 px-4 py-3 text-sm rounded-lg transition-all duration-200 ${
      active
        ? "bg-white shadow-md border-2 border-indigo-200 text-indigo-700"
        : "bg-gray-50 text-gray-600 hover:bg-gray-100 hover:text-gray-800"
    }`}
  >
    {icon}
    <div className="text-left">
      <div className="font-medium">{label}</div>
      <div className="text-xs text-gray-500 truncate max-w-[120px]" title={address}>
        {address}
      </div>
    </div>
  </button>
)

const RatingStars = ({ rating = 0, totalReviews = 0 }) => {
  const fullStars = Math.floor(rating)
  const hasHalfStar = rating % 1 !== 0
  const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0)

  return (
    <div className="flex items-center gap-1">
      {/* Full stars */}
      {[...Array(fullStars)].map((_, i) => (
        <Star key={`full-${i}`} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
      ))}

      {/* Half star */}
      {hasHalfStar && <StarHalf className="w-4 h-4 fill-yellow-400 text-yellow-400" />}

      {/* Empty stars */}
      {[...Array(emptyStars)].map((_, i) => (
        <Star key={`empty-${i}`} className="w-4 h-4 text-gray-300" />
      ))}

      <span className="text-sm text-gray-600 ml-1">
        {rating.toFixed(1)} {totalReviews > 0 && `(${totalReviews})`}
      </span>
    </div>
  )
}

const VehicleInfo = ({ vehicleType, plateNumber }) => {
  const getVehicleIcon = () => {
    switch (vehicleType?.toLowerCase()) {
      case "car":
        return <Car className="w-4 h-4 text-blue-600" />
      case "bike":
      case "motorcycle":
        return <Bike className="w-4 h-4 text-green-600" />
      case "truck":
        return <Truck className="w-4 h-4 text-orange-600" />
      default:
        return <Car className="w-4 h-4 text-gray-600" />
    }
  }

  return (
    <div className="flex items-center gap-2 text-sm text-gray-600">
      {getVehicleIcon()}
      <span className="capitalize">{vehicleType || "Vehicle"}</span>
      {plateNumber && (
        <>
          <span className="text-gray-400">•</span>
          <span className="font-mono font-medium">{plateNumber}</span>
        </>
      )}
    </div>
  )
}

const ContactModal = ({ isOpen, onClose, rider }) => {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Contact Rider</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-xl">
            ×
          </button>
        </div>

        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <img
              src={rider?.image || "/Avatar3.png"}
              alt={`${rider?.firstname} ${rider?.lastname}`}
              className="w-12 h-12 rounded-full object-cover"
            />
            <div>
              <p className="font-medium">
                {rider?.firstname} {rider?.lastname}
              </p>
              <p className="text-sm text-gray-600">Delivery Rider</p>
            </div>
          </div>

          <div className="space-y-3">
            <a
              href={`tel:${rider?.phone_number}`}
              className="flex items-center gap-3 p-3 bg-green-50 rounded-lg hover:bg-green-100 transition-colors"
            >
              <Phone className="w-5 h-5 text-green-600" />
              <div>
                <p className="font-medium text-green-800">Call Rider</p>
                <p className="text-sm text-green-600">{rider?.phone_number}</p>
              </div>
            </a>

            <a
              href={`sms:${rider?.phone_number}`}
              className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
            >
              <MessageCircle className="w-5 h-5 text-blue-600" />
              <div>
                <p className="font-medium text-blue-800">Send Message</p>
                <p className="text-sm text-blue-600">Text the rider</p>
              </div>
            </a>

            {rider?.email && (
              <a
                href={`mailto:${rider.email}`}
                className="flex items-center gap-3 p-3 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors"
              >
                <Mail className="w-5 h-5 text-purple-600" />
                <div>
                  <p className="font-medium text-purple-800">Send Email</p>
                  <p className="text-sm text-purple-600">{rider.email}</p>
                </div>
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export const PickupRiderInfo = ({ deliveryData }) => {
  const [activeLocation, setActiveLocation] = useState("pickup")
  const [showContactModal, setShowContactModal] = useState(false)

  // Extract data from deliveryData
  const rider = deliveryData?.rider
  const user = deliveryData?.user
  const pickupLocation = deliveryData?.pickupLocation
  const deliveryLocation = deliveryData?.deliveryLocation
  const status = deliveryData?.status
  const vehicleType = deliveryData?.vehicle_type
  const plateNumber = deliveryData?.plate_number || deliveryData?.vehicle_plate

  // Calculate estimated rating (you might want to get this from API)
  const riderRating = rider?.rating || 4.5
  const totalReviews = rider?.total_reviews || 127

  // Determine current status message
  const getStatusMessage = () => {
    switch (status?.toLowerCase()) {
      case "accepted":
        return { text: "Rider is heading to pickup location", color: "text-blue-600" }
      case "arrived":
        return { text: "Rider has arrived at pickup location", color: "text-green-600" }
      case "in-progress":
        return { text: "En route to delivery location", color: "text-orange-600" }
      case "completed":
        return { text: "Delivery completed successfully", color: "text-green-600" }
      default:
        return { text: "Waiting for rider assignment", color: "text-gray-600" }
    }
  }

  const statusMessage = getStatusMessage()

  // Loading state
  if (!deliveryData) {
    return (
      <div className="bg-white rounded-lg p-6 shadow-sm border">
        <div className="animate-pulse space-y-4">
          <div className="h-4 bg-gray-200 rounded w-1/3"></div>
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
            <div className="space-y-2">
              <div className="h-4 bg-gray-200 rounded w-24"></div>
              <div className="h-3 bg-gray-200 rounded w-32"></div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // No rider assigned state
  if (!rider) {
    return (
      <div className="bg-white rounded-lg p-6 shadow-sm border">
        <div className="text-center py-8">
          <User className="w-12 h-12 text-gray-400 mx-auto mb-3" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Rider Assigned</h3>
          <p className="text-gray-600">We're finding the best rider for your delivery.</p>
          <div className="mt-4">
            <div className="inline-flex items-center gap-2 text-sm text-orange-600">
              <Clock className="w-4 h-4" />
              <span>Estimated assignment: 2-5 minutes</span>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <>
      <div className="bg-white rounded-lg p-6 shadow-sm border space-y-6">
        {/* Status Message */}
        <div className="flex items-center gap-2">
          <Navigation className={`w-4 h-4 ${statusMessage.color}`} />
          <span className={`text-sm font-medium ${statusMessage.color}`}>{statusMessage.text}</span>
        </div>

        {/* Rider Information */}
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-4">
            <img
              src={rider.image || "/Avatar3.png"}
              alt={`${rider.firstname} ${rider.lastname}`}
              className="w-16 h-16 rounded-full object-cover border-2 border-gray-100"
            />
            <div className="space-y-2">
              <div>
                <h2 className="text-lg font-semibold text-gray-900">
                  {rider.firstname} {rider.lastname}
                </h2>
                <VehicleInfo vehicleType={vehicleType} plateNumber={plateNumber} />
              </div>
              <RatingStars rating={riderRating} totalReviews={totalReviews} />
            </div>
          </div>

          <Button
            variant="outline"
            className="text-indigo-600 border-indigo-600 hover:bg-indigo-50"
            onClick={() => setShowContactModal(true)}
          >
            Contact Rider
          </Button>
        </div>

        {/* Location Tabs */}
        <div className="space-y-3">
          <h3 className="text-sm font-medium text-gray-700">Delivery Route</h3>
          <div className="flex gap-3 overflow-x-auto pb-2">
            <LocationTab
              icon={<MapPin className="w-4 h-4 text-green-600" />}
              label="Pickup"
              address={pickupLocation?.address || "Pickup location"}
              active={activeLocation === "pickup"}
              onClick={() => setActiveLocation("pickup")}
            />
            <LocationTab
              icon={<MapPin className="w-4 h-4 text-red-600" />}
              label="Delivery"
              address={deliveryLocation?.address || "Delivery location"}
              active={activeLocation === "delivery"}
              onClick={() => setActiveLocation("delivery")}
            />
          </div>
        </div>

        {/* Selected Location Details */}
        <div className="bg-gray-50 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <MapPin className={`w-5 h-5 mt-0.5 ${activeLocation === "pickup" ? "text-green-600" : "text-red-600"}`} />
            <div className="flex-1">
              <h4 className="font-medium text-gray-900 mb-1">
                {activeLocation === "pickup" ? "Pickup Location" : "Delivery Location"}
              </h4>
              <p className="text-sm text-gray-600 mb-2">
                {activeLocation === "pickup" ? pickupLocation?.address : deliveryLocation?.address}
              </p>

              {activeLocation === "pickup" && user && (
                <div className="text-sm text-gray-600">
                  <p>
                    <span className="font-medium">Customer:</span> {user.firstname} {user.lastname}
                  </p>
                  <p>
                    <span className="font-medium">Phone:</span> {user.phone_number}
                  </p>
                </div>
              )}

              {activeLocation === "delivery" && deliveryData.delivery_id && (
                <div className="text-sm text-gray-600">
                  <p>
                    <span className="font-medium">Recipient:</span> {deliveryData.delivery_id.reciever_name}
                  </p>
                  <p>
                    <span className="font-medium">Type:</span> {deliveryData.delivery_id.delivery_type}
                  </p>
                  {deliveryData.order_verification_code && (
                    <p>
                      <span className="font-medium">Code:</span>
                      <span className="font-mono ml-1 text-indigo-600">{deliveryData.order_verification_code}</span>
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Contact Modal */}
      <ContactModal isOpen={showContactModal} onClose={() => setShowContactModal(false)} rider={rider} />
    </>
  )
}
