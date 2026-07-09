"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

interface CreateIdeaModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CreateIdeaModal: React.FC<CreateIdeaModalProps> = ({
  isOpen,
  onClose,
}) => {
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("TWITTER");
  const [status, setStatus] = useState("BACKLOG");
  const [priority, setPriority] = useState("MEDIUM");

  const [isSaving, setIsSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Lock body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  // Handle ESC key press
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !isSaving) {
        onClose();
      }
    };
    if (isOpen) {
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, isSaving, onClose]);

  if (!isOpen) return null;

  const resetForm = () => {
    setTitle("");
    setDescription("");
    setCategory("TWITTER");
    setStatus("BACKLOG");
    setPriority("MEDIUM");
    setErrorMessage(null);
  };

  const handleClose = () => {
    if (isSaving) return;
    resetForm();
    onClose();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setErrorMessage("Title is required.");
      return;
    }

    setIsSaving(true);
    setErrorMessage(null);

    try {
      const { error } = await supabase.from("ideas").insert({
        title: title.trim(),
        content: description.trim() || null,
        category,
        status,
        priority,
        user_id: null,
      });

      if (error) {
        throw error;
      }

      resetForm();
      router.refresh();
      onClose();
    } catch (err: any) {
      console.error("Error saving concept:", err);
      setErrorMessage(
        err?.message || "An unexpected error occurred while saving the concept."
      );
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm transition-opacity duration-200"
      onClick={(e) => {
        if (e.target === e.currentTarget && !isSaving) {
          handleClose();
        }
      }}
    >
      <div className="w-full max-w-lg bg-surface border border-edge rounded-xl shadow-2xl flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Modal Header */}
        <div className="border-b border-edge px-5 py-4 flex items-center justify-between bg-surface">
          <div className="flex items-center gap-2">
            <span className={`w-2 h-2 rounded-full ${isSaving ? "bg-warning animate-pulse" : "bg-accent"}`} />
            <h2 className="text-xs font-bold font-mono tracking-wider uppercase text-foreground">
              {isSaving ? "SAVING_CONCEPT..." : "NEW_CONCEPT_INITIALIZE"}
            </h2>
          </div>
          <button
            onClick={handleClose}
            disabled={isSaving}
            className="p-1 rounded-md border border-edge hover:border-edge-strong bg-surface-2 hover:bg-surface text-muted hover:text-foreground transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            aria-label="Close modal"
          >
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
            >
              <line x1="18" y1="6" x2="6" y2="18" strokeLinecap="round" />
              <line x1="6" y1="6" x2="18" y2="18" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        {/* Modal Form */}
        <form onSubmit={handleSubmit} className="flex flex-col">
          <div className="p-5 space-y-4 max-h-[calc(100vh-10rem)] overflow-y-auto">
            {/* Error Message */}
            {errorMessage && (
              <div className="bg-danger/5 border border-danger/20 rounded-lg p-3 text-xs text-danger font-medium font-sans">
                {errorMessage}
              </div>
            )}

            {/* Title Input */}
            <div className="space-y-1.5">
              <label
                htmlFor="idea-title"
                className="block text-[10px] font-mono text-muted uppercase tracking-wider"
              >
                Concept Title <span className="text-accent">*</span>
              </label>
              <input
                id="idea-title"
                type="text"
                required
                disabled={isSaving}
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. 10 Mistakes I Made in my First Year of Coding"
                className="w-full bg-background border border-edge rounded-lg px-3 py-2 text-xs text-foreground placeholder-subtle focus:outline-none focus:border-muted font-sans transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              />
            </div>

            {/* Description Textarea */}
            <div className="space-y-1.5">
              <label
                htmlFor="idea-description"
                className="block text-[10px] font-mono text-muted uppercase tracking-wider"
              >
                Outline & Notes
              </label>
              <textarea
                id="idea-description"
                disabled={isSaving}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Outline the core concepts, references, and messaging..."
                rows={5}
                className="w-full bg-background border border-edge rounded-lg px-3 py-2 text-xs text-foreground placeholder-subtle focus:outline-none focus:border-muted font-sans min-h-[100px] resize-y transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              />
            </div>

            {/* Metadata Grid (Category, Status, Priority) */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-1">
              {/* Category Select */}
              <div className="space-y-1.5">
                <label
                  htmlFor="idea-category"
                  className="block text-[10px] font-mono text-muted uppercase tracking-wider"
                >
                  Category
                </label>
                <div className="relative">
                  <select
                    id="idea-category"
                    disabled={isSaving}
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full bg-background border border-edge rounded-lg px-3 py-2 pr-8 text-xs text-foreground focus:outline-none focus:border-muted font-sans appearance-none transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <option value="TWITTER">TWITTER</option>
                    <option value="YOUTUBE">YOUTUBE</option>
                    <option value="NEWSLETTER">NEWSLETTER</option>
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center pr-2.5 pointer-events-none text-muted">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="10"
                      height="10"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="m6 9 6 6 6-6" />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Status Select */}
              <div className="space-y-1.5">
                <label
                  htmlFor="idea-status"
                  className="block text-[10px] font-mono text-muted uppercase tracking-wider"
                >
                  Status
                </label>
                <div className="relative">
                  <select
                    id="idea-status"
                    disabled={isSaving}
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    className="w-full bg-background border border-edge rounded-lg px-3 py-2 pr-8 text-xs text-foreground focus:outline-none focus:border-muted font-sans appearance-none transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <option value="BACKLOG">BACKLOG</option>
                    <option value="EVALUATING">EVALUATING</option>
                    <option value="DRAFTING">DRAFTING</option>
                    <option value="READY">READY</option>
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center pr-2.5 pointer-events-none text-muted">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="10"
                      height="10"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="m6 9 6 6 6-6" />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Priority Select */}
              <div className="space-y-1.5">
                <label
                  htmlFor="idea-priority"
                  className="block text-[10px] font-mono text-muted uppercase tracking-wider"
                >
                  Priority
                </label>
                <div className="relative">
                  <select
                    id="idea-priority"
                    disabled={isSaving}
                    value={priority}
                    onChange={(e) => setPriority(e.target.value)}
                    className="w-full bg-background border border-edge rounded-lg px-3 py-2 pr-8 text-xs text-foreground focus:outline-none focus:border-muted font-sans appearance-none transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <option value="LOW">LOW</option>
                    <option value="MEDIUM">MEDIUM</option>
                    <option value="HIGH">HIGH</option>
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center pr-2.5 pointer-events-none text-muted">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="10"
                      height="10"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="m6 9 6 6 6-6" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Modal Footer */}
          <div className="border-t border-edge px-5 py-4 bg-surface-2/40 flex items-center justify-end gap-3 select-none">
            <button
              type="button"
              onClick={handleClose}
              disabled={isSaving}
              className="px-3.5 py-1.5 rounded-lg border border-edge bg-transparent hover:bg-surface-2 text-xs text-muted hover:text-foreground font-semibold transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="px-3.5 py-1.5 rounded-lg bg-foreground hover:bg-[#ccc] text-background text-xs font-semibold font-sans transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1.5"
            >
              {isSaving && (
                <svg
                  className="animate-spin h-3.5 w-3.5 text-background"
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
              <span>{isSaving ? "Saving..." : "Save Concept"}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
