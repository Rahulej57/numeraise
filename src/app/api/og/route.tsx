import { ImageResponse } from "next/og";
import { NextRequest } from "next/server";

export const runtime = "edge";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const title = searchParams.get("title") || "Free Financial Calculators";
    const category = searchParams.get("category") || "Numeraise";

    return new ImageResponse(
      (
        <div
          style={{
            height: "100%",
            width: "100%",
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
            justifyContent: "space-between",
            backgroundColor: "#09090b",
            backgroundImage:
              "radial-gradient(circle at 25px 25px, #27272a 2%, transparent 0%), radial-gradient(circle at 75px 75px, #27272a 2%, transparent 0%)",
            backgroundSize: "100px 100px",
            padding: "80px",
            fontFamily: "sans-serif",
          }}
        >
          {/* Header Brand */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "16px",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: "48px",
                height: "48px",
                borderRadius: "12px",
                backgroundColor: "rgba(16, 185, 129, 0.2)",
                border: "1px solid rgba(16, 185, 129, 0.4)",
              }}
            >
              <svg
                width="28"
                height="28"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#10b981"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M16 7h6v6" />
                <path d="m22 7-8.5 8.5-5-5L2 17" />
              </svg>
            </div>
            <span
              style={{
                fontSize: "32px",
                fontWeight: 800,
                color: "#10b981",
                letterSpacing: "-0.03em",
              }}
            >
              Numeraise
            </span>
          </div>

          {/* Body Content */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "16px",
              maxWidth: "1000px",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                padding: "8px 16px",
                borderRadius: "9999px",
                backgroundColor: "rgba(255, 255, 255, 0.1)",
                color: "#a1a1aa",
                fontSize: "20px",
                fontWeight: 600,
                width: "fit-content",
              }}
            >
              <span>{category}</span>
            </div>

            <h1
              style={{
                fontSize: "64px",
                fontWeight: 800,
                color: "#ffffff",
                lineHeight: 1.15,
                letterSpacing: "-0.02em",
                margin: 0,
              }}
            >
              {title}
            </h1>
          </div>

          {/* Footer Badges */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              width: "100%",
              borderTop: "1px solid rgba(255, 255, 255, 0.1)",
              paddingTop: "32px",
            }}
          >
            <span
              style={{
                fontSize: "22px",
                color: "#71717a",
                fontWeight: 500,
              }}
            >
              100% Free • Multi-Currency • Zero Signup
            </span>
            <span
              style={{
                fontSize: "22px",
                color: "#10b981",
                fontWeight: 600,
              }}
            >
              numeraise.com ↗
            </span>
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
      }
    );
  } catch (e) {
    return new Response("Failed to generate OG image", { status: 500 });
  }
}
