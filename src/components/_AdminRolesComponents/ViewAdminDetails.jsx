import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet"

export function ViewAdminDetails({ admin, isOpen, onClose }) {
  if (!admin) {
    return null // Don't render if no admin is provided
  }

  const formatDate = (dateString) => {
    if (!dateString) return "No date provided"
    const date = new Date(dateString)
    return date.toString() !== "Invalid Date" ? date.toLocaleString() : "No date provided"
  }

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="w-[400px] sm:w-[540px] overflow-y-scroll">
        <SheetHeader>
          <SheetTitle>Admin Details</SheetTitle>
          <SheetDescription>
            Details for {admin?.data?.firstname} {admin?.data?.lastname}
          </SheetDescription>
        </SheetHeader>

        <div className="grid gap-6 py-6">
          {/* Profile Section */}
          <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
            <img src={admin.data?.avatar || "/Avatar1.png"} alt={`${admin?.data?.firstname} ${admin?.data?.lastname}`} className="w-16 h-16 rounded-full" />
            <div>
              <h3 className="text-lg font-semibold">
                {admin?.data?.firstname} {admin?.data?.lastname}
              </h3>
              <p className="text-sm text-gray-600">{admin?.data?.email}</p>
              <span
                className={`inline-block px-2 py-1 rounded-full text-xs mt-1 ${
                  admin.status?.toLowerCase() === "active" ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"
                }`}
              >
                {admin?.data?.status}
              </span>
            </div>
          </div>

          {/* Basic Information */}
          <div className="space-y-4">
            <h4 className="text-base font-semibold border-b pb-2">Basic Information</h4>

            <div className="grid gap-3">
              <div>
                <div className="text-sm font-medium text-gray-700 mb-1">Admin ID:</div>
                <div className="text-sm text-gray-900 font-mono bg-gray-50 p-2 rounded">
                  {admin?.data?._id || "No ID provided"}
                </div>
              </div>

              <div>
                <div className="text-sm font-medium text-gray-700 mb-1">First Name:</div>
                <div className="text-sm text-gray-900">{admin?.data?.firstname || "Not provided"}</div>
              </div>

              <div>
                <div className="text-sm font-medium text-gray-700 mb-1">Last Name:</div>
                <div className="text-sm text-gray-900">{admin?.data?.lastname || "Not provided"}</div>
              </div>

              <div>
                <div className="text-sm font-medium text-gray-700 mb-1">Email Address:</div>
                <div className="text-sm text-gray-900">{admin?.data?.email || "Not provided"}</div>
              </div>
            </div>
          </div>

          {/* Role Information */}
          <div className="space-y-4">
            <h4 className="text-base font-semibold border-b pb-2">Role & Permissions</h4>

            <div className="grid gap-3">
              <div>
                <div className="text-sm font-medium text-gray-700 mb-1">Role:</div>
                <div className="text-sm text-gray-900">
                  {admin.role?.name ? (
                    <span className="inline-block px-3 py-1 bg-blue-100 text-blue-800 rounded-full capitalize">
                      {admin?.data?.role.name.replace("-", " ")}
                    </span>
                  ) : (
                    "No role assigned"
                  )}
                </div>
              </div>

              {admin?.data?.role?.description && (
                <div>
                  <div className="text-sm font-medium text-gray-700 mb-1">Role Description:</div>
                  <div className="text-sm text-gray-900">{admin?.data?.role.description}</div>
                </div>
              )}

              {admin?.data?.role?._id && (
                <div>
                  <div className="text-sm font-medium text-gray-700 mb-1">Role ID:</div>
                  <div className="text-sm text-gray-900 font-mono bg-gray-50 p-2 rounded">{admin?.data?.role._id}</div>
                </div>
              )}
            </div>
          </div>

          {/* Activity Information */}
          <div className="space-y-4">
            <h4 className="text-base font-semibold border-b pb-2">Activity</h4>

            <div className="grid gap-3">
              <div>
                <div className="text-sm font-medium text-gray-700 mb-1">Last Login:</div>
                <div className="text-sm text-gray-900">{formatDate(admin.last_login)}</div>
              </div>

              <div>
                <div className="text-sm font-medium text-gray-700 mb-1">Account Status:</div>
                <div className="text-xs text-gray-900 capitalize bg-gray-100 p-2 rounded-full inline">{admin?.data?.status || "Unknown"}</div>
              </div>

              {admin.createdAt && (
                <div>
                  <div className="text-sm font-medium text-gray-700 mb-1">Account Created:</div>
                  <div className="text-sm text-gray-900">{formatDate(admin.createdAt)}</div>
                </div>
              )}

              {admin.updatedAt && (
                <div>
                  <div className="text-sm font-medium text-gray-700 mb-1">Last Updated:</div>
                  <div className="text-sm text-gray-900">{formatDate(admin.updatedAt)}</div>
                </div>
              )}
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}
