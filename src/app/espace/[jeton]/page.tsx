import Link from "next/link";
import { Header, Footer } from "@/components/Chrome";
import { LienInvalide } from "@/components/espace/LienInvalide";
import { MesDocuments } from "@/components/espace/MesDocuments";
import { Boutique } from "@/components/espace/Boutique";
import { MonLien } from "@/components/espace/MonLien";
import { ButtonLink } from "@/components/ui";
import { chargerEspace } from "@/lib/espace";
import { estJetonValide } from "@/lib/jeton";
import { CONTACT_EMAIL, PRODUCTS } from "@/lib/config";
import { PrioriteActuelle } from "@/components/espace/PrioriteActuelle";
import { MesurerAchat } from "@/components/MetaPixel";
export const metadata = { title: "Mon parcours" };
export default async function Page({
  params,
  searchParams,
}: {
  params: Promise<{ jeton: string }>;
  searchParams: Promise<{ vue?: string; ajoute?: string }>;
}) {
  const { jeton } = await params;
  const { vue = "parcours", ajoute } = await searchParams;
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
    ["outils", "Mes outils"],
    ["aide", "Aide"],
  ];
  return (
    <>
      <Header minimal />
      <MesurerAchat id={jeton} membre />
      <main className="wrap-wide flex-1 py-8">
        <h1 className="text-[1.8rem]">Bonjour {etat.acces.firstName || "et bienvenue"}</h1>
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
            Votre complément est accessible dans Mon dossier et Mes outils.
          </p>
        )}
        <div className="max-w-[760px]">
          <p className="mb-6"><Link href={`${hub}/demarrer`}>Bien utiliser mes achats : le guide pas à pas</Link></p>
          {(vue === "parcours" || vue === "outils") && etat.etapes.some(e => e.etape.cle === "e0" && e.faite) && <PrioriteActuelle jeton={jeton} objectif={etat.profil?.objectif} av={etat.profil?.av} />}
          {!["dossier", "outils", "aide"].includes(vue) && !etat.possede.has("front") && (
            <section><h2 className="mb-3 text-[1.5rem]">Vos contenus restent accessibles</h2><p className="mb-4">Retrouvez les supports et modules correspondant à vos achats actifs.</p><ButtonLink href={`${hub}?vue=outils`}>Ouvrir mes outils</ButtonLink></section>
          )}
          {!["dossier", "outils", "aide"].includes(vue) && etat.possede.has("front") && (
            <>
              <section className="mb-9 bg-grey-bg p-6">
                <p className="font-bold text-orange-dark">
                  {etat.nbFaites} étape{etat.nbFaites > 1 ? "s" : ""} terminée
                  {etat.nbFaites > 1 ? "s" : ""} sur 8
                </p>
                {etat.reprendre ? (
                  <>
                    <h2 className="my-3 text-[1.6rem]">
                      Votre prochaine étape : {etat.reprendre.titre}
                    </h2>
                    <p className="mb-5">{etat.reprendre.resume}</p>
                    <ButtonLink href={`${hub}/etape/${etat.reprendre.numero}`}>
                      Continuer ma préparation
                    </ButtonLink>
                  </>
                ) : (
                  <>
                    <h2 className="my-3 text-[1.5rem]">Votre parcours écrit est terminé</h2>
                    <p>
                      Relisez vos questions et préparez votre rendez-vous. Avoir suivi le parcours
                      ne signifie pas que vos décisions ont été validées.
                    </p>
                    <Link href={`${hub}?vue=dossier`}>Retrouver mon dossier</Link>
                  </>
                )}
              </section>
              <h2 className="mb-4 text-[1.4rem]">Les étapes, à votre rythme</h2>
              <ol className="space-y-3">
                {etat.etapes.map(({ etape, faite }) => (
                  <li key={etape.cle}>
                    <Link
                      className="flex min-h-[56px] items-center justify-between gap-4 border-b border-grey-line py-3"
                      href={`${hub}/etape/${etape.numero}`}
                    >
                      <span>
                        {etape.numero + 1}. {etape.titre}
                      </span>
                      <span className="shrink-0 whitespace-nowrap text-text-soft">
                        {faite ? "Terminée" : `≈ ${etape.minutes} min`}
                      </span>
                    </Link>
                  </li>
                ))}
              </ol>
              <p className="mt-6 text-text-soft">
                Les durées comprennent la préparation. Les vidéos sont facultatives : toutes les
                explications sont écrites.
              </p>
            </>
          )}
          {vue === "dossier" && <MesDocuments etat={etat} />}
          {vue === "outils" && (
            <div className="space-y-8">
              <h2 className="text-[1.5rem]">Mes outils et compléments</h2>
              {etat.possede.has("backend1") && (
                <section>
                  <h3 className="mb-2 text-[1.3rem]">{PRODUCTS.backend1.name}</h3>
                  <p className="mb-3">
                    Explorez des hypothèses explicites. Un résultat pédagogique ne valide ni une
                    succession ni une décision.
                  </p>
                  <Link href={`${hub}/simulateur`}>Ouvrir mon atelier</Link>
                </section>
              )}
              {etat.possede.has("upsell2") && (
                <section>
                  <h3 className="mb-2 text-[1.3rem]">Mon module assurance-vie</h3>
                  <Link href={`${hub}/assurance-vie`}>
                    Préparer la vérification de mes contrats
                  </Link>
                </section>
              )}
              <Boutique etat={etat} />
            </div>
          )}
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
