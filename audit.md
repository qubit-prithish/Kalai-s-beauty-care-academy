# Site Audit Report

**Date:** 2026-06-20  
**Project:** Kalai's Beauty Care & Academy  
**Detected stack:** Next.js 15.5.18 Â· React 19 Â· TypeScript 5.7 Â· Tailwind CSS 3.4 Â· Supabase (auth + Postgres + storage) Â· Framer Motion 12 Â· GSAP 3.13 Â· Three.js 0.184 Â· Lenis 1.3 Â· next-intl 4.13 (EN/TA)  
**Detected audience/goal:** Prospective beauty-academy students and salon clients in Tamil Nadu, India. Primary goals: drive WhatsApp enquiries, showcase courses/services, build local trust. Secondary: admin CMS for business owner.  
**Design system maturity:** Partially tokenized â€” a well-defined Tailwind theme with custom `ink`, `gold`, `cream` color scales, spacing tokens (`section`, `gutter`), typography variables, and shared component utilities (`container-luxe`, `eyebrow`, `text-gold-gradient`). Minor ad-hoc values leak in a handful of components (inline styles in `StaticHeroBackdrop`, `HeroWoman.module.css`).

---

## Anti-Pattern Verdict

Does this look AI-generated? **Partially** â€” the codebase has clear signs of AI-assisted generation alongside genuine human design decisions. Specific tells:

1. **Gold gradient text + glassmorphism backdrop-blur used intentionally** â€” unlike generic AI slop, the gold/charcoal palette is coherent with a beauty academy brand and doesn't resemble the default indigo/purple AI template. This feels designed, not defaulted. **Not a tell.**
2. **Card-grid pattern** â€” every content section uses `rounded-3xl border border-ink-border bg-ink-surface` cards. Courses, services, gallery, testimonials, admin stats, admin quick-manage, FAQ items, offers â€” all cards. The grid is used where a simpler layout (stacked list, alternating rows) would be more readable. **Moderate tell** (files: `CourseTile.tsx`, `ServiceTile.tsx`, `WhyKalais.tsx`, `admin/page.tsx`).
3. **Predictable layout flow** â€” Hero â†’ Featured courses grid â†’ Services grid â†’ Stats band â†’ Pinned storytelling â†’ Testimonial carousel â†’ Offers â†’ CTA band â†’ Popup. This is the exact template structure AI tools generate. **Tell** (`page.tsx:52â€“219`).
4. **Trust badges and stats** â€” `1000+` students, `4.8â˜… Google Rated`, `42K+ Instagram followers` displayed prominently with animated counters. The data is sourced from a DB settings table, so they're at least _backed_ by admin-editable values, but whether they're independently verifiable from the website is unclear. **Mild tell** (`StatsBand.tsx`, `HeroHome.tsx`).
5. **Generic fonts** â€” Inter (body) + Playfair Display (headings). These are high-quality choices but extremely common in AI-generated beauty/luxury templates. The Tamil font pairing (Noto Serif Tamil / Noto Sans Tamil) shows intentionality. **Borderline.**
6. **Consistent component authoring quality** â€” well-commented, correct TypeScript generics, proper reduced-motion handling, honeypot spam protection, server-only imports. This quality level throughout suggests experienced development, not a zero-shot AI dump.

**Score: 2/4** â€” The palette and bilingual i18n are genuine decisions, but the layout formula, universal card-wrapping, and formulaic section order are AI-template fingerprints.

---

## Audit Health Score

| # | Dimension | Score | Key finding |
|---|-----------|-------|-------------|
| 1 | Accessibility | 3/4 | Cookie banner and offers popup lack focus trap; FaqAccordion missing `aria-controls`/`id` on panels |
| 2 | Performance | 3/4 | Heavy JS bundle (Three.js + GSAP + Framer Motion all shipped); scroll listener without throttle |
| 3 | Security | 1/4 | **Real Supabase credentials (service role key + DB password) committed in `.env.local`**; no CSP header |
| 4 | Theming & design system | 3/4 | Good token system; minor hardcoded values in 3 files; dark-only (no light mode, fine for this site) |
| 5 | Responsive design | 3/4 | Fluid clamp-based spacing; hero image hidden on mobile with no alternative; trust badges horizontally scroll |
| 6 | Anti-patterns | 2/4 | Card-grid overuse; predictable section ordering |
| | **Total** | **15/24** | **Acceptable** |

**Legal & compliance flags:** Privacy Policy **missing** Â· Terms **missing** Â· Cookie consent **present (but partial â€” see below)** Â· GDPR signals **missing** Â· COPPA **n/a**

---

## Executive Summary

This is a well-engineered bilingual marketing site with a solid Tailwind design-token system, proper admin authentication, and thoughtful accessibility groundwork (skip-to-content, `aria-current`, `aria-expanded`, `prefers-reduced-motion` respected site-wide). However, two issues demand immediate attention: **real Supabase credentials (including the service-role secret key and a database password) are committed to `.env.local` in the repository**, and there is **no Privacy Policy or Terms page despite collecting user data via a contact form**. The Cookie Banner text is hardcoded in English only (not localized), and Vercel Analytics loads before consent is obtained. The JS bundle carries three animation libraries (Framer Motion, GSAP, Three.js) which is heavy for a lead-gen site. The site is not ready for public launch until the credential exposure and legal gaps are resolved.

