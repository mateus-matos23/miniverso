import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import { site } from "@/lib/site";
import "./globals.css";

const displayFont = localFont({
  src: [
    { path: "./fonts/Thunder-MediumLC.woff2", weight: "500", style: "normal" },
    { path: "./fonts/Thunder-BoldLC.woff2", weight: "700", style: "normal" },
  ],
  display: "swap",
  variable: "--font-brand-display",
  fallback: ["Arial Narrow", "sans-serif"],
  adjustFontFallback: false,
});

const bodyFont = localFont({
  src: [
    { path: "./fonts/RG-StandardBook.ttf", weight: "400", style: "normal" },
    { path: "./fonts/RG-StandardMedium.ttf", weight: "500", style: "normal" },
    { path: "./fonts/RG-StandardSemibold.ttf", weight: "600", style: "normal" },
    { path: "./fonts/RG-StandardBold.ttf", weight: "700", style: "normal" },
  ],
  display: "swap",
  variable: "--font-brand-body",
  fallback: ["Arial", "sans-serif"],
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: site.title,
    template: `%s | ${site.name}`,
  },
  description: site.description,
  applicationName: site.name,
  keywords: [
    "realidade virtual na educação",
    "edtech",
    "gamificação",
    "aprendizagem socioemocional",
    "São Luís",
    "Maranhão",
  ],
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: site.locale,
    url: "/",
    siteName: site.name,
    title: site.title,
    description: site.description,
  },
  twitter: {
    card: "summary_large_image",
    title: site.title,
    description: site.description,
  },
  formatDetection: { telephone: false },
};

export const viewport: Viewport = {
  themeColor: "#0c0407",
  colorScheme: "light",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="pt-BR"
      className={`h-full antialiased ${displayFont.variable} ${bodyFont.variable}`}
    >
      <body className="min-h-full bg-brand-white font-body text-brand-black">
        {children}
      </body>
    </html>
  );
}
