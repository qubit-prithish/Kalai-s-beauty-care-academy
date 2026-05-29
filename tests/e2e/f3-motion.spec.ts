import { test, expect, type Page } from "@playwright/test";

function trackErrors(page: Page) {
  const errors: string[] = [];
  page.on("console", (m) => m.type() === "error" && errors.push(m.text()));
  page.on("pageerror", (e) => errors.push(e.message));
  return errors;
}

test.describe("desktop — 3D hero", () => {
  test("hero paints fast, canvas mounts, no console errors", async ({ page }) => {
    const errors = trackErrors(page);
    const start = Date.now();
    await page.goto("/", { waitUntil: "domcontentloaded" });
    // Hero headline (LCP candidate) visible quickly.
    await expect(page.locator("h1")).toBeVisible({ timeout: 2500 });
    const elapsed = Date.now() - start;
    expect(elapsed, "hero visible quickly").toBeLessThan(2500);

    // 3D canvas lazy-mounts shortly after (dynamic import).
    await expect(page.locator("canvas")).toBeVisible({ timeout: 6000 });
    expect(errors).toEqual([]);
  });

  test("pinned mission section is present", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator("[data-mission-goal]")).toBeAttached();
    await expect(page.locator("[data-mission-step]")).toHaveCount(3);
  });
});

test.describe("mobile — static fallback", () => {
  test.use({ viewport: { width: 393, height: 851 }, hasTouch: true, isMobile: true });

  test("no WebGL canvas on mobile; static backdrop + fast hero", async ({ page }) => {
    const errors = trackErrors(page);
    await page.goto("/", { waitUntil: "domcontentloaded" });
    await expect(page.locator("h1")).toBeVisible({ timeout: 2500 });
    // Give the client effect time to decide; mobile should NOT mount a canvas.
    await page.waitForTimeout(1500);
    await expect(page.locator("canvas")).toHaveCount(0);
    expect(errors).toEqual([]);
  });

  test("no horizontal overflow on mobile home", async ({ page }) => {
    await page.goto("/");
    const diff = await page.evaluate(
      () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
    );
    expect(diff).toBeLessThanOrEqual(2);
  });
});

test.describe("reduced motion", () => {
  test("no canvas, page usable, no console errors, scroll works", async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    const errors = trackErrors(page);
    await page.goto("/");
    await expect(page.locator("h1")).toBeVisible();
    await page.waitForTimeout(1200);
    // Reduced motion must not mount the 3D canvas.
    await expect(page.locator("canvas")).toHaveCount(0);
    // Content below the fold (footer) is reachable/usable.
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await expect(page.locator("footer")).toBeVisible();
    expect(errors).toEqual([]);
  });

  test("mission steps fully visible (no scrub hiding) under reduced motion", async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto("/");
    const steps = page.locator("[data-mission-step]");
    await steps.first().scrollIntoViewIfNeeded();
    await page.waitForTimeout(400);
    // All three steps should be at full opacity (static layout).
    const opacities = await steps.evaluateAll((els) =>
      els.map((e) => Number(getComputedStyle(e).opacity)),
    );
    for (const o of opacities) expect(o).toBeGreaterThan(0.9);
  });
});
