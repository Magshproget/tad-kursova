import React from "react";
import { Card, CardBody, CardHeader, Divider, Progress } from "@heroui/react";
import { Website, PingResult } from "../hooks/use-ping-monitor";
import { format } from "date-fns";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from "recharts";

interface WebsiteDetailsProps {
  website: Website;
  pingResults: PingResult[];
}

export function WebsiteDetails({ website, pingResults }: WebsiteDetailsProps) {
  // Calculate statistics
  const successResults = pingResults.filter(r => r.status === "success");
  const errorResults = pingResults.filter(r => r.status === "error");
  
  const avgResponseTime = successResults.length > 0
    ? Math.round(successResults.reduce((sum, r) => sum + r.responseTime, 0) / successResults.length)
    : 0;
  
  const successRate = pingResults.length > 0
    ? Math.round((successResults.length / pingResults.length) * 100)
    : 0;
  
  // Group response times by hour
  const responseTimesByHour = React.useMemo(() => {
    const hourlyData: Record<string, number[]> = {};
    
    successResults.forEach(result => {
      const hour = format(result.timestamp, "HH:00");
      if (!hourlyData[hour]) {
        hourlyData[hour] = [];
      }
      hourlyData[hour].push(result.responseTime);
    });
    
    return Object.entries(hourlyData).map(([hour, times]) => ({
      hour,
      avgResponseTime: Math.round(times.reduce((sum, time) => sum + time, 0) / times.length),
      count: times.length
    })).slice(-12); // Last 12 hours
  }, [successResults]);
  
  // Status distribution data
  const statusDistribution = [
    { name: "Success", value: successResults.length },
    { name: "Error", value: errorResults.length }
  ];
  
  const COLORS = ["#17c964", "#f31260"];
  
  // Status code distribution chart
  const statusCodeDistribution = React.useMemo(() => {
    const statusCodes: Record<string, number> = {};
    
    pingResults.forEach(result => {
      const statusCode = result.statusCode?.toString() || "Unknown";
      statusCodes[statusCode] = (statusCodes[statusCode] || 0) + 1;
    });
    
    return Object.entries(statusCodes).map(([code, count]) => ({
      name: code,
      value: count,
      color: 
        code === "200" ? "#17c964" :
        code.startsWith("3") ? "#7828c8" :
        code.startsWith("4") ? "#f5a524" :
        code.startsWith("5") ? "#f31260" : "#71717a"
    }));
  }, [pingResults]);
  
  if (pingResults.length === 0) {
    return (
      <Card>
        <CardHeader>
          <h2 className="text-xl font-medium">Website Details: {website.name}</h2>
        </CardHeader>
        <Divider />
        <CardBody>
          <div className="text-center py-8 text-default-500">
            <p>No ping data available yet for this website.</p>
          </div>
        </CardBody>
      </Card>
    );
  }
  
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <h2 className="text-xl font-medium">Website Details: {website.name}</h2>
        </CardHeader>
        <Divider />
        <CardBody>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-medium mb-4">Website Information</h3>
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-default-500">URL</p>
                  <p className="font-medium">{website.url}</p>
                </div>
                <div>
                  <p className="text-sm text-default-500">Added On</p>
                  <p className="font-medium">{format(website.createdAt, "MMM d, yyyy HH:mm:ss")}</p>
                </div>
                <div>
                  <p className="text-sm text-default-500">Total Pings</p>
                  <p className="font-medium">{pingResults.length}</p>
                </div>
                <div>
                  <p className="text-sm text-default-500">Success Rate</p>
                  <div className="mt-1">
                    <Progress 
                      value={successRate} 
                      color={successRate > 90 ? "success" : successRate > 70 ? "warning" : "danger"}
                      showValueLabel
                      className="max-w-md"
                    />
                  </div>
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-medium mb-4">Status Distribution</h3>
              <div className="h-[200px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={statusDistribution}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {statusDistribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => [`${value} pings`, '']} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </CardBody>
      </Card>
      
      <Card>
        <CardHeader>
          <h2 className="text-xl font-medium">Response Time by Hour</h2>
        </CardHeader>
        <Divider />
        <CardBody>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={responseTimesByHour}
                margin={{ top: 5, right: 30, left: 20, bottom: 25 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis 
                  dataKey="hour" 
                  angle={-45} 
                  textAnchor="end" 
                  height={60}
                  tick={{ fontSize: 12 }}
                />
                <YAxis 
                  label={{ 
                    value: 'Avg Response Time (ms)', 
                    angle: -90, 
                    position: 'insideLeft',
                    style: { textAnchor: 'middle' }
                  }}
                />
                <Tooltip 
                  formatter={(value: number) => [`${value} ms`, 'Avg Response Time']}
                  labelFormatter={(label) => `Hour: ${label}`}
                />
                <Legend />
                <Bar 
                  dataKey="avgResponseTime" 
                  name="Avg Response Time" 
                  fill="#006FEE" 
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardBody>
      </Card>
      
      <div className="mt-8">
        <h3 className="text-lg font-medium mb-4">Status Code Distribution</h3>
        <div className="h-[250px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={statusCodeDistribution}
              margin={{ top: 5, right: 30, left: 20, bottom: 25 }}
              layout="vertical"
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis type="number" />
              <YAxis 
                dataKey="name" 
                type="category"
                tick={{ fontSize: 12 }}
              />
              <Tooltip 
                formatter={(value: number) => [`${value} pings`, '']}
              />
              <Legend />
              <Bar 
                dataKey="value" 
                name="Status Count" 
                radius={[0, 4, 4, 0]}
              >
                {statusCodeDistribution.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}