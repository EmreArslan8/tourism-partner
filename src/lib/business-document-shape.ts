import type { BusinessDocument } from "@/lib/types";

export const BUSINESS_DOCUMENTS_BUCKET = "business-documents";

function normalizeDoc(input: unknown): BusinessDocument | null {
  if (!input || typeof input !== "object") return null;
  const item = input as Record<string, unknown>;
  const kind = typeof item.kind === "string" ? item.kind.slice(0, 80) : "";
  const name = typeof item.name === "string" ? item.name.slice(0, 240) : "";
  const path = typeof item.path === "string" ? item.path : undefined;
  const url = typeof item.url === "string" ? item.url : undefined;
  if (!kind || !name || (!path && !url)) return null;
  return { kind, name, ...(path ? { path } : {}), ...(url ? { url } : {}) };
}

export function normalizeDocuments(input: unknown): BusinessDocument[] {
  if (!Array.isArray(input)) return [];
  return input.map(normalizeDoc).filter((doc): doc is BusinessDocument => Boolean(doc)).slice(0, 20);
}

export function persistableDocuments(input: BusinessDocument[]): BusinessDocument[] {
  return input
    .map((doc): BusinessDocument | null => {
      if (doc.path) return { kind: doc.kind, name: doc.name, path: doc.path };
      if (doc.url) return { kind: doc.kind, name: doc.name, url: doc.url };
      return null;
    })
    .filter((doc): doc is BusinessDocument => Boolean(doc))
    .slice(0, 20);
}
