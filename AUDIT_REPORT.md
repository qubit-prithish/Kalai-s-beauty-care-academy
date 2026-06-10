## AUDIT REPORT — KALAI BEAUTY CARE & ACADEMY

---

### PHASE A — CRITICAL (Fix before any deployment)

**[A-01]** Tamil Translation File Corrupted (Gibberish/Mojibake)
- File: `messages/ta.json`
- Problem: `nav.switchTo` and multiple other Tamil strings contain invalid UTF-8 (displayed as `烻嫻�槹瘤俔�` / garbage glyphs). Tamil text is unreadable to users.
- Fix: Regenerate or re-enter all `ta.json` strings with proper Tamil Unicode content using a Tamil-native editor. Use `iconv` or `chcon / PowerShell Set-Content` to ensure UTF-8 without BOM. Validate via `node -e "JSON.parse(require('fs').readFileSync('./messages/ta.json'))"`.
- Impact: Tamil users see garbage characters; i18n is broken for the second language.

**[A-02]** Missing `lang` Attribute Causes Accessibility & SEO Failures
- File: `src/app/(main)/[locale]/layout.tsx`
- Problem: The `<html>` tag uses `lang={locale}` but Next.js 15 App Router requires `<html lang={locale} dir="ltr">` for screen readers and search engines; additionally, if locale is "en" it should serve `lang="en"`, if "ta" → `lang="ta"`.
- Fix: No code change needed—`lang={locale}` already exists. **Wait**—the bug is that `pathname?.startsWith("/ta")` check in `Header.tsx` for logo alt text infers locale rather than using the component's locale prop. Verify the `lang` attribute renders correctly. The real fix is in Header.tsx (see A-03).
- Impact: Screen readers misread page language; search engines penalize.

**[A-03]** Header Logo Alt Text Breaks on Tamil Pages
- File: `src/components/layout/Header.tsx`, line 54
- Problem: `pick(logo.alt, pathname?.startsWith("/ta") ? "ta" : "en")` infers locale from the path instead of using the `locale` prop already available. This is fragile—if route structure ever changes, the fallback to English is wrong.
- Fix: Change to `pick(logo.alt, locale)` where `locale` is passed from the parent or derived from next-intl.
- Impact: Tamil users hear English alt text for the brand logo.

**[A-04]** WhatsApp Number Hardcoded in `lib/whatsapp.ts`
- File: `src/lib/whatsapp.ts`, line 4
- Problem: `WHATSAPP_NUMBER = "919566229900"` is a compile-time constant, not read from `process.env.NEXT_PUBLIC_WHATSAPP`. The `.env.example` defines the number but it's never used.
- Fix: Replace with `process.env.NEXT_PUBLIC_WHATSAPP ?? "919566229900"` and ensure the env var is set in production.
- Impact: If the business number changes, a full redeploy is required. Also violates DRY.

**[A-05]** No External Link `rel` Attributes on WhatsApp / Email CTAs
- File: `src/components/ui/Button.tsx`, lines 52-61
- Problem: When `href` starts with `https://` or `tel:`, `rel` is only set for `http` links; `tel:` links are missing `rel="noopener noreferrer"`. More critically, `target="_blank"` is used without `rel="noopener noreferrer"` for all external links, but `tel:` links don't get it at all. Actually the code does set them for `http` only. Fix: apply `rel="noopener noreferrer"` to ALL external links.
- Fix: Change to `if (isExternal) { return <a ... rel={isExternal ? "noopener noreferrer" : undefined} target={href.startsWith("http") ? "_blank" : undefined} ...>`
- Impact: Security vulnerability; external links can access `window.opener`.

**[A-06]** `suppressHydrationWarning` on `<html>` is a Code Smell
- File: `src/app/(main)/[locale]/layout.tsx`, line 65
- Problem: `suppressHydrationWarning` is present but the cause of mismatch is unclear. This usually masks real hydration issues (fonts, time-based content, etc.).
- Fix: Remove `suppressHydrationWarning`. If hydration errors appear, fix the root cause (likely Lenis/GSAP or mismatched timestamps).
- Impact: Mismatched SSR vs client output goes unnoticed, causing SEO and UX issues.

