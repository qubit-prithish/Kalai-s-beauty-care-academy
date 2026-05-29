import { test, expect, type ConsoleMessage, type Request } from "@playwright/test";

const BREAKPOINTS = [
  { name: "mobile", width: 360, height: 800 },
  { name: "tablet", width: 768, height: 1024 },
  { name: "desktop", width: 1280, height: 900 },
];

function trackConsole(page: import("@playwright/test").Page) {
  const errors: string[] = [];
  page.on("console", (msg: ConsoleMessage) => {
    if (msg.type() === "error") errors.push(msg.text());
  });
  page.on("pageerror", (err) => errors.push(err.message));
  return errors;
}

test.describe("EN shell", () => {
  test("home renders, no console errors, no external font requests", async ({ page }) => {
    const errors = trackConsole(page);
    const fontRequests: string[] = [];
    page.on("request", (req: Request) => {
      const url = req.url();
      if (/fonts\.googleapis\.com|fonts\.gstatic\.com/.test(url)) {
        fontRequests.push(url);
      }
    });

    await page.goto("/en");
    await expect(page.locator("h1")).toBeVisible();
    await expect(page.locator("header")).toBeVisible();
    await expect(page.locator("footer")).toBeVisible();
    // Floating WhatsApp CTA present
    await expect(page.getByLabel(/WhatsApp|Enquire/i).first()).toBeVisible();

    expect(fontRequests, "no build/runtime Google Font requests").toHaveLength(0);
    expect(errors, "no console errors").toHaveLength(0);
  });

  for (const bp of BREAKPOINTS) {
    test(`layout holds at ${bp.name} (${bp.width})`, async ({ page }) => {
      await page.setViewportSize({ width: bp.width, height: bp.height });
      await page.goto("/en");
      await expect(page.locator("header")).toBeVisible();
      await expect(page.locator("footer")).toBeVisible();
      // No horizontal overflow
      const overflow = await page.evaluate(
        () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
      );
      expect(overflow, "no horizontal overflow").toBeLessThanOrEqual(2);
    });
  }

  test("mobile menu opens and closes", async ({ page }) => {
    await page.setViewportSize({ width: 360, height: 800 });
    await page.goto("/en");
    const toggle = page.getByRole("button", { name: /open menu/i });
    await expect(toggle).toBeVisible();
    await toggle.click();
    await expect(page.getByRole("navigation", { name: /mobile/i })).toBeVisible();
    const close = page.getByRole("button", { name: /close menu/i });
    await close.click();
    await expect(page.getByRole("navigation", { name: /mobile/i })).toHaveCount(0);
  });
});

test.describe("i18n", () => {
  test("Tamil route renders in Tamil with lang=ta", async ({ page }) => {
    const errors = trackConsole(page);
    await page.goto("/ta");
    await expect(page.locator("html")).toHaveAttribute("lang", "ta");
    await expect(page.locator("h1")).toContainText("கலை");
    expect(errors).toHaveLength(0);
  });

  test("locale toggle switches EN -> TA and preserves path", async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 900 });
    await page.goto("/en");
    await page.getByRole("button", { name: /switch to tamil/i }).click();
    await page.waitForURL(/\/ta$/);
    await expect(page.locator("html")).toHaveAttribute("lang", "ta");
  });
});
