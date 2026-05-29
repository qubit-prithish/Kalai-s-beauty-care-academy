import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { routing, type Locale } from "@/i18n/routing";
import { getBlogPostBySlug, getBlogPosts } from "@/lib/content";
import { pick } from "@/lib/locale";
import { buildMetadata } from "@/lib/seo";
import { breadcrumbJsonLd } from "@/lib/jsonld";
import { JsonLd } from "@/components/seo/JsonLd";
import { Placeholder } from "@/components/ui/Placeholder";

export async function generateStaticParams() {
  const posts = await getBlogPosts();
  return routing.locales.flatMap((locale) =>
    posts.map((p) => ({ locale, slug: p.slug })),
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  const post = await getBlogPostBySlug(slug);
  if (!post) return {};
  const l = locale as Locale;
  return buildMetadata({
    locale: l,
    path: `/blog/${slug}`,
    title: pick(post.title, l),
    description: pick(post.excerpt, l),
    imageAlt: pick(post.cover.alt, l),
    type: "article",
  });
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const l = locale as Locale;

  const post = await getBlogPostBySlug(slug);
  if (!post) notFound();

  const t = await getTranslations("blog");
  const tb = await getTranslations("breadcrumb");

  return (
    <article className="py-section">
      <JsonLd
        data={breadcrumbJsonLd(
          [
            { name: tb("home"), path: "/" },
            { name: t("title"), path: "/blog" },
            { name: pick(post.title, l), path: `/blog/${slug}` },
          ],
          l,
        )}
      />
      <div className="container-luxe max-w-3xl">
        <Link href="/blog" prefetch={false} className="text-sm text-cream-dim transition hover:text-gold-200">
          ← {t("backToBlog")}
        </Link>
        <time className="mt-6 block text-xs uppercase tracking-luxe text-cream-dim">
          {t("published")}:{" "}
          {new Intl.DateTimeFormat(l === "ta" ? "ta-IN" : "en-IN", {
            day: "numeric",
            month: "long",
            year: "numeric",
          }).format(new Date(post.publishedAt))}
        </time>
        <h1 className="heading-display mt-2 text-3xl text-cream sm:text-4xl">
          {pick(post.title, l)}
        </h1>
        <div className="mt-8 overflow-hidden rounded-3xl border border-ink-border">
          <Placeholder src={post.cover.src} alt={pick(post.cover.alt, l)} ratio="aspect-[16/9]" />
        </div>
        <div className="prose-luxe mt-8 space-y-4 leading-relaxed text-cream-muted">
          {pick(post.body, l)
            .split("\n")
            .filter(Boolean)
            .map((para, i) => (
              <p key={i}>{para}</p>
            ))}
        </div>
      </div>
    </article>
  );
}
