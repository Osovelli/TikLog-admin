import { CheckCircle2, Settings } from "lucide-react";
import { motion } from "framer-motion";

export const NotificationItem = ({ icon: Icon, title, message, time, isRead, onMarkRead }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -20 }}
    className={`flex gap-3 p-3 hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer 
      ${!isRead ? 'border-r-2 border-red-500' : ''}`}
    onClick={onMarkRead}
  >
    <div className={`p-2 rounded-full ${
      Icon === CheckCircle2 ? 'bg-green-50 dark:bg-green-900' : 
      Icon === Settings ? 'bg-gray-50 dark:bg-gray-800' : 
      'bg-red-50 dark:bg-red-900'
    }`}>
      <Icon size={20} className={`${
        Icon === CheckCircle2 ? 'text-green-500' : 
        Icon === Settings ? 'text-gray-500' : 
        'text-red-500'
      }`} />
    </div>
    <div className="flex-1">
      <h4 className="text-sm font-medium dark:text-white">{title}</h4>
      <p className="text-sm text-gray-500 dark:text-gray-400">{message}</p>
    </div>
    <span className="text-xs text-gray-400 whitespace-nowrap">{time}</span>
  </motion.div>
);