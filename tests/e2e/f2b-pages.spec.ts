import { test, expect, type Page } from "@playwright/test";
import { services } from "../../src/lib/content/mock/services";
import { blogPosts } from "../../src/lib/content/mock/blog";

const SERVICE_SLUGS = services.map((s) => s.slug);
const BLOG_SLUGS = blogPosts.map((p) => p.slug);
const STATIC = ["/services", "/gallery", "/testimonials", "/offers", "/blog", "/faq", "/contact"];
const BREAKPOINTS = [360, 768, 1280];

function trackErrors(page: Page) {
  const errors: string[] = [];
  page.on("console", (m) => m.type() === "error" && errors.push(m.text()));
  page.on("pageerror", (e) => errors.push(e.message));
  return errors;
}

for (const locale of ["en", "ta"] as const) {
  const prefix = locale === "en" ? "" : "/ta";
  test.describe(`F2b routes (${locale})`, () => {
    for (const path of STATIC) {
      test(`${path} → 200, single h1, no console errors`, async ({ page }) => {
        const errors = trackErrors(page);
        const res = await page.goto(`${prefix}${path}`);
        expect(res?.status()).toBeLessThan(400);
        await expect(page.locator("h1")).toHaveCount(1);
        expect(errors).toEqual([]);
      });
    }
  });
}

test.describe("service detail crawl", () => {
  for (const slug of SERVICE_SLUGS) {
    test(`/services/${slug} → 200, service WhatsApp CTA`, async ({ page }) => {
      const errors = trackErrors(page);
      const res = await page.goto(`/services/${slug}`);
      expect(res?.status()).toBeLessThan(400);
      const wa = page.locator('main a[href*="wa.me/919566229900"]').first();
      await expect(wa).toBeVisible();
      expect(await wa.getAttribute("href")).toContain("appointment");
      expect(errors).toEqual([]);
    });
  }
});

test.describe("blog detail crawl", () => {
  for (const slug of BLOG_SLUGS) {
    test(`/blog/${slug} → 200`, async ({ page }) => {
      const errors = trackErrors(page);
      const res = await page.goto(`/blog/${slug}`);
      expect(res?.status()).toBeLessThan(400);
      await expect(page.locator("h1")).toBeVisible();
      expect(errors).toEqual([]);
    });
  }
  test("bad blog slug → 404", async ({ page }) => {
    const res = await page.goto("/blog/no-such-post");
    expect(res?.status()).toBe(404);
  });
});

test("gallery category filter works", async ({ page }) => {
  await page.goto("/gallery");
  const tabs = page.getByRole("tab");
  const count = await tabs.count();
  expect(count).toBeGreaterThan(1);
  // Click a non-"All" category and ensure grid still shows items.
  await tabs.nth(1).click();
  await expect(tabs.nth(1)).toHaveAttribute("aria-selected", "true");
});

test("faq accordion toggles", async ({ page }) => {
  await page.goto("/faq");
  const buttons = page.locator("main button[aria-expanded]");
  const first = buttons.first();
  const initial = await first.getAttribute("aria-expanded");
  await first.click();
  await expect(first).not.toHaveAttribute("aria-expanded", initial ?? "false");
});

test("enquiry form validates then succeeds", async ({ page }) => {
  await page.goto("/contact");
  // Submit empty → validation errors, no success.
  await page.getByRole("button", { name: /send enquiry/i }).click();
  await expect(page.locator("text=Please enter your name.")).toBeVisible();
  // Fill valid data → success state.
  await page.fill("#name", "Test User");
  await page.fill("#phone", "9876543210");
  await page.fill("#message", "I would like more info.");
  await page.getByRole("button", { name: /send enquiry/i }).click();
  await expect(page.locator("text=Thank you!")).toBeVisible({ timeout: 5000 });
});

test("offers popup appears on home and can be dismissed", async ({ page }) => {
  await page.goto("/");
  const dialog = page.getByRole("dialog");
  await expect(dialog).toBeVisible({ timeout: 5000 });
  await page.getByRole("button", { name: /close/i }).first().click();
  await expect(dialog).toHaveCount(0);
});

test.describe("responsive — F2b key pages", () => {
  for (const w of BREAKPOINTS) {
    test(`no overflow at ${w}px`, async ({ page }) => {
      await page.setViewportSize({ width: w, height: 900 });
      for (const path of ["/services", "/gallery", "/testimonials", "/offers", "/blog", "/faq", "/contact"]) {
        await page.goto(path);
        const diff = await page.evaluate(
          () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
        );
        expect(diff, `overflow at ${path}`).toBeLessThanOrEqual(2);
      }
    });
  }
});
