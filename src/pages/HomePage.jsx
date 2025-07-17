import { AppLayout } from '@/components/AppLayout'
import { ButtonComponent } from '@/components/ButtonComponent'
import { DeliveryOverview } from '@/components/DeliveryOverview'
import { DeliveryTable } from '@/components/_HomeOVerviewComponents/DeliveryTable'
import { OngoingDelivery } from '@/components/_HomeOVerviewComponents/OngoingDelivery'
import NewDeliverySideMenu from '@/components/_HomeOVerviewComponents/DeliverySideMenu'
import { WalletCard } from '@/components/_HomeOVerviewComponents/WalletCard'
import { HomeIcon, Plus, SearchCheck } from 'lucide-react'
import React, { useCallback, useEffect, useState } from 'react'
import { useModal } from '@/lib/ModalContext'
import { DeliveryDetails } from '@/components/_HomeOVerviewComponents/DeliveryDetails'
import { WalletCard as WalletIcon } from '@/icon/Icons'
import { HighlightSection } from '@/components/_DashboardComponents/HighlightSection'
import { UsersOverview } from '@/components/_DashboardComponents/UsersOverview'
import { CustomersTable } from '@/components/_DashboardComponents/CustomersTable'
import useDashboardStore from '@/store/DashboardStore'
import { UserAnalyticsCharts } from '@/components/_DashboardComponents/UserAnalyticsCharts'

export const HomePage = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const {
    getUserDashboardData,
    getDashboardUserDetails,
    getDashboardMonthlyData,
    getDashboardUserAnalytics,
    getDashboardUserGrowth
  } = useDashboardStore()

  // Fetch dashboard data on component mount
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        await getUserDashboardData()
        await getDashboardUserDetails()
        await getDashboardMonthlyData()
        await getDashboardUserAnalytics()
        await getDashboardUserGrowth()
      } catch (error) {
        console.error("Error fetching dashboard data:", error)
      }
    }
    fetchDashboardData()
  }, [])

  const {openModal, closeModal} = useModal()

  const handleDeliveryModal = useCallback(() => {
    setIsMenuOpen(false);
    openModal({
      title: "",
      content: <DeliveryDetails />,
      icon: <WalletIcon />,
      buttons: [
        { label: 'Cancel', onClick: closeModal },
        { 
          label: 'Continue', 
          onClick: () => {
            closeModal();
            setTimeout(() => {
              openModal({
                title: "Search for Riders",
                content: 'Hang in there while we connect you to the perfect rider',
                icon: <SearchCheck />,
                buttons: [
                  { label: 'Cancel', onClick: closeModal },
                ]
              });
            }, 600); // 300ms delay, adjust as needed
          }, 
          primary: true 
        }
      ]
    });
  }, [openModal, closeModal]);

  return (
    <AppLayout 
    title={'Hello Admin'}
    showBackButton={false}
    >
      <div className="p-8 mt-8 space-y-2">
        <HighlightSection />
        <UsersOverview />
        <UserAnalyticsCharts />
        {/* <CustomersTable /> */}
          
          <NewDeliverySideMenu
            isOpen={isMenuOpen}
            onClose={() => setIsMenuOpen(false)}
            openModal={handleDeliveryModal}

          />
      </div>
    </AppLayout>
  )
}
