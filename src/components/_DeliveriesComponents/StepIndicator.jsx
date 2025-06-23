/* import React from 'react';
import { Check } from 'lucide-react';
import { Button } from "@/components/ui/button"

export const StepIndicator = ({
  steps = [
    "Order Placement",
    "Rider Assigned", 
    "Pick Up",
    "In-Transit",
    "Delivered"
  ],
  currentStep = 2,
  onCancel
}) => {
  return (
    <div className="flex flex-col md:flex-row items-start md:items-center justify-between w-full gap-4">
      <div className="flex flex-col md:flex-row items-start md:items-center gap-2 md:gap-1 w-full md:w-auto">
        {steps.map((step, index) => {
          const stepNumber = index + 1;
          const isCompleted = stepNumber < currentStep;
          const isCurrent = stepNumber === currentStep;
          
          return (
            <div key={step} className="flex items-center w-full md:w-auto">
              <div className="flex items-center gap-2">
                <div className={`
                  w-6 h-6 rounded-full flex items-center justify-center text-sm
                  ${isCompleted ? 'bg-green-500 text-white' : 
                    isCurrent ? 'bg-orange-500 text-white' : 
                    'bg-gray-200 text-gray-600'}
                `}>
                  {isCompleted ? (
                    <Check className="w-4 h-4" />
                  ) : (
                    stepNumber
                  )}
                </div>
                <span className={`text-sm font-medium
                  ${isCompleted ? 'text-green-500' : 
                    isCurrent ? 'text-orange-500' : 
                    'text-gray-600'}
                `}>
                  {step}
                </span>
              </div>
              
              {index < steps.length - 1 && (
                <div className={`hidden md:block mx-1
                  ${isCompleted ? 'text-green-500' : 'text-gray-300'}
                `}>
                  {'>'}
                </div>
              )}
            </div>
          );
        })}
      </div>

      <Button 
        variant="ghost" 
        className="text-red-600 hover:text-red-700 hover:bg-red-50 px-0 md:px-4"
        onClick={onCancel}
      >
        Cancel Order
      </Button>
    </div>
  );
}; */


import { useState } from "react"
import { Check, Clock, Package, User, Truck, MapPin, CheckCircle, AlertCircle, XCircle, Timer } from "lucide-react"
import { Button } from "@/components/ui/button"

const StepIcon = ({ step, status }) => {
  const iconProps = { className: "w-4 h-4" }

  switch (step.toLowerCase()) {
    case "order placed":
    case "order placement":
      return <Package {...iconProps} />
    case "rider assigned":
      return <User {...iconProps} />
    case "rider arrived":
    case "arrived":
      return <MapPin {...iconProps} />
    case "picked up":
    case "pick up":
      return <Truck {...iconProps} />
    case "in transit":
    case "in-transit":
    case "in-progress":
      return <Truck {...iconProps} />
    case "delivered":
    case "completed":
      return <CheckCircle {...iconProps} />
    case "cancelled":
      return <XCircle {...iconProps} />
    default:
      return <Clock {...iconProps} />
  }
}

const StepTimestamp = ({ timestamp, isEstimated = false }) => {
  if (!timestamp) return null

  const formatTime = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    })
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    const today = new Date()
    const isToday = date.toDateString() === today.toDateString()

    if (isToday) {
      return "Today"
    }

    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    })
  }

  return (
    <div className="text-xs text-gray-500 mt-1">
      <div className="flex items-center gap-1">
        {isEstimated && <Timer className="w-3 h-3" />}
        <span>
          {isEstimated ? "Est. " : ""}
          {formatTime(timestamp)}
        </span>
      </div>
      <div>{formatDate(timestamp)}</div>
    </div>
  )
}

