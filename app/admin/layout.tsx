import { Cormorant_Garamond, Inter } from "next/font/google";
import { Toaster } from "sonner";
import "../globals.css";

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
        {children}

        <Toaster position="top-center" richColors={true} />
      </body>
    </html>
  );
}
