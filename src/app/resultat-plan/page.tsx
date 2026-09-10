import Link from "next/link";
import { redirect } from "next/navigation";
import { Header, Footer } from "@/components/Chrome";
import { SimulationPlan } from "@/components/simulateur/SimulationPlan";
import { getOrder, profilDeCommande } from "@/lib/db";
import { possessions } from "@/lib/espace";

export const metadata = { title: "Votre simulation et votre plan adapté", robots: { index: false, follow: false } };

export default async function Page({searchParams}:{searchParams:Promise<{o?:string}>}) {
  const {o}=await searchParams;
  const order=o?await getOrder(o):null;
  if(!order||order.status!=="paid")redirect("/commande");
  const acquis=await possessions(order.email);
  if(!acquis.has("upsell1"))redirect(`/plan-complet?o=${encodeURIComponent(order.id)}`);
  const profil=await profilDeCommande(order.id);
  const suite=profil?.av==="O"?`/kit-assurance-vie?o=${encodeURIComponent(order.id)}`:`/bienvenue?o=${encodeURIComponent(order.id)}`;
  return <><Header minimal/><main className="wrap flex-1 py-8">
    <p className="border-l-4 border-green bg-green-bg p-4 font-bold">Paiement accepté : votre simulateur et votre plan adapté sont déverrouillés.</p>
    <h1 className="my-5 text-[2rem]">Voici votre résultat et l’ordre de préparation correspondant</h1>
    <SimulationPlan verrouille={false}/>
    <Link href={suite} className="mt-6 flex min-h-[56px] items-center justify-center bg-orange px-5 py-3 text-center font-bold text-white no-underline">Continuer mon parcours</Link>
  </main><Footer/></>;
}
