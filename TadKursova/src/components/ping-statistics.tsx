import React from "react";
import { Card, CardBody, CardHeader, Divider, Tabs, Tab } from "@heroui/react";
import { PingResult, Website } from "../hooks/use-ping-monitor";
import { PingHistoryChart } from "./ping-history-chart";
import { PingResponseTimeTable } from "./ping-response-time-table";

interface PingStatisticsProps {
  pingResults: PingResult[];
  website: Website;
}

export function PingStatistics({ pingResults, website }: PingStatisticsProps) {
  const [selectedTab, setSelectedTab] = React.useState<string>("chart");
  
  // Calculate statistics for the selected website
  const statistics = React.useMemo(() => {
    const successResults = pingResults.filter(r => r.status === "success");
    
    const avgResponseTime = successResults.length > 0
      ? Math.round(successResults.reduce((sum, r) => sum + r.responseTime, 0) / successResults.length)
      : null;
    
    const minResponseTime = successResults.length > 0
      ? Math.min(...successResults.map(r => r.responseTime))
      : null;
      
    const maxResponseTime = successResults.length > 0
      ? Math.max(...successResults.map(r => r.responseTime))
      : null;
    
    const successRate = pingResults.length > 0
      ? Math.round((successResults.length / pingResults.length) * 100)
      : null;
    
    return {
      website,
      pingCount: pingResults.length,
      avgResponseTime,
      minResponseTime,
      maxResponseTime,
      successRate
    };
  }, [pingResults, website]);
  
  if (pingResults.length === 0) {
    return (
      <Card className="mb-6">
        <CardHeader>
          <h2 className="text-xl font-medium">Ping Statistics: {website.name}</h2>
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
    <Card className="mb-6">
      <CardHeader>
        <h2 className="text-xl font-medium">Ping Statistics: {website.name}</h2>
      </CardHeader>
      <Divider />
      <CardBody>
        <Tabs 
          selectedKey={selectedTab} 
          onSelectionChange={(key) => setSelectedTab(key as string)}
          aria-label="Ping statistics views"
          className="mb-4"
        >
          <Tab key="chart" title="Response Time Chart">
            <PingHistoryChart 
              website={website}
              pingResults={pingResults}
            />
          </Tab>
          <Tab key="stats" title="Response Time Stats">
            <PingResponseTimeTable statistics={[statistics]} />
          </Tab>
        </Tabs>
      </CardBody>
    </Card>
  );
}