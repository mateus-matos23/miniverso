import type { Metadata } from "next";
import { Geist, Inter } from "next/font/google";
import "./globals.css";

const displayFont = Geist({
  display: "swap",
  subsets: ["latin"],
  variable: "--font-brand-display",
});

const bodyFont = Inter({
  display: "swap",
  subsets: ["latin"],
  variable: "--font-brand-body",
});

export const metadata: Metadata = {
  title: "Miniverso — Todo aprendizado pode virar mundo",
  description:
    "Educação imersiva através da realidade virtual e da gamificação.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="pt-BR"
      className={`h-full scroll-smooth antialiased ${displayFont.variable} ${bodyFont.variable}`}
    >
      <body className="min-h-full bg-brand-white font-body text-brand-black">
        {children}
      </body>
    </html>
  );
}
