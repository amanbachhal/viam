import { Cormorant_Garamond, Inter } from "next/font/google";
import { Toaster } from "sonner";
import "../globals.css";
import NextTopLoader from "nextjs-toploader";

const bodyFont = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

const headingFont = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-serif",
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={`${bodyFont.variable} ${headingFont.variable} antialiased`}
      >
        <NextTopLoader
          color="#D4AF37"
          showSpinner={false}
          height={5}
          shadow="0 0 10px #D4AF37, 0 0 5px #D4AF37"
        />

        {children}

        <Toaster position="top-center" richColors={true} />
      </body>
    </html>
  );
}
