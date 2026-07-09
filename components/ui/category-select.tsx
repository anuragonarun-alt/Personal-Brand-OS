"use client";

import React, { useEffect, useRef, useState } from "react";
import { supabase } from "@/lib/supabase";

interface CategorySelectProps {
  id?: string;
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  suggestions?: string[];
}

const DEFAULT_CATEGORIES = ["TWITTER", "YOUTUBE", "NEWSLETTER"];

export const CategorySelect: React.FC<CategorySelectProps> = ({
  id,
  value,
  onChange,
  disabled = false,
  suggestions,
}) => {
  const [fetchedSuggestions, setFetchedSuggestions] = useState<string[]>(
    suggestions ?? DEFAULT_CATEGORIES
  );
  const [isOpen, setIsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const containerRef = useRef<HTMLDivElement>(null);

  // Fetch distinct categories from Supabase when no suggestions are provided
  useEffect(() => {
    if (suggestions) {
      setFetchedSuggestions(suggestions);
      return;
    }
    let cancelled = false;
    const fetchCategories = async () => {
      try {
        const { data, error } = await supabase.from("ideas").select("category");
        if (error || cancelled) return;
        const unique = Array.from(
          new Set(
            data
              .map((row: { category: string | null }) => row.category)
              .filter((c): c is string => Boolean(c))
              .map((c) => c.toUpperCase())
          )
        ).sort();
        if (!cancelled && unique.length > 0) {
          setFetchedSuggestions(unique);
        }
      } catch {
        // keep defaults on failure
      }
    };
    fetchCategories();
    return () => {
      cancelled = true;
    };
  }, [suggestions]);

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const normalized = value.toUpperCase();
  const filtered = fetchedSuggestions.filter(
    (s) => s.length > 0 && s.includes(normalized)
  );

  const exactMatch = fetchedSuggestions.includes(normalized);
  const showCreateOption = normalized.length > 0 && !exactMatch;
  const totalOptions = filtered.length + (showCreateOption ? 1 : 0);

  const selectValue = (val: string) => {
    onChange(val.toUpperCase());
    setIsOpen(false);
    setActiveIndex(-1);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setIsOpen(true);
      setActiveIndex((prev) =>
        prev < totalOptions - 1 ? prev + 1 : 0
      );
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((prev) => (prev > 0 ? prev - 1 : totalOptions - 1));
    } else if (e.key === "Enter") {
      if (isOpen && totalOptions > 0) {
        e.preventDefault();
        if (activeIndex >= 0 && activeIndex < filtered.length) {
          selectValue(filtered[activeIndex]);
        } else if (showCreateOption && activeIndex === filtered.length) {
          selectValue(value);
        } else if (filtered.length > 0) {
          selectValue(filtered[0]);
        } else {
          selectValue(value);
        }
      }
    } else if (e.key === "Escape") {
      setIsOpen(false);
      setActiveIndex(-1);
    } else if (e.key === "Tab") {
      setIsOpen(false);
    }
  };

  return (
    <div ref={containerRef} className="relative">
      <input
        id={id}
        type="text"
        autoComplete="off"
        spellCheck={false}
        disabled={disabled}
        value={value}
        onChange={(e) => {
          onChange(e.target.value.toUpperCase());
          setIsOpen(true);
          setActiveIndex(-1);
        }}
        onFocus={() => setIsOpen(true)}
        onKeyDown={handleKeyDown}
        placeholder="TYPE OR SELECT..."
        className="w-full bg-background border border-edge rounded-lg px-3 py-2 pr-8 text-xs text-foreground placeholder-subtle focus:outline-none focus:border-muted font-sans transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      />
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

      {isOpen && totalOptions > 0 && (
        <div className="absolute z-50 top-full left-0 right-0 mt-1 bg-surface border border-edge rounded-lg shadow-2xl max-h-44 overflow-y-auto">
          {filtered.map((s, i) => (
            <button
              key={s}
              type="button"
              onClick={() => selectValue(s)}
              onMouseEnter={() => setActiveIndex(i)}
              className={`w-full text-left px-3 py-1.5 text-[11px] font-mono tracking-wider uppercase transition-colors cursor-pointer ${
                activeIndex === i
                  ? "bg-surface-2 text-accent"
                  : "text-foreground hover:bg-surface-2"
              }`}
            >
              {s}
            </button>
          ))}
          {showCreateOption && (
            <button
              type="button"
              onClick={() => selectValue(value)}
              onMouseEnter={() => setActiveIndex(filtered.length)}
              className={`w-full text-left px-3 py-1.5 text-[11px] font-mono tracking-wider uppercase transition-colors cursor-pointer border-t border-edge ${
                activeIndex === filtered.length
                  ? "bg-surface-2 text-accent"
                  : "text-muted hover:bg-surface-2"
              }`}
            >
              + {normalized}
            </button>
          )}
        </div>
      )}
    </div>
  );
};
