import { ImageResponse } from "next/og";

export const runtime = "edge";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "80px",
          background: "#0b0e11",
          color: "#e6e8eb",
          fontFamily: "sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            fontSize: 26,
            color: "#4c8dff",
            marginBottom: 24,
            fontFamily: "monospace",
          }}
        >
          {"// full-stack developer & AI engineer"}
        </div>
        <div
          style={{
            display: "flex",
            fontSize: 60,
            fontWeight: 700,
            lineHeight: 1.2,
            maxWidth: 900,
          }}
        >
          I build systems where AI agents actually do the work.
        </div>
        <div
          style={{
            display: "flex",
            fontSize: 28,
            color: "#8b9198",
            marginTop: 32,
          }}
        >
          Ankit Negi
        </div>
      </div>
    ),
    { ...size }
  );
}