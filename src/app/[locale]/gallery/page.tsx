import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import type { Locale } from "@/i18n/routing";
import { getGallery, getGalleryCategories } from "@/lib/content";
import { pick } from "@/lib/locale";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { GalleryGrid } from "@/components/sections/GalleryGrid";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "gallery" });
  return { title: t("title"), description: t("subtitle") };
}

export default async function GalleryPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const l = locale as Locale;

  const t = await getTranslations("gallery");
  const [items, categories] = await Promise.all([getGallery(), getGalleryCategories()]);

  return (
    <section className="py-section">
      <div className="container-luxe">
        <SectionHeading eyebrow={t("title")} title={t("title")} subtitle={t("subtitle")} as="h1" />

        {items.length === 0 ? (
          <p className="mt-16 text-center text-cream-muted">{t("empty")}</p>
        ) : (
          <div className="mt-12">
            <GalleryGrid
              items={items.map((g) => ({
                id: g.id,
                type: g.type,
                src: g.src,
                before: g.before,
                after: g.after,
                caption: pick(g.caption, l),
                category: g.category,
              }))}
              categories={categories.map((c) => ({ id: c.id, label: pick(c.label, l) }))}
              allLabel={t("all")}
              beforeLabel={t("before")}
              afterLabel={t("after")}
              videoLabel={t("video")}
            />
          </div>
        )}
      </div>
    </section>
  );
}
