"use client";

import React from "react";

interface DeleteConfirmOverlayProps {
  isDeleting: boolean;
  onCancel: () => void;
  onConfirm: () => void;
}

export const DeleteConfirmOverlay: React.FC<DeleteConfirmOverlayProps> = ({
  isDeleting,
  onCancel,
  onConfirm,
}) => {
  return (
    <div className="absolute inset-0 bg-background/95 backdrop-blur-sm z-10 flex flex-col items-center justify-center p-6 text-center animate-in fade-in duration-200">
      <div className="space-y-4 flex flex-col items-center w-full max-w-sm">
        <div className="w-12 h-12 rounded-full bg-danger/10 border border-danger/30 flex items-center justify-center text-danger">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M3 6h18" />
            <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
            <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
          </svg>
        </div>
        <div className="space-y-1.5">
          <h3 className="font-mono text-xs font-bold uppercase text-danger tracking-widest">
            CONFIRM_DELETE_SEQUENCE
          </h3>
          <p className="text-[11px] text-muted font-sans leading-relaxed">
            This action is permanent and <span className="text-foreground font-semibold">cannot be undone</span>. The concept details and outline will be destroyed.
          </p>
        </div>

        <div className="flex items-center gap-3 w-full pt-2 select-none">
          <button
            type="button"
            disabled={isDeleting}
            onClick={onCancel}
            className="flex-1 px-3 py-1.5 rounded-lg border border-edge bg-transparent hover:bg-surface-2 text-xs text-muted hover:text-foreground font-semibold transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Cancel
          </button>
          <button
            type="button"
            disabled={isDeleting}
            onClick={onConfirm}
            className="flex-1 px-3 py-1.5 rounded-lg bg-danger hover:bg-danger/80 text-foreground text-xs font-semibold font-sans transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-1.5"
          >
            {isDeleting && (
              <svg
                className="animate-spin h-3.5 w-3.5 text-foreground"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
            )}
            <span>{isDeleting ? "Deleting..." : "Confirm Delete"}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
