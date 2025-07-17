import React, { useEffect, useState } from "react"
import { Input } from "@/components/ui/input"
import { ChevronDown, ChevronRight } from "lucide-react"
import Modal from "../ModalComponent"
import { CustomDropdown } from "../CustomDropDown"
import { CustomCheckbox } from "../CustomCheckbox"
import useRoleStore from "@/store/RolesStore"

const PermissionSection = ({ title, isOpen, onToggle, permissions, onChange, onSelectAll }) => {
  const allChecked = permissions.every((p) => p.checked)
  const someChecked = permissions.some((p) => p.checked)

  return (
    <div className="border-t first:border-t-0 p-2">
      <div className="flex items-center justify-between py-4 cursor-pointer" onClick={onToggle}>
        <div className="flex items-center gap-2">
          {isOpen ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
          <span className="font-medium">{title}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-500">Select all</span>
          <CustomCheckbox
            checked={allChecked}
            ref={React.useRef()}
            onCheckedChange={onSelectAll}
            className={someChecked && !allChecked ? "data-[state=checked]:bg-indigo-300" : ""}
          />
        </div>
      </div>
      {isOpen && (
        <div className="grid grid-cols-2 gap-8 pb-4">
          {permissions.map((permission) => (
            <div key={permission.id} className="flex items-center gap-2">
              <CustomCheckbox
                checked={permission.checked}
                onCheckedChange={(checked) => onChange(permission.id, checked)}
              />
              <span className="text-sm">{permission.label}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export const UpdateAdminModal = ({ isOpen, onClose, adminData, onUpdateSuccess }) => {
  const [expandedSections, setExpandedSections] = useState([])
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    role: "",
    address: "",
    avatar: null,
    permissions: {},
  })
  const [imageFile, setImageFile] = useState(null)
  const [previewImage, setPreviewImage] = useState(null)
  const [adminStatus, setAdminStatus] = useState("")

  const {
    getAllRoles,
    adminRoles,
    loading,
    updateAdmin,
    updateAdminImage,
    permissions,
    getPermissions,
    activateAdmin,
  } = useRoleStore()

  // Fetch roles and permissions when component mounts
  useEffect(() => {
    if (adminRoles === null) {
      getAllRoles()
    }
    if (!permissions || permissions.length === 0) {
      getPermissions()
    }
  }, [adminRoles, getAllRoles, permissions, getPermissions])

  // Transform backend permissions into UI format when permissions data changes
  useEffect(() => {
    if (permissions && permissions.length > 0) {
      const permissionsObj = {}
      const initialExpandedSections = []

      permissions.forEach((category) => {
        const sectionKey = category.name.toLowerCase().replace(/_/g, "")
        initialExpandedSections.push(sectionKey)
        permissionsObj[sectionKey] = category.permissions.map((perm) => ({
          id: perm,
          label: formatPermissionLabel(perm),
          checked: false,
        }))
      })

      setFormData((prev) => ({
        ...prev,
        permissions: permissionsObj,
      }))

      // Set initial expanded sections to the first section
      if (initialExpandedSections.length > 0) {
        setExpandedSections([initialExpandedSections[0]])
      }
    }
  }, [permissions])

  console.log("ADMIN DATA:", adminData)

  // Populate form with admin data when modal opens
  useEffect(() => {
    if (isOpen && adminData) {
      setFormData((prev) => ({
        ...prev,
        firstName: adminData?.data?.firstname || "",
        lastName: adminData?.data?.lastname || "",
        email: adminData?.data?.email || "",
        phone: adminData?.data?.phone || "",
        role: adminData.data?.role?._id || "",
        address: adminData.address || "",
        avatar: null,
      }))

      // Set admin status
      setAdminStatus(adminData?.data?.status || "")

      // Set preview image if admin has an avatar
      if (adminData.avatar) {
        setPreviewImage(adminData.avatar)
      } else {
        setPreviewImage(null)
      }

      // Set permissions based on admin's current permissions
      if (adminData.permissions && permissions) {
        const updatedPermissions = { ...formData.permissions }
        Object.keys(updatedPermissions).forEach((section) => {
          updatedPermissions[section] = updatedPermissions[section].map((perm) => ({
            ...perm,
            checked: adminData.permissions.includes(perm.id),
          }))
        })
        setFormData((prevForm) => ({
          ...prevForm,
          permissions: updatedPermissions,
        }))
      }
    }
  }, [isOpen, adminData, permissions])

  // Helper function to format permission labels
  const formatPermissionLabel = (permission) => {
    return permission
      .split("_")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ")
  }

  // Reset form when modal closes
  useEffect(() => {
    if (!isOpen) {
      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        role: "",
        address: "",
        avatar: null,
        permissions: {},
      })
      setImageFile(null)
      setPreviewImage(null)
      setAdminStatus("")
      // Reset expanded sections when modal closes
      if (permissions && permissions.length > 0) {
        setExpandedSections([permissions[0].name.toLowerCase().replace(/_/g, "")])
      }
    }
  }, [isOpen, permissions])

  const toggleSection = (section) => {
    setExpandedSections((prev) => (prev.includes(section) ? prev.filter((s) => s !== section) : [...prev, section]))
  }

  const handlePermissionChange = (section, id, checked) => {
    setFormData((prev) => ({
      ...prev,
      permissions: {
        ...prev.permissions,
        [section]: prev.permissions[section].map((p) => (p.id === id ? { ...p, checked } : p)),
      },
    }))
  }

  const handleSelectAll = (section, checked) => {
    setFormData((prev) => ({
      ...prev,
      permissions: {
        ...prev.permissions,
        [section]: prev.permissions[section].map((p) => ({ ...p, checked })),
      },
    }))
  }

  const handleSave = async () => {
    try {
      // Collect all selected permission IDs into a flat array
      const selectedPermissions = []
      Object.keys(formData.permissions).forEach((section) => {
        formData.permissions[section].forEach((permission) => {
          if (permission.checked) {
            selectedPermissions.push(permission.id)
          }
        })
      })

      // Prepare the payload for API call (excluding image)
      const adminUpdateData = {
        id: adminData?.data?._id,
        firstname: formData.firstName,
        lastname: formData.lastName,
        email: formData.email,
        role: formData.role,
        permissions: selectedPermissions,
        phone: formData.phone,
        address: formData.address,
      }

      console.log("Update API Payload:", adminUpdateData)
      console.log("Selected permissions:", selectedPermissions)

      // Call the updateAdmin function from the store
      await updateAdmin(adminUpdateData)

      // Handle image upload separately if there's a new image
      if (imageFile) {
        const imageFormData = new FormData()
        imageFormData.append("id", adminData?.data?._id)
        imageFormData.append("image", imageFile)

        console.log("Updating admin image...")
        console.log("Image Form Data:", imageFormData)
        await updateAdminImage({image: imageFormData})
      }

      // Call the success callback to refresh the admin list
      if (onUpdateSuccess) {
        await onUpdateSuccess()
      }

      // Close the modal on successful save
      onClose()
    } catch (error) {
      console.error("Error updating admin:", error)
      // You might want to show a toast notification here
    }
  }

  const handleImageUpload = (e) => {
    const file = e.target.files[0]
    if (file) {
      setImageFile(file)
      // Create preview URL
      const previewUrl = URL.createObjectURL(file)
      setPreviewImage(previewUrl)
    }
  }

  const handleActivateDeactivate = async () => {
    try {
      console.log(`${adminStatus === "active" ? "Deactivating" : "Activating"} admin:`, adminData._id)

      await activateAdmin(adminData._id)

      // Update local status state
      setAdminStatus(adminStatus === "active" ? "inactive" : "active")

      // Call the success callback to refresh the admin list
      if (onUpdateSuccess) {
        await onUpdateSuccess()
      }

      console.log(`Admin ${adminStatus === "active" ? "deactivated" : "activated"} successfully`)
    } catch (error) {
      console.error("Error activating/deactivating admin:", error)
      // You might want to show a toast notification here
    }
  }

  // Generate sections from backend permissions
  const sections =
    permissions?.map((category) => ({
      id: category.name.toLowerCase().replace(/_/g, ""),
      label: category.name
        .split("_")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" "),
    })) || []

  // Properly handle the role data
  const roleData = Array.isArray(adminRoles?.data) ? adminRoles.data : []

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Update Admin"
      buttons={[
        {
          label: adminStatus === "active" ? "Deactivate Admin" : "Activate Admin",
          onClick: handleActivateDeactivate,
          primary: false,
          disabled: loading,
          className:
            adminStatus === "active"
              ? "bg-red-600 hover:bg-red-700 text-white"
              : "bg-green-600 hover:bg-green-700 text-white",
        },
        {
          label: loading ? "Updating..." : "Update Admin",
          onClick: handleSave,
          primary: true,
          disabled: loading,
        },
      ]}
    >
      <div className="space-y-4 text-left p-6">
        {/* Avatar Upload */}
        <div className="flex flex-col items-center gap-2">
          <div className="w-24 h-24 bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden">
            {previewImage ? (
              <img
                src={previewImage || "/placeholder.svg"}
                alt="Avatar"
                className="w-full h-full object-cover rounded-lg"
              />
            ) : (
              <div className="w-12 h-12 bg-gray-200 rounded-lg" />
            )}
          </div>
          <label className="cursor-pointer">
            <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
            <span className="text-sm text-indigo-600 hover:text-indigo-700">
              {previewImage ? "Change avatar" : "Upload avatar"}
            </span>
          </label>
        </div>

        {/* Admin Status Indicator */}
        <div className="flex items-center justify-center gap-2 p-3 bg-gray-50 rounded-lg">
          <span className="text-sm font-medium text-gray-700">Current Status:</span>
          <span
            className={`px-3 py-1 rounded-full text-sm font-medium capitalize ${
              adminStatus?.toLowerCase() === "active" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
            }`}
          >
            {adminStatus || "Unknown"}
          </span>
        </div>

        {/* Name Fields */}
        <div className="grid grid-cols-2 gap-4">
          <Input
            type="text"
            placeholder="First Name"
            value={formData.firstName}
            onChange={(e) => setFormData((prev) => ({ ...prev, firstName: e.target.value }))}
          />
          <Input
            type="text"
            placeholder="Last Name"
            value={formData.lastName}
            onChange={(e) => setFormData((prev) => ({ ...prev, lastName: e.target.value }))}
          />
        </div>

        {/* Email */}
        <Input
          type="email"
          placeholder="Email"
          value={formData.email}
          onChange={(e) => setFormData((prev) => ({ ...prev, email: e.target.value }))}
        />

        {/* Phone */}
        <Input
          type="tel"
          placeholder="Telephone Number"
          value={formData.phone}
          onChange={(e) => setFormData((prev) => ({ ...prev, phone: e.target.value }))}
        />

        {/* Address */}
        <Input
          type="text"
          placeholder="Address"
          value={formData.address}
          onChange={(e) => setFormData((prev) => ({ ...prev, address: e.target.value }))}
        />

        {/* Role */}
        <CustomDropdown
          value={formData.role}
          options={roleData.map((role) => ({
            value: role?._id || "",
            label: role?.name || "Unknown Role",
          }))}
          placeholder="Select Role"
          onChange={(selectedValue) => {
            setFormData((prev) => ({ ...prev, role: selectedValue }))
          }}
        />

        {/* Permissions Sections */}
        <div className="border rounded-lg divide-y">
          <div className="p-4">
            <h2 className="text-base font-medium text-gray-900">Update Permissions</h2>
          </div>
          {sections.map(
            (section) =>
              formData.permissions[section.id] && (
                <PermissionSection
                  key={section.id}
                  title={section.label}
                  isOpen={expandedSections.includes(section.id)}
                  onToggle={() => toggleSection(section.id)}
                  permissions={formData.permissions[section.id]}
                  onChange={(id, checked) => handlePermissionChange(section.id, id, checked)}
                  onSelectAll={(checked) => handleSelectAll(section.id, checked)}
                />
              ),
          )}
        </div>
      </div>
    </Modal>
  )
}
