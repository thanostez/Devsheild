import { ImageResponse } from "next/og";

export const size = {
  width: 1200,
  height: 630,
};

export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background:
            "radial-gradient(circle at top left, #1f6feb 0%, #0d1117 45%, #05090f 100%)",
          color: "#f8fafc",
          padding: "56px 64px",
          fontFamily: "Inter, Arial, sans-serif",
        }}
      >
        <div
          style={{
            fontSize: 36,
            fontWeight: 700,
            letterSpacing: 1,
            opacity: 0.9,
          }}
        >
          DevShield
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 18, maxWidth: 980 }}>
          <div style={{ fontSize: 66, fontWeight: 800, lineHeight: 1.05 }}>
            Zero-Trust npm Security
          </div>
          <div style={{ fontSize: 34, color: "#c7d2fe", lineHeight: 1.25 }}>
            Audit CVEs, monitor credential leaks, and protect every release.
          </div>
        </div>
      </div>
    ),
    size
  );
}
