import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import type { Locale } from "@/i18n/routing";
import { getBlogPosts } from "@/lib/content";
import { pick } from "@/lib/locale";
import { buildMetadata } from "@/lib/seo";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { Placeholder } from "@/components/ui/Placeholder";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const l = locale as Locale;
  const t = await getTranslations({ locale, namespace: "seo" });
  return buildMetadata({
    locale: l,
    path: "/blog",
    title: t("blogTitle"),
    description: t("blogDescription"),
  });
}

export default async function BlogPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const l = locale as Locale;

  const t = await getTranslations("blog");
  const posts = await getBlogPosts();

  return (
    <section className="py-section">
      <div className="container-luxe">
        <SectionHeading eyebrow={t("title")} title={t("title")} subtitle={t("subtitle")} as="h1" />

        {posts.length === 0 ? (
          <p className="mt-16 text-center text-cream-muted">{t("empty")}</p>
        ) : (
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {posts.map((post, i) => (
              <Reveal key={post.id} delay={(i % 3) * 0.06}>
                <Link
                  href={`/blog/${post.slug}`}
                  prefetch={false}
                  className="group flex h-full flex-col overflow-hidden rounded-3xl border border-ink-border bg-ink-surface transition hover:border-gold-500/40"
                >
                  <Placeholder src={post.cover.src} alt={pick(post.cover.alt, l)} ratio="aspect-[16/9]" />
                  <div className="flex flex-1 flex-col p-6">
                    <time className="text-xs uppercase tracking-luxe text-cream-dim">
                      {new Intl.DateTimeFormat(l === "ta" ? "ta-IN" : "en-IN", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      }).format(new Date(post.publishedAt))}
                    </time>
                    <h2 className="heading-display mt-2 text-xl text-cream transition-colors group-hover:text-gold-200">
                      {pick(post.title, l)}
                    </h2>
                    <p className="mt-2 flex-1 text-sm leading-relaxed text-cream-muted">
                      {pick(post.excerpt, l)}
                    </p>
                    <span className="mt-4 text-sm text-gold-200">{t("readArticle")} →</span>
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
