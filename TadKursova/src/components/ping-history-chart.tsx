import React from "react";
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer 
} from "recharts";
import { format } from "date-fns";
import { PingResult, Website } from "../hooks/use-ping-monitor";

interface PingHistoryChartProps {
  website: Website;
  pingResults: PingResult[];
}

// Generate a unique color for each website
const getWebsiteColor = (index: number) => {
  const colors = [
    "#006FEE", // primary
    "#17C964", // success
    "#F5A524", // warning
    "#F31260", // danger
    "#7828C8", // secondary
    "#0072F5",
    "#10B981",
    "#F59E0B",
    "#EF4444",
    "#8B5CF6"
  ];
  
  return colors[index % colors.length];
};

export function PingHistoryChart({ website, pingResults }: PingHistoryChartProps) {
  // Prepare chart data
  const chartData = React.useMemo(() => {
    // Sort results by timestamp
    const sortedResults = [...pingResults].sort((a, b) => 
      a.timestamp.getTime() - b.timestamp.getTime()
    );
    
    // Create data points for each timestamp
    return sortedResults.map(result => ({
      timestamp: result.timestamp.getTime(),
      formattedTime: format(result.timestamp, "HH:mm:ss"),
      responseTime: result.status === "success" ? result.responseTime : null,
      status: result.status,
      statusCode: result.statusCode
    }));
  }, [pingResults]);
  
  // Only show the last 20 data points for readability
  const displayData = chartData.slice(-20);
  
  if (displayData.length === 0) {
    return (
      <div className="text-center py-8 text-default-500">
        <p>No successful ping data available yet.</p>
      </div>
    );
  }
  
  return (
    <div className="h-[400px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={displayData}
          margin={{ top: 5, right: 30, left: 20, bottom: 25 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis 
            dataKey="formattedTime" 
            angle={-45} 
            textAnchor="end" 
            height={60}
            tick={{ fontSize: 12 }}
          />
          <YAxis 
            label={{ 
              value: 'Response Time (ms)', 
              angle: -90, 
              position: 'insideLeft',
              style: { textAnchor: 'middle' }
            }}
          />
          <Tooltip 
            formatter={(value: number) => [`${value} ms`, 'Response Time']}
            labelFormatter={(label) => `Time: ${label}`}
          />
          <Legend />
          <Line
            type="monotone"
            dataKey="responseTime"
            name={website.name}
            stroke={getWebsiteColor(0)}
            activeDot={{ r: 8 }}
            connectNulls
            strokeWidth={2}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}