import type { Metadata, Viewport } from "next";
import type { CSSProperties } from "react";
import "@fontsource-variable/outfit";
import "@fontsource-variable/dm-sans";
import "./globals.css";
import { shopConfig } from "@/config/shop";
import { ShopProvider } from "@/context/ShopContext";
import { TopBar } from "@/components/TopBar";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { CartDrawer } from "@/components/CartDrawer";
import { Toaster } from "@/components/Toaster";

export const metadata: Metadata = {
  title: {
    default: `${shopConfig.companyName} | Grossist för butiker`,
    template: `%s | ${shopConfig.shortName}`,
  },
  description: "Latinamerikansk mat och amerikansk dryck per kartong till butiker i hela Sverige. Prototyp.",
  robots: { index: false, follow: false },
};

export const viewport: Viewport = {
  themeColor: "#2b211a",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="sv" style={{ "--brand": shopConfig.brandColor } as CSSProperties}>
      <body className="flex min-h-dvh flex-col">
        <ShopProvider>
          <TopBar />
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
          <CartDrawer />
          <Toaster />
        </ShopProvider>
      </body>
    </html>
  );
}
