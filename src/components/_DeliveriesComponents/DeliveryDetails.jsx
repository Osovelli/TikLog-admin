/* import { cn } from "@/lib/utils"

export default function DeliveryDetails({
  pickup = {
    location: "100, Ebute metta str, off alagbado ave...",
    phone: "0810 000 0000"
  },
  delivery = {
    location: "100, Ebute metta str, off alagbado ave...",
    phone: "0810 000 0000"
  },
  rider = {
    vehicleType: "Toyota Corolla",
    plateNumber: "ABJ 123 YZ",
    start: "1 Mar 2024 (08:00)",
    end: "1 Mar 2024 (13:00)"
  },
  payment = {
    status: "Completed",
    fee: "NGN 2,800"
  },
  className
}) {
  const Section = ({ title, children }) => (
    <div className="space-y-4">
      <h3 className="text-sm font-medium text-blue-600">{title}</h3>
      {children}
    </div>
  )

  const Field = ({ label, value, valueClassName }) => (
    <div className="space-y-1">
      <dt className="text-sm text-gray-600">{label}</dt>
      <dd className={cn("text-sm font-medium", valueClassName)}>{value}</dd>
    </div>
  )

  return (
    <div className={cn("grid gap-6 md:grid-cols-4 p-4", className)}>
      <Section title="PICKUP INFORMATION">
        <dl className="space-y-4">
          <Field 
            label="Pickup Location" 
            value={pickup.location}
          />
          <Field 
            label="Phone number" 
            value={pickup.phone}
          />
        </dl>
      </Section>

      <Section title="DELIVERY INFORMATION">
        <dl className="space-y-4">
          <Field 
            label="Delivery Location" 
            value={delivery.location}
          />
          <Field 
            label="Phone number" 
            value={delivery.phone}
          />
        </dl>
      </Section>

      <Section title="RIDER INFORMATION">
        <dl className="space-y-4">
          <div className="flex gap-4">
            <Field 
              label="Vehicle Type" 
              value={rider.vehicleType}
            />
            <Field 
              label="Plate Number" 
              value={rider.plateNumber}
            />
          </div>
          <div className="flex gap-4">
            <Field 
              label="Start" 
              value={rider.start}
            />
            <Field 
              label="End" 
              value={rider.end}
            />
          </div>
        </dl>
      </Section>

      <Section title="PAYMENT">
        <dl className="space-y-4">
          <Field 
            label="Status" 
            value={payment.status}
            valueClassName="text-emerald-500"
          />
          <Field 
            label="Fee" 
            value={payment.fee}
            valueClassName="text-emerald-500"
          />
        </dl>
      </Section>
    </div>
  )
} */

"use client"

import { useState } from "react"
import {
  MapPin,
  Phone,
  User,
  Car,
  Bike,
  Truck,
  Clock,
  CreditCard,
  Package,
  CheckCircle,
  XCircle,
  AlertCircle,
  Copy,
  Eye,
  EyeOff,
  Calendar,
  DollarSign,
} from "lucide-react"
import { cn } from "@/lib/utils"

const Section = ({ title, icon, children, className }) => (
  <div className={cn("bg-white rounded-lg border p-6 space-y-4", className)}>
    <div className="flex items-center gap-2">
      {icon}
      <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wide">{title}</h3>
    </div>
    {children}
  </div>
)

const Field = ({ label, value, icon, valueClassName, copyable = false, sensitive = false }) => {
  const [showSensitive, setShowSensitive] = useState(false)
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    if (copyable && value) {
      try {
        await navigator.clipboard.writeText(value)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
      } catch (err) {
        console.error("Failed to copy:", err)
      }
    }
  }

  const displayValue = sensitive && !showSensitive ? "••••••••••" : value

  return (
    <div className="space-y-2">
      <dt className="text-xs text-gray-500 uppercase tracking-wide font-medium">{label}</dt>
      <dd className="flex items-center gap-2">
        {icon && <span className="text-gray-400">{icon}</span>}
        <span className={cn("text-sm font-medium flex-1", valueClassName)}>{displayValue || "N/A"}</span>
        <div className="flex items-center gap-1">
          {sensitive && (
            <button
              onClick={() => setShowSensitive(!showSensitive)}
              className="text-gray-400 hover:text-gray-600 p-1"
              title={showSensitive ? "Hide" : "Show"}
            >
              {showSensitive ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          )}
          {copyable && value && (
            <button onClick={handleCopy} className="text-gray-400 hover:text-gray-600 p-1" title="Copy to clipboard">
              <Copy className="w-4 h-4" />
            </button>
          )}
        </div>
        {copied && <span className="text-xs text-green-600 font-medium">Copied!</span>}
      </dd>
    </div>
  )
}

