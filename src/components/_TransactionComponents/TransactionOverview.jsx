import { useState, useMemo, useEffect } from "react"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip } from "recharts"
import { Link2, Check, X } from "lucide-react"
import { Card } from "@/components/ui/card"
import useWalletStore from "@/store/TransactionStore"
import useTransactionStore from "@/store/TransactionStore"

const MetricCard = ({ icon, value, label, isLoading }) => (
  <div className="bg-white p-4 border-b lg:border-b-0 lg:border-r mt-4 ml-2 lg:ml-0">
    <div className="flex items-start gap-4">
      <div
        className={`w-10 h-10 rounded-full flex items-center justify-center ${
          icon === "N" ? "bg-gray-100" : icon === "check" ? "bg-green-100" : icon === "x" ? "bg-red-100" : "bg-gray-100"
        }`}
      >
        {icon === "N" ? (
          <span className="text-lg font-semibold text-gray-700">₦</span>
        ) : icon === "check" ? (
          <Check className="w-5 h-5 text-green-600" />
        ) : icon === "x" ? (
          <X className="w-5 h-5 text-red-600" />
        ) : (
          <div className="w-5 h-5 text-gray-600">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
        )}
      </div>
      <div>
        <div className="text-2xl font-semibold">
          {isLoading ? (
            <div className="h-8 w-24 bg-gray-200 animate-pulse rounded"></div>
          ) : icon === "N" ? (
            `₦${value.toLocaleString()}.00`
          ) : (
            value.toLocaleString()
          )}
        </div>
        <div className="text-sm text-gray-500">{label}</div>
      </div>
    </div>
  </div>
)

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    const data = payload[0]?.payload

    return (
      <div className="bg-white p-4 border rounded-lg shadow-lg">
        <p className="text-sm font-medium mb-2">{data?.fullLabel || label}</p>
        <div className="space-y-1">
          {data?.successful !== undefined && (
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-green-500" />
              <p className="text-sm">Successful: {data.successful?.toLocaleString() || 0}</p>
            </div>
          )}
          {data?.failed !== undefined && (
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-red-500" />
              <p className="text-sm">Failed: {data.failed?.toLocaleString() || 0}</p>
            </div>
          )}
          {data?.totalVolume !== undefined && (
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-blue-500" />
              <p className="text-sm">Volume: ₦{data.totalVolume?.toLocaleString() || 0}</p>
            </div>
          )}
          {data?.totalTransactions !== undefined && (
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-purple-500" />
              <p className="text-sm">Transactions: {data.totalTransactions?.toLocaleString() || 0}</p>
            </div>
          )}
        </div>
      </div>
    )
  }
  return null
}

