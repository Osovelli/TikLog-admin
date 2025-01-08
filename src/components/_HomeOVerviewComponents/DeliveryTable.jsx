/*import { Eye } from "lucide-react";
import { Table } from "../Table";

export const DeliveryTable = () => {
    const deliveries = [
      { id: '#123354', from: 'Ikeja, Lagos', to: 'Lekki, Lagos', vehicle: 'Car', status: 'On Going', fee: 'N 1,600' },
      { id: '#123354', from: 'Ikeja, Lagos', to: 'Lekki, Lagos', vehicle: 'Car', status: 'Canceled', fee: 'N 1,600' },
      { id: '#123354', from: 'Ikeja, Lagos', to: 'Lekki, Lagos', vehicle: 'Car', status: 'Delivered', fee: 'N 1,600' },
    ];
  
    return (
      <div className="bg-white rounded-lg shadow-md h-full md:h-[440px] overflow-auto">
        <div className="p-4 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <h3 className="font-semibold">My Deliveries</h3>
            <button className="text-blue-600 text-sm">All Deliveries +</button>
          </div>
          <p className="text-sm text-gray-500">Keep track of all your deliveries</p>
        </div>
        <table className="w-full overflow-auto">
          <thead className="bg-gray-50 text-gray-600 text-sm">
            <tr>
              <th className="py-3 px-4 text-left">Ride ID</th>
              <th className="py-3 px-4 text-left">From</th>
              <th className="py-3 px-4 text-left">To</th>
              <th className="py-3 px-4 text-left">Vehicle</th>
              <th className="py-3 px-4 text-left">Status</th>
              <th className="py-3 px-4 text-left">Fee</th>
              <th className="py-3 px-4 text-left"></th>
            </tr>
          </thead>
          <tbody>
            {deliveries.map((delivery, index) => (
              <tr key={index} className="border-b border-gray-200 last:border-b-0">
                <td className="py-3 px-3">{delivery.id}</td>
                <td className="py-3 px-4">{delivery.from}</td>
                <td className="py-3 px-4">{delivery.to}</td>
                <td className="py-3 px-4">{delivery.vehicle}</td>
                <td className="py-3 px-4">
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    delivery.status === 'On Going' ? 'bg-yellow-100 text-yellow-800' :
                    delivery.status === 'Canceled' ? 'bg-red-100 text-red-800' :
                    'bg-green-100 text-green-800'
                  }`}>
                    {delivery.status}
                  </span>
                </td>
                <td className="py-3 px-4">{delivery.fee}</td>
                <td className="py-3 px-4">
                  <button className="text-blue-600"><Eye size={16} /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }; */

import React from 'react';
import { Eye } from 'lucide-react';
import { Table } from '../Table';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { ButtonComponent } from '../ButtonComponent';

export const DeliveryTable = () => {
  // Sample delivery data
  const deliveries = [
    {
      id: '#123354',
      from: 'Ikeja, Lagos',
      to: 'Lekki, Lagos',
      vehicle: 'Car',
      status: 'On Going',
      fee: '1,600'
    },
    {
      id: '#123355',
      from: 'Ikeja, Lagos',
      to: 'Lekki, Lagos',
      vehicle: 'Car',
      status: 'Cancelled',
      fee: '1,600'
    },
    {
      id: '#123356',
      from: 'Ikeja, Lagos',
      to: 'Lekki, Lagos',
      vehicle: 'Car',
      status: 'Delivered',
      fee: '1,600'
    }
  ];

  // Define table columns
  const columns = [
    {
      key: 'id',
      label: 'Ride ID'
    },
    {
      key: 'from',
      label: 'From'
    },
    {
      key: 'to',
      label: 'To'
    },
    {
      key: 'vehicle',
      label: 'Vehicle'
    },
    {
      key: 'status',
      label: 'Status'
    },
    {
      key: 'fee',
      label: 'Fee'
    }
  ];

  // Handle row click for viewing delivery details
  const handleViewDelivery = (delivery) => {
    console.log('Viewing delivery:', delivery);
    // Add your view delivery logic here
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>My Deliveries</CardTitle>
            <CardDescription>Keep track of all your deliveries</CardDescription>
          </div>
          <ButtonComponent 
            variant={"primary"} 
            label={"+ All Deliveries"} 
            buttonStyles={'h-8'}
          />
        </div>
      </CardHeader>
      <CardContent>
        <Table 
          data={deliveries}
          columns={columns}
          onRowClick={handleViewDelivery}
          showSearch={false}
          itemsPerPage={5}
        />
      </CardContent>
    </Card>
  );
};