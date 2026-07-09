"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { Idea, extractErrorMessage } from "@/lib/types";
import { CategorySelect } from "@/components/ui/category-select";
import { useToast } from "@/components/ui/toast";
import { DeleteConfirmOverlay } from "./delete-confirm-overlay";

interface CreateIdeaModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialIdea?: Idea | null;
}

const DEFAULT_FORM_VALUES = {
  title: "",
  description: "",
  category: "TWITTER",
  status: "BACKLOG",
  priority: "MEDIUM",
};

export const CreateIdeaModal: React.FC<CreateIdeaModalProps> = ({
  isOpen,
  onClose,
  initialIdea = null,
}) => {
  const router = useRouter();
  const { addToast } = useToast();

  const [title, setTitle] = useState(DEFAULT_FORM_VALUES.title);
  const [description, setDescription] = useState(DEFAULT_FORM_VALUES.description);
  const [category, setCategory] = useState(DEFAULT_FORM_VALUES.category);
  const [status, setStatus] = useState(DEFAULT_FORM_VALUES.status);
  const [priority, setPriority] = useState(DEFAULT_FORM_VALUES.priority);

  const titleRef = useRef<HTMLInputElement>(null);
  const isSubmittingRef = useRef(false);
  const isDeletingRef = useRef(false);

  const [isSaving, setIsSaving] = useState(false);

  // Deletion States
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // Synchronize form states for editing vs creation
  useEffect(() => {
    if (isOpen) {
      if (initialIdea) {
        setTitle(initialIdea.title);
        setDescription(initialIdea.content || "");
        setCategory(initialIdea.category || DEFAULT_FORM_VALUES.category);
        setStatus(initialIdea.status || DEFAULT_FORM_VALUES.status);
        setPriority(initialIdea.priority || DEFAULT_FORM_VALUES.priority);
      } else {
        setTitle(DEFAULT_FORM_VALUES.title);
        setDescription(DEFAULT_FORM_VALUES.description);
        setCategory(DEFAULT_FORM_VALUES.category);
        setStatus(DEFAULT_FORM_VALUES.status);
        setPriority(DEFAULT_FORM_VALUES.priority);
      }
      setShowDeleteConfirm(false);
      setIsDeleting(false);
      isSubmittingRef.current = false;
      isDeletingRef.current = false;
      requestAnimationFrame(() => titleRef.current?.focus());
    }
  }, [isOpen, initialIdea]);

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
      if (e.key === "Escape" && !isSaving && !isDeleting) {
        onClose();
      }
    };
    if (isOpen) {
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, isSaving, isDeleting, onClose]);

  if (!isOpen) return null;

  const resetForm = () => {
    setTitle(DEFAULT_FORM_VALUES.title);
    setDescription(DEFAULT_FORM_VALUES.description);
    setCategory(DEFAULT_FORM_VALUES.category);
    setStatus(DEFAULT_FORM_VALUES.status);
    setPriority(DEFAULT_FORM_VALUES.priority);
    setShowDeleteConfirm(false);
    setIsDeleting(false);
    isSubmittingRef.current = false;
    isDeletingRef.current = false;
  };

  const handleClose = () => {
    if (isSaving || isDeleting) return;
    resetForm();
    onClose();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmittingRef.current) return;
    if (!title.trim()) {
      addToast("Title is required.", "error");
      return;
    }

    isSubmittingRef.current = true;
    setIsSaving(true);

    try {
      if (initialIdea) {
        // Update existing concept row and verify count
        const { data, error } = await supabase
          .from("ideas")
          .update({
            title: title.trim(),
            content: description.trim() || null,
            category,
            status,
            priority,
          })
          .eq("id", initialIdea.id)
          .select();

        if (error) {
          throw error;
        }

        if (!data || data.length === 0) {
          throw new Error("Update failed. You may not have permission to modify this concept.");
        }
      } else {
        // Insert new concept row
        const { error } = await supabase.from("ideas").insert({
          title: title.trim(),
          content: description.trim() || null,
          category,
          status,
          priority,
        });

        if (error) {
          throw error;
        }
      }

      addToast(
        initialIdea ? "Concept updated successfully." : "Concept created successfully.",
        "success"
      );
      resetForm();
      router.refresh();
      onClose();
    } catch (err: unknown) {
      console.error("Error saving concept:", err);
      addToast(
        extractErrorMessage(err, "An unexpected error occurred while saving the concept."),
        "error"
      );
    } finally {
      setIsSaving(false);
      isSubmittingRef.current = false;
    }
  };

  const handleDelete = async () => {
    if (!initialIdea) return;
    if (isDeletingRef.current) return;
    isDeletingRef.current = true;
    setIsDeleting(true);

    try {
      // Delete concept row and verify deletion count
      const { data, error } = await supabase
        .from("ideas")
        .delete()
        .eq("id", initialIdea.id)
        .select();

      if (error) {
        throw error;
      }

      if (!data || data.length === 0) {
        throw new Error("Deletion failed. You may not have permission to delete this concept.");
      }

      addToast("Concept deleted successfully.", "success");
      resetForm();
      router.refresh();
      onClose();
    } catch (err: unknown) {
      console.error("Error deleting concept:", err);
      addToast(
        extractErrorMessage(err, "An unexpected error occurred while deleting the concept."),
        "error"
      );
    } finally {
      setIsDeleting(false);
      isDeletingRef.current = false;
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm transition-opacity duration-200"
      onClick={(e) => {
        if (e.target === e.currentTarget && !isSaving && !isDeleting) {
          handleClose();
        }
      }}
    >
      <div className="w-full max-w-lg bg-surface border border-edge rounded-xl shadow-2xl flex flex-col overflow-hidden relative animate-in fade-in zoom-in-95 duration-200">
        {showDeleteConfirm && (
          <DeleteConfirmOverlay
            isDeleting={isDeleting}
            onCancel={() => setShowDeleteConfirm(false)}
            onConfirm={handleDelete}
          />
        )}

        {/* Modal Header */}
        <div className="border-b border-edge px-5 py-4 flex items-center justify-between bg-surface">
          <div className="flex items-center gap-2">
            <span className={`w-2 h-2 rounded-full ${isSaving ? "bg-warning animate-pulse" : "bg-accent"}`} />
            <h2 className="text-xs font-bold font-mono tracking-wider uppercase text-foreground">
              {isSaving ? "SAVING_CONCEPT..." : initialIdea ? "EDIT_CONCEPT_DETAILS" : "NEW_CONCEPT_INITIALIZE"}
            </h2>
          </div>
          <button
            onClick={handleClose}
            disabled={isSaving || isDeleting}
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
        <form
          onSubmit={handleSubmit}
          onKeyDown={(e) => {
            if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
              e.preventDefault();
              e.currentTarget.requestSubmit();
            }
          }}
          className="flex flex-col"
        >
          <div className="p-6 space-y-5 max-h-[calc(100vh-10rem)] overflow-y-auto">
            {/* Title Input */}
            <div className="space-y-1.5">
              <label
                htmlFor="idea-title"
                className="block text-[10px] font-mono text-muted uppercase tracking-wider"
              >
                Concept Title <span className="text-accent">*</span>
              </label>
              <input
                ref={titleRef}
                id="idea-title"
                type="text"
                required
                disabled={isSaving}
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. 10 Mistakes I Made in my First Year of Coding"
                className="w-full bg-background border border-edge rounded-lg px-3.5 py-2.5 text-xs text-foreground placeholder-subtle focus:outline-none focus:border-muted font-sans transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
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
                className="w-full bg-background border border-edge rounded-lg px-3.5 py-2.5 text-xs text-foreground placeholder-subtle focus:outline-none focus:border-muted font-sans min-h-[100px] resize-y transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              />
            </div>

            {/* Metadata Grid (Category, Status, Priority) */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 pt-2">
              {/* Category Select */}
              <div className="space-y-1.5">
                <label
                  htmlFor="idea-category"
                  className="block text-[10px] font-mono text-muted uppercase tracking-wider"
                >
                  Category
                </label>
                <CategorySelect
                  id="idea-category"
                  disabled={isSaving}
                  value={category}
                  onChange={setCategory}
                />
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
                    className="w-full bg-background border border-edge rounded-lg px-3.5 py-2.5 pr-8 text-xs text-foreground focus:outline-none focus:border-muted font-sans appearance-none transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
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
                    className="w-full bg-background border border-edge rounded-lg px-3.5 py-2.5 pr-8 text-xs text-foreground focus:outline-none focus:border-muted font-sans appearance-none transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
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
            {initialIdea && (
              <button
                type="button"
                disabled={isSaving}
                onClick={() => setShowDeleteConfirm(true)}
                className="mr-auto px-3.5 py-1.5 rounded-lg border border-danger/20 hover:border-danger bg-transparent text-xs text-danger font-semibold transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Delete Concept
              </button>
            )}
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
              <span>{isSaving ? "Saving..." : initialIdea ? "Update Concept" : "Save Concept"}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
