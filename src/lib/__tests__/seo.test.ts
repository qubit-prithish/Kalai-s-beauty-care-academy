import { localizedPath, absoluteUrl } from "@/lib/seo";

const SITE_URL = "http://localhost:3000";

describe("localizedPath", () => {
  it("returns clean root path for default locale", () => {
    expect(localizedPath("en", "/")).toBe("/");
  });

  it("returns clean path without prefix for default locale", () => {
    expect(localizedPath("en", "/courses")).toBe("/courses");
    expect(localizedPath("en", "/about")).toBe("/about");
    expect(localizedPath("en", "/contact")).toBe("/contact");
  });

  it("prepends /ta for Tamil locale root", () => {
    expect(localizedPath("ta", "/")).toBe("/ta");
  });

  it("prepends /ta for Tamil locale sub-paths", () => {
    expect(localizedPath("ta", "/courses")).toBe("/ta/courses");
    expect(localizedPath("ta", "/about")).toBe("/ta/about");
    expect(localizedPath("ta", "/contact")).toBe("/ta/contact");
  });
});

describe("absoluteUrl", () => {
  it("builds absolute URL for default locale root", () => {
    expect(absoluteUrl("en", "/")).toBe(SITE_URL);
  });

  it("builds absolute URL for default locale sub-paths", () => {
    expect(absoluteUrl("en", "/courses")).toBe(`${SITE_URL}/courses`);
    expect(absoluteUrl("en", "/about")).toBe(`${SITE_URL}/about`);
  });

  it("builds absolute URL for Tamil locale root", () => {
    expect(absoluteUrl("ta", "/")).toBe(`${SITE_URL}/ta`);
  });

  it("builds absolute URL for Tamil locale sub-paths", () => {
    expect(absoluteUrl("ta", "/courses")).toBe(`${SITE_URL}/ta/courses`);
    expect(absoluteUrl("ta", "/about")).toBe(`${SITE_URL}/ta/about`);
  });
});