import { useState } from 'react';
import { AppHeader } from "./AppHeader";
import { Sidebar } from "./Sidebar";
import { Logo } from '@/icon/Icons'

export const AppLayout = ({children, icon, title}) => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

    return (
      <div className="flex h-screen w-full bg-gray-50">
        {/* Logo for larger screens - positioned above sidebar */}
        <div className="hidden md:block fixed top-0 left-0 w-64 bg-white z-50 p-6">
          <Logo />
          <p className='text-xs'>ADMINISTRATIVE PANEL</p>
        </div>

        {/* Sidebar */}
        <div className="md:pt-20">
          <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
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