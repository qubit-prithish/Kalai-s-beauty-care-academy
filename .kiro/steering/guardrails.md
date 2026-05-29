---
inclusion: always
---

# BUILD GUARDRAILS (non-negotiable)

## Design mandate (read twice)
- TASTEFUL, decent 3D with SOME real 3D accents. NOT a heavy gaming-style site.
- Performance & elegance beat spectacle. Reference: Dior / Charlotte Tilbury / Aesop + light 3D depth, parallax, smooth scroll, micro-interactions.
- Must stay fast on a mid-range Android. Respect prefers-reduced-motion.
- Mobile LCP < 2.5s. Lazy-load ALL 3D + below-fold. Static/simplified 3D fallback on mobile.

## Tech stack (do not substitute without asking)
Next.js 15 (App Router) + TS, Tailwind + design tokens, Framer Motion, GSAP + ScrollTrigger + Lenis,
React Three Fiber + @react-three/drei, Supabase (Postgres + Auth + Storage), next-intl (EN default / TA),
Vercel Analytics + Plausible (Plausible env-gated until a domain exists). Host: Vercel.

## Architecture decisions (locked)
- FRONTEND-FIRST: build the ENTIRE frontend (all pages, 3D, motion, SEO, bilingual, polish) BEFORE any backend. Never mix backend work into a frontend prompt, or vice versa.
- During the frontend track, all content comes from a typed MOCK content layer (TS modules under /lib/content) behind a clean interface. This is temporary scaffolding only.
- The backend track later swaps that data layer to Supabase queries WITHOUT changing UI components, then adds the admin CMS. Final production data source is Supabase — never local JSON.
- Photos/assets are PENDING → ship elegant placeholders during the frontend track; everything becomes editable/uploadable via the admin CMS during the backend track.
- Admin (backend track) can create/edit/delete ALL content: courses, services, gallery photos/videos, offers, prices, testimonials, blog, hours, banners, contact/NAP, events; view/export enquiries.
- Booking is WhatsApp-only. Razorpay stays a DISABLED stub. NO online payment.
- NO owner-notification feature (no WhatsApp/email alert on new enquiry). Enquiries are saved to DB and shown in the admin enquiries list only.

## Hard failure-avoidance rules
- DO NOT use better-sqlite3 or any native module needing C++ build tools.
- DO NOT fetch Google Fonts at build time (sandbox blocks it). Self-host via next/font/local with bundled .woff2 files: Playfair Display (display) + Inter (body Latin) + Noto Sans Tamil / Noto Serif Tamil (Tamil text). Tamil content MUST use a Tamil-capable font.
- Final production data source is Supabase; the mock layer is temporary frontend scaffolding only.
- Build once, build right. Verify each phase COMPILES before moving on. Minimize rebuild loops.

## Tooling
- Use Context7 to fetch CURRENT docs for Next.js 15, R3F, drei, GSAP, Framer Motion, next-intl, Supabase JS BEFORE writing API-specific code. Do not rely on memory.
- Use Supabase Power for DB/auth/storage. Use Playwright to self-test pages, responsiveness, and console errors before declaring a phase done.

## Workflow
- Repo: qubit-prithish/Kalai-s-beauty-care-academy (build fresh). Work on a feature branch.
- Commit in logical chunks with clear messages. Never push to main directly.
- Frontend track ships on its own branch → PR → merge. Backend track starts on a fresh branch.
- After EACH phase: post a short summary (built / next), then continue automatically.