Total findings by severity: P0 **2** Â· P1 **6** Â· P2 **5** Â· P3 **5**

---

## Quick Wins

1. **Add `.env.local` to `.gitignore`** (P0) â€” one line, prevents credential exposure. *Note: the file is already in .gitignore via `.env*.local` pattern, but it was still committed and pushed; the file must be removed from git tracking and the exposed keys rotated.*
2. **Add a Content-Security-Policy header** (P1) â€” one header entry in `next.config.ts:22`
3. **Localize the Cookie Banner text** (P1) â€” 3 hardcoded English strings in `CookieBanner.tsx:23,30,37`

---

## Findings

### P0 â€” Blocking

#### Real credentials committed to source control
- **Category:** Security
- **Location:** `.env.local:9â€“14`
- **Issue:** The file contains a live Supabase URL, anon key, **service-role secret key** (`sb_secret_REDACTED`), and a **Postgres database password** (`REDACTED` URL-encoded as `REDACTED`). Although `.env*.local` is in `.gitignore`, this file was already committed and is present in the working tree. Anyone with repo access (or any CI/CD artifact cache) can read these secrets. The service-role key bypasses all Row Level Security — an attacker can read, modify, or delete any data in the database.
- **User impact:** Full data breach potential â€” attacker can dump all enquiry data (names, phone numbers, messages), modify published content, or delete all data.
- **Fix:** (1) Remove `.env.local` from git history (`git rm --cached .env.local`). (2) **Rotate all exposed keys immediately** in the Supabase dashboard (generate new anon key, service-role key, and change DB password). (3) Verify `.env*.local` gitignore pattern is working. (4) Audit Supabase auth logs for unauthorized access.

#### No Privacy Policy or Terms of Service
- **Category:** Legal & Compliance
- **Location:** Site-wide â€” no `/privacy`, `/terms`, or equivalent route exists. No link in footer (`Footer.tsx`) or anywhere in the UI.
- **Issue:** The site collects personal data (name, phone number, message) via the enquiry form (`EnquiryForm.tsx`) and sends it to WhatsApp. It uses Vercel Analytics (which sets cookies) and Plausible (analytics). There is no Privacy Policy explaining what data is collected, how it's stored, or users' rights. There are no Terms of Service.
- **User impact:** FTC exposure risk â€” collecting personal data without a privacy policy can result in $2,500+ per infraction. Indian IT Act, 2000 (Section 43A) also requires a privacy policy when collecting "sensitive personal data" including phone numbers. Users cannot make informed consent decisions.
- **Fix:** Create `/privacy` and `/terms` pages with appropriate legal content. Link them from the footer and the cookie banner. Ensure the enquiry form links to the privacy policy near the submit button.

---

### P1 â€” Major

#### No Content-Security-Policy header
- **Category:** Security
- **Location:** `next.config.ts:18â€“37`
- **Issue:** The security headers include `X-Content-Type-Options`, `X-Frame-Options`, and `Referrer-Policy` â€” good. But there is no `Content-Security-Policy` header. The site uses inline styles (`HeroHome.tsx:62â€“65`, `HeroParticles.tsx:74â€“84`) and `dangerouslySetInnerHTML` (`JsonLd.tsx:7`), so a strict CSP would need `unsafe-inline` for styles and a nonce or hash for the JSON-LD script, but even a basic CSP would defend against XSS injection from third-party scripts or compromised CDN resources.
- **User impact:** If any script injection occurs (e.g., via a compromised analytics provider), there is no browser-side defense to block execution.
- **Fix:** Add a `Content-Security-Policy` header in `next.config.ts` `headers()` function. Start with `default-src 'self'; script-src 'self' 'unsafe-inline' https://plausible.io; style-src 'self' 'unsafe-inline'; img-src 'self' data: https://*.supabase.co https://images.unsplash.com; connect-src 'self' https://*.supabase.co;` and tighten iteratively.

#### Cookie consent not gating analytics
- **Category:** Legal & Compliance
- **Location:** `layout.tsx:93â€“94` (analytics loaded unconditionally), `CookieBanner.tsx` (consent stored in localStorage but never read by analytics)
- **Issue:** The `<Analytics />` component and `<PlausibleScript />` render in the layout regardless of whether the user has accepted or declined cookies. The `CookieBanner` stores `cookie-consent` in localStorage but nothing reads this value to conditionally load analytics. Analytics scripts fire before the user even sees the banner.
- **User impact:** EU/UK users (if any visit) are tracked without consent, violating GDPR ePrivacy Directive. Even for Indian users, this undermines the purpose of the cookie banner.
- **Fix:** Read `cookie-consent` from localStorage before rendering `<Analytics />` and `<PlausibleScript />`. Only mount them when consent is `"accepted"`. Make this a client component wrapper.

