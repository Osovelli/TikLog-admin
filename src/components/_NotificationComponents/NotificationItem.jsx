import React from 'react';
import { Settings, CheckCircle2, Tag } from 'lucide-react';

const NotificationIcon = ({ type }) => {
  const iconProps = { size: 20 };
  const baseClasses = "p-2 rounded-full";
  
  switch (type) {
    case 'delivery':
      return (
        <div className={`${baseClasses} bg-green-50`}>
          <CheckCircle2 {...iconProps} className="text-green-600" />
        </div>
      );
    case 'system':
      return (
        <div className={`${baseClasses} bg-gray-100`}>
          <Settings {...iconProps} className="text-gray-600" />
        </div>
      );
    case 'deal':
      return (
        <div className={`${baseClasses} bg-red-50`}>
          <Tag {...iconProps} className="text-red-600" />
        </div>
      );
    default:
      return null;
  }
};

const NotificationItem = ({ type, title, message, time, onAction }) => {
  return (
    <div className="flex items-start gap-3 p-4 bg-white shadow-sm hover:bg-gray-50 transition-colors">
      <NotificationIcon type={type} />
      
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <div>
            <span className='flex gap-2 text-xs'>
                <h4 className="text-sm font-semibold text-gray-900">{title}</h4>
                <p>{`(${time})`}</p>
            </span>
            <p className="text-sm text-gray-500 mt-0.5">{message}</p>
          </div>
          <div className="flex flex-col items-end gap-2 flex-shrink-0">
            <button 
              onClick={onAction}
              className="px-3 py-1 text-xs font-medium text-gray-700 bg-white border border-gray-200 rounded-full hover:bg-gray-50"
            >
              Action
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export const NotificationComponent = () => {
  const notifications = [
    {
      id: 1,
      type: 'delivery',
      title: 'Delivery completed',
      message: 'Request completed',
      time: 'Now'
    },
    {
      id: 2,
      type: 'system',
      title: 'System Information',
      message: 'Verify your email',
      time: '13:00 PM'
    },
    {
      id: 3,
      type: 'deal',
      title: 'Delivery completed',
      message: 'Complete 5 rides and get ₦5,000',
      time: '11:50 PM'
    },
    {
      id: 4,
      type: 'system',
      title: 'System Information',
      message: 'Maintenance will take place February 22-23',
      time: 'Feb20'
    }
  ];

  const handleAction = (id) => {
    console.log('Action clicked for notification:', id);
  };

  return (
    <div className="w-full h-screen p-4 bg-gray-50 rounded-lg shadow-lg mt-14">
      <div className="divide-y divide-gray-100 space-y-2">
        {notifications.map((notification) => (
          <NotificationItem
            key={notification.id}
            {...notification}
            onAction={() => handleAction(notification.id)}
          />
        ))}
      </div>
    </div>
  );
};
