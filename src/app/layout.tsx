import type { Metadata, Viewport } from "next";
import "./globals.css";

const siteUrl = "https://financehub-nemeziz.vercel.app";
const appTitle = "FinanceHub Beta | Control de gastos y finanzas personales";
const appDescription =
  "Administra ingresos, gastos, categorías, metas y deudas desde una experiencia moderna, segura y pensada para tu salud financiera.";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: appTitle,
    template: "%s | FinanceHub Beta",
  },
  description: appDescription,
  applicationName: "FinanceHub Beta",
  keywords: [
    "FinanceHub",
    "control de gastos",
    "finanzas personales",
    "presupuesto",
    "metas de ahorro",
    "seguimiento de deudas",
    "gestión financiera",
  ],
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: appTitle,
    description: appDescription,
    url: siteUrl,
    siteName: "FinanceHub Beta",
    type: "website",
    locale: "es_CO",
    images: [
      {
        url: "/opengraph-image",
        width: 1200,
        height: 630,
        alt: "FinanceHub Beta - Control de gastos y finanzas personales",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: appTitle,
    description: appDescription,
    images: ["/opengraph-image"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  icons: {
    icon: [
      { url: "/icon-192x192.png", sizes: "192x192", type: "image/png" },
      { url: "/icon-512x512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [
      {
        url: "/apple-touch-icon.png",
        sizes: "180x180",
        type: "image/png",
      },
    ],
    shortcut: ["/favicon.ico"],
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "FinanceHub Beta",
  },
};

export const viewport: Viewport = {
  themeColor: "#0a0f16",
  colorScheme: "dark",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className="h-full antialiased">
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
