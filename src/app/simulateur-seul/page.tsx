import { redirect } from "next/navigation";
export default async function Page({ searchParams }: { searchParams: Promise<{ o?: string }> }) {
  const { o } = await searchParams;
  redirect(o ? `/merci?o=${encodeURIComponent(o)}` : "/methode");
}
