import React, { useState, useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip } from 'recharts';
import { Link2, Check, X } from 'lucide-react';
import { Card } from "@/components/ui/card"

const MetricCard = ({ icon, value, label }) => (
  <div className="bg-white p-4 border-b lg:border-b-0 lg:border-r mt-4 ml-2 lg:ml-0">
    <div className="flex items-start gap-4">
      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
        icon === 'N' ? 'bg-gray-100' :
        icon === 'check' ? 'bg-green-100' :
        icon === 'x' ? 'bg-red-100' :
        'bg-gray-100'
      }`}>
        {icon === 'N' ? (
          <span className="text-lg font-semibold text-gray-700">₦</span>
        ) : icon === 'check' ? (
          <Check className="w-5 h-5 text-green-600" />
        ) : icon === 'x' ? (
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
          {icon === 'N' ? `₦${value.toLocaleString()}.00` : value.toLocaleString()}
        </div>
        <div className="text-sm text-gray-500">{label}</div>
      </div>
    </div>
  </div>
);

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-4 border rounded-lg shadow-lg">
        <p className="text-sm font-medium mb-2">{label}</p>
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-green-500" />
            <p className="text-sm">
              Successful: {payload[0].value.toLocaleString()}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-red-500" />
            <p className="text-sm">
              Failed: {payload[1].value.toLocaleString()}
            </p>
          </div>
        </div>
      </div>
    );
  }
  return null;
};

export const TransactionOverview = () => {
  const [selectedMonths, setSelectedMonths] = useState(12);
  
  const allData = [
    { month: 'J', successful: 15000, failed: 2000 },
    { month: 'F', successful: 12000, failed: 1500 },
    { month: 'M', successful: 18000, failed: 1000 },
    { month: 'A', successful: 14000, failed: 2000 },
    { month: 'M', successful: 16000, failed: 2500 },
    { month: 'J', successful: 13000, failed: 2000 },
    { month: 'J', successful: 12000, failed: 5000 },
    { month: 'A', successful: 13000, failed: 1500 },
    { month: 'S', successful: 15000, failed: 500 },
    { month: 'O', successful: 14000, failed: 2000 },
    { month: 'N', successful: 10000, failed: 1000 },
    { month: 'D', successful: 14000, failed: 0 },
  ];

  const data = useMemo(() => {
    return allData.slice(-selectedMonths);
  }, [selectedMonths]);

  const metrics = [
    { icon: 'N', value: 123096000, label: 'Total Amount Processed' },
    { icon: 'document', value: 1254, label: 'Total Transactions' },
    { icon: 'check', value: 1000, label: 'Successful Transactions' },
    { icon: 'x', value: 254, label: 'Failed Transactions' },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.map((metric, index) => (
          <MetricCard key={index} {...metric} />
        ))}
      </div>

      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-semibold">Transaction overview</h2>
            <Link2 className="w-4 h-4 text-gray-400" />
          </div>
          <div className="flex items-center gap-6">
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
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={data}
              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              stackOffset="none"
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis 
                dataKey="month" 
                axisLine={false}
                tickLine={false}
              />
              <YAxis 
                axisLine={false}
                tickLine={false}
                ticks={[0, 5000, 10000, 15000, 20000]}
                tickFormatter={(value) => `${value/1000}k`}
              />
              <Tooltip 
                content={<CustomTooltip />}
                cursor={{ fill: 'rgba(0, 0, 0, 0.05)' }}
              />
              <Bar dataKey="successful" stackId="a" fill="#22C55E" radius={[4, 4, 0, 0]} />
              <Bar dataKey="failed" stackId="a" fill="#EF4444" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>
    </div>
  );
};