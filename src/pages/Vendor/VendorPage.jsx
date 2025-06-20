import { AppLayout } from '@/components/AppLayout'
import { CustomButton } from '@/components/CustomButton';
import { Table } from '@/components/Table';
import { PasscodeLock } from '@/icon/PasscodeLock';
import useUserStore from '@/store/UserStore';
import { all } from 'axios';
import { Eye, Plus, Trash2 } from 'lucide-react';
import React, { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router';

const TabButton = ({ label, active, onClick }) => (
    <button
      onClick={onClick}
      className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
        active 
          ? 'bg-white shadow-sm' 
          : 'text-gray-500 hover:text-gray-700'
      }`}
    >
      {label}
    </button>
);

export const VendorPage = () => {
  const [activeTab, setActiveTab] = useState('all');
  const navigate = useNavigate()

  const { allVendors, loading, getAllVendors } = useUserStore()

  useEffect(() => {
    if (allVendors === null) {
      getAllVendors()
    } 
    console.log("All Vendors:", allVendors?.data)
  }, [])

  const tabs = [
    { id: 'all', label: 'All Merchants' },
    { id: 'active', label: 'Active Merchants' },
    { id: 'inactive', label: 'Inactive Merchants' }
  ];

  const columns = [
    { key: 'fullName', label: 'Vendor Name' },
    { key: 'email', label: 'Email' },
    { key: 'phoneNumber', label: 'Phone number' },
    { key: 'status', label: 'Status' },
    { key: 'state', label: 'State' }
  ];

  // Transform backend data to match table format
  const transformVendorData = (backendData) => {
    if (!backendData?.data || !Array.isArray(backendData.data)) {
      return []
    }

    return backendData.data.map((vendor) => ({
      id: vendor._id,
      fullName: vendor.lastname || "N/A", // Use lastname as fullName since firstname might not be available
      email: vendor.email,
      phoneNumber: vendor.phone_number,
      status: vendor.status,
      state: "N/A", // State is not provided in backend data
      avatar: vendor.image || "/placeholder.svg?height=32&width=32", // Use placeholder if no image
    }))
  }

  // Get transformed rider data
  const allVendorsTransformed = useMemo(() => {
    return transformVendorData  (allVendors)
  }, [allVendors])

  /* const allCustomers = [
    {
      id: 1,
      fullName: 'James Okpeba',
      email: 'jamesokpeba@gma...',
      phoneNumber: '0810 000 0000',
      status: 'Active',
      state: 'Lagos State',
      avatar: '/Avatar3.png'
    },
    // Duplicate the data
    ...Array(9).fill(null).map((_, index) => ({
      id: index + 2,
      fullName: 'James Okpeba',
      email: 'jamesokpeba@gma...',
      phoneNumber: '0810 000 0000',
      status: index >= 5  && index <= 9 ? 'Inactive' : 'Active',
      state: 'Lagos State',
      avatar: '/Avatar3.png'
    }))
  ]; */

  const filteredVendors = useMemo(() => {
        if (!allVendorsTransformed.length) return []
    
        switch (activeTab) {
          case "active":
            return allVendorsTransformed.filter((rider) => rider.status === "Active")
          case "inactive":
            return allVendorsTransformed.filter((rider) => rider.status === "Inactive")
          case "pending":
            return allVendorsTransformed.filter((rider) => rider.status === "Pending")
          default:
            return allVendorsTransformed; // Return all vendors if no specific tab is active
        }
      }, [activeTab, allVendorsTransformed]);
 /*  const filteredCustomers = useMemo(() => {
    switch (activeTab) {
      case 'active':
        return allCustomers.filter(customer => customer.status === 'Active');
      case 'inactive':
        return allCustomers.filter(customer => customer.status === 'Inactive');
      default:
        return allCustomers;
    }
  }, [activeTab]); */

  const renderCustomCell = (key, value, row) => {
    if (key === 'fullName') {
      return (
        <div className="flex items-center gap-3">
          {/* <img 
            src={row.avatar} 
            alt={value} 
            className="w-8 h-8 rounded-full"
          /> */}
          <span>{value}</span>
        </div>
      );
    }
    return value;
  };

  const handleViewClick = (vendor) => {
    console.log('View clicked:', user);
  };


  const handleManageUser = (vendor) => {
    console.log('Manage password clicked:', vendor);
    navigate(`/vendors/${vendor.id}`)
  };

  const handleDeleteClick = (row) => {
    console.log('Delete clicked:', row);
  };

  const ActionButtons = ({ row }) => (
    <div className="flex items-center gap-2">
      {/* <button 
        onClick={() => handleViewClick(row)}
        className="text-indigo-600 hover:text-indigo-800"
      >
       <PasscodeLock size={18} color={'#23AA26'} /> 
      </button> */}
      <button
        onClick={() => handleManageUser(row)}
        className="text-blue-600 hover:text-blue-900 w-full flex items-center justify-center bg-white"
      >
        <Eye size={16} />
      </button>
      <button 
        /* onClick={() => onDeleteClick?.(item)} */
        onClick={() => handleDeleteClick(row)}
        className="text-red-600 hover:text-red-900 flex items-center"
      >
        <Trash2 size={16} />
      </button>
    </div>
  );

  // Show loading state
      if (loading) {
        return (
          <AppLayout title="Customer">
            <div className="p-4 sm:p-6 bg-gray-50 min-h-screen">
              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="animate-pulse">
                  <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
                  <div className="space-y-3">
                    {[...Array(filteredVendors.length)].map((_, i) => (
                      <div key={i} className="h-4 bg-gray-200 rounded"></div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </AppLayout>
        )
      }

  return (
      <AppLayout title="Vendors">
        <div className="p-4 sm:p-6 bg-gray-50 min-h-screen">
          <div className="bg-white rounded-lg shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-4 sm:p-6 border-b">
              <div className="mb-4 sm:mb-0 overflow-x-auto">
                <div className="flex gap-2 p-1 bg-gray-100 rounded-lg">
                  {tabs.map((tab) => (
                  <TabButton
                    key={tab.id}
                    label={`${tab.label} (${
                      tab.id === "all"
                        ? allVendorsTransformed.length
                        : tab.id === "active"
                          ? allVendorsTransformed.filter((v) => v.status === "Active").length
                          : tab.id === "pending" ? 
                          allVendorsTransformed.filter((v) => v.status === "Pending").length
                          : allVendorsTransformed.filter((v) => v.status === "Inactive").length
                    })`}
                    active={activeTab === tab.id}
                    onClick={() => setActiveTab(tab.id)}
                  />
                ))}
                  {/* {tabs.map(tab => (
                    <TabButton
                      key={tab.id}
                      label={tab.label}
                      active={activeTab === tab.id}
                      onClick={() => setActiveTab(tab.id)}
                    />
                  ))} */}
                </div>
              </div>
              {/* add new vendor button */}
              {/* <CustomButton
                onClick={() => console.log('Add New clicked')}
                className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2 bg-blue-900 text-white rounded-lg hover:bg-indigo-700 transition-colors"
              >
                <Plus size={20} />
                <span>Add New</span>
              </CustomButton> */}
            </div>
    
            <div className="overflow-x-auto">
              {filteredVendors.length > 0 ? (
                <Table
                  columns={columns}
                  data={filteredVendors}
                  renderCustomCell={renderCustomCell}
                  showSearch={false}
                  itemsPerPage={10}
                  showManage={true}
                  showDelete={true}
                  renderActions={(row) => <ActionButtons row={row} />}
                />
                ) : (
                  <div className="p-8 text-center text-gray-500">
                    <p>No Vendor found</p>
                    {activeTab !== "all" && <p className="text-sm mt-2">Try switching to "All Vendors" tab</p>}
                  </div>
                )}
              {/* <Table
                columns={columns}
                data={filteredVendors}
                renderCustomCell={renderCustomCell}
                showSearch={false}
                itemsPerPage={10}
                showManage={true}
                showDelete={true}
                renderActions={(row) => <ActionButtons row={row} />}
              /> */}
            </div>
          </div>
        </div>
      </AppLayout>
  )
}
