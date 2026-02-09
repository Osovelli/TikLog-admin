import React, { useEffect, useState, useMemo } from "react"
import { Input } from "@/components/ui/input"
import { Loader2, Upload, X } from "lucide-react"
import Modal from "../ModalComponent"
import { CustomDropdown } from "../CustomDropDown"
import useRoleStore from "@/store/RolesStore"
import useUploadStore from "@/store/uploadStore"

export const AdminModal = ({ isOpen, onClose, onCreateSuccess }) => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    role: "",
    password: "",
  })
  const [avatarFile, setAvatarFile] = useState(null)
  const [avatarPreview, setAvatarPreview] = useState(null)
  const [avatarUrl, setAvatarUrl] = useState(null) // Store the uploaded image URL/object
  const [errors, setErrors] = useState({})
  const [isUploading, setIsUploading] = useState(false)

  const { getAllRoles, adminRoles, loading, createAdmin } = useRoleStore()
  const { uploadFile } = useUploadStore() // Get upload function from your store

  // Fetch roles when modal opens
  useEffect(() => {
    const fetchRoles = async () => {
      if (isOpen && !adminRoles) {
        try {
          await getAllRoles()
        } catch (error) {
          console.error("Error fetching roles:", error)
        }
      }
    }
    fetchRoles()
  }, [isOpen, adminRoles, getAllRoles])

  // Reset form when modal closes
  useEffect(() => {
    if (!isOpen) {
      resetForm()
    }
  }, [isOpen])

  // Cleanup avatar preview URL on unmount
  useEffect(() => {
    return () => {
      if (avatarPreview) {
        URL.revokeObjectURL(avatarPreview)
      }
    }
  }, [avatarPreview])

  const resetForm = () => {
    setFormData({
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      role: "",
      password: "",
    })
    setAvatarFile(null)
    setAvatarPreview(null)
    setAvatarUrl(null)
    setErrors({})
  }

  // Get role options
  const roleOptions = useMemo(() => {
    const roleData = Array.isArray(adminRoles?.data) 
      ? adminRoles.data 
      : Array.isArray(adminRoles) 
        ? adminRoles 
        : []
    return roleData.map((role) => ({
      value: role?._id || "",
      label: role?.name || "Unknown Role",
    }))
  }, [adminRoles])

  const handleImageUpload = async (e) => {
    const file = e.target.files[0]
    if (!file) return

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setErrors(prev => ({ ...prev, avatar: "Please upload an image file" }))
      return
    }

    // Validate file size (e.g., max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setErrors(prev => ({ ...prev, avatar: "Image size should be less than 5MB" }))
      return
    }

    // Set preview
    setAvatarFile(file)
    setAvatarPreview(URL.createObjectURL(file))
    setErrors(prev => ({ ...prev, avatar: "" }))

    // Upload the image
    setIsUploading(true)
    try {
      const response = await uploadFile(file)
      console.log("Upload response:", response)
      
      // Store the returned image URL/object
      // Adjust based on your API response structure
      setAvatarUrl(response?.data?.url || response?.url || response)
    } catch (error) {
      console.error("Error uploading image:", error)
      setErrors(prev => ({ ...prev, avatar: "Failed to upload image. Please try again." }))
      setAvatarFile(null)
      setAvatarPreview(null)
    } finally {
      setIsUploading(false)
    }
  }

  const removeAvatar = () => {
    if (avatarPreview) {
      URL.revokeObjectURL(avatarPreview)
    }
    setAvatarFile(null)
    setAvatarPreview(null)
    setAvatarUrl(null)
  }

  const validateForm = () => {
    const newErrors = {}

    if (!formData.firstName.trim()) newErrors.firstName = "First name is required"
    if (!formData.lastName.trim()) newErrors.lastName = "Last name is required"
    if (!formData.email.trim()) {
      newErrors.email = "Email is required"
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email"
    }
    if (!formData.password.trim()) {
      newErrors.password = "Password is required"
    } else if (formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters"
    }
    if (!formData.role) newErrors.role = "Role is required"

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSave = async () => {
    if (!validateForm()) return

    // Build the payload
    const adminData = {
      firstname: formData.firstName.trim(),
      lastname: formData.lastName.trim(),
      email: formData.email.trim(),
      password: formData.password,
      role: formData.role,
    }

    // Add avatar URL if uploaded
    if (avatarUrl) {
      adminData.avatar = avatarUrl
    }

    console.log("API Payload:", adminData)

    try {
      await createAdmin(adminData)
      onClose()
      if (onCreateSuccess) {
        onCreateSuccess()
      }
    } catch (error) {
      console.error("Error creating admin:", error)
    }
  }

  const handleClose = () => {
    resetForm()
    onClose()
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Add New Admin"
      buttons={[
        {
          label: loading ? "Creating..." : "Save changes",
          onClick: handleSave,
          primary: true,
          disabled: loading || isUploading,
        },
      ]}
    >
      <div className="space-y-4 text-left p-6">
        {/* Avatar Upload */}
        <div className="flex flex-col items-center gap-2">
          <div className="relative w-24 h-24 bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden">
            {isUploading ? (
              <div className="flex flex-col items-center justify-center">
                <Loader2 className="w-6 h-6 animate-spin text-indigo-600" />
                <span className="text-xs text-gray-500 mt-1">Uploading...</span>
              </div>
            ) : avatarPreview ? (
              <>
                <img
                  src={avatarPreview}
                  alt="Avatar"
                  className="w-full h-full object-cover rounded-lg"
                />
                <button
                  type="button"
                  onClick={removeAvatar}
                  className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                >
                  <X className="w-3 h-3" />
                </button>
              </>
            ) : (
              <Upload className="w-8 h-8 text-gray-400" />
            )}
          </div>
          <label className="cursor-pointer">
            <input 
              type="file" 
              accept="image/*" 
              className="hidden" 
              onChange={handleImageUpload}
              disabled={isUploading}
            />
            <span className={`text-sm ${isUploading ? 'text-gray-400' : 'text-indigo-600 hover:text-indigo-700'}`}>
              {avatarPreview ? 'Change avatar' : 'Upload avatar'}
            </span>
          </label>
          {errors.avatar && <p className="text-red-500 text-xs">{errors.avatar}</p>}
        </div>

        {/* Name Fields */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Input
              type="text"
              placeholder="First Name"
              value={formData.firstName}
              onChange={(e) => {
                setFormData((prev) => ({ ...prev, firstName: e.target.value }))
                if (errors.firstName) setErrors((prev) => ({ ...prev, firstName: "" }))
              }}
              className={errors.firstName ? "border-red-500" : ""}
            />
            {errors.firstName && <p className="text-red-500 text-xs mt-1">{errors.firstName}</p>}
          </div>
          <div>
            <Input
              type="text"
              placeholder="Last Name"
              value={formData.lastName}
              onChange={(e) => {
                setFormData((prev) => ({ ...prev, lastName: e.target.value }))
                if (errors.lastName) setErrors((prev) => ({ ...prev, lastName: "" }))
              }}
              className={errors.lastName ? "border-red-500" : ""}
            />
            {errors.lastName && <p className="text-red-500 text-xs mt-1">{errors.lastName}</p>}
          </div>
        </div>

        {/* Email */}
        <div>
          <Input
            type="email"
            placeholder="Email"
            value={formData.email}
            onChange={(e) => {
              setFormData((prev) => ({ ...prev, email: e.target.value }))
              if (errors.email) setErrors((prev) => ({ ...prev, email: "" }))
            }}
            className={errors.email ? "border-red-500" : ""}
          />
          {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
        </div>

        {/* Phone (Optional) */}
        <Input
          type="tel"
          placeholder="Telephone Number (Optional)"
          value={formData.phone}
          onChange={(e) => setFormData((prev) => ({ ...prev, phone: e.target.value }))}
        />

        {/* Role */}
        <div>
          <CustomDropdown
            value={formData.role}
            options={roleOptions}
            placeholder="Select Role"
            onChange={(selectedValue) => {
              setFormData((prev) => ({ ...prev, role: selectedValue }))
              if (errors.role) setErrors((prev) => ({ ...prev, role: "" }))
            }}
          />
          {errors.role && <p className="text-red-500 text-xs mt-1">{errors.role}</p>}
        </div>

        {/* Password */}
        <div>
          <Input
            type="password"
            placeholder="Password"
            value={formData.password}
            onChange={(e) => {
              setFormData((prev) => ({ ...prev, password: e.target.value }))
              if (errors.password) setErrors((prev) => ({ ...prev, password: "" }))
            }}
            className={errors.password ? "border-red-500" : ""}
          />
          {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
        </div>
      </div>
    </Modal>
  )
}