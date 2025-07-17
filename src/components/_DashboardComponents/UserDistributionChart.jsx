import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts"

export const UserDistributionChart = ({ data }) => {
  if (!data) return null

  // Transform the API data into chart format
  const transformDataForPieChart = () => {
    return [
      {
        name: "Customers",
        value: data.customers || 0,
        color: "#3b82f6",
      },
      {
        name: "Riders",
        value: data.riders || 0,
        color: "#10b981",
      },
      {
        name: "Admin Users",
        value: data.adminUsers || 0,
        color: "#f59e0b",
      },
      {
        name: "Vendors",
        value: data.vendors || 0,
        color: "#ef4444",
      },
    ].filter((item) => item.value > 0) // Only show categories with data
  }

  const chartData = transformDataForPieChart()
  const totalUsers = chartData.reduce((sum, item) => sum + item.value, 0)

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0]
      const percentage = ((data.value / totalUsers) * 100).toFixed(1)

      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-semibold text-gray-900">{data.name}</p>
          <p className="text-sm text-gray-600">
            {data.value} users ({percentage}%)
          </p>
        </div>
      )
    }
    return null
  }

  const CustomLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }) => {
    if (percent < 0.05) return null // Don't show labels for very small slices

    const RADIAN = Math.PI / 180
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5
    const x = cx + radius * Math.cos(-midAngle * RADIAN)
    const y = cy + radius * Math.sin(-midAngle * RADIAN)

    return (
      <text
        x={x}
        y={y}
        fill="white"
        textAnchor={x > cx ? "start" : "end"}
        dominantBaseline="central"
        fontSize="12"
        fontWeight="bold"
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    )
  }

  // Show empty state if no data
  if (chartData.length === 0) {
    return (
      <div className="h-64 flex items-center justify-center">
        <div className="text-center">
          <div className="text-gray-400 mb-2">
            <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
              />
            </svg>
          </div>
          <p className="text-gray-500 text-sm">No user data available</p>
        </div>
      </div>
    )
  }

  return (
    <div className="h-64">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={CustomLabel}
            outerRadius={80}
            fill="#8884d8"
            dataKey="value"
          >
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
          <Legend
            verticalAlign="bottom"
            height={36}
            formatter={(value, entry) => (
              <span style={{ color: entry.color }}>
                {value} ({entry.payload.value})
              </span>
            )}
          />
        </PieChart>
      </ResponsiveContainer>

      {/* Summary stats */}
      <div className="mt-1 text-center">
        <p className="text-sm text-gray-600">
          Total Users: <span className="font-semibold text-gray-900">{totalUsers}</span>
        </p>
      </div>
    </div>
  )
}
