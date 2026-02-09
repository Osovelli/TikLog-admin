import { ArrowLeft } from "lucide-react"
import { Link } from "react-router-dom"
import { CustomButton } from "./CustomButton"

export const ProfileHeader = ({ info, name, email, imageUrl, status, onActivate, onDeactivate, loading = false }) => {

  const isActive = status === "active" || status === true || status === "Activated"
  const infoName = info ? `${info.firstname} ${info.lastname}` : name
  const infoEmail = info ? info.email : email
  const infoImage = info ? info.profileImage?.url || imageUrl : imageUrl



  // Normalize status to lowercase for consistent comparison

  const normalizedStatus =
    typeof status === "string"
      ? status.toLowerCase()
      : status === true
        ? "active"
        : status === false
          ? "inactive"
          : "pending"

  const getStatusConfig = () => {
    switch (normalizedStatus) {
      case "active":
        return {
          label: "Active",
          bgColor: "bg-green-100",
          textColor: "text-green-800",
          buttonText: "Deactivate User",
          buttonVariant: "outlined",
          buttonClass: "text-red-600 border border-red-200 hover:bg-red-50",
          action: onDeactivate,
          loadingText: "Deactivating...",
        }
      case "inactive":
        return {
          label: "Inactive",
          bgColor: "bg-red-100",
          textColor: "text-red-800",
          buttonText: "Activate User",
          buttonVariant: "primary",
          buttonClass: "text-white bg-[#27115F] hover:bg-[#1e0d4a]",
          action: onActivate,
          loadingText: "Activating...",
        }
      case "pending":
        return {
          label: "Pending",
          bgColor: "bg-yellow-100",
          textColor: "text-yellow-800",
          buttonText: "Activate User",
          buttonVariant: "primary",
          buttonClass: "text-white bg-[#27115F] hover:bg-[#1e0d4a]",
          action: onActivate,
          loadingText: "Activating...",
        }
      default:
        return {
          label: "Unknown",
          bgColor: "bg-gray-100",
          textColor: "text-gray-800",
          buttonText: "Activate User",
          buttonVariant: "primary",
          buttonClass: "text-white bg-[#27115F] hover:bg-[#1e0d4a]",
          action: onActivate,
          loadingText: "Activating...",
        }
    }
  }

  const statusConfig = getStatusConfig()

  const handleStatusAction = () => {
    if (statusConfig.action) {
      statusConfig.action()
    }
  }

  return (
    <div className="md:-mx-6 -mx-0">
      <div className="relative bg-blue-400 h-40">
        {/* Background with illustration */}
        <div className="absolute right-0 bottom-0 w-80">
          <img src="/profileheader.png" alt="" className="w-full h-full object-contain" />
        </div>
        <div className="relative">
          {/* Back Button */}
          <Link
            to={-1}
            className="inline-flex items-center gap-2 px-4 py-2 bg-white rounded-lg text-gray-600 hover:text-gray-900 my-6 mx-2"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back</span>
          </Link>
        </div>
      </div>

      {/* Profile Info */}
      <div className="relative bg-white border rounded-t-lg p-2 sm:p-6">
        <div className="flex flex-col sm:flex-row mt-6 gap-3 items-start justify-between flex-wrap">
          <div className="flex sm:flex-row sm:items-center gap-4 ">
            <img
              src={infoImage || "/generic avatar.png"}
              alt={name}
              className="absolute -top-12 sm:w-40 w-24 h-24 sm:h-40 rounded-full object-cover"
            />
            <div className="mt-4 sm:mt-0 space-y-1 sm:ml-48">
              <h1 className="text-2xl font-semibold text-gray-900">{infoName}</h1>
              <p className="text-gray-500">{infoEmail}</p>

              {/* Status Indicator */}
              {/* <div className="flex items-center gap-2 mt-2">
                <span className="text-sm font-medium text-gray-700">Status:</span>
                <span
                  className={`px-3 py-1 rounded-full text-sm font-medium ${statusConfig.bgColor} ${statusConfig.textColor}`}
                >
                  {isActive ? "Active" : "Inactive"}
                </span>
              </div> */}
            </div>
          </div>

          {/* status Dynamic Button */}
          <div className="flex flex-row gap-2">
            {/* Only show button for non-pending states or if pending can be activated */}
            {normalizedStatus !== "pending" || onActivate ? (
            <CustomButton
              buttonVariant={statusConfig.buttonVariant}
              onClick={handleStatusAction}
              className={`py-2 rounded-lg transition-colors flex-shrink md:w-44 ${statusConfig.buttonClass}`}
              disabled={loading}
            >
              {loading ? statusConfig.loadingText : statusConfig.buttonText}
            </CustomButton>
            ) : (
              <div className="py-2 px-4 rounded-lg bg-gray-100 text-gray-500 flex-shrink md:w-44 text-center">
                Pending Approval
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