const CancelOrderModal = ({ isOpen, onClose, onConfirm, deliveryData }) => {
  if (!isOpen) return null

  const canCancel = ["pending", "accepted"].includes(deliveryData?.status?.toLowerCase())

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6">
        <div className="flex items-center gap-3 mb-4">
          <AlertCircle className="w-6 h-6 text-orange-500" />
          <h3 className="text-lg font-semibold">Cancel Delivery</h3>
        </div>

        <div className="space-y-4">
          <p className="text-gray-600">
            {canCancel
              ? "Are you sure you want to cancel this delivery? This action cannot be undone."
              : "This delivery cannot be cancelled as it's already in progress."}
          </p>

          {deliveryData?.payment?.amount && (
            <div className="bg-blue-50 rounded-lg p-3">
              <p className="text-sm text-blue-800">
                <span className="font-medium">Refund Amount:</span> ₦{deliveryData.payment.amount.toLocaleString()}
              </p>
              <p className="text-xs text-blue-600 mt-1">Refunds typically process within 3-5 business days</p>
            </div>
          )}

          <div className="flex gap-3 pt-4">
            <Button variant="outline" onClick={onClose} className="flex-1">
              Keep Delivery
            </Button>
            {canCancel && (
              <Button variant="destructive" onClick={onConfirm} className="flex-1">
                Cancel Delivery
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export const StepIndicator = ({ deliveryData, onCancel }) => {
  const [showCancelModal, setShowCancelModal] = useState(false)

  // Define delivery steps based on your business logic
  const getDeliverySteps = (deliveryData) => {
    const baseSteps = [
      {
        id: "placed",
        label: "Order Placed",
        timestamp: deliveryData?.createdAt,
        description: "Order has been created",
      },
      {
        id: "assigned",
        label: "Rider Assigned",
        timestamp: deliveryData?.rider_assigned_at || deliveryData?.acceptedAt,
        description: "Rider has been assigned to your delivery",
      },
      {
        id: "arrived",
        label: "Rider Arrived",
        timestamp: deliveryData?.arrived_at,
        description: "Rider has arrived at pickup location",
      },
      {
        id: "picked_up",
        label: "Picked Up",
        timestamp: deliveryData?.tripStartedAt || deliveryData?.picked_up_at,
        description: "Package has been collected",
      },
      {
        id: "in_transit",
        label: "In Transit",
        timestamp: deliveryData?.tripStartedAt,
        description: "Package is on the way to destination",
      },
      {
        id: "delivered",
        label: "Delivered",
        timestamp: deliveryData?.tripEndedAt || deliveryData?.completed_at,
        description: "Package has been delivered successfully",
      },
    ]

    // Handle cancelled deliveries
    if (deliveryData?.status?.toLowerCase() === "cancelled") {
      return [
        ...baseSteps.slice(0, getCurrentStepIndex(deliveryData) + 1),
        {
          id: "cancelled",
          label: "Cancelled",
          timestamp: deliveryData?.cancelled_at || deliveryData?.updatedAt,
          description: "Delivery has been cancelled",
        },
      ]
    }

    return baseSteps
  }

  // Determine current step based on delivery status
  const getCurrentStepIndex = (deliveryData) => {
    if (!deliveryData) return 0

    const status = deliveryData.status?.toLowerCase()

    switch (status) {
      case "pending":
        return 0
      case "accepted":
        return deliveryData.rider ? 1 : 0
      case "arrived":
        return 2
      case "picked_up":
      case "pickup":
        return 3
      case "in-progress":
      case "in_transit":
        return 4
      case "completed":
      case "delivered":
        return 5
      case "cancelled":
        return Math.min(getCurrentStepIndex({ ...deliveryData, status: "pending" }) + 1, 5)
      default:
        return 0
    }
  }

  const steps = getDeliverySteps(deliveryData)
  const currentStepIndex = getCurrentStepIndex(deliveryData)
  const isCancelled = deliveryData?.status?.toLowerCase() === "cancelled"
  const canCancel = ["pending", "accepted"].includes(deliveryData?.status?.toLowerCase())

  // Calculate estimated delivery time
  const getEstimatedDeliveryTime = () => {
    if (!deliveryData?.createdAt) return null

    const createdAt = new Date(deliveryData.createdAt)
    const estimatedDuration = 45 // minutes
    const estimatedTime = new Date(createdAt.getTime() + estimatedDuration * 60000)

    return estimatedTime
  }

  const handleCancelConfirm = () => {
    setShowCancelModal(false)
    if (onCancel) {
      onCancel(deliveryData)
    }
  }

  // Loading state
  if (!deliveryData) {
    return (
      <div className="bg-white rounded-lg p-6 shadow-sm border">
        <div className="animate-pulse">
          <div className="flex items-center gap-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex items-center gap-2">
                <div className="w-6 h-6 bg-gray-200 rounded-full"></div>
                <div className="h-4 bg-gray-200 rounded w-20"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <>
      <div className="bg-white rounded-lg p-6 shadow-sm border space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Delivery Progress</h3>
            <p className="text-sm text-gray-600">Track your delivery status in real-time</p>
          </div>

          {/* Estimated delivery time */}
          {!isCancelled && currentStepIndex < steps.length - 1 && (
            <div className="text-right">
              <p className="text-sm font-medium text-gray-900">Estimated Delivery</p>
              <StepTimestamp timestamp={getEstimatedDeliveryTime()} isEstimated={true} />
            </div>
          )}
        </div>

        {/* Progress Steps */}
        <div className="relative">
          {/* Desktop Layout */}
          <div className="hidden md:flex items-center justify-between w-full">
            {steps.map((step, index) => {
              const isCompleted = index < currentStepIndex || (isCancelled && step.id === "cancelled")
              const isCurrent = index === currentStepIndex && !isCancelled
              const isCancelled_step = step.id === "cancelled"

              return (
                <div key={step.id} className="flex flex-col items-center relative flex-1">
                  {/* Connection Line */}
                  {index < steps.length - 1 && (
                    <div
                      className={`absolute top-3 left-1/2 w-full h-0.5 -z-10 ${
                        isCompleted ? "bg-green-500" : isCancelled_step ? "bg-red-500" : "bg-gray-200"
                      }`}
                      style={{ transform: "translateX(50%)" }}
                    />
                  )}

                  {/* Step Circle */}
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium border-2 ${
                      isCancelled_step
                        ? "bg-red-500 border-red-500 text-white"
                        : isCompleted
                          ? "bg-green-500 border-green-500 text-white"
                          : isCurrent
                            ? "bg-blue-500 border-blue-500 text-white"
                            : "bg-white border-gray-300 text-gray-600"
                    }`}
                  >
                    {isCancelled_step ? (
                      <XCircle className="w-4 h-4" />
                    ) : isCompleted ? (
                      <Check className="w-4 h-4" />
                    ) : (
                      <StepIcon step={step.label} status={deliveryData?.status} />
                    )}
                  </div>

                  {/* Step Label */}
                  <div className="mt-3 text-center max-w-[120px]">
                    <p
                      className={`text-sm font-medium ${
                        isCancelled_step
                          ? "text-red-600"
                          : isCompleted
                            ? "text-green-600"
                            : isCurrent
                              ? "text-blue-600"
                              : "text-gray-600"
                      }`}
                    >
                      {step.label}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">{step.description}</p>
                    <StepTimestamp timestamp={step.timestamp} />
                  </div>
                </div>
              )
            })}
          </div>

          {/* Mobile Layout */}
          <div className="md:hidden space-y-4">
            {steps.map((step, index) => {
              const isCompleted = index < currentStepIndex || (isCancelled && step.id === "cancelled")
              const isCurrent = index === currentStepIndex && !isCancelled
              const isCancelled_step = step.id === "cancelled"

              return (
                <div key={step.id} className="flex items-start gap-4">
                  {/* Step Circle */}
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium border-2 flex-shrink-0 ${
                      isCancelled_step
                        ? "bg-red-500 border-red-500 text-white"
                        : isCompleted
                          ? "bg-green-500 border-green-500 text-white"
                          : isCurrent
                            ? "bg-blue-500 border-blue-500 text-white"
                            : "bg-white border-gray-300 text-gray-600"
                    }`}
                  >
                    {isCancelled_step ? (
                      <XCircle className="w-4 h-4" />
                    ) : isCompleted ? (
                      <Check className="w-4 h-4" />
                    ) : (
                      <StepIcon step={step.label} status={deliveryData?.status} />
                    )}
                  </div>

                  {/* Step Content */}
                  <div className="flex-1 pb-4">
                    <div className="flex items-center justify-between">
                      <p
                        className={`font-medium ${
                          isCancelled_step
                            ? "text-red-600"
                            : isCompleted
                              ? "text-green-600"
                              : isCurrent
                                ? "text-blue-600"
                                : "text-gray-600"
                        }`}
                      >
                        {step.label}
                      </p>
                      <StepTimestamp timestamp={step.timestamp} />
                    </div>
                    <p className="text-sm text-gray-500 mt-1">{step.description}</p>
                  </div>

                  {/* Connection Line for Mobile */}
                  {index < steps.length - 1 && (
                    <div
                      className={`absolute left-4 mt-8 w-0.5 h-8 ${
                        isCompleted ? "bg-green-500" : isCancelled_step ? "bg-red-500" : "bg-gray-200"
                      }`}
                    />
                  )}
                </div>
              )
            })}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-between pt-4 border-t">
          <div className="text-sm text-gray-600">
            {isCancelled ? (
              <span className="text-red-600 font-medium">Delivery has been cancelled</span>
            ) : (
              <span>
                Step {currentStepIndex + 1} of {steps.length - 1}
              </span>
            )}
          </div>

          {!isCancelled && (
            <Button
              variant="ghost"
              className={`${
                canCancel ? "text-red-600 hover:text-red-700 hover:bg-red-50" : "text-gray-400 cursor-not-allowed"
              }`}
              onClick={() => canCancel && setShowCancelModal(true)}
              disabled={!canCancel}
            >
              {canCancel ? "Cancel Delivery" : "Cannot Cancel"}
            </Button>
          )}
        </div>
      </div>

      {/* Cancel Modal */}
      <CancelOrderModal
        isOpen={showCancelModal}
        onClose={() => setShowCancelModal(false)}
        onConfirm={handleCancelConfirm}
        deliveryData={deliveryData}
      />
    </>
  )
}
