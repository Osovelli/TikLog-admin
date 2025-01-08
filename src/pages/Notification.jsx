import { AppLayout } from '@/components/AppLayout'
import { NotificationComponent } from '@/components/_NotificationComponents/NotificationItem'
import { BellIcon } from 'lucide-react'
import React from 'react'

export const Notification = () => {
  return (
    <AppLayout title={"Notification"} icon={<BellIcon />}>
      <NotificationComponent />
    </AppLayout>
  )
}
