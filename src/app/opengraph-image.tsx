import { ImageResponse } from "next/og";
import { SITE } from "@/lib/constants";

export const alt = `${SITE.nameKo} · ${SITE.tagline}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const runtime = "edge";

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          padding: 72,
          background:
            "linear-gradient(135deg, #4F46E5 0%, #7C3AED 45%, #F59E0B 100%)",
          fontFamily: "system-ui, sans-serif",
          color: "white",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 16,
            marginBottom: 40,
            fontSize: 28,
            fontWeight: 700,
            opacity: 0.9,
          }}
        >
          <div
            style={{
              width: 52,
              height: 52,
              borderRadius: 14,
              background: "white",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#4F46E5",
              fontSize: 28,
              fontWeight: 800,
            }}
          >
            E
          </div>
          <span>EduMakers</span>
        </div>
        <div
          style={{
            fontSize: 72,
            fontWeight: 800,
            letterSpacing: -2,
            textAlign: "center",
            lineHeight: 1.15,
          }}
        >
          선생님들이 만들고,<br />
          선생님들이 나누는 AI 놀이터
        </div>
        <div
          style={{
            marginTop: 36,
            fontSize: 28,
            opacity: 0.85,
            letterSpacing: -0.5,
          }}
        >
          edumakers.pages.dev
        </div>
      </div>
    ),
    { ...size },
  );
}
