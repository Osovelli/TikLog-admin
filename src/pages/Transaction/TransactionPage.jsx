import { TransactionOverview } from '@/components/_TransactionComponents/TransactionOverview'
import { TransactionTable } from '@/components/_TransactionComponents/TransactionTable'
import { AppLayout } from '@/components/AppLayout'
import React from 'react'
import { useEffect } from "react"
import useWalletStore from '@/store/TransactionStore'
import useTransactionStore from '@/store/TransactionStore'

/* export const TransactionPage = () => {
  return (
    <AppLayout title={"Transaction Management"}>
        <TransactionOverview />
        <TransactionTable />
    </AppLayout>
  )
} */



export const TransactionPage = () => {
  //const { fetchTransactionStats, fetchTransactionOverview, loading } = useTransactionStore()

  /* useEffect(() => {
    // Fetch initial data when component mounts
    const initializeData = async () => {
      await fetchTransactionStats()
      await fetchTransactionOverview({ period: "12" })
    }

    initializeData()
  }, [fetchTransactionStats, fetchTransactionOverview, ]) */

  return (
    <AppLayout title={"Transaction Management"}>
      <TransactionOverview />
      <TransactionTable />
    </AppLayout>
  )
}

