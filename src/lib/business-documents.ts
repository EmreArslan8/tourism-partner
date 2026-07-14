import { createClient } from "@/lib/supabase/server";
import type { BusinessDocument } from "@/lib/types";
import { BUSINESS_DOCUMENTS_BUCKET, normalizeDocuments } from "@/lib/business-document-shape";
export { BUSINESS_DOCUMENTS_BUCKET, normalizeDocuments, persistableDocuments } from "@/lib/business-document-shape";

type SupabaseServer = Awaited<ReturnType<typeof createClient>>;

export async function withSignedDocumentUrls(
  supabase: SupabaseServer,
  input: unknown,
  expiresIn = 60 * 60,
): Promise<BusinessDocument[]> {
  const docs = normalizeDocuments(input);
  return Promise.all(
    docs.map(async (doc) => {
      if (!doc.path) return doc;
      const { data, error } = await supabase
        .storage
        .from(BUSINESS_DOCUMENTS_BUCKET)
        .createSignedUrl(doc.path, expiresIn);
      return error || !data?.signedUrl ? doc : { ...doc, url: data.signedUrl };
    }),
  );
}
