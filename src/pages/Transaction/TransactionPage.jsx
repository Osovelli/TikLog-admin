import { TransactionOverview } from '@/components/_TransactionComponents/TransactionOverview'
import { TransactionTable } from '@/components/_TransactionComponents/TransactionTable'
import { AppLayout } from '@/components/AppLayout'
import React from 'react'

export const TransactionPage = () => {
  return (
    <AppLayout title={"Transaction Management"}>
        <TransactionOverview />
        <TransactionTable />
    </AppLayout>
  )
}