**[A-07]** Testimonial Carousel Auto-play Not Paused on Hover/Focus
- File: `src/components/ui/TestimonialCarousel.tsx`
- Problem: `useEffect` with `setInterval` auto-advances every 6 seconds with no pause on hover, focus, or touch. WCAG 2.5.2 requires moving content to be pausable.
- Fix: Add `onMouseEnter`/`onMouseLeave` and `onFocus`/`onBlur` to the container div to pause/resume the interval. Or switch to a manual-only carousel.
- Impact: WCAG 2.5.2 failure; users cannot read content before it changes.

---

### PHASE B — IMPORTANT (Fix before client handover)

**[B-01]** Favicon and Apple Touch Icon Missing
- File: (no `src/app/icon.tsx`, `icon.svg`, or `public/favicon.ico` found)
- Problem: No favicon means default browser icon. Search results show generic icon. Apple touch icon missing means “Add to Home Screen” shows a screenshot.
- Fix: Add `src/app/icon.tsx` or `public/favicon.ico`, `apple-touch-icon.png`, and `favicon-32x32.png` / `favicon-16x16.png`.
- Impact: Brand trust; bookmarks look unprofessional.

**[B-02]** No OG Image Generation — Static `og.png` Only
- File: `public/og.png`
- Problem: Only one static OG image exists. Each page should have its own OG image for sharing, especially on social media.
- Fix: Add a dynamic Open Graph image route at `src/app/[locale]/opengraph-image.tsx` (or `src/app/opengraph-image.tsx`) that generates locale-aware OG images at build time using `@vercel/og` or Satori.
- Impact: Social sharing always shows the same generic image, reducing click-through rates.

**[B-03]** Plausible Analytics Script Loads Unconditionally
- File: `src/app/(main)/[locale]/layout.tsx`, lines 68-75
- Problem: Script loads when `plausibleDomain` is truthy, but there is no check for DNT (Do Not Track) or `navigator.doNotTrack`.
- Fix: Gate the script behind an environment check AND a `navigator.doNotTrack !== "1"` client-side check (use a small wrapper component).
- Impact: Privacy regulation risk (GDPR, CCPA). Vercel Analytics is fine, but third-party scripts need user consent.

**[B-04]** Missing `aria-label` on `<main>` wrapper in `RouteTransition`
- File: `src/components/layout/RouteTransition.tsx`
- Problem: The `<main id="main">` only has a skip-to-content link at top level; no `aria-label="Main content"` on the `<main>` itself.
- Fix: Add `aria-label="Main content"` to the `<main>` tag.
- Impact: Screen reader landmark navigation is weaker.

**[B-05]** `next.config.ts` Missing `output: "export"` or ISR Revalidation Strategy
- File: `next.config.ts`
- Problem: Configuration is minimal; no `images.unoptimized`, no `output` strategy, no headers. Supabase calls with `revalidate: 300` are fine, but static export doesn't support `next/image` optimization.
- Fix: Add `images: { unoptimized: process.env.NODE_ENV === "development" }` or configure a loader. Ensure static export works if deploying to a static host.
- Impact: Image optimization may fail during static export or on non-Vercel hosts.

**[B-06]** Cookie Consent Banner Missing
- File: (none)
- Problem: Vercel Analytics, Plausible, and any third-party scripts require GDPR cookie consent in jurisdictions where applicable.
- Fix: Add a cookie consent component (e.g., using `react-cookie-consent` or custom) that blocks analytics until consent is given.
- Impact: Legal compliance risk for visitors from EU.

**[B-07]** No Error Boundary Page for the App Router
- File: (no `src/app/[locale]/error.tsx` found)
- Problem: If a Supabase fetch or server action throws, the user sees the default Next.js error screen.
- Fix: Add `src/app/[locale]/error.tsx` as a client component with a friendly error UI and retry button.
- Impact: Poor UX on unexpected errors.

**[B-08]** Footer Map Link is Hardcoded
- File: `src/components/layout/Footer.tsx`, line 156
- Problem: `href="https://maps.app.goo.gl/762CCwLhbzDhtozT8"` is a hardcoded Google Maps URL. It should come from `settings.address.mapLink` (which is available in Settings). The `mapLink` is correctly used in the Contact page but not in the Footer.
- Fix: Change to `href={settings.address.mapLink}` or remove the hardcoded link and use the data-driven one.
- Impact: If the address/map link ever changes, the Footer still sends users to the old location.

