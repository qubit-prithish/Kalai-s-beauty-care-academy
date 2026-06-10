import { ImageResponse } from "next/og";

export const size = {
  width: 180,
  height: 180,
};

export const contentType = "image/png";

export default function AppleIcon() {
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
        }}
      >
        <span
          style={{
            color: "white",
            fontSize: "72px",
            fontWeight: "bold",
          }}
        >
          K
        </span>
      </div>
    ),
    size,
  );
}
