import React from "react";
import { supabase } from "@/lib/supabase";
import { PageHeader } from "@/components/ui/page-header";
import { IdeaVaultActions } from "@/components/idea-vault/idea-vault-actions";
import { IdeaVaultList } from "@/components/idea-vault/idea-vault-list";

export default async function IdeasPage() {
  const { data: ideas, error } = await supabase
    .from("ideas")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error(error);
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <PageHeader
        title="Idea Vault"
        description="Capture, analyze, and score content concepts with signal filters."
        actions={<IdeaVaultActions />}
      />

      {/* Ideas Dashboard List */}
      <IdeaVaultList ideas={ideas ?? []} />
    </div>
  );
}
