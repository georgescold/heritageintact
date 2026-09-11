import Link from "next/link";
import { Header, Footer } from "@/components/Chrome";
import { LienInvalide } from "@/components/espace/LienInvalide";
import { Boutique } from "@/components/espace/Boutique";
import { MonLien } from "@/components/espace/MonLien";
import { FormulaireAvis } from "@/components/espace/FormulaireAvis";
import { ButtonLink } from "@/components/ui";
import { chargerEspace } from "@/lib/espace";
import { estJetonValide } from "@/lib/jeton";
import { CONTACT_EMAIL, type ProductSku } from "@/lib/config";
import { contexteAvis, MESSAGE_MAX, questionnaireAvis } from "@/lib/avis-questions";
import { lireAvis } from "@/lib/avis-store";
import { envoyerAvis } from "@/app/espace/avis-actions";
import { MesurerAchat } from "@/components/MetaPixel";
import { MesGuidesPdf } from "@/components/espace/MesGuidesPdf";
import { PremiereAction } from "@/components/espace/PremiereAction";
export const metadata = { title: "Mon parcours" };
const CONFIRMATION_AJOUT: Partial<Record<ProductSku, string>> = {
  bump: "Votre Dossier Notaire est maintenant accessible dans Mon dossier.",
  upsell1: "Votre plan adapté à votre situation est maintenant accessible dans Mon dossier.",
  upsell2: "Votre guide Assurance-vie est maintenant accessible dans Mon dossier.",
  backend4: "Votre Dossier Testament est maintenant accessible dans Mon dossier.",
};
function estProduitAjoute(produit?: string): produit is ProductSku {
  return Boolean(produit && produit in CONFIRMATION_AJOUT);
}
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
  const confirmationAjout = estProduitAjoute(ajoute) && etat.possede.has(ajoute)
    ? CONFIRMATION_AJOUT[ajoute]
    : undefined;
  const onglets = [
    ["parcours", "Mon parcours"],
    ["dossier", "Mon dossier"],
    ["avis", "Mon avis"],
    ["aide", "Aide"],
  ];
  const surParcours = !["dossier", "avis", "aide"].includes(vue);
  // Un incident de lecture de l'avis ne doit jamais fermer l'espace : on continue sans.
  const avis = surParcours || vue === "avis" ? await lireAvis(etat.acces.email).catch(() => null) : null;
  return (
    <>
      <Header minimal />
      <MesurerAchat id={jeton} membre />
      <main className="wrap-wide flex-1 py-8">
        <h1 className="text-[1.8rem]">Bonjour {etat.acces.firstName || "et bienvenue"}</h1>
        {nouveau === "1" && etat.possede.has("front") && (
          <section role="status" className="mt-5 border-2 border-green bg-green-bg p-5">
            <p className="text-[1.2rem] font-bold text-green">✓ Votre paiement a été accepté</p>
            <p className="mt-2">Votre guide <strong>Les 7 erreurs qui offrent votre héritage à l’État</strong> est prêt. Vous pouvez le télécharger immédiatement ci-dessous. Une fois cela fait, lisez les éléments qui suivent pour compléter votre situation.</p>
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
        {confirmationAjout && (
          <p role="status" className="mb-6 border-l-4 border-green bg-green-bg p-4">
            {confirmationAjout}
          </p>
        )}
        <div className="max-w-[760px]">
          {surParcours && !etat.possede.has("front") && (
            <section><h2 className="mb-3 text-[1.5rem]">Vos contenus restent accessibles</h2><p className="mb-4">Retrouvez les dossiers correspondant à vos achats actifs.</p><ButtonLink href={`${hub}?vue=dossier`}>Ouvrir mon dossier</ButtonLink><PremiereAction etat={etat}/></section>
          )}
          {surParcours && etat.possede.has("front") && (
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
                <PremiereAction etat={etat}/>
                <Boutique etat={etat} />
              </div>
            </>
          )}
          {surParcours && (
            <section className="mt-10 border-2 border-grey-line p-5">
              <h2 className="mb-2 text-[1.3rem]">{avis ? "Merci pour votre avis" : "Votre avis nous aide"}</h2>
              <p className="mb-4">
                {avis
                  ? "Vous pouvez le compléter ou le modifier à tout moment."
                  : "Deux minutes pour noter votre expérience et nous dire ce qui vous a aidé ou manqué."}
              </p>
              <ButtonLink href={`${hub}?vue=avis`} variant="blue">{avis ? "Modifier mon avis" : "Donner mon avis"}</ButtonLink>
            </section>
          )}
          {vue==="dossier" && <MesGuidesPdf jeton={jeton} possede={etat.possede} email={etat.acces.email}/>}
          {vue === "avis" && (
            <FormulaireAvis
              action={envoyerAvis.bind(null, jeton)}
              sections={questionnaireAvis(contexteAvis(etat))}
              existant={avis && { note: avis.note, reponses: avis.reponses, message: avis.message, publication: avis.publication, modifieLe: avis.modifieLe }}
              messageMax={MESSAGE_MAX}
            />
          )}
          {vue === "aide" && (
            <div>
              <h2 className="mb-2 text-[1.5rem]">Retrouver facilement mon espace</h2>
              <p className="mb-6">Conservez votre lien personnel dans vos favoris ou demandez son renvoi automatique ci-dessous.</p>
              <MonLien jeton={jeton} email={etat.acces.email} />
              <section className="mt-8 border-t border-grey-line pt-6">
                <h2 className="mb-3 text-[1.2rem]">Avant de demander de l’aide</h2>
                <ul className="list-disc space-y-2 pl-5 text-text-soft">
                  <li>Pour retrouver un achat, ouvrez l’onglet <Link href={`${hub}?vue=dossier`}>Mon dossier</Link>.</li>
                  <li>Pour récupérer votre accès, utilisez le bouton de renvoi automatique ci-dessus.</li>
                  <li>Pour une décision juridique, fiscale ou patrimoniale individuelle, contactez le professionnel compétent.</li>
                </ul>
              </section>
              <section className="mt-10 border-t border-grey-line pt-5 text-sm text-text-soft">
                <p className="mb-2 font-bold">Vous ne trouvez toujours pas la réponse ?</p>
                <p>
                  Pour une difficulté d’accès ou une demande de remboursement, écrivez à <a href={`mailto:${CONTACT_EMAIL}`} className="text-text-soft">{CONTACT_EMAIL}</a>.
                  N’envoyez aucun relevé bancaire ni aucune donnée sensible concernant vos proches.
                </p>
              </section>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
