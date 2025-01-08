import React from 'react';
import { Eye, Search, XCircle, ArrowUpRight, ArrowDownRight, Plus, Wallet, } from 'lucide-react';
import { Table } from '../Table';

const WalletHeader = () => (
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
);

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

const TransactionIcon = ({ type }) => {
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
};

export const CustomerWalletInfo = () => {
  const columns = [
    { key: 'type', label: 'Type' },
    { key: 'amount', label: 'Amount' },
    { key: 'date', label: 'Date' }
  ];

  const transactions = [
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
  ];

  const renderCustomCell = (key, value, row) => {
    if (key === 'type') {
      return (
        <div className="flex items-center gap-3">
          <TransactionIcon type={value} />
          <div>
            <div className="font-medium">{value}</div>
            <div className="text-sm text-gray-500">{row.reference}</div>
          </div>
        </div>
      );
    }
    if (key === 'amount') {
      return <span className="text-green-600">N{value}</span>;
    }
    return value;
  };

  return (
    <div className="space-y-6">
      <div className="grid md:grid-cols-2 gap-6">
        <WalletHeader />
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
          columns={columns}
          data={transactions}
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