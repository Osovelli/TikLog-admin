"use client"

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
        <div className="grid grid-cols-2 gap-8 pb-4 ">
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

export const AdminModal = ({ isOpen, onClose }) => {
  const [expandedSections, setExpandedSections] = useState([])
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    role: "",
    address: "",
    password: "",
    avatar: null,
    permissions: {},
  })

  const { getAllRoles, adminRoles, loading, createAdmin, permissions, getPermissions } = useRoleStore()

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

  // Helper function to format permission labels
  const formatPermissionLabel = (permission) => {
    return permission
      .split("_")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ")
  }

  // Reset form when modal opens/closes
  useEffect(() => {
    const roleData = Array.isArray(adminRoles?.data) ? adminRoles.data : []

    if (isOpen) {
      // Reset form data when modal opens
      setFormData((prev) => ({
        ...prev,
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        role: roleData?.[0]?._id || "",
        address: "",
        password: "",
        avatar: null,
        // Keep the permissions structure but reset all checked states
        permissions: Object.keys(prev.permissions).reduce((acc, key) => {
          acc[key] = prev.permissions[key].map((p) => ({ ...p, checked: false }))
          return acc
        }, {}),
      }))
    } else {
      // Clear form data when modal closes
      // We don't reset permissions structure here, just the checked states
      setFormData((prev) => ({
        ...prev,
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        role: "",
        address: "",
        password: "",
        avatar: null,
        permissions: Object.keys(prev.permissions).reduce((acc, key) => {
          acc[key] = prev.permissions[key].map((p) => ({ ...p, checked: false }))
          return acc
        }, {}),
      }))

      // Reset expanded sections when modal closes
      if (permissions && permissions.length > 0) {
        setExpandedSections([permissions[0].name.toLowerCase().replace(/_/g, "")])
      }
    }
  }, [isOpen, adminRoles, permissions])

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
    // Collect all selected permission IDs into a flat array
    const selectedPermissions = []
    Object.keys(formData.permissions).forEach((section) => {
      formData.permissions[section].forEach((permission) => {
        if (permission.checked) {
          selectedPermissions.push(permission.id)
        }
      })
    })

    //prepare the payload for API call
    const adminData = {
      firstname: formData.firstName,
      lastname: formData.lastName,
      email: formData.email,
      password: formData.password,
      role: formData.role,
      permissions: selectedPermissions,
      avatar: formData.avatar, // This will be null if no avatar is selected
    }

    console.log("API Payload:", adminData)
    console.log("Selected permissions:", selectedPermissions)

    // Call the createAdmin function from the store
    await createAdmin(adminData)

    // close the modal on successful save
    onClose()
  }

  const handleImageUpload = (e) => {
    const file = e.target.files[0]
    if (file) {
      setFormData((prev) => ({ ...prev, avatar: file })) // Store the actual file, not the data URL
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
      title="Add New Admin"
      buttons={[
        {
          label: loading ? "Creating..." : "Save changes",
          onClick: handleSave,
          primary: true,
          disabled: loading,
        },
      ]}
    >
      <div className="space-y-4 text-left">
        {/* Avatar Upload */}
        <div className="flex flex-col items-center gap-2">
          <div className="w-24 h-24 bg-gray-100 rounded-lg flex items-center justify-center">
            {formData.avatar ? (
              <img
                src={URL.createObjectURL(formData.avatar) || "/placeholder.svg"}
                alt="Avatar"
                className="w-full h-full object-cover rounded-lg"
              />
            ) : (
              <div className="w-12 h-12 bg-gray-200" />
            )}
          </div>
          <label className="cursor-pointer">
            <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
            <span className="text-sm text-indigo-600 hover:text-indigo-700">Upload avatar</span>
          </label>
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

        {/* Password */}
        <Input
          type="password"
          placeholder="Password"
          value={formData.password}
          onChange={(e) => setFormData((prev) => ({ ...prev, password: e.target.value }))}
        />

        {/* Permissions Sections */}
        <div className="border rounded-lg divide-y">
          <div className="p-4">
            <h2 className="text-base font-medium text-gray-900">Set Permissions</h2>
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
