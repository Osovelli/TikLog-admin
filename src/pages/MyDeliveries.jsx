import { AppLayout } from '@/components/AppLayout'
import { ButtonComponent } from '@/components/ButtonComponent'
import { Table } from '@/components/Table';
import { Plus } from 'lucide-react'
import React from 'react'

// Example usage:
const columns = [
  { key: 'rideId', label: 'Ride ID' },
  { key: 'from', label: 'From' },
  { key: 'to', label: 'To' },
  { key: 'vehicle', label: 'Vehicle' },
  { key: 'deliveries', label: 'Deliveries' },
  { key: 'status', label: 'Status' },
  { key: 'fee', label: 'Fee' }
];

const data = [
  {
    id: 1,
    rideId: '#123354',
    from: 'Ikeja, Lagos',
    to: 'Lekki, Lagos',
    vehicle: 'Car',
    deliveries: 2,
    status: 'Delivered',
    fee: '1,600'
  },
  // ... more data
];

export const MyDeliveries = () => {
  return (
    <AppLayout title={'Deliveries'}>
        <div className='p-8'>
            <div className="flex justify-between items-start mb-8">
                <div className='max-w-[10rem] sm:max-w-full'>
                    <h2 className="sm:text-2xl text-base font-semibold">My Deliveries</h2>
                    <span className='sm:text-sm text-xs text-[#868C98]'>Keep track of all your deliveries</span>
                </div>
                <ButtonComponent 
                variant='primary' 
                icon={<Plus size={16}/>} 
                label={"Create New"} 
                buttonStyles="sm:px-4 px-2 h-[30px] sm:h-[52px]" 
                onClick={() => ('')} 
                />
            </div>
            
            <Table 
            data={data}
            columns={columns}
            onRowClick={(item) => console.log('clicked:', item)}
            itemsPerPage={10}
            />
        </div>
    </AppLayout>
  )
}
