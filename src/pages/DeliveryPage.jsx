import { AppLayout } from '@/components/AppLayout'
import DeliveryProcessProgress from '@/components/DeliveryBreadCrumbs'
import DeliveryMap from '@/components/DeliveryMap'
import DeliveryDetails from '@/components/DeliveryOverviewDetails'
import DeliveryOverviewInfo from '@/components/DeliveryOverviewDetails'
import PickupRiderInfo from '@/components/PickupRiderInfo'
import StepIndicator from '@/components/StepIndicator'
import { TruckIcon } from 'lucide-react'
import React, { useState } from 'react'

export const DeliveryPage = () => {
  const [status, setStatus] = useState()

  return (
    <AppLayout title={"Delivery"} icon={<TruckIcon />}>
      <DeliveryMap />
      <PickupRiderInfo riderName={'Jane Doe'}/>
      {/* <DeliveryProcessProgress currentStep={1} /> */}
      <StepIndicator currentStep={1} />
      <DeliveryDetails />
      {/* <DeliveryOverviewInfo
        pickupLocation="100, Ebute metta str, off alagbado ave"
        deliveryLocation="100, Ebute metta str, off alagbado ave"
        vehicleType="Toyota Corolla"
        plateNumber="ABJ 123 YZ"
        startTime="1 Mar 2024 (08:00)"
        endTime="1 Mar 2024 (13:00)"
        status="Completed"
        fee="2,800"
      /> */}
    </AppLayout>
  )
}
