import { useEffect, useState } from "react"
import { Eye, Trash2, Plus, UserCheckIcon, Edit } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Swiper, SwiperSlide } from "swiper/react"
import { FreeMode } from "swiper/modules"
import "swiper/css"
import "swiper/css/navigation"
import { Table } from "@/components/Table"
import { AppLayout } from "@/components/AppLayout"
import { AdminModal } from "@/components/_AdminRolesComponents/AddAdminModal"
import { UpdateAdminModal } from "@/components/_AdminRolesComponents/UpdateAdminModal"
import { CustomButton } from "@/components/CustomButton"
import { useNavigate } from "react-router"
import useRoleStore from "@/store/RolesStore"
import { ViewAdminDetails } from "@/components/_AdminRolesComponents/ViewAdminDetails"
import { DeleteAdminModal } from "@/components/_AdminRolesComponents/DeleteAdminModal"

const TabButton = ({ label, active, onClick }) => (
  <button
    onClick={onClick}
    className={`px-4 py-2 text-sm font-medium rounded-lg whitespace-nowrap ${
      active ? "bg-white shadow" : "text-gray-500 hover:text-gray-700"
    }`}
  >
    {label}
  </button>
)

export const RolesPermissionsPage = () => {
  const [activeTab, setActiveTab] = useState("all")
  const [isAdminModalOpen, setIsAdminModalOpen] = useState(false)
  const [isUpdateAdminModalOpen, setIsUpdateAdminModalOpen] = useState(false)
  const [isDeleteAdminModalOpen, setIsDeleteAdminModalOpen] = useState(false)
  const [selectedAdmin, setSelectedAdmin] = useState(null)
  const [isViewAdminSheetOpen, setIsViewAdminSheetOpen] = useState(false)
  const [adminToUpdate, setAdminToUpdate] = useState(null)
  const [adminToDelete, setAdminToDelete] = useState(null)
  const [isDeletingAdmin, setIsDeletingAdmin] = useState(false)

  const {
    getAllRoles,
    adminRoles,
    loading,
    permissions,
    getPermissions,
    getAllAdmins,
    allAdmins,
    getAdmin,
    deleteAdmin
  } = useRoleStore()

  useEffect(() => {
    const fetchAdmins = async () => {
      try {
        await getAllAdmins()
        console.log("Admin Users:", allAdmins)
      } catch (error) {
        console.error("Error fetching Admins:", error)
      }
      
    }
    fetchAdmins()
  }, [getAllAdmins])

  const navigate = useNavigate()

  const columns = [
    {
      key: "name",
      label: "Name",
    },
    {
      key: "email",
      label: "Email",
    },
    { key: "role", label: "Role" },
    {
      key: "lastLogin",
      label: "Last Login",
    },
    { key: "status", label: "Status" },
  ]

  // Transform and filter the API data
  const getTransformedAdminsData = () => {
    if (!allAdmins) return []

    return (
      allAdmins
        // Filter out super admins
        .filter((admin) => admin.role?.name !== "super-admin")
        // Transform the data to match table structure
        .map((admin) => ({
          id: admin._id,
          name: `${admin.firstname} ${admin.lastname}`,
          email: admin.email,
          role: admin.role?.name || "No Role Assigned",
          lastLogin: admin.last_login,
          lastLoginDate: admin.last_login
            ? new Date(admin.last_login).toLocaleDateString("en-US", {
                year: "numeric",
                month: "short",
                day: "numeric",
              })
            : "Never",
          lastLoginTime: admin.last_login
            ? new Date(admin.last_login).toLocaleTimeString("en-US", {
                hour12: false,
              })
            : "",
          status: admin.status,
          avatar: "/Avatar1.png", // Using default avatar since not provided in API
          originalData: admin, // Keep reference to original data for editing
        }))
    )
  }

  // Filter data based on active tab
  const getFilteredData = () => {
    const transformedData = getTransformedAdminsData()

    switch (activeTab) {
      case "super":
        return transformedData.filter((admin) => admin.role?.toLowerCase().includes("super"))
      case "managers":
        return transformedData.filter((admin) => admin.role?.toLowerCase().includes("manager"))
      case "operations":
        return transformedData.filter((admin) => admin.role?.toLowerCase().includes("operation"))
      case "others":
        return transformedData.filter(
          (admin) =>
            !admin.role?.toLowerCase().includes("super") &&
            !admin.role?.toLowerCase().includes("manager") &&
            !admin.role?.toLowerCase().includes("operation"),
        )
      case "all":
      default:
        return transformedData
    }
  }

  const renderCustomCell = (key, value, row) => {
    if (key === "status") {
      return (
        <span
          className={`px-3 py-1 rounded-full text-sm capitalize ${
            value?.toLowerCase() === "active" ? "bg-green-50 text-green-700" : "bg-gray-100 text-gray-700"
          }`}
        >
          {value}
        </span>
      )
    } else if (key === "name") {
      return (
        <div className="flex items-center gap-3">
          <img src={row.avatar || "/Avatar1.png"} alt={row.name} className="w-10 h-10 rounded-full" />
          <span className="font-medium line-clamp-1">{row.name}</span>
        </div>
      )
    } else if (key === "lastLogin") {
      return (
        <div className="min-w-[120px]">
          <div className="text-gray-900">{row.lastLoginDate}</div>
          {row.lastLoginTime && <div className="text-sm text-gray-500">{row.lastLoginTime}</div>}
        </div>
      )
    } else if (key === "email") {
      return <span className="line-clamp-1">{row.email}</span>
    } else if (key === "role") {
      return <span className="capitalize">{value}</span>
    }
    return value
  }

  const handleView = async (row) => {
    setIsViewAdminSheetOpen(true)
    try {
      console.log("Fetching admin details for ID:", row.id)
      const adminDetails = await getAdmin(row.id)
      console.log("Admin details:", adminDetails)
      setSelectedAdmin(adminDetails)
    } catch (error) {
      console.error("Error fetching admin details:", error)
      // You might want to show a toast notification here
    }
  }

  const handleEdit = async (row) => {
    setIsUpdateAdminModalOpen(true)
    try {
      console.log("Fetching admin details for editing:", row.id)
      console.log(typeof row.id, row.id)
      const adminDetails = await getAdmin(row.id)
      console.log("Admin details for editing:", adminDetails)
      setAdminToUpdate(adminDetails)
      /* setIsUpdateAdminModalOpen(true) */
    } catch (error) {
      console.error("Error fetching admin details for editing:", error)
      // You might want to show a toast notification here
    }
  }

 const handleDelete = async (row) => {
    try {
      console.log("Preparing to delete admin:", row.id)
      // Fetch full admin details for the confirmation modal
      const adminDetails = await getAdmin(row.id)
      setAdminToDelete(adminDetails)
      setIsDeleteAdminModalOpen(true)
    } catch (error) {
      console.error("Error fetching admin details for deletion:", error)
    }
  }

  const handleConfirmDelete = async () => {
    if (!adminToDelete) return

    try {
      setIsDeletingAdmin(true)
      console.log("Deleting admin:", adminToDelete.data?._id || adminToDelete._id)

      const adminId = adminToDelete.data?._id || adminToDelete._id
      await deleteAdmin(adminId)

      // Close modal and reset state
      setIsDeleteAdminModalOpen(false)
      setAdminToDelete(null)

      console.log("Admin deleted successfully")
    } catch (error) {
      console.error("Error deleting admin:", error)
      // Modal will stay open so user can try again or cancel
    } finally {
      setIsDeletingAdmin(false)
    }
  }

  const ActionButtons = ({ row }) => (
    <div className="flex items-center gap-2">
      <button onClick={() => handleView(row)} className="text-gray-500 hover:text-gray-700" title="View Details">
        <Eye size={16} />
      </button>
      <button onClick={() => handleEdit(row)} className="text-blue-500 hover:text-blue-700" title="Edit Admin">
        <Edit size={16} />
      </button>
      <button onClick={() => handleDelete(row)} className="text-red-500 hover:text-red-700" title="Delete Admin">
        <Trash2 size={16} />
      </button>
    </div>
  )

  const tabs = [
    { id: "all", label: "All Admins" },
    { id: "super", label: "Super Admins" },
    { id: "managers", label: "Managers" },
    { id: "operations", label: "Operations" },
    { id: "others", label: "Others" },
  ]

  const handleUpdateSuccess = async () => {
    // Refresh the admin list after successful update
    try {
      await getAllAdmins()
    } catch (error) {
      console.error("Error refreshing admin list:", error)
    }
  }

  return (
    <AppLayout title="Roles & Permissions">
      <div className="p-4 md:p-6 space-y-6">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
          <div className="w-full lg:w-auto bg-gray-100 rounded-lg p-1">
            <Swiper freeMode={true} modules={[FreeMode]} slidesPerView="auto" spaceBetween={8} className="mySwiper">
              {tabs.map((tab) => (
                <SwiperSlide key={tab.id} className="!w-auto">
                  <TabButton label={tab.label} active={activeTab === tab.id} onClick={() => setActiveTab(tab.id)} />
                </SwiperSlide>
              ))}
            </Swiper>
          </div>

          <div className="flex gap-2 w-full lg:w-auto">
            <Button
              variant="outline"
              className="flex-1 lg:flex-none whitespace-nowrap bg-transparent"
              onClick={() => navigate("/roles-management")}
            >
              <UserCheckIcon className="w-4 h-4 mr-2" />
              Roles
            </Button>
            <CustomButton
              className="flex-1 lg:flex-none bg-[#1F1F76] hover:bg-indigo-700 whitespace-nowrap"
              onClick={() => setIsAdminModalOpen(true)}
            >
              <Plus className="w-4 h-4 mr-2" />
              New Admin
            </CustomButton>
          </div>
        </div>

        <div className="bg-white rounded-lg border overflow-hidden">
          <div className="overflow-x-auto">
            {loading ? (
              <div className="flex justify-center items-center p-8">
                <div className="text-gray-500">Loading admins...</div>
              </div>
            ) : (
              <Table
                name={"Roles & Permissions"}
                columns={columns}
                data={getFilteredData()}
                renderCustomCell={renderCustomCell}
                showSearch={false}
                itemsPerPage={10}
                renderActions={(row) => <ActionButtons row={row} />}
              />
            )}
          </div>
        </div>
      </div>

      {/* Create Admin Modal */}
      <AdminModal isOpen={isAdminModalOpen} onClose={() => setIsAdminModalOpen(false)} />

      {/* Update Admin Modal */}
      <UpdateAdminModal
        isOpen={isUpdateAdminModalOpen}
        onClose={() => {
          setIsUpdateAdminModalOpen(false)
          setAdminToUpdate(null)
        }}
        adminData={adminToUpdate}
        onUpdateSuccess={handleUpdateSuccess}
      />

      {/* View Admin Details Sheet */}
      <ViewAdminDetails
        admin={selectedAdmin}
        isOpen={isViewAdminSheetOpen}
        onClose={() => {
          setIsViewAdminSheetOpen(false)
          setSelectedAdmin(null)
        }}
      />

      {/* Delete Admin Confirmation Modal */}
      <DeleteAdminModal
        isOpen={isDeleteAdminModalOpen}
        onClose={() => {
          setIsDeleteAdminModalOpen(false)
          setAdminToDelete(null)
        }}
        adminData={adminToDelete?.data || adminToDelete}
        onConfirm={handleConfirmDelete}
        loading={isDeletingAdmin}
      />
    </AppLayout>
  )
}
