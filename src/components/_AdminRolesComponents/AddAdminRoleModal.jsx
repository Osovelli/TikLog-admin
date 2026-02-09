import React, { useState, useEffect, useMemo } from 'react'
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { ChevronDown, ChevronRight, Loader2 } from 'lucide-react'
import { CustomCheckbox } from '../CustomCheckbox'
import Modal from '../ModalComponent'
import useRoleStore from '@/store/RolesStore'

const PermissionSection = ({ title, isOpen, onToggle, permissions, selectedPermissions, onChange, onSelectAll }) => {
  const allChecked = permissions?.length > 0 && permissions.every(p => selectedPermissions.includes(p.id))
  const someChecked = permissions?.some(p => selectedPermissions.includes(p.id))

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
          {permissions?.map((permission) => (
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

export const AddAdminRoleModal = ({ isOpen, onClose, onCreateSuccess }) => {
  const [expandedSections, setExpandedSections] = useState([])
  const [formData, setFormData] = useState({
    name: '',
    description: '',
  })
  const [selectedPermissions, setSelectedPermissions] = useState([])
  const [permissionsLoading, setPermissionsLoading] = useState(false)

  const { createRole, getPermissions, permissions, loading } = useRoleStore()

  // Fetch permissions when modal opens
  useEffect(() => {
    const fetchPermissions = async () => {
      if (isOpen && !permissions) {
        setPermissionsLoading(true)
        try {
          await getPermissions()
        } catch (error) {
          console.error('Error fetching permissions:', error)
        } finally {
          setPermissionsLoading(false)
        }
      }
    }
    fetchPermissions()
  }, [isOpen, getPermissions, permissions])

  // Transform permissions object into sections array
  const sections = useMemo(() => {
    if (!permissions) return []
    
    return Object.entries(permissions).map(([categoryName, categoryPermissions]) => ({
      id: categoryName.toLowerCase().replace(/[_\s]/g, ""),
      label: categoryName
        .split("_")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" "),
    }))
  }, [permissions])

  // Transform permissions object into permissionSections object
  const permissionSections = useMemo(() => {
    if (!permissions) return {}
    
    return Object.entries(permissions).reduce((acc, [categoryName, categoryPermissions]) => {
      const sectionId = categoryName.toLowerCase().replace(/[_\s]/g, "")
      acc[sectionId] = categoryPermissions.map((permission) => ({
        id: permission,
        label: permission
          .split("_")
          .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
          .join(" "),
      }))
      return acc
    }, {})
  }, [permissions])

  // Set first section as expanded when permissions load
  useEffect(() => {
    if (sections.length > 0 && expandedSections.length === 0) {
      setExpandedSections([sections[0].id])
    }
  }, [sections])

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
    const sectionPermissions = permissionSections[sectionId]?.map(p => p.id) || []
    
    setSelectedPermissions(prev => {
      if (selectAll) {
        // Add all permissions from this section that aren't already selected
        const newPermissions = [...prev]
        sectionPermissions.forEach(p => {
          if (!newPermissions.includes(p)) {
            newPermissions.push(p)
          }
        })
        return newPermissions
      } else {
        // Remove all permissions from this section
        return prev.filter(p => !sectionPermissions.includes(p))
      }
    })
  }

  const handleCreateRole = async () => {
    const roleData = {
      name: formData.name,
      permissions: selectedPermissions
    }
    console.log('CREATING ROLE DATA:', roleData)
    
    try {
      await createRole(roleData)
      // Reset form
      setFormData({ name: '', description: '' })
      setSelectedPermissions([])
      setExpandedSections([])
      onClose()
      if (onCreateSuccess) {
        onCreateSuccess()
      }
    } catch (error) {
      console.error('Error creating role:', error)
    }
  }

  const handleClose = () => {
    setFormData({ name: '', description: '' })
    setSelectedPermissions([])
    setExpandedSections([])
    onClose()
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Add Role"
      buttons={[
        {
          label: loading ? "Creating..." : "Save changes",
          onClick: handleCreateRole,
          disabled: loading || !formData.name || selectedPermissions.length === 0,
          primary: true
        }
      ]}
    >
      <div className="space-y-4 text-left mx-4">
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
          
          {permissionsLoading ? (
            <div className="border rounded-lg p-8 flex flex-col items-center justify-center text-gray-500">
              <Loader2 className="w-6 h-6 animate-spin mb-2" />
              <span className="text-sm">Loading permissions...</span>
            </div>
          ) : sections.length === 0 ? (
            <div className="border rounded-lg p-8 flex items-center justify-center text-gray-500">
              <span className="text-sm">No permissions available</span>
            </div>
          ) : (
            <div className="border rounded-lg divide-y max-h-[300px] overflow-y-auto">
              {sections.map(section => (
                <PermissionSection
                  key={section.id}
                  title={section.label}
                  isOpen={expandedSections.includes(section.id)}
                  onToggle={() => toggleSection(section.id)}
                  permissions={permissionSections[section.id] || []}
                  selectedPermissions={selectedPermissions}
                  onChange={handlePermissionChange}
                  onSelectAll={(checked) => handleSelectAll(section.id, checked)}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </Modal>
  )
}