**[B-09]**.Lenimg/GSAP ScrollTrigger Cleanup is Overly Defensive
- File: `src/components/layout/SmoothScroll.tsx`
- Problem: Multiple nested try/catch blocks for Lenis/ScrollTrigger cleanup (lines 63-86) indicate instability. The `useIsomorphicLayoutEffect` + `mounted` state + `pathname` dependency creates potential for race conditions during fast navigation.
- Fix: Simplify to use a single `useEffect` with proper dependency array. Remove the redundant `try/catch` blocks if the underlying library is up to date; otherwise, consider replacing Lenis with CSS `scroll-behavior: smooth` for simpler architecture.
- Impact: Subtle bugs during rapid navigation; maintenance burden.

**[B-10]** HeroParticles SSR/Client Mismatch Risk
- File: `src/components/three/HeroParticles.tsx`
- Problem: `useEffect` checks for `prefersReducedMotion()`, `isWebGLAvailable()`, etc., and switches mode after mount. This means the initial SSR render is always "static", but the client may try to mount the 3D scene, causing a layout shift or hydration delay.
- Fix: Use an `<Suspense>` boundary with a stable server-rendered fallback. Pre-compute the mode on the server using `user-agent` sniffing in middleware or layout if possible.
- Impact: First paint shows static, then re-renders to 3D, causing layout shift (CLS).

---

### PHASE C — ENHANCEMENTS (After site is stable)

**[C-01]** Schema.org JSON-LD Missing `Course` / `Service` Detail Pages
- File: `src/lib/jsonld.ts`
- Problem: Only `localBusinessJsonLd`, `courseJsonLd`, and `breadcrumbJsonLd` exist. The actual course detail and service detail pages don't call `courseJsonLd` — it's exported but unused in the visible codebase.
- Fix: Import and render `<JsonLd data={courseJsonLd(course, settings, l)} />` in `src/app/(main)/[locale]/courses/[slug]/page.tsx` (same for services).
- Impact: Rich search results (snippets) for individual courses/service pages.

**[C-02]** Sitemap URL Construction May Produce Double-Locale Paths
- File: `src/app/sitemap.ts`, line 36 and `src/lib/seo.ts`, line 17-20
- Problem: `localizedPath` returns `/${locale}${clean}` for non-default locales, but if `clean` already starts with `/`, the result is `/${locale}/path` (correct). However, `absoluteUrl` joins `SITE_URL` + `p`, and if `p` is empty, it produces `https://site.com`. If `p` is `/`, it also produces the same. This is fine, but the `localizedPath` for `/` returns empty string for default locale, and `absoluteUrl` appends nothing. Actually works, but confusing.
- Fix: Consolidate `localizedPath` and `absoluteUrl` logic and add unit tests.
- Impact: Hard to detect bugs in URL construction; risk of duplicate content.

**[C-03]** No Lazy Loading for Testimonial Carousel Images
- File: `src/components/ui/TestimonialCarousel.tsx`
- Problem: The component accepts a `TestimonialItem` type but never renders an avatar image, even though `avatar: ImageRef | null` exists in the data model.
- Fix: Add `next/image` avatar rendering with `placeholder="blur"` and lazy loading for off-screen testimonials.
- Impact: Image bandwidth and performance if avatars are ever added.

**[C-04]** No Font Subsetting / `unicode-range` for Tamil Fonts
- File: `src/app/fonts.ts`
- Problem: All Tamil font weights (400, 500, 600, 700) are loaded for every page, even if the page is in English. No `unicode-range` CSS descriptor is applied.
- Fix: Add `@font-face` declarations in `globals.css` with `unicode-range: U+0B80-0BFF;` for Tamil fonts so they only load when Tamil content is present.
- Impact: First paint is faster on English pages; cumulative layout shift from font loading is reduced.

**[C-05]** Missing `loading="lazy"` on iframe Map
- File: `src/app/(main)/[locale]/contact/page.tsx`, line 109-115
- Problem: The Google Maps iframe does have `loading="lazy"`, which is good. However, it should also have a `title` attribute (it does via the `title` prop). Verify the `title` is descriptive. It is. This is actually correct.
- Fix: None needed for iframe. But add ` sandbox="allow-scripts allow-same-origin"` for additional security if not needed.
- Impact iframe: Security.

