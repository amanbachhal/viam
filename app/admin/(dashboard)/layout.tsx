import AdminSidebar from "@/components/sidebar";
import { Cormorant_Garamond, Inter } from "next/font/google";
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
        <div className="flex min-h-screen">
          <AdminSidebar />

          <main className="flex-1 bg-stone-400 p-6 overflow-auto">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
