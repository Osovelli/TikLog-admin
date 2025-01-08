/* import React from 'react';

const DeliveryOverviewInfo = ({ pickupLocation, deliveryLocation, vehicleType, plateNumber, startTime, endTime, status, fee }) => {
  return (
    <div className="grid grid-cols-5 gap-6 bg-white p-6 rounded-md shadow-md">
      <div>
        <h3 className="text-gray-500 font-medium mb-1">Pickup</h3>
        <p>{pickupLocation}</p>
      </div>
      <div>
        <h3 className="text-gray-500 font-medium mb-1">Delivery</h3>
        <p>{deliveryLocation}</p>
      </div>
      <div>
        <h3 className="text-gray-500 font-medium mb-1">Vehicle</h3>
        <p>{vehicleType} - {plateNumber}</p>
      </div>
      <div>
        <h3 className="text-gray-500 font-medium mb-1">Time</h3>
        <p>{startTime} - {endTime}</p>
      </div>
      <div>
        <h3 className="text-gray-500 font-medium mb-1">Payment</h3>
        <p className={`font-medium ${status === 'Completed' ? 'text-green-500' : 'text-gray-500'}`}>
          {status === 'Completed' ? `NGN ${fee}` : status}
        </p>
      </div>
    </div>
  );
};

export default DeliveryOverviewInfo; */

import { cn } from "@/lib/utils"

export default function DeliveryDetails({
  pickup = {
    location: "100, Ebute metta str, off alagbado ave...",
    phone: "0810 000 0000"
  },
  delivery = {
    location: "100, Ebute metta str, off alagbado ave...",
    phone: "0810 000 0000"
  },
  rider = {
    vehicleType: "Toyota Corolla",
    plateNumber: "ABJ 123 YZ",
    start: "1 Mar 2024 (08:00)",
    end: "1 Mar 2024 (13:00)"
  },
  payment = {
    status: "Completed",
    fee: "NGN 2,800"
  },
  className
}) {
  const Section = ({ title, children }) => (
    <div className="space-y-4">
      <h3 className="text-sm font-medium text-blue-600">{title}</h3>
      {children}
    </div>
  )

  const Field = ({ label, value, valueClassName }) => (
    <div className="space-y-1">
      <dt className="text-sm text-gray-600">{label}</dt>
      <dd className={cn("text-sm font-medium", valueClassName)}>{value}</dd>
    </div>
  )

  return (
    <div className={cn("grid gap-6 md:grid-cols-4 p-4", className)}>
      <Section title="PICKUP INFORMATION">
        <dl className="space-y-4">
          <Field 
            label="Pickup Location" 
            value={pickup.location}
          />
          <Field 
            label="Phone number" 
            value={pickup.phone}
          />
        </dl>
      </Section>

      <Section title="DELIVERY INFORMATION">
        <dl className="space-y-4">
          <Field 
            label="Delivery Location" 
            value={delivery.location}
          />
          <Field 
            label="Phone number" 
            value={delivery.phone}
          />
        </dl>
      </Section>

      <Section title="RIDER INFORMATION">
        <dl className="space-y-4">
          <div className="flex gap-4">
            <Field 
              label="Vehicle Type" 
              value={rider.vehicleType}
            />
            <Field 
              label="Plate Number" 
              value={rider.plateNumber}
            />
          </div>
          <div className="flex gap-4">
            <Field 
              label="Start" 
              value={rider.start}
            />
            <Field 
              label="End" 
              value={rider.end}
            />
          </div>
        </dl>
      </Section>

      <Section title="PAYMENT">
        <dl className="space-y-4">
          <Field 
            label="Status" 
            value={payment.status}
            valueClassName="text-emerald-500"
          />
          <Field 
            label="Fee" 
            value={payment.fee}
            valueClassName="text-emerald-500"
          />
        </dl>
      </Section>
    </div>
  )
}