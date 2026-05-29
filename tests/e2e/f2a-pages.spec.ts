import { test, expect, type Page } from "@playwright/test";
import { courses } from "../../src/lib/content/mock/courses";

const SLUGS = courses.map((c) => c.slug);
const BREAKPOINTS = [360, 768, 1280];

function trackErrors(page: Page) {
  const errors: string[] = [];
  page.on("console", (m) => m.type() === "error" && errors.push(m.text()));
  page.on("pageerror", (e) => errors.push(e.message));
  return errors;
}

async function noOverflow(page: Page) {
  const diff = await page.evaluate(
    () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
  );
  expect(diff, "no horizontal overflow").toBeLessThanOrEqual(2);
}

for (const locale of ["en", "ta"] as const) {
  const prefix = locale === "en" ? "" : "/ta";

  test.describe(`core pages (${locale})`, () => {
    for (const path of ["", "/about", "/courses"]) {
      test(`${path || "/home"} loads, no console errors`, async ({ page }) => {
        const errors = trackErrors(page);
        const res = await page.goto(`${prefix}${path || "/"}`);
        expect(res?.status()).toBeLessThan(400);
        await expect(page.locator("h1").first()).toBeVisible();
        expect(errors).toEqual([]);
      });
    }
  });

  test(`courses grid lists every course (${locale})`, async ({ page }) => {
    await page.goto(`${prefix}/courses`);
    for (const slug of SLUGS) {
      await expect(page.locator(`a[href$="/courses/${slug}"]`).first()).toBeVisible();
    }
  });
}

test.describe("course detail pages (data-driven crawl)", () => {
  for (const slug of SLUGS) {
    test(`/courses/${slug} → 200, course CTA prefilled, no errors`, async ({ page }) => {
      const errors = trackErrors(page);
      const res = await page.goto(`/courses/${slug}`);
      expect(res?.status()).toBeLessThan(400);
      await expect(page.locator("h1")).toBeVisible();
      // WhatsApp CTA carries a course-specific prefilled message
      const wa = page.locator('a[href*="wa.me/919566229900"]').first();
      await expect(wa).toBeVisible();
      const href = await wa.getAttribute("href");
      expect(href).toContain("course");
      expect(errors).toEqual([]);
    });
  }
});

test("unknown course slug returns 404", async ({ page }) => {
  const res = await page.goto("/courses/this-course-does-not-exist");
  expect(res?.status()).toBe(404);
});

test.describe("responsive — key pages", () => {
  for (const w of BREAKPOINTS) {
    test(`no overflow at ${w}px`, async ({ page }) => {
      await page.setViewportSize({ width: w, height: 900 });
      for (const path of ["/", "/about", "/courses", `/courses/${SLUGS[0]}`]) {
        await page.goto(path);
        await noOverflow(page);
      }
    });
  }
});
