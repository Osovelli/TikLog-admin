import React, { useState } from 'react'
import { Plus, Eye, Trash2 } from 'lucide-react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from '@/components/ui/button'
import { Table } from '@/components/Table'
import { useNavigate } from 'react-router'

const newsletters = [
  {
    id: '101',
    title: 'Stop calling Tinubu T-Pain',
    status: 'Sent',
    date: 'Dec 6, 2024',
    scheduled: 'N/A',
    recipients: '8,254'
  },
  // Repeated for demonstration
].concat(Array(5).fill({
  id: '101',
  title: 'Stop calling Tinubu T-Pain',
  status: 'Sent',
  date: 'Dec 6, 2024',
  scheduled: 'N/A',
  recipients: '8,254'
}))

const subscribers = [
  {
    id: '1',
    name: 'Ejike Malaika',
    email: 'user@email.com',
    date: 'Dec 6, 2024',
    status: 'Sent',
    scheduled: 'N/A'
  },
  // Repeated for demonstration
].concat(Array(5).fill({
  id: '1',
  name: 'Ejike Malaika',
  email: 'user@email.com',
  date: 'Dec 6, 2024',
  status: 'Sent',
  scheduled: 'N/A'
}))

const newsletterColumns = [
  { key: 'id', label: 'ID' },
  { key: 'title', label: 'Title' },
  { key: 'status', label: 'Status' },
  { key: 'date', label: 'Date' },
  { key: 'scheduled', label: 'Scheduled' },
  { key: 'recipients', label: 'Recipients' }
]

const subscriberColumns = [
  { key: 'name', label: 'Name' },
  { key: 'email', label: 'Email' },
  { key: 'date', label: 'Date' },
  { key: 'status', label: 'Status' },
  { key: 'scheduled', label: 'Scheduled' }
]

export default function Newsletter() {
  const [activeTab, setActiveTab] = useState('newsletters')
  const navigate = useNavigate()

  const renderActions = (item) => (
    <div className="flex justify-end space-x-2">
      <button className="text-blue-600 hover:text-blue-900">
        <Eye size={16} />
      </button>
      <button className="text-red-600 hover:text-red-900">
        <Trash2 size={16} />
      </button>
    </div>
  )

  const renderCustomCell = (key, value, item) => {
    if (key === 'status') {
      return (
        <span className="px-2 py-1 text-sm rounded-full bg-green-500/10 text-green-500">
          {value}
        </span>
      )
    }
    return value
  }

  const handleCreateNewsletter = () =>{
    navigate('/settings/newsletter/create')
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center relative">
        <Tabs defaultValue="newsletters" className="w-full" onValueChange={setActiveTab}>
          <TabsList className="bg-transparent border-b rounded-none w-full justify-start h-auto p-0">
            <TabsTrigger 
              value="newsletters"
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-4 py-2"
            >
              Manage Newsletters
            </TabsTrigger>
            <TabsTrigger 
              value="subscribers"
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-4 py-2"
            >
              Manage Subscribers
            </TabsTrigger>
          </TabsList>

          <div className="absolute right-0 -top-1">
            {activeTab === 'newsletters' && (
              <Button className="bg-indigo-600 hover:bg-indigo-700"
              onClick={handleCreateNewsletter}
              >
                <Plus className="w-4 h-4 mr-2" />
                Create Newsletter
              </Button>
            )}
          </div>

          <TabsContent value="newsletters" className="mt-6">
            <Table
              data={newsletters}
              name={"Newsletters"}
              columns={newsletterColumns}
              renderActions={renderActions}
              renderCustomCell={renderCustomCell}
              showSearch={false}
            />
          </TabsContent>

          <TabsContent value="subscribers" className="mt-6">
            <Table 
              data={subscribers}
              name={"Subscribers"}
              columns={subscriberColumns}
              renderActions={renderActions}
              renderCustomCell={renderCustomCell}
              showSearch={false}
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}