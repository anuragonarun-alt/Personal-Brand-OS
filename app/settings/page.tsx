import React from "react";
import { PageHeader } from "@/components/ui/page-header";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { StatusDot } from "@/components/ui/status-dot";
import {
  TwitterIcon,
  YoutubeIcon,
  NewsletterIcon,
  ServerIcon,
  CheckIcon,
} from "@/components/ui/icons";

export default function SettingsPage() {
  const integrations = [
    {
      name: "Twitter / X Integration",
      icon: TwitterIcon,
      status: "success",
      desc: "API credentials for posting, syncing impressions, and monitoring thread metrics.",
      scopes: ["tweet.read", "tweet.write", "users.read"],
    },
    {
      name: "YouTube Creator Integration",
      icon: YoutubeIcon,
      status: "success",
      desc: "Analytics reporting API to ingest watch time, subscription velocity, and video lists.",
      scopes: ["youtube.readonly", "yt-analytics.readonly"],
    },
    {
      name: "Substack Feed Reader",
      icon: NewsletterIcon,
      status: "success",
      desc: "Syncs subscription rates, newsletter views, and drafts using secure feeds.",
      scopes: ["rss.feed.read"],
    },
  ];

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Page Header */}
      <PageHeader
        title="System Settings"
        description="Configure integrations, synchronization frequencies, and system preferences."
        actions={
          <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-foreground hover:bg-[#ccc] text-background text-xs font-semibold font-sans transition-all">
            <CheckIcon size={12} className="stroke-[2]" />
            <span>Save Settings</span>
          </button>
        }
      />

      {/* Grid containing categories */}
      <div className="space-y-4">
        {/* Sync Settings */}
        <Card
          header={
            <div className="flex items-center gap-2">
              <ServerIcon size={12} className="text-accent" />
              <span className="font-mono uppercase text-[10px] tracking-wider">
                Synchronization Controls
              </span>
            </div>
          }
        >
          <div className="space-y-4">
            {/* Sync Interval */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-edge/40 pb-3">
              <div>
                <label className="text-xs font-semibold text-foreground">
                  Global Sync Stream Interval
                </label>
                <p className="text-[11px] text-muted leading-relaxed">
                  Controls how frequently the background streams query social APIs.
                </p>
              </div>
              <select
                className="bg-surface-2 border border-edge rounded-lg px-2.5 py-1.5 text-xs text-foreground focus:outline-none focus:border-edge-strong font-mono sm:w-48"
                defaultValue="5m"
                disabled
              >
                <option value="1m">1 minute (Express)</option>
                <option value="5m">5 minutes (Default)</option>
                <option value="15m">15 minutes (Relaxed)</option>
                <option value="1h">1 hour (Stretched)</option>
              </select>
            </div>

            {/* Verbose Logs Toggle */}
            <div className="flex items-center justify-between border-b border-edge/40 pb-3">
              <div>
                <span className="text-xs font-semibold text-foreground">
                  Verbose System Ticks
                </span>
                <p className="text-[11px] text-muted leading-relaxed">
                  Log heartbeat ticks and minor network queries to the Dashboard console.
                </p>
              </div>
              <div className="relative inline-flex items-center cursor-not-allowed">
                <div className="w-8 h-4.5 bg-accent/20 rounded-full border border-accent/40 flex items-center justify-end px-0.5">
                  <div className="w-3.5 h-3.5 bg-accent rounded-full" />
                </div>
              </div>
            </div>

            {/* Threshold Count */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-1">
              <div>
                <label className="text-xs font-semibold text-foreground">
                  Idea Archival Age limit
                </label>
                <p className="text-[11px] text-muted leading-relaxed">
                  Days of inactivity before an un-evaluated idea is moved to backup.
                </p>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  defaultValue={90}
                  className="bg-surface-2 border border-edge rounded-lg px-2.5 py-1.5 text-xs text-foreground text-center focus:outline-none focus:border-edge-strong font-mono w-20"
                  disabled
                />
                <span className="text-[10px] font-mono text-subtle">DAYS</span>
              </div>
            </div>
          </div>
        </Card>

        {/* Integration List Settings */}
        <Card
          header={
            <div className="flex items-center gap-2">
              <span className="font-mono uppercase text-[10px] tracking-wider">
                API Integration Protocols
              </span>
            </div>
          }
        >
          <div className="space-y-4">
            {integrations.map((platform) => {
              const Icon = platform.icon;
              return (
                <div
                  key={`platform-${platform.name}`}
                  className="border-b border-edge/40 pb-4 last:border-0 last:pb-0"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex items-start gap-2.5">
                      <div className="w-8 h-8 rounded-lg border border-edge flex items-center justify-center bg-surface-2 mt-0.5 shrink-0">
                        <Icon size={14} className="text-muted" />
                      </div>
                      <div>
                        <h4 className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                          {platform.name}
                          <Badge variant="success">CONNECTED</Badge>
                        </h4>
                        <p className="text-[11px] text-muted leading-relaxed mt-0.5">
                          {platform.desc}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                      <button className="px-2.5 py-1 rounded border border-edge hover:border-edge-strong bg-surface-2 text-[10px] font-mono font-medium text-muted hover:text-foreground transition-all">
                        REVOKE
                      </button>
                      <button className="px-2.5 py-1 rounded border border-edge hover:border-edge-strong bg-surface text-[10px] font-mono font-medium text-foreground hover:bg-surface-2 transition-all">
                        EDIT KEYS
                      </button>
                    </div>
                  </div>

                  {/* Scopes */}
                  <div className="flex flex-wrap items-center gap-1.5 mt-2.5 pl-10">
                    <span className="text-[9px] font-mono text-subtle uppercase mr-1">
                      Granted Scopes:
                    </span>
                    {platform.scopes.map((scope) => (
                      <span
                        key={scope}
                        className="text-[9px] font-mono text-subtle bg-surface-2 border border-edge px-1.5 py-0.5 rounded"
                      >
                        {scope}
                      </span>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
      </div>
    </div>
  );
}
