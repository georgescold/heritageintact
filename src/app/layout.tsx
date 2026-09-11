import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import "./globals.css";
import { MetaPixel } from "@/components/MetaPixel";
import { SuiviPagesMeta } from "@/components/SuiviPagesMeta";
import { EphemeralStorageBanner } from "@/components/Chrome";
import { BRAND, stockageEphemere } from "@/lib/config";
import { scriptPixelMeta } from "@/lib/meta-pixel";

const mesurePublicitaireActive = process.env.NEXT_PUBLIC_META_SERVER_MEASUREMENT === "true";

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
      <head>
        {/* Pixel Meta, jamais sur une page dont l'adresse est une clé : voir lib/meta-pixel.ts. */}
        <script id="meta-pixel" dangerouslySetInnerHTML={{ __html: scriptPixelMeta() }} />
      </head>
      <body className="min-h-full flex flex-col">
        {/* Garde-fou : voir `stockageEphemere` dans lib/config.ts. */}
        {stockageEphemere && <EphemeralStorageBanner />}
        {children}
        <SuiviPagesMeta />
        {mesurePublicitaireActive && <MetaPixel />}
      </body>
    </html>
  );
}