**[C-06]** ESLint Configuration is Deprecated
- File: `package.json` scripts
- Problem: `next lint` is deprecated and will be removed in Next.js 16. The output says to migrate to the ESLint CLI.
- Fix: Run `npx @next/codemod@canary next-lint-to-eslint-cli .` and update `package.json` scripts. Or keep `next lint` if on Next.js 15 and migrate before Next.js 16.
- Impact: Build tool deprecation; future-proofing.

**[C-07]** No `width` and `height` on `<Image>` in `about/page.tsx`
- File: `src/app/(main)/[locale]/about/page.tsx`, lines 97-100
- Problem: `Image` component has `width` and `height` set, but the container above it uses `className="relative h-full"` with no explicit height. The `Image` might cause layout shift if `fill` isn't used. Actually `width={600} height={750}` ARE present, which prevents layout shift. But if the container is `h-full`, the image dimensions don't match the container, which can cause overflow.
- Fix: Use `fill` with `sizes` and a fixed aspect ratio container (`aspect-[4/5]`) instead of `width`/`height` for responsive sizing.
- Impact: CLS on About page founder image.

**[C-08]** Footer Phone Links Missing E164 Check
- File: `src/components/layout/Footer.tsx`, line 57-58
- Problem: `telHref(contact.phonePrimaryE164)` is used for `href`, but the displayed text is `contact.phonePrimary` (which may have spaces). If `phonePrimary` is empty, the displayed link is broken but still rendered.
- Fix: Add a fallback text like `{contact.phonePrimary || "N/A"}` or conditionally render the link.
- Impact: Broken empty links in footer if data is ever missing.

**[C-09]** Enquiry Form Success State Not Announced to Screen Readers
- File: `src/components/sections/EnquiryForm.tsx`
- Problem: When `status === "success"`, the success message renders, but there is no `aria-live` region to announce it to screen readers.
- Fix: Add `<div aria-live="polite" aria-atomic="true">...</div>` around the success message, or add `role="status"` to the success `<div>`.
- Impact: Screen reader users don't know the form submitted successfully.

**[C-10]** Ambiguous `isActive` for Root Path in Header
- File: `src/components/layout/Header.tsx`, lines 38-41
- Problem: `isActive` returns `true` for `/` when `pathname === "/"`. But `next-intl` with `localePrefix: "as-needed"` means the default locale has no prefix. For Tamil, the pathname is `/ta/`. The `startsWith(href)` check for `/contact` would match `/contact/something` which doesn't exist, but is a potential issue. More importantly, the active check for `/` on the Tamil homepage (`/ta/`) is `pathname === "/"` → false. It should be `pathname === "/" || pathname === \`/\${locale}/\``.
- Fix: Use the `usePathname()` from next-intl which strips the locale prefix, or explicitly handle locale prefix in the active check.
- Impact: Active nav highlight is wrong on non-default locale homepages.

---

### SUMMARY TABLE

