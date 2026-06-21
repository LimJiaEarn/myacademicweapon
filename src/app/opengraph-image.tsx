import { ImageResponse } from "next/og";

export const alt =
  "My Academic Weapon — free prelim papers and study notes for Singapore students";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "90px",
          backgroundColor: "#121830",
          color: "#ffffff",
          fontFamily: "sans-serif",
        }}
      >
        <div
          style={{
            width: 90,
            height: 10,
            borderRadius: 999,
            backgroundColor: "#19BDB6",
            marginBottom: 48,
          }}
        />
        <div
          style={{
            display: "flex",
            gap: "0.28em",
            fontSize: 84,
            fontWeight: 800,
            lineHeight: 1.05,
            letterSpacing: "-0.02em",
          }}
        >
          <span>My Academic</span>
          <span style={{ color: "#19BDB6" }}>Weapon</span>
        </div>
        <div
          style={{
            fontSize: 38,
            fontWeight: 500,
            color: "#c7cdda",
            marginTop: 32,
            maxWidth: 880,
          }}
        >
          Free O-Level &amp; A-Level prelim papers, notes &amp; more
        </div>
      </div>
    ),
    { ...size }
  );
}
