import React, { useMemo, useState } from 'react';
import { Eye, Package } from 'lucide-react';
import { Table } from '../Table';


const StatusBadge = ({ status }) => {
  const getStatusConfig = (status) => {
    switch (status?.toLowerCase()) {
      case "completed":
        return {
          color: "bg-green-100 text-green-800",
          label: "Delivered",
        }
      case "in-progress":
        return {
          color: "bg-blue-100 text-blue-800",
          label: "On Going",
        }
      case "pending":
        return {
          color: "bg-yellow-100 text-yellow-800",
          label: "Pending",
        }
      case "accepted":
        return {
          color: "bg-purple-100 text-purple-800",
          label: "Accepted",
        }
      case "arrived":
        return {
          color: "bg-orange-100 text-orange-800",
          label: "Arrived",
        }
      case "rejected":
      case "cancelled":
        return {
          color: "bg-red-100 text-red-800",
          label: "Cancelled",
        }
      default:
        return {
          color: "bg-gray-100 text-gray-800",
          label: "Unknown",
        }
    }
  }

  const config = getStatusConfig(status)

  return <span className={`px-3 py-1 rounded-full text-sm font-medium ${config.color}`}>{config.label}</span>
}

const FilterButton = ({ label, active, onClick, count }) => (
  <button
    onClick={onClick}
    className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
      active ? "bg-indigo-600 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
    }`}
  >
    {label} {count !== undefined && <span className="ml-1">({count})</span>}
  </button>
)

export const Requests = ({deliveries}) => {
  const [activeFilter, setActiveFilter] = useState("all")
  const [searchTerm, setSearchTerm] = useState("")
  
  /* const columns = [
    { key: 'rideId', label: 'Ride ID' },
    { key: 'from', label: 'From' },
    { key: 'to', label: 'To' },
    { key: 'vehicle', label: 'Vehicle' },
    { key: 'passengers', label: ''},
    { key: 'status', label: 'Status' },
    { key: 'fee', label: 'Fee' }
  ]; */

  const columns = [
    { key: "rideId", label: "Delivery ID" },
    { key: "customer", label: "Customer" },
    { key: "recipient", label: "Recipient" },
    { key: "deliveryType", label: "Type" },
    { key: "amount", label: "Amount" },
    { key: "status", label: "Status" },
    { key: "date", label: "Date" },
  ]

  /* const requestsData = [
    {
      id: 1,
      rideId: '#123354',
      from: 'Ikeja, Lagos',
      fromDate: 'Dec 6, 2024',
      to: 'Lekki, Lagos',
      toDate: 'Dec 6, 2024',
      vehicle: 'Car',
      passengers: '2',
      status: 'Delivered',
      fee: '1,600'
    },
    {
      id: 2,
      rideId: '#123354',
      from: 'Ikeja, Lagos',
      fromDate: 'Dec 6, 2024',
      to: 'Lekki, Lagos',
      toDate: 'Dec 6, 2024',
      vehicle: 'Car',
      passengers: '2',
      status: 'Cancelled',
      fee: '1,600'
    },
    ...Array(6).fill(null).map((_, index) => ({
      id: index + 3,
      rideId: '#123354',
      from: 'Ikeja, Lagos',
      fromDate: 'Dec 6, 2024',
      to: 'Lekki, Lagos',
      toDate: 'Dec 6, 2024',
      vehicle: 'Car',
      passengers: '2',
      status: 'On Going',
      fee: '1,600'
    }))
  ]; */

  // Transform API data to table format
    const transformedData = useMemo(() => {
      if (!Array.isArray(deliveries)) {
        return []
      }
  
      return deliveries.map((delivery, index) => ({
        id: delivery._id || index,
        rideId: delivery._id,
        customer: {
          name: `${delivery.user?.firstname || ""} ${delivery.user?.lastname || ""}`.trim() || "N/A",
          phone: delivery.user?.phone_number || "N/A",
          image: delivery.user?.image || null,
        },
        recipient: {
          name: delivery.delivery_id?.reciever_name || "N/A",
          type: delivery.delivery_id?.delivery_type || "N/A",
        },
        deliveryType: delivery.delivery_id?.delivery_type || "package",
        amount: delivery.payment?.amount || 0,
        status: delivery.status || "pending",
        date: delivery.createdAt || delivery.updatedAt || new Date().toISOString(),
        rawDelivery: delivery, // Keep original data for actions
      }))
    }, [deliveries])
  
    // Filter data based on status and search
    const filteredData = useMemo(() => {
      let filtered = transformedData
  
      // Filter by status
      if (activeFilter !== "all") {
        filtered = filtered.filter((item) => {
          switch (activeFilter) {
            case "pending":
              return ["pending", "accepted"].includes(item.status?.toLowerCase())
            case "ongoing":
              return ["in-progress", "arrived"].includes(item.status?.toLowerCase())
            case "completed":
              return item.status?.toLowerCase() === "completed"
            case "cancelled":
              return ["rejected", "cancelled"].includes(item.status?.toLowerCase())
            default:
              return true
          }
        })
      }
  
      // Filter by search term
      if (searchTerm) {
        const term = searchTerm.toLowerCase()
        filtered = filtered.filter(
          (item) =>
            item.customer.name.toLowerCase().includes(term) ||
            item.recipient.name.toLowerCase().includes(term) ||
            item.rideId.toLowerCase().includes(term) ||
            item.deliveryType.toLowerCase().includes(term),
        )
      }
  
      return filtered
    }, [transformedData, activeFilter, searchTerm])

  /* const renderCustomCell = (key, value, row) => {
    switch (key) {
      case 'from':
        return (
          <div>
            <div>{value}</div>
            <div className="text-sm text-gray-500">{row.fromDate}</div>
          </div>
        );
      case 'to':
        return (
          <div>
            <div>{value}</div>
            <div className="text-sm text-gray-500">{row.toDate}</div>
          </div>
        );
      case 'fee':
        return <span className="text-blue-600">N {value}</span>;
      case 'passengers':
        return <span className="text-gray-500">{value}</span>;
      default:
        return value;
    }
  }; */

  // Calculate filter counts
  const filterCounts = useMemo(() => {
    return {
      all: transformedData.length,
      pending: transformedData.filter((item) => ["pending", "accepted"].includes(item.status?.toLowerCase())).length,
      ongoing: transformedData.filter((item) => ["in-progress", "arrived"].includes(item.status?.toLowerCase())).length,
      completed: transformedData.filter((item) => item.status?.toLowerCase() === "completed").length,
      cancelled: transformedData.filter((item) => ["rejected", "cancelled"].includes(item.status?.toLowerCase()))
        .length,
    }
  }, [transformedData])

  const renderCustomCell = (key, value, row) => {
    switch (key) {
      case "rideId":
        return <div className="font-mono text-sm">{value.length > 15 ? `${value.substring(0, 15)}...` : value}</div>

      case "customer":
        return (
          <div className="flex items-center gap-3">
            {value.image && (
              <img
                src={value.image || "/placeholder.svg"}
                alt={value.name}
                className="w-8 h-8 rounded-full object-cover"
                onError={(e) => {
                  e.target.style.display = "none"
                }}
              />
            )}
            <div>
              <div className="font-medium text-gray-900">{value.name}</div>
              <div className="text-sm text-gray-500">{value.phone}</div>
            </div>
          </div>
        )

      case "recipient":
        return (
          <div>
            <div className="font-medium text-gray-900">{value.name}</div>
            <div className="text-sm text-gray-500 capitalize">{value.type}</div>
          </div>
        )

      case "deliveryType":
        return (
          <span className="inline-flex items-center gap-1 px-2 py-1 bg-gray-100 rounded-full text-xs font-medium text-gray-700 capitalize">
            <Package className="w-3 h-3" />
            {value}
          </span>
        )

      case "amount":
        return <span className="font-semibold text-green-600">₦{Number(value).toLocaleString()}</span>

      case "status":
        return <StatusBadge status={value} />

      case "date":
        const date = new Date(value)
        const today = new Date()
        const isToday = date.toDateString() === today.toDateString()
        const isYesterday = new Date(today.getTime() - 24 * 60 * 60 * 1000).toDateString() === date.toDateString()

        return (
          <div>
            <div className="font-medium text-gray-900">
              {isToday
                ? "Today"
                : isYesterday
                  ? "Yesterday"
                  : date.toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    })}
            </div>
            <div className="text-sm text-gray-500">
              {date.toLocaleTimeString("en-US", {
                hour: "2-digit",
                minute: "2-digit",
                hour12: true,
              })}
            </div>
          </div>
        )

      default:
        return value
    }
  }

  const handleViewClick = (row) => {
    console.log('View clicked:', row);
  };

  const ActionButtons = ({ row }) => (
    <div className="flex items-center gap-2">
      <button 
        onClick={() => handleViewClick(row)}
        className=" flex items-center gap-1 text-indigo-600 hover:text-indigo-800"
      >
        <Eye size={16} />
        <span className=''>View</span>
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
  if (transformedData.length === 0) {
    return (
      <div className="space-y-6 bg-white p-6 rounded-lg">
        <div className="text-center py-12">
          <Package size={48} className="text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No delivery requests found</h3>
          <p className="text-gray-500">There are no delivery requests to display.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6 bg-white p-6 rounded-lg">
      <div className="flex flex-wrap gap-2">
        <FilterButton
          label="All"
          active={activeFilter === "all"}
          onClick={() => setActiveFilter("all")}
          count={filterCounts.all}
        />
        <FilterButton
          label="Pending"
          active={activeFilter === "pending"}
          onClick={() => setActiveFilter("pending")}
          count={filterCounts.pending}
        />
        <FilterButton
          label="Ongoing"
          active={activeFilter === "ongoing"}
          onClick={() => setActiveFilter("ongoing")}
          count={filterCounts.ongoing}
        />
        <FilterButton
          label="Completed"
          active={activeFilter === "completed"}
          onClick={() => setActiveFilter("completed")}
          count={filterCounts.completed}
        />
        <FilterButton
          label="Cancelled"
          active={activeFilter === "cancelled"}
          onClick={() => setActiveFilter("cancelled")}
          count={filterCounts.cancelled}
        />
      </div>

      <Table
        name={"Deliveries"}
        columns={columns}
        data={filteredData}
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