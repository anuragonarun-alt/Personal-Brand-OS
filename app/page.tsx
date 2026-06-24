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
  SignalIcon,
  ClockIcon,
  PlusIcon,
  RefreshIcon,
} from "@/components/ui/icons";

export default function Dashboard() {
  const signalLogs = [
    {
      time: "22:14:08",
      platform: "TWITTER",
      msg: "Post #284 engagement velocity spike (+32.4%)",
      status: "accent",
      type: "ENGAGEMENT",
    },
    {
      time: "21:44:12",
      platform: "YOUTUBE",
      msg: "Video #18 ingest check completed",
      status: "success",
      type: "SYNC_OK",
    },
    {
      time: "19:12:45",
      platform: "SUBSTACK",
      msg: "Subscriber transaction synced +18 users",
      status: "success",
      type: "BILLING",
    },
    {
      time: "18:02:11",
      platform: "TWITTER",
      msg: "Post #283 published successfully",
      status: "muted",
      type: "PUBLISH",
    },
    {
      time: "15:30:20",
      platform: "SYSTEM",
      msg: "Background sync threshold warning (latency 420ms)",
      status: "warning",
      type: "ALERT_WARN",
    },
  ];

  const integrations = [
    {
      name: "Twitter / X",
      handle: "@creator_os",
      icon: TwitterIcon,
      status: "success",
      syncText: "Last sync 4m ago",
      volume: "12 posts/wk",
    },
    {
      name: "YouTube",
      handle: "Creator Labs",
      icon: YoutubeIcon,
      status: "success",
      syncText: "Last sync 1h ago",
      volume: "1 video/wk",
    },
    {
      name: "Substack",
      handle: "The Signal",
      icon: NewsletterIcon,
      status: "success",
      syncText: "Last sync 14m ago",
      volume: "2 issues/wk",
    },
  ];

  // Data matrix values for "Activity Density"
  const densityMatrix = [
    [4, 2, 0, 1, 8, 4, 3],
    [1, 5, 2, 0, 3, 7, 2],
    [3, 0, 6, 2, 1, 4, 5],
  ];

  const getMatrixColor = (val: number) => {
    if (val === 0) return "bg-edge/40";
    if (val < 3) return "bg-accent/20";
    if (val < 6) return "bg-accent/50";
    return "bg-accent";
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <PageHeader
        title="Mission Control"
        description="Real-time creator intelligence and platform momentum."
        actions={
          <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-edge hover:border-edge-strong bg-surface hover:bg-surface-2 text-xs font-medium font-sans transition-all">
            <RefreshIcon size={12} className="text-muted animate-spin-slow" />
            <span>Force Sync</span>
          </button>
        }
      />

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="Total Audience"
          value="148,290"
          change={4.8}
          changeLabel="vs last 7d"
          sparklineData={[120, 122, 128, 131, 137, 142, 148]}
        />
        <MetricCard
          title="Content Velocity"
          value="18 posts"
          change={12.5}
          changeLabel="vs last 7d"
          sparklineData={[12, 14, 11, 15, 13, 16, 18]}
        />
        <MetricCard
          title="Avg Engagement"
          value="6.42%"
          change={0.2}
          changeLabel="vs last 7d"
          sparklineData={[6.3, 6.25, 6.4, 6.35, 6.38, 6.41, 6.42]}
        />
        <MetricCard
          title="System Score"
          value="92/100"
          change={0.0}
          changeLabel="vs last 7d"
          sparklineData={[92, 92, 92, 92, 92, 92, 92]}
        />
      </div>

      {/* Grid of details */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Active Signals */}
        <div className="lg:col-span-2 flex flex-col">
          <Card
            header={
              <div className="flex items-center gap-2">
                <SignalIcon size={12} className="text-accent" />
                <span className="font-mono uppercase text-[10px] tracking-wider">
                  Active Intelligence Signals
                </span>
              </div>
            }
            className="flex-1"
          >
            <div className="space-y-3">
              {signalLogs.map((log, idx) => (
                <div
                  key={`signal-${log.platform}-${log.time}-${idx}`}
                  className="flex items-start justify-between gap-3 text-xs border-b border-edge/50 pb-2.5 last:border-0 last:pb-0"
                >
                  <div className="flex items-start gap-2.5 min-w-0">
                    <span className="font-mono text-subtle text-[10px] mt-0.5 whitespace-nowrap">
                      [{log.time}]
                    </span>
                    <StatusDot
                      status={log.status as any}
                      pulse={log.status === "accent"}
                      className="mt-1.5"
                    />
                    <div className="truncate">
                      <p className="text-foreground font-sans truncate">
                        {log.msg}
                      </p>
                      <span className="text-[10px] font-mono text-subtle">
                        SOURCE: {log.platform}
                      </span>
                    </div>
                  </div>
                  <Badge
                    variant={
                      log.status === "warning"
                        ? "warning"
                        : log.status === "accent"
                        ? "accent"
                        : log.status === "success"
                        ? "success"
                        : "default"
                    }
                  >
                    {log.type}
                  </Badge>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Column sidebar (Integrations & Activity) */}
        <div className="space-y-4">
          {/* Integrations Monitor */}
          <Card
            header={
              <div className="flex items-center gap-2">
                <ClockIcon size={12} className="text-muted" />
                <span className="font-mono uppercase text-[10px] tracking-wider">
                  Platform Streams
                </span>
              </div>
            }
          >
            <div className="space-y-3">
              {integrations.map((platform) => {
                const Icon = platform.icon;
                return (
                  <div
                    key={platform.name}
                    className="flex items-center justify-between gap-2 border-b border-edge/50 pb-2.5 last:border-0 last:pb-0"
                  >
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-lg border border-edge flex items-center justify-center bg-surface-2/60">
                        <Icon size={14} className="text-muted" />
                      </div>
                      <div>
                        <div className="text-xs font-semibold">{platform.name}</div>
                        <div className="text-[10px] font-mono text-subtle">
                          {platform.handle}
                        </div>
                      </div>
                    </div>
                    <div className="text-right flex flex-col items-end gap-1">
                      <div className="flex items-center gap-1.5">
                        <span className="text-[9px] font-mono text-subtle">
                          {platform.syncText}
                        </span>
                        <StatusDot status={platform.status as any} />
                      </div>
                      <Badge variant="subtle">{platform.volume}</Badge>
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>

          {/* Activity Density */}
          <Card
            header={
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
                <span className="font-mono uppercase text-[10px] tracking-wider">
                  System Grid Density
                </span>
              </div>
            }
          >
            <div className="space-y-3">
              <div className="grid grid-cols-7 gap-1">
                {densityMatrix.flatMap((row, rIdx) =>
                  row.map((val, cIdx) => (
                    <div
                      key={`density-${rIdx}-${cIdx}`}
                      className={`h-5 rounded-sm ${getMatrixColor(
                        val
                      )} transition-all duration-300 hover:scale-105`}
                      title={`Signal frequency: ${val}`}
                    />
                  ))
                )}
              </div>
              <div className="flex items-center justify-between text-[9px] font-mono text-subtle pt-1">
                <span>LOW SIGNAL</span>
                <div className="flex gap-0.5">
                  <span className="w-2 h-2 bg-edge/40 rounded-sm" />
                  <span className="w-2 h-2 bg-accent/20 rounded-sm" />
                  <span className="w-2 h-2 bg-accent/50 rounded-sm" />
                  <span className="w-2 h-2 bg-accent rounded-sm" />
                </div>
                <span>HIGH VELOCITY</span>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
