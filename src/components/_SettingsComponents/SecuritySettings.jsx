import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { ButtonComponent } from '../ButtonComponent';
import { useModal } from '@/lib/ModalContext';
import ChangePasswordForm from './ChangePasswordForm';


const NotificationItem = ({ title, description, enabled, onToggle }) => {
  return (
    <div className="flex items-center justify-between space-x-4 py-4">
      <div className="flex-1">
        <h3 className="text-base font-medium text-gray-900">{title}</h3>
        <p className="text-sm text-gray-500">{description}</p>
      </div>
      <Switch
        checked={enabled}
        onCheckedChange={onToggle}
        className="data-[state=checked]:bg-[#27115F]"
      />
    </div>
  );
};

export const SecuritySettings = () => {
  // State for notification preferences
  const [notifications, setNotifications] = useState({
    fingerprint: false,
  });

  const {openModal, closeModal} = useModal()

  const handleToggle = (key) => {
    setNotifications(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const handleOpenChangePasswordModal = () => {
   /*  send api here */
  }


  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-blue-600 text-base">Account security</CardTitle>
        <p className="text-sm text-gray-500">Manage password and biometrics</p>
      </CardHeader>

      <CardContent className="space-y-6">
        <Separator />

        <div className="flex items-center justify-between space-x-4 py-4">
            <div className="flex-1">
                <h3 className="text-base font-medium text-gray-900">Manage Password</h3>
                <p className="text-sm text-gray-500">xxxx</p>
            </div>
            <ButtonComponent label={'Change Password'} variant={'white'} onClick={handleOpenChangePasswordModal} />
        </div>
        {/* Notification Categories */}
        <div className="space-y-4">
          <NotificationItem
            title="Fingerprint for Login"
            description="You can make login faster & secure with fingerprint in your devices"
            enabled={notifications.fingerprint}
            onToggle={() => handleToggle('fingerprint')}
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default SecuritySettings;