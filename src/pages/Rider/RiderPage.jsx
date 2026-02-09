import { AppLayout } from '@/components/AppLayout'
import { CustomButton } from '@/components/CustomButton';
import { Table } from '@/components/Table';
import { PasscodeLock } from '@/icon/PasscodeLock';
import useUserStore from '@/store/UserStore';
import { Eye, MessageSquare, Plus, Trash2 } from 'lucide-react';
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

export const RiderPage = () => {
  const [activeTab, setActiveTab] = useState('all');
  const navigate = useNavigate()

  const { allRiders, loading, getAllRiders, deleteRider } = useUserStore()

   useEffect(() => {
      if (allRiders === null) {
        getAllRiders()
      } 
    }, [])

  const tabs = [
    { id: 'all', label: 'All Riders' },
    { id: 'active', label: 'Active Riders' },
    { id: 'inactive', label: 'Inactive Riders' },
    { id: 'pending', label: 'Pending Riders' }
  ];

  const columns = [
    { key: 'fullName', label: 'Full Name' },
    { key: 'email', label: 'Email' },
    { key: 'phoneNumber', label: 'Phone number' },
    { key: 'status', label: 'Status' },
    { key: 'nationality', label: 'Nationality' }
  ];

   // Transform backend data to match table format
  const transformRiderData = (backendData) => {
    if (!backendData || !Array.isArray(backendData)) {
      return []
    }

    return backendData.map((rider) => ({
      id: rider._id,
      fullName: rider.firstname && rider.lastname ? `${rider.firstname} ${rider.othername} ${rider.lastname}` : "N/A",
      email: rider.email,
      phoneNumber: rider.phone,
      status: rider.status,
      nationality: rider.nationality || "N/A",
      avatar: rider.profileImage?.url || "/placeholder.svg?height=32&width=32", // Use placeholder if no image
    }))
  }

  // Get transformed rider data
    const allRidersTransformed = useMemo(() => {
      return transformRiderData(allRiders)
    }, [allRiders])

 /*  const allCustomers = [
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
      status: index === 3 || index === 6 ? 'Inactive' : 'Active',
      state: 'Lagos State',
      avatar: '/Avatar3.png'
    }))
  ]; */


  const filteredRiders = useMemo(() => {
      if (!allRidersTransformed.length) return []
  
      switch (activeTab) {
        case "active":
          return allRidersTransformed.filter((rider) => rider.status === "activated")
        case "inactive":
          return allRidersTransformed.filter((rider) => rider.status === "deactivated")
        case "pending":
          return allRidersTransformed.filter((rider) => rider.status === "pending")
        default:
          return allRidersTransformed
      }
    }, [activeTab, allRidersTransformed])

  /* const filteredCustomers = useMemo(() => {
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
    if (key === 'status') {
      const statusColors = {
        activated: 'text-green-600 bg-green-100',
        deactivated: 'text-red-600 bg-red-100',
        pending: 'text-yellow-600 bg-yellow-100'
      };
      return (
        <span className={`px-2 py-1 text-sm rounded-lg ${statusColors[value] || 'text-gray-600 bg-gray-100'}`}>
          {value}
        </span>
      );
    }
    return value;
  };

  const handleViewClick = (rider) => {
    //navigate(`/Riders/${user.id}`);
    console.log('View clicked:', rider);
  };


  const handleManageUser = (row) => {
    //console.log('Manage password clicked:', row);
    navigate(`/riders/${row.id}`)
  };

  const handleDeleteClick = async(row) => {
    //console.log('Delete clicked:', row);
    const confirmed = window.confirm(`Are you sure you want to delete ${row.fullName}? This action cannot be undone.`);
    if (confirmed) {
      try {
        await deleteRider(row.id);
        // Refresh the rider list after deletion
        getAllRiders();
      } catch (error) {
        console.error("Error deleting rider:", error);
      }
    }
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

/*   const renderActions = (row) => (
    <div className="flex items-center gap-4">
      <button 
        onClick={() => handleViewClick(row)}
        className="text-indigo-600 hover:text-indigo-800"
      >
        <Eye size={16} />
      </button>
      <button 
        onClick={() => handleChatClick(row)}
        className="text-green-600 hover:text-green-800"
      >
        <MessageSquare size={16} />
      </button>
      <button 
        onClick={() => handleDeleteClick(row)}
        className="text-red-600 hover:text-red-800"
      >
        <Trash2 size={16} />
      </button>
    </div>
  ); */

  // Show loading state
    if (loading) {
      return (
        <AppLayout title="Customer">
          <div className="p-4 sm:p-6 bg-gray-50 min-h-screen">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
                <div className="space-y-3">
                  {[...Array(filteredRiders.length)].map((_, i) => (
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
       <AppLayout title="Riders">
        <div className="p-4 sm:p-6 bg-gray-50 min-h-screen">
          <div className="bg-white rounded-lg shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-4 sm:p-6 border-b">
              <div className="mb-4 sm:mb-0 overflow-x-auto">
                <div className="flex gap-2 p-1 bg-gray-100 rounded-lg">
                  {/* {tabs.map(tab => (
                    <TabButton
                      key={tab.id}
                      label={tab.label}
                      active={activeTab === tab.id}
                      onClick={() => setActiveTab(tab.id)}
                    />
                  ))} */}
                  {tabs.map((tab) => (
                  <TabButton
                    key={tab.id}
                    label={`${tab.label} (${
                      tab.id === "all"
                        ? allRidersTransformed.length
                        : tab.id === "active"
                          ? allRidersTransformed.filter((r) => r.status === "activated").length
                          : tab.id === "pending" ? 
                          allRidersTransformed.filter((r) => r.status === "pending").length
                          : allRidersTransformed.filter((r) => r.status === "deactivated").length
                    })`}
                    active={activeTab === tab.id}
                    onClick={() => setActiveTab(tab.id)}
                  />
                ))}
                </div>
              </div>
              {/* add new rider button */}
              {/* <CustomButton
                onClick={() => console.log('Add New clicked')}
                className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2 bg-blue-900 text-white rounded-lg hover:bg-indigo-700 transition-colors"
              >
                <Plus size={20} />
                <span>Add New</span>
              </CustomButton> */}
            </div>
    
            <div className="overflow-x-auto">
              {filteredRiders.length > 0 ? (
                <Table
                  columns={columns}
                  data={filteredRiders}
                  renderCustomCell={renderCustomCell}
                  showSearch={false}
                  itemsPerPage={10}
                  showManage={true}
                  showDelete={true}
                  renderActions={(row) => <ActionButtons row={row} />}
                />
                ) : (
                  <div className="p-8 text-center text-gray-500">
                    <p>No Riders found</p>
                    {activeTab !== "all" && <p className="text-sm mt-2">Try switching to "All Riders" tab</p>}
                  </div>
                )}
              {/* <Table
                columns={columns}
                data={filteredCustomers}
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
   /*  <AppLayout title={"Customer"}>
      <div className="p-6 bg-gray-50 min-h-screen">
      <div className="bg-white rounded-lg shadow-sm">
        <div className="flex items-center justify-between p-6 border-b">
          <div className="flex gap-2 p-1 bg-gray-100 rounded-lg">
            {tabs.map(tab => (
              <TabButton
                key={tab.id}
                label={tab.label}
                active={activeTab === tab.id}
                onClick={() => setActiveTab(tab.id)}
              />
            ))}
          </div>
          <CustomButton
            onClick={() => console.log('Add New clicked')}
            className="flex items-center gap-2 px-4 py-2 b bg-blue-900 text-white rounded-lg hover:bg-indigo-700 transition-colors"
          >
            <Plus size={20} />
            <span>Add New</span>
          </CustomButton>
        </div>

        <Table
          columns={columns}
          data={filteredCustomers}
          renderCustomCell={renderCustomCell}
          showSearch={false}
          itemsPerPage={10}
          showManage={true}
          showDelete={true}
          renderActions={(row) => <ActionButtons row={row} />}
        />
      </div>
    </div>
    </AppLayout> */
  )
}

