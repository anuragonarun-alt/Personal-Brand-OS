"use client";

import React, { useState } from "react";
import { Idea } from "@/app/ideas/page";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { EyeIcon } from "@/components/ui/icons";
import { CreateIdeaModal } from "./create-idea-modal";

interface IdeaVaultListProps {
  ideas: Idea[];
}

export const IdeaVaultList: React.FC<IdeaVaultListProps> = ({ ideas }) => {
  const [selectedIdea, setSelectedIdea] = useState<Idea | null>(null);

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

  return (
    <>
      <div className="space-y-3">
        {ideas.map((idea) => (
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
                    {new Date(idea.created_at).toLocaleDateString()}
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
                  <div className="text-accent">{getScoreBlocks(3)}</div>
                </div>
                <div className="w-px h-8 bg-edge hidden sm:block" />
                <div className="flex flex-col items-end gap-1">
                  <span className="text-[9px] font-mono text-subtle">STATE</span>
                  {getStatusBadge(idea.status)}
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedIdea(idea);
                  }}
                  className="p-1 rounded border border-edge hover:border-edge-strong bg-surface-2 opacity-0 group-hover:opacity-100 transition-all cursor-pointer"
                  aria-label="View concept details"
                >
                  <EyeIcon size={12} className="text-muted hover:text-foreground" />
                </button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <CreateIdeaModal
        isOpen={selectedIdea !== null}
        initialIdea={selectedIdea}
        onClose={() => setSelectedIdea(null)}
      />
    </>
  );
};
