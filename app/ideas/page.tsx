import React from "react";
import { supabase } from "@/lib/supabase";
import { PageHeader } from "@/components/ui/page-header";
import { IdeaVaultActions } from "@/components/idea-vault/idea-vault-actions";
import { IdeaVaultList } from "@/components/idea-vault/idea-vault-list";
import { SearchIcon, FilterIcon } from "@/components/ui/icons";

export interface Idea {
  id: string;
  title: string;
  content: string | null;
  category: string | null;
  status: string;
  priority: string;
  created_at: string;
  updated_at: string;
}

export default async function IdeasPage() {
  const { data: ideas, error } = await supabase
    .from("ideas")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error(error);
  }


  const ideasList = ideas ?? [];
  const totalCount = ideasList.length;
  const highPriorityCount = ideasList.filter((idea) => idea.priority === "HIGH").length;
  const readyCount = ideasList.filter((idea) => idea.status === "READY").length;

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <PageHeader
        title="Idea Vault"
        description="Capture, analyze, and score content concepts with signal filters."
        actions={<IdeaVaultActions />}
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

      {/* Ideas Card List */}
      <IdeaVaultList ideas={ideasList} />
    </div>
  );
}
