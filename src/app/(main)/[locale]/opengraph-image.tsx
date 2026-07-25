import { ImageResponse } from "next/og";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OpenGraphImage({
  params,
}: {
  params: { locale: string };
}) {
  const title =
    params.locale === "ta"
      ? "கலையின் அழகு பராமரிப்பு மற்றும் அகாடமி"
      : "Kalai's Beauty Care & Academy";

  return new ImageResponse(
    (
      <div
        style={{
          width: 1200,
          height: 630,
          background: "#FBF3EF",
          display: "flex",
          flexDirection: "column",
          padding: "60px",
          fontFamily: "serif",
        }}
      >
        <div
          style={{
            color: "#B85C72",
            fontSize: 56,
            fontWeight: "bold",
            marginBottom: 20,
          }}
        >
          {title}
        </div>
        <div
          style={{
            color: "#3A2530",
            fontSize: 32,
          }}
        >
          Beauty Academy &amp; Salon in Ambattur, Chennai
        </div>
        <div
          style={{
            color: "#B85C7280",
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
