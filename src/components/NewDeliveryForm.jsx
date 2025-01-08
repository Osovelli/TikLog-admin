import React, { useRef, useState } from 'react'
import { X, Package, MapPin, ChevronLeft, ChevronRight, Bike, Car, Truck, AlertCircle, Wallet, Plus } from 'lucide-react'
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ButtonComponent } from './ButtonComponent'
import { useModal } from '@/lib/ModalContext'
import { DeliveryDetails } from './_HomeOVerviewComponents/DeliveryDetails'
import { WalletCard } from '@/icon/Icons'
import { DeliveryList } from './_HomeOVerviewComponents/DeliveryList'

const vehicleTypes = [
  { name: 'Bicycle', icon: Bike },
  { name: 'Bike', icon: Bike },
  { name: 'Car', icon: Car },
  { name: 'Van', icon: Car },
  { name: 'Truck', icon: Truck },
]

const SectionHeader = ({ children }) => (
  <h3 className="text-sm font-medium mb-4 text-center relative">
    <span className="bg-white px-4 relative z-10">{children}</span>
    <span className="absolute inset-0 flex items-center" aria-hidden="true">
      <span className="w-full border-t border-gray-300"></span>
    </span>
  </h3>
);

export const NewDeliveryForm = ({openDeliveryModal}) => {
  const [deliveryItems, setDeliveryItems] = useState([])
  const [editingId, setEditingId] = useState(null)
  const [formValues, setFormValues] = useState({
    pickupLocation: '',
    deliveryLocation: '',
    receiverName: '',
    receiverPhone: '',
    deliveryType: '',
    itemType: '',
    itemValue: '',
    additionalNote: ''
  })
  const scrollContainerRef = useRef(null)

  const handleAddItem = () => {
    const newItem = {
      id: Date.now().toString(),
      location: formValues.pickupLocation,
      timestamp: new Date().toLocaleString(),
      cost: parseFloat(formValues.itemValue) || 0,
    }
    setDeliveryItems([...deliveryItems, newItem])

    // Reset form after adding item
    setFormValues({
      pickupLocation: '',
      deliveryLocation: '',
      receiverName: '',
      receiverPhone: '',
      deliveryType: '',
      itemType: '',
      itemValue: '',
      additionalNote: ''
    })
  }

  const handleEditItem = (id) => {
    setEditingId(id)
    // Load the item details back into the form
    const item = deliveryItems.find(item => item.id === id)
    if (item) {
      // Update your form fields with item details
    }
  }

  const handleDeleteItem = (id) => {
    setDeliveryItems(deliveryItems.filter(item => item.id !== id))
  }


  const scroll = (direction) => {
    if (scrollContainerRef.current) {
      const scrollAmount = direction === 'left' ? -120 : 120
      scrollContainerRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' })
    }
  }

  return (
    <div className="bg-white h-[88vh] w-full max-w-md mx-auto flex flex-col overflow-y-auto my-6 space-y-4">
      <div className="flex-1 overflow-y-auto p-4 space-y-6">

        {deliveryItems.length > 0 && (
          <div className="p-4 border-b">
            <DeliveryList
              items={deliveryItems}
              onEdit={handleEditItem}
              onDelete={handleDeleteItem}
            />
          </div>
        )}


        <div className="space-y-4">
          <div className="flex items-center space-x-2 bg-gray-100 p-2 rounded-lg">
            <Package className="h-6 w-6 text-gray-500 flex-shrink-0" />
            <Input 
            placeholder="56 Opebi road, Sabo Yaba." 
            className="border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 "
            value={formValues.pickupLocation}
            onChange={(e) => setFormValues(prev => ({...prev, pickupLocation: e.target.value}))} 
            />
          </div>
          <div className="flex items-center space-x-2 bg-gray-100 p-2 rounded-lg">
            <MapPin className="h-6 w-6 text-gray-500 flex-shrink-0" />
            <Input placeholder="Allentown, 4140 Parker Rd, Ikeja." 
            className="border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0" 
            value={formValues.deliveryLocation}
            onChange={(e) => setFormValues(prev => ({...prev, deliveryLocation: e.target.value}))}
            />
          </div>
        </div>

        <div>
          <h3 className="text-sm font-medium mb-2">Vehicle type</h3>
          <div className="relative">
            <div className="flex items-center">
              <Button
                variant="ghost"
                size="icon"
                className="absolute left-0 z-10 bg-white bg-opacity-75"
                onClick={() => scroll('left')}
              >
                <ChevronLeft className="h-4 w-4" />
                <span className="sr-only">Scroll left</span>
              </Button>
              <div
                ref={scrollContainerRef}
                className="flex overflow-x-auto space-x-2 py-2 px-8 scrollbar-hide"
              >
                {vehicleTypes.map((vehicle) => (
                  <Button
                    key={vehicle.name}
                    variant="outline"
                    className="flex flex-col items-center p-2 h-auto min-w-[80px] flex-shrink-0"
                  >
                    <vehicle.icon className="w-10 h-10 mb-1" />
                    <span className="text-xs">{vehicle.name}</span>
                  </Button>
                ))}
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-0 z-10 bg-white bg-opacity-75"
                onClick={() => scroll('right')}
              >
                <ChevronRight className="h-4 w-4" />
                <span className="sr-only">Scroll right</span>
              </Button>
            </div>
          </div>
        </div>

        <div>
          {/* <h3 className="text-sm font-medium mb-2 text-center">RECEIVER'S INFORMATION</h3> */}
          <SectionHeader>RECEIVER'S INFORMATION</SectionHeader>
          <div className="space-y-2">
            <Input placeholder="Receiver's name*" 
            value={formValues.receiverName}
            onChange={(e) => setFormValues(prev => ({...prev, receiverName: e.target.value}))} 
            />
            <Input placeholder="Phone number*" 
              value={formValues.receiverPhone}
              onChange={(e) => setFormValues(prev => ({...prev, receiverPhone: e.target.value}))} 
            />
          </div>
        </div>

        <div>
          {/* <h3 className="text-sm font-medium mb-2 text-center">DELIVERY INFORMATION</h3> */}
          <SectionHeader>DELIVERY INFORMATION</SectionHeader>
          <div className="space-y-2">
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Select delivery type*" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="standard">Standard Delivery</SelectItem>
                <SelectItem value="express">Express Delivery</SelectItem>
              </SelectContent>
            </Select>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Select item*" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="package">Package</SelectItem>
                <SelectItem value="document">Document</SelectItem>
                <SelectItem value="food">Food</SelectItem>
              </SelectContent>
            </Select>
            <Input placeholder="Item estimated Value*" 
              value={formValues.itemValue}
              onChange={(e) => setFormValues(prev => ({...prev, itemValue: e.target.value}))}
            />
            <Input placeholder="Additional note" 
              value={formValues.additionalNote}
              onChange={(e) => setFormValues(prev => ({...prev, additionalNote: e.target.value}))} 
            />
          </div>
        </div>
      </div>
      {/* <ButtonComponent variant={'primary'} label={'Continue'} buttonStyles={'w-full'} onClick={openDeliveryModal}/> */}
      <div className="p-4 border-t">
        <div className="flex justify-around">
          <ButtonComponent variant="outline" 
            label={'Add More'} 
            icon={<Plus className="w-4 h-4 mr-2" />}  
            buttonStyles={""}
            onClick={handleAddItem}>            
          </ButtonComponent>
          <ButtonComponent 
          variant={'primary'} 
          label={'Continue'} 
          buttonStyles={"w-20"} 
          onClick={openDeliveryModal}  
          />
        </div>
      </div>
    </div>
  )
}