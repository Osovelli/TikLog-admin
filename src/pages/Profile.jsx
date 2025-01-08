import UserProfile from '@/components/_ProfileComponents/UserProfile'
import { AppLayout } from '@/components/AppLayout'
import { User } from 'lucide-react'
import React from 'react'

export const Profile = () => {
  return (
    <AppLayout title={"Profile"} icon={<User />}>
      <UserProfile />
    </AppLayout>
  )
}
