import { createClient } from "@/lib/supabase/client";
import type { BusinessDocument } from "@/lib/types";
import { persistableDocuments } from "@/lib/business-document-shape";
import type { BusinessGroup } from "@/lib/supabase/database.types";

export type PanelDraftMedia = {
  cover: string;
  gallery: string[];
  documents: BusinessDocument[];
};

export async function upsertPanelDraftMedia(
  userId: string,
  draftKey: string,
  group: BusinessGroup,
  media: PanelDraftMedia
) {
  const supabase = createClient();
  const { error } = await supabase.from("business_drafts").upsert(
    {
      user_id: userId,
      draft_key: draftKey,
      group,
      cover_image: media.cover || null,
      gallery_images: media.gallery.slice(0, 12),
      documents: persistableDocuments(media.documents),
    },
    { onConflict: "user_id,draft_key" }
  );
  if (error) throw error;
}

export async function clearPanelDraftMedia(userId: string, draftKey: string) {
  const supabase = createClient();
  const { error } = await supabase
    .from("business_drafts")
    .delete()
    .eq("user_id", userId)
    .eq("draft_key", draftKey);
  if (error) throw error;
}
