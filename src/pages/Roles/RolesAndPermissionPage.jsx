import { useEffect, useState } from "react"
import { Eye, Trash2, Plus, Edit, Users, Shield } from "lucide-react"
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
// New Role components
import { AddAdminRoleModal } from "@/components/_AdminRolesComponents/AddAdminRoleModal"
import { UpdateRoleModal } from "@/components/_AdminRolesComponents/UpdateRoleModal"
import { ViewRoleDetails } from "@/components/_AdminRolesComponents/ViewRoleDetails"
import { DeleteRoleModal } from "@/components/_AdminRolesComponents/DeleteRoleModal"

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

const MainTabButton = ({ label, icon: Icon, active, onClick }) => (
  <button
    onClick={onClick}
    className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg whitespace-nowrap transition-colors ${
      active 
        ? "bg-[#1F1F76] text-white" 
        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
    }`}
  >
    <Icon className="w-4 h-4" />
    {label}
  </button>
)

export const RolesPermissionsPage = () => {
  // Main tab state: "admins" or "roles"
  const [mainTab, setMainTab] = useState("admins")
  // Sub-tab for admin filtering
  const [activeTab, setActiveTab] = useState("all")
  
  // Admin modals state
  const [isAdminModalOpen, setIsAdminModalOpen] = useState(false)
  const [isUpdateAdminModalOpen, setIsUpdateAdminModalOpen] = useState(false)
  const [isDeleteAdminModalOpen, setIsDeleteAdminModalOpen] = useState(false)
  const [selectedAdmin, setSelectedAdmin] = useState(null)
  const [isViewAdminSheetOpen, setIsViewAdminSheetOpen] = useState(false)
  const [adminToUpdate, setAdminToUpdate] = useState(null)
  const [adminToDelete, setAdminToDelete] = useState(null)
  const [isDeletingAdmin, setIsDeletingAdmin] = useState(false)

  // Role modals state
  const [isRoleModalOpen, setIsRoleModalOpen] = useState(false)
  const [isUpdateRoleModalOpen, setIsUpdateRoleModalOpen] = useState(false)
  const [isDeleteRoleModalOpen, setIsDeleteRoleModalOpen] = useState(false)
  const [selectedRole, setSelectedRole] = useState(null)
  const [isViewRoleSheetOpen, setIsViewRoleSheetOpen] = useState(false)
  const [roleToUpdate, setRoleToUpdate] = useState(null)
  const [roleToDelete, setRoleToDelete] = useState(null)
  const [isDeletingRole, setIsDeletingRole] = useState(false)

  const {
    getAllRoles,
    adminRoles,
    loading,
    getAllAdmins,
    allAdmins,
    getAdmin,
    deleteAdmin,
    getRole,
    updateRole,
    deleteRole
  } = useRoleStore()

  // Fetch admins when on admins tab
  useEffect(() => {
    if (mainTab === "admins") {
      const fetchAdmins = async () => {
        try {
          await getAllAdmins()
        } catch (error) {
          console.error("Error fetching Admins:", error)
        }
      }
      fetchAdmins()
    }
  }, [mainTab, getAllAdmins])

  // Fetch roles when on roles tab
  useEffect(() => {
    if (mainTab === "roles") {
      const fetchRoles = async () => {
        try {
          await getAllRoles()
        } catch (error) {
          console.error("Error fetching roles:", error)
        }
      }
      fetchRoles()
    }
  }, [mainTab, getAllRoles])

  const navigate = useNavigate()

  // Columns for Admins table
  const adminColumns = [
    { key: "name", label: "Name" },
    { key: "email", label: "Email" },
    { key: "role", label: "Role" },
    { key: "lastLogin", label: "Last Login" },
    { key: "status", label: "Status" },
  ]

  // Columns for Roles table
  const roleColumns = [
    { key: "name", label: "Role Name" },
    { key: "description", label: "Description" },
    { key: "permissionsCount", label: "Permissions" },
    { key: "createdAt", label: "Created At" },
  ]

  // Transform admin data
  const getTransformedAdminsData = () => {
    if (!allAdmins) return []

    return (
      allAdmins
        .filter((admin) => admin.role?.name !== "super-admin")
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
          avatar: admin.profilePicture,
          originalData: admin,
        }))
    )
  }

  // Transform roles data
  const getTransformedRolesData = () => {
    if (!adminRoles) return []

    return adminRoles.map((role) => ({
      id: role._id,
      name: role.name,
      description: role.description || "No description",
      permissions: role.permissions,
      permissionsCount: role.permissions?.length || 0,
      createdAt: role.createdAt
        ? new Date(role.createdAt).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
          })
        : "N/A",
      originalData: role,
    }))
  }

  // Filter admin data based on sub-tab
  const getFilteredAdminData = () => {
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

  const getTableData = () => {
    return mainTab === "admins" ? getFilteredAdminData() : getTransformedRolesData()
  }

  const getTableColumns = () => {
    return mainTab === "admins" ? adminColumns : roleColumns
  }

  const renderCustomCell = (key, value, row) => {
    if (mainTab === "admins") {
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
            <img src={row.avatar || "Avatar3.png"} alt={row.name} className="w-10 h-10 rounded-full" />
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
    }

    if (mainTab === "roles") {
      if (key === "name") {
        return (
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-[#1F1F76]/10 flex items-center justify-center">
              <Shield className="w-4 h-4 text-[#1F1F76]" />
            </div>
            <span className="font-medium capitalize">{value}</span>
          </div>
        )
      } else if (key === "permissionsCount") {
        return (
          <span className="px-3 py-1 rounded-full text-sm bg-blue-50 text-blue-700">
            {value} {value === 1 ? "permission" : "permissions"}
          </span>
        )
      } else if (key === "description") {
        return <span className="text-gray-600 line-clamp-1">{value}</span>
      }
    }

    return value
  }

  // Admin handlers
  const handleViewAdmin = async (row) => {
    setIsViewAdminSheetOpen(true)
    try {
      const adminDetails = await getAdmin(row.id)
      setSelectedAdmin(adminDetails)
    } catch (error) {
      console.error("Error fetching admin details:", error)
    }
  }

  const handleEditAdmin = async (row) => {
    setIsUpdateAdminModalOpen(true)
    try {
      const adminDetails = await getAdmin(row.id)
      setAdminToUpdate(adminDetails)
    } catch (error) {
      console.error("Error fetching admin details for editing:", error)
    }
  }

  const handleDeleteAdmin = async (row) => {
    try {
      const adminDetails = await getAdmin(row.id)
      setAdminToDelete(adminDetails)
      setIsDeleteAdminModalOpen(true)
    } catch (error) {
      console.error("Error fetching admin details for deletion:", error)
    }
  }

  const handleConfirmDeleteAdmin = async () => {
    if (!adminToDelete) return

    try {
      setIsDeletingAdmin(true)
      const adminId = adminToDelete.data?._id || adminToDelete._id
      await deleteAdmin(adminId)
      setIsDeleteAdminModalOpen(false)
      setAdminToDelete(null)
    } catch (error) {
      console.error("Error deleting admin:", error)
    } finally {
      setIsDeletingAdmin(false)
    }
  }

  // Role handlers
  const handleViewRole = async (row) => {
    setIsViewRoleSheetOpen(true)
    try {
      const roleDetails = await getRole(row.id)
      setSelectedRole(roleDetails)
    } catch (error) {
      console.error("Error fetching role details:", error)
      // Fallback to using row data if getRole fails
      setSelectedRole(row.originalData)
    }
  }

  const handleEditRole = async (row) => {
    setIsUpdateRoleModalOpen(true)
    try {
      const roleDetails = await getRole(row.id)
      setRoleToUpdate(roleDetails)
    } catch (error) {
      console.error("Error fetching role details for editing:", error)
      // Fallback to using row data
      setRoleToUpdate(row.originalData)
    }
  }

  const handleDeleteRole = async (row) => {
    try {
      const roleDetails = await getRole(row.id)
      setRoleToDelete(roleDetails)
      setIsDeleteRoleModalOpen(true)
    } catch (error) {
      console.error("Error fetching role details for deletion:", error)
      setRoleToDelete(row.originalData)
      setIsDeleteRoleModalOpen(true)
    }
  }

  const handleConfirmDeleteRole = async () => {
    if (!roleToDelete) return

    try {
      setIsDeletingRole(true)
      const roleId = roleToDelete.data?._id || roleToDelete._id
      await deleteRole(roleId)
      setIsDeleteRoleModalOpen(false)
      setRoleToDelete(null)
      // Refresh roles list
      await getAllRoles()
    } catch (error) {
      console.error("Error deleting role:", error)
    } finally {
      setIsDeletingRole(false)
    }
  }

  // Generic action handlers based on current tab
  const handleView = (row) => {
    if (mainTab === "admins") {
      handleViewAdmin(row)
    } else {
      handleViewRole(row)
    }
  }

  const handleEdit = (row) => {
    if (mainTab === "admins") {
      handleEditAdmin(row)
    } else {
      handleEditRole(row)
    }
  }

  const handleDelete = (row) => {
    if (mainTab === "admins") {
      handleDeleteAdmin(row)
    } else {
      handleDeleteRole(row)
    }
  }

  const ActionButtons = ({ row }) => (
    <div className="flex items-center gap-2">
      <button onClick={() => handleView(row)} className="text-gray-500 hover:text-gray-700" title="View Details">
        <Eye size={16} />
      </button>
      <button onClick={() => handleEdit(row)} className="text-blue-500 hover:text-blue-700" title="Edit">
        <Edit size={16} />
      </button>
      <button onClick={() => handleDelete(row)} className="text-red-500 hover:text-red-700" title="Delete">
        <Trash2 size={16} />
      </button>
    </div>
  )

  const adminTabs = [
    { id: "all", label: "All Admins" },
    { id: "super", label: "Super Admins" },
    { id: "managers", label: "Managers" },
    { id: "operations", label: "Operations" },
    { id: "others", label: "Others" },
  ]

  const handleAdminUpdateSuccess = async () => {
    try {
      await getAllAdmins()
    } catch (error) {
      console.error("Error refreshing admin list:", error)
    }
  }

  const handleRoleSuccess = async () => {
    try {
      await getAllRoles()
    } catch (error) {
      console.error("Error refreshing roles list:", error)
    }
  }

  return (
    <AppLayout title="Roles & Permissions">
      <div className="p-4 md:p-6 space-y-6">
        {/* Main Tab Switcher */}
        <div className="flex flex-col gap-4">
          <div className="flex gap-2">
            <MainTabButton
              label="Admins"
              icon={Users}
              active={mainTab === "admins"}
              onClick={() => {
                setMainTab("admins")
                setActiveTab("all")
              }}
            />
            <MainTabButton
              label="Roles"
              icon={Shield}
              active={mainTab === "roles"}
              onClick={() => setMainTab("roles")}
            />
          </div>
        </div>

        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
          {/* Admin Sub-tabs - Only show when on admins tab */}
          {mainTab === "admins" && (
            <div className="w-full lg:w-auto bg-gray-100 rounded-lg p-1">
              <Swiper freeMode={true} modules={[FreeMode]} slidesPerView="auto" spaceBetween={8} className="mySwiper">
                {adminTabs.map((tab) => (
                  <SwiperSlide key={tab.id} className="!w-auto">
                    <TabButton label={tab.label} active={activeTab === tab.id} onClick={() => setActiveTab(tab.id)} />
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>
          )}

          {mainTab === "roles" && <div className="flex-1" />}

          {/* Action Buttons */}
          <div className="flex gap-2 w-full lg:w-auto">
            {mainTab === "admins" ? (
              <>
                <Button
                  variant="outline"
                  className="flex-1 lg:flex-none whitespace-nowrap bg-transparent"
                  onClick={() => setMainTab("roles")}
                >
                  <Shield className="w-4 h-4 mr-2" />
                  View Roles
                </Button>
                <CustomButton
                  className="flex-1 lg:flex-none bg-[#1F1F76] hover:bg-indigo-700 whitespace-nowrap"
                  onClick={() => setIsAdminModalOpen(true)}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  New Admin
                </CustomButton>
              </>
            ) : (
              <>
                <Button
                  variant="outline"
                  className="flex-1 lg:flex-none whitespace-nowrap bg-transparent"
                  onClick={() => setMainTab("admins")}
                >
                  <Users className="w-4 h-4 mr-2" />
                  View Admins
                </Button>
                <CustomButton
                  className="flex-1 lg:flex-none bg-[#1F1F76] hover:bg-indigo-700 whitespace-nowrap"
                  onClick={() => setIsRoleModalOpen(true)}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  New Role
                </CustomButton>
              </>
            )}
          </div>
        </div>

        <div className="bg-white rounded-lg border overflow-hidden">
          <div className="overflow-x-auto">
            {loading ? (
              <div className="flex justify-center items-center p-8">
                <div className="text-gray-500">
                  Loading {mainTab === "admins" ? "admins" : "roles"}...
                </div>
              </div>
            ) : (
              <Table
                name={mainTab === "admins" ? "Admins" : "Roles"}
                columns={getTableColumns()}
                data={getTableData()}
                renderCustomCell={renderCustomCell}
                showSearch={false}
                itemsPerPage={10}
                renderActions={(row) => <ActionButtons row={row} />}
              />
            )}
          </div>
        </div>
      </div>

      {/* ===== ADMIN MODALS ===== */}
      <AdminModal isOpen={isAdminModalOpen} onClose={() => setIsAdminModalOpen(false)} />

      <UpdateAdminModal
        isOpen={isUpdateAdminModalOpen}
        onClose={() => {
          setIsUpdateAdminModalOpen(false)
          setAdminToUpdate(null)
        }}
        adminData={adminToUpdate}
        onUpdateSuccess={handleAdminUpdateSuccess}
      />

      <ViewAdminDetails
        admin={selectedAdmin}
        isOpen={isViewAdminSheetOpen}
        onClose={() => {
          setIsViewAdminSheetOpen(false)
          setSelectedAdmin(null)
        }}
      />

      <DeleteAdminModal
        isOpen={isDeleteAdminModalOpen}
        onClose={() => {
          setIsDeleteAdminModalOpen(false)
          setAdminToDelete(null)
        }}
        adminData={adminToDelete?.data || adminToDelete}
        onConfirm={handleConfirmDeleteAdmin}
        loading={isDeletingAdmin}
      />

      {/* ===== ROLE MODALS ===== */}
      <AddAdminRoleModal 
        isOpen={isRoleModalOpen} 
        onClose={() => setIsRoleModalOpen(false)}
        onCreateSuccess={handleRoleSuccess}
      />

      <UpdateRoleModal
        isOpen={isUpdateRoleModalOpen}
        onClose={() => {
          setIsUpdateRoleModalOpen(false)
          setRoleToUpdate(null)
        }}
        roleData={roleToUpdate}
        onUpdateSuccess={handleRoleSuccess}
      />

      <ViewRoleDetails
        role={selectedRole}
        isOpen={isViewRoleSheetOpen}
        onClose={() => {
          setIsViewRoleSheetOpen(false)
          setSelectedRole(null)
        }}
      />

      <DeleteRoleModal
        isOpen={isDeleteRoleModalOpen}
        onClose={() => {
          setIsDeleteRoleModalOpen(false)
          setRoleToDelete(null)
        }}
        roleData={roleToDelete}
        onConfirm={handleConfirmDeleteRole}
        loading={isDeletingRole}
      />
    </AppLayout>
  )
}