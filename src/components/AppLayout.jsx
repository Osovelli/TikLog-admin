import { useEffect, useState } from 'react';
import { AppHeader } from "./AppHeader";
import { Sidebar } from "./Sidebar";
import { Logo } from '@/icon/Icons'
import { CustomButton } from './CustomButton';
import { ArrowLeftCircle } from 'lucide-react';
import useUserStore from '@/store/UserStore';

export const AppLayout = ({children, icon, title}) => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    
    const { userCount, loading, getUserCount } = useUserStore(); 

    useEffect(() => {
      getUserCount();
    }, []);

    //console.log("User Count:", userCount?.data);


    const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

    return (
      <div className="flex h-screen w-full bg-gray-50">
        {/* Logo for larger screens - positioned above sidebar */}
        <div className="hidden md:flex md:items-end gap-2 fixed top-0 left-0 w-64 bg-white z-50 p-6 underline border-b">
          <img 
            src='/tiklogs logo_blue.png' 
            className="w-auto h-8 object-contain shrink-0" 
            alt="Tiklogs Logo"
          />
          <p className='text-xs font-medium text-gray-700'>TIKLOG ADMINISTRATIVE PANEL</p>
          </div>

          {/* Sidebar */}
        <div className="md:pt-20">
          <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} data={userCount?.data} />
        </div>
  
        {/* Main Content */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Fixed header */}
          <AppHeader 
            icon={icon} 
            name={title} 
            toggleSidebar={toggleSidebar} 
          /> 
          
          {/* Scrollable content area */}
          <div className="flex-1 overflow-auto pt-16">
            {children}
          </div>
        </div>
      </div>
    );
};