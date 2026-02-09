import { useMemo, useState, useEffect, useCallback } from "react"
import { TabButton } from "./TabButton"
import { TimeframeButton } from "./TimeframeButton"
import { BarChartComponent } from "./BarChartComponent"
import { ChevronDown } from "lucide-react"
import useDashboardStore from "@/store/DashboardStore"

export const UsersOverview = () => {
  const [activeTab, setActiveTab] = useState("customers")
  const [activeTimeFrame, setActiveTimeFrame] = useState("today")
  const [isTimeFrameOpen, setIsTimeFrameOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const { 
    fetchCustomerStatRange, 
    fetchRiderStatRange, 
    fetchVendorStatRange,
    fetchAdminStatRange,
    customerStatRange,
    riderStatRange,
    vendorStatRange,
    adminStatRange,
    loading 
  } = useDashboardStore()

  const tabs = [
    { id: "customers", label: "Customers" },
    { id: "vendors", label: "Vendors" },
    { id: "riders", label: "Riders" },
    { id: "adminUsers", label: "Admin Users" },
  ]

  const timeFrames = [
    { id: "today", label: "Today", apiValue: "today" },
    { id: "7D", label: "7 D", apiValue: "7days" },
    { id: "30D", label: "30 D", apiValue: "30days" },
    { id: "12M", label: "12 M", apiValue: "12months" },
    { id: "allTime", label: "All time", apiValue: "all" },
  ]

  // Get the API value for the current timeframe
  const getApiRange = useCallback((timeFrameId) => {
    const timeFrame = timeFrames.find(tf => tf.id === timeFrameId)
    return timeFrame?.apiValue || "today"
  }, [])

  // Fetch data based on active tab and timeframe
  const fetchData = useCallback(async () => {
    const range = getApiRange(activeTimeFrame)
    setIsLoading(true)
    
    try {
      switch (activeTab) {
        case "customers":
          await fetchCustomerStatRange(range)
          break
        case "vendors":
          await fetchVendorStatRange(range)
          break
        case "riders":
          await fetchRiderStatRange(range)
          break
        case "adminUsers":
          if (fetchAdminStatRange) {
            await fetchAdminStatRange(range)
          }
          break
        default:
          break
      }
    } catch (error) {
      console.error("Error fetching data:", error)
    } finally {
      setIsLoading(false)
    }
  }, [activeTab, activeTimeFrame, getApiRange, fetchCustomerStatRange, fetchVendorStatRange, fetchRiderStatRange, fetchAdminStatRange])

  // Fetch data when tab or timeframe changes
  useEffect(() => {
    fetchData()
  }, [fetchData])

  // Get current data based on active tab
  const currentData = useMemo(() => {
    switch (activeTab) {
      case "customers":
        return customerStatRange
      case "vendors":
        return vendorStatRange
      case "riders":
        return riderStatRange
      case "adminUsers":
        return adminStatRange
      default:
        return null
    }
  }, [activeTab, customerStatRange, vendorStatRange, riderStatRange, adminStatRange])

  // Transform API data ({ x, y } format) to chart format
  const chartData = useMemo(() => {
    if (!currentData || !Array.isArray(currentData)) {
      return []
    }

    return currentData.map((item, index) => ({
      month: item.x, // Use 'month' key for compatibility with BarChartComponent
      label: item.x, // Also provide label
      value: item.y || 0,
      active: index === currentData.length - 1, // Mark last item as active
    }))
  }, [currentData])

  // Loading state
  if (isLoading && chartData.length === 0) {
    return (
      <div className="bg-white p-4 sm:p-6 rounded-lg shadow-sm">
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-gray-900">Users Over Time</h2>
        </div>
        <div className="animate-pulse">
          <div className="flex flex-col md:flex-row justify-between items-start sm:items-center mb-8 space-y-4 sm:space-y-0">
            <div className="flex flex-wrap gap-2">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-8 w-20 bg-gray-200 rounded"></div>
              ))}
            </div>
            <div className="hidden md:flex items-center gap-2">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-8 w-12 bg-gray-200 rounded"></div>
              ))}
            </div>
          </div>
          <div className="h-64 bg-gray-200 rounded"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white p-4 sm:p-6 rounded-lg shadow-sm">
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-gray-900">Users Over Time</h2>
      </div>

      <div className="flex flex-col md:flex-row justify-between items-start sm:items-center mb-8 space-y-4 sm:space-y-0">
        <div className="flex flex-wrap -mx-2 overflow-x-auto pb-2 sm:pb-0">
          {tabs.map((tab) => (
            <div key={tab.id} className="px-2 mb-2 sm:mb-0">
              <TabButton 
                label={tab.label} 
                active={activeTab === tab.id} 
                onClick={() => setActiveTab(tab.id)} 
              />
            </div>
          ))}
        </div>

        {/* Timeframe button for desktop */}
        <div className="hidden md:flex items-center gap-2 bg-gray-50 p-1 rounded-lg">
          {timeFrames.map((timeFrame) => (
            <TimeframeButton
              key={timeFrame.id}
              label={timeFrame.label}
              active={activeTimeFrame === timeFrame.id}
              onClick={() => setActiveTimeFrame(timeFrame.id)}
            />
          ))}
        </div>

        {/* Timeframe button for mobile */}
        <div className="relative md:hidden">
          <button
            onClick={() => setIsTimeFrameOpen(!isTimeFrameOpen)}
            className="flex items-center justify-between w-full sm:w-auto px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            {timeFrames.find((tf) => tf.id === activeTimeFrame)?.label}
            <ChevronDown className="ml-2 h-4 w-4" />
          </button>
          {isTimeFrameOpen && (
            <div className="absolute right-0 mt-2 z-10 w-24 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5">
              <div className="py-1" role="menu" aria-orientation="vertical" aria-labelledby="options-menu">
                {timeFrames.map((timeFrame) => (
                  <button
                    key={timeFrame.id}
                    onClick={() => {
                      setActiveTimeFrame(timeFrame.id)
                      setIsTimeFrameOpen(false)
                    }}
                    className="block w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                    role="menuitem"
                  >
                    {timeFrame.label}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="mt-4 relative">
        {/* Loading overlay */}
        {isLoading && chartData.length > 0 && (
          <div className="absolute inset-0 bg-white/50 flex items-center justify-center z-10">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
          </div>
        )}
        
        {chartData.length === 0 && !isLoading ? (
          <div className="h-64 flex items-center justify-center text-gray-500">
            <p>No data available for this period</p>
          </div>
        ) : (
          <BarChartComponent data={chartData} />
        )}
      </div>
    </div>
  )
}