import { Bell, CheckCircle2, HelpCircle, Menu, Search, Settings, Tag, TagIcon } from 'lucide-react'
import React, { useState } from 'react'
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { AnimatePresence, motion } from 'framer-motion';
import { NotificationOverlay } from './NotificationOverlay';
import { NotificationItem } from './NotificationItem';
import { Logo } from '@/icon/Icons'
import { CustomButton } from './CustomButton';

export const AppHeader = ({icon, name, toggleSidebar}) => {
  const [isOverlayVisible, setIsOverlayVisible] = useState(false);
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      icon: CheckCircle2,
      title: "Delivery completed",
      message: "Request completed",
      time: "Now",
      isRead: false
    },
    {
      id: 2,
      icon: Settings,
      title: "System Information",
      message: "Verify your email",
      time: "13:00 PM",
      isRead: false
    },
    {
      id: 3,
      icon: Tag,
      title: "Deals",
      message: "Complete 5 rides and get ₦5,000",
      time: "11:50 PM",
      isRead: true
    },
    {
      id: 4,
      icon: Settings,
      title: "System Information",
      message: "Update apps to v.2.0",
      time: "Feb 20",
      isRead: true
    }
  ]);

  const handleMarkAllAsRead = () => {
    setNotifications(notifications.map(notif => ({
      ...notif,
      isRead: true
    })));
  };

  const handleMarkAsRead = (id) => {
    setNotifications(notifications.map(notif =>
      notif.id === id ? { ...notif, isRead: true } : notif
    ));
  };

  const unreadCount = notifications.filter(n => !n.isRead).length;

  return (
    <>
      <NotificationOverlay 
        isVisible={isOverlayVisible} 
        onClose={() => setIsOverlayVisible(false)} 
      />
      
      <div className='fixed top-0 left-0 right-0 bg-white border-b shadow-sm dark:bg-gray-900 px-4 sm:px-8 py-4 flex items-center z-40 h-16 md:ml-64'>
        {/* Left section with hamburger and logo for mobile */}
        <div className='flex items-center md:hidden'>
          {/* <button
            className="p-2 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-full"
            onClick={toggleSidebar}
          >
            <Menu size={24} className="dark:text-white" />
          </button> */}
          <CustomButton 
          buttonVariant={"icon"}
          className="p-2"
          onClick={toggleSidebar}
          >
             <Menu size={24} className="text-black dark:text-white" />
          </CustomButton>
          <div className="mx-4">
            <Logo />
            <p className='text-xs'>ADMINISTRATIVE PANEL</p>
          </div>
        </div>

        {/* Center/Left section with page icon and title */}
        <div className='hidden md:flex items-center dark:text-white'>
          {icon}
          <span className="ml-3 text-2xl font-semibold">{name}</span>
        </div>
        
        {/* Right section with actions */}
        <div className='flex gap-2 ml-auto items-center'>
          <Popover onOpenChange={setIsOverlayVisible}>
            <PopoverTrigger asChild>
              <motion.button 
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                className="p-2 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-full relative bg-white z-40"
              >
                <Bell size={18} className="dark:text-white" />
                {unreadCount > 0 && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"
                  />
                )}
              </motion.button>
            </PopoverTrigger>
            
            <PopoverContent 
              className="w-[380px] min-h-[500px] dark:bg-gray-900 dark:border-gray-800" 
              align="end"
            >
              <div className="flex items-center justify-between p-3 border-b dark:border-gray-800">
                <h3 className="font-medium dark:text-white">Notifications</h3>
                <button 
                  className="text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                  onClick={handleMarkAllAsRead}
                >
                  Mark As Read
                </button>
              </div>
              
              <div className="max-h-[400px] overflow-y-auto">
                <AnimatePresence>
                  {notifications.map((notification) => (
                    <NotificationItem
                      key={notification.id}
                      {...notification}
                      onMarkRead={() => handleMarkAsRead(notification.id)}
                    />
                  ))}
                </AnimatePresence>
              </div>
            </PopoverContent>
          </Popover>
          <motion.button 
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            className="p-2 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-full"
          >
            <Settings size={18} className="dark:text-white" />
          </motion.button>
        </div>
      </div>
    </>
  );
};