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

const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://www.viamjewels.com";

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  title: {
    default: "Viam Jewels | Exquisite Artificial Jewelry",
    template: "%s | Viam Jewels",
  },
  description:
    "Discover stunning, high-quality artificial jewelry. From elegant necklaces to statement earrings, elevate your style with Viam Jewels.",
  keywords: [
    "artificial jewelry",
    "fashion jewelry",
    "bridal jewelry",
    "imitation jewelry",
    "Viam Jewels",
  ],
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "en_IN", // Adjust locale if targeting a different primary market
    url: baseUrl,
    title: "Viam Jewels | Exquisite Artificial Jewelry",
    description:
      "Discover stunning, high-quality artificial jewelry tailored for every occasion.",
    siteName: "Viam Jewels",
    images: [
      {
        url: "/hero1.webp", // Use your highest quality hero image
        width: 1200,
        height: 630,
        alt: "Viam Jewels Collection",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Viam Jewels",
    description: "Discover stunning, high-quality artificial jewelry.",
    images: ["/hero1.webp"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const config = await getCachedSiteConfig();

  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "JewelryStore",
    name: "Viam Jewels",
    url: baseUrl,
    logo: `${baseUrl}/logo.webp`,
    description: "Exquisite artificial jewelry for every occasion.",
    image: `${baseUrl}/hero1.webp`,
    sameAs: ["https://instagram.com/viamjewels"],
    address: {
      "@type": "PostalAddress",
      addressCountry: "IN",
    },
    icons: {
      icon: "/favicon.ico",
      shortcut: "/favicon.ico",
    },
  };

  return (
    <html lang="en">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(organizationSchema),
          }}
        />
      </head>
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
