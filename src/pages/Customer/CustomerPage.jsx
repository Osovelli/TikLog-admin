import { AppLayout } from "@/components/AppLayout"
import { CustomButton } from "@/components/CustomButton"
import { Table } from "@/components/Table"
import { PasscodeLock } from "@/icon/PasscodeLock"
import useUserStore from "@/store/UserStore"
import { Eye, Plus, Trash2 } from "lucide-react"
import { useEffect, useMemo, useState } from "react"
import { useNavigate } from "react-router"

const TabButton = ({ label, active, onClick }) => (
  <button
    onClick={onClick}
    className={`px-3 py-2 text-sm font-medium rounded-md transition-colors ${
      active ? "bg-white text-blue-900 shadow" : "text-gray-500 hover:text-gray-700"
    }`}
  >
    {label}
  </button>
)

export const CustomerPage = () => {
  const [activeTab, setActiveTab] = useState("all")
  const navigate = useNavigate()

  const { allUsers, loading, getAllUsers, deleteUser } = useUserStore()

  useEffect(() => {
    if (allUsers === null) {
      getAllUsers()
    }
    console.log("All Users:", allUsers)
  }, [])

  useEffect(() => {
    if (allUsers && allUsers.length > 0) {
      // Optionally, you can fetch details for the first user or any specific user
      // getUserById(allUsers[0]._id)
    }
  }, [allUsers])


  const tabs = [
    { id: "all", label: "All Customers" },
    { id: "active", label: "Active Customers" },
    { id: "inactive", label: "Inactive Customers" },
  ]

  const columns = [
    { key: "fullName", label: "Full Name" },
    { key: "email", label: "Email" },
    { key: "phoneNumber", label: "Phone number" },
    { key: "status", label: "Status" },
    { key: "state", label: "State" },
  ]

  // Transform backend data to match table format
  const transformCustomerData = (backendData) => {
    if (!backendData?.data || !Array.isArray(backendData.data)) {
      return []
    }

    return backendData.data.map((customer) => ({
      id: customer._id,
      fullName: customer.lastname || "N/A", // Use lastname as fullName since firstname might not be available
      email: customer.email,
      phoneNumber: customer.phone_number,
      status: customer.status,
      state: "N/A", // State is not provided in backend data
      avatar: customer.image || "/placeholder.svg?height=32&width=32", // Use placeholder if no image
    }))
  }

  // Get transformed customer data
  const allCustomers = useMemo(() => {
    return transformCustomerData(allUsers)
  }, [allUsers])

  const filteredCustomers = useMemo(() => {
    if (!allCustomers.length) return []

    switch (activeTab) {
      case "active":
        return allCustomers.filter((customer) => customer.status === "Active")
      case "inactive":
        return allCustomers.filter((customer) => customer.status === "Inactive")
      default:
        return allCustomers
    }
  }, [activeTab, allCustomers])

  const renderCustomCell = (key, value, row) => {
    if (key === "fullName") {
      return (
        <div className="flex items-center gap-3">
          {/* <img
            src={row.avatar || "/placeholder.svg"}
            alt={value}
            className="w-8 h-8 rounded-full object-cover"
            onError={(e) => {
              e.target.src = "/placeholder.svg?height=32&width=32"
            }}
          /> */}
          <span>{value}</span>
        </div>
      )
    } else if (key === "status") {
      const statusColors = {
        Active: "border-green-200 text-green-700 bg-green-50",
        Inactive: "border-red-200 text-red-700 bg-red-50",
        Ongoing: "border-orange-200 text-orange-700 bg-orange-50",
      }

      return (
        <span
          className={`px-3 border-2 py-1 rounded-full text-sm ${statusColors[value] || "border-gray-200 text-gray-700 bg-gray-50"}`}
        >
          {value}
        </span>
      )
    }
    return value
  }

  const handleViewClick = (row) => {
    console.log("View clicked:", row)
    // Add your view logic here
  }

  const handleManageUser = async(user) => {
    //console.log("Manage User clicked:", user)
    navigate(`/customers/${user.id}`)
  }

  const handleDeleteClick = (row) => {
    console.log("Delete clicked:", row)
    // Add your delete logic here
    deleteUser(row.id)
  }

  const ActionButtons = ({ row }) => (
    <div className="flex items-center gap-2">
      {/* <button
        onClick={() => handleViewClick(row)}
        className="text-indigo-600 hover:text-indigo-800 p-1 rounded"
        title="View Customer"
      >
       <PasscodeLock size={18} color={"#23AA26"} /> 
      </button> */}
      <button
        onClick={() => handleManageUser(row)}
        className="text-green-600 hover:text-green-800 p-1 rounded"
        title="Manage Customer"
      >
        <Eye size={16} />
      </button>
      <button
        onClick={() => handleDeleteClick(row)}
        className="text-red-600 hover:text-red-800 p-1 rounded"
        title="Delete Customer"
      >
        <Trash2 size={16} />
      </button>
    </div>
  )

  // Show loading state
  if (loading) {
    return (
      <AppLayout 
      title="Customer"
      >
        <div className="p-4 sm:p-6 bg-gray-50 min-h-screen">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
              <div className="space-y-3">
                {[...Array(filteredCustomers.length)].map((_, i) => (
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
    <AppLayout title="Customer">
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
                        ? allCustomers.length
                        : tab.id === "active"
                          ? allCustomers.filter((c) => c.status === "Active").length
                          : allCustomers.filter((c) => c.status === "Inactive").length
                    })`}
                    active={activeTab === tab.id}
                    onClick={() => setActiveTab(tab.id)}
                  />
                ))}
              </div>
            </div>
            {/* add new customer button */}
            {/* <CustomButton
              onClick={() => console.log("Add New clicked")}
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2 bg-blue-900 text-white rounded-lg hover:bg-indigo-700 transition-colors"
            >
              <Plus size={20} />
              <span>Add New</span>
            </CustomButton> */}
          </div>

          <div className="overflow-x-auto">
            {filteredCustomers.length > 0 ? (
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
            ) : (
              <div className="p-8 text-center text-gray-500">
                <p>No customers found</p>
                {activeTab !== "all" && <p className="text-sm mt-2">Try switching to "All Customers" tab</p>}
              </div>
            )}
          </div>
        </div>
      </div>
    </AppLayout>
  )
}
