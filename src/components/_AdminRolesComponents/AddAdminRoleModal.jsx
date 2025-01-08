import React, { useState } from 'react'
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { ChevronDown, ChevronRight } from 'lucide-react'
import { CustomCheckbox } from '../CustomCheckbox'
import Modal from '../ModalComponent'

const PermissionSection = ({ title, isOpen, onToggle, permissions, onChange, onSelectAll }) => {
  const allChecked = permissions.every(p => p.checked)
  const someChecked = permissions.some(p => p.checked)

  return (
    <div className="border-t first:border-t-0">
      <div className="flex items-center justify-between py-4 cursor-pointer" onClick={onToggle}>
        <div className="flex items-center gap-2">
          {isOpen ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
          <span className="font-medium">{title}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-500">Select all</span>
          <CustomCheckbox 
            checked={allChecked}
            ref={React.useRef()}
            onCheckedChange={onSelectAll}
            className={someChecked && !allChecked ? "data-[state=checked]:bg-indigo-300" : ""}
          />
        </div>
      </div>
      
      {isOpen && (
        <div className="grid grid-cols-2 gap-4 pb-4">
          {permissions.map((permission) => (
            <div key={permission.id} className="flex items-center gap-2">
              <CustomCheckbox
                checked={permission.checked}
                onCheckedChange={(checked) => onChange(permission.id, checked)}
              />
              <span className="text-sm">{permission.label}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export const AddAdminRoleModal = ({ isOpen, onClose }) => {
  const [expandedSections, setExpandedSections] = useState(['dashboard'])
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    permissions: {
      dashboard: [
        { id: 'dashboard-read', label: 'Read', checked: false },
        { id: 'dashboard-update', label: 'Update', checked: false },
        { id: 'dashboard-delete', label: 'Delete', checked: false }
      ],
      users: [
        { id: 'users-read', label: 'Read', checked: false },
        { id: 'users-update', label: 'Update', checked: false },
        { id: 'users-delete', label: 'Delete', checked: false }
      ],
      customers: [
        { id: 'customers-read', label: 'Read', checked: false },
        { id: 'customers-update', label: 'Update', checked: false },
        { id: 'customers-delete', label: 'Delete', checked: false }
      ],
      riders: [
        { id: 'riders-read', label: 'Read', checked: false },
        { id: 'riders-update', label: 'Update', checked: false },
        { id: 'riders-delete', label: 'Delete', checked: false }
      ],
      vendors: [
        { id: 'vendors-read', label: 'Read', checked: false },
        { id: 'vendors-update', label: 'Update', checked: false },
        { id: 'vendors-delete', label: 'Delete', checked: false }
      ],
      transactions: [
        { id: 'transactions-read', label: 'Read', checked: false },
        { id: 'transactions-update', label: 'Update', checked: false },
        { id: 'transactions-delete', label: 'Delete', checked: false }
      ],
      deliveries: [
        { id: 'deliveries-read', label: 'Read', checked: false },
        { id: 'deliveries-update', label: 'Update', checked: false },
        { id: 'deliveries-delete', label: 'Delete', checked: false }
      ],
      vehicles: [
        { id: 'vehicles-read', label: 'Read', checked: false },
        { id: 'vehicles-update', label: 'Update', checked: false },
        { id: 'vehicles-delete', label: 'Delete', checked: false }
      ],
      chat: [
        { id: 'chat-read', label: 'Read', checked: false },
        { id: 'chat-update', label: 'Update', checked: false },
        { id: 'chat-delete', label: 'Delete', checked: false }
      ],
      roles: [
        { id: 'roles-read', label: 'Read', checked: false },
        { id: 'roles-update', label: 'Update', checked: false },
        { id: 'roles-delete', label: 'Delete', checked: false }
      ]
    }
  })

  const toggleSection = (section) => {
    setExpandedSections(prev => 
      prev.includes(section) 
        ? prev.filter(s => s !== section)
        : [...prev, section]
    )
  }

  const handlePermissionChange = (section, id, checked) => {
    setFormData(prev => ({
      ...prev,
      permissions: {
        ...prev.permissions,
        [section]: prev.permissions[section].map(p => 
          p.id === id ? { ...p, checked } : p
        )
      }
    }))
  }

  const handleSelectAll = (section, checked) => {
    setFormData(prev => ({
      ...prev,
      permissions: {
        ...prev.permissions,
        [section]: prev.permissions[section].map(p => ({ ...p, checked }))
      }
    }))
  }

  const handleSave = () => {
    console.log('Form data:', formData)
    onClose()
  }

  const sections = [
    { id: 'dashboard', label: 'Dashboard' },
    { id: 'users', label: 'Users' },
    { id: 'customers', label: 'Customers' },
    { id: 'riders', label: 'Riders' },
    { id: 'vendors', label: 'Vendors' },
    { id: 'transactions', label: 'Transactions' },
    { id: 'deliveries', label: 'Deliveries' },
    { id: 'vehicles', label: 'Vehicles' },
    { id: 'chat', label: 'Chat Management' },
    { id: 'roles', label: 'Roles & Permissions' }
  ]

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Add Role"
      buttons={[
        {
          label: "Save changes",
          onClick: handleSave,
          primary: true
        }
      ]}
    >
      <div className="space-y-4">
        <Input
          placeholder="Super Admin"
          value={formData.name}
          onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
        />

        <Textarea
          placeholder="Role description goes in here."
          value={formData.description}
          onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
          rows={4}
        />

        <div className="border rounded-lg divide-y">
          {sections.map(section => (
            <PermissionSection
              key={section.id}
              title={section.label}
              isOpen={expandedSections.includes(section.id)}
              onToggle={() => toggleSection(section.id)}
              permissions={formData.permissions[section.id]}
              onChange={(id, checked) => handlePermissionChange(section.id, id, checked)}
              onSelectAll={(checked) => handleSelectAll(section.id, checked)}
            />
          ))}
        </div>
      </div>
    </Modal>
  )
}

/* import React, { useState } from 'react'
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { ChevronDown, ChevronRight } from 'lucide-react'
import { CustomCheckbox } from '../CustomCheckbox'
import Modal from '../ModalComponent'


const PermissionSection = ({ title, isOpen, onToggle, permissions, onChange, onSelectAll }) => {
  const allChecked = permissions.every(p => p.checked)
  const someChecked = permissions.some(p => p.checked)

  return (
    <div className="border-t first:border-t-0 px-4">
      <div className="flex items-center justify-between py-4 cursor-pointer" onClick={onToggle}>
        <div className="flex items-center gap-2">
          {isOpen ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
          <span className="font-medium">{title}</span>
        </div>
        <div className="flex items-center gap-2 ">
          <CustomCheckbox
            checked={allChecked}
            ref={React.useRef()}
            onCheckedChange={onSelectAll}
            className={someChecked && !allChecked ? "data-[state=checked]:bg-indigo-300" : ""}
          />
          <span className="text-sm text-gray-500">Select all</span>
        </div>
      </div>
      
      {isOpen && (
        <div className="grid grid-cols-2 gap-4 pb-4 ">
          {permissions.map((permission) => (
            <div key={permission.id} className="flex items-center gap-2">
              <CustomCheckbox
                checked={permission.checked}
                onCheckedChange={(checked) => onChange(permission.id, checked)}
              />
              <span className="text-sm">{permission.label}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export const AddAdminRoleModal = ({ isOpen, onClose }) => {
  const [expandedSections, setExpandedSections] = useState(['dashboard'])
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    permissions: {
      dashboard: [
        { id: 'dashboard-read', label: 'Read', checked: false },
        { id: 'dashboard-update', label: 'Update', checked: false },
        { id: 'dashboard-delete', label: 'Delete', checked: false }
      ],
      users: [
        { id: 'users-read', label: 'Read', checked: false },
        { id: 'users-update', label: 'Update', checked: false },
        { id: 'users-delete', label: 'Delete', checked: false }
      ],
      customers: [
        { id: 'customers-read', label: 'Read', checked: false },
        { id: 'customers-update', label: 'Update', checked: false },
        { id: 'customers-delete', label: 'Delete', checked: false }
      ],
      riders: [
        { id: 'riders-read', label: 'Read', checked: false },
        { id: 'riders-update', label: 'Update', checked: false },
        { id: 'riders-delete', label: 'Delete', checked: false }
      ],
      vendors: [
        { id: 'vendors-read', label: 'Read', checked: false },
        { id: 'vendors-update', label: 'Update', checked: false },
        { id: 'vendors-delete', label: 'Delete', checked: false }
      ],
      transactions: [
        { id: 'transactions-read', label: 'Read', checked: false },
        { id: 'transactions-update', label: 'Update', checked: false },
        { id: 'transactions-delete', label: 'Delete', checked: false }
      ],
      deliveries: [
        { id: 'deliveries-read', label: 'Read', checked: false },
        { id: 'deliveries-update', label: 'Update', checked: false },
        { id: 'deliveries-delete', label: 'Delete', checked: false }
      ],
      vehicles: [
        { id: 'vehicles-read', label: 'Read', checked: false },
        { id: 'vehicles-update', label: 'Update', checked: false },
        { id: 'vehicles-delete', label: 'Delete', checked: false }
      ],
      chat: [
        { id: 'chat-read', label: 'Read', checked: false },
        { id: 'chat-update', label: 'Update', checked: false },
        { id: 'chat-delete', label: 'Delete', checked: false }
      ],
      roles: [
        { id: 'roles-read', label: 'Read', checked: false },
        { id: 'roles-update', label: 'Update', checked: false },
        { id: 'roles-delete', label: 'Delete', checked: false }
      ]
    }
  })

  const toggleSection = (section) => {
    setExpandedSections(prev => 
      prev.includes(section) 
        ? prev.filter(s => s !== section)
        : [...prev, section]
    )
  }

  const handlePermissionChange = (section, id, checked) => {
    setFormData(prev => ({
      ...prev,
      permissions: {
        ...prev.permissions,
        [section]: prev.permissions[section].map(p => 
          p.id === id ? { ...p, checked } : p
        )
      }
    }))
  }

  const handleSelectAll = (section, checked) => {
    setFormData(prev => ({
      ...prev,
      permissions: {
        ...prev.permissions,
        [section]: prev.permissions[section].map(p => ({ ...p, checked }))
      }
    }))
  }

  const handleSave = () => {
    console.log('Form data:', formData)
    onClose()
  }

  const sections = [
    { id: 'dashboard', label: 'Dashboard' },
    { id: 'users', label: 'Users' },
    { id: 'customers', label: 'Customers' },
    { id: 'riders', label: 'Riders' },
    { id: 'vendors', label: 'Vendors' },
    { id: 'transactions', label: 'Transactions' },
    { id: 'deliveries', label: 'Deliveries' },
    { id: 'vehicles', label: 'Vehicles' },
    { id: 'chat', label: 'Chat Management' },
    { id: 'roles', label: 'Roles & Permissions' }
  ]

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Add Role"
      buttons={[
        {
          label: "Save changes",
          onClick: handleSave,
          primary: true
        }
      ]}
    >
      <div className="space-y-4 text-left">
        <Input
          placeholder="Super Admin"
          value={formData.name}
          onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
        />

        <Textarea
          placeholder="Role description goes in here."
          value={formData.description}
          onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
          rows={4}
        />

        <div className="border rounded-lg divide-y">
          {sections.map(section => (
            <PermissionSection
              key={section.id}
              title={section.label}
              isOpen={expandedSections.includes(section.id)}
              onToggle={() => toggleSection(section.id)}
              permissions={formData.permissions[section.id]}
              onChange={(id, checked) => handlePermissionChange(section.id, id, checked)}
              onSelectAll={(checked) => handleSelectAll(section.id, checked)}
            />
          ))}
        </div>
      </div>
    </Modal>
  )
} */