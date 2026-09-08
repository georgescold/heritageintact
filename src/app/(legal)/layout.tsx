import type { ReactNode } from "react";
import { Header, Footer } from "@/components/Chrome";

export default function LegalLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <Header minimal />
      <main className="flex-1">
        <article className="wrap py-8 text-[0.95rem] [&_h1]:mb-5 [&_h1]:text-[1.6rem] [&_h2]:mb-2 [&_h2]:mt-6 [&_h2]:text-[1.15rem] [&_p]:mb-3 [&_ul]:mb-3 [&_ul]:list-disc [&_ul]:pl-6">
          {children}
        </article>
      </main>
      <Footer />
    </>
  );
}