const StatusBadge = ({ status, type = "default" }) => {
  const getStatusConfig = () => {
    const normalizedStatus = status?.toLowerCase()

    switch (type) {
      case "payment":
        switch (normalizedStatus) {
          case "completed":
          case "successful":
          case "paid":
            return { color: "bg-green-100 text-green-800", icon: <CheckCircle className="w-3 h-3" /> }
          case "pending":
            return { color: "bg-yellow-100 text-yellow-800", icon: <Clock className="w-3 h-3" /> }
          case "failed":
          case "cancelled":
            return { color: "bg-red-100 text-red-800", icon: <XCircle className="w-3 h-3" /> }
          default:
            return { color: "bg-gray-100 text-gray-800", icon: <AlertCircle className="w-3 h-3" /> }
        }
      case "verification":
        return normalizedStatus === "verified" || status === true
          ? { color: "bg-green-100 text-green-800", icon: <CheckCircle className="w-3 h-3" /> }
          : { color: "bg-orange-100 text-orange-800", icon: <Clock className="w-3 h-3" /> }
      default:
        return { color: "bg-blue-100 text-blue-800", icon: null }
    }
  }

  const config = getStatusConfig()

  return (
    <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${config.color}`}>
      {config.icon}
      <span className="capitalize">{status || "Unknown"}</span>
    </span>
  )
}

const VehicleIcon = ({ vehicleType }) => {
  switch (vehicleType?.toLowerCase()) {
    case "car":
      return <Car className="w-4 h-4" />
    case "bike":
    case "motorcycle":
      return <Bike className="w-4 h-4" />
    case "truck":
      return <Truck className="w-4 h-4" />
    default:
      return <Car className="w-4 h-4" />
  }
}

const formatDateTime = (dateString) => {
  if (!dateString) return null
  const date = new Date(dateString)
  return {
    date: date.toLocaleDateString("en-US", {
      day: "numeric",
      month: "short",
      year: "numeric",
    }),
    time: date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    }),
  }
}

const calculateDuration = (startDate, endDate) => {
  if (!startDate || !endDate) return null
  const start = new Date(startDate)
  const end = new Date(endDate)
  const durationMs = end - start
  const hours = Math.floor(durationMs / (1000 * 60 * 60))
  const minutes = Math.floor((durationMs % (1000 * 60 * 60)) / (1000 * 60))
  return hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m`
}

export default function DeliveryDetails({ deliveryData, className }) {
  // Loading state
  if (!deliveryData) {
    return (
      <div className={cn("grid gap-6 md:grid-cols-2 lg:grid-cols-4", className)}>
        {[...Array(4)].map((_, i) => (
          <div key={i} className="bg-white rounded-lg border p-6">
            <div className="animate-pulse space-y-4">
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              <div className="space-y-2">
                <div className="h-3 bg-gray-200 rounded"></div>
                <div className="h-3 bg-gray-200 rounded w-3/4"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    )
  }

  // Extract data from deliveryData
  const pickup = {
    location: deliveryData.pickupLocation?.address,
    coordinates: deliveryData.pickupLocation?.coordinates,
    customerName: `${deliveryData.user?.firstname || ""} ${deliveryData.user?.lastname || ""}`.trim(),
    phone: deliveryData.user?.phone_number,
    email: deliveryData.user?.email,
  }

  const delivery = {
    location: deliveryData.deliveryLocation?.address,
    coordinates: deliveryData.deliveryLocation?.coordinates,
    recipientName: deliveryData.delivery_id?.reciever_name,
    phone: deliveryData.delivery_id?.phone_number,
    type: deliveryData.delivery_id?.delivery_type,
    verificationCode: deliveryData.order_verification_code,
    isVerified: deliveryData.is_code_verified,
  }

  const rider = {
    name: `${deliveryData.rider?.firstname || ""} ${deliveryData.rider?.lastname || ""}`.trim(),
    phone: deliveryData.rider?.phone_number,
    email: deliveryData.rider?.email,
    vehicleType: deliveryData.vehicle_type,
    plateNumber: deliveryData.plate_number || deliveryData.vehicle_plate,
    rating: deliveryData.rider?.rating || 4.5,
    startTime: deliveryData.tripStartedAt || deliveryData.acceptedAt,
    endTime: deliveryData.tripEndedAt || deliveryData.completed_at,
  }

  const payment = {
    amount: deliveryData.payment?.amount,
    currency: deliveryData.payment?.currency || "NGN",
    status: deliveryData.payment?.status,
    method: deliveryData.payment?.method || deliveryData.payment?.payment_method,
    reference: deliveryData.payment?.reference,
    fee: deliveryData.delivery_fee || deliveryData.payment?.delivery_fee,
  }

  const items = deliveryData.items || []
  const createdAt = formatDateTime(deliveryData.createdAt)
  const duration = calculateDuration(rider.startTime, rider.endTime)

  return (
    <div className={cn("grid gap-6 md:grid-cols-2 lg:grid-cols-4", className)}>
      {/* Pickup Information */}
      <Section title="Pickup Information" icon={<MapPin className="w-4 h-4 text-green-600" />}>
        <div className="space-y-4">
          <Field label="Location" value={pickup.location} icon={<MapPin className="w-4 h-4" />} copyable={true} />
          <Field label="Customer" value={pickup.customerName} icon={<User className="w-4 h-4" />} />
          <Field label="Phone Number" value={pickup.phone} icon={<Phone className="w-4 h-4" />} copyable={true} />
          {pickup.email && <Field label="Email" value={pickup.email} copyable={true} />}
          {createdAt && (
            <Field
              label="Order Placed"
              value={`${createdAt.date} at ${createdAt.time}`}
              icon={<Calendar className="w-4 h-4" />}
            />
          )}
        </div>
      </Section>

      {/* Delivery Information */}
      <Section title="Delivery Information" icon={<Package className="w-4 h-4 text-red-600" />}>
        <div className="space-y-4">
          <Field label="Location" value={delivery.location} icon={<MapPin className="w-4 h-4" />} copyable={true} />
          <Field label="Recipient" value={delivery.recipientName} icon={<User className="w-4 h-4" />} />
          {delivery.phone && (
            <Field label="Phone Number" value={delivery.phone} icon={<Phone className="w-4 h-4" />} copyable={true} />
          )}
          <Field label="Delivery Type" value={delivery.type} valueClassName="capitalize" />
          {delivery.verificationCode && (
            <div className="space-y-2">
              <Field
                label="Verification Code"
                value={delivery.verificationCode}
                copyable={true}
                sensitive={true}
                valueClassName="font-mono text-indigo-600"
              />
              <StatusBadge status={delivery.isVerified ? "verified" : "pending"} type="verification" />
            </div>
          )}
          {items.length > 0 && (
            <Field
              label="Items"
              value={`${items.length} item${items.length !== 1 ? "s" : ""}`}
              icon={<Package className="w-4 h-4" />}
            />
          )}
        </div>
      </Section>

      {/* Rider Information */}
      <Section title="Rider Information" icon={<User className="w-4 h-4 text-blue-600" />}>
        <div className="space-y-4">
          {rider.name ? (
            <>
              <Field label="Rider Name" value={rider.name} icon={<User className="w-4 h-4" />} />
              <Field label="Phone Number" value={rider.phone} icon={<Phone className="w-4 h-4" />} copyable={true} />
              <div className="flex gap-4">
                <div className="flex-1">
                  <Field
                    label="Vehicle"
                    value={rider.vehicleType}
                    icon={<VehicleIcon vehicleType={rider.vehicleType} />}
                    valueClassName="capitalize"
                  />
                </div>
                {rider.plateNumber && (
                  <div className="flex-1">
                    <Field
                      label="Plate Number"
                      value={rider.plateNumber}
                      valueClassName="font-mono uppercase"
                      copyable={true}
                    />
                  </div>
                )}
              </div>
              {rider.startTime && (
                <Field
                  label="Trip Started"
                  value={`${formatDateTime(rider.startTime)?.date} at ${formatDateTime(rider.startTime)?.time}`}
                  icon={<Clock className="w-4 h-4" />}
                />
              )}
              {rider.endTime && (
                <Field
                  label="Trip Ended"
                  value={`${formatDateTime(rider.endTime)?.date} at ${formatDateTime(rider.endTime)?.time}`}
                  icon={<Clock className="w-4 h-4" />}
                />
              )}
              {duration && (
                <Field
                  label="Duration"
                  value={duration}
                  icon={<Clock className="w-4 h-4" />}
                  valueClassName="text-blue-600 font-semibold"
                />
              )}
            </>
          ) : (
            <div className="text-center py-8">
              <User className="w-8 h-8 text-gray-400 mx-auto mb-2" />
              <p className="text-sm text-gray-600">No rider assigned yet</p>
            </div>
          )}
        </div>
      </Section>

      {/* Payment Information */}
      <Section title="Payment Information" icon={<CreditCard className="w-4 h-4 text-purple-600" />}>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Field label="Status" value="" valueClassName="" />
            <StatusBadge status={payment.status} type="payment" />
          </div>

          <Field
            label="Amount"
            value={`${payment.currency === "NGN" ? "₦" : payment.currency} ${payment.amount?.toLocaleString()}`}
            icon={<DollarSign className="w-4 h-4" />}
            valueClassName="text-lg font-bold text-green-600"
          />

          {payment.fee && payment.fee !== payment.amount && (
            <Field
              label="Delivery Fee"
              value={`${payment.currency === "NGN" ? "₦" : payment.currency} ${payment.fee?.toLocaleString()}`}
              valueClassName="text-gray-600"
            />
          )}

          {payment.method && <Field label="Payment Method" value={payment.method} valueClassName="capitalize" />}

          {payment.reference && (
            <Field label="Reference" value={payment.reference} valueClassName="font-mono text-xs" copyable={true} />
          )}
        </div>
      </Section>
    </div>
  )
}
