import { useState, useMemo, useEffect } from "react"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip } from "recharts"
import { Link2, Check, X } from "lucide-react"
import { Card } from "@/components/ui/card"
import useWalletStore from "@/store/WalletStore"

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
    // Get the full month name from the payload data
    const monthName = payload[0]?.payload?.monthName || label
    const year = payload[0]?.payload?.year

    return (
      <div className="bg-white p-4 border rounded-lg shadow-lg">
        <p className="text-sm font-medium mb-2">
          {monthName} {year && `${year}`}
        </p>
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-green-500" />
            <p className="text-sm">Successful: {payload[0]?.value?.toLocaleString() || 0}</p>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-red-500" />
            <p className="text-sm">Failed: {payload[1]?.value?.toLocaleString() || 0}</p>
          </div>
        </div>
      </div>
    )
  }
  return null
}

export const TransactionOverview = () => {
  const [selectedMonths, setSelectedMonths] = useState(12)
  const { walletStats, transactionOverview, loading, fetchWalletStats, fetchTransactionOverview } = useWalletStore()

  // Fetch transaction overview when period changes
  useEffect(() => {
    const periodMap = {
      12: "12",
      6: "6",
      3: "3",
    }
    fetchTransactionOverview({ period: periodMap[selectedMonths] })
  }, [selectedMonths, fetchTransactionOverview])

  // Transform API data for chart
  const chartData = useMemo(() => {
    if (!transactionOverview?.monthly_data) {
      return []
    }

    // Month abbreviation to full name mapping
    const monthNameMap = {
      Jan: "January",
      Feb: "February",
      Mar: "March",
      Apr: "April",
      May: "May",
      Jun: "June",
      Jul: "July",
      Aug: "August",
      Sep: "September",
      Oct: "October",
      Nov: "November",
      Dec: "December",
    }

    // Month order mapping for sorting (0-based index)
    const monthOrder = {
      Jan: 1,
      Feb: 2,
      Mar: 3,
      Apr: 4,
      May: 5,
      Jun: 6,
      Jul: 7,
      Aug: 8,
      Sep: 9,
      Oct: 10,
      Nov: 11,
      Dec: 12,
    }

    return transactionOverview?.monthly_data
      .map((monthData) => {
        const monthAbbr = monthData.monthName || monthData.month || "Jan"
        return {
          month: monthAbbr, // Use abbreviated name for chart display
          successful: monthData.successful || 0,
          failed: monthData.failed || 0,
          monthName: monthNameMap[monthAbbr] || "Unknown", // Full name for tooltip
          year: monthData.year || new Date().getFullYear(),
          sortOrder: monthOrder[monthAbbr] !== undefined ? monthOrder[monthAbbr] : 99,
          // Create a sortKey for proper chronological sorting
          sortKey: `${monthData.year || new Date().getFullYear()}-${String(monthOrder[monthAbbr] || 99).padStart(2, "0")}`,
        }
      })
      .sort((a, b) => {
        // Sort by the sortKey which combines year and month order
        return a.sortKey.localeCompare(b.sortKey)
      })
  }, [transactionOverview])
/* 
  const allData = [
    { month: "J", successful: 15000, failed: 2000 },
    { month: "F", successful: 12000, failed: 1500 },
    { month: "M", successful: 18000, failed: 1000 },
    { month: "A", successful: 14000, failed: 2000 },
    { month: "M", successful: 16000, failed: 2500 },
    { month: "J", successful: 13000, failed: 2000 },
    { month: "J", successful: 12000, failed: 5000 },
    { month: "A", successful: 13000, failed: 1500 },
    { month: "S", successful: 15000, failed: 500 },
    { month: "O", successful: 14000, failed: 2000 },
    { month: "N", successful: 10000, failed: 1000 },
    { month: "D", successful: 14000, failed: 0 },
  ]

  const data = useMemo(() => {
    return allData.slice(-selectedMonths)
  }, [selectedMonths]) */

  //console.log("OLD DATA: ", data)
  console.log("NEW DATA: ", chartData)

  // Calculate metrics from API data
  const metrics = useMemo(() => {
    const stats = walletStats || {}
    const overview = transactionOverview?.summary || {}

    return [
      {
        icon: "N",
        value: stats.total_amount_processed || overview.total_amount_processed || 0,
        label: "Total Amount Processed",
      },
      {
        icon: "document",
        value: stats.total_transaction_count || overview.total_transactions || 0,
        label: "Total Transactions",
      },
      {
        icon: "check",
        value: stats.success_transaction_count || overview.total_successful || 0,
        label: "Successful Transactions",
      },
      {
        icon: "x",
        value: stats.failed_transaction_count || overview.total_failed || 0,
        label: "Failed Transactions",
      },
    ]
  }, [walletStats, transactionOverview])

  const handlePeriodChange = (months) => {
    setSelectedMonths(months)
  }

  return (
    <div className="space-y-6">
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
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-green-500" />
                <span className="text-sm text-gray-600">Successful</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500" />
                <span className="text-sm text-gray-600">Failed</span>
              </div>
            </div>
            <select
              className="px-3 py-2 border rounded-lg text-sm"
              value={selectedMonths}
              onChange={(e) => setSelectedMonths(Number(e.target.value))}
            >
              <option value={12}>12 Months</option>
              <option value={6}>6 Months</option>
              <option value={3}>3 Months</option>
            </select>
          </div>
        </div>

        <div className="h-[300px]">
          {loading ? (
            <div className="flex items-center justify-center h-full">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }} stackOffset="none">
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="month" axisLine={false} tickLine={false} />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tickFormatter={(value) => `${value >= 1000 ? `${value / 1000}k` : value}`}
                />
                <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(0, 0, 0, 0.05)" }} />
                <Bar dataKey="successful" stackId="a" fill="#22C55E" radius={[4, 4, 0, 0]} />
                <Bar dataKey="failed" stackId="a" fill="#EF4444" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </Card>
    </div>
  )
}
