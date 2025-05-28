import React from "react";
import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, Chip } from "@heroui/react";
import { Website } from "../hooks/use-ping-monitor";

interface WebsiteStatistics {
  website: Website;
  pingCount: number;
  avgResponseTime: number | null;
  minResponseTime: number | null;
  maxResponseTime: number | null;
  successRate: number | null;
}

interface PingResponseTimeTableProps {
  statistics: WebsiteStatistics[];
}

export function PingResponseTimeTable({ statistics }: PingResponseTimeTableProps) {
  if (statistics.length === 0) {
    return (
      <div className="text-center py-8 text-default-500">
        <p>No ping statistics available yet.</p>
      </div>
    );
  }
  
  return (
    <Table removeWrapper aria-label="Website ping statistics">
      <TableHeader>
        <TableColumn>WEBSITE</TableColumn>
        <TableColumn>PING COUNT</TableColumn>
        <TableColumn>AVG RESPONSE</TableColumn>
        <TableColumn>MIN RESPONSE</TableColumn>
        <TableColumn>MAX RESPONSE</TableColumn>
        <TableColumn>SUCCESS RATE</TableColumn>
      </TableHeader>
      <TableBody>
        {statistics.map((stat) => (
          <TableRow key={stat.website.id}>
            <TableCell>
              <div>
                <p className="font-medium">{stat.website.name}</p>
                <p className="text-default-400 text-xs truncate">{stat.website.url}</p>
              </div>
            </TableCell>
            <TableCell>{stat.pingCount}</TableCell>
            <TableCell>
              {stat.avgResponseTime !== null ? `${stat.avgResponseTime} ms` : "-"}
            </TableCell>
            <TableCell>
              {stat.minResponseTime !== null ? `${stat.minResponseTime} ms` : "-"}
            </TableCell>
            <TableCell>
              {stat.maxResponseTime !== null ? `${stat.maxResponseTime} ms` : "-"}
            </TableCell>
            <TableCell>
              {stat.successRate !== null ? (
                <Chip
                  color={stat.successRate > 90 ? "success" : stat.successRate > 70 ? "warning" : "danger"}
                  size="sm"
                  variant="flat"
                >
                  {stat.successRate}%
                </Chip>
              ) : (
                "-"
              )}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}