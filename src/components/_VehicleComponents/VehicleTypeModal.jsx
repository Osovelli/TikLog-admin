import React, { useState } from 'react'
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Modal from '../ModalComponent'

export const VehicleTypeModal = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState({
    type: '',
    speed: '',
    cost: ''
  })

  const handleSave = () => {
    // Handle save logic
    onClose()
  }

  const handleDelete = () => {
    // Handle delete logic
    onClose()
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="New Vehicle Type"
      buttons={[
        {
          label: "Delete",
          onClick: handleDelete,
          style: "text-red-600 hover:text-red-700 hover:bg-red-50 bg-white border border-gray-200"
        },
        {
          label: "Save changes",
          onClick: handleSave,
          primary: true
        }
      ]}
    >
      <div className="space-y-4">
        <div className="space-y-2">
          <Input
            type="text"
            placeholder="Ship"
            value={formData.type}
            onChange={(e) => setFormData(prev => ({...prev, type: e.target.value}))}
          />
        </div>

        <div className="space-y-2">
          <div className="relative">
            <Input
              type="number"
              placeholder="123"
              value={formData.speed}
              onChange={(e) => setFormData(prev => ({...prev, speed: e.target.value}))}
              className="pr-12"
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">
              km/hr
            </span>
          </div>
        </div>

        <div className="space-y-2">
          <div className="relative">
            <Input
              type="number"
              placeholder="2,000"
              value={formData.cost}
              onChange={(e) => setFormData(prev => ({...prev, cost: e.target.value}))}
              className="pr-12"
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">
              N/Km
            </span>
          </div>
        </div>
      </div>
    </Modal>
  )
}