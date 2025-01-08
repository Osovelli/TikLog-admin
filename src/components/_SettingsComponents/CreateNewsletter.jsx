import React, { useState } from 'react'
import { Navigate, useNavigate } from 'react-router'
import { ArrowLeft, Plus } from 'lucide-react'
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { RichTextEditor } from '../CustomRichTextEditor'
import { AppLayout } from '../AppLayout'
import { Link } from 'react-router-dom'

export default function CreateNewsletter() {
  //const router = useRouter()
  const [content, setContent] = useState('')

  const navigate = useNavigate()

  const handleSend = () => {
    // Handle newsletter sending
    console.log('Sending newsletter:', content)
    navigate('/settings/newsletter')
  }

  return (
    <AppLayout title={'Create Newsletter'} 
    icon={
    <Link to="/settings/newsletter" className="text-gray-500 hover:text-gray-600">
        <ArrowLeft />
    </Link>
    }>
    <div className="p-6 space-y-6">
      <div className="bg-gray-100 rounded-lg p-1">
       {/*  <Tabs defaultValue="about-us">
          <TabsList className="bg-transparent w-full flex overflow-x-auto space-x-2 p-0">
            {[
              { value: 'about-us', label: 'About Us' },
              { value: 'terms', label: 'Terms & Conditions' },
              { value: 'privacy', label: 'Privacy Policy' },
              { value: 'delivery', label: 'Delivery & Return Policy' },
              { value: 'faq', label: 'FAQ' },
              { value: 'newsletter', label: 'Newsletter' },
            ].map((tab) => (
              <TabsTrigger
                key={tab.value}
                value={tab.value}
                className="rounded-lg px-4 py-2 text-sm font-medium data-[state=active]:bg-white data-[state=active]:shadow"
              >
                {tab.label}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs> */}
      </div>

      <div className="space-y-6">
        <Select defaultValue="all">
          <SelectTrigger className="w-[300px]">
            <SelectValue placeholder="Select recipients" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Users</SelectItem>
            <SelectItem value="active">Active Users</SelectItem>
            <SelectItem value="inactive">Inactive Users</SelectItem>
          </SelectContent>
        </Select>

        <RichTextEditor
          initialValue={content}
          onChange={setContent}
          className="bg-white rounded-lg border"
        />

        <div className="flex justify-end">
          <Button 
            onClick={handleSend}
            className="bg-indigo-600 hover:bg-indigo-700"
          >
            Send
          </Button>
        </div>
      </div>
    </div>
    </AppLayout>
  )
}