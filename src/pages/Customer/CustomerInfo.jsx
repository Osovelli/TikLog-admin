import { useCallback, useEffect, useState } from "react"
import { useLocation } from "react-router-dom"
import { ProfileForm } from "@/components/ProfileForm"
import { ProfileHeader } from "@/components/ProfileHeader"
import { CustomerDeliveries } from "@/components/_CustomerComponents/CustomerDeliveries"
import { CustomerWalletInfo } from "@/components/_CustomerComponents/CustomerWalletInfo"
import useUserStore from "@/store/UserStore"
import { AppLayout } from "@/components/AppLayout"

export const CustomerInfo = ({ customerId }) => {
  const location = useLocation()
  const userid = location.pathname.split("/").pop()
  const [activeTab, setActiveTab] = useState("profile")
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    countryCode: "",
    birthDate: "",
    gender: "",
    address: "",
    status: null,
  })
  const [userDeliveries, setUserDeliveries] = useState([])
  const [userWallet, setUserWallet] = useState([])
  const [singleWallet, setSingleWallet] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false)

  const { getUserById, 
    activateUser, 
    deactivateUser, 
    loading, 
    getUserDeliveriesById, 
    getUserWalletById,
    getSingleWallet,
    
  } = useUserStore()

  // Helper function to normalize status
  const normalizeStatus = (status) => {
    if (typeof status === "string") {
      const lowerStatus = status.toLowerCase()
      if (lowerStatus === "active") return "active"
      if (lowerStatus === "inactive") return "inactive"
      if (lowerStatus === "pending") return "pending"
    }
    if (status === true) return "active"
    if (status === false) return "inactive"
    return "pending" // Default fallback
  }

  

  // Memoized fetch functions to prevent unnecessary re-renders
  const fetchUserData = useCallback(async () => {
    try {
      setIsLoading(true)
      const userData = await getUserById(userid)
      if (userData) {
        setFormData({
          firstName: userData.firstname || "",
          lastName: userData.lastname || "",
          email: userData.email || "",
          phone: userData.phone_number || "",
          countryCode: userData.country_code || "",
          birthDate: userData.date_of_birth || "",
          gender: userData.gender || "",
          address: userData.address || "",
          // Handle different status formats
          status: normalizeStatus(userData.status),
        })
      }
    } catch (error) {
      console.error("Error fetching user data:", error)
    } finally {
      setIsLoading(false)
    }
  }, [getUserById, userid])

  // Fetch user deliveries
  const fetchUserDeliveries = useCallback(async () => {
    try {
      const data = await getUserDeliveriesById(userid)
      console.log("User Deliveries Response: ", data)
      if (data?.data) {
        setUserDeliveries(data.data)
      }
    } catch (error) {
      console.error("Error fetching user deliveries:", error)
      setUserDeliveries([])
    }
  }, [getUserDeliveriesById, userid])

  // Fetch user wallet info
  const fetchUserWallet = useCallback(async () => {
    try {
      const data = await getUserWalletById(userid)
      console.log("User Wallet Response: ", data)
      if (data?.data) {
        setUserWallet(data.data)
      }
    } catch (error) {
      console.error("Error fetching user wallet info:", error)
      setUserWallet([])
    }
  }, [getUserWalletById, userid])

  const fetchUserSingleWallet = useCallback(async () => {
    try {
      console.log("Fetching single wallet for user:", userid)
      const data = await getSingleWallet(userid)
      console.log("Single Wallet Response: ", data)
      if (data?.data) {
        setSingleWallet(data.data)
      }
    }
    catch (error) {
      console.error("Error fetching single wallet:", error)
      setSingleWallet(null)
    }
  }, [getSingleWallet, userid])



  // Fetch all data when component mounts or userid changes
  useEffect(() => {
    if (userid) {
      fetchUserData()
      fetchUserDeliveries()
      fetchUserWallet()
      fetchUserSingleWallet()
    }
  }, [userid, fetchUserData, fetchUserDeliveries, fetchUserWallet, fetchUserSingleWallet])

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleSaveChanges = () => {
    console.log("Saving changes:", formData)
  }

  // Handle user activation
  const handleActivateUser = async () => {
    try {
      setIsUpdatingStatus(true)
      console.log("Activating user...")
      await activateUser(userid)

      // Update local state immediately for better UX
      setFormData((prev) => ({
        ...prev,
        status: "active", // Set status to active
      }))

      // Refresh user data to get the latest status from server
      await fetchUserData()
    } catch (error) {
      console.error("Error activating user:", error)
      // Revert local state if API call failed
      await fetchUserData() // Refresh to get actual status
    } finally {
      setIsUpdatingStatus(false)
    }
  }

  // Handle user deactivation
  const handleDeactivateUser = async () => {
    try {
      setIsUpdatingStatus(true)
      console.log("Deactivating user...")
      await deactivateUser(userid)

      // Update local state immediately for better UX
      setFormData((prev) => ({
        ...prev,
        status: "inactive", // Set status to inactive
      }))

      // Refresh user data to get the latest status from server
      await fetchUserData()
    } catch (error) {
      console.error("Error deactivating user:", error)
      // Revert local state if API call failed
      await fetchUserData() // Refresh to get actual status
    } finally {
      setIsUpdatingStatus(false)
    }
  }

  // Refresh data function for manual refresh
  const refreshData = useCallback(() => {
    fetchUserData()
    fetchUserDeliveries()
    fetchUserWallet()
    fetchUserSingleWallet()
  }, [fetchUserData, fetchUserDeliveries, fetchUserWallet, fetchUserSingleWallet])

  // Loading state check
  if (isLoading) {
    return (
      <AppLayout showBackButton={false} showAppHeader={true}>
        <div className="min-h-screen bg-gray-50 md:px-6">
          <div className="animate-pulse space-y-6">
            <div className="h-32 bg-gray-200 rounded-lg"></div>
            <div className="h-8 bg-gray-200 rounded w-1/3"></div>
            <div className="h-64 bg-gray-200 rounded-lg"></div>
          </div>
        </div>
      </AppLayout>
    )
  }

  return (
    <AppLayout showBackButton={false} showAppHeader={true}>
      <div className="min-h-screen bg-gray-50 md:px-6">
        {/* Profile Header with Dynamic Button */}
        <ProfileHeader
          name={`${formData.firstName} ${formData.lastName}`}
          email={formData.email}
          imageUrl={"/Avatar2.png"}
          status={formData.status}
          onActivate={handleActivateUser}
          onDeactivate={handleDeactivateUser}
          loading={isUpdatingStatus}
        />

        {/* Navigation Tabs */}
        <div className="my-4">
          <nav className="flex gap-8 px-3">
            {[
              { id: "profile", label: "Profile Information" },
              { id: "deliveries", label: "All Deliveries" },
              { id: "wallet", label: "Wallet Information" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`pb-4 px-1 transition-colors ${
                  activeTab === tab.id
                    ? "text-indigo-600 border-b-2 border-indigo-600 font-medium"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Tab Content */}
        {activeTab === "profile" && (
          <ProfileForm 
          formData={formData} 
          onInputChange={handleInputChange} 
          onSave={handleSaveChanges} 
          />
        )}

        {activeTab === "deliveries" && (
        <CustomerDeliveries deliveries={userDeliveries} 
        />
        )}

        {activeTab === "wallet" && <CustomerWalletInfo wallet={userWallet} />}

        {/* Refresh Button */}
        <button
          onClick={refreshData}
          className="fixed bottom-6 right-6 bg-indigo-600 text-white p-3 rounded-full shadow-lg hover:bg-indigo-700 transition-colors"
          title="Refresh Data"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
            />
          </svg>
        </button>
      </div>
    </AppLayout>
  )
}
