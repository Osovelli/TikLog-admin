import { AppLayout } from '@/components/AppLayout'
import { ButtonComponent } from '@/components/ButtonComponent'
import { CardComponent } from '@/components/CardComponent'
import { FundWalletForm } from '@/components/_WalletComponents/FundWalletForm'
import SideSheet from '@/components/SheetComponent'
import { Table } from '@/components/Table'
import { AmountForm, TransferForm } from '@/components/_WalletComponents/TransferFlowModal'
import { useModal } from '@/lib/ModalContext'
import { PaymentMethodItem } from '@/lib/PaymentMethodHelper'
import {ArrowUpRightIcon, Wallet2Icon, WalletIcon } from 'lucide-react'
import { useCallback, useState } from 'react'

const paymentMethods = [
  {
    type: 'visa',
    number: '9235',
    expiryDate: '09/28'
  },
  {
    type: 'mastercard',
    number: '9235',
    expiryDate: '09/28'
  }
];

const content = (
  <div className="space-y-1">
    <p className='text-sm'>Connected Payment methods</p>
    {paymentMethods.map((method, index) => (
      <PaymentMethodItem
        key={index}
        type={method.type}
        number={method.number}
        expiryDate={method.expiryDate}
      />
    ))}
  </div>
);

const columns = [
  {key: 'id', label: 'Ride ID'},
  { key: 'type', label: 'Type' },
  { key: 'amount', label: 'Amount' },
  { key: 'date', label: 'Date' },
];

const data = [
  {
    "type": "Wallet deposit",
    "amount": "1,000.00",
    "date": "Sep 18",
    "id": "1234567890"
  },
  {
    "type": "Transfer to",
    "amount": "1,000.00",
    "date": "Sep 18",
    "id": "1234567890"
  },
  {
    "type": "Withdrawal to wallet",
    "amount": "1,000.00",
    "date": "Sep 18",
    "id": "1234567890"
  },
  {
    "type": "Tiklog Delivery",
    "amount": "1,000.00",
    "date": "Sep 18",
    "id": "1234567890"
  },
  {
    "type": "Transfer to",
    "amount": "1,000.00",
    "date": "Sep 18",
    "id": "1234567890"
  }
]

export const Wallet = () => {
  const [openSideMenu, setOpenSideMenu] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState(null);

  const {openModal, closeModal} = useModal()
  
   // Handler for row clicks
   const handleRowClick = (transaction) => {
    setSelectedTransaction(transaction);
    setOpenSideMenu(true);
  };

  // Handler for closing the side sheet
  const handleCloseSideSheet = () => {
    setOpenSideMenu(false);
    setSelectedTransaction(null);
  };

// Transaction details component for the side sheet
const TransactionDetails = ({ transaction }) => {
  if (!transaction) return null;

  // Helper function to format the amount
  const formatAmount = (amount) => {
    const numericAmount = parseFloat(amount.replace(/,/g, ''));
    return new Intl.NumberFormat('en-NG', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(numericAmount);
  };

  return (
    <div className="space-y-8">
      {/* Amount and Transaction Type Section */}
      <div className="text-center space-y-2 pb-8 border-b">
        <div className="text-4xl font-semibold">
          <span className="text-gray-500">₦</span>
          <span>{formatAmount(transaction.amount)}</span>
        </div>
        <div className="text-gray-600">
          {transaction.type}{' '}
          <span className="text-blue-500">#{transaction.id}</span>
        </div>
      </div>

      {/* Transaction Details Grid */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <span className="text-gray-500">Status</span>
          <span className="text-green-500 font-medium">Successful</span>
        </div>

        <div className="flex justify-between items-center">
          <span className="text-gray-500">Transaction ID</span>
          <span className="font-medium">#{transaction.id}</span>
        </div>

        <div className="flex justify-between items-center">
          <span className="text-gray-500">Transaction type</span>
          <span className="font-medium">{transaction.type}</span>
        </div>

        <div className="flex justify-between items-center">
          <span className="text-gray-500">Date</span>
          <span className="font-medium">{transaction.date}</span>
        </div>

        <div className="flex justify-between items-center">
          <span className="text-gray-500">Duration</span>
          <span className="font-medium">20 mins</span>
        </div>

        <div className="flex justify-between items-center">
          <span className="text-gray-500">Fee</span>
          <span className="text-blue-500 font-medium">₦ 3,400</span>
        </div>
      </div>
    </div>
  );
};


const handleTransferModal = useCallback(() => {
  // Mock user data (replace with API call later)
  const mockUserLookup = (phone) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          name: "John Doe Samuel",
          phoneNumber: phone
        });
      }, 500);
    });
  };

  const handleContinue = async (phoneNumber) => {
    const userData = await mockUserLookup(phoneNumber);
    closeModal();
    
    const handleConfirm = (amount) => {
      console.log('Transfer confirmed', { amount, userData });
      openModal({
        title: 'Transfer completed Successfully',
        icon: <img src='Illustration.png'/>,
        content: (
          <div>
            <p className='text-sm'>Your transfer to <span className='text-blue-300'>John Doe Samuel</span>(0810000000) was completed successfully.</p>
          </div>
        ),
        buttons: [
          {
            label: 'Continue',
            primary: true,
            onClick: closeModal(),
          },
        ]
      });
    };

    openModal({
      title: "Transfer to others",
      content: <AmountForm userData={userData} onConfirm={handleConfirm} />,
    });
  };

  setOpenSideMenu(false);
  openModal({
    title: "Transfer to others",
    content: <TransferForm onContinue={handleContinue} />,
  });
}, [openModal, closeModal]);


