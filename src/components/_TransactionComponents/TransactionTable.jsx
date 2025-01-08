import React, { useState, useMemo } from 'react';
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
};