import React from "react";
import { Button, Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, Chip, Tooltip, Badge, addToast } from "@heroui/react";
import { Icon } from "@iconify/react";
import { format } from "date-fns";
import { Website, PingResult } from "../hooks/use-ping-monitor";

interface WebsiteListProps {
  websites: Website[];
  pingResults: PingResult[];
  isLoading: boolean;
  onPing: (id: string) => void;
  onPingAll: () => void;
  onRemove: (id: string) => void;
  error: string | null;
  selectedWebsiteId: string | null;
  onSelectWebsite: (id: string | null) => void;
}

export function WebsiteList({ 
  websites, 
  pingResults, 
  isLoading, 
  onPing, 
  onPingAll, 
  onRemove,
  error,
  selectedWebsiteId,
  onSelectWebsite
}: WebsiteListProps) {
  // Get the latest ping result for each website
  const getLatestPingResult = (websiteId: string) => {
    return pingResults
      .filter(result => result.websiteId === websiteId)
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())[0];
  };
  
  return (
    <div className="space-y-4">
      {error && (
        <div className="p-3 bg-danger-50 text-danger-600 rounded-medium text-sm mb-4">
          <p><strong>Error:</strong> {error}</p>
          <p className="text-xs mt-1">Note: This demo uses a CORS proxy which may have usage limitations.</p>
        </div>
      )}
      
      <div className="flex justify-end mb-4">
        <Button
          color="primary"
          onPress={() => {
            onPingAll();
            if (websites.length > 0) {
              addToast({
                title: "Pinging All Websites",
                description: `Pinging ${websites.length} website(s)...`,
                color: "primary"
              });
            }
          }}
          isLoading={isLoading}
          isDisabled={websites.length === 0}
          startContent={<Icon icon="lucide:refresh-cw" />}
        >
          Ping All Websites
        </Button>
      </div>
      
      {websites.length === 0 ? (
        <div className="text-center py-12 text-default-500">
          <Icon icon="lucide:globe" className="mx-auto mb-4 text-4xl" />
          <p>No websites added yet. Add your first website to start monitoring.</p>
        </div>
      ) : (
        <Table removeWrapper aria-label="Monitored websites" selectionMode="single" 
          selectedKeys={selectedWebsiteId ? [selectedWebsiteId] : []}
          onSelectionChange={(keys) => {
            const selectedKey = Array.from(keys as Set<string>)[0];
            onSelectWebsite(selectedKey || null);
          }}
        >
          <TableHeader>
            <TableColumn>WEBSITE</TableColumn>
            <TableColumn>LAST PING</TableColumn>
            <TableColumn>RESPONSE TIME</TableColumn>
            <TableColumn>STATUS</TableColumn>
            <TableColumn>ACTIONS</TableColumn>
          </TableHeader>
          <TableBody>
            {websites.map(website => {
              const latestPing = getLatestPingResult(website.id);
              
              return (
                <TableRow key={website.id}>
                  <TableCell>
                    <div>
                      <p className="font-medium">{website.name}</p>
                      <p className="text-default-400 text-xs truncate">{website.url}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    {latestPing ? (
                      <span className="text-sm">
                        {format(latestPing.timestamp, "MMM d, yyyy HH:mm:ss")}
                      </span>
                    ) : (
                      <span className="text-default-400 text-sm">Never</span>
                    )}
                  </TableCell>
                  <TableCell>
                    {latestPing ? (
                      <span className="text-sm">
                        {latestPing.responseTime} ms
                      </span>
                    ) : (
                      <span className="text-default-400 text-sm">-</span>
                    )}
                  </TableCell>
                  <TableCell>
                    {latestPing ? (
                      latestPing.status === "success" ? (
                        <Chip color="success" size="sm" variant="flat">
                          {latestPing.statusCode === 200 ? "OK" : latestPing.statusCode}
                        </Chip>
                      ) : (
                        <Tooltip content={latestPing.error || `Error ${latestPing.statusCode || ""}`}>
                          <Chip color={
                            latestPing.statusCode && latestPing.statusCode >= 500 ? "danger" :
                            latestPing.statusCode && latestPing.statusCode >= 400 ? "warning" : "danger"
                          } size="sm" variant="flat">
                            {latestPing.statusCode || "Error"}
                          </Chip>
                        </Tooltip>
                      )
                    ) : (
                      <Chip color="default" size="sm" variant="flat">
                        Not Pinged
                      </Chip>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button
                        isIconOnly
                        size="sm"
                        variant="flat"
                        color="primary"
                        onPress={() => onPing(website.id)}
                        isLoading={isLoading}
                      >
                        <Icon icon="lucide:refresh-cw" />
                      </Button>
                      <Button
                        isIconOnly
                        size="sm"
                        variant="flat"
                        color="danger"
                        onPress={() => onRemove(website.id)}
                      >
                        <Icon icon="lucide:trash-2" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      )}
    </div>
  );
}