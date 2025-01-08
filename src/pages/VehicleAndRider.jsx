import { AddRiderModal } from '@/components/_VehicleRiderComponents/AddRiderModal'
import { AddVehicleModal } from '@/components/_VehicleRiderComponents/AddVehicleModal'
import { AppLayout } from '@/components/AppLayout'
import { ButtonComponent } from '@/components/ButtonComponent'
import { Table } from '@/components/Table'
import { Badge } from '@/components/ui/badge'
import { Plus } from 'lucide-react'
import React, { useState } from 'react'
import { FaCar } from 'react-icons/fa'

export const VehicleAndRider = () => {
 const [activeTab, setActiveTab] = useState('vehicles')
 const [isAddVehicleModalOpen, setIsAddVehicleModalOpen] = useState(false)
 const [isAddRiderModalOpen, setIsAddRiderModalOpen] = useState(false)

const vehicleColumns = [
    { key: 'vehicle type', label: 'Vehicle Type' },
    { key: 'model', label: 'Model' },
    { key: 'license number', label: 'License Number' },
    { key: 'date', label: 'Date Added' },
    { key: 'status', label: 'Status' },
    { key: 'rider assigned', label: 'Rider Assigned'},
];

const riderColumns = [
    { key: 'name', label: 'Rider name' },
    { key: 'phone', label: 'Phone number' },
    { key: 'status', label: 'Status' },
    { key: 'address', label: 'Address' },
  ]

const vehicleData = [
    {
    "vehicle type": "Car",
    "model": "Toyota Matrix",
    "license number": "XL235ABC",
    "date": "Dec 6, 2024",
    "status": "Active",
    "rider assigned": "Kemisola Ajayi"
    },
    {
    "vehicle type": "Bike",
    "model": "Bajaj",
    "license number": "AK235ABC",
    "date": "Dec 6, 2024",
    "status": "Inactive",
    "rider assigned": "Kemisola Ajayi"
    },
    {
    "vehicle type": "Car",
    "model": "Toyota Matrix",
    "license number": "PC235LOS",
    "date": "Dec 6, 2024",
    "status": "Active",
    "rider assigned": "Kemisola Ajayi"
    },
    {
    "vehicle type": "Bike",
    "model": "Hyundia",
    "license number": "AB235ABC",
    "date": "Dec 6, 2024",
    "status": "Active",
    "rider assigned": "Kemisola Ajayi"
    },
    {
    "vehicle type": "Car",
    "model": "Toyota Matrix",
    "license number": "XL524ABC",
    "date": "Dec 6, 2024",
    "status": "Active",
    "rider assigned": "Kemisola Ajayi"
    },
    {
    "vehicle type": "Car",
    "model": "Toyota Matrix",
    "license number": "XL235ABC",
    "date": "Dec 6, 2024",
    "status": "Active",
    "rider assigned": "Kemisola Ajayi"
    },
    {
    "vehicle type": "Car",
    "model": "Toyota Matrix",
    "license number": "XL235ABC",
    "date": "Dec 6, 2024",
    "status": "Active",
    "rider assigned": "Kemisola Ajayi"
    }
]

const riderData = [
    {
      "name": "James Okpeba",
      "phone": "0810 000 0000",
      "status": "Active",
      "address": "Lagos, Nigeria"
    },
    {
      "name": "James Okpeba",
      "phone": "0810 000 0000",
      "status": "Active",
      "address": "Lagos, Nigeria"
    },
    {
      "name": "James Okpeba",
      "phone": "0810 000 0000",
      "status": "Active",
      "address": "Lagos, Nigeria"
    }
  ]

  const renderCustomCell = (key, value, item) => {
    console.log('renderCustomCell called with key: ', key, 'value: ', value);
    if (key === 'rider assigned') {
      return <span className="text-blue-600">{value}</span>
    }
    /* if (key === 'status') {
      const badgeColor = value.toLowerCase() === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
      return (
        <Badge className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${badgeColor}`}>
          {value}
        </Badge>
      )
    } */
    return value
  }

  return (
    <AppLayout title={"Vehicles & Rider"} icon={<FaCar />}>
        <div className='p-8'>
            <div className="flex justify-between items-start mb-8">
                <div className='max-w-[10rem] sm:max-w-full'>
                    <h2 className="sm:text-2xl text-base font-semibold">Vehicles & Riders</h2>
                    <span className='sm:text-sm text-xs text-[#868C98]'>Keep track of all your deliveries</span>
                </div>
                <div className="flex flex-col sm:flex-row gap-2">
                    <ButtonComponent 
                    variant='secondary' 
                    icon={<Plus size={16}/>} 
                    label={"Add Rider"} 
                    buttonStyles="sm:px-4 px-2 h-[30px] sm:h-[52px]" 
                    onClick={() => setIsAddRiderModalOpen(true)}
                    />
                    <ButtonComponent 
                    variant='primary' 
                    icon={<Plus size={16}/>} 
                    label={"Add Vehicle"} 
                    buttonStyles="sm:px-4 px-2 h-[30px] sm:h-[52px]" 
                    onClick={() => setIsAddVehicleModalOpen(true)} 
                    />
                </div>
            </div>
             {/* Tabs */}
            <div className="border-b mb-6">
            <div className="flex gap-8">
                <button
                className={`pb-2 px-1 ${
                    activeTab === 'vehicles'
                    ? 'border-b-2 border-blue-600 text-blue-600 font-medium'
                    : 'text-gray-500'
                }`}
                onClick={() => setActiveTab('vehicles')}
                >
                Vehicles
                </button>
                <button
                className={`pb-2 px-1 ${
                    activeTab === 'riders'
                    ? 'border-b-2 border-blue-600 text-blue-600 font-medium'
                    : 'text-gray-500'
                }`}
                onClick={() => setActiveTab('riders')}
                >
                Riders
                </button>
            </div>
            </div>
            <Table 
            data={activeTab === 'vehicles' ? vehicleData : riderData}
            columns={activeTab === 'vehicles' ? vehicleColumns : riderColumns}
            onRowClick={(item) => console.log('clicked:', item)}
            itemsPerPage={10}
            renderCustomCell={renderCustomCell}
            showSearch={false}
            showDelete={true}
            />
        </div>
        <AddRiderModal 
        isOpen={isAddRiderModalOpen}
        onClose={() => setIsAddRiderModalOpen(false)}
        />
        <AddVehicleModal
        isOpen={isAddVehicleModalOpen}
        onClose={() => setIsAddVehicleModalOpen(false)}
        />
    </AppLayout>
  )
}
