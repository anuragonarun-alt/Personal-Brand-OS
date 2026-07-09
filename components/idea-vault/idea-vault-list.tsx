"use client";

import React, { useState } from "react";
import { Idea } from "@/app/ideas/page";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { SearchIcon, FilterIcon } from "@/components/ui/icons";
import { CreateIdeaModal } from "./create-idea-modal";

interface IdeaVaultListProps {
  ideas: Idea[];
}

export const IdeaVaultList: React.FC<IdeaVaultListProps> = ({ ideas }) => {
  const [selectedIdea, setSelectedIdea] = useState<Idea | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [mounted, setMounted] = useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  const formatDate = (dateStr: string) => {
    if (!mounted) return "";
    try {
      const date = new Date(dateStr);
      return date.toLocaleDateString(undefined, {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    } catch (e) {
      return "";
    }
  };

  const getScoreBlocks = (priority: string | null) => {
    let score = 2; // Default to Medium (2 bars)
    if (priority === "LOW") score = 1;
    if (priority === "HIGH") score = 3;

    return (
      <span className="font-mono text-[10px] tracking-tight">
        {"■".repeat(score)}
        <span className="text-edge-strong">{"■".repeat(3 - score)}</span>
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
      default:
        return <Badge variant="default">{cat || "UNKNOWN"}</Badge>;
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
      default:
        return <Badge variant="default">{status}</Badge>;
    }
  };

  // Stats calculation based on total loaded ideas
  const totalCount = ideas.length;
  const highPriorityCount = ideas.filter((idea) => idea.priority === "HIGH").length;
  const readyCount = ideas.filter((idea) => idea.status === "READY").length;

  // Live filter based on case-insensitive search (Title, Content, or Category)
  const filteredIdeas = ideas.filter((idea) => {
    if (!searchQuery.trim()) return true;
    const query = searchQuery.toLowerCase();
    const titleMatch = idea.title.toLowerCase().includes(query);
    const contentMatch = idea.content?.toLowerCase().includes(query) || false;
    const categoryMatch = idea.category?.toLowerCase().includes(query) || false;
    return titleMatch || contentMatch || categoryMatch;
  });

  return (
    <div className="space-y-6">
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
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-surface border border-edge rounded-lg py-1.5 pl-8 pr-3 text-xs text-foreground placeholder-subtle focus:outline-none focus:border-edge-strong font-sans"
            />
          </div>
          <button className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-edge bg-surface hover:bg-surface-2 text-xs text-muted font-medium transition-all cursor-pointer">
            <FilterIcon size={10} />
            <span>Filter</span>
          </button>
        </div>

        {/* Dense Status Counts */}
        <div className="flex items-center gap-4 font-mono text-[10px] text-muted">
          <div>
            TOTAL: <span className="text-foreground font-semibold">{totalCount}</span>
          </div>
          <div className="w-px h-3 bg-edge" />
          <div>
            HIGH PRIORITY: <span className="text-accent font-semibold">{highPriorityCount}</span>
          </div>
          <div className="w-px h-3 bg-edge" />
          <div>
            READY: <span className="text-success font-semibold">{readyCount}</span>
          </div>
        </div>
      </div>

      {/* Ideas Card List or Empty State */}
      {filteredIdeas.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-12 border border-edge rounded-xl bg-surface/30 text-center space-y-2 animate-in fade-in duration-200">
          <div className="text-subtle font-mono text-[10px] uppercase tracking-wider">
            SEARCH_RESULT_EMPTY
          </div>
          <p className="text-xs text-muted font-sans">
            No matching ideas found for "{searchQuery}".
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredIdeas.map((idea) => (
            <Card
              key={idea.id}
              hoverable
              className="group cursor-pointer"
              onClick={() => setSelectedIdea(idea)}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-1.5 flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    {getCategoryBadge(idea.category)}
                    <span className="w-1.5 h-1.5 rounded-full bg-edge-strong hidden sm:inline" />
                    <span className="font-mono text-[10px] text-subtle">
                      {formatDate(idea.created_at)}
                    </span>
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-foreground group-hover:text-accent transition-colors">
                      {idea.title}
                    </h3>
                    <p className="text-xs text-muted leading-relaxed mt-0.5 max-w-4xl">
                      {idea.content}
                    </p>
                  </div>
                </div>

                {/* Scoring & Status Display */}
                <div className="flex items-center gap-6 self-start sm:self-center shrink-0">
                  <div className="flex flex-col items-end gap-1">
                    <span className="text-[9px] font-mono text-subtle">SIGNAL</span>
                    <div className="text-accent">{getScoreBlocks(idea.priority)}</div>
                  </div>
                  <div className="w-px h-8 bg-edge hidden sm:block" />
                  <div className="flex flex-col items-end gap-1">
                    <span className="text-[9px] font-mono text-subtle">STATE</span>
                    {getStatusBadge(idea.status)}
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      <CreateIdeaModal
        isOpen={selectedIdea !== null}
        initialIdea={selectedIdea}
        onClose={() => setSelectedIdea(null)}
      />
    </div>
  );
};
