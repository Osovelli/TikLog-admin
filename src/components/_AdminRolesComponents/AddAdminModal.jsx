import React, { useState } from 'react'
import { Input } from "@/components/ui/input"
import { MapPin, Upload } from 'lucide-react'
import Modal from '../ModalComponent'
import { CustomDropdown } from '../CustomDropDown'

export const AdminModal = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    role: 'Super Admin',
    address: '',
    password: '',
    avatar: null
  })

  const handleSave = () => {
    console.log('Form data:', formData)
    onClose()
  }

  const handleImageUpload = (e) => {
    const file = e.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, avatar: reader.result }))
      }
      reader.readAsDataURL(file)
    }
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Add New Admin"
      buttons={[
        {
          label: "Save changes",
          onClick: handleSave,
          primary: true
        }
      ]}
    >
      <div className="space-y-4 text-left">
        {/* Avatar Upload */}
        <div className="flex flex-col items-center gap-2">
          <div className="w-24 h-24 bg-gray-100 rounded-lg flex items-center justify-center">
            {formData.avatar ? (
              <img 
                src={formData.avatar} 
                alt="Avatar" 
                className="w-full h-full object-cover rounded-lg"
              />
            ) : (
              <div className="w-12 h-12 bg-gray-200" />
            )}
          </div>
          <label className="cursor-pointer">
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleImageUpload}
            />
            <span className="text-sm text-indigo-600 hover:text-indigo-700">
              Upload avatar
            </span>
          </label>
        </div>

        {/* Name Fields */}
        <div className="grid grid-cols-2 gap-4">
          <Input
            type="text"
            placeholder="Tunde"
            value={formData.firstName}
            onChange={(e) => setFormData(prev => ({ ...prev, firstName: e.target.value }))}
          />
          <Input
            type="text"
            placeholder="Olugbemi"
            value={formData.lastName}
            onChange={(e) => setFormData(prev => ({ ...prev, lastName: e.target.value }))}
          />
        </div>

        {/* Email */}
        <Input
          type="email"
          placeholder="tundeolugbemi@gmail.com"
          value={formData.email}
          onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
        />

        {/* Phone */}
        <Input
          type="tel"
          placeholder="0810 000 0000"
          value={formData.phone}
          onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
        />

        {/* Role */}
        <CustomDropdown
          value={formData.role}
          options={['Super Admin', 'Admin', 'Manager', 'Operations']}
          onChange={(value) => setFormData(prev => ({ ...prev, role: value }))}
        />

        {/* Address */}
        <div className="relative">
          <Input
            type="text"
            placeholder="56 Opebi road, Sabo Yaba"
            value={formData.address}
            onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
            className="pr-10"
          />
          <MapPin className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
        </div>

        {/* Password */}
        <Input
          type="password"
          placeholder="••••••••••"
          value={formData.password}
          onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
        />
      </div>
    </Modal>
  )
}