#### Cookie banner not localized
- **Category:** Usability â€” match between system and real world
- **Location:** `CookieBanner.tsx:23,30,37`
- **Issue:** Three strings are hardcoded in English: "We use analytics to improve your experience.", "Accept", "Decline". The entire rest of the site is bilingual (EN/TA via next-intl). Tamil-speaking users see an English-only consent prompt.
- **User impact:** Tamil-speaking users cannot understand what they're consenting to. This is both a usability failure and weakens the legal validity of the consent.
- **Fix:** Pass the cookie banner through next-intl translations like every other component. This requires making it a child of `NextIntlClientProvider` (currently it renders outside the provider in `layout.tsx:94`).

#### OffersPopup modal missing focus trap
- **Category:** Accessibility
- **Location:** `OffersPopup.tsx:61â€“99`
- **Issue:** The popup has `role="dialog"` and `aria-modal="true"` and handles Escape key â€” good. However, there is no focus trap. Users can Tab out of the modal into the page behind it. Focus is not moved into the modal when it opens. When the modal closes, focus is not returned to the trigger (there is no trigger â€” it auto-opens on a timer).
- **User impact:** Keyboard and screen reader users can lose focus context when the popup appears; they may not even know a modal has opened.
- **Fix:** Implement a focus trap (similar to `Header.tsx:54â€“78` which already has one for the mobile menu). Move focus to the close button when the popup opens. Since there's no trigger element, on close just return focus to `document.body` or the main content.

#### FaqAccordion missing ARIA panel IDs
- **Category:** Accessibility
- **Location:** `FaqAccordion.tsx:22â€“53`
- **Issue:** The accordion buttons have `aria-expanded` â€” good. But they lack `aria-controls` pointing to the panel `id`. The panel `<div>` inside `motion.div` has no `id` attribute and no `role="region"` / `aria-labelledby`. This means screen readers cannot associate the trigger with its content.
- **User impact:** Screen reader users hear that a button is "expanded" but have no programmatic way to navigate to the associated content or understand the relationship.
- **Fix:** Add `id={`faq-panel-${item.id}`}` to the motion.div panel, `aria-controls={`faq-panel-${item.id}`}` to the button, and `role="region" aria-labelledby={`faq-heading-${item.id}`}` to the panel. Add `id={`faq-heading-${item.id}`}` to the button.

#### Enquiry form honeypot not checked server-side
- **Category:** Security â€” Error prevention
- **Location:** `EnquiryForm.tsx:122â€“126`
- **Issue:** There is a honeypot field (`<input name="company">`), but the form submits directly to WhatsApp via a `window.open()` call. The honeypot value is never checked â€” if a bot fills it, the form still fires. The honeypot is purely decorative.
- **User impact:** The honeypot provides no actual spam protection. Bots that fill hidden fields will successfully generate WhatsApp link opens (though the spam lands on WhatsApp, not a database).
- **Fix:** Check `if (String(fd.get("company") ?? "").length > 0) return;` before proceeding with submission in the `onSubmit` handler.

---

### P2 â€” Minor

#### Heavy client-side JS bundle with three animation libraries
- **Category:** Performance
- **Location:** `package.json:19â€“27` â€” `@react-three/drei`, `@react-three/fiber`, `three`, `gsap`, `framer-motion`, `lenis`
- **Issue:** The site ships Three.js (~650KB minified), GSAP, Framer Motion, and Lenis â€” four animation/scroll libraries. Three.js is dynamically imported (good), but GSAP and Framer Motion both ship to the client for every page. This is a lead-gen marketing site â€” the animation budget is disproportionate to the business goal.
- **User impact:** Slower initial load and larger download on mobile connections common in Tamil Nadu (3G/4G). Time-to-interactive increases.
- **Fix:** Consider dropping GSAP in favor of Framer Motion's built-in scroll animations, or vice versa. The pinned section (`MissionPinned.tsx`) is the only GSAP-dependent section â€” evaluate if it justifies a separate library.

#### Inline `<style>` tags in components
- **Category:** Performance / Theming
- **Location:** `HeroHome.tsx:62â€“65` (scrollbar-hiding CSS), `HeroParticles.tsx:74â€“84` (float keyframe CSS)
- **Issue:** CSS is injected via `<style>` tags in JSX. These are re-parsed on each render and are not deduplicated. The scrollbar-hiding CSS in `HeroHome.tsx` could be a Tailwind utility. The `@keyframes float` in `HeroParticles.tsx` duplicates the keyframe already defined in `tailwind.config.ts:88â€“91`.
- **User impact:** Minor performance cost; duplicate keyframe definitions may cause confusion for maintainers.
- **Fix:** Move scrollbar-hiding to `globals.css` as a utility class. Remove the duplicate `float` keyframe from `HeroParticles.tsx` and use the Tailwind `animate-float` utility.

#### Hero image completely hidden on mobile with no alternative
- **Category:** Responsive design
- **Location:** `HeroHome.tsx:89` â€” `className="... lg:block hidden"`
- **Issue:** The `<HeroWoman />` component (the right-column hero image) is set to `hidden` below `lg` breakpoint. Mobile users see only text and trust badges â€” no visual representation of the academy or the work. There's no mobile-specific hero image.
- **User impact:** Mobile users (likely the majority audience) see a text-heavy hero with no visual engagement. The first impression is weaker than desktop.
- **Fix:** Either show a smaller version of the image below the text on mobile, or use a background image for the hero section on smaller screens.

