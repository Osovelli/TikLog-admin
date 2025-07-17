import useDashboardStore from "@/store/DashboardStore"
import { HighlightCard } from "./HighlightCard"
import { useEffect } from "react"

export const HighlightSection = () => {
  const { getDashboardUserGrowth, dashboardUserGrowthDetails } = useDashboardStore()

  useEffect(() => {
    getDashboardUserGrowth()
  }, [getDashboardUserGrowth])

  // Transform API data into highlights format
  const getHighlightsFromApiData = () => {
    if (!dashboardUserGrowthDetails?.data) {
      return []
    }

    const data = dashboardUserGrowthDetails.data

    return [
      {
        icon: "user",
        currentValue: data.customers?.current || 0,
        growth: data.customers?.growth || 0,
        label: "Customers",
      },
      {
        icon: "store",
        currentValue: data.vendors?.current || 0,
        growth: data.vendors?.growth || 0,
        label: "Vendors",
      },
      {
        icon: "bicycle",
        currentValue: data.riders?.current || 0,
        growth: data.riders?.growth || 0,
        label: "Riders",
      },
      {
        icon: "users",
        currentValue: data.adminUsers?.current || 0,
        growth: data.adminUsers?.growth || 0,
        label: "Admin Users",
      },
    ]
  }

  const highlights = getHighlightsFromApiData()

  // Show loading state if data is not yet available
  if (!dashboardUserGrowthDetails?.data) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(4)].map((_, index) => (
          <div key={index} className="animate-pulse">
            <div className="bg-white rounded-lg border p-6 space-y-2">
              <div className="w-5 h-5 bg-gray-200 rounded"></div>
              <div className="h-8 bg-gray-200 rounded w-20"></div>
              <div className="flex justify-between">
                <div className="h-4 bg-gray-200 rounded w-16"></div>
                <div className="h-4 bg-gray-200 rounded w-12"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {highlights.map((highlight, index) => (
        <HighlightCard
          key={index}
          icon={highlight.icon}
          currentValue={highlight.currentValue}
          growth={highlight.growth}
          label={highlight.label}
        />
      ))}
    </div>
  )
}
