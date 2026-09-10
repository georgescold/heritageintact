import Link from "next/link";
import { Header, Footer } from "@/components/Chrome";
import { LienInvalide } from "@/components/espace/LienInvalide";
import { chargerEspace } from "@/lib/espace";
import { estJetonValide } from "@/lib/jeton";
import { guidesPossedes } from "@/lib/guides-utilisation";
import { IntroductionProduit } from "@/components/IntroductionProduit";
import { SuiteProduit } from "@/components/SuiteProduit";
import { documentParCle } from "@/lib/methode";
export const metadata = { title: "Le mode d’emploi de mes achats" };
export default async function Page({ params }: { params: Promise<{ jeton: string }> }) {
  const { jeton } = await params;
  if (!estJetonValide(jeton)) return <LienInvalide />;
  const etat = await chargerEspace(jeton);
  if (!etat || etat.acces.revoque) return <LienInvalide revoque={etat?.acces.revoque} />;
  const hub = `/espace/${jeton}`;
  const guides = guidesPossedes(etat.possede);
  return <><Header minimal /><main className="wrap flex-1 py-8">
    <Link href={hub}>Revenir à mon espace</Link>
    <h1 className="my-5 text-[2rem]">Le mode d’emploi de mes achats</h1>
    <p className="mb-5">Voici les guides correspondant à vos achats. Commencez par le guide utile à votre question du moment, puis reprenez à votre rythme. Les supports se remplissent sur papier ou dans un document que vous conservez chez vous ; vos réponses patrimoniales ne sont pas enregistrées dans ces pages.</p>
    <nav aria-label="Mes guides" className="mb-8 flex flex-col gap-3">{guides.map(g => <a key={g.sku} href={`#guide-${g.sku}`}>{g.titre}</a>)}</nav>
    {guides.map(g => <section id={`guide-${g.sku}`} key={g.sku} className="mb-10 border-t-2 border-blue pt-6">
      <h2 className="mb-3 text-[1.6rem]">{g.titre}</h2><IntroductionProduit sku={g.sku} />
      {g.seances.map(([titre,consigne,,cle]) => {
        const doc = cle ? documentParCle(cle) : null;
        return <section key={titre} className="mb-7"><h3 className="mb-3 text-[1.25rem]">{titre}</h3><p>{consigne}</p>
        {doc && etat.possede.has(doc.sku) && <Link href={`${hub}/document/${doc.cle}`}>Ouvrir : {doc.titre}</Link>}
        {!cle && <Link href={`${hub}?vue=dossier`}>Ouvrir mes dossiers</Link>}
        </section>;
      })}
      <SuiteProduit moment={g.sku} possede={etat.possede} profil={etat.profil} hub={hub} conclusion />
    </section>)}
    {!guides.length && <p>Retrouvez les fichiers de vos achats dans Mon dossier.</p>}
    <p className="mt-6">Vous pouvez contacter votre notaire dès maintenant. Ces lectures ne sont pas un préalable obligatoire à une consultation.</p>
    <Link href={`${hub}?vue=dossier`}>Retrouver mes documents</Link>
  </main><Footer /></>;
}
