import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import { getLanding } from "@/lib/landing/get-landing";
import { site } from "@/lib/site";
import "./globals.css";
import { Providers } from "./providers";

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

export async function generateMetadata(): Promise<Metadata> {
  const {
    doc: { config },
  } = await getLanding();
  const { titulo, descricao, imagemOg } = config.seo;
  // Sem imagem escolhida no admin, vale a imagem gerada em opengraph-image.tsx.
  const imagens = imagemOg
    ? [
        {
          url: imagemOg.url,
          width: imagemOg.largura ?? 1200,
          height: imagemOg.altura ?? 630,
          alt: imagemOg.alt || titulo,
        },
      ]
    : undefined;

  return {
    metadataBase: new URL(site.url),
    title: {
      default: titulo,
      template: `%s | ${site.name}`,
    },
    description: descricao,
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
      title: titulo,
      description: descricao,
      ...(imagens ? { images: imagens } : {}),
    },
    twitter: {
      card: "summary_large_image",
      title: titulo,
      description: descricao,
      ...(imagens ? { images: imagens } : {}),
    },
    formatDetection: { telephone: false },
  };
}

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
        {/* sem JS os reveals do motion nunca tocam: mostra o estado final */}
        <noscript>
          <style>
            {
              '[style*="opacity:0"]{opacity:1!important}[style*="opacity:0"],[style*="scaleX(0)"]{transform:none!important}'
            }
          </style>
        </noscript>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
