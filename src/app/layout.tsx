import type { Metadata, Viewport } from "next";
import "./globals.css";
import { MetaPixel } from "@/components/MetaPixel";
import { BRAND } from "@/lib/config";

export const metadata: Metadata = {
  title: {
    default: BRAND,
    template: `%s | ${BRAND}`,
  },
  description:
    "Transmettre intact ce que vous avez construit. La succession expliquée en français simple.",
  robots: { index: false, follow: false },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="fr" className="h-full">
      <body className="min-h-full flex flex-col">
        <MetaPixel />
        {children}
      </body>
    </html>
  );
}