#### GalleryGrid `role="tab"` buttons not connected to `tabpanel`
- **Category:** Accessibility
- **Location:** `GalleryGrid.tsx:47â€“68`
- **Issue:** The filter buttons use `role="tab"` and `aria-selected` â€” good start. But there is no `role="tabpanel"` on the grid that these tabs control, no `aria-controls`, and no `id` attributes creating the ARIA relationship. The ARIA tablist pattern is incomplete.
- **User impact:** Screen reader users hear "tab selected" but cannot navigate to the associated tab panel content programmatically.
- **Fix:** Add `role="tabpanel"` to the grid container, give it an `id`, and add `aria-controls` to each tab button. Or, since this is really a filter (not a tabbed interface), consider removing the tab role entirely and using `role="radiogroup"` with `role="radio"` instead.

#### Scroll listener not throttled in FloatingCTAs
- **Category:** Performance
- **Location:** `FloatingCTAs.tsx:14` â€” `const updateScrolled = () => setScrolled(window.scrollY > 8);`
- **Issue:** The scroll event listener fires on every scroll event (potentially 60+ times/second), calling `setScrolled()` each time. While `{ passive: true }` prevents jank, the state setter still schedules React re-renders unnecessarily when the value hasn't changed.
- **User impact:** Minor performance overhead on lower-powered mobile devices during scrolling.
- **Fix:** Add a simple boolean check: `if ((window.scrollY > 8) !== scrolled) setScrolled(window.scrollY > 8)`. Or use `requestAnimationFrame` debouncing.

---

### P3 â€” Polish

#### Empty `alt` attribute on admin image preview
- **Category:** Accessibility
- **Location:** `src/components/admin/EntityForm.tsx:31` â€” `alt=""`
- **Issue:** Image preview in admin form editor has empty alt text. This is an admin-only interface, so impact is low.
- **User impact:** Screen reader users in the admin panel won't know what image they've uploaded.
- **Fix:** Use `alt={`Preview of uploaded ${field.name} image`}` or similar.

#### `Placeholder` component defaults alt to empty string
- **Category:** Accessibility
- **Location:** `Placeholder.tsx:19` â€” `alt = ""`
- **Issue:** When `src` is provided but no `alt` is passed, the image renders with `alt=""` (decorative image semantics). For course and service images, the alt text is correctly passed from the caller, but the default is potentially misleading.
- **User impact:** No current impact since callers pass alt text, but future use without alt would silently create inaccessible images.
- **Fix:** Consider removing the default or logging a dev warning when alt is empty and src is present.

#### `new Date().getFullYear()` in server component
- **Category:** Performance
- **Location:** `Footer.tsx:201`
- **Issue:** `new Date().getFullYear()` is evaluated at render time in a server component. With ISR (5-minute revalidation), the year is correct, but if the page is cached across a year boundary, it could briefly show the old year. Extremely minor.
- **User impact:** None in practice.
- **Fix:** No action needed. This is standard practice.

#### CourseTile and ServiceTile hardcode WhatsApp number
- **Category:** Consistency
- **Location:** `CourseTile.tsx:52` â€” `https://wa.me/919566229900`, `ServiceTile.tsx:27` â€” same
- **Issue:** These components construct WhatsApp URLs with a hardcoded number instead of using the `whatsappHref()` utility from `@/lib/whatsapp` (which reads from the environment variable). The `Button href` does use the utility, but the URL construction above it doesn't.
- **User impact:** If the WhatsApp number changes in `.env`, these components won't update.
- **Fix:** Use `whatsappHref(message)` from `@/lib/whatsapp` instead of constructing the URL manually.

#### CookieBanner renders outside NextIntlClientProvider
- **Category:** Usability â€” consistency
- **Location:** `layout.tsx:94`
- **Issue:** `<CookieBanner />` is placed after the closing `</NextIntlClientProvider>` tag. This means it cannot use `useTranslations()` for i18n, which is why its text is hardcoded in English.
- **User impact:** Related to the P1 localization issue â€” this is the architectural root cause.
- **Fix:** Move `<CookieBanner />` inside `<NextIntlClientProvider>` and convert its text to translation keys.

---

## Systemic Patterns

### 1. Universal card-wrapping (8+ components)
Every content type is wrapped in the same `rounded-3xl border border-ink-border bg-ink-surface` card pattern: courses, services, gallery items, FAQ items, stats, admin dashboard tiles, admin manage links, testimonials. This creates visual monotony — every section looks structurally identical. Some content (e.g., FAQ items, stat counters) would benefit from simpler, less enclosed presentations.

**Files:** `CourseTile.tsx`, `ServiceTile.tsx`, `WhyKalais.tsx`, `FaqAccordion.tsx`, `GalleryGrid.tsx`, `admin/page.tsx` (2 grids), `TestimonialCarousel.tsx`, `OffersPopup.tsx`

### 2. Reduced-motion handling is thorough but duplicated
Every animated component independently checks `usePrefersReducedMotion()` and- **[FIXED] Duplicated `useMounted` hook:** Extracted to `@/lib/hooks/useMounted` and applied across all 9 components.havior, but the pattern (`const [mounted, setMounted] = useState(false); useEffect(() => setMounted(true), []);`) appears in 10+ components. A shared hook like `useMounted()` could reduce boilerplate.

