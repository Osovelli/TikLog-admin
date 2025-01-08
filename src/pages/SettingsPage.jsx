import React, { useState } from 'react'
import { CardSettings } from '@/components/_SettingsComponents/CardSettings'
import HelpCenterSettings from '@/components/_SettingsComponents/HelpCenterSettings'
import NotificationSettings from '@/components/_SettingsComponents/NotificationSettings'
import PrivacyPolicySettings from '@/components/_SettingsComponents/PrivacyPolicySettings'
import SecuritySettings from '@/components/_SettingsComponents/SecuritySettings'
import TermsAndConditionSettings from '@/components/_SettingsComponents/TermsAndConditionSettings'
import { AppLayout } from '@/components/AppLayout'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Settings, ChevronDown } from 'lucide-react'

const tabOptions = [
  { value: "card", label: "Card" },
  { value: "notification", label: "Notification" },
  { value: "security", label: "Account security" },
  { value: "help", label: "Help Center" },
  { value: "terms", label: "Terms & Conditions" },
  { value: "privacy", label: "Privacy Policy" },
]

export const SettingsPage = () => {
  const [activeTab, setActiveTab] = useState("card")

  const handleTabChange = (value) => {
    setActiveTab(value)
  }

  return (
    <AppLayout title="Settings" icon={<Settings />}>
      <div className="max-w-full mx-auto p-4 bg-gray-50">
        <h1 className="text-2xl font-semibold text-gray-900 mb-6">Settings</h1>
        
        {/* Mobile dropdown */}
        <div className="md:hidden mb-6">
          <Select value={activeTab} onValueChange={handleTabChange}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select a setting" />
            </SelectTrigger>
            <SelectContent>
              {tabOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Desktop tabs */}
        <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
          <TabsList className="hidden md:flex justify-start border-b mb-6">
            {tabOptions.map((option) => (
              <TabsTrigger
                key={option.value}
                value={option.value}
                className="pb-2 px-4 text-sm font-medium text-gray-500 hover:text-gray-700 whitespace-nowrap"
              >
                {option.label}
              </TabsTrigger>
            ))}
          </TabsList>

          <TabsContent value="card">
            <CardSettings />
          </TabsContent>

          <TabsContent value="notification">
            <NotificationSettings />
          </TabsContent>

          <TabsContent value="security">
            <SecuritySettings />
          </TabsContent>

          <TabsContent value="help">
            <HelpCenterSettings />
          </TabsContent>

          <TabsContent value="terms">
            <TermsAndConditionSettings />
          </TabsContent>

          <TabsContent value="privacy">
            <PrivacyPolicySettings />
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  )
}