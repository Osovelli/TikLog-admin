import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import { Shield, Calendar, FileText, Key } from "lucide-react"

export function ViewRoleDetails({ role, isOpen, onClose }) {
  if (!role) {
    return null
  }

  const roleData = role.data || role

  // Format permission name for display
  const formatPermission = (permission) => {
    return permission
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ')
  }

  // Group permissions by category
  const groupPermissions = (permissions) => {
    if (!permissions || permissions.length === 0) return {}
    
    const grouped = {}
    permissions.forEach(permission => {
      const parts = permission.split('_')
      const category = parts[parts.length - 1] // Get last part as category (e.g., "admin", "blog")
      
      if (!grouped[category]) {
        grouped[category] = []
      }
      grouped[category].push(permission)
    })
    return grouped
  }

  const groupedPermissions = groupPermissions(roleData.permissions)

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="overflow-y-auto">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-full bg-[#1F1F76]/10 flex items-center justify-center">
              <Shield className="w-5 h-5 text-[#1F1F76]" />
            </div>
            <span className="capitalize">{roleData.name}</span>
          </SheetTitle>
          <SheetDescription>View role details and permissions</SheetDescription>
        </SheetHeader>
        
        <div className="grid gap-6 py-6">
          {/* Role ID */}
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-sm font-medium text-gray-500">
              <FileText className="w-4 h-4" />
              Role ID
            </div>
            <div className="text-sm font-mono bg-gray-100 px-3 py-2 rounded">
              {roleData._id || "No ID provided"}
            </div>
          </div>

          {/* Description */}
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-sm font-medium text-gray-500">
              <FileText className="w-4 h-4" />
              Description
            </div>
            <div className="text-sm text-gray-700">
              {roleData.description || "No description provided."}
            </div>
          </div>

          {/* Created At */}
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-sm font-medium text-gray-500">
              <Calendar className="w-4 h-4" />
              Created At
            </div>
            <div className="text-sm text-gray-700">
              {roleData.createdAt 
                ? new Date(roleData.createdAt).toLocaleString() 
                : "No date provided"}
            </div>
          </div>

          {/* Permissions */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-sm font-medium text-gray-500">
              <Key className="w-4 h-4" />
              Permissions ({roleData.permissions?.length || 0})
            </div>
            
            {roleData.permissions && roleData.permissions.length > 0 ? (
              <div className="space-y-4">
                {Object.entries(groupedPermissions).map(([category, permissions]) => (
                  <div key={category} className="space-y-2">
                    <h4 className="text-sm font-medium capitalize text-gray-700">
                      {category} Management
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {permissions.map((permission) => (
                        <span
                          key={permission}
                          className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-700"
                        >
                          {formatPermission(permission)}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-sm text-gray-500 italic">
                No permissions assigned to this role.
              </div>
            )}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}