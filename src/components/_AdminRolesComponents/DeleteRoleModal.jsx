import React from 'react'
import Modal from '../ModalComponent'
import { Shield, AlertTriangle } from 'lucide-react'

export const DeleteRoleModal = ({ isOpen, onClose, roleData, onConfirm, loading }) => {
  if (!roleData) return null

  const role = roleData.data || roleData

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Delete Role"
      buttons={[
        {
          label: "Cancel",
          onClick: onClose,
          primary: false
        },
        {
          label: loading ? "Deleting..." : "Delete Role",
          onClick: onConfirm,
          disabled: loading,
          primary: true,
          className: "bg-red-600 hover:bg-red-700"
        }
      ]}
    >
      <div className="space-y-4 text-center">
        <div className="mx-auto w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">
          <AlertTriangle className="w-6 h-6 text-red-600" />
        </div>
        
        <div>
          <h3 className="text-lg font-medium text-gray-900">
            Are you sure you want to delete this role?
          </h3>
          <p className="mt-2 text-sm text-gray-500">
            This action cannot be undone. All admins assigned to this role will lose their permissions.
          </p>
        </div>

        <div className="bg-gray-50 rounded-lg p-4 text-left">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#1F1F76]/10 flex items-center justify-center">
              <Shield className="w-5 h-5 text-[#1F1F76]" />
            </div>
            <div>
              <p className="font-medium capitalize">{role.name}</p>
              <p className="text-sm text-gray-500">
                {role.permissions?.length || 0} permissions
              </p>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  )
}