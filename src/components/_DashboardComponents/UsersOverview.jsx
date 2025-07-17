import { useMemo, useState, useEffect } from "react"
import { TabButton } from "./TabButton"
import { TimeframeButton } from "./TimeframeButton"
import { BarChartComponent } from "./BarChartComponent"
import { ChevronDown } from "lucide-react"
import useDashboardStore from "@/store/DashboardStore"

export const UsersOverview = () => {
  const [activeTab, setActiveTab] = useState("customers")
  const [activeTimeFrame, setActiveTimeFrame] = useState("7D")
  const [isTimeFrameOpen, setIsTimeFrameOpen] = useState(false)

  const { getUserDashboardData, userDashboardData } = useDashboardStore()

  useEffect(() => {
    getUserDashboardData()
  }, [getUserDashboardData])

  const tabs = [
    { id: "customers", label: "Customers" },
    { id: "vendors", label: "Vendors" },
    { id: "riders", label: "Riders" },
    { id: "adminUsers", label: "Admin Users" },
  ]

  const timeFrames = [
    { id: "today", label: "Today" },
    { id: "7D", label: "7 D" },
    { id: "30D", label: "30 D" },
    { id: "12M", label: "12 M" },
    { id: "allTime", label: "All time" },
  ]

  const filterDataByTimeFrame = (data, timeFrame) => {
    if (!data || data.length === 0) return []

    const currentDate = new Date()
    const currentMonthIndex = data.length - 1 // Assuming the last item is the current month

    switch (timeFrame) {
      case "today":
        // Return only the current month data
        return data.slice(currentMonthIndex, currentMonthIndex + 1)
      case "7D":
        // Return last 2 months (approximating 7 days as recent data)
        return data.slice(Math.max(0, currentMonthIndex - 1), currentMonthIndex + 1)
      case "30D":
        // Return last 3 months (approximating 30 days)
        return data.slice(Math.max(0, currentMonthIndex - 2), currentMonthIndex + 1)
      case "12M":
        // Return all 12 months
        return data
      case "allTime":
        // Return all available data
        return data
      default:
        return data
    }
  }

  const transformApiDataToChartData = (apiData, userType) => {
    if (!apiData?.monthlyData) return []

    return apiData.monthlyData.map((monthData, index) => ({
      month: monthData.month,
      value: monthData[userType] || 0,
      active: false, // Will be set in the filtered data
    }))
  }

  const chartData = useMemo(() => {
    if (!userDashboardData?.data?.monthlyData) {
      return []
    }

    // Transform API data to chart format for the selected user type
    const transformedData = transformApiDataToChartData(userDashboardData.data, activeTab)

    // Filter data based on timeframe
    const filteredData = filterDataByTimeFrame(transformedData, activeTimeFrame)

    // Mark the last item as active
    return filteredData.map((item, index) => ({
      ...item,
      active: index === filteredData.length - 1,
    }))
  }, [userDashboardData, activeTab, activeTimeFrame])

  // Loading state
  if (!userDashboardData?.data?.monthlyData) {
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
              <TabButton label={tab.label} active={activeTab === tab.id} onClick={() => setActiveTab(tab.id)} />
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

      <div className="mt-4">
        <BarChartComponent data={chartData} />
      </div>
    </div>
  )
}
