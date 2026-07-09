"use client";

import React, { useState } from "react";
import { PlusIcon } from "@/components/ui/icons";
import { CreateIdeaModal } from "./create-idea-modal";

export const IdeaVaultActions: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-foreground hover:bg-[#ccc] text-background text-xs font-semibold font-sans transition-all cursor-pointer"
      >
        <PlusIcon size={12} className="stroke-[2]" />
        <span>New Concept</span>
      </button>

      <CreateIdeaModal isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </>
  );
};
