import React from "react";

function SkeletonCard() {
  return (
    <div className="border border-edge rounded-xl bg-surface overflow-hidden animate-pulse">
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
  );
}

export default function IdeasLoading() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between border-b border-edge pb-4 mb-6">
        <div className="space-y-1 animate-pulse">
          <div className="h-7 w-40 rounded bg-edge" />
          <div className="h-4 w-96 max-w-full rounded bg-edge" />
        </div>
        <div className="h-8 w-28 rounded-lg bg-edge animate-pulse mt-3 sm:mt-0" />
      </div>
      <div className="space-y-3">
        <SkeletonCard />
        <SkeletonCard />
        <SkeletonCard />
        <SkeletonCard />
      </div>
    </div>
  );
}
