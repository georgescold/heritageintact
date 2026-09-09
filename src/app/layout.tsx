import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import "./globals.css";
import { MetaPixel } from "@/components/MetaPixel";
import { EphemeralStorageBanner } from "@/components/Chrome";
import { BRAND, stockageEphemere } from "@/lib/config";

export const metadata: Metadata = {
  title: {
    default: BRAND,
    template: `%s | ${BRAND}`,
  },
  description:
    "Transmettre intact ce que vous avez construit. La succession enfin expliquée clairement.",
  robots: { index: false, follow: false },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="fr" className="h-full">
      <body className="min-h-full flex flex-col">
        {/* Garde-fou : voir `stockageEphemere` dans lib/config.ts. */}
        {stockageEphemere && <EphemeralStorageBanner />}
        {children}
        <MetaPixel />
      </body>
    </html>
  );
}
