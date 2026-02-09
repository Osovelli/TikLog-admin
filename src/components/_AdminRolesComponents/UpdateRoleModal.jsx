import React, { useState, useEffect } from 'react'
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { ChevronDown, ChevronRight } from 'lucide-react'
import { CustomCheckbox } from '../CustomCheckbox'
import Modal from '../ModalComponent'
import useRoleStore from '@/store/RolesStore'

const PermissionSection = ({ title, isOpen, onToggle, permissions, selectedPermissions, onChange, onSelectAll }) => {
  const allChecked = permissions.every(p => selectedPermissions.includes(p.id))
  const someChecked = permissions.some(p => selectedPermissions.includes(p.id))

  return (
    <div className="border-t first:border-t-0 px-4">
      <div className="flex items-center justify-between py-4 cursor-pointer" onClick={onToggle}>
        <div className="flex items-center gap-2">
          {isOpen ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
          <span className="font-medium">{title}</span>
        </div>
        <div className="flex items-center gap-2">
          <CustomCheckbox
            checked={allChecked}
            onCheckedChange={() => onSelectAll(!allChecked)}
            className={someChecked && !allChecked ? "data-[state=checked]:bg-indigo-300" : ""}
          />
          <span className="text-sm text-gray-500">Select all</span>
        </div>
      </div>
      
      {isOpen && (
        <div className="grid grid-cols-2 gap-4 pb-4">
          {permissions.map((permission) => (
            <div key={permission.id} className="flex items-center gap-2">
              <CustomCheckbox
                checked={selectedPermissions.includes(permission.id)}
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

export const UpdateRoleModal = ({ isOpen, onClose, roleData, onUpdateSuccess }) => {
  const [expandedSections, setExpandedSections] = useState(['admin'])
  const [formData, setFormData] = useState({
    name: '',
    description: '',
  })
  const [selectedPermissions, setSelectedPermissions] = useState([])

  const { updateRole, loading } = useRoleStore()

  // Define permission sections with their permissions
  const permissionSections = {
    admin: [
      { id: 'create_admin', label: 'Create Admin' },
      { id: 'get_admin', label: 'View Admin' },
      { id: 'update_admin', label: 'Update Admin' },
      { id: 'delete_admin', label: 'Delete Admin' }
    ],
    user: [
      { id: 'create_user', label: 'Create User' },
      { id: 'get_user', label: 'View User' },
      { id: 'update_user', label: 'Update User' },
      { id: 'delete_user', label: 'Delete User' }
    ],
    role: [
      { id: 'create_role', label: 'Create Role' },
      { id: 'get_role', label: 'View Role' },
      { id: 'update_role', label: 'Update Role' },
      { id: 'delete_role', label: 'Delete Role' }
    ],
    blog: [
      { id: 'create_blog', label: 'Create Blog' },
      { id: 'get_blog', label: 'View Blog' },
      { id: 'update_blog', label: 'Update Blog' },
      { id: 'delete_blog', label: 'Delete Blog' }
    ],
    customer: [
      { id: 'create_customer', label: 'Create Customer' },
      { id: 'get_customer', label: 'View Customer' },
      { id: 'update_customer', label: 'Update Customer' },
      { id: 'delete_customer', label: 'Delete Customer' }
    ],
    rider: [
      { id: 'create_rider', label: 'Create Rider' },
      { id: 'get_rider', label: 'View Rider' },
      { id: 'update_rider', label: 'Update Rider' },
      { id: 'delete_rider', label: 'Delete Rider' }
    ],
    vendor: [
      { id: 'create_vendor', label: 'Create Vendor' },
      { id: 'get_vendor', label: 'View Vendor' },
      { id: 'update_vendor', label: 'Update Vendor' },
      { id: 'delete_vendor', label: 'Delete Vendor' }
    ],
    transaction: [
      { id: 'create_transaction', label: 'Create Transaction' },
      { id: 'get_transaction', label: 'View Transaction' },
      { id: 'update_transaction', label: 'Update Transaction' },
      { id: 'delete_transaction', label: 'Delete Transaction' }
    ],
    delivery: [
      { id: 'create_delivery', label: 'Create Delivery' },
      { id: 'get_delivery', label: 'View Delivery' },
      { id: 'update_delivery', label: 'Update Delivery' },
      { id: 'delete_delivery', label: 'Delete Delivery' }
    ],
    vehicle: [
      { id: 'create_vehicle', label: 'Create Vehicle' },
      { id: 'get_vehicle', label: 'View Vehicle' },
      { id: 'update_vehicle', label: 'Update Vehicle' },
      { id: 'delete_vehicle', label: 'Delete Vehicle' }
    ]
  }

  const sections = [
    { id: 'admin', label: 'Admin Management' },
    { id: 'user', label: 'User Management' },
    { id: 'role', label: 'Roles & Permissions' },
    { id: 'blog', label: 'Blog Management' },
    { id: 'customer', label: 'Customers' },
    { id: 'rider', label: 'Riders' },
    { id: 'vendor', label: 'Vendors' },
    { id: 'transaction', label: 'Transactions' },
    { id: 'delivery', label: 'Deliveries' },
    { id: 'vehicle', label: 'Vehicles' }
  ]

  // Populate form when roleData changes
  useEffect(() => {
    if (roleData) {
      const role = roleData.data || roleData
      setFormData({
        name: role.name || '',
        description: role.description || '',
      })
      setSelectedPermissions(role.permissions || [])
    }
  }, [roleData])

  const toggleSection = (section) => {
    setExpandedSections(prev => 
      prev.includes(section) 
        ? prev.filter(s => s !== section)
        : [...prev, section]
    )
  }

  const handlePermissionChange = (permissionId, checked) => {
    setSelectedPermissions(prev => 
      checked 
        ? [...prev, permissionId]
        : prev.filter(p => p !== permissionId)
    )
  }

  const handleSelectAll = (sectionId, selectAll) => {
    const sectionPermissions = permissionSections[sectionId].map(p => p.id)
    
    setSelectedPermissions(prev => {
      if (selectAll) {
        const newPermissions = [...prev]
        sectionPermissions.forEach(p => {
          if (!newPermissions.includes(p)) {
            newPermissions.push(p)
          }
        })
        return newPermissions
      } else {
        return prev.filter(p => !sectionPermissions.includes(p))
      }
    })
  }

  const handleUpdateRole = async () => {
    const role = roleData?.data || roleData
    const roleId = role?._id

    if (!roleId) {
      console.error('No role ID found')
      return
    }

    const updateData = {
      name: formData.name,
      permissions: selectedPermissions
    }
    
    /* console.log('UPDATING ROLE DATA:', updateData)
    console.log('ROLE ID:', roleId) */
    
    try {
      await updateRole(roleId, updateData)
      onClose()
      if (onUpdateSuccess) {
        onUpdateSuccess()
      }
    } catch (error) {
      console.error('Error updating role:', error)
    }
  }

  const handleClose = () => {
    setFormData({ name: '', description: '' })
    setSelectedPermissions([])
    onClose()
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Update Role"
      buttons={[
        {
          label: loading ? "Updating..." : "Save changes",
          onClick: handleUpdateRole,
          disabled: loading || !formData.name || selectedPermissions.length === 0,
          primary: true
        }
      ]}
    >
      <div className="space-y-4 text-left">
        <div>
          <label className="text-sm font-medium text-gray-700">Role Name</label>
          <Input
            placeholder="e.g., Blog Manager"
            value={formData.name}
            onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
            className="mt-1"
          />
        </div>

        <div>
          <label className="text-sm font-medium text-gray-700">Description (Optional)</label>
          <Textarea
            placeholder="Role description goes in here."
            value={formData.description}
            onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
            rows={3}
            className="mt-1"
          />
        </div>

        <div>
          <label className="text-sm font-medium text-gray-700 mb-2 block">
            Permissions ({selectedPermissions.length} selected)
          </label>
          <div className="border rounded-lg divide-y max-h-[300px] overflow-y-auto">
            {sections.map(section => (
              <PermissionSection
                key={section.id}
                title={section.label}
                isOpen={expandedSections.includes(section.id)}
                onToggle={() => toggleSection(section.id)}
                permissions={permissionSections[section.id]}
                selectedPermissions={selectedPermissions}
                onChange={handlePermissionChange}
                onSelectAll={(checked) => handleSelectAll(section.id, checked)}
              />
            ))}
          </div>
        </div>
      </div>
    </Modal>
  )
}