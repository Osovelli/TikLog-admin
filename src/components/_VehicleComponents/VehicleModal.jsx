import React, { useState } from 'react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import Modal from '../ModalComponent'

export const VehicleModal = ({ isOpen, onClose }) => {
  const [images, setImages] = useState([])

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
      title="Vehicle Information"
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
      <div className="space-y-4 py-4">
        {/* Vehicle Make */}
        <Select>
          <SelectTrigger>
            <SelectValue placeholder="Toyota" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="toyota">Toyota</SelectItem>
            <SelectItem value="honda">Honda</SelectItem>
            <SelectItem value="ford">Ford</SelectItem>
          </SelectContent>
        </Select>

        <div className="grid grid-cols-2 gap-4">
          {/* Vehicle Model */}
          <Select>
            <SelectTrigger>
              <SelectValue placeholder="Corolla" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="corolla">Corolla</SelectItem>
              <SelectItem value="camry">Camry</SelectItem>
              <SelectItem value="rav4">RAV4</SelectItem>
            </SelectContent>
          </Select>

          {/* Year */}
          <Select>
            <SelectTrigger>
              <SelectValue placeholder="2023" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="2023">2023</SelectItem>
              <SelectItem value="2022">2022</SelectItem>
              <SelectItem value="2021">2021</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Color */}
        <Select>
          <SelectTrigger>
            <SelectValue>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-full bg-red-500" />
                Red
              </div>
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="red">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-full bg-red-500" />
                Red
              </div>
            </SelectItem>
            <SelectItem value="blue">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-full bg-blue-500" />
                Blue
              </div>
            </SelectItem>
            <SelectItem value="black">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-full bg-black" />
                Black
              </div>
            </SelectItem>
          </SelectContent>
        </Select>

        {/* License Plate */}
        <Select>
          <SelectTrigger>
            <SelectValue placeholder="ABC - 1234 - IKJ" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="plate1">ABC - 1234 - IKJ</SelectItem>
            <SelectItem value="plate2">XYZ - 5678 - LMN</SelectItem>
          </SelectContent>
        </Select>

        {/* Image Upload */}
        <div className="grid grid-cols-5 gap-2">
          {[...Array(5)].map((_, index) => (
            <div 
              key={index} 
              className="aspect-square bg-gray-100 rounded-lg flex items-center justify-center"
            >
              {images[index] ? (
                <img 
                  src={images[index]} 
                  alt={`Vehicle ${index + 1}`}
                  className="w-full h-full object-cover rounded-lg"
                />
              ) : (
                <div className="w-8 h-8 bg-gray-200 rounded" />
              )}
            </div>
          ))}
        </div>

        {/* Driver Assignment */}
        <Select>
          <SelectTrigger>
            <SelectValue placeholder="Remi Aluko" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="remi">Remi Aluko</SelectItem>
            <SelectItem value="john">John Doe</SelectItem>
            <SelectItem value="jane">Jane Smith</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </Modal>
  )
}