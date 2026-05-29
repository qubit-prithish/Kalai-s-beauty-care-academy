---
inclusion: always
---

# DESIGN SYSTEM — Kalai's Beauty Care & Academy

## Palette (design tokens)
- Base: deep black / charcoal — #0E0E0F (page), #1A1A1C (surfaces)
- Accent: gold #C8A24A, champagne highlight #E6D2A8
- Soft: blush #F4E7E1, warm sand #EAD7C7
- Text: near-white #F5F2EC on dark; charcoal on light. Maintain WCAG AA contrast on all text.

## Typography (self-hosted via next/font/local — NO build-time Google Fonts)
- Display serif (headings, hero): Playfair Display.
- Body sans (UI, paragraphs, Latin): Inter.
- Tamil text: Noto Serif Tamil (headings) + Noto Sans Tamil (body). Tamil MUST use these, since Playfair/Inter don't support the Tamil script. Bundle all .woff2 files in /fonts.
- Apply the Tamil fonts automatically when locale = ta.

## Components (reusable kit)
- Buttons: primary (gold fill), secondary (gold outline), WhatsApp (green) — all with prefilled wa.me/919566229900 messages where used as CTAs.
- Cards, course tile, service tile, section heading, stat counter, trust badge, testimonial carousel, before/after image slider, offers banner, FAQ accordion.
- Global chrome: sticky header (logo placeholder + nav + EN⇄TA toggle); footer (NAP + socials + Google map + "Follow us on Instagram — 42K+" badge).
- Floating buttons on every page: WhatsApp + Call Now (tel:).

## Motion language (tasteful, performance-first)
- Framer Motion: subtle hover (gentle 3D tilt) on tiles/cards, fade/slide reveals on enter.
- GSAP + ScrollTrigger: section reveals, parallax, ONE pinned storytelling moment (Home or About).
- Lenis: site-wide smooth scroll.
- Hero 3D: golden floating particles (lazy-loaded; simplified/static fallback on mobile).
- ALL motion + 3D gated behind prefers-reduced-motion. Cap draw calls; compress textures.

## Layout & responsiveness
- Mobile-first. Verified breakpoints: 360 / 768 / 1280.
- Generous whitespace, editorial luxury feel (Dior / Charlotte Tilbury / Aesop vibe).
- Semantic HTML, keyboard-accessible, visible focus states.
