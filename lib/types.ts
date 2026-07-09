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

export function extractErrorMessage(err: unknown, fallback: string): string {
  if (err instanceof Error) return err.message;
  if (typeof err === "string") return err;
  if (err && typeof err === "object" && "message" in err && typeof (err as Record<string, unknown>).message === "string") {
    return (err as Record<string, string>).message;
  }
  return fallback;
}
