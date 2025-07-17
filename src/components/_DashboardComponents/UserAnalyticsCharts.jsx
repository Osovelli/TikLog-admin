import { useEffect } from "react"
import { Card } from "@/components/ui/card"
import { UserStatusChart } from "./UserStatusChart"
import { UserDistributionChart } from "./UserDistributionChart"
import useDashboardStore from "@/store/DashboardStore"

export const UserAnalyticsCharts = () => {
  const { getDashboardUserAnalytics, getDashboardUserDetails, dashboardUserDetails, dashboardUserAnalytics, loading } =
    useDashboardStore()

  useEffect(() => {
    // Fetch both datasets when component mounts
    getDashboardUserDetails()
    getDashboardUserAnalytics()
  }, [getDashboardUserDetails, getDashboardUserAnalytics])

  const isLoading = loading || !dashboardUserDetails?.data || !dashboardUserAnalytics?.data

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Loading skeleton for both charts */}
        {[...Array(2)].map((_, index) => (
          <Card key={index} className="p-6">
            <div className="animate-pulse">
              <div className="h-6 bg-gray-200 rounded w-48 mb-4"></div>
              <div className="h-64 bg-gray-200 rounded"></div>
            </div>
          </Card>
        ))}
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* User Status Breakdown Chart */}
      <Card className="p-6">
        <div className="mb-4">
          <h3 className="text-lg font-semibold text-gray-900">User Status Overview</h3>
          <p className="text-sm text-gray-600">Detailed breakdown of user statuses across all categories</p>
        </div>
        <UserStatusChart data={dashboardUserDetails?.data} />
      </Card>

      {/* User Distribution Pie Chart */}
      <Card className="p-6">
        <div className="mb-4">
          <h3 className="text-lg font-semibold text-gray-900">User Distribution</h3>
          <p className="text-sm text-gray-600">Total users by category</p>
        </div>
        <UserDistributionChart data={dashboardUserAnalytics?.data} />
      </Card>
    </div>
  )
}