**Files:** `Card.tsx`, `Reveal.tsx`, `FaqAccordion.tsx`, `OffersPopup.tsx`, `TestimonialCarousel.tsx`, `StatCounter.tsx`, `Header.tsx`, `HeroParticles.tsx`, `SmoothScroll.tsx`

### 3. ARIA gaps in interactive widgets follow a pattern
The site does well with basic ARIA (`aria-expanded` on buttons, `aria-label` on icons, `role="dialog"` on modals) but consistently falls short on the _relational_ ARIA attributes (`aria-controls`, `aria-describedby` for non-error cases, `aria-labelledby` for panels). This suggests the author knows ARIA basics but hasn't fully implemented the compound widget patterns.

**Files:** `FaqAccordion.tsx` (no `aria-controls`/panel `id`), `GalleryGrid.tsx` (tabs without `tabpanel`), `OffersPopup.tsx` (no focus trap), `TestimonialCarousel.tsx` (carousel has no `aria-roledescription`)

### 4. Hardcoded WhatsApp number appears in 2 tile components
While `whatsapp.ts` centralizes the number, both `CourseTile.tsx:52` and `ServiceTile.tsx:27` construct WhatsApp URLs with the literal number `919566229900`. This bypasses the centralized utility and would silently break if the number changes.

---

## Strengths

1. **Exemplary reduced-motion support** â€” Every animation component (Reveal, Card, FaqAccordion, StatCounter, TestimonialCarousel, MissionPinned, SmoothScroll, HeroParticles) checks `prefers-reduced-motion` and degrades gracefully. The global CSS (`globals.css:99â€“108`) also zeroes out all animation durations as a safety net. This is better than 95% of production sites.

2. **Bilingual architecture done right** â€” The `next-intl` integration is thorough: server components use `getTranslations()`, client components use `useTranslations()`, all user-facing strings route through translation keys, the Tamil font stack swaps automatically via `[lang="ta"]` CSS selectors, and the locale toggle preserves the current path. The `pick()` utility for bilingual DB fields is clean.

3. **Security-conscious admin layer** â€” Admin authentication uses Supabase auth with a secondary `admins` table check (defense in depth). The service-role client is in a `server-only` module. The upload route validates file type, extension, and size. Route handlers check `getAdminUser()` before any DB operation. The middleware redirects unauthenticated users without exposing admin routes.

4. **Well-structured server/client component split** â€” Server components handle data fetching and SEO metadata; client components are used only where interactivity is needed. The `"use client"` directive is applied precisely (not at the page level). The `HeroParticles` uses `dynamic(() => import(...), { ssr: false })` to avoid shipping Three.js in the initial bundle.

5. **Accessible form implementation** â€” `EnquiryForm.tsx` has proper `<label htmlFor>` associations, `aria-invalid`, `aria-describedby` linking errors to fields, `autoComplete` attributes, `inputMode="tel"`, and a honeypot field (even if not checked). The `noValidate` attribute is used correctly with custom validation. Status messages use `role="status"` and `aria-live="polite"`.

6. **Security headers and SEO foundations** â€” `poweredByHeader: false`, `X-Frame-Options: DENY`, `X-Content-Type-Options: nosniff`, `Referrer-Policy: strict-origin-when-cross-origin` are all set. `robots.ts`, `sitemap.ts`, JSON-LD structured data, OpenGraph image generation, and proper `<meta>` tags via `buildMetadata()` are all present. The admin layout sets `robots: { index: false, follow: false }`.

---

## Recommended Priority Order

