/* import React, { useState, useMemo } from 'react';
import { Eye } from 'lucide-react';
import { Table } from '../Table';
import { TransactionDetails } from './TransactionDetails';

const TabButton = ({ label, active, onClick }) => (
  <button
    onClick={onClick}
    className={`px-4 py-2 text-sm font-medium transition-colors rounded-lg ${
      active 
        ? 'bg-white shadow' 
        : 'text-gray-500 hover:text-gray-700'
    }`}
  >
    {label}
  </button>
);

const TimeFrameButton = ({ label, active, onClick }) => (
  <button
    onClick={onClick}
    className={`px-4 py-1.5 text-sm rounded-lg transition-colors ${
      active 
        ? 'bg-indigo-600 text-white' 
        : 'bg-white text-gray-600 hover:bg-gray-50'
    }`}
  >
    {label}
  </button>
);

export const TransactionTable = () => {
  const [activeTab, setActiveTab] = useState('all');
  const [activeTimeFrame, setActiveTimeFrame] = useState('12M');
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState(null)

  const columns = [
    { key: 'vendorName', label: 'Vendor name' },
    { key: 'email', label: 'Email' },
    { key: 'dateTime', label: 'Date & Time' },
    { key: 'amount', label: 'Amount' },
    { key: 'paymentType', label: 'Payment Type' },
    { key: 'status', label: 'Status' }
  ];

  const transactionsData = [
    {
      id: 1,
      vendorName: '#1234567890',
      email: 'jamesokbepa@gmail.com',
      dateTime: 'Dec 6, 2024 12:45:59',
      amount: '36,839.64',
      paymentType: 'Wallet',
      status: 'Successful'
    },
    // Duplicate with variations for demo
    ...Array(9).fill(null).map((_, index) => ({
      id: index + 2,
      vendorName: '#1234567890',
      email: 'jamesokbepa@gmail.com',
      dateTime: 'Dec 6, 2024 12:45:59',
      amount: '36,839.64',
      paymentType: index % 3 === 0 ? 'Card' : 'Wallet',
      status: index > 4 ? 'Failed' : 'Successful'
    }))
  ];

  const filteredData = useMemo(() => {
    return transactionsData.filter(transaction => {
      if (activeTab === 'successful') return transaction.status === 'Successful';
      if (activeTab === 'failed') return transaction.status === 'Failed';
      return true;
    });
  }, [activeTab, transactionsData]);

  const renderCustomCell = (key, value, row) => {
    if (key === 'amount') {
      return <span className="text-gray-900">₦ {value}</span>;
    }
    if (key === 'status') {
      return (
        <span className={`px-3 py-1 rounded-full text-sm ${
          value === 'Successful' 
            ? 'bg-green-50 text-green-700' 
            : 'bg-red-50 text-red-700'
        }`}>
          {value}
        </span>
      );
    }
    if (key === 'dateTime') {
      const [date, time] = value.split(' ');
      return (
        <div className='flex gap-2'>
          <div className="text-gray-900">{date}</div>
          <div className="text-sm text-gray-500">{time}</div>
        </div>
      );
    }
    return value;
  };


  const handleViewClick = (row) => {
    setSelectedTransaction(row);
    setIsDetailsOpen(true);
    console.log('View transaction:', row);
  };

  const ActionButtons = ({ row }) => (
    <button 
      onClick={() => handleViewClick(row)}
      className="text-indigo-600 hover:text-indigo-800"
    >
      <Eye size={16} />
    </button>
  );

  const tabs = [
    { id: 'all', label: 'All Transactions' },
    { id: 'successful', label: 'Successful Transactions' },
    { id: 'failed', label: 'Failed Transactions' }
  ];

  const timeFrames = [
    { id: 'today', label: 'Today' },
    { id: '7D', label: '7 D' },
    { id: '30D', label: '30 D' },
    { id: '12M', label: '12 M' },
    { id: 'allTime', label: 'All time' }
  ];

  return (
    <div className="space-y-6 bg-white p-6 rounded-lg">
      <div className="flex justify-between">
        <div className="flex gap-2 p-1 bg-gray-100 rounded-lg">
          {tabs.map(tab => (
            <TabButton
              key={tab.id}
              label={tab.label}
              active={activeTab === tab.id}
              onClick={() => setActiveTab(tab.id)}
            />
          ))}
        </div>

        <div className="flex items-center gap-2">
          {timeFrames.map(timeFrame => (
            <TimeFrameButton
              key={timeFrame.id}
              label={timeFrame.label}
              active={activeTimeFrame === timeFrame.id}
              onClick={() => setActiveTimeFrame(timeFrame.id)}
            />
          ))}
        </div>
      </div>

      <Table
        name={"Transaction"}
        columns={columns}
        data={filteredData}
        renderCustomCell={renderCustomCell}
        showSearch={false}
        itemsPerPage={10}
        className="mt-4"
        onRowClick={handleViewClick}
        renderActions={(row) => <ActionButtons row={row} />}
      />
      <TransactionDetails 
        isOpen={isDetailsOpen}
        onClose={() => {
            setIsDetailsOpen(false);
            setSelectedTransaction(null);
        }}
        transaction={selectedTransaction}
        />
    </div>
  );
}; */


