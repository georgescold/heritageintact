import Link from "next/link";
import { Header, Footer } from "@/components/Chrome";
import { LienInvalide } from "@/components/espace/LienInvalide";
import { CaseEtape } from "@/components/espace/CaseEtape";
import { chargerEspace } from "@/lib/espace";
import { ouvrirEtape } from "@/lib/db";
import { estJetonValide } from "@/lib/jeton";
import { LECONS } from "@/lib/lecons";
import { documentParCle } from "@/lib/methode";
import { OUVERTURES_CHAPITRES } from "@/lib/editorial-produits";
import { SuiteProduit } from "@/components/SuiteProduit";
export default async function Page({ params }: { params: Promise<{ jeton: string; n: string }> }) {
  const { jeton, n } = await params;
  if (!estJetonValide(jeton)) return <LienInvalide />;
  const etat = await chargerEspace(jeton);
  if (!etat || etat.acces.revoque || !etat.possede.has("front")) return <LienInvalide revoque={etat?.acces.revoque} />;
  const lecon = LECONS.find((l) => String(l.numero) === n);
  if (!lecon) return <LienInvalide />;
  await ouvrirEtape(etat.acces.email, lecon.cle);
  const hub = `/espace/${jeton}`;
  const faite = etat.etapes.find((e) => e.etape.cle === lecon.cle)?.faite ?? false;
  const docs = lecon.documents.map(documentParCle).filter((d) => d && etat.possede.has(d.sku));
  return (
    <>
      <Header minimal />
      <main className="wrap flex-1 py-8">
        <Link href={hub}>Revenir à mon parcours</Link>
        <p className="mt-6 font-bold text-orange-dark">
          Étape {lecon.numero + 1} sur 8 · environ {lecon.minutes} minutes de préparation
        </p>
        <h1 className="my-4 text-[1.9rem] leading-tight">{lecon.titre}</h1>
        <p className="mb-4 text-[1.2rem] leading-relaxed">{OUVERTURES_CHAPITRES[lecon.cle]}</p>
        <section className="mb-6 border-l-4 border-orange bg-grey-bg p-5"><h2 className="mb-3 text-[1.3rem]">Ce que vous allez comprendre</h2><ul className="list-disc space-y-2 pl-5">{lecon.acquis.map(a=><li key={a}>{a}</li>)}</ul></section>
        <a className="inline-flex min-h-[48px] items-center border-2 border-blue px-4 font-bold" href={hub+"/pdf/les-7-erreurs"}>Télécharger le guide complet en PDF</a>
        <p className="my-6 text-text-soft">
          Vous pouvez suivre toute cette étape à l’écrit. Les exemples sont fictifs et ne
          constituent pas une consultation.
        </p>
        <article className="space-y-7">
          {lecon.blocs.map(([titre, texte]) => (
            <section key={titre}>
              <h2 className="mb-2 text-[1.35rem]">{titre}</h2>
              <p className="text-[1.1rem] leading-relaxed">{texte}</p>
            </section>
          ))}
        </article>
        <section className="my-8 border-l-4 border-orange bg-yellow-bg p-5">
          <h2 className="mb-2 text-[1.3rem]">Votre prochain pas utile</h2>
          <p>{lecon.aFaire}</p>
          {"siNonConcerne" in lecon && <p className="mt-3">{lecon.siNonConcerne}</p>}
        </section>
        {docs.length > 0 && (
          <section className="mb-8">
            <h2 className="mb-3 text-[1.3rem]">Vos supports</h2>
            <ul className="space-y-3">
              {docs.map(
                (d) =>
                  d && (
                    <li key={d.cle}>
                      <Link href={`${hub}/document/${d.cle}`}>{d.titre}</Link>
                    </li>
                  ),
              )}
            </ul>
          </section>
        )}
        <SuiteProduit moment={lecon.cle} possede={etat.possede} profil={etat.profil} hub={hub} conclusion={lecon.cle==="e7"} />
        <CaseEtape jeton={jeton} numero={lecon.numero} faite={faite} />
        <p className="mt-6">
          {lecon.numero < 7 ? (
            <Link href={`${hub}/etape/${lecon.numero + 1}`}>Passer à l’étape suivante</Link>
          ) : (
            <Link href={`${hub}?vue=dossier`}>Retrouver mon dossier</Link>
          )}
        </p>
        <p className="mt-8 text-[0.95rem] text-text-soft">
          Vérifiez votre situation avec un professionnel avant toute décision. Sources officielles à
          consulter dans leur version en vigueur :{" "}
          <a href="https://www.service-public.gouv.fr/particuliers/vosdroits/F2529">
            Service-Public
          </a>{" "}
          et <a href="https://www.impots.gouv.fr/particulier">impots.gouv.fr</a>.
        </p>
      </main>
      <Footer />
    </>
  );
}