export const TransactionOverview = () => {
  const [selectedRange, setSelectedRange] = useState("yearly")
  const { 
    transactionStats, 
    transactionOverview, 
    loading, 
    fetchTransactionChartData 
  } = useTransactionStore()

  // Fetch chart data when range changes
  useEffect(() => {
    fetchTransactionChartData(selectedRange)
  }, [selectedRange, fetchTransactionChartData])

  // Transform API data for chart
  const chartData = useMemo(() => {
    const chartArray = transactionOverview?.chart || transactionOverview?.monthly_data || []

    if (!chartArray || chartArray.length === 0) {
      return []
    }

    const monthNameMap = {
      Jan: "January", Feb: "February", Mar: "March", Apr: "April",
      May: "May", Jun: "June", Jul: "July", Aug: "August",
      Sep: "September", Oct: "October", Nov: "November", Dec: "December",
    }

    const monthOrder = {
      Jan: 1, Feb: 2, Mar: 3, Apr: 4, May: 5, Jun: 6,
      Jul: 7, Aug: 8, Sep: 9, Oct: 10, Nov: 11, Dec: 12,
    }

    const range = transactionOverview?.range || "yearly"

    return chartArray.map((item) => {
      const label = item.label ?? item.monthName ?? item.month ?? "Unknown"
      const labelStr = String(label)
      
      const isMonth = monthOrder[labelStr] !== undefined
      const isYear = /^\d{4}$/.test(labelStr)
      const isWeek = range === "weekly"
      const isDay = range === "daily"

      let displayLabel = labelStr
      let fullLabel = labelStr

      if (isMonth) {
        fullLabel = monthNameMap[labelStr] || labelStr
      } else if (isWeek && typeof label === "number") {
        displayLabel = `Wk ${label}`
        fullLabel = `Week ${label}`
      } else if (isDay && typeof label === "number") {
        displayLabel = `Day ${label}`
        fullLabel = `Day ${label}`
      } else if (isYear) {
        fullLabel = `Year ${label}`
      }

      return {
        label: displayLabel,
        fullLabel: fullLabel,
        successful: item.successful || 0,
        failed: item.failed || 0,
        totalVolume: item.totalVolume || 0,
        totalTransactions: item.totalTransactions || 0,
        year: item.year || (isYear ? parseInt(labelStr) : new Date().getFullYear()),
        sortOrder: isMonth 
          ? monthOrder[labelStr] 
          : (typeof label === "number" ? label : parseInt(labelStr) || 0),
      }
    }).sort((a, b) => a.sortOrder - b.sortOrder)
  }, [transactionOverview])

  // Determine what data fields are available for the chart
  const hasSuccessFailedData = useMemo(() => {
    return chartData.some(item => item.successful > 0 || item.failed > 0)
  }, [chartData])

  const hasVolumeData = useMemo(() => {
    return chartData.some(item => item.totalVolume > 0 || item.totalTransactions > 0)
  }, [chartData])

  /* console.log("Chart Data: ", chartData)
  console.log("Transaction Overview Raw: ", transactionOverview) */

  // Calculate metrics from API data
  const metrics = useMemo(() => {
    const stats = transactionStats || {}
    const overview = transactionOverview?.summary || {}
    
    // Calculate totals from chart data if summary not available
    const chartTotals = chartData.reduce((acc, item) => ({
      totalVolume: acc.totalVolume + (item.totalVolume || 0),
      totalTransactions: acc.totalTransactions + (item.totalTransactions || 0),
      successful: acc.successful + (item.successful || 0),
      failed: acc.failed + (item.failed || 0),
    }), { totalVolume: 0, totalTransactions: 0, successful: 0, failed: 0 })

    return [
      {
        icon: "N",
        value: stats.totalRevenue || stats.total_amount_processed || overview.total_amount_processed || chartTotals.totalVolume || 0,
        label: "Total Revenue",
      },
      {
        icon: "document",
        value: stats.totalTransactions || stats.total_transaction_count || overview.total_transactions || chartTotals.totalTransactions || 0,
        label: "Total Transactions",
      },
      {
        icon: "check",
        value: stats.successfulTransactions || stats.success_transaction_count || overview.total_successful || chartTotals.successful || 0,
        label: "Successful Transactions",
      },
      {
        icon: "x",
        value: stats.failedTransactions || stats.failed_transaction_count || overview.total_failed || chartTotals.failed || 0,
        label: "Failed Transactions",
      },
    ]
  }, [transactionStats, transactionOverview, chartData])

  return (
    <div className="space-y-6 p-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.map((metric, index) => (
          <MetricCard key={index} {...metric} isLoading={loading} />
        ))}
      </div>

      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-semibold">Transaction overview</h2>
            <Link2 className="w-4 h-4 text-gray-400" />
          </div>
          <div className="flex flex-wrap justify-end items-center gap-6">
            {/* Legend - shows based on available data */}
            <div className="flex items-center gap-6">
              {hasSuccessFailedData && (
                <>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-green-500" />
                    <span className="text-sm text-gray-600">Successful</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-500" />
                    <span className="text-sm text-gray-600">Failed</span>
                  </div>
                </>
              )}
              {hasVolumeData && !hasSuccessFailedData && (
                <>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-blue-500" />
                    <span className="text-sm text-gray-600">Volume</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-purple-500" />
                    <span className="text-sm text-gray-600">Transactions</span>
                  </div>
                </>
              )}
            </div>
            <select
              className="px-3 py-2 border rounded-lg text-sm"
              value={selectedRange}
              onChange={(e) => setSelectedRange(e.target.value)}
            >
              <option value="yearly">Yearly</option>
              <option value="monthly">Monthly</option>
              <option value="weekly">Weekly</option>
              <option value="daily">Daily</option>
            </select>
          </div>
        </div>

        <div className="h-[300px]">
          {loading ? (
            <div className="flex items-center justify-center h-full">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
            </div>
          ) : chartData.length === 0 ? (
            <div className="flex items-center justify-center h-full text-gray-500">
              <p>No transaction data available</p>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="label" axisLine={false} tickLine={false} />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tickFormatter={(value) => `${value >= 1000 ? `${value / 1000}k` : value}`}
                />
                <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(0, 0, 0, 0.05)" }} />
                
                {/* Render bars based on available data */}
                {hasSuccessFailedData ? (
                  <>
                    <Bar dataKey="successful" stackId="a" fill="#22C55E" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="failed" stackId="a" fill="#EF4444" radius={[4, 4, 0, 0]} />
                  </>
                ) : hasVolumeData ? (
                  <>
                    <Bar dataKey="totalVolume" fill="#3B82F6" radius={[4, 4, 0, 0]} name="Volume" />
                  </>
                ) : null}
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </Card>
    </div>
  )
}