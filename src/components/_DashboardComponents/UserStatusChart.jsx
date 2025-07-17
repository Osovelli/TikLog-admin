import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"

export const UserStatusChart = ({ data }) => {
  if (!data) return null

  // Transform the API data into chart format
  const transformDataForChart = () => {
    const chartData = []

    // Admins
    if (data.admins) {
      chartData.push({
        category: "Admins",
        active: data.admins.active || 0,
        inactive: data.admins.inactive || 0,
        total: data.admins.total || 0,
      })
    }

    // Customers
    if (data.customers) {
      chartData.push({
        category: "Customers",
        active: data.customers.active || 0,
        inactive: data.customers.inactive || 0,
        pending: data.customers.pending || 0,
        total: data.customers.total || 0,
      })
    }

    // Riders
    if (data.riders) {
      chartData.push({
        category: "Riders",
        verified: data.riders.verified || 0,
        pending: data.riders.pending || 0,
        unverified: data.riders.unverified || 0,
        total: data.riders.total || 0,
      })
    }

    // Vendors
    if (data.vendors) {
      chartData.push({
        category: "Vendors",
        approved: data.vendors.approved || 0,
        pending: data.vendors.pending || 0,
        unapproved: data.vendors.unapproved || 0,
        total: data.vendors.total || 0,
      })
    }

    return chartData
  }

  const chartData = transformDataForChart()

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const total = payload.reduce((sum, entry) => sum + (entry.value || 0), 0)

      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-semibold text-gray-900 mb-2">{label}</p>
          <p className="text-sm text-gray-600 mb-2">Total: {total}</p>
          {payload.map((entry, index) => (
            <p key={index} className="text-sm" style={{ color: entry.color }}>
              {`${entry.name}: ${entry.value}`}
            </p>
          ))}
        </div>
      )
    }
    return null
  }

  return (
    <div className="h-64">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis dataKey="category" tick={{ fontSize: 12 }} stroke="#666" />
          <YAxis tick={{ fontSize: 12 }} stroke="#666" />
          <Tooltip content={<CustomTooltip />} />
          <Legend wrapperStyle={{ fontSize: "12px" }} />

          {/* Different bars for different status types */}
          <Bar dataKey="active" stackId="a" fill="#10b981" name="Active" />
          <Bar dataKey="inactive" stackId="a" fill="#ef4444" name="Inactive" />
          <Bar dataKey="verified" stackId="a" fill="#3b82f6" name="Verified" />
          <Bar dataKey="pending" stackId="a" fill="#f59e0b" name="Pending" />
          <Bar dataKey="unverified" stackId="a" fill="#6b7280" name="Unverified" />
          <Bar dataKey="approved" stackId="a" fill="#059669" name="Approved" />
          <Bar dataKey="unapproved" stackId="a" fill="#dc2626" name="Unapproved" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
