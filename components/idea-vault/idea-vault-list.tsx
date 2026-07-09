"use client";

import { useEffect, useRef, useState } from "react";
import type { Idea } from "@/lib/types";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { SearchIcon, FilterIcon } from "@/components/ui/icons";
import { CreateIdeaModal } from "./create-idea-modal";
import { IdeaVaultFilters } from "./idea-vault-filters";
import { SelectChevron } from "@/components/ui/select-chevron";

interface IdeaVaultListProps {
  ideas: Idea[];
}

export const IdeaVaultList: React.FC<IdeaVaultListProps> = ({ ideas }) => {
  const [selectedIdea, setSelectedIdea] = useState<Idea | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [mounted, setMounted] = useState(false);

  // Filter selection states
  const [showFilters, setShowFilters] = useState(false);
  const [filterCategory, setFilterCategory] = useState("ALL");
  const [filterStatus, setFilterStatus] = useState("ALL");
  const [filterPriority, setFilterPriority] = useState("ALL");

  // Sorting state
  const [sortBy, setSortBy] = useState("NEWEST");

  // Refresh skeleton state — triggered after modal closes following a mutation
  const [isRefreshing, setIsRefreshing] = useState(false);
  const wasModalOpenRef = useRef(false);
  const isModalOpen = selectedIdea !== null || showCreateModal;

  useEffect(() => {
    if (wasModalOpenRef.current && !isModalOpen) {
      setIsRefreshing(true);
      const timer = setTimeout(() => setIsRefreshing(false), 800);
      return () => clearTimeout(timer);
    }
    wasModalOpenRef.current = isModalOpen;
  }, [isModalOpen]);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Press 'N' to open the New Concept modal when no input is focused
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isModalOpen) return;
      if (e.key !== "n" && e.key !== "N") return;
      if (e.ctrlKey || e.metaKey || e.altKey) return;
      const tag = (e.target as HTMLElement).tagName;
      if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT") return;
      e.preventDefault();
      setShowCreateModal(true);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isModalOpen]);

  const formatDate = (dateStr: string) => {
    if (!mounted) return "";
    try {
      const date = new Date(dateStr);
      return date.toLocaleDateString(undefined, {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    } catch {
      return "";
    }
  };

  const getScoreBlocks = (priority: string | null) => {
    const p = priority?.toUpperCase() || "MEDIUM";
    let score = 2; // Default to Medium (2 bars)
    if (p === "LOW") score = 1;
    if (p === "HIGH") score = 3;

    return (
      <span className="font-mono text-[10px] tracking-tight">
        {"■".repeat(score)}
        <span className="text-edge-strong">{"■".repeat(3 - score)}</span>
      </span>
    );
  };

  const CATEGORY_VARIANTS = [
    "accent",
    "success",
    "warning",
    "danger",
    "subtle",
  ] as const;

  const getCategoryBadge = (cat: Idea["category"]) => {
    const c = cat?.toUpperCase() || "";
    switch (c) {
      case "TWITTER":
        return <Badge variant="subtle">TWITTER</Badge>;
      case "YOUTUBE":
        return <Badge variant="danger">YOUTUBE</Badge>;
      case "NEWSLETTER":
        return <Badge variant="accent">NEWSLETTER</Badge>;
      default: {
        if (!c) return <Badge variant="default">UNKNOWN</Badge>;
        let hash = 0;
        for (let i = 0; i < c.length; i++) {
          hash = ((hash << 5) - hash + c.charCodeAt(i)) | 0;
        }
        const variant =
          CATEGORY_VARIANTS[Math.abs(hash) % CATEGORY_VARIANTS.length];
        return <Badge variant={variant}>{c}</Badge>;
      }
    }
  };

  const getStatusBadge = (status: Idea["status"]) => {
    const s = status?.toUpperCase() || "";
    switch (s) {
      case "EVALUATING":
        return <Badge variant="warning">EVALUATING</Badge>;
      case "DRAFTING":
        return <Badge variant="accent">DRAFTING</Badge>;
      case "READY":
        return <Badge variant="success">READY</Badge>;
      case "BACKLOG":
        return <Badge variant="default">BACKLOG</Badge>;
      default:
        return <Badge variant="default">{s}</Badge>;
    }
  };

  // Stats calculation based on total loaded ideas
  const totalCount = ideas.length;
  const highPriorityCount = ideas.filter((idea) => (idea.priority?.toUpperCase() || "MEDIUM") === "HIGH").length;
  const readyCount = ideas.filter((idea) => (idea.status?.toUpperCase() || "") === "READY").length;

  // Derive available categories from loaded ideas
  const availableCategories = Array.from(
    new Set(
      ideas
        .map((idea) => idea.category)
        .filter((c): c is string => Boolean(c))
        .map((c) => c.toUpperCase())
    )
  ).sort();

  const isFilterActive =
    filterCategory !== "ALL" ||
    filterStatus !== "ALL" ||
    filterPriority !== "ALL";

  const resetFilters = () => {
    setFilterCategory("ALL");
    setFilterStatus("ALL");
    setFilterPriority("ALL");
  };

  // Combined filtering based on case-insensitive search and metadata selections
  const filteredIdeas = ideas.filter((idea) => {
    // 1. Search Match
    const query = searchQuery.trim().toLowerCase();
    const matchesSearch = !query
      ? true
      : idea.title.toLowerCase().includes(query) ||
        idea.content?.toLowerCase().includes(query) ||
        idea.category?.toLowerCase().includes(query) ||
        false;

    // 2. Category Match
    const matchesCategory =
      filterCategory === "ALL"
        ? true
        : (idea.category?.toUpperCase() || "") === filterCategory;

    // 3. Status Match
    const matchesStatus =
      filterStatus === "ALL"
        ? true
        : (idea.status?.toUpperCase() || "") === filterStatus;

    // 4. Priority Match
    const matchesPriority =
      filterPriority === "ALL"
        ? true
        : (idea.priority?.toUpperCase() || "MEDIUM") === filterPriority;

    return matchesSearch && matchesCategory && matchesStatus && matchesPriority;
  });

  // Sorting logic applied on top of filtered ideas list
  const sortedIdeas = [...filteredIdeas].sort((a, b) => {
    switch (sortBy) {
      case "NEWEST":
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      case "OLDEST":
        return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
      case "PRIORITY": {
        const getPriorityWeight = (p: string | null) => {
          const priority = p?.toUpperCase() || "MEDIUM";
          if (priority === "HIGH") return 3;
          if (priority === "MEDIUM") return 2;
          if (priority === "LOW") return 1;
          return 0;
        };
        const weightA = getPriorityWeight(a.priority);
        const weightB = getPriorityWeight(b.priority);
        if (weightB !== weightA) {
          return weightB - weightA;
        }
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      }
      case "A_Z":
        return a.title.localeCompare(b.title);
      case "Z_A":
        return b.title.localeCompare(a.title);
      default:
        return 0;
    }
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
              className="w-full bg-surface border border-edge rounded-lg py-1.5 pl-8 pr-10 text-xs text-foreground placeholder-subtle focus:outline-none focus:border-edge-strong font-sans"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-subtle hover:text-foreground p-0.5 rounded cursor-pointer transition-colors"
                aria-label="Clear search"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="10"
                  height="10"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            )}
          </div>
          <button
            type="button"
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border transition-all cursor-pointer select-none ${
              isFilterActive
                ? "border-accent/20 bg-accent/5 text-accent hover:border-accent/40 hover:bg-accent/10"
                : "border-edge bg-surface hover:bg-surface-2 text-muted hover:text-foreground"
            }`}
          >
            <FilterIcon size={10} className={isFilterActive ? "text-accent" : "text-muted"} />
            <span className="text-xs font-semibold">
              {isFilterActive ? "Filter (Active)" : "Filter"}
            </span>
          </button>

          {/* Sort Dropdown */}
          <div className="relative min-w-[100px]">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full bg-surface border border-edge rounded-lg px-2.5 py-1.5 pr-8 text-xs text-muted hover:text-foreground font-semibold appearance-none cursor-pointer focus:outline-none focus:border-edge-strong transition-colors"
            >
              <option value="NEWEST">Newest</option>
              <option value="OLDEST">Oldest</option>
              <option value="PRIORITY">Priority</option>
              <option value="A_Z">A → Z</option>
              <option value="Z_A">Z → A</option>
            </select>
            <div className="absolute inset-y-0 right-0 flex items-center pr-2.5 pointer-events-none text-muted">
              <SelectChevron />
            </div>
          </div>
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

      {/* Expanded Filter Panel */}
      {showFilters && (
        <IdeaVaultFilters
          filterCategory={filterCategory}
          filterStatus={filterStatus}
          filterPriority={filterPriority}
          availableCategories={availableCategories}
          isFilterActive={isFilterActive}
          onCategoryChange={setFilterCategory}
          onStatusChange={setFilterStatus}
          onPriorityChange={setFilterPriority}
          onClear={resetFilters}
        />
      )}

      {/* Active Filter Banner */}
      {isFilterActive && (
        <div className="flex items-center justify-between px-1 text-[10px] font-mono text-muted select-none animate-in fade-in duration-200">
          <div className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
            <span>
              FILTERING ACTIVE (SHOWING {sortedIdeas.length} OF {totalCount})
            </span>
          </div>
          <button
            type="button"
            onClick={resetFilters}
            className="text-accent hover:text-accent/80 font-bold uppercase tracking-wider cursor-pointer transition-colors"
          >
            CLEAR_FILTERS
          </button>
        </div>
      )}

      {/* Ideas Card List or Empty State */}
      {isRefreshing ? (
        <div className="space-y-3 animate-pulse">
          {[1, 2, 3].map((i) => (
            <div key={i} className="border border-edge rounded-xl bg-surface overflow-hidden">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5">
                <div className="space-y-3 flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <div className="h-5 w-20 rounded-md bg-edge" />
                    <div className="w-1.5 h-1.5 rounded-full bg-edge hidden sm:block" />
                    <div className="h-3 w-24 rounded bg-edge" />
                  </div>
                  <div className="space-y-2">
                    <div className="h-4 w-3/4 rounded bg-edge" />
                    <div className="h-3 w-1/2 rounded bg-edge" />
                  </div>
                </div>
                <div className="flex items-center gap-6 self-start sm:self-center shrink-0">
                  <div className="flex flex-col items-end gap-2">
                    <div className="h-2 w-8 rounded bg-edge" />
                    <div className="h-3 w-12 rounded bg-edge" />
                  </div>
                  <div className="w-px h-8 bg-edge hidden sm:block" />
                  <div className="flex flex-col items-end gap-2">
                    <div className="h-2 w-8 rounded bg-edge" />
                    <div className="h-5 w-16 rounded-md bg-edge" />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : sortedIdeas.length === 0 ? (
        totalCount === 0 ? (
          <div className="flex flex-col items-center justify-center p-12 border border-edge rounded-xl bg-surface/30 text-center space-y-4 animate-in fade-in duration-200">
            <div className="w-12 h-12 rounded-full bg-accent/5 border border-accent/20 flex items-center justify-center text-accent">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A5 5 0 0 0 8 8c0 1 .3 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5" />
                <path d="M9 18h6" />
                <path d="M10 22h4" />
              </svg>
            </div>
            <div className="space-y-1">
              <h3 className="text-xs font-mono font-bold text-foreground uppercase tracking-widest">
                VAULT_IS_EMPTY
              </h3>
              <p className="text-xs text-muted font-sans max-w-xs leading-relaxed">
                No ideas yet. Capture your first concept to start building your content pipeline.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setShowCreateModal(true)}
              className="px-4 py-2 rounded-lg bg-foreground hover:bg-[#ccc] text-background text-xs font-semibold font-sans transition-all cursor-pointer select-none flex items-center gap-1.5"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14" />
                <path d="M12 5v14" />
              </svg>
              Create your first idea
            </button>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center p-12 border border-edge rounded-xl bg-surface/30 text-center space-y-4 animate-in fade-in duration-200">
            <div className="w-12 h-12 rounded-full bg-surface-2 border border-edge flex items-center justify-center text-muted">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8" />
                <path d="m21 21-4.3-4.3" />
              </svg>
            </div>
            <div className="space-y-1">
              <h3 className="text-xs font-mono font-bold text-foreground uppercase tracking-widest">
                NO_MATCHING_IDEAS
              </h3>
              <p className="text-xs text-muted font-sans max-w-xs leading-relaxed">
                No matching ideas found for your current search or filter criteria.
              </p>
            </div>
            <button
              type="button"
              onClick={() => {
                resetFilters();
                setSearchQuery("");
              }}
              className="px-4 py-2 rounded-lg border border-edge hover:bg-surface-2 text-xs text-foreground font-semibold transition-all cursor-pointer select-none"
            >
              Clear search and filters
            </button>
          </div>
        )
      ) : (
        <div className="space-y-3">
          {sortedIdeas.map((idea) => (
            <Card
              key={idea.id}
              hoverable
              className="group cursor-pointer hover:shadow-sm hover:bg-surface-2/30 transition-all duration-150"
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
                    <h3 className="text-sm font-bold text-foreground group-hover:text-accent transition-colors duration-150">
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
                  <div className="flex items-center gap-2">
                    <div className="flex flex-col items-end gap-1">
                      <span className="text-[9px] font-mono text-subtle">STATE</span>
                      {getStatusBadge(idea.status)}
                    </div>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="12"
                      height="12"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="text-edge-strong opacity-0 group-hover:opacity-100 transition-opacity duration-150 -ml-1"
                    >
                      <path d="m9 18 6-6-6-6" />
                    </svg>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      <CreateIdeaModal
        isOpen={selectedIdea !== null || showCreateModal}
        initialIdea={selectedIdea}
        onClose={() => {
          setSelectedIdea(null);
          setShowCreateModal(false);
        }}
      />
    </div>
  );
};
