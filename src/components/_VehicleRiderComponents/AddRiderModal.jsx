import React, { useState } from 'react'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Calendar, MapPin, Eye, EyeOff } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Modal from '../ModalComponent'

export function AddRiderModal({ isOpen, onClose }) {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    countryCode: '+234',
    dateOfBirth: '',
    gender: '',
    address: '',
    licenseNumber: '',
    licenseIssueDate: '',
    licenseExpiryDate: '',
    password: '',
    confirmPassword: ''
  })

  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = () => {
    console.log('Form data:', formData)
    // TODO: Send to API
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Add Rider"
      buttons={[
        {
          label: "Delete",
          onClick: () => console.log("Delete clicked"),
          style: "bg-white text-red-600 border border-red-600 hover:bg-red-50"
        },
        {
          label: "Save changes",
          onClick: handleSubmit,
          primary: true
        }
      ]}
    >
      <div className="space-y-4 h-[400px] overflow-y-scroll">
        <div className="grid grid-cols-2 gap-4">
          <Input
            placeholder="James"
            name="firstName"
            value={formData.firstName}
            onChange={handleInputChange}
          />
          <Input
            placeholder="Okpepa"
            name="lastName"
            value={formData.lastName}
            onChange={handleInputChange}
          />
        </div>

        <Input
          placeholder="user@tiklog.com"
          type="email"
          name="email"
          value={formData.email}
          onChange={handleInputChange}
        />

        <div className="flex gap-2">
          <Select 
            value={formData.countryCode}
            onValueChange={(value) => setFormData(prev => ({ ...prev, countryCode: value }))}
          >
            <SelectTrigger className="w-[100px]">
              <SelectValue placeholder="+234" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="+234">+234</SelectItem>
              <SelectItem value="+1">+1</SelectItem>
              <SelectItem value="+44">+44</SelectItem>
            </SelectContent>
          </Select>
          <Input
            placeholder="8100441503"
            name="phoneNumber"
            value={formData.phoneNumber}
            onChange={handleInputChange}
            className="flex-1"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="relative">
            <Input
              placeholder="22 - 02 -2022"
              name="dateOfBirth"
              value={formData.dateOfBirth}
              onChange={handleInputChange}
            />
            <Calendar className="absolute right-3 top-2.5 h-5 w-5 text-gray-400" />
          </div>
          <Select
            value={formData.gender}
            onValueChange={(value) => setFormData(prev => ({ ...prev, gender: value }))}
          >
            <SelectTrigger>
              <SelectValue placeholder="Male" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="male">Male</SelectItem>
              <SelectItem value="female">Female</SelectItem>
              <SelectItem value="other">Other</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="relative">
          <Input
            placeholder="56 Opebi road, Sabo Yaba."
            name="address"
            value={formData.address}
            onChange={handleInputChange}
          />
          <MapPin className="absolute right-3 top-2.5 h-5 w-5 text-gray-400" />
        </div>

        <div className="space-y-4">
          <h3 className="text-sm font-medium text-gray-700">License Information</h3>
          <Input
            placeholder="0123456890AZ"
            name="licenseNumber"
            value={formData.licenseNumber}
            onChange={handleInputChange}
          />
          <div className="grid grid-cols-2 gap-4">
            <div className="relative">
              <Input
                placeholder="22 - 02 - 2022"
                name="licenseIssueDate"
                value={formData.licenseIssueDate}
                onChange={handleInputChange}
              />
              <Calendar className="absolute right-3 top-2.5 h-5 w-5 text-gray-400" />
            </div>
            <div className="relative">
              <Input
                placeholder="21 - 02 - 2024"
                name="licenseExpiryDate"
                value={formData.licenseExpiryDate}
                onChange={handleInputChange}
              />
              <Calendar className="absolute right-3 top-2.5 h-5 w-5 text-gray-400" />
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-sm font-medium text-gray-700">Password</h3>
          <div className="relative">
            <Input
              type={showPassword ? "text" : "password"}
              placeholder="Input password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
            />
            <Button
              variant="ghost"
              size="sm"
              className="absolute right-1 top-1 h-8 w-8 p-0"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </Button>
          </div>
          <div className="relative">
            <Input
              type={showConfirmPassword ? "text" : "password"}
              placeholder="Confirm password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleInputChange}
            />
            <Button
              variant="ghost"
              size="sm"
              className="absolute right-1 top-1 h-8 w-8 p-0"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            >
              {showConfirmPassword ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  )
}