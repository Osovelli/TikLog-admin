import React, { useState, useMemo, useEffect } from 'react';
import { Eye } from 'lucide-react';
import { Table } from '@/components/Table';
import { AppLayout } from '@/components/AppLayout';
import { useNavigate } from 'react-router';
import useDeliveryStore from '@/store/DeliveryStore';

const TabButton = ({ label, active, onClick }) => (
  <button
    onClick={onClick}
    className={`px-4 py-2 text-sm font-medium transition-colors rounded-lg ${
      active 
        ? 'bg-white shadow' 
        : 'text-gray-500 hover:text-gray-700'
    }`}
  >
    {label}
  </button>
);

export const DeliveryPage = () => {
  const [activeTab, setActiveTab] = useState('all');
  const navigate = useNavigate()

  const { getAllOrders, getOrdersById, loading, allOrders, order } = useDeliveryStore()

  const columns = [
    { key: 'deliveryId', label: 'Delivery ID' },
    { key: 'customerName', label: 'Customer Name' },
    { key: "receiverName", label: "Receiver" },
    { key: "deliveryType", label: "Delivery Type" },
    { key: "amount", label: "Amount" },
    { key: 'status', label: 'Status' }
  ];

  useEffect(() => {
    getAllOrders()
  }, [getAllOrders])

  // Helper function to normalize status
  const getDeliveryStatus = (status) => {
    switch (status?.toLowerCase()) {
      case "completed":
        return "Completed"
      case "in-progress":
        return "Ongoing"
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

  // Transform API data to table format
  const deliveriesData = useMemo(() => {
    if (!allOrders?.data || !Array.isArray(allOrders.data)) {
      return []
    }

    return allOrders.data.map((order, index) => ({
      id: order._id,
      deliveryId: order.delivery_id?._id || order._id,
      customerName: `${order.user?.firstname || ""} ${order.user?.lastname || ""}`.trim() || "N/A",
      customerPhone: order.user?.phone_number || "N/A",
      customerImage: order.user?.image || null,
      receiverName: order.delivery_id?.reciever_name || order.delivery_id?.receiver_name || "N/A",
      deliveryType: order.delivery_id?.delivery_type || "N/A",
      amount: order.payment?.amount || 0,
      status: getDeliveryStatus(order.status),
      rawStatus: order.status,
      createdAt: order.createdAt || new Date().toISOString(),
      originalOrder: order,
    }))
  }, [allOrders])

  /* const deliveriesData = [
    {
      id: 1,
      vendorName: '#1234567890',
      customerName: 'Ojemba Taiwo-Kudus',
      rider: 'Joshua Ejembi',
      date: 'Dec 6, 2024 12:45:59',
      status: 'Ongoing'
    },
    {
      id: 2,
      vendorName: '#1234567890',
      customerName: 'Ojemba Taiwo-Kudus',
      rider: 'Joshua Ejembi',
      date: 'Dec 6, 2024 12:45:59',
      status: 'Successful'
    },
    ...Array(3).fill(null).map((_, index) => ({
      id: index + 3,
      vendorName: '#1234567890',
      customerName: 'Ojemba Taiwo-Kudus',
      rider: 'Joshua Ejembi',
      date: 'Dec 6, 2024 12:45:59',
      status: 'Ongoing'
    })),
    ...Array(4).fill(null).map((_, index) => ({
      id: index + 6,
      vendorName: '#1234567890',
      customerName: 'Ojemba Taiwo-Kudus',
      rider: 'Joshua Ejembi',
      date: 'Dec 6, 2024 12:45:59',
      status: 'Cancelled'
    })),
    {
      id: 10,
      vendorName: '#1234567890',
      customerName: 'Ojemba Taiwo-Kudus',
      rider: 'Joshua Ejembi',
      date: 'Dec 6, 2024 12:45:59',
      status: 'Successful'
    }
  ]; */


  // Filter data based on active tab
  const filteredData = useMemo(() => {
    switch (activeTab) {
      case "ongoing":
        return deliveriesData.filter((delivery) =>
          ["Ongoing", "Accepted", "Arrived", "Pending"].includes(delivery.status),
        )
      case "completed":
        return deliveriesData.filter((delivery) => delivery.status === "Completed")
      case "cancelled":
        return deliveriesData.filter((delivery) => delivery.status === "Cancelled")
      default:
        return deliveriesData
    }
  }, [activeTab, deliveriesData])

  const renderCustomCell = (key, value, row) => {
    if (key === "customerName") {
      return (
        <div className="flex items-center gap-3">
          {row.customerImage && (
            <img
              src={row.customerImage || "/placeholder.svg"}
              alt="Customer"
              className="w-8 h-8 rounded-full object-cover"
            />
          )}
          <div>
            <div className="text-indigo-600 font-medium">{value}</div>
            <div className="text-sm text-gray-500">{row.customerPhone}</div>
          </div>
        </div>
      )
    }
    if (key === "receiverName") {
      return <span className="text-indigo-600">{value}</span>
    }
    if (key === "deliveryType") {
      return <span className="capitalize bg-gray-100 px-2 py-1 rounded-full text-xs font-medium">{value}</span>
    }
    if (key === "amount") {
      return <span className="text-gray-900 font-medium">₦{Number(value).toLocaleString()}</span>
    }
    if (key === "status") {
      return (
        <span
          className={`px-3 py-1 rounded-full text-sm font-medium ${
            value === "Completed"
              ? "bg-green-50 text-green-700"
              : value === "Ongoing"
                ? "bg-blue-50 text-blue-700"
                : value === "Accepted"
                  ? "bg-purple-50 text-purple-700"
                  : value === "Arrived"
                    ? "bg-orange-50 text-orange-700"
                    : value === "Cancelled"
                      ? "bg-red-50 text-red-700"
                      : "bg-yellow-50 text-yellow-700"
          }`}
        >
          {value}
        </span>
      )
    }
    if (key === "deliveryId") {
      return <div className="font-mono text-sm">{value.length > 20 ? `${value.substring(0, 20)}...` : value}</div>
    }
    return value
  }

  const handleViewClick = (row) => {
    navigate(`/deliveries/${row.id}`)
    console.log('View delivery:', row);
  };

  const ActionButtons = ({ row }) => (
    <button 
      onClick={(e) => {
        e.stopPropagation(); // Prevent row click from triggering
        handleViewClick(row);
      }}
      className="text-indigo-600 hover:text-indigo-800"
    >
      <Eye size={16} />
    </button>
  );

  const tabs = [
    { id: 'all', label: 'All Deliveries' },
    { id: 'ongoing', label: 'Ongoing Deliveries' },
    { id: 'completed', label: 'Completed Deliveries' },
    { id: 'cancelled', label: 'Canceled Transactions' }
  ];

  // Loading state
  if (loading) {
    return (
      <AppLayout title={"Deliveries Management"}>
        <div className="space-y-6 bg-white p-8 rounded-lg">
          <div className="animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
            <div className="space-y-3">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-4 bg-gray-200 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </AppLayout>
    )
  }

  // Empty state
  if (deliveriesData.length === 0) {
    return (
      <AppLayout title={"Deliveries Management"}>
        <div className="space-y-6 bg-white p-8 rounded-lg">
          <div className="flex gap-2 p-1 bg-gray-100 rounded-lg">
            {tabs.map((tab) => (
              <TabButton
                key={tab.id}
                label={tab.label}
                active={activeTab === tab.id}
                onClick={() => setActiveTab(tab.id)}
              />
            ))}
          </div>
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <Eye size={48} className="mx-auto" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No deliveries found</h3>
            <p className="text-gray-500">There are no deliveries to display.</p>
          </div>
        </div>
      </AppLayout>
    )
  }

  return (
    <AppLayout title={"Deliveries Management"}>
      <div className="space-y-6 bg-white p-8 rounded-lg">
        <div className="flex justify-between items-center">
          <div className="flex gap-2 p-1 bg-gray-100 rounded-lg">
            {tabs.map((tab) => (
              <TabButton
                key={tab.id}
                label={tab.label}
                active={activeTab === tab.id}
                onClick={() => setActiveTab(tab.id)}
              />
            ))}
          </div>
          <div className="text-sm text-gray-500">
            Total: {deliveriesData.length} | Showing: {filteredData.length}
          </div>
        </div>

        <Table
          name={"Deliveries"}
          columns={columns}
          data={filteredData}
          renderCustomCell={renderCustomCell}
          showSearch={true}
          itemsPerPage={10}
          className="mt-4"
          onRowClick={handleViewClick}
          renderActions={(row) => <ActionButtons row={row} />}
        />
      </div>
    </AppLayout>
  );
};