import { useState, useMemo, useEffect } from "react"
import { Eye } from "lucide-react"
import { Table } from "../Table"
import { TransactionDetails } from "./TransactionDetails"
import useWalletStore from "@/store/WalletStore"

const TabButton = ({ label, active, onClick }) => (
  <button
    onClick={onClick}
    className={`px-4 py-2 text-sm font-medium transition-colors rounded-lg ${
      active ? "bg-white shadow" : "text-gray-500 hover:text-gray-700"
    }`}
  >
    {label}
  </button>
)

const TimeFrameButton = ({ label, active, onClick }) => (
  <button
    onClick={onClick}
    className={`px-4 py-1.5 text-sm rounded-lg transition-colors ${
      active ? "bg-indigo-600 text-white" : "bg-white text-gray-600 hover:bg-gray-50"
    }`}
  >
    {label}
  </button>
)

export const TransactionTable = () => {
  const [activeTab, setActiveTab] = useState("all")
  const [activeTimeFrame, setActiveTimeFrame] = useState("12M")
  const [isDetailsOpen, setIsDetailsOpen] = useState(false)
  const [selectedTransaction, setSelectedTransaction] = useState(null)

  const { wallets, loading, fetchWallets } = useWalletStore()

  useEffect(() => {
    fetchWallets()
  }, [fetchWallets])

  const columns = [
    { key: "reference", label: "Transaction ID" },
    { key: "userEmail", label: "User Email" },
    { key: "dateTime", label: "Date & Time" },
    { key: "amount", label: "Amount" },
    { key: "transactionType", label: "Transaction Type" },
    { key: "status", label: "Status" },
  ]

  // Helper function to get transaction type label
  const getTransactionTypeLabel = (transactionType, status, userType) => {
    switch (transactionType) {
      case "transfer":
        return status === "Credit" ? "Transfer Received" : "Transfer Sent"
      case "delivery":
        return "Delivery Payment"
      case "tip":
        return "Tip Payment"
      case "deposit":
        return "Wallet Deposit"
      case "withdrawal":
        return "Withdrawal"
      default:
        // Fallback based on status and user type
        if (status === "Credit") {
          return "Credit"
        } else if (status === "Debit") {
          return "Debit"
        }
        return "Transaction"
    }
  }

  // Helper function to normalize status
  const getTransactionStatus = (status) => {
    switch (status?.toLowerCase()) {
      case "credit":
      case "credited":
      case "successful":
        return "Successful"
      case "debit":
      case "debited":
        return "Successful" // Debit is still a successful transaction
      case "failed":
        return "Failed"
      case "pending":
        return "Pending"
      default:
        return "Unknown"
    }
  }

  // Transform the new API data structure to transaction format
  const transactionsData = useMemo(() => {
    if (!wallets|| !Array.isArray(wallets)) {
      return []
    }

    // The data is now a flat array of transactions
    return wallets
      .map((transaction) => ({
        id: transaction._id,
        reference: transaction.reference || transaction._id,
        userEmail: transaction.user_details?.email || "N/A",
        userPhone: transaction.user_details?.phone_number || "N/A",
        dateTime: new Date(transaction.transaction_date || transaction.createdAt).toLocaleString("en-US", {
          year: "numeric",
          month: "short",
          day: "numeric",
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        }),
        amount: transaction.amount || 0,
        transactionType: getTransactionTypeLabel(transaction.transaction_type, transaction.status, transaction.type),
        status: getTransactionStatus(transaction.status),
        userType: transaction.type, // 'user' or 'rider'
        originalTransaction: transaction,
      }))
      .sort(
        (a, b) =>
          new Date(b.originalTransaction.transaction_date || b.originalTransaction.createdAt) -
          new Date(a.originalTransaction.transaction_date || a.originalTransaction.createdAt),
      )
  }, [wallets])


  // Filter data based on active tab and time frame
  const filteredData = useMemo(() => {
    let filtered = transactionsData

    // Filter by status
    if (activeTab === "successful") {
      filtered = filtered.filter((transaction) => transaction.status === "Successful")
    } else if (activeTab === "failed") {
      filtered = filtered.filter((transaction) => transaction.status === "Failed")
    }

    // Filter by time frame
    const now = new Date()
    if (activeTimeFrame !== "allTime") {
      filtered = filtered.filter((transaction) => {
        const transactionDate = new Date(
          transaction.originalTransaction.transaction_date || transaction.originalTransaction.createdAt,
        )

        switch (activeTimeFrame) {
          case "today":
            return transactionDate.toDateString() === now.toDateString()
          case "7D":
            return now - transactionDate <= 7 * 24 * 60 * 60 * 1000
          case "30D":
            return now - transactionDate <= 30 * 24 * 60 * 60 * 1000
          case "12M":
            return now - transactionDate <= 365 * 24 * 60 * 60 * 1000
          default:
            return true
        }
      })
    }

    return filtered
  }, [transactionsData, activeTab, activeTimeFrame])

  const renderCustomCell = (key, value, row) => {
    if (key === "amount") {
      const isCredit = row.originalTransaction.status === "Credit"
      return (
        <div className="text-right">
          <span className={`font-medium ${isCredit ? "text-green-600" : "text-red-600"}`}>
            {isCredit ? "+" : "-"}₦{Number(value).toLocaleString()}
          </span>
        </div>
      )
    }
    if (key === "status") {
      return (
        <span
          className={`px-3 py-1 rounded-full text-sm ${
            value === "Successful"
              ? "bg-green-50 text-green-700"
              : value === "Failed"
                ? "bg-red-50 text-red-700"
                : "bg-yellow-50 text-yellow-700"
          }`}
        >
          {value}
        </span>
      )
    }
    if (key === "dateTime") {
      const [date, time] = value.split(", ")
      return (
        <div className="flex flex-col">
          <div className="text-gray-900">{date}</div>
          <div className="text-sm text-gray-500">{time}</div>
        </div>
      )
    }
    if (key === "reference") {
      return (
        <div>
          <div className="font-mono text-sm">{value.length > 20 ? `${value.substring(0, 20)}...` : value}</div>
          <div className="text-xs text-gray-500 capitalize">{row.userType}</div>
        </div>
      )
    }
    if (key === "userEmail") {
      return (
        <div>
          <div className="text-gray-900">{value}</div>
          <div className="text-sm text-gray-500">{row.userPhone}</div>
        </div>
      )
    }
    if (key === "transactionType") {
      return (
        <div>
          <div className="font-medium">{value}</div>
          <div className="text-xs text-gray-500 capitalize">{row.originalTransaction.transaction_type || "N/A"}</div>
        </div>
      )
    }
    return value
  }

  const handleViewClick = (row) => {
    setSelectedTransaction(row)
    setIsDetailsOpen(true)
    console.log("View transaction:", row)
  }

  const ActionButtons = ({ row }) => (
    <button onClick={() => handleViewClick(row)} className="text-indigo-600 hover:text-indigo-800">
      <Eye size={16} />
    </button>
  )

  const tabs = [
    { id: "all", label: "All Transactions" },
    { id: "successful", label: "Successful Transactions" },
    { id: "failed", label: "Failed Transactions" },
  ]

  const timeFrames = [
    { id: "today", label: "Today" },
    { id: "7D", label: "7 D" },
    { id: "30D", label: "30 D" },
    { id: "12M", label: "12 M" },
    { id: "allTime", label: "All time" },
  ]

  if (loading) {
    return (
      <div className="space-y-6 bg-white p-6 rounded-lg">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-4 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  // Empty state
  if (transactionsData.length === 0) {
    return (
      <div className="space-y-6 bg-white p-6 rounded-lg">
        <div className="flex justify-between">
          <div className="flex gap-2 p-1 bg-gray-100 rounded-lg">
            {tabs.map((tab) => (
              <TabButton
                key={tab.id}
                label={tab.label}
                active={activeTab === tab.id}
                onClick={() => setActiveTab(tab.id)}
              />
            ))}
          </div>
        </div>
        <div className="text-center py-12">
          <div className="text-gray-400 mb-4">
            <Eye size={48} className="mx-auto" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No transactions found</h3>
          <p className="text-gray-500">There are no transactions to display.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6 bg-white p-6 rounded-lg">
      <div className="flex justify-between">
        <div className="flex gap-2 p-1 bg-gray-100 rounded-lg">
          {tabs.map((tab) => (
            <TabButton
              key={tab.id}
              label={tab.label}
              active={activeTab === tab.id}
              onClick={() => setActiveTab(tab.id)}
            />
          ))}
        </div>

        <div className="flex items-center gap-2">
          {timeFrames.map((timeFrame) => (
            <TimeFrameButton
              key={timeFrame.id}
              label={timeFrame.label}
              active={activeTimeFrame === timeFrame.id}
              onClick={() => setActiveTimeFrame(timeFrame.id)}
            />
          ))}
        </div>
      </div>

      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold">Transactions ({filteredData.length})</h2>
      </div>

      <Table
        name={"Transaction"}
        columns={columns}
        data={filteredData}
        renderCustomCell={renderCustomCell}
        showSearch={true}
        itemsPerPage={10}
        className="mt-4"
        onRowClick={handleViewClick}
        renderActions={(row) => <ActionButtons row={row} />}
      />

      <TransactionDetails
        isOpen={isDetailsOpen}
        onClose={() => {
          setIsDetailsOpen(false)
          setSelectedTransaction(null)
        }}
        transaction={selectedTransaction}
      />
    </div>
  )
}

