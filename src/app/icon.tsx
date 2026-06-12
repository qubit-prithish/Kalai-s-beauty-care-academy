import { ImageResponse } from "next/og";
import { getSettings } from "@/lib/content";

export const size = {
  width: 512,
  height: 512,
};

export const contentType = "image/png";

export default async function Icon() {
  let logoUrl: string | null = null;
  try {
    const settings = await getSettings();
    if (settings.navbarLogo?.url) {
      logoUrl = settings.navbarLogo.url;
    }
  } catch {}

  return new ImageResponse(
    (
      <div
        style={{
          background: "linear-gradient(135deg, #C8A24A, #a07830)",
          borderRadius: "50%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          width: "100%",
          height: "100%",
          fontFamily: "system-ui, sans-serif",
        }}
      >
        {logoUrl ? (
          <img
            src={logoUrl}
            alt=""
            style={{ width: "80%", height: "80%", objectFit: "contain" }}
          />
        ) : (
          <span
            style={{
              color: "white",
              fontSize: "200px",
              fontWeight: "bold",
            }}
          >
            K
          </span>
        )}
      </div>
    ),
    size,
  );
}