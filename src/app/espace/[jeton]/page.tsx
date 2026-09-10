import Link from "next/link";
import { Header, Footer } from "@/components/Chrome";
import { LienInvalide } from "@/components/espace/LienInvalide";
import { Boutique } from "@/components/espace/Boutique";
import { MonLien } from "@/components/espace/MonLien";
import { ButtonLink } from "@/components/ui";
import { chargerEspace } from "@/lib/espace";
import { estJetonValide } from "@/lib/jeton";
import { CONTACT_EMAIL } from "@/lib/config";
import { MesurerAchat } from "@/components/MetaPixel";
import { MesGuidesPdf } from "@/components/espace/MesGuidesPdf";
export const metadata = { title: "Mon parcours" };
export default async function Page({
  params,
  searchParams,
}: {
  params: Promise<{ jeton: string }>;
  searchParams: Promise<{ vue?: string; ajoute?: string; nouveau?: string }>;
}) {
  const { jeton } = await params;
  const { vue = "parcours", ajoute, nouveau } = await searchParams;
  if (!estJetonValide(jeton)) return <LienInvalide />;
  const etat = await chargerEspace(jeton);
  if (!etat) return <LienInvalide />;
  if (etat.acces.revoque)
    return (
      <LienInvalide
        revoque
        simulateur={
          etat.documents[0] ? `/espace/${jeton}/document/${etat.documents[0].cle}` : undefined
        }
      />
    );
  const hub = `/espace/${jeton}`;
  const onglets = [
    ["parcours", "Mon parcours"],
    ["dossier", "Mon dossier"],
    ["aide", "Aide"],
  ];
  return (
    <>
      <Header minimal />
      <MesurerAchat id={jeton} membre />
      <main className="wrap-wide flex-1 py-8">
        <h1 className="text-[1.8rem]">Bonjour {etat.acces.firstName || "et bienvenue"}</h1>
        {nouveau === "1" && etat.possede.has("front") && (
          <section role="status" className="mt-5 border-2 border-green bg-green-bg p-5">
            <p className="text-[1.2rem] font-bold text-green">✓ Votre paiement a été accepté</p>
            <p className="mt-2">Votre guide <strong>Les 7 erreurs qui offrent votre héritage à l’État</strong> est prêt. Vous pouvez le télécharger immédiatement ci-dessous.</p>
          </section>
        )}
        <nav
          aria-label="Mon espace"
          className="my-6 flex flex-wrap gap-2 border-b border-grey-line pb-3"
        >
          {onglets.map(([cle, titre]) => (
            <Link
              key={cle}
              href={`${hub}?vue=${cle}`}
              aria-current={vue === cle ? "page" : undefined}
              className={`flex min-h-[48px] items-center px-4 no-underline ${vue === cle ? "bg-blue font-bold text-white" : "bg-grey-bg"}`}
            >
              {titre}
            </Link>
          ))}
        </nav>
        {ajoute && etat.possede.has(ajoute as never) && (
          <p role="status" className="mb-6 border-l-4 border-green bg-green-bg p-4">
            Votre complément est maintenant accessible dans Mon dossier.
          </p>
        )}
        <div className="max-w-[760px]">
          {!["dossier", "aide"].includes(vue) && !etat.possede.has("front") && (
            <section><h2 className="mb-3 text-[1.5rem]">Vos contenus restent accessibles</h2><p className="mb-4">Retrouvez les dossiers correspondant à vos achats actifs.</p><ButtonLink href={`${hub}?vue=dossier`}>Ouvrir mon dossier</ButtonLink></section>
          )}
          {!["dossier", "aide"].includes(vue) && etat.possede.has("front") && (
            <>
              <section className="mb-8 border-2 border-blue bg-grey-bg p-5 sm:p-6">
                <p className="font-bold uppercase tracking-wide text-orange-dark">Votre achat</p>
                <h2 className="my-3 text-[1.55rem]">Les 7 erreurs qui offrent votre héritage à l’État</h2>
                <p className="mb-5">Votre guide est réuni dans un seul fichier. Téléchargez-le pour le lire, l’imprimer ou le conserver sur votre ordinateur.</p>
                <div>
                  <a className="inline-flex min-h-[54px] w-full items-center justify-center bg-orange px-5 py-3 text-center font-bold text-white no-underline" href={`${hub}/pdf/les-7-erreurs`} download>
                    Télécharger mon guide PDF
                  </a>
                </div>
              </section>
              <div className="mt-10 border-t-2 border-blue pt-8">
                <Boutique etat={etat} />
              </div>
            </>
          )}
          {vue==="dossier" && <MesGuidesPdf jeton={jeton} possede={etat.possede}/>}
          {vue === "aide" && (
            <div className="space-y-6">
              <h2 className="text-[1.5rem]">Une question sur votre préparation ?</h2>
              <p>
                Écrivez à <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a> pour une question
                d’accès, une consigne ou une demande de remboursement. N’envoyez pas de relevé
                bancaire ni de données sensibles de vos proches.
              </p>
              <p>
                Pour une décision juridique, fiscale ou patrimoniale individuelle, contactez le
                professionnel compétent. En cas de délai urgent, n’attendez pas de réponse de notre
                support.
              </p>
              <MonLien jeton={jeton} email={etat.acces.email} />
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