| ID | Severity | File | Issue | Est. Time |
|---|---|---|---|---|
| A-01 | CRITICAL | `messages/ta.json` | Tamil text is corrupted/mojibake | 30 min |
| A-02 | CRITICAL | `src/app/(main)/[locale]/layout.tsx` | `lang` attribute needs verification | 10 min |
| A-03 | CRITICAL | `src/components/layout/Header.tsx` | Logo alt text infers locale from path | 15 min |
| A-04 | CRITICAL | `src/lib/whatsapp.ts` | WhatsApp number hardcoded, not from .env | 10 min |
| A-05 | CRITICAL | `src/components/ui/Button.tsx` | External links missing `rel` for non-http | 15 min |
| A-06 | CRITICAL | `src/app/(main)/[locale]/layout.tsx` | `suppressHydrationWarning` masks real bugs | 10 min |
| A-07 | CRITICAL | `src/components/ui/TestimonialCarousel.tsx` | Auto-play not pausable (WCAG 2.5.2) | 30 min |
| B-01 | HIGH | (missing) | No favicon or Apple touch icon | 20 min |
| B-02 | HIGH | `public/og.png` | No dynamic OG images per page | 45 min |
| B-03 | HIGH | `src/app/(main)/[locale]/layout.tsx` | Plausible script not respecting DNT | 20 min |
| B-04 | HIGH | `src/components/layout/RouteTransition.tsx` | Missing `aria-label` on `<main>` | 5 min |
| B-05 | HIGH | `next.config.ts` | Minimal config, missing output/image settings | 15 min |
| B-06 | HIGH | (missing) | No cookie/GDPR consent banner | 45 min |
| B-07 | HIGH | (missing) | No custom error boundary | 20 min |
| B-08 | HIGH | `src/components/layout/Footer.tsx` | Map link is hardcoded, not from settings | 10 min |
| B-09 | HIGH | `src/components/layout/SmoothScroll.tsx` | Overly defensive, complex cleanup | 30 min |
| B-10 | HIGH | `src/components/three/HeroParticles.tsx` | SSR/client mismatch risk on 3D toggle | 30 min |
| C-01 | MEDIUM | `src/lib/jsonld.ts` | Course/Service JSON-LD unused in pages | 20 min |
| C-02 | MEDIUM | `src/lib/seo.ts` | URL construction needs tests | 30 min |
| C-03 | MEDIUM | `src/components/ui/TestimonialCarousel.tsx` | Avatar images not rendered | 20 min |
| C-04 | MEDIUM | `src/app/fonts.ts` | No `unicode-range` for Tamil fonts | 15 min |
| C-05 | MEDIUM | `src/app/(main)/[locale]/contact/page.tsx` | iframe sandbox attribute missing | 5 min |
| C-06 | LOW | `package.json` | `next lint` deprecated | 10 min |
| C-07 | MEDIUM | `src/app/(main)/[locale]/about/page.tsx` | Founder image sizing may cause CLS | 15 min |
| C-08 | LOW | `src/components/layout/Footer.tsx` | Phone display text may be empty | 10 min |
| C-09 | LOW | `src/components/sections/EnquiryForm.tsx` | Success state not announced to AT | 10 min |
| C-10 | LOW | `src/components/layout/Header.tsx` | Active nav fix for locale prefix | 15 min |

---

### IMPLEMENTATION ORDER

1. **[A-01]** Fix `messages/ta.json` — regenerate proper Tamil Unicode content.
2. **[A-04]** Move WhatsApp number to `process.env.NEXT_PUBLIC_WHATSAPP`.
3. **[A-05]** Add `rel="noopener noreferrer"` to ALL external links in `Button.tsx`.
4. **[A-03]** Fix Header logo alt text to use explicit `locale` prop.
5. **[A-06]** Remove `suppressHydrationWarning` from layout; fix any hydration errors that surface.
6. **[A-07]** Add pause-on-hover/focus to `TestimonialCarousel`.
7. **[B-01]** Add favicon, Apple touch icon, and manifest.
8. **[B-07]** Add `src/app/[locale]/error.tsx` error boundary.
9. **[B-04]** Add `aria-label="Main content"` to `RouteTransition` `<main>`.
10. **[B-08]** Replace hardcoded Footer map link with `settings.address.mapLink`.
11. **[B-03]** Gate Plausible script behind DNT check.
12. **[B-02]** Implement dynamic Open Graph image generation.
13. **[B-05]** Harden `next.config.ts` with `images` loader strategy and output config.
14. **[B-06]** Add cookie consent banner for GDPR compliance.
15. **[B-09]** Simplify `SmoothScroll.tsx` cleanup or replace Lenis with CSS smooth scroll.
16. **[B-10]** Pre-compute HeroParticles 3D mode server-side or stabilize the switch.
17. **[C-01]** Wire up `courseJsonLd` and service JSON-LD in detail pages.
18. **[C-04]** Add `@font-face` `unicode-range` for Tamil fonts.
19. **[C-09]** Add `aria-live` to `EnquiryForm` success state.
20. **[C-10]** Fix active nav detection for locale-prefixed paths.
21. **[C-07]** Refactor About page founder image to use `fill` + aspect ratio container.
22. **[C-06]** Migrate from `next lint` to ESLint CLI.
23. **[C-02]** Add unit tests for `localizedPath` / `absoluteUrl`.
24. **[C-03]** Render testimonial avatars with lazy loading.
25. **[C-05]** Add `sandbox` attribute to contact page iframe.
26. **[C-08]** Add fallback for empty phone numbers in Footer.

---

**Disclaimer:** This audit is based on a static code review. Some issues marked as "critical" depend on runtime behavior (e.g., hydration, Supabase response times) that can only be confirmed by running the site in a staging environment and running tools like Lighthouse, axe DevTools, and WAVE.
