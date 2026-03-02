import type { Metadata } from "next";
import { Inter, Cormorant_Garamond } from "next/font/google";
import "../globals.css";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { getCachedSiteConfig } from "@/lib/site-config-cache";
import { SiteConfigProvider } from "@/components/providers/site-config-provider";
import { Banner } from "@/components/banner";

const bodyFont = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

const headingFont = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-serif",
});

export const metadata: Metadata = {
  title: {
    default: "Viam Jewels — Elegant Anti-Tarnish & Designer Jewelry",
    template: "%s | Viam Jewels",
  },

  description:
    "Discover Viam Jewels — premium anti-tarnish, traditional, and modern jewelry crafted for timeless elegance. Shop earrings, necklaces, rings, and statement pieces designed for everyday luxury.",

  keywords: [
    "Viam Jewels",
    "anti tarnish jewelry",
    "luxury jewelry India",
    "designer jewelry",
    "traditional jewelry",
    "party wear jewelry",
    "modern jewelry",
    "gold jewelry",
    "fashion jewelry",
    "earrings",
    "necklaces",
    "rings",
  ],

  openGraph: {
    title: "Viam Jewels — Elegant Anti-Tarnish & Designer Jewelry",
    description:
      "Premium anti-tarnish and designer jewelry crafted for timeless elegance.",
    siteName: "Viam Jewels",
    type: "website",
  },

  twitter: {
    card: "summary_large_image",
    title: "Viam Jewels — Elegant Anti-Tarnish & Designer Jewelry",
    description:
      "Premium anti-tarnish and designer jewelry crafted for timeless elegance.",
  },

  metadataBase: new URL("https://viamjewels.com"),
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const config = await getCachedSiteConfig();

  return (
    <html lang="en">
      <body
        className={`${bodyFont.variable} ${headingFont.variable} antialiased`}
      >
        <SiteConfigProvider config={config}>
          <Banner />
          <Header />
          <main>{children}</main>
          <Footer />
        </SiteConfigProvider>
      </body>
    </html>
  );
}
