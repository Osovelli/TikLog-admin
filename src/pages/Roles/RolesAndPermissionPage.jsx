import React, { useState } from 'react'
import { Eye, Trash2, Plus } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Swiper, SwiperSlide } from 'swiper/react'
import { FreeMode } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/navigation'
import { Table } from '@/components/Table'
import { AppLayout } from '@/components/AppLayout'
import { AdminModal } from '@/components/_AdminRolesComponents/AddAdminModal'
import { CustomButton } from '@/components/CustomButton'
import { AddAdminRoleModal } from '@/components/_AdminRolesComponents/AddAdminRoleModal'

const TabButton = ({ label, active, onClick }) => (
  <button
    onClick={onClick}
    className={`px-4 py-2 text-sm font-medium rounded-lg whitespace-nowrap ${
      active 
        ? 'bg-white shadow' 
        : 'text-gray-500 hover:text-gray-700'
    }`}
  >
    {label}
  </button>
);

export const RolesPermissionsPage = () => {
  const [activeTab, setActiveTab] = useState('all');
  const [isAdminModalOpen, setIsAdminModalOpen] = useState(false)
  const [isAdminRoleModalOpen, setIsAdminRoleModalOpen] = useState(false)


  const columns = [
    { 
      key: 'name', 
      label: 'Name',
    },
    { 
      key: 'email', 
      label: 'Email',
    },
    { key: 'role', label: 'Role' },
    { 
      key: 'lastLogin', 
      label: 'Last Login',
    },
    { key: 'status', label: 'Status' }
  ];

  const adminsData = [
    {
      id: 1,
      name: 'Goodluck Ebele-Jonathan',
      email: 'ojembakudus@gmail.com',
      role: 'Super Admin',
      lastLoginDate: 'Dec 6, 2024',
      lastLoginTime: '12:45:59',
      status: 'Active',
      avatar: '/Avatar1.png'
    },
    // Duplicate the record 9 more times for demo
    ...Array(9).fill(null).map((_, index) => ({
      id: index + 2,
      name: 'Goodluck Ebele-Jonathan',
      email: 'ojembakudus@gmail.com',
      role: 'Super Admin',
      lastLoginDate: 'Dec 6, 2024',
      lastLoginTime: '12:45:59',
      status: 'Active',
      avatar: '/Avatar1.png'
    }))
  ];

  const renderCustomCell = (key, value, row) => {
    if (key === 'status') {
      return (
        <span className={`px-3 py-1 rounded-full text-sm ${
          value === 'Active' 
            ? 'bg-green-50 text-green-700' 
            : 'bg-gray-100 text-gray-700'
        }`}>
          {value}
        </span>
      );
    }
    else if (key === 'name') {
      return (
        <div className="flex items-center gap-3">
          <img 
            src={row.avatar || "/Avatar1.png"} 
            alt={row.name}
            className="w-10 h-10 rounded-full"
          />
          <span className="font-medium line-clamp-1">{row.name}</span>
        </div>
      );
    }
    else if (key === 'lastLogin') {
      return (
        <div className="min-w-[120px]">
          <div className="text-gray-900">{row.lastLoginDate}</div>
          <div className="text-sm text-gray-500">{row.lastLoginTime}</div>
        </div>
      );
    }
    else if (key === 'email') {
      return (
        <span className="line-clamp-1">{row.email}</span>
      )
    }
    return value;
  };

  const handleView = (row) => {
    console.log('View admin:', row);
  };

  const handleDelete = (row) => {
    console.log('Delete admin:', row);
  };

  const ActionButtons = ({ row }) => (
    <div className="flex items-center gap-2">
      <button 
        onClick={() => handleView(row)}
        className="text-gray-500 hover:text-gray-700"
      >
        <Eye size={16} />
      </button>
      <button 
        onClick={() => handleDelete(row)}
        className="text-red-500 hover:text-red-700"
      >
        <Trash2 size={16} />
      </button>
    </div>
  );

  const tabs = [
    { id: 'all', label: 'All Admins' },
    { id: 'super', label: 'Super Admins' },
    { id: 'managers', label: 'Managers' },
    { id: 'operations', label: 'Operations' },
    { id: 'others', label: 'Others' }
  ];

  return (
    <AppLayout title="Roles & Permissions">
    <div className="p-4 md:p-6 space-y-6">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <div className="w-full lg:w-auto bg-gray-100 rounded-lg p-1">
          <Swiper
            freeMode={true}
            modules={[FreeMode]}
            slidesPerView="auto"
            spaceBetween={8}
            className="mySwiper"
          >
            {tabs.map(tab => (
              <SwiperSlide key={tab.id} className="!w-auto">
                <TabButton
                  label={tab.label}
                  active={activeTab === tab.id}
                  onClick={() => setActiveTab(tab.id)}
                />
              </SwiperSlide>
            ))}
          </Swiper>
        </div>

        <div className="flex gap-2 w-full lg:w-auto">
          <Button 
            variant="outline" 
            className="flex-1 lg:flex-none whitespace-nowrap"
            onClick={() => setIsAdminRoleModalOpen(true)}
          >
            <Plus className="w-4 h-4 mr-2" />
            New Role
          </Button>
          <CustomButton 
            className="flex-1 lg:flex-none bg-[#1F1F76] hover:bg-indigo-700 whitespace-nowrap"
            onClick={() => setIsAdminModalOpen(true)}
          >
            <Plus className="w-4 h-4 mr-2" />
            New Admin
          </CustomButton>
        </div>
      </div>

      <div className="bg-white rounded-lg border overflow-hidden">
        <div className="overflow-x-auto">
          <Table
            name={"Roles & Permissions"}
            columns={columns}
            data={adminsData}
            renderCustomCell={renderCustomCell}
            showSearch={false}
            itemsPerPage={10}
            renderActions={(row) => <ActionButtons row={row} />}
          />
        </div>
      </div>
    </div>
    <AdminModal 
      isOpen={isAdminModalOpen}
      onClose={() => setIsAdminModalOpen(false)}
    />
    <AddAdminRoleModal
      isOpen={isAdminRoleModalOpen}
      onClose={() => setIsAdminRoleModalOpen(false)}
    />
    </AppLayout>
  );
};