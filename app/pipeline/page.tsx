import React from "react";
import { PageHeader } from "@/components/ui/page-header";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { StatusDot } from "@/components/ui/status-dot";
import {
  TwitterIcon,
  YoutubeIcon,
  NewsletterIcon,
  PlusIcon,
  ClockIcon,
} from "@/components/ui/icons";

interface PipelineItem {
  id: string;
  title: string;
  platform: "TWITTER" | "YOUTUBE" | "NEWSLETTER";
  updated: string;
  priority: "HIGH" | "MEDIUM" | "LOW";
  statusColor: "success" | "warning" | "danger" | "accent" | "muted";
}

interface Column {
  title: string;
  count: number;
  items: PipelineItem[];
}

export default function PipelinePage() {
  const columns: Column[] = [
    {
      title: "Backlog",
      count: 3,
      items: [
        {
          id: "P-404",
          title: "GCP Cloud Run vs Spanner deep-dive guide",
          platform: "NEWSLETTER",
          updated: "2026-06-20",
          priority: "LOW",
          statusColor: "muted",
        },
        {
          id: "P-405",
          title: "5 tips for optimizing Tailwind CSS v4 builds",
          platform: "TWITTER",
          updated: "2026-06-22",
          priority: "MEDIUM",
          statusColor: "muted",
        },
      ],
    },
    {
      title: "Drafting",
      count: 2,
      items: [
        {
          id: "P-398",
          title: "Building an Agentic OS interface template",
          platform: "NEWSLETTER",
          updated: "2026-06-24",
          priority: "HIGH",
          statusColor: "accent",
        },
        {
          id: "P-399",
          title: "Automated Dataform pipelines in GCP",
          platform: "YOUTUBE",
          updated: "2026-06-23",
          priority: "HIGH",
          statusColor: "accent",
        },
      ],
    },
    {
      title: "In Review",
      count: 1,
      items: [
        {
          id: "P-390",
          title: "My custom NeoVim developer config guide",
          platform: "TWITTER",
          updated: "2026-06-21",
          priority: "MEDIUM",
          statusColor: "warning",
        },
      ],
    },
    {
      title: "Scheduled",
      count: 2,
      items: [
        {
          id: "P-388",
          title: "The shift from SaaS towards Intelligence Terminals",
          platform: "TWITTER",
          updated: "2026-06-24",
          priority: "HIGH",
          statusColor: "success",
        },
        {
          id: "P-389",
          title: "Why Information Density is the ultimate UI hack",
          platform: "NEWSLETTER",
          updated: "2026-06-23",
          priority: "MEDIUM",
          statusColor: "success",
        },
      ],
    },
    {
      title: "Published",
      count: 12,
      items: [
        {
          id: "P-380",
          title: "Introduction to Next.js App Router for Terminal UIs",
          platform: "YOUTUBE",
          updated: "2026-06-18",
          priority: "MEDIUM",
          statusColor: "success",
        },
      ],
    },
  ];

  const getPlatformIcon = (platform: PipelineItem["platform"]) => {
    switch (platform) {
      case "TWITTER":
        return <TwitterIcon size={12} className="text-muted" />;
      case "YOUTUBE":
        return <YoutubeIcon size={12} className="text-danger" />;
      case "NEWSLETTER":
        return <NewsletterIcon size={12} className="text-accent" />;
    }
  };

  const getPriorityBadge = (pri: PipelineItem["priority"]) => {
    if (pri === "HIGH") return <Badge variant="accent">HIGH</Badge>;
    if (pri === "MEDIUM") return <Badge variant="default">MED</Badge>;
    return <Badge variant="subtle">LOW</Badge>;
  };

  return (
    <div className="space-y-6 h-full flex flex-col">
      {/* Page Header */}
      <PageHeader
        title="Content Pipeline"
        description="Visualizing the content lifecycle from backlog ideas to scheduled publication."
        actions={
          <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-edge hover:border-edge-strong bg-surface hover:bg-surface-2 text-xs font-medium font-sans transition-all">
            <PlusIcon size={12} />
            <span>Create Draft</span>
          </button>
        }
      />

      {/* Columns Board Container */}
      <div className="flex-1 overflow-x-auto min-h-0 pb-4">
        <div className="flex gap-4 h-full min-w-[1000px]">
          {columns.map((col) => (
            <div
              key={col.title}
              className="flex-1 bg-surface/30 border border-edge rounded-xl p-3 flex flex-col gap-3 min-w-[200px]"
            >
              {/* Column Header */}
              <div className="flex items-center justify-between border-b border-edge pb-2 font-mono text-[10px] tracking-wider uppercase select-none">
                <span className="text-muted font-bold">{col.title}</span>
                <span className="text-subtle bg-surface-2 border border-edge px-1.5 py-0.5 rounded">
                  {col.count}
                </span>
              </div>

              {/* Column Items */}
              <div className="flex-1 space-y-2 overflow-y-auto pr-1">
                {col.items.map((item) => (
                  <Card
                    key={item.id}
                    hoverable
                    className="p-3 gap-2 flex flex-col"
                  >
                    {/* Header line */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        {getPlatformIcon(item.platform)}
                        <span className="font-mono text-[9px] text-subtle">
                          {item.id}
                        </span>
                      </div>
                      <StatusDot status={item.statusColor} />
                    </div>

                    {/* Content title */}
                    <h4 className="text-xs font-semibold text-foreground leading-snug line-clamp-2">
                      {item.title}
                    </h4>

                    {/* Metadata line */}
                    <div className="flex items-center justify-between border-t border-edge/40 pt-2 mt-1">
                      <div className="flex items-center gap-1 text-[9px] font-mono text-subtle">
                        <ClockIcon size={10} />
                        <span>{item.updated}</span>
                      </div>
                      {getPriorityBadge(item.priority)}
                    </div>
                  </Card>
                ))}
                {col.items.length === 0 && (
                  <div className="h-20 rounded-lg border border-dashed border-edge flex items-center justify-center text-[10px] font-mono text-subtle uppercase">
                    No items in queue
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
