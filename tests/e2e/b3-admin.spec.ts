import { test, expect } from "@playwright/test";

const EMAIL = process.env.ADMIN_EMAIL || "admin@kalaisbeautyacademy.com";
const PASSWORD = process.env.ADMIN_PASSWORD || "";

test.skip(!PASSWORD, "ADMIN_PASSWORD not set");

test("login + create→edit→delete course + image upload", async ({ page }) => {
  // Login
  await page.goto("/admin/login");
  await page.fill('input[name="email"]', EMAIL);
  await page.fill('input[name="password"]', PASSWORD);
  await page.getByRole("button", { name: /sign in/i }).click();
  await page.waitForURL(/\/admin$/);
  await expect(page.getByText(/Dashboard/)).toBeVisible();

  // Create a course
  const slug = "qa-test-" + Date.now();
  await page.goto("/admin/courses/new");
  await page.getByLabel("Slug").fill(slug);
  await page.getByLabel("Name (EN)").fill("QA Test Course");
  await page.getByLabel("Name (TA)").fill("QA டெஸ்ட்");
  await page.getByRole("button", { name: /^Save$/ }).click();
  await page.waitForURL(/\/admin\/courses$/);
  await expect(page.getByText("QA Test Course")).toBeVisible();

  // Edit it: find its row → Edit
  const row = page.locator("tr", { hasText: slug });
  await row.getByRole("link", { name: "Edit" }).click();
  await page.waitForURL(/\/admin\/courses\/[0-9a-f-]+$/);

  // Image upload via the API (exercises the uploader + Storage write)
  const upload = await page.evaluate(async () => {
    const png = Uint8Array.from(atob("iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg=="), (c) => c.charCodeAt(0));
    const fd = new FormData();
    fd.append("file", new File([png], "px.png", { type: "image/png" }));
    fd.append("bucket", "courses");
    const res = await fetch("/api/admin/upload", { method: "POST", body: fd });
    return { status: res.status, body: await res.json().catch(() => ({})) };
  });
  expect(upload.status).toBe(200);
  expect(String(upload.body.url)).toContain("/storage/v1/object/public/courses/");

  // Edit the tagline + save
  await page.getByLabel("Tagline (EN)").fill("Edited by QA");
  await page.getByRole("button", { name: /^Save$/ }).click();
  await page.waitForURL(/\/admin\/courses$/);

  // Delete it
  page.on("dialog", (d) => d.accept());
  await page.locator("tr", { hasText: slug }).getByRole("button", { name: "Delete" }).click();
  await expect(page.locator("tr", { hasText: slug })).toHaveCount(0, { timeout: 5000 });
});
