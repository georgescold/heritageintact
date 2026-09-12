import { redirect } from "next/navigation";

/**
 * Ancienne adresse du Dossier complet, conservée parce qu'elle circule encore
 * dans des emails partis. Elle emmène vers l'offre qui la remplace.
 */
export default async function Page({ searchParams }: { searchParams: Promise<{ o?: string }> }) {
  const { o } = await searchParams;
  redirect(o ? `/plan-complet?o=${encodeURIComponent(o)}` : "/methode");
}
