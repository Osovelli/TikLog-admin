import React, { useEffect, useState } from 'react'
import { Eye, Trash2, Plus, UserCircleIcon, FileEditIcon } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Swiper, SwiperSlide } from 'swiper/react'
import { FreeMode } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/navigation'
import { Table } from '@/components/Table'
import { AppLayout } from '@/components/AppLayout'
import { AdminModal } from '@/components/_AdminRolesComponents/AddAdminModal'
import { CustomButton } from '@/components/CustomButton'
import { AddAdminRoleModal } from '@/components/_AdminRolesComponents/AddAdminRoleModal'
import { useNavigate } from 'react-router'
import useRoleStore from '@/store/RolesStore'
import { ViewRoleDetails } from '@/components/_AdminRolesComponents/ViewRoleDetails'
import { EditRoleDetails } from '@/components/_AdminRolesComponents/EditRoleDetails'
import { set } from 'date-fns'


const TabButton = ({ label, active, onClick }) => (
  <button
    onClick={onClick}
    className={`px-4 py-2 text-sm font-medium rounded-lg whitespace-nowrap ${
      active 
        ? 'bg-white shadow' 
        : 'text-gray-500 hover:text-gray-700'
    }`}
  >
    {label}
  </button>
);

export const RolesPage = () => {
  const [activeTab, setActiveTab] = useState('all');
  //const [isAdminModalOpen, setIsAdminModalOpen] = useState(false)
  const [isAdminRoleModalOpen, setIsAdminRoleModalOpen] = useState(false)
  const [isViewRoleDetailsOpen, setIsViewRoleDetailsOpen] = useState(false)
  const [isEditRoleDetailsOpen, setEditRoleDetailsOpen] = useState(false)
  const [deletingRoleId, setDeletingRoleId] = useState(null)
  const [optimisticDeletedRoles, setOptimisticDeletedRoles] = useState(new Set())
  const { adminRoles, getAllRoles, getRole, selectedRole, deleteRole, loading} = useRoleStore()
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRoles = async () => {
      try {
        await getAllRoles();
      } catch (error) {
        console.error('Error fetching roles:', error);
      }
    console.log("AdminRoles:", adminRoles?.data)
    };
    fetchRoles();
  }, []);


  const columns = [
    {
      key: '_id',
      label: 'ID',
      isHidden: true, // Hide ID column
      render: (value) => <span className="text-gray-500">{value}</span>
    },
    { key: 'role', 
      label: 'Role' 
    },
    {
        key: 'description',
        label: 'Description',
    },
    { 
      key: 'lastLogin', 
      label: 'Last Login',
    },
    { key: 'status', 
      label: 'Status' 
    }
  ];

const Data = adminRoles?.data || [];
console.log({Data})

/* const rolesData = Data.map(role => ({
    _id: role._id,
    role: role.name,
    description: role.description,
    lastLoginDate: 'Dec 6, 2024', // Added manually
    lastLoginTime: '12:45:59',    // Added manually
    status: 'Active',             // Added manually
})); */

// Transform and filter roles data based on active tab
const allRolesData = Data.filter((role) => !optimisticDeletedRoles.has(role._id)) // Filter out optimistically deleted roles
    .map((role) => ({
      _id: role._id,
      role: role.name,
      description: role.description,
      lastLoginDate: "Dec 6, 2024", // Added manually
      lastLoginTime: "12:45:59",
      status: "Active",
      isDeleting: deletingRoleId === role._id, // Add deleting state
    }))

  // Filter roles based on active tab
  const getFilteredRoles = (roles, activeTab) => {
    switch (activeTab) {
      case "super":
        return roles.filter(
          (role) => role.role.toLowerCase().includes("super") || role.role.toLowerCase().includes("admin"),
        )
      case "managers":
        return roles.filter(
          (role) => role.role.toLowerCase().includes("manager") || role.role.toLowerCase().includes("lead"),
        )
      case "operations":
        return roles.filter(
          (role) => role.role.toLowerCase().includes("operation") || role.role.toLowerCase().includes("operator"),
        )
      case "others":
        return roles.filter((role) => {
          const roleName = role.role.toLowerCase()
          return (
            !roleName.includes("super") &&
            !roleName.includes("admin") &&
            !roleName.includes("manager") &&
            !roleName.includes("lead") &&
            !roleName.includes("operation") &&
            !roleName.includes("operator")
          )
        })
      case "all":
      default:
        return roles
    }
  }

const rolesData = getFilteredRoles(allRolesData, activeTab)

