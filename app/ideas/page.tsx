import React from "react";
import { PageHeader } from "@/components/ui/page-header";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PlusIcon, SearchIcon, FilterIcon, EyeIcon } from "@/components/ui/icons";

interface Idea {
  title: string;
  desc: string;
  category: "TWITTER" | "YOUTUBE" | "NEWSLETTER";
  score: number; // 1-5
  status: "EVALUATING" | "DRAFTING" | "BACKLOG" | "READY";
  created: string;
}

export default function IdeasPage() {
  const ideas: Idea[] = [
    {
      title: "The Death of SaaS and the Rise of AI Agents",
      desc: "Deep dive on how local model hosting and agent platforms will disrupt multi-tenant SaaS architectures.",
      category: "NEWSLETTER",
      score: 5,
      status: "DRAFTING",
      created: "2026-06-24",
    },
    {
      title: "My 3-step setup for local terminal automation",
      desc: "Short thread breaking down my shell shortcuts and productivity aliases.",
      category: "TWITTER",
      score: 4,
      status: "READY",
      created: "2026-06-23",
    },
    {
      title: "Building an Antigravity replica in React from scratch",
      desc: "Video breakdown of rendering complex system logs, canvas diagrams, and interactive state models.",
      category: "YOUTUBE",
      score: 5,
      status: "EVALUATING",
      created: "2026-06-22",
    },
    {
      title: "Why shadows are ruining your modern UI design",
      desc: "Visual critique on Polymarket and Linear border styles vs generic SaaS drop shadows.",
      category: "TWITTER",
      score: 3,
      status: "BACKLOG",
      created: "2026-06-20",
    },
    {
      title: "The Creator Operating System: Behind the Scenes",
      desc: "Sharing my design assets, Next.js architecture, and automated dashboard scripts.",
      category: "NEWSLETTER",
      score: 4,
      status: "EVALUATING",
      created: "2026-06-18",
    },
  ];

  const getScoreBlocks = (score: number) => {
    return (
      <span className="font-mono text-[10px] tracking-tight">
        {"■".repeat(score)}
        <span className="text-edge-strong">{"■".repeat(5 - score)}</span>
      </span>
    );
  };

  const getCategoryBadge = (cat: Idea["category"]) => {
    switch (cat) {
      case "TWITTER":
        return <Badge variant="subtle">TWITTER</Badge>;
      case "YOUTUBE":
        return <Badge variant="danger">YOUTUBE</Badge>;
      case "NEWSLETTER":
        return <Badge variant="accent">NEWSLETTER</Badge>;
    }
  };

  const getStatusBadge = (status: Idea["status"]) => {
    switch (status) {
      case "EVALUATING":
        return <Badge variant="warning">EVALUATING</Badge>;
      case "DRAFTING":
        return <Badge variant="accent">DRAFTING</Badge>;
      case "READY":
        return <Badge variant="success">READY</Badge>;
      case "BACKLOG":
        return <Badge variant="default">BACKLOG</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <PageHeader
        title="Idea Vault"
        description="Capture, analyze, and score content concepts with signal filters."
        actions={
          <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-foreground hover:bg-[#ccc] text-background text-xs font-semibold font-sans transition-all">
            <PlusIcon size={12} className="stroke-[2]" />
            <span>New Concept</span>
          </button>
        }
      />

      {/* Filter and Stats Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-edge/60 pb-4">
        {/* Search & Filters */}
        <div className="flex items-center gap-2 flex-1 max-w-md">
          <div className="relative flex-1">
            <SearchIcon
              size={12}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-subtle"
            />
            <input
              type="text"
              placeholder="Search concepts..."
              className="w-full bg-surface border border-edge rounded-lg py-1.5 pl-8 pr-3 text-xs text-foreground placeholder-subtle focus:outline-none focus:border-edge-strong font-sans"
              disabled
            />
          </div>
          <button className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-edge bg-surface hover:bg-surface-2 text-xs text-muted font-medium transition-all">
            <FilterIcon size={10} />
            <span>Filter</span>
          </button>
        </div>

        {/* Dense Status Counts */}
        <div className="flex items-center gap-4 font-mono text-[10px] text-muted">
          <div>
            TOTAL: <span className="text-foreground font-semibold">142</span>
          </div>
          <div className="w-px h-3 bg-edge" />
          <div>
            HIGH SIGNAL: <span className="text-accent font-semibold">34</span>
          </div>
          <div className="w-px h-3 bg-edge" />
          <div>
            READY: <span className="text-success font-semibold">12</span>
          </div>
        </div>
      </div>

      {/* Ideas Card List */}
      <div className="space-y-3">
        {ideas.map((idea) => (
          <Card
            key={`idea-${idea.title}`}
            hoverable
            className="group"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-1.5 flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  {getCategoryBadge(idea.category)}
                  <span className="w-1.5 h-1.5 rounded-full bg-edge-strong hidden sm:inline" />
                  <span className="font-mono text-[10px] text-subtle">
                    {idea.created}
                  </span>
                </div>
                <div>
                  <h3 className="text-sm font-bold text-foreground group-hover:text-accent transition-colors">
                    {idea.title}
                  </h3>
                  <p className="text-xs text-muted leading-relaxed mt-0.5 max-w-4xl">
                    {idea.desc}
                  </p>
                </div>
              </div>

              {/* Scoring & Status Display */}
              <div className="flex items-center gap-6 self-start sm:self-center shrink-0">
                <div className="flex flex-col items-end gap-1">
                  <span className="text-[9px] font-mono text-subtle">SIGNAL</span>
                  <div className="text-accent">{getScoreBlocks(idea.score)}</div>
                </div>
                <div className="w-px h-8 bg-edge hidden sm:block" />
                <div className="flex flex-col items-end gap-1">
                  <span className="text-[9px] font-mono text-subtle">STATE</span>
                  {getStatusBadge(idea.status)}
                </div>
                <button className="p-1 rounded border border-edge hover:border-edge-strong bg-surface-2 opacity-0 group-hover:opacity-100 transition-all">
                  <EyeIcon size={12} className="text-muted hover:text-foreground" />
                </button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
