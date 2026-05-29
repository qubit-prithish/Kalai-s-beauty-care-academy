import { test, expect, type Page } from "@playwright/test";

const ignore = (t: string) => /_vercel\/insights|_vercel\/speed-insights/.test(t);
function watch(page: Page) {
  const errs: string[] = [];
  page.on("console", (m) => m.type() === "error" && !ignore(m.text()) && errs.push(m.text()));
  page.on("pageerror", (e) => errs.push(e.message));
  return errs;
}

test("home renders DB content, no console errors", async ({ page }) => {
  const errs = watch(page);
  await page.goto("/");
  await expect(page.locator("h1").first()).toBeVisible();
  // A featured course from the DB should appear on the home page.
  await expect(page.locator('a[href$="/courses/basic-beautician"]').first()).toBeVisible();
  expect(errs).toEqual([]);
});

test("course detail renders from DB", async ({ page }) => {
  const errs = watch(page);
  await page.goto("/courses/diploma-cosmetology");
  await expect(page.locator("h1")).toContainText(/Diploma in Cosmetology/i);
  // Syllabus list (DB array) present.
  await expect(page.locator("main li").first()).toBeVisible();
  expect(errs).toEqual([]);
});

test("bad course slug returns 404", async ({ page }) => {
  const res = await page.goto("/courses/this-does-not-exist");
  expect(res?.status()).toBe(404);
});

test("contact form submit persists (success UI)", async ({ page }) => {
  await page.goto("/contact");
  await page.fill("#name", "B2 Playwright");
  await page.fill("#phone", "9876500000");
  await page.fill("#message", "Automated B2 enquiry persistence test.");
  await page.getByRole("button", { name: /send enquiry/i }).click();
  await expect(page.locator("text=Thank you!")).toBeVisible({ timeout: 8000 });
});

for (const w of [360, 768, 1280]) {
  test(`no overflow @ ${w}px (home + contact)`, async ({ page }) => {
    await page.setViewportSize({ width: w, height: 900 });
    for (const p of ["/", "/contact"]) {
      await page.goto(p);
      const diff = await page.evaluate(
        () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
      );
      expect(diff).toBeLessThanOrEqual(2);
    }
  });
}