const SingleRole = selectedRole?.data;
      

  const adminsData = [
    {
      id: 1,
      name: 'Goodluck Ebele-Jonathan',
      email: 'ojembakudus@gmail.com',
      role: 'Super Admin',
      description: 'Has full access to all features and settings.',
      lastLoginDate: 'Dec 6, 2024',
      lastLoginTime: '12:45:59',
      status: 'Active',
      avatar: '/Avatar1.png'
    },
    // Duplicate the record 9 more times for demo
    ...Array(9).fill(null).map((_, index) => ({
      id: index + 2,
      name: 'Goodluck Ebele-Jonathan',
      email: 'ojembakudus@gmail.com',
      role: 'Super Admin',
      description: 'Has limited access to all features and settings.',
      lastLoginDate: 'Dec 6, 2024',
      lastLoginTime: '12:45:59',
      status: 'Active',
      avatar: '/Avatar1.png'
    }))
  ];

  const renderCustomCell = (key, value, row) => {
    if (key === 'status') {
      return (
        <span className={`px-3 py-1 rounded-full text-sm ${
          value === 'Active' 
            ? 'bg-green-50 text-green-700' 
            : 'bg-gray-100 text-gray-700'
        }`}>
          {value}
        </span>
      );
    }
    else if (key === 'name') {
      return (
        <div className="flex items-center gap-3">
          <img 
            src={row.avatar || "/Avatar1.png"} 
            alt={row.name}
            className="w-10 h-10 rounded-full"
          />
          <span className="font-medium line-clamp-1">{row.name}</span>
        </div>
      );
    }
    else if (key === 'lastLogin') {
      return (
        <div className="min-w-[120px]">
          <div className="text-gray-900">{row.lastLoginDate}</div>
          <div className="text-sm text-gray-500">{row.lastLoginTime}</div>
        </div>
      );
    }
    else if (key === 'email') {
      return (
        <span className="line-clamp-1">{row.email}</span>
      )
    }
    return value;
  };

  const handleView = async(row) => {
    console.log('View role details:', row);
    console.log('VIEW ROLE iD:', row._id);
    console.log('ROLE ID TYPE', typeof row?._id);
    /* setIsViewRoleDetailsOpen(true); */

    await getRole({_id: row?._id});
    console.log("Selected Role", SingleRole)
    // You can pass the fetched role data to the ViewRoleDetails component
    setIsViewRoleDetailsOpen(true);
  };

  /* const handleDelete = async(row) => {
    console.log('Delete admin:', row);
    await deleteRole({_id: row?._id});
  }; */

  const handleDelete = async (row) => {
    // Show confirmation dialog
    const confirmed = window.confirm(
      `Are you sure you want to delete the role "${row.role}"? This action cannot be undone.`,
    )

    if (!confirmed) return

    console.log("Delete role:", row)

    try {
      // Set loading state for this specific role
      setDeletingRoleId(row._id)

      // Optimistically remove from UI immediately for smooth UX
      setOptimisticDeletedRoles((prev) => new Set([...prev, row._id]))

      // Call the delete API
      await deleteRole({ _id: row._id })

      // Refresh the roles data to ensure consistency
      await getAllRoles()

      // Clear optimistic state after successful deletion
      setTimeout(() => {
        setOptimisticDeletedRoles((prev) => {
          const newSet = new Set(prev)
          newSet.delete(row._id)
          return newSet
        })
      }, 300) // Small delay to allow for smooth transition
    } catch (error) {
      console.error("Error deleting role:", error)

      // Revert optimistic update on error
      setOptimisticDeletedRoles((prev) => {
        const newSet = new Set(prev)
        newSet.delete(row._id)
        return newSet
      })

      // Show error message
      alert("Failed to delete role. Please try again.")
    } finally {
      setDeletingRoleId(null)
    }
  }

  const handleEditRole = async (row) => {
    console.log('Edit role:', row);
    setEditRoleDetailsOpen(true);
    await getRole({_id: row?._id});
  }

  /* const handleOpenViewRoleDetails = (role) => {
    console.log('View role details:', role);
    setIsViewRoleDetailsOpen(true);
  }; */


  const ActionButtons = ({ row }) => (
    <div className="flex items-center gap-2">
      <button 
        onClick={() => handleView(row)}
       /*  className="text-gray-500 hover:text-gray-700" */
        className="text-gray-500 hover:text-gray-700 p-1 rounded transition-colors"
        disabled={row.isDeleting}
      >
        <Eye size={16} />
      </button>
      {/* <button 
        onClick={() => handleDelete(row)}
        className="text-red-500 hover:text-red-700"
      >
        <Trash2 size={16} />
      </button> */}
      <button
        onClick={() => handleDelete(row)}
        className={`p-1 rounded transition-all duration-200 ${
          row.isDeleting ? "text-gray-400 cursor-not-allowed" : "text-red-500 hover:text-red-700 hover:bg-red-50"
        }`}
        disabled={row.isDeleting}
      >
        {row.isDeleting ? (
          <div className="w-4 h-4 border-2 border-gray-300 border-t-red-500 rounded-full animate-spin" />
        ) : (
          <Trash2 size={16} />
        )}
      </button>
      <button 
        onClick={() => handleEditRole(row)}
        className="text-blue-500 hover:text-blue-700"
        disabled={row.isEditing}
        >
        {/* <span className="sr-only">Edit Role</span> */}
        <FileEditIcon size={16} />
      </button>
    </div>
  );

  const tabs = [
    /* { id: 'all', label: 'All Admins' },
    { id: 'super', label: 'Super Admins' },
    { id: 'managers', label: 'Managers' },
    { id: 'operations', label: 'Operations' },
    { id: 'others', label: 'Others' } */
     {
      id: "all",
      label: `All Admins (${allRolesData.length})`,
    },
    {
      id: "super",
      label: `Super Admins (${getFilteredRoles(allRolesData, "super").length})`,
    },
    {
      id: "managers",
      label: `Managers (${getFilteredRoles(allRolesData, "managers").length})`,
    },
    {
      id: "operations",
      label: `Operations (${getFilteredRoles(allRolesData, "operations").length})`,
    },
    {
      id: "others",
      label: `Others (${getFilteredRoles(allRolesData, "others").length})`,
    },
  ];

  // Show loading state 
     /*  if (loading) {
        return (
          <AppLayout title="Customer">
            <div className="p-4 sm:p-6 bg-gray-50 min-h-screen">
              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="animate-pulse">
                  <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
                  <div className="space-y-3">
                    {[...Array(allRolesData.length)].map((_, i) => (
                      <div key={i} className="h-4 bg-gray-200 rounded"></div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </AppLayout>
        )
      } */

  return (
    <AppLayout title="Roles & Permissions">
    <div className="p-4 md:p-6 space-y-6">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <div className="w-full lg:w-auto bg-gray-100 rounded-lg p-1">
          <Swiper
            freeMode={true}
            modules={[FreeMode]}
            slidesPerView="auto"
            spaceBetween={8}
            className="mySwiper"
          >
            {tabs.map(tab => (
              <SwiperSlide key={tab.id} className="!w-auto">
                <TabButton
                  label={tab.label}
                  active={activeTab === tab.id}
                  onClick={() => setActiveTab(tab.id)}
                />
              </SwiperSlide>
            ))}
          </Swiper>
        </div>

        <div className="flex gap-2 w-full lg:w-auto">
          <Button 
            variant="outline" 
            className="flex-1 lg:flex-none whitespace-nowrap"
            onClick={()=>navigate('/admin-roles')}
          >
            <UserCircleIcon className="w-4 h-4 mr-2" />
            Admin Users
          </Button>
          {/* <Button 
            variant="outline" 
            className="flex-1 lg:flex-none whitespace-nowrap"
            onClick={() => setIsAdminRoleModalOpen(true)}
          >
            <Plus className="w-4 h-4 mr-2" />
            New Role
          </Button> */}
          <CustomButton 
            className="flex-1 lg:flex-none bg-[#1F1F76] hover:bg-indigo-700 whitespace-nowrap"
            onClick={() => setIsAdminRoleModalOpen(true)}
          >
            <Plus className="w-4 h-4 mr-2" />
            New Role
          </CustomButton>
        </div>
      </div>

      <div className="bg-white rounded-lg border overflow-hidden">
        <div className="overflow-x-auto">
          <Table
            name={"Roles & Permissions"}
            columns={columns}
            data={rolesData}
            renderCustomCell={renderCustomCell}
            showSearch={false}
            itemsPerPage={10}
            renderActions={(row) => <ActionButtons row={row} />}
          />
        </div>
      </div>
       {rolesData.length === 0 && !loading ? (
          <div className="p-8 text-center text-gray-500">
            <p>
              {activeTab === "all"
                ? "No roles found"
                : `No ${
                    activeTab === "super"
                      ? "Super Admin"
                      : activeTab === "managers"
                        ? "Manager"
                        : activeTab === "operations"
                          ? "Operations"
                          : "Other"
                  } roles found`}
            </p>
            {activeTab !== "all" && (
              <button onClick={() => setActiveTab("all")} className="mt-2 text-blue-600 hover:text-blue-800 underline">
                View all roles
              </button>
            )}
          </div>
        ) : 
        null
        }
    </div>
    {/* <AdminModal 
      isOpen={isAdminModalOpen}
      onClose={() => setIsAdminModalOpen(false)}
    /> */}
    <AddAdminRoleModal
      isOpen={isAdminRoleModalOpen}
      onClose={() => setIsAdminRoleModalOpen(false)}
    />
    <ViewRoleDetails
      role={SingleRole} // Replace with actual role data when available
      isOpen={isViewRoleDetailsOpen} // Replace with actual state to control visibility
      onClose={()=>setIsViewRoleDetailsOpen(false)} // Replace with actual close handler
    />

    <EditRoleDetails
      role={SingleRole} // Replace with actual role data when available
      isOpen={isEditRoleDetailsOpen} // Replace with actual state to control visibility
      onClose={()=>setEditRoleDetailsOpen(false)} // Replace with actual close handler
    />
    </AppLayout>
  );
};