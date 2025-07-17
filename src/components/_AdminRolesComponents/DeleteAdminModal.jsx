import { AlertTriangle } from "lucide-react"
import Modal from "../ModalComponent"

export const DeleteAdminModal = ({ isOpen, onClose, adminData, onConfirm, loading = false }) => {
  if (!adminData) return null

  const adminName = `${adminData.firstname || ""} ${adminData.lastname || ""}`.trim() || "this admin"

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Delete Admin"
      buttons={[
        {
          label: "Cancel",
          onClick: onClose,
          primary: false,
          disabled: loading,
          className: "bg-gray-100 text-gray-700 hover:bg-gray-200",
        },
        {
          label: loading ? "Deleting..." : "Delete Admin",
          onClick: onConfirm,
          primary: true,
          disabled: loading,
          className: "bg-red-600 hover:bg-red-700 text-white",
        },
      ]}
    >
      <div className="text-center space-y-4">
        {/* Warning Icon */}
        <div className="flex justify-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
            <AlertTriangle className="w-8 h-8 text-red-600" />
          </div>
        </div>

        {/* Warning Message */}
        <div className="space-y-2">
          <h3 className="text-lg font-semibold text-gray-900">Are you sure you want to delete {adminName}?</h3>
          <p className="text-gray-600 text-xs">
            This action cannot be undone. The admin will be permanently removed from the system and will lose access to
            all administrative functions.
          </p>
        </div>

        {/* Admin Details */}
        <div className="bg-gray-50 rounded-lg p-4 text-left">
          <h4 className="font-medium text-gray-900 mb-2">Admin Details:</h4>
          <div className="space-y-1 text-sm text-gray-600">
            <div>
              <span className="font-medium">Name:</span> {adminName}
            </div>
            <div>
              <span className="font-medium">Email:</span> {adminData.email || "N/A"}
            </div>
            <div>
              <span className="font-medium">Role:</span> {adminData.role?.name || "No Role Assigned"}
            </div>
            <div>
              <span className="font-medium">Status:</span>{" "}
              <span
                className={`px-2 py-1 rounded-full text-xs ${
                  adminData.status?.toLowerCase() === "active"
                    ? "bg-green-100 text-green-800"
                    : "bg-gray-100 text-gray-800"
                }`}
              >
                {adminData.status || "Unknown"}
              </span>
            </div>
          </div>
        </div>

        {/* Final Warning */}
        <div className="bg-red-50 border border-red-200 rounded-lg p-3">
          <p className="text-sm text-red-800 font-medium">
            ⚠️ Warning: This action is irreversible and will permanently delete all admin data.
          </p>
        </div>
      </div>
    </Modal>
  )
}
