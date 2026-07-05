import { FolderTree, Plus } from "lucide-react";
import { setRequestLocale } from "next-intl/server";
import { getAdminCategoryGroups } from "@/lib/platform-data";
import { CATEGORY_GROUPS } from "@/lib/categories";
import { createCategory } from "@/lib/actions/platform";
import { PageHeader, Card, CardHeader } from "../_components";
import { Field } from "@/components/common";
import CategoryChip from "./CategoryChip";

const input = "field min-h-[42px] w-full rounded-lg border-[#E2E8F0] bg-white normal-case tracking-normal text-[#0B1C30]";

export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const groups = await getAdminCategoryGroups();

  return (
    <>
      <PageHeader
        eyebrow="Kategoriler"
        title="Dinamik Sektör Mimarisi"
        description="Ana kategori ve alt kırılımları yönetin. Kayıtlar veritabanından gelir; bir grupta DB kaydı yoksa varsayılan taksonomi referans olarak gösterilir."
      />

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
        <section className="grid gap-4">
          {groups.map((group) => {
            const defaults = CATEGORY_GROUPS.find((g) => g.key === group.key)?.children ?? [];
            return (
              <Card key={group.key} className="hover:translate-y-0">
                <CardHeader
                  title={group.label}
                  tone="blue"
                  icon={<FolderTree size={18} aria-hidden />}
                  action={<span className="shrink-0 text-[12px] font-semibold text-[#475569]">{group.children.length} alt kategori</span>}
                />
                <div className="p-5">
                  {group.children.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {group.children.map((child) => (
                        <CategoryChip key={child.id} id={child.id} label={child.label} locale={locale} />
                      ))}
                    </div>
                  ) : (
                    <div>
                      <p className="mb-2 text-[12px] font-semibold text-[#64748B]">
                        DB kaydı yok · varsayılan taksonomi (yönetmek için aşağıdan ekleyin):
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {defaults.map((c) => (
                          <span key={c.slug} className="rounded-full border border-dashed border-line bg-paper px-3 py-1.5 text-[12px] font-medium text-[#64748B]">
                            {c.label}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </Card>
            );
          })}
        </section>

        <aside>
          <Card className="hover:translate-y-0">
            <CardHeader title="Yeni Kategori" tone="emerald" icon={<Plus size={18} aria-hidden />} />
            <form action={createCategory} className="grid gap-3 p-5">
              <input type="hidden" name="locale" value={locale} />
              <Field label="Ana kategori" required>
                <select name="group" className={input}>
                  {groups.map((group) => <option key={group.key} value={group.key}>{group.label}</option>)}
                </select>
              </Field>
              <Field label="Alt kategori adı" required>
                <input name="label" required className={input} placeholder="Örn. Glamping" />
              </Field>
              <Field label="Slug" required>
                <input name="slug" required className={input} placeholder="glamping" />
              </Field>
              <button type="submit" className="mt-1 h-10 rounded-lg bg-[#0057D9] text-[13px] font-extrabold text-white hover:bg-[#0047B8]">
                Kategori Ekle
              </button>
            </form>
          </Card>
        </aside>
      </div>
    </>
  );
}
