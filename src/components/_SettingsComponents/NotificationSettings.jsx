import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";

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

export const NotificationSettings = () => {
  // State for notification preferences
  const [notifications, setNotifications] = useState({
    deals: true,
    updates: true,
    email: false
  });

  // State for notification method (push/email/both)
  const [notificationMethod, setNotificationMethod] = useState("push");

  const handleToggle = (key) => {
    setNotifications(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-blue-600 text-base">Notification</CardTitle>
        <p className="text-sm text-gray-500">Manage notification settings</p>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Notification Method Selection */}
        <div className="space-y-3">
          <Label className="text-base">Notification Method</Label>
          <RadioGroup
            defaultValue={notificationMethod}
            onValueChange={setNotificationMethod}
            className="flex flex-col space-y-1"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="push" className="border-[#27115F] text-[#27115F]" />
              <Label className="text-sm font-normal">Push Notifications</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="email" className="border-[#27115F] text-[#27115F]" />
              <Label className="text-sm font-normal">Email</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="both" className="border-[#27115F] text-[#27115F]" />
              <Label className="text-sm font-normal">Both</Label>
            </div>
          </RadioGroup>
        </div>

        <Separator />

        {/* Notification Categories */}
        <div className="space-y-4">
          <NotificationItem
            title="Deals and more"
            description="Swith off updates on vouchers, promos, and such. You can always find the prom"
            enabled={notifications.deals}
            onToggle={() => handleToggle('deals')}
          />
          
          <Separator />
          
          <NotificationItem
            title="Update System"
            description="Updates o your live orders, trips, transaction history, and account"
            enabled={notifications.updates}
            onToggle={() => handleToggle('updates')}
          />
          
          <Separator />
          
          <NotificationItem
            title="Email Notification"
            description="Promotions, Tiklog recomendations, and announcements in your email"
            enabled={notifications.email}
            onToggle={() => handleToggle('email')}
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default NotificationSettings;