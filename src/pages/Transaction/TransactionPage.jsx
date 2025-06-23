import { TransactionOverview } from '@/components/_TransactionComponents/TransactionOverview'
import { TransactionTable } from '@/components/_TransactionComponents/TransactionTable'
import { AppLayout } from '@/components/AppLayout'
import React from 'react'
import { useEffect } from "react"
import useWalletStore from '@/store/WalletStore'

/* export const TransactionPage = () => {
  return (
    <AppLayout title={"Transaction Management"}>
        <TransactionOverview />
        <TransactionTable />
    </AppLayout>
  )
} */



export const TransactionPage = () => {
  const { fetchWalletStats, fetchTransactionOverview, loading } = useWalletStore()

  useEffect(() => {
    // Fetch initial data when component mounts
    const initializeData = async () => {
      await fetchWalletStats()
      await fetchTransactionOverview({ period: "12" })
    }

    initializeData()
  }, [fetchWalletStats, fetchTransactionOverview, ])

  return (
    <AppLayout title={"Transaction Management"}>
      <TransactionOverview />
      <TransactionTable />
    </AppLayout>
  )
}

