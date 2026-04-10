import { ImageResponse } from "next/og";

export const alt = "FinanceHub Beta - Control de gastos y finanzas personales";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

const siteUrl = "https://financehub-nemeziz.vercel.app";
const logoUrl = `${siteUrl}/logo.png`;

export default function OpenGraphImage() {
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        padding: "56px",
        background:
          "linear-gradient(135deg, #020617 0%, #061123 55%, #0f172a 100%)",
        color: "#f8fafc",
        fontFamily: "sans-serif",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "24px",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
          <img
            src={logoUrl}
            width={112}
            height={112}
            alt="FinanceHub logo"
            style={{ borderRadius: "28px" }}
          />
          <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
            <span
              style={{
                fontSize: 24,
                fontWeight: 800,
                letterSpacing: "0.34em",
                color: "#67e8f9",
              }}
            >
              BETA
            </span>
            <span style={{ fontSize: 56, fontWeight: 800, lineHeight: 1 }}>
              FinanceHub
            </span>
          </div>
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            borderRadius: "999px",
            border: "1px solid rgba(103,232,249,0.24)",
            background: "rgba(8,145,178,0.12)",
            padding: "10px 18px",
            fontSize: 18,
            color: "#cffafe",
          }}
        >
          financehub-nemeziz.vercel.app
        </div>
      </div>

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "18px",
          maxWidth: "860px",
        }}
      >
        <span style={{ fontSize: 58, fontWeight: 800, lineHeight: 1.1 }}>
          Controla gastos, categorías, metas y deudas desde un solo lugar.
        </span>
        <span style={{ fontSize: 28, lineHeight: 1.35, color: "#cbd5e1" }}>
          Una experiencia moderna para organizar tu salud financiera personal.
        </span>
      </div>
    </div>,
    size,
  );
}
