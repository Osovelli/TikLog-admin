import { useEffect, useState } from "react"
import { ArrowLeft } from "lucide-react"
import { Link, useParams } from "react-router-dom"
import { AppLayout } from "@/components/AppLayout"
import DeliveryMap from "@/components/DeliveryMap"
import { PickupRiderInfo } from "@/components/_DeliveriesComponents/PickUpRiderInfo"
import { StepIndicator } from "@/components/_DeliveriesComponents/StepIndicator"
import DeliveryDetails from "@/components/_DeliveriesComponents/DeliveryDetails"
import useDeliveryStore from "@/store/DeliveryStore"

const ProgressStep = ({ number, label, status, isLast }) => (
  <div className="flex items-center">
    <div className="flex flex-col items-center">
      <div
        className={`w-8 h-8 rounded-full flex items-center justify-center ${
          status === "completed"
            ? "bg-green-100 text-green-600"
            : status === "current"
              ? "bg-blue-100 text-blue-600"
              : "bg-gray-100 text-gray-400"
        }`}
      >
        {number}
      </div>
      <div className="text-sm mt-1 text-gray-600">{label}</div>
    </div>
    {!isLast && <div className={`h-0.5 w-full mx-2 ${status === "completed" ? "bg-green-500" : "bg-gray-200"}`} />}
  </div>
)

const InfoSection = ({ title, children }) => (
  <div className="border rounded-lg p-4">
    <h3 className="text-sm font-medium text-blue-600 mb-4">{title}</h3>
    {children}
  </div>
)

const InfoRow = ({ label, value }) => (
  <div className="flex justify-between py-2">
    <span className="text-sm text-gray-500">{label}</span>
    <span className="text-sm font-medium">{value}</span>
  </div>
)

export const DeliveryDetail = () => {
  const { id } = useParams() // Get delivery ID from URL
  const { getOrderById, loading, order, error } = useDeliveryStore()
  const [deliveryData, setDeliveryData] = useState(null)

  useEffect(() => {
    if (id) {
      console.log("Fetching delivery with ID:", id)
      getOrderById(id)
    }
  }, [id, getOrderById])

  useEffect(() => {
    if (order?.data) {
      console.log("Order data received:", order.data)
      setDeliveryData(order?.data)
    }
  }, [order])

  // Helper function to get delivery status
  const getDeliveryStatus = (status) => {
    switch (status?.toLowerCase()) {
      case "completed":
        return "Completed"
      case "in-progress":
        return "In Progress"
      case "pending":
        return "Pending"
      case "accepted":
        return "Accepted"
      case "arrived":
        return "Arrived"
      case "rejected":
      case "cancelled":
        return "Cancelled"
      default:
        return "Pending"
    }
  }

  // Helper function to format delivery ID for display
  const formatDeliveryId = (deliveryData) => {
    if (deliveryData?.delivery_id?._id) {
      return `#${deliveryData?.delivery_id?._id.slice(-10)}`
    }
    if (deliveryData?._id) {
      return `#${deliveryData?._id.slice(-10)}`
    }
    return "#1234567890"
  }

  // Loading state
  if (loading) {
    return (
      <AppLayout
        title={
          <div className="flex items-center gap-4">
            <h1 className="text-lg font-semibold">Loading...</h1>
          </div>
        }
      >
        <div className="min-h-screen bg-gray-50">
          <div className="animate-pulse">
            <div className="h-64 bg-gray-200 rounded-lg mb-6"></div>
            <div className="space-y-4">
              <div className="h-32 bg-gray-200 rounded-lg"></div>
              <div className="h-24 bg-gray-200 rounded-lg"></div>
              <div className="h-48 bg-gray-200 rounded-lg"></div>
            </div>
          </div>
        </div>
      </AppLayout>
    )
  }

  // Error state
  if (error) {
    return (
      <AppLayout
        title={
          <div className="flex items-center gap-4">
            {/* <Link to="/deliveries" className="text-gray-500 hover:text-gray-700">
              <ArrowLeft size={20} />
            </Link> */}
            <h1 className="text-lg font-semibold">Error</h1>
          </div>
        }
      >
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Failed to load delivery</h2>
            <p className="text-gray-500 mb-4">{error}</p>
            <Link
              to="/deliveries"
              className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
            >
              <ArrowLeft size={16} className="mr-2" />
              Back to Deliveries
            </Link>
          </div>
        </div>
      </AppLayout>
    )
  }

  // No data state
  if (!deliveryData) {
    return (
      <AppLayout
        title={
          <div className="flex items-center gap-4">
            {/* <Link to="/deliveries" className="text-gray-500 hover:text-gray-700">
              <ArrowLeft size={20} />
            </Link> */}
            <h1 className="text-lg font-semibold">Delivery Not Found</h1>
          </div>
        }
      >
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Delivery not found</h2>
            <p className="text-gray-500 mb-4">The delivery you're looking for doesn't exist.</p>
            <Link
              to="/deliveries"
              className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
            >
              <ArrowLeft size={16} className="mr-2" />
              Back to Deliveries
            </Link>
          </div>
        </div>
      </AppLayout>
    )
  }

  return (
    <AppLayout
      title={
        <div className="flex items-center gap-4">
          <Link to="/deliveries" className="text-gray-500 hover:text-gray-700 md:hidden">
            <ArrowLeft size={20} />
          </Link>
          <div>
            <h1 className="text-lg font-semibold">{formatDeliveryId(deliveryData)}</h1>
            <p className="text-sm text-gray-500">
              Status: <span className="capitalize">{getDeliveryStatus(deliveryData?.status)}</span>
            </p>
          </div>
        </div>
      }
    >
      <div className="min-h-screen bg-gray-50">
        {/* Map */}
        <DeliveryMap deliveryData={deliveryData} />

        {/* Content */}
        <div className="mx-auto px-4 py-6 space-y-6">
          {/* Driver Info */}
          <PickupRiderInfo deliveryData={deliveryData} />

          {/* Progress Tracker */}
          <StepIndicator deliveryData={deliveryData} />

          {/* Info Grid */}
          <DeliveryDetails deliveryData={deliveryData} />
        </div>
      </div>
    </AppLayout>
  )
}
