import React from "react";
import { PageHeader } from "@/components/ui/page-header";
import { MetricCard } from "@/components/ui/metric-card";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { StatusDot } from "@/components/ui/status-dot";
import {
  TwitterIcon,
  YoutubeIcon,
  NewsletterIcon,
  AnalyticsIcon,
  TrendingUpIcon,
  TrendingDownIcon,
} from "@/components/ui/icons";

export default function AnalyticsPage() {
  const tableData = [
    {
      channel: "Twitter / X",
      icon: TwitterIcon,
      impressions: "840.4K",
      ctr: "4.82%",
      conversion: "12.4%",
      growth: "+1,894",
      status: "success",
    },
    {
      channel: "YouTube",
      icon: YoutubeIcon,
      impressions: "310.2K",
      ctr: "6.10%",
      conversion: "8.1%",
      growth: "+912",
      status: "success",
    },
    {
      channel: "Substack Newsletter",
      icon: NewsletterIcon,
      impressions: "92.5K",
      ctr: "18.42%",
      conversion: "22.5%",
      growth: "+1,424",
      status: "success",
    },
  ];

  // SVG Line Chart Coordinate calculations for "Performance Velocity"
  const chartPoints = [
    { label: "06-18", val: 12000 },
    { label: "06-19", val: 14500 },
    { label: "06-20", val: 13000 },
    { label: "06-21", val: 16800 },
    { label: "06-22", val: 19500 },
    { label: "06-23", val: 24200 },
    { label: "06-24", val: 28400 },
  ];

  const minVal = 10000;
  const maxVal = 30000;
  const range = maxVal - minVal;
  const width = 500;
  const height = 120;

  const polylinePoints = chartPoints
    .map((p, idx) => {
      const x = (idx / (chartPoints.length - 1)) * width;
      const y = height - ((p.val - minVal) / range) * (height - 20) - 10;
      return `${x},${y}`;
    })
    .join(" ");

  // Grid blocks for activity heatmap (5 rows, 20 columns)
  const heatmapRows = 5;
  const heatmapCols = 22;
  const seedMatrix = [
    [2, 0, 1, 4, 3, 0, 5, 2, 1, 8, 4, 0, 3, 2, 0, 1, 5, 2, 0, 4, 3, 1],
    [0, 5, 2, 0, 1, 4, 2, 8, 0, 3, 6, 2, 0, 1, 4, 3, 0, 2, 5, 1, 0, 2],
    [3, 2, 0, 1, 5, 2, 0, 4, 3, 1, 0, 7, 2, 3, 5, 0, 1, 4, 2, 8, 3, 0],
    [1, 0, 7, 2, 3, 6, 0, 1, 4, 2, 9, 3, 0, 5, 2, 0, 1, 3, 6, 2, 0, 4],
    [4, 3, 1, 0, 2, 5, 2, 0, 3, 7, 2, 0, 8, 4, 3, 0, 2, 5, 1, 0, 3, 2],
  ];

  const getHeatmapColor = (val: number) => {
    if (val === 0) return "bg-edge/40";
    if (val < 3) return "bg-accent/15";
    if (val < 6) return "bg-accent/40";
    if (val < 8) return "bg-accent/75";
    return "bg-accent";
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <PageHeader
        title="Creator Analytics"
        description="Comprehensive platform growth statistics, conversion rates, and publication performance trends."
      />

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="Avg CTR"
          value="5.12%"
          change={1.4}
          changeLabel="vs last month"
          sparklineData={[4.8, 4.9, 4.92, 5.0, 5.08, 5.1, 5.12]}
        />
        <MetricCard
          title="Total Impressions"
          value="1.24M"
          change={18.2}
          changeLabel="vs last month"
          sparklineData={[1.02, 1.05, 1.1, 1.14, 1.18, 1.22, 1.24]}
        />
        <MetricCard
          title="Net Subscribers"
          value="+4,230"
          change={8.4}
          changeLabel="vs last month"
          sparklineData={[3200, 3400, 3700, 3600, 3900, 4100, 4230]}
        />
        <MetricCard
          title="Content Efficiency"
          value="82.4%"
          change={-2.1}
          changeLabel="vs last month"
          sparklineData={[84.5, 84.0, 83.2, 82.8, 83.0, 82.5, 82.4]}
        />
      </div>

      {/* Graphs Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Trend line graph */}
        <div className="lg:col-span-2 flex flex-col">
          <Card
            header={
              <div className="flex items-center justify-between w-full">
                <div className="flex items-center gap-2">
                  <AnalyticsIcon size={12} className="text-accent" />
                  <span className="font-mono uppercase text-[10px] tracking-wider">
                    Impressions Velocity (Last 7d)
                  </span>
                </div>
                <div className="flex items-center gap-1.5 font-mono text-[10px] text-success">
                  <TrendingUpIcon size={10} />
                  <span>+18.4% MOMENTUM</span>
                </div>
              </div>
            }
            className="flex-1"
          >
            <div className="space-y-4">
              <div className="relative w-full h-[120px] bg-background/30 rounded-lg overflow-hidden border border-edge/30">
                {/* Horizontal Guide Lines */}
                <div className="absolute inset-0 flex flex-col justify-between p-2 pointer-events-none text-[8px] font-mono text-subtle">
                  <div className="border-b border-edge/20 w-full pb-0.5">30.0K</div>
                  <div className="border-b border-edge/20 w-full pb-0.5">20.0K</div>
                  <div className="border-b border-edge/20 w-full pb-0.5">10.0K</div>
                </div>

                {/* SVG Graph path */}
                <svg
                  className="w-full h-full overflow-visible"
                  viewBox={`0 0 ${width} ${height}`}
                  preserveAspectRatio="none"
                >
                  {/* Area fill */}
                  <path
                    fill="url(#gradient-accent)"
                    opacity="0.05"
                    d={`M 0 ${height} L ${polylinePoints} L ${width} ${height} Z`}
                  />
                  {/* Line */}
                  <polyline
                    fill="none"
                    className="stroke-accent"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    points={polylinePoints}
                  />

                  {/* Definitions for gradient */}
                  <defs>
                    <linearGradient id="gradient-accent" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="var(--color-accent)" />
                      <stop offset="100%" stopColor="var(--color-accent)" stopOpacity="0" />
                    </linearGradient>
                  </defs>
                </svg>
              </div>

              {/* X Axis Labels */}
              <div className="flex justify-between px-2 font-mono text-[9px] text-subtle">
                {chartPoints.map((p) => (
                  <span key={p.label}>{p.label}</span>
                ))}
              </div>
            </div>
          </Card>
        </div>

        {/* Heatmap Grid card */}
        <Card
          header={
            <div className="flex items-center justify-between w-full">
              <span className="font-mono uppercase text-[10px] tracking-wider">
                Publication Consistency
              </span>
              <Badge variant="accent">110d STREAK</Badge>
            </div>
          }
        >
          <div className="space-y-4">
            <div className="flex flex-col gap-1 border border-edge/40 p-2.5 rounded-lg bg-background/20 select-none">
              {seedMatrix.map((row, rIdx) => (
                <div key={`heatmap-row-${rIdx}`} className="flex gap-1 justify-center">
                  {row.map((val, cIdx) => (
                    <div
                      key={`heatmap-cell-${rIdx}-${cIdx}`}
                      className={`w-3.5 h-3.5 rounded-[2px] ${getHeatmapColor(
                        val
                      )} transition-all duration-150 hover:scale-110`}
                      title={`Signal Value: ${val}`}
                    />
                  ))}
                </div>
              ))}
            </div>

            <div className="flex items-center justify-between text-[9px] font-mono text-subtle">
              <span>LESS</span>
              <div className="flex gap-0.5">
                <span className="w-2.5 h-2.5 bg-edge/40 rounded-[1px]" />
                <span className="w-2.5 h-2.5 bg-accent/15 rounded-[1px]" />
                <span className="w-2.5 h-2.5 bg-accent/40 rounded-[1px]" />
                <span className="w-2.5 h-2.5 bg-accent/75 rounded-[1px]" />
                <span className="w-2.5 h-2.5 bg-accent rounded-[1px]" />
              </div>
              <span>MORE ACTIVITY</span>
            </div>
          </div>
        </Card>
      </div>

      {/* Platform Analysis Breakdown Table */}
      <Card
        header={
          <span className="font-mono uppercase text-[10px] tracking-wider">
            Channel Efficiency Metrics
          </span>
        }
      >
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-edge font-mono text-[10px] text-subtle uppercase tracking-wider">
                <th className="py-2.5 font-medium">Channel / Source</th>
                <th className="py-2.5 font-medium">Impressions</th>
                <th className="py-2.5 font-medium">Clicks / CTR</th>
                <th className="py-2.5 font-medium">Sub-Conversion</th>
                <th className="py-2.5 font-medium">Subscriber Net</th>
                <th className="py-2.5 font-medium text-right">Uptime</th>
              </tr>
            </thead>
            <tbody className="text-xs font-sans text-foreground">
              {tableData.map((row) => {
                const Icon = row.icon;
                return (
                  <tr
                    key={row.channel}
                    className="border-b border-edge/40 last:border-0 hover:bg-surface-2/20 transition-colors"
                  >
                    <td className="py-3 font-semibold flex items-center gap-2">
                      <Icon size={12} className="text-muted" />
                      <span>{row.channel}</span>
                    </td>
                    <td className="py-3 font-mono text-muted">{row.impressions}</td>
                    <td className="py-3 font-mono text-muted">{row.ctr}</td>
                    <td className="py-3 font-mono text-muted">{row.conversion}</td>
                    <td className="py-3 font-mono font-medium text-success">
                      {row.growth}
                    </td>
                    <td className="py-3 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <span className="text-[10px] font-mono text-subtle">
                          99.98%
                        </span>
                        <StatusDot status="success" />
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
