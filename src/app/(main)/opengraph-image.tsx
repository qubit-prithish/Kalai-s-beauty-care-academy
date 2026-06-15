import { ImageResponse } from "next/og";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: 1200,
          height: 630,
          background: "#0a0a0a",
          display: "flex",
          flexDirection: "column",
          padding: "60px",
          fontFamily: "serif",
        }}
      >
        <div
          style={{
            color: "#C8A24A",
            fontSize: 56,
            fontWeight: "bold",
            marginBottom: 20,
          }}
        >
          Kalai&apos;s Beauty Care &amp; Academy
        </div>
        <div
          style={{
            color: "#f5f2ec",
            fontSize: 32,
          }}
        >
          Beauty Academy &amp; Salon in Ambattur, Chennai
        </div>
        <div
          style={{
            color: "#C8A24A80",
            fontSize: 24,
            marginTop: "auto",
          }}
        >
          kalaisbeautyacademy.com
        </div>
      </div>
    ),
    size,
  );
}
