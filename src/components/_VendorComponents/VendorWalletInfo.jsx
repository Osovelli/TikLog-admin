import React, { useMemo } from 'react';
import { Eye, Search, XCircle, ArrowUpRight, ArrowDownRight, Plus, Wallet, Truck, Gift, } from 'lucide-react';
import { Table } from '../Table';

/* const WalletHeader = () => (
  <div className="bg-[#1F1F76] text-white p-6 rounded-lg">
    <div className="mb-6">
      <p className="text-gray-300 mb-2">Wallet balance</p>
      <h1 className="text-4xl font-bold">₦20,000,000.00</h1>
    </div>
    <div className="grid grid-cols-2 gap-4">
      <button className="flex items-center justify-center gap-2 py-3 px-4 rounded-lg border text-white border-white/20 bg-white/10 hover:bg-white/5 transition-colors">
        <Wallet size={20} />
        <span>Add Fund</span>
      </button>
      <button className="flex items-center justify-center gap-2 py-3 px-4 rounded-lg border border-red-500 text-red-500 bg-red-500/10 hover:bg-red-500/5 transition-colors">
        <XCircle size={20} />
        <span>Freeze Wallet</span>
      </button>
    </div>
  </div>
); */

const WalletHeader = ({ walletData, onAddFund, onFreezeWallet }) => {
  // Calculate wallet balance from transactions
  const walletBalance = useMemo(() => {
    if (!walletData?.transactions) return 0

    return walletData.transactions.reduce((balance, transaction) => {
      const amount = transaction.amount || 0
      if (transaction.status === "Credited" || transaction.status === "Successful") {
        // For successful deposits and credits, add to balance
        if (!transaction.transaction_type || transaction.transaction_type === "deposit") {
          return balance + amount
        }
        if (transaction.transaction_type === "transfer" && transaction.status === "Credited") {
          return balance + amount
        }
      }
      if (transaction.status === "Debited") {
        // For debited amounts, subtract from balance
        return balance - amount
      }
      return balance
    }, 0)
  }, [walletData])

  return (
    <div className="bg-[#1F1F76] text-white p-6 mx-2 rounded-lg">
      <div className="mb-6">
        <p className="text-gray-300 mb-2">Wallet balance</p>
        <h1 className="text-4xl font-bold">₦{walletBalance.toLocaleString()}.00</h1>
        {walletData?.is_frozen && (
          <div className="mt-2 inline-flex items-center gap-1 bg-red-500/20 text-red-200 px-2 py-1 rounded-full text-sm">
            <XCircle size={14} />
            <span>Wallet Frozen</span>
          </div>
        )}
      </div>
      <div className="grid grid-cols-2 gap-4">
        <button
          onClick={onAddFund}
          className="flex items-center justify-center gap-2 py-3 px-4 rounded-lg border text-white border-white/20 bg-white/10 hover:bg-white/5 transition-colors"
        >
          <Wallet size={20} />
          <span>Add Fund</span>
        </button>
        <button
          onClick={onFreezeWallet}
          className={`flex items-center justify-center gap-2 py-3 px-4 rounded-lg border transition-colors ${
            walletData?.is_frozen
              ? "border-green-500 text-green-500 bg-green-500/10 hover:bg-green-500/5"
              : "border-red-500 text-red-500 bg-red-500/10 hover:bg-red-500/5"
          }`}
        >
          <XCircle size={20} />
          <span>{walletData?.is_frozen ? "Unfreeze Wallet" : "Freeze Wallet"}</span>
        </button>
      </div>
    </div>
  )
}

const PaymentMethods = () => (
  <div className="bg-white p-6 rounded-lg">
    <h2 className="text-lg font-semibold mb-1">Payment Methods</h2>
    <p className="text-sm text-gray-500 mb-4">Connected payment methods</p>
    <div className="space-y-4">
      <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
        <div className="w-12 h-8 bg-[#1434CB]/10 rounded flex items-center justify-center">
          <span className="text-[#1434CB] font-bold">V</span>
        </div>
        <div>
          <p className="font-medium">XXXX 9235</p>
          <p className="text-sm text-gray-500">Expires on 09/28</p>
        </div>
      </div>
      <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
        <div className="w-12 h-8 flex items-center justify-center">
          <div className="flex -space-x-3">
            <div className="w-4 h-4 bg-[#EB001B] rounded-full" />
            <div className="w-4 h-4 bg-[#F79E1B] rounded-full opacity-80" />
          </div>
        </div>
        <div>
          <p className="font-medium">XXXX 9235</p>
          <p className="text-sm text-gray-500">Expires on 09/28</p>
        </div>
      </div>
    </div>
  </div>
);

/* const TransactionIcon = ({ type }) => {
  switch (type) {
    case 'Wallet deposit':
      return (
        <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
          <Wallet className="w-5 h-5 text-gray-600" />
        </div>
      );
    case 'Transfer to':
      return (
        <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
          <ArrowUpRight className="w-5 h-5 text-gray-600" />
        </div>
      );
    case 'Withdrawal to wallet':
      return (
        <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
          <ArrowDownRight className="w-5 h-5 text-gray-600" />
        </div>
      );
    default:
      return (
        <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
          <Plus className="w-5 h-5 text-gray-600" />
        </div>
      );
  }
}; */

const TransactionIcon = ({ type, status }) => {
  const getIconAndColor = () => {
    switch (type) {
      case "delivery":
        return {
          icon: Truck,
          bgColor: "bg-blue-100",
          iconColor: "text-blue-600",
        }
      case "transfer":
        return status === "Credited"
          ? {
              icon: ArrowDownRight,
              bgColor: "bg-green-100",
              iconColor: "text-green-600",
            }
          : {
              icon: ArrowUpRight,
              bgColor: "bg-red-100",
              iconColor: "text-red-600",
            }
      case "tip":
        return {
          icon: Gift,
          bgColor: "bg-purple-100",
          iconColor: "text-purple-600",
        }
      default:
        // Deposit or other
        return {
          icon: Wallet,
          bgColor: "bg-gray-100",
          iconColor: "text-gray-600",
        }
    }
  }

  const { icon: Icon, bgColor, iconColor } = getIconAndColor()

  return (
    <div className={`w-10 h-10 ${bgColor} rounded-full flex items-center justify-center`}>
      <Icon className={`w-5 h-5 ${iconColor}`} />
    </div>
  )
}

export const VendorWalletInfo = ({wallet}) => {
  const columns = [
    { key: 'type', label: 'Type' },
    { key: 'amount', label: 'Amount' },
    { key: 'date', label: 'Date' }
  ];

  // Helper function to get transaction type label
  const getTransactionTypeLabel = (type, status) => {
    switch (type) {
      case "delivery":
        return "Delivery Payment"
      case "transfer":
        return status === "Credited" ? "Transfer Received" : "Transfer Sent"
      case "tip":
        return "Tip Payment"
      default:
        return status === "Successful" ? "Wallet Deposit" : "Transaction"
    }
  }

  // Transform API data to table format
      const transactionsData = useMemo(() => {
        /* if (!wallet || !wallet.data || !Array.isArray(wallet.data) || !wallet[0]?.transactions) {
          return []
        } */
    
        const transactions = wallet
    
        return transactions?.map((transaction, index) => {
          const transactionType = transaction.transaction_type || "deposit"
          const isCredit =
            transaction.status === "Credited" || (transaction.status === "Successful" && !transaction.transaction_type)
    
          return {
            id: transaction._id || index,
            type: getTransactionTypeLabel(transactionType, transaction.status),
            reference: transaction.reference || `#${transaction._id}`,
            amount: transaction.amount?.toString() || "0",
            date: new Date(transaction.transaction_date).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year: "2-digit"
            }),
            /* fullDate: new Date(transaction.transaction_date).toLocaleDateString("en-US", {
              month: "long",
              day: "numeric",
              year: "numeric"
            }), */
            status: transaction.status,
            transactionType: transaction.transaction_type,
            isCredit,
            originalTransaction: transaction,
          }
        })
      }, [wallet])

  /* const transactions = [
    {
      id: 1,
      type: 'Wallet deposit',
      reference: '#1234567890',
      amount: '1,000.00',
      date: 'Sep 18'
    },
    {
      id: 2,
      type: 'Transfer to',
      reference: '#1234567890',
      amount: '1,000.00',
      date: 'Sep 18'
    },
    {
      id: 3,
      type: 'Withdrawal to wallet',
      reference: '#1234567890',
      amount: '1,000.00',
      date: 'Sep 18'
    },
    {
      id: 4,
      type: 'Tiklog Delivery',
      reference: '#1234567890',
      amount: '1,000.00',
      date: 'Sep 18'
    },
    {
      id: 5,
      type: 'Transfer to',
      reference: '#1234567890',
      amount: '1,000.00',
      date: 'Sep 18'
    }
  ]; */

  const renderCustomCell = (key, value, row) => {
    if (key === "type") {
      return (
        <div className="flex items-center gap-3">
          <TransactionIcon type={row.transactionType} status={row.status} />
          <div>
            <div className="font-medium">{value}</div>
            <div className="text-sm text-gray-500">{row.reference}</div>
          </div>
        </div>
      )
    }
    if (key === "amount") {
      const isCredit = row.isCredit
      return (
        <div className="text-right">
          <span className={`font-medium ${isCredit ? "text-green-600" : "text-red-600"}`}>
            {isCredit ? "+" : "-"}₦{Number(value).toLocaleString()}
          </span>
          <div className="text-xs text-gray-500 capitalize">{row.status}</div>
        </div>
      )
    }
    if (key === "date") {
      return (
        <div>
          <div className="font-medium">{value}</div>
          <div className="text-sm text-gray-500" title={row.fullDate}>
            {new Date(row.originalTransaction.date).toLocaleTimeString("en-US", {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </div>
        </div>
      )
    }
    return value
  }

  const handleViewTransaction = (row) => {
      console.log("View transaction details:", row.originalTransaction)
      // You can implement modal or navigation to detailed view here
    }
  
    const handleAddFund = () => {
      console.log("Add fund clicked")
      // Implement add fund functionality
    }
  
    const handleFreezeWallet = () => {
      console.log("Freeze/Unfreeze wallet clicked")
      // Implement freeze/unfreeze functionality
    }

    // Loading state
    if (!wallet) {
      return (
        <div className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div className="animate-pulse bg-gray-200 h-48 rounded-lg"></div>
            <div className="animate-pulse bg-gray-200 h-48 rounded-lg"></div>
          </div>
          <div className="animate-pulse bg-gray-200 h-64 rounded-lg"></div>
        </div>
      )
    }
  
    // Empty state
    if (transactionsData?.length === 0) {
      return (
        <div className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <WalletHeader walletData={wallet.data?.[0]} onAddFund={handleAddFund} onFreezeWallet={handleFreezeWallet} />
            <PaymentMethods />
          </div>
          <div className="bg-white p-6 rounded-lg">
            <h2 className="text-lg font-semibold mb-6">Transactions</h2>
            <div className="text-center py-12">
              <div className="text-gray-400 mb-4">
                <Wallet size={48} className="mx-auto" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No transactions found</h3>
              <p className="text-gray-500">This wallet doesn't have any transactions yet.</p>
            </div>
          </div>
        </div>
      )
    }

  return (
    <div className="space-y-6">
      <div className="grid md:grid-cols-2 gap-6">
        <WalletHeader walletData={wallet.data?.[0]} onAddFund={handleAddFund} onFreezeWallet={handleFreezeWallet} />
        <PaymentMethods />
      </div>

      <div className="bg-white p-6 rounded-lg">
        <h2 className="text-lg font-semibold mb-6">Transactions</h2>
        
        <div className="relative mb-6">
          <input
            type="text"
            placeholder="Search transactions"
            className="w-full pl-10 pr-4 py-2 border rounded-lg"
          />
          <Search className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" />
        </div>

        <Table
          name={"Transactions"}
          columns={columns}
          data={transactionsData}
          renderCustomCell={renderCustomCell}
          showSearch={false}
          itemsPerPage={10}
          onRowClick={(row) => console.log('View transaction:', row)}
          renderActions={(row) => (
            <button className="text-indigo-600 hover:text-indigo-800 flex items-center gap-1">
              <Eye size={16} />
              <span>View</span>
            </button>
          )}
        />
      </div>
    </div>
  );
};