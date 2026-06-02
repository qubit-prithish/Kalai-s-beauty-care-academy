import { test, expect, type Page } from "@playwright/test";
import { courses } from "../../src/lib/content/mock/courses";
import { services } from "../../src/lib/content/mock/services";

const STATIC = [
  "/", "/about", "/courses", "/services", "/gallery",
  "/testimonials", "/offers", "/faq", "/contact",
];
const ALL_ROUTES = [
  ...STATIC,
  ...courses.map((c) => `/courses/${c.slug}`),
  ...services.map((s) => `/services/${s.slug}`),
];

const ignore = (t: string) => /_vercel\/insights|_vercel\/speed-insights/.test(t);
function watch(page: Page) {
  const errs: string[] = [];
  page.on("console", (m) => m.type() === "error" && !ignore(m.text()) && errs.push(m.text()));
  page.on("pageerror", (e) => errs.push(e.message));
  return errs;
}

// 1) Full route crawl (EN + TA): 200 + zero console errors + one <h1>.
for (const locale of ["en", "ta"] as const) {
  const prefix = locale === "en" ? "" : "/ta";
  for (const path of ALL_ROUTES) {
    test(`crawl ${locale} ${path}`, async ({ page }) => {
      const errs = watch(page);
      const res = await page.goto(`${prefix}${path}`);
      expect(res?.status(), `status for ${path}`).toBeLessThan(400);
      await expect(page.locator("h1").first()).toBeVisible();
      expect(errs, `console errors on ${path}`).toEqual([]);
    });
  }
}

// 2) Functional checks.
test("EN->TA toggle preserves path", async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 900 });
  await page.goto("/courses");
  await page.getByRole("button", { name: /switch to tamil/i }).click();
  await page.waitForURL(/\/ta\/courses$/);
  await expect(page.locator("html")).toHaveAttribute("lang", "ta");
});

test("course + service WhatsApp links carry prefilled text", async ({ page }) => {
  await page.goto(`/courses/${courses[0].slug}`);
  const c = page.locator('main a[href*="wa.me/919566229900"]').first();
  expect(decodeURIComponent((await c.getAttribute("href")) ?? "")).toContain(courses[0].title.en);
  await page.goto(`/services/${services[0].slug}`);
  const s = page.locator('main a[href*="wa.me/919566229900"]').first();
  expect(decodeURIComponent((await s.getAttribute("href")) ?? "")).toContain("appointment");
});

test("before/after slider + gallery filter", async ({ page }) => {
  await page.goto("/gallery");
  await expect(page.locator('input[type="range"]').first()).toBeAttached();
  const tabs = page.getByRole("tab");
  await tabs.nth(1).click();
  await expect(tabs.nth(1)).toHaveAttribute("aria-selected", "true");
});

test("FAQ accordion + offers popup", async ({ page }) => {
  await page.goto("/faq");
  const btn = page.locator("main button[aria-expanded]").first();
  const before = await btn.getAttribute("aria-expanded");
  await btn.click();
  await expect(btn).not.toHaveAttribute("aria-expanded", before ?? "false");

  await page.goto("/");
  await expect(page.getByRole("dialog")).toBeVisible({ timeout: 5000 });
  await page.getByRole("button", { name: /close/i }).first().click();
  await expect(page.getByRole("dialog")).toHaveCount(0);
});

test("enquiry form validates then succeeds (no persistence)", async ({ page }) => {
  await page.goto("/contact");
  await page.getByRole("button", { name: /send enquiry/i }).click();
  await expect(page.locator("text=Please enter your name.")).toBeVisible();
  await page.fill("#name", "QA Tester");
  await page.fill("#phone", "9876543210");
  await page.fill("#message", "Interested in the diploma course.");
  await page.getByRole("button", { name: /send enquiry/i }).click();
  await expect(page.locator("text=Thank you!")).toBeVisible({ timeout: 5000 });
});

// 3) a11y landmarks + icon-button labels.
test("semantic landmarks + labelled icon buttons", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator("header")).toBeVisible();
  await expect(page.locator("main#main")).toBeVisible();
  await expect(page.locator("footer")).toBeVisible();
  await expect(page.getByLabel(/call now/i).first()).toBeAttached();
  await expect(page.getByLabel(/whatsapp|enquire/i).first()).toBeAttached();
});

// 4) Mobile: static 3D fallback (no canvas), layout holds.
test.describe("mobile", () => {
  test.use({ viewport: { width: 360, height: 800 }, hasTouch: true, isMobile: true });
  test("no canvas + no overflow across key pages", async ({ page }) => {
    await page.goto("/");
    await page.waitForTimeout(1200);
    await expect(page.locator("canvas")).toHaveCount(0);
    for (const p of ["/", "/courses", "/gallery", "/contact"]) {
      await page.goto(p);
      const diff = await page.evaluate(
        () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
      );
      expect(diff, `overflow at ${p}`).toBeLessThanOrEqual(2);
    }
  });
});

// 5) Reduced motion: no 3D, usable, no errors.
test("reduced-motion: no canvas, usable, clean console", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  const errs = watch(page);
  await page.goto("/");
  await page.waitForTimeout(1000);
  await expect(page.locator("canvas")).toHaveCount(0);
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  await expect(page.locator("footer")).toBeVisible();
  expect(errs).toEqual([]);
});

// 6) Layout holds at the three breakpoints on representative pages.
for (const w of [360, 768, 1280]) {
  test(`no overflow @ ${w}px`, async ({ page }) => {
    await page.setViewportSize({ width: w, height: 900 });
    for (const p of ["/", "/about", "/services", "/contact"]) {
      await page.goto(p);
      const diff = await page.evaluate(
        () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
      );
      expect(diff, `overflow at ${p} @ ${w}`).toBeLessThanOrEqual(2);
    }
  });
}

// 7) SEO smoke: hreflang/canonical, valid JSON-LD, sitemap + robots.
test("SEO: head alternates + valid JSON-LD", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator('link[rel="canonical"]')).toHaveCount(1);
  await expect(page.locator('link[hreflang="ta-IN"]')).toHaveCount(1);
  const blocks = await page.locator('script[type="application/ld+json"]').allTextContents();
  expect(blocks.length).toBeGreaterThan(0);
  for (const b of blocks) expect(() => JSON.parse(b)).not.toThrow();
});

test("SEO: sitemap + robots reachable", async ({ request }) => {
  const sm = await request.get("/sitemap.xml");
  expect(sm.status()).toBe(200);
  expect(await sm.text()).toContain("/courses/");
  const rb = await request.get("/robots.txt");
  expect(rb.status()).toBe(200);
  expect((await rb.text()).toLowerCase()).toContain("sitemap:");
});
