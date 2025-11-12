import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";
import { CartProvider } from "@/contexts/CartContext";
import { Toaster } from "@/components/ui/sonner";

const inter = Inter({
  subsets: ["latin", "vietnamese"],
  display: "swap",
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "ZIP",
  description: "ZIP IT YOUR WAY",
  generator: "zip.com",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi">
      <body className={`${inter.variable} font-sans antialiased`}>
        <CartProvider>
          {children}
          <Toaster />
        </CartProvider>
        <Analytics />
      </body>
    </html>
  );
}
