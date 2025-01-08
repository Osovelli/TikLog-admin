import React, { useState } from 'react'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { ImagePlus } from 'lucide-react'
import Modal from '../ModalComponent'

export function AddVehicleModal({ isOpen, onClose }) {
  const [vehicleImages, setVehicleImages] = useState([])

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files)
    setVehicleImages(prev => [...prev, ...files].slice(0, 5))
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Add Vehicle"
      buttons={[
        {
          label: "Delete",
          onClick: () => console.log("Delete clicked"),
          style: "bg-white text-red-600 border border-red-600 hover:bg-red-50"
        },
        {
          label: "Save changes",
          onClick: () => console.log("Save clicked"),
          primary: true
        }
      ]}
    >
      <div className="space-y-4">
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
          <Input placeholder="Corolla" />
          <Select>
            <SelectTrigger>
              <SelectValue placeholder="2023" />
            </SelectTrigger>
            <SelectContent>
              {Array.from({ length: 10 }, (_, i) => 2024 - i).map(year => (
                <SelectItem key={year} value={year.toString()}>
                  {year}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <Select>
          <SelectTrigger className="flex items-center">
            <div className="w-4 h-4 rounded bg-red-500 mr-2" />
            <SelectValue placeholder="Red" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="red">
              <div className="flex items-center">
                <div className="w-4 h-4 rounded bg-red-500 mr-2" />
                Red
              </div>
            </SelectItem>
            <SelectItem value="blue">
              <div className="flex items-center">
                <div className="w-4 h-4 rounded bg-blue-500 mr-2" />
                Blue
              </div>
            </SelectItem>
            <SelectItem value="black">
              <div className="flex items-center">
                <div className="w-4 h-4 rounded bg-black mr-2" />
                Black
              </div>
            </SelectItem>
          </SelectContent>
        </Select>

        <Input placeholder="ABC - 1234 - IKJ" />

        <div className="grid grid-cols-5 gap-2">
          {[...Array(5)].map((_, index) => (
            <label
              key={index}
              className={`
                aspect-square rounded-lg border-2 border-dashed
                flex items-center justify-center cursor-pointer
                ${index < vehicleImages.length ? 'border-blue-600 bg-blue-50' : 'border-gray-300 hover:border-gray-400'}
              `}
            >
              {index < vehicleImages.length ? (
                <div className="w-full h-full bg-gray-200 rounded-lg" />
              ) : (
                <ImagePlus className="h-6 w-6 text-gray-400" />
              )}
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleImageUpload}
              />
            </label>
          ))}
        </div>

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