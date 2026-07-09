"use client";

import React from "react";
import { SelectChevron } from "../ui/select-chevron";

interface IdeaVaultFiltersProps {
  filterCategory: string;
  filterStatus: string;
  filterPriority: string;
  availableCategories: string[];
  isFilterActive: boolean;
  onCategoryChange: (value: string) => void;
  onStatusChange: (value: string) => void;
  onPriorityChange: (value: string) => void;
  onClear: () => void;
}

export const IdeaVaultFilters: React.FC<IdeaVaultFiltersProps> = ({
  filterCategory,
  filterStatus,
  filterPriority,
  availableCategories,
  isFilterActive,
  onCategoryChange,
  onStatusChange,
  onPriorityChange,
  onClear,
}) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 p-4 border border-edge rounded-xl bg-surface/30 animate-in slide-in-from-top-2 duration-200">
      <div className="space-y-1">
        <label htmlFor="filter-category" className="block text-[9px] font-mono text-muted uppercase tracking-wider">
          Category
        </label>
        <div className="relative">
          <select
            id="filter-category"
            value={filterCategory}
            onChange={(e) => onCategoryChange(e.target.value)}
            className="w-full bg-background border border-edge rounded-lg px-2.5 py-1.5 pr-8 text-xs text-foreground focus:outline-none focus:border-muted font-sans appearance-none cursor-pointer"
          >
            <option value="ALL">ALL CATEGORIES</option>
            {availableCategories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
          <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none text-muted">
            <SelectChevron />
          </div>
        </div>
      </div>

      <div className="space-y-1">
        <label htmlFor="filter-status" className="block text-[9px] font-mono text-muted uppercase tracking-wider">
          Status
        </label>
        <div className="relative">
          <select
            id="filter-status"
            value={filterStatus}
            onChange={(e) => onStatusChange(e.target.value)}
            className="w-full bg-background border border-edge rounded-lg px-2.5 py-1.5 pr-8 text-xs text-foreground focus:outline-none focus:border-muted font-sans appearance-none cursor-pointer"
          >
            <option value="ALL">ALL STATUSES</option>
            <option value="BACKLOG">BACKLOG</option>
            <option value="EVALUATING">EVALUATING</option>
            <option value="DRAFTING">DRAFTING</option>
            <option value="READY">READY</option>
          </select>
          <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none text-muted">
            <SelectChevron />
          </div>
        </div>
      </div>

      <div className="space-y-1">
        <label htmlFor="filter-priority" className="block text-[9px] font-mono text-muted uppercase tracking-wider">
          Priority
        </label>
        <div className="relative">
          <select
            id="filter-priority"
            value={filterPriority}
            onChange={(e) => onPriorityChange(e.target.value)}
            className="w-full bg-background border border-edge rounded-lg px-2.5 py-1.5 pr-8 text-xs text-foreground focus:outline-none focus:border-muted font-sans appearance-none cursor-pointer"
          >
            <option value="ALL">ALL PRIORITIES</option>
            <option value="LOW">LOW</option>
            <option value="MEDIUM">MEDIUM</option>
            <option value="HIGH">HIGH</option>
          </select>
          <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none text-muted">
            <SelectChevron />
          </div>
        </div>
      </div>

      <div className="flex items-end">
        <button
          type="button"
          disabled={!isFilterActive}
          onClick={onClear}
          className="w-full py-1.5 rounded-lg border border-edge bg-transparent hover:bg-surface-2 text-xs text-muted hover:text-foreground font-semibold font-mono tracking-wider transition-all uppercase cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed select-none"
        >
          CLEAR_ALL
        </button>
      </div>
    </div>
  );
};
