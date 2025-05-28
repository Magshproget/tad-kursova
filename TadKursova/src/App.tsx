import React from "react";
import { Card, CardBody, CardHeader, Divider, ToastProvider, Button } from "@heroui/react";
import { WebsiteList } from "./components/website-list";
import { AddWebsiteForm } from "./components/add-website-form";
import { PingStatistics } from "./components/ping-statistics";
import { usePingMonitor } from "./hooks/use-ping-monitor";
import { Icon } from "@iconify/react";
import { WebsiteDetails } from "./components/website-details";

export default function App() {
  const {
    websites,
    pingResults,
    isLoading,
    addWebsite,
    removeWebsite,
    pingWebsite,
    pingAllWebsites,
    error
  } = usePingMonitor();

  const [selectedWebsiteId, setSelectedWebsiteId] = React.useState<string | null>(null);
  const selectedWebsite = React.useMemo(() => {
    return websites.find(site => site.id === selectedWebsiteId);
  }, [websites, selectedWebsiteId]);

  // Function to export data as JSON
  const exportDataAsJson = () => {
    const data = {
      websites,
      pingResults
    };
    
    const jsonString = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonString], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement("a");
    a.href = url;
    a.download = `website-monitoring-data-${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    addToast({
      title: "Data Exported",
      description: "Monitoring data has been exported as JSON",
      color: "success"
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <ToastProvider />
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl md:text-3xl font-semibold">Website Ping Monitor</h1>
          <div className="flex gap-3">
            <Button 
              variant="flat" 
              color="primary"
              startContent={<Icon icon="lucide:log-in" />}
            >
              Login
            </Button>
            <Button 
              color="primary"
              startContent={<Icon icon="lucide:user-plus" />}
            >
              Sign Up
            </Button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-3">
            <Card className="mb-6">
              <CardHeader>
                <h2 className="text-xl font-medium">Add Website</h2>
              </CardHeader>
              <Divider />
              <CardBody>
                <AddWebsiteForm onAddWebsite={addWebsite} />
              </CardBody>
            </Card>
          </div>

          <div className="lg:col-span-3">
            <Card className="mb-6">
              <CardHeader className="flex justify-between items-center">
                <h2 className="text-xl font-medium">Monitored Websites</h2>
                <Button 
                  size="sm" 
                  color="primary" 
                  variant="flat"
                  startContent={<Icon icon="lucide:download" />}
                  onPress={exportDataAsJson}
                >
                  Export Data as JSON
                </Button>
              </CardHeader>
              <Divider />
              <CardBody>
                <WebsiteList 
                  websites={websites}
                  pingResults={pingResults}
                  isLoading={isLoading}
                  onPing={pingWebsite}
                  onPingAll={pingAllWebsites}
                  onRemove={removeWebsite}
                  error={error}
                  selectedWebsiteId={selectedWebsiteId}
                  onSelectWebsite={setSelectedWebsiteId}
                />
              </CardBody>
            </Card>
          </div>
          
          <div className="lg:col-span-3">
            {selectedWebsite ? (
              <>
                <PingStatistics 
                  pingResults={pingResults.filter(r => r.websiteId === selectedWebsiteId)} 
                  website={selectedWebsite} 
                />
                
                <WebsiteDetails 
                  website={selectedWebsite}
                  pingResults={pingResults.filter(r => r.websiteId === selectedWebsiteId)}
                />
              </>
            ) : (
              <Card>
                <CardBody>
                  <div className="text-center py-8 text-default-500">
                    <Icon icon="lucide:mouse-pointer-click" className="mx-auto mb-4 text-4xl" />
                    <p>Select a website from the list above to view detailed statistics.</p>
                  </div>
                </CardBody>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}