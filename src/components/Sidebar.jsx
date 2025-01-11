import React, { useState, useEffect } from 'react'
import { User, Package, Truck, Settings, ChevronDown } from 'lucide-react'
import { PiNoteLight } from "react-icons/pi";
import { HiOutlineChatBubbleLeftRight } from "react-icons/hi2";
import { Logo } from '@/icon/Icons'
import { SidebarProfile } from './SidebarProfile'
import { Link, useLocation } from 'react-router-dom'
import { FaDesktop } from 'react-icons/fa'
import { cn } from '@/lib/utils';

/* const SidebarItem = ({ icon, text, routeName}) => {
  const location = useLocation();
  const active = location.pathname === `/${routeName}`;

  return (
    <Link to={`/${routeName}`}>
      <li className={`flex items-center p-2 rounded-lg cursor-pointer ${active ? 'bg-gray-100 text-indigo-700' : 'text-gray-700 hover:bg-gray-50'}`}>
      {icon}
      <span className="ml-3">{text}</span>
      </li>
    </Link>
  )
} */

  const SidebarItem = ({ icon, text, routeName, children }) => {
    const [isOpen, setIsOpen] = useState(false);
    const location = useLocation();
    const active = location.pathname === `/${routeName}`;
    const hasChildren = Boolean(children);

    // Check if any child routes are active
    const isChildActive = React.Children.toArray(children).some(
      child => location.pathname === `/${child.props.routeName}`
    );

    // Set initial open state when component mounts
    useEffect(() => {
      if (isChildActive) {
        setIsOpen(true);
      }
    }, [isChildActive]);
  
    return (
      <div>
        <div
          onClick={() => hasChildren && setIsOpen(!isOpen)}
          className={cn(
            "flex items-center p-2 rounded-lg cursor-pointer justify-between",
            active ? 'bg-[#E1E1EB] text-indigo-700' : 'text-gray-700 hover:bg-gray-50'
          )}
        >
          <div className="flex items-center">
            {icon}
            <span className="ml-3">{text}</span>
          </div>
          {hasChildren && (
            <ChevronDown 
              className={cn(
                "w-4 h-4 transition-transform duration-200",
                isOpen ? "transform rotate-180" : ""
              )}
            />
          )}
        </div>
        {isOpen && children && (
          <div className="mt-1">{children}</div>
        )}
      </div>
    )
  }

const NestedSidebarItem = ({ icon, text, routeName, count, isNested = false }) => {
  const location = useLocation();
  const active = location.pathname.startsWith(`/${routeName}`);

  return (
    <Link to={`/${routeName}`}>
      <li className={cn(
        "flex items-center p-2 rounded-lg cursor-pointer justify-between",
        isNested ? "pl-11" : "",
        active 
          ? 'bg-[#E1E1EB] text-indigo-900' 
          : 'text-gray-700 hover:bg-gray-50'
      )}>
        <div className="flex items-center">
          {icon}
          <span className="ml-3">{text}</span>
        </div>
        {count !== undefined && (
          <span className="bg-gray-100 text-gray-600 px-2 py-0.5 rounded text-sm">
            {count.toLocaleString()}
          </span>
        )}
      </li>
    </Link>
  )
}

export const Sidebar = ({ isOpen, toggleSidebar }) => {
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth < 768) // 768px is the 'md' breakpoint in Tailwind
    }

    checkIsMobile()
    window.addEventListener('resize', checkIsMobile)

    return () => window.removeEventListener('resize', checkIsMobile)
  }, [])

  return (
    <>
      {/* Sidebar */}
      <div className={`
        fixed inset-y-0 h-full left-0 z-40 w-64 mt-6 sm:mt-0 border-r bg-white border-gray-200 transition-transform duration-300 ease-in-out
        ${isMobile ? (isOpen ? 'translate-x-0' : '-translate-x-full') : 'translate-x-0'}
        md:relative md:translate-x-0
      `}>
        <div className="h-full flex flex-col">
          {/* Logo */}
          <div className="hidden p-6 ml-9 sm:ml-0">
            <Logo />
          </div>
          
          {/* Navigation Items */}
          <div className="flex-1 px-4 mt-10 sm:mt-2 overflow-y-auto">
            {/* <p className="text-gray-500 text-sm mb-4 px-2">Activity</p> */}
            <nav className="space-y-1">
              <NestedSidebarItem 
                icon={<FaDesktop 
                size={20} />} 
                text="Dashboard" 
                routeName={'dashboard'} 
              />
               <SidebarItem 
                icon={<User size={20} />} 
                text="User Management" 
                routeName="profile"
              >
                <NestedSidebarItem 
                  text="Customers" 
                  routeName="customers"
                  count={5000}
                  isNested
                />
                <NestedSidebarItem 
                  text="Riders" 
                  routeName="riders"
                  count={5000}
                  isNested
                />
                <NestedSidebarItem 
                  text="Vendors" 
                  routeName="vendors"
                  count={5000}
                  isNested
                />
              </SidebarItem>
              <NestedSidebarItem 
                icon={<PiNoteLight size={20} />} 
                text="Transaction" 
                routeName="transaction" 
              />
              <NestedSidebarItem 
                icon={<Package size={20} />} 
                text="Deliveries" 
                routeName="deliveries" 
              />
              <NestedSidebarItem 
                icon={<Truck size={20} />} 
                text="Vehicles" 
                routeName="vehicle" 
              />
              <NestedSidebarItem 
                icon={<HiOutlineChatBubbleLeftRight size={20} />} 
                text="Chat Management" 
                routeName="chat"
              />
            </nav>
          </div>
          
          {/* User Profile Section */}
          <div className='px-4'>
            <NestedSidebarItem 
              icon={<Settings size={20} />} 
              text="Roles and Permission" 
              routeName="admin-roles" 
            />
            <NestedSidebarItem 
              icon={<FaDesktop size={20} />} 
              text="Website Settings" 
              routeName="settings" 
            />
            <SidebarProfile
              name="Tiklog Admin"
              email="Admin@tiklog.com"
              avatarUrl="/Avatar1.png"
            />
          </div>
        </div>
      </div>

      {/* Overlay for mobile */}
      {isMobile && isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30"
          onClick={toggleSidebar}
        />
      )}
    </>
  )
}