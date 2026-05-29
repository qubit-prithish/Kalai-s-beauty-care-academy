import { test, expect, type Page } from "@playwright/test";
import { courses } from "../../src/lib/content/mock/courses";

function trackErrors(page: Page) {
  const errors: string[] = [];
  // Vercel Analytics' script only exists when deployed on Vercel; locally it
  // 404s harmlessly. Ignore that one known-benign resource error.
  const ignore = (t: string) =>
    /_vercel\/insights|_vercel\/speed-insights/.test(t);
  page.on("console", (m) => {
    if (m.type() === "error" && !ignore(m.text())) errors.push(m.text());
  });
  page.on("pageerror", (e) => errors.push(e.message));
  return errors;
}

test.describe("metadata + hreflang", () => {
  test("EN home: title, canonical, hreflang, OG, twitter", async ({ page }) => {
    await page.goto("/");
    await expect(page).toHaveTitle(/Kalai's Beauty Care/);
    await expect(page.locator('link[rel="canonical"]')).toHaveCount(1);
    await expect(page.locator('link[hreflang="en-IN"]')).toHaveCount(1);
    await expect(page.locator('link[hreflang="ta-IN"]')).toHaveCount(1);
    await expect(page.locator('link[hreflang="x-default"]')).toHaveCount(1);
    await expect(page.locator('meta[property="og:title"]')).toHaveCount(1);
    await expect(page.locator('meta[property="og:locale"]')).toHaveAttribute("content", "en_IN");
    await expect(page.locator('meta[name="twitter:card"]')).toHaveAttribute("content", "summary_large_image");
  });

  test("TA home: og:locale ta_IN and hreflang present", async ({ page }) => {
    await page.goto("/ta");
    await expect(page.locator('meta[property="og:locale"]')).toHaveAttribute("content", "ta_IN");
    await expect(page.locator('link[hreflang="ta-IN"]')).toHaveCount(1);
  });

  test("course detail has unique title + Course JSON-LD", async ({ page }) => {
    const slug = courses[0].slug;
    await page.goto(`/courses/${slug}`);
    await expect(page).toHaveTitle(new RegExp(courses[0].title.en.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));
    const ld = await page.locator('script[type="application/ld+json"]').allTextContents();
    const joined = ld.join(" ");
    expect(joined).toContain('"@type":"Course"');
    expect(joined).toContain('"@type":"BreadcrumbList"');
  });
});

test.describe("jsonld validity", () => {
  test("all JSON-LD blocks parse as valid JSON", async ({ page }) => {
    await page.goto("/");
    const blocks = await page.locator('script[type="application/ld+json"]').allTextContents();
    expect(blocks.length).toBeGreaterThan(0);
    for (const b of blocks) {
      expect(() => JSON.parse(b)).not.toThrow();
    }
    // LocalBusiness present with AggregateRating.
    const org = blocks.map((b) => JSON.parse(b)).find((d) => String(d["@type"]).includes("BeautySalon") || (Array.isArray(d["@type"]) && d["@type"].includes("BeautySalon")));
    expect(org).toBeTruthy();
    expect(org.aggregateRating.ratingValue).toBe(4.8);
    expect(org.aggregateRating.reviewCount).toBe(63);
  });
});

test.describe("sitemap + robots", () => {
  test("sitemap.xml lists localized + dynamic URLs", async ({ request }) => {
    const res = await request.get("/sitemap.xml");
    expect(res.status()).toBe(200);
    const xml = await res.text();
    expect(xml).toContain("/courses/");
    expect(xml).toContain("/services/");
    expect(xml).toContain("/blog/");
    expect(xml).toContain("hreflang=");
  });

  test("robots.txt allows crawl and references sitemap", async ({ request }) => {
    const res = await request.get("/robots.txt");
    expect(res.status()).toBe(200);
    const txt = await res.text();
    expect(txt.toLowerCase()).toContain("sitemap:");
    expect(txt).toContain("Disallow: /admin");
  });
});

test.describe("integrations", () => {
  test("course WhatsApp CTA carries course-specific prefilled text", async ({ page }) => {
    const slug = courses[0].slug;
    await page.goto(`/courses/${slug}`);
    const wa = page.locator('main a[href*="wa.me/919566229900"]').first();
    const href = await wa.getAttribute("href");
    expect(href).toContain("course");
    expect(decodeURIComponent(href ?? "")).toContain(courses[0].title.en);
  });

  test("tel: and map + IG links present", async ({ page }) => {
    await page.goto("/contact");
    await expect(page.locator('a[href^="tel:"]').first()).toBeVisible();
    // Contact page map + global footer map → at least one maps iframe.
    expect(await page.locator('iframe[src*="google.com/maps"]').count()).toBeGreaterThanOrEqual(1);
    await expect(page.locator('a[href*="instagram.com/kalais_beauty_academy"]').first()).toBeAttached();
  });
});

test.describe("no console errors @ breakpoints", () => {
  for (const w of [360, 768, 1280]) {
    test(`clean console at ${w}px (home + courses)`, async ({ page }) => {
      const errors = trackErrors(page);
      await page.setViewportSize({ width: w, height: 900 });
      await page.goto("/");
      await page.goto("/courses");
      expect(errors).toEqual([]);
    });
  }
});