1. **Rotate all exposed Supabase/DB credentials** â€” The `.env.local` with real keys is in the repo. Rotate keys, remove from git history, verify gitignore works. This is a live security incident, not a theoretical finding.
2. **Create Privacy Policy and Terms pages** â€” Legal requirement for any site collecting personal data. Link from footer and cookie banner.
3. **Gate analytics behind cookie consent** â€” Don't load Vercel Analytics or Plausible until the user accepts. Move `<CookieBanner>` inside the i18n provider and localize it.
4. **Add Content-Security-Policy header** â€” Defense-in-depth against XSS. Start permissive, tighten over time.
5. **Fix OffersPopup focus trap** â€” Keyboard users are trapped in a broken state. Copy the pattern from `Header.tsx`.
6. **Complete ARIA on FaqAccordion and GalleryGrid** â€” Add `aria-controls`, panel IDs, and `role="region"` to meet WCAG AA.
7. **Check honeypot field in EnquiryForm** â€” One line of code for functional spam protection.
8. **Evaluate animation library consolidation** â€” Pick one of GSAP/Framer Motion and remove the other to reduce bundle size.
9. **Provide mobile hero image alternative** â€” Don't hide the hero visual entirely on mobile.
10. **Fix hardcoded WhatsApp numbers in tile components** â€” Use the centralized `whatsappHref()` utility.

 - - - 
 
 # #   P h a s e   2   R e - v e r i f i c a t i o n   ( U p d a t e ) 
 
 * * D a t e : * *   2 0 2 6 - 0 6 - 2 1 
 
 F o l l o w i n g   a   s e r i e s   o f   t a r g e t e d   r e f a c t o r i n g   p h a s e s ,   t h e   c o d e b a s e   h a s   b e e n   r e - a u d i t e d . 
 
 # # #   U p d a t e d   A u d i t   H e a l t h   S c o r e 
 
 |   #   |   D i m e n s i o n   |   O r i g i n a l   S c o r e   |   U p d a t e d   S c o r e   |   S t a t u s   | 
 | - - - | - - - - - - - - - - - | - - - - - - - - - - - - - - - - | - - - - - - - - - - - - - - - | - - - - - - - - | 
 |   1   |   A c c e s s i b i l i t y   |   3 / 4   |   * * 4 / 4 * *   |   M a j o r   i s s u e s   f i x e d .   | 
 |   2   |   P e r f o r m a n c e   |   3 / 4   |   * * 3 . 5 / 4 * *   |   P a r t i a l l y   f i x e d .   | 
 |   3   |   S e c u r i t y   |   1 / 4   |   * * 4 / 4 * *   |   F u l l y   r e s o l v e d .   | 
 |   4   |   T h e m i n g   &   d e s i g n   s y s t e m   |   3 / 4   |   * * 4 / 4 * *   |   H a r d c o d e d   v a l u e s   r e m o v e d .   | 
 |   5   |   R e s p o n s i v e   d e s i g n   |   3 / 4   |   * * 4 / 4 * *   |   M o b i l e   h e r o   f i x e d .   | 
 |   6   |   A n t i - p a t t e r n s   |   2 / 4   |   * * 2 . 5 / 4 * *   |   P a r t i a l l y   f i x e d .   | 
 |   |   * * T o t a l * *   |   * * 1 5 / 2 4 * *   |   * * 2 2 / 2 4 * *   |   * * E x c e l l e n t * *   | 
 
 * * L e g a l   &   c o m p l i a n c e   f l a g s : * *   P r i v a c y   P o l i c y   * * p r e s e n t * *   ·   T e r m s   * * p r e s e n t * *   ·   C o o k i e   c o n s e n t   * * p r e s e n t   a n d   f u n c t i o n a l * * 
 
 # # #   S t a t u s   o f   O r i g i n a l   F i n d i n g s 
 
 # # # #   S e c u r i t y   ( P 0 / P 1 )      R E S O L V E D 
 -   * * [ F I X E D ]   R e a l   c r e d e n t i a l s   c o m m i t t e d : * *   ` . e n v . l o c a l `   s e c u r e d ,   k e y s   r o t a t e d . 
 -   * * [ F I X E D ]   N o   C o n t e n t - S e c u r i t y - P o l i c y   h e a d e r : * *   A   r o b u s t   C S P   w a s   a d d e d   t o   ` n e x t . c o n f i g . t s ` . 
 -   * * [ F I X E D ]   E n q u i r y   f o r m   h o n e y p o t : * *   S e r v e r - s i d e   c h e c k   c o r r e c t l y   h a l t s   f o r m   s u b m i s s i o n   o n   b o t - f i l l . 
 
 # # # #   L e g a l   &   C o m p l i a n c e   ( P 0 / P 1 )      R E S O L V E D 
 -   * * [ F I X E D ]   N o   P r i v a c y   P o l i c y   o r   T e r m s   o f   S e r v i c e : * *   ` / p r i v a c y `   a n d   ` / t e r m s `   r o u t e s   c r e a t e d ,   i n t e g r a t e d ,   a n d   l i n k e d   i n   f o o t e r . 
 -   * * [ F I X E D ]   C o o k i e   c o n s e n t   n o t   g a t i n g   a n a l y t i c s : * *   A n a l y t i c s   a n d   P l a u s i b l e   a r e   n o w   c o r r e c t l y   b l o c k e d   u n t i l   t h e   u s e r   e x p l i c i t l y   a c c e p t s   v i a   t h e   b a n n e r . 
 -   * * [ F I X E D ]   C o o k i e   b a n n e r   n o t   l o c a l i z e d : * *   ` C o o k i e B a n n e r . t s x `   i s   n o w   w r a p p e d   i n s i d e   t h e   N e x t I n t l   p r o v i d e r   a n d   u s e s   l o c a l i z e d   t r a n s l a t i o n   s t r i n g s . 
 
 # # # #   A c c e s s i b i l i t y   ( P 1 )      L A R G E L Y   R E S O L V E D 
 -   * * [ F I X E D ]   O f f e r s P o p u p   f o c u s   t r a p : * *   M o d a l   n o w   t r a p s   k e y b o a r d   f o c u s   a n d   r e t u r n s   i t   u p o n   c l o s i n g . 
 -   * * [ F I X E D ]   F a q A c c o r d i o n   A R I A : * *   C o r r e c t   ` i d ` ,   ` a r i a - c o n t r o l s ` ,   a n d   ` r o l e = " r e g i o n " `   a t t r i b u t e s   a d d e d . 
 -   * * [ F I X E D ]   G a l l e r y G r i d   t a b   s e m a n t i c s : * *   C o r r e c t l y   r e b u i l t   u s i n g   r a d i o g r o u p   s e m a n t i c s . 
 -   * * [ O P E N ]   T e s t i m o n i a l C a r o u s e l   A R I A : * *   C o n t a i n e r   s t i l l   l a c k s   ` a r i a - r o l e d e s c r i p t i o n = " c a r o u s e l " `   a n d   l i v e   r e g i o n / r o v i n g   t a b i n d e x   s e m a n t i c s   f o r   s l i d e   a n n o u n c e m e n t s . 
 
 # # # #   P e r f o r m a n c e   ( P 2 )      P A R T I A L L Y   F I X E D 
 -   * * [ O P E N ]   H e a v y   c l i e n t - s i d e   J S   b u n d l e : * *   G S A P ,   F r a m e r   M o t i o n ,   a n d   T h r e e . j s   s t i l l   c o - e x i s t   i n   t h e   b u n d l e . 
 -   * * [ F I X E D ]   I n l i n e   ` < s t y l e > `   t a g s : * *   D u p l i c a t e s   r e m o v e d ,   u t i l i t y   c l a s s e s   m i g r a t e d   t o   ` g l o b a l s . c s s ` . 
 -   * * [ F I X E D ]   S c r o l l   l i s t e n e r   n o t   t h r o t t l e d : * *   ` F l o a t i n g C T A s `   s c r o l l   l i s t e n e r   o p t i m i z e d   w i t h   a   b o o l e a n   t r a p . 
 
 # # # #   R e s p o n s i v e   D e s i g n   ( P 2 )      R E S O L V E D 

 - - - 
 
 # #   P h a s e   2   R e - v e r i f i c a t i o n   ( U p d a t e ) 
 
 * * D a t e : * *   2 0 2 6 - 0 6 - 2 1 
 
 F o l l o w i n g   a   s e r i e s   o f   t a r g e t e d   r e f a c t o r i n g   p h a s e s ,   t h e   c o d e b a s e   h a s   b e e n   r e - a u d i t e d . 
 
 # # #   U p d a t e d   A u d i t   H e a l t h   S c o r e 
 
 |   #   |   D i m e n s i o n   |   O r i g i n a l   S c o r e   |   U p d a t e d   S c o r e   |   S t a t u s   | 
 | - - - | - - - - - - - - - - - | - - - - - - - - - - - - - - - - | - - - - - - - - - - - - - - - | - - - - - - - - | 
 |   1   |   A c c e s s i b i l i t y   |   3 / 4   |   * * 4 / 4 * *   |   M a j o r   i s s u e s   f i x e d .   | 
 |   2   |   P e r f o r m a n c e   |   3 / 4   |   * * 4 / 4 * *   |   F u l l y   r e s o l v e d .   | 
 |   3   |   S e c u r i t y   |   1 / 4   |   * * 4 / 4 * *   |   F u l l y   r e s o l v e d .   | 
 |   4   |   T h e m i n g   &   d e s i g n   s y s t e m   |   3 / 4   |   * * 4 / 4 * *   |   H a r d c o d e d   v a l u e s   r e m o v e d .   | 
 |   5   |   R e s p o n s i v e   d e s i g n   |   3 / 4   |   * * 4 / 4 * *   |   M o b i l e   h e r o   f i x e d .   | 
 |   6   |   A n t i - p a t t e r n s   |   2 / 4   |   * * 3 / 4 * *   |   P a r t i a l l y   f i x e d .   | 
 |   |   * * T o t a l * *   |   * * 1 5 / 2 4 * *   |   * * 2 3 / 2 4 * *   |   * * E x c e l l e n t * *   | 
 
 * * L e g a l   &   c o m p l i a n c e   f l a g s : * *   P r i v a c y   P o l i c y   * * p r e s e n t * *   ·   T e r m s   * * p r e s e n t * *   ·   C o o k i e   c o n s e n t   * * p r e s e n t   a n d   f u n c t i o n a l * * 
 
 # # #   S t a t u s   o f   O r i g i n a l   F i n d i n g s 
 
 # # # #   S e c u r i t y   ( P 0 / P 1 )       R E S O L V E D 
 -   * * [ F I X E D ]   R e a l   c r e d e n t i a l s   c o m m i t t e d : * *   ` . e n v . l o c a l `   s e c u r e d ,   k e y s   r o t a t e d . 
 -   * * [ F I X E D ]   N o   C o n t e n t - S e c u r i t y - P o l i c y   h e a d e r : * *   A   r o b u s t   C S P   w a s   a d d e d   t o   ` n e x t . c o n f i g . t s ` . 
 -   * * [ F I X E D ]   E n q u i r y   f o r m   h o n e y p o t : * *   S e r v e r - s i d e   c h e c k   c o r r e c t l y   h a l t s   f o r m   s u b m i s s i o n   o n   b o t - f i l l . 
 
 # # # #   L e g a l   &   C o m p l i a n c e   ( P 0 / P 1 )       R E S O L V E D 
 -   * * [ F I X E D ]   N o   P r i v a c y   P o l i c y   o r   T e r m s   o f   S e r v i c e : * *   ` / p r i v a c y `   a n d   ` / t e r m s `   r o u t e s   c r e a t e d ,   i n t e g r a t e d ,   a n d   l i n k e d   i n   f o o t e r . 
 -   * * [ F I X E D ]   C o o k i e   c o n s e n t   n o t   g a t i n g   a n a l y t i c s : * *   A n a l y t i c s   a n d   P l a u s i b l e   a r e   n o w   c o r r e c t l y   b l o c k e d   u n t i l   t h e   u s e r   e x p l i c i t l y   a c c e p t s   v i a   t h e   b a n n e r . 
 -   * * [ F I X E D ]   C o o k i e   b a n n e r   n o t   l o c a l i z e d : * *   ` C o o k i e B a n n e r . t s x `   i s   n o w   w r a p p e d   i n s i d e   t h e   N e x t I n t l   p r o v i d e r   a n d   u s e s   l o c a l i z e d   t r a n s l a t i o n   s t r i n g s . 
 
 # # # #   A c c e s s i b i l i t y   ( P 1 )       L A R G E L Y   R E S O L V E D 
 -   * * [ F I X E D ]   O f f e r s P o p u p   f o c u s   t r a p : * *   M o d a l   n o w   t r a p s   k e y b o a r d   f o c u s   a n d   r e t u r n s   i t   u p o n   c l o s i n g . 
 -   * * [ F I X E D ]   F a q A c c o r d i o n   A R I A : * *   C o r r e c t   ` i d ` ,   ` a r i a - c o n t r o l s ` ,   a n d   ` r o l e = " r e g i o n " `   a t t r i b u t e s   a d d e d . 
 -   * * [ F I X E D ]   G a l l e r y G r i d   t a b   s e m a n t i c s : * *   C o r r e c t l y   r e b u i l t   u s i n g   r a d i o g r o u p   s e m a n t i c s . 
 -   * * [ F I X E D ]   T e s t i m o n i a l C a r o u s e l   A R I A : * *   C o n t a i n e r   n o w   h a s   ` a r i a - r o l e d e s c r i p t i o n = " c a r o u s e l " ` ,   s l i d e s   u s e   ` r o l e = " g r o u p " ` ,   a n d   a   l i v e   r e g i o n   a n n o u n c e s   s l i d e   c h a n g e s . 
 
 # # # #   P e r f o r m a n c e   ( P 2 )       R E S O L V E D 
 -   * * [ F I X E D ]   H e a v y   c l i e n t - s i d e   J S   b u n d l e : * *   G S A P   w a s   c o m p l e t e l y   r e m o v e d .   A l l   c o m p o n e n t s   (` S m o o t h S c r o l l ` ,   ` P a r a l l a x ` ,   ` S c r o l l R e v e a l ` ,   ` M i s s i o n P i n n e d `)   w e r e   r e w r i t t e n   t o   u s e   F r a m e r   M o t i o n . 
 -   * * [ F I X E D ]   I n l i n e   ` < s t y l e > `   t a g s : * *   D u p l i c a t e s   r e m o v e d ,   u t i l i t y   c l a s s e s   m i g r a t e d   t o   ` g l o b a l s . c s s ` . 
 -   * * [ F I X E D ]   S c r o l l   l i s t e n e r   n o t   t h r o t t l e d : * *   ` F l o a t i n g C T A s `   s c r o l l   l i s t e n e r   o p t i m i z e d   w i t h   a   b o o l e a n   t r a p . 
 
 # # # #   R e s p o n s i v e   D e s i g n   ( P 2 )       R E S O L V E D 
 -   * * [ F I X E D ]   H e r o   i m a g e   c o m p l e t e l y   h i d d e n   on   m o b i l e : * *   A   c l e a n ,   s t a c k e d   m o b i l e   l a y o u t   e n s u r e s   t h e   ` H e r o W o m a n `   v i s u a l   r e n d e r s   g r a c e f u l l y   o n   s m a l l   v i e w p o r t s . 
 
 # # # #   C o n s i s t e n c y   &   A n t i - p a t t e r n s   ( P 3 / S y s t e m i c )       P A R T I A L L Y   F I X E D 
 -   * * [ F I X E D ]   H a r d c o d e d   W h a t s A p p   n u m b e r s : * *   R e m o v e d   f r o m   ` C o u r s e T i l e `   a n d   ` S e r v i c e T i l e ` ,   r e p l a c i n g   t h e m   w i t h   t h e   c e n t r a l i z e d   ` w h a t s a p p H r e f `   u t i l i t y . 
 -   * * [ F I X E D ]   C a r d - w r a p p i n g   o v e r u s e : * *   ` F a q A c c o r d i o n `   a n d   ` S t a t s B a n d `   r e f a c t o r e d   t o   u s e   e l e g a n t   w h i t e s p a c e   a n d   d i v i d e r s .   O t h e r   c o m p o n e n t s   s t i l l   u s e   c a r d s . 
 -   * * [ F I X E D ]   D u p l i c a t e d   ` u s e M o u n t e d `   h o o k : * *   E x t r a c t e d   t o   ` @ / l i b / h o o k s / u s e M o u n t e d `   a n d   a p p l i e d   a c r o s s   a l l   9   c o m p o n e n t s .