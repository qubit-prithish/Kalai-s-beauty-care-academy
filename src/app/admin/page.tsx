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
import { signOut } from "./actions";

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

  // Live counts from the content layer (today: typed mock modules; the same
  // interface will return Supabase rows once the data layer is swapped over).
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
    <div className="mx-auto max-w-content px-gutter py-10">
      <header className="flex flex-col gap-4 border-b border-ink-border pb-6 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs uppercase tracking-luxe text-gold-300">
            Admin dashboard
          </p>
          <h1 className="mt-2 font-display text-3xl text-cream">
            Kalai&apos;s Beauty Care &amp; Academy
          </h1>
          <p className="mt-1 text-sm text-cream-muted">
            Signed in as{" "}
            <span className="font-medium text-cream">{user.email}</span>
          </p>
        </div>

        <form action={signOut}>
          <button
            type="submit"
            className="inline-flex items-center justify-center gap-2 rounded-full border border-gold-500/60 px-5 py-2.5 text-sm font-semibold text-gold-200 transition-colors hover:border-gold-400 hover:bg-gold-500/10"
          >
            Sign out
          </button>
        </form>
      </header>

      <section className="mt-8">
        <h2 className="font-display text-xl text-cream">Content overview</h2>
        <p className="mt-1 text-sm text-cream-muted">
          A live snapshot of the site content. Management screens for each
          collection plug in here.
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
        <h2 className="font-display text-xl text-cream">Manage</h2>
        <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[
            { title: "Courses & Services", desc: "Edit programmes, prices and syllabi." },
            { title: "Gallery", desc: "Upload and organize photos and videos." },
            { title: "Offers & Banners", desc: "Schedule promotions and the homepage popup." },
            { title: "Testimonials & Blog", desc: "Publish reviews and articles." },
            { title: "Enquiries", desc: "View and export enquiries from the contact form." },
            { title: "Settings & NAP", desc: "Hours, contact details and social links." },
          ].map((c) => (
            <div
              key={c.title}
              className="rounded-3xl border border-ink-border bg-ink-surface p-6 shadow-soft"
            >
              <div className="font-display text-lg text-cream">{c.title}</div>
              <p className="mt-1 text-sm text-cream-muted">{c.desc}</p>
              <span className="mt-4 inline-block rounded-full border border-ink-border px-3 py-1 text-xs text-cream-dim">
                Coming soon
              </span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
