import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { isAdminUser } from "@/lib/supabase/admin";
import {
  getBlogPosts,
  getCourses,
  getFaqs,
  getGallery,
  getOffers,
  getServices,
  getTestimonials,
} from "@/lib/content";
import { Shell } from "@/components/admin/Shell";
import Link from "next/link";
import { ENTITIES } from "./config";

// Auth-dependent: never prerender.
export const dynamic = "force-dynamic";

type Stat = { label: string; count: number; hint: string };

export default async function AdminDashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Defense in depth — middleware already gates this, but verify again here
  // and enforce admin membership (the membership check needs the server).
  if (!user) redirect("/admin/login");
  if (!(await isAdminUser(user.id))) {
    await supabase.auth.signOut();
    redirect("/admin/login?error=not-admin");
  }

  // Live counts from the content layer.
  const [courses, services, testimonials, offers, blog, gallery, faqs] =
    await Promise.all([
      getCourses(),
      getServices(),
      getTestimonials(),
      getOffers(),
      getBlogPosts(),
      getGallery(),
      getFaqs(),
    ]);

  const stats: Stat[] = [
    { label: "Courses", count: courses.length, hint: "Training programmes" },
    { label: "Services", count: services.length, hint: "Salon services" },
    { label: "Testimonials", count: testimonials.length, hint: "Student reviews" },
    { label: "Offers", count: offers.length, hint: "Live promotions" },
    { label: "Blog posts", count: blog.length, hint: "Published articles" },
    { label: "Gallery items", count: gallery.length, hint: "Photos & videos" },
    { label: "FAQs", count: faqs.length, hint: "Questions answered" },
  ];

  return (
    <Shell>
      <div className="mx-auto max-w-content py-4">
        <header className="flex flex-col gap-2 border-b border-ink-border pb-6">
          <p className="text-xs uppercase tracking-luxe text-gold-300">
            Admin dashboard
          </p>
          <h1 className="font-display text-3xl text-cream">
            Kalai&apos;s Beauty Care &amp; Academy
          </h1>
          <p className="mt-1 text-sm text-cream-muted">
            Signed in as{" "}
            <span className="font-medium text-cream">{user.email}</span>
          </p>
        </header>

        <section className="mt-8">
          <h2 className="font-display text-xl text-cream">Content overview</h2>
          <p className="mt-1 text-sm text-cream-muted">
            A live snapshot of the site content.
          </p>

          <div className="mt-5 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {stats.map((s) => (
              <div
                key={s.label}
                className="rounded-3xl border border-ink-border bg-ink-surface p-5 shadow-soft"
              >
                <div className="font-display text-3xl text-gold-200">
                  {s.count}
                </div>
                <div className="mt-1 text-sm font-medium text-cream">
                  {s.label}
                </div>
                <div className="text-xs text-cream-dim">{s.hint}</div>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-10">
          <h2 className="font-display text-xl text-cream">Quick Manage</h2>
          <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[
              { id: "courses", title: "Courses", desc: ENTITIES.courses.label },
              { id: "services", title: "Services", desc: ENTITIES.services.label },
              { id: "gallery", title: "Gallery", desc: ENTITIES.gallery.label },
              { id: "offers", title: "Offers", desc: ENTITIES.offers.label },
              { id: "testimonials", title: "Testimonials", desc: ENTITIES.testimonials.label },
              { id: "blog_posts", title: "Blog", desc: ENTITIES.blog_posts.label },
              { id: "faqs", title: "FAQs", desc: ENTITIES.faqs.label },
            ].map((c) => (
              <Link
                key={c.id}
                href={`/admin/${c.id}`}
                className="rounded-3xl border border-ink-border bg-ink-surface p-6 shadow-soft transition-colors hover:border-gold-500/40"
              >
                <div className="font-display text-lg text-cream">{c.title}</div>
                <p className="mt-1 text-sm text-cream-muted">{c.desc}</p>
                <span className="mt-4 inline-block text-xs font-semibold text-gold-200">
                  Manage →
                </span>
              </Link>
            ))}
            <Link
              href="/admin/enquiries"
              className="rounded-3xl border border-ink-border bg-ink-surface p-6 shadow-soft transition-colors hover:border-gold-500/40"
            >
              <div className="font-display text-lg text-cream">Enquiries</div>
              <p className="mt-1 text-sm text-cream-muted">View and export form submissions.</p>
              <span className="mt-4 inline-block text-xs font-semibold text-gold-200">
                View →
              </span>
            </Link>
          </div>
        </section>
      </div>
    </Shell>
  );
}
