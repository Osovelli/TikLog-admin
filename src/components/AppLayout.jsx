import { useEffect, useState } from 'react';
import { AppHeader } from "./AppHeader";
import { Sidebar } from "./Sidebar";
import { Logo } from '@/icon/Icons'
import { CustomButton } from './CustomButton';
import { ArrowLeftCircle } from 'lucide-react';
import useUserStore from '@/store/UserStore';
import { Navigate, useNavigate } from 'react-router';
import useNotificationStore from '@/store/NotificationStore';
import { get } from 'react-hook-form';

export const AppLayout = ({children, icon, title, showBackButton=true, showAppHeader=true}) => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    
    const { userCount, loading, getUserCount } = useUserStore();
    const {getNotifications, notifications} = useNotificationStore();

    const navigate = useNavigate();

    useEffect(() => {
      getUserCount();
      getNotifications();
    }, []);

    //console.log("User Count:", userCount?.data);


    const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

    return (
      <div className="flex h-screen w-full bg-gray-50">
        {/* Logo for larger screens - positioned above sidebar */}
        <div className="hidden md:flex md:items-end fixed top-0 left-0 w-64 bg-white z-50 p-6 underline border-b ">
          <img 
            src='/tiklogs logo_blue.png' 
            className="w-auto h-8 object-contain shrink-0" 
            alt="Tiklogs Logo"
          />
          <p className='text-lg font-bold text-gray-700'>ADMIN</p>
        </div>

          {/* Sidebar */}
        <div className="md:pt-20 pt-6">
          <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} data={userCount?.data} />
        </div>
  
        {/* Main Content */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Fixed header */}
          {showAppHeader && 
          <div className='mt-6'>
            <AppHeader 
              icon={icon} 
              name={title} 
              toggleSidebar={toggleSidebar}
              showBack={showBackButton}
            /> 
          </div>
          }

          {/* Scrollable content area */}
          <div className="flex-1 overflow-auto pt-10">
            {/* <div className='fixed top-12 left-0 z-10 w-full bg-white px-4 py-2 flex items-center justify-between md:hidden'>
            <button 
              className={`z-50 md:hidden py-4 bg-white rounded-full shadow-md transition-transform'}`}
              onClick={()=> {navigate(-1)}}
            >
              <ArrowLeftCircle size={24} />
            </button>
            </div> */}
            {children}
          </div>
        </div>
      </div>
    );
};