const handleFundWalletModal = useCallback(() => {
  const handleContinue = (amount) => {
    // Here you would integrate with Paystack
    console.log('Processing payment for:', amount);
    
    // After successful payment, show success modal
    openModal({
      title: 'Payment Successful',
      icon: <img src='Illustration.png' alt="Success" />,
      content: (
        <div>
          <p className='text-sm'>Your wallet has been funded with <span className='text-blue-300'>₦{amount}</span> successfully.</p>
        </div>
      ),
      buttons: [
        {
          label: 'Continue',
          primary: true,
          onClick: closeModal,
        },
      ]
    });
  };

  openModal({
    title: "Fund wallet",
    content: (
      <div>
        <p className="text-sm text-gray-500 mb-4">
          Kindly input the amount you'd like to fund your wallet with,
          you'll be redirected to paystack to complete your transaction.
        </p>
        <FundWalletForm onContinue={handleContinue} />
      </div>
    ),
  });
}, [openModal, closeModal]);

  return (
    <AppLayout title={"Wallet"} icon={<WalletIcon />}>
      <div className='p-6 space-y-2'>
        <div className='flex flex-col md:flex-row gap-3'>
          <CardComponent
          title="Wallet balance"
          subtitle="₦20,000,000.00"
          variant='blue'
          content={
            <div className='flex space-x-2 p-1 w-full mt-16'>
              <ButtonComponent onClick={handleFundWalletModal} buttonStyles="sm:w-72" label={'Add fund'} icon={<Wallet2Icon size={18} />} variant='primary' />
              <ButtonComponent onClick={handleTransferModal} buttonStyles="sm:w-72" label={'Transfer to others'} icon={<ArrowUpRightIcon size={18} />} variant='primary'/>
            </div>
          }
          className="flex-1"
          />
          <CardComponent
          title="Payment Methods"
          content={content}
          className='flex-1' />
        </div>
        <div className='p-4 border space-y-2 shadow-sm'>
          <p className='text-base font-medium'>Transactions</p>
          <Table columns={columns} data={data} onRowClick={handleRowClick} />
        </div>
        {/* Side Sheet for Transaction Details */}
        <SideSheet
          isOpen={openSideMenu}
          onClose={handleCloseSideSheet}
          title="Transaction Details"
        >
          <TransactionDetails transaction={selectedTransaction} />
        </SideSheet>
      </div>
    </AppLayout>
  )
}
