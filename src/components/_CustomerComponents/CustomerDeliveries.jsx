import React, { useMemo } from 'react';
import { Eye } from 'lucide-react';
import { Table } from '../Table';

export const CustomerDeliveries = ({deliveries}) => {
  const columns = [
    { key: "rideId", label: "Delivery ID" },
    { key: 'from', label: 'From' },
    { key: 'to', label: 'To' },
    { key: 'vehicle', label: 'Vehicle' },
    { key: "items", label: "Items" },
    { key: 'status', label: 'Status' },
    { key: 'fee', label: 'Fee' }
  ];

  // Helper function to map delivery status to display status
  const getDeliveryStatus = (deliveryStatus) => {
    switch (deliveryStatus?.toLowerCase()) {
      case "completed":
        return "Delivered"
       case "in-progress":
        return "On Going"
      case "pending":
        return "On Going"
      case "accepted":
        return "Accepted"
      case "arrived":
        return "Arrived"
      case "rejected":
        return "Cancelled"
      case "cancelled":
        return "Cancelled"
      default:
        return "Pending"
    }
  }

  // Transform API data to table format
  const deliveriesData = useMemo(() => {
    /* if (!deliveries || !deliveries.data || !Array.isArray(deliveries.data)) {
      return []
    } */

    // Map the delivery data directly from the API response
    return deliveries?.map((delivery, index) => ({
      id: delivery._id || index,
      rideId: delivery.delivery_id || delivery._id || `#${Date.now()}${index}`,
      from: delivery.pickupLocation?.address || "Pickup Location",
      fromDate: new Date(delivery.createdAt).toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        }),
      to: delivery.deliveryLocation?.address || "Delivery Location",
      toDate: delivery.tripEndedAt
        ? new Date(delivery.tripEndedAt).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
          })
        : new Date(delivery.createdAt).toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        }),
      vehicle: delivery.vehicle_type || "Car",
      items: delivery.items?.length || 0,
      status: getDeliveryStatus(delivery.status),
      fee: delivery.payment?.amount?.toString() || "0",
      currency: delivery.payment?.currency || "NGN",
      paymentStatus: delivery.payment?.status || "pending",
      verificationCode: delivery.order_verification_code,
      isCodeVerified: delivery.is_code_verified,
      originalDelivery: delivery, // Keep original data for actions
      }))
  }, [deliveries])


  const renderCustomCell = (key, value, row) => {
    switch (key) {
      case "from":
        return (
          <div className="max-w-xs">
            <div className="truncate" title={value}>
              {value}
            </div>
            <div className="text-sm text-gray-500">{row.fromDate}</div>
          </div>
        )
      case "to":
        return (
          <div className="max-w-xs">
            <div className="truncate" title={value}>
              {value}
            </div>
            <div className="text-sm text-gray-500">{row.toDate}</div>
          </div>
        )
      case "fee":
        const currencySymbol = row.currency === "NGN" ? "₦" : row.currency
        return (
          <div>
            <span className="text-blue-600 font-medium">
              {currencySymbol} {Number(value).toLocaleString()}
            </span>
            <div className="text-xs text-gray-500 capitalize">{row.paymentStatus}</div>
          </div>
        )
      case "items":
        return (
          <span className="text-gray-600">
            {value} {value === 1 ? "item" : "items"}
          </span>
        )
      case "vehicle":
        return <span className="capitalize bg-gray-100 px-2 py-1 rounded-full text-xs font-medium">{value}</span>
      case "passengers":
        return <span className="text-gray-500">{value}</span>
      case "status":
        return (
          <span
            className={`px-2 py-1 rounded-full text-xs font-medium ${
              value === "Delivered"
                ? "bg-green-100 text-green-800"
                : value === "Cancelled"
                  ? "bg-red-100 text-red-800"
                  : value === "On Going"
                    ? "bg-blue-100 text-blue-800"
                    : value === "Accepted"
                      ? "bg-purple-100 text-purple-800"
                      : value === "Arrived"
                        ? "bg-orange-100 text-orange-800"
                  : "bg-yellow-100 text-yellow-800"
            }`}
          >
            {value}
          </span>
        )
        case "rideId":
        return (
          <div>
            <div className="font-mono text-sm">{value}</div>
            {row.verificationCode && (
              <div className="text-xs text-gray-500">
                Code: {row.verificationCode}
                {row.isCodeVerified && <span className="ml-1 text-green-600">✓</span>}
              </div>
            )}
          </div>
        )
      default:
        return value
    }
  }

  const handleViewClick = (row) => {
    console.log("View delivery details:", row.originalDelivery)
  };

  const ActionButtons = ({ row }) => (
    <div className="flex items-center gap-2">
      <button 
        onClick={() => handleViewClick(row)}
        className=" flex items-center gap-1"
      >
        <Eye size={16} />
        <span className='text-indigo-600 hover:text-indigo-800'>View</span>
      </button>
    </div>
  );

  // Loading state
  if (!deliveries) {
    return (
      <div className="space-y-6 bg-white p-6 rounded-lg">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-4 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }


  // Empty state
  if (deliveriesData.length === 0) {
    return (
      <div className="space-y-6 bg-white p-6 rounded-lg">
        <h2 className="text-lg font-semibold text-gray-900">Deliveries</h2>
        <div className="text-center py-12">
          <div className="text-gray-400 mb-4">
            <Eye size={48} className="mx-auto" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No deliveries found</h3>
          <p className="text-gray-500">This customer hasn't made any deliveries yet.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6 bg-white p-6 rounded-lg">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold text-gray-900">Deliveries ({deliveriesData.length})</h2>
      </div>
      <Table
        name={"Deliveries"}
        columns={columns}
        data={deliveriesData}
        renderCustomCell={renderCustomCell}
        showSearch={false}
        itemsPerPage={10}
        className="mt-4"
        onRowClick={handleViewClick}
        renderActions={(row) => <ActionButtons row={row} />}
      />
    </div>
  );
};