import AdminSidebar from "@/components/sidebar";
import { Cormorant_Garamond, Inter } from "next/font/google";
import NextTopLoader from "nextjs-toploader";
import "../../globals.css";

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

        <div className="flex min-h-screen relative">
          <AdminSidebar />

          <main className="flex-1 bg-stone-400 p-4 pt-16 md:p-6 h-screen overflow-hidden">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
