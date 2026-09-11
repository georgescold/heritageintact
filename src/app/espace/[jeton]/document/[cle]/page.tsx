import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { LienInvalide } from "@/components/espace/LienInvalide";
import { profilParEmail } from "@/lib/db";
import { chargerEspace } from "@/lib/espace";
import { estJetonValide } from "@/lib/jeton";
import { EDITORIAL_FICHES } from "@/lib/editorial-fiches";
import { SuiteProduit } from "@/components/SuiteProduit";
import { documentParCle } from "@/lib/methode";
import { DocumentEditable } from "@/components/documents/DocumentEditable";

export const metadata: Metadata = { title: "Votre document" };

/**
 * UNE FEUILLE, SEULE, PRÊTE À IMPRIMER.
 *
 * Ni Header ni Footer : ce qui sort de l'imprimante doit être le document et
 * rien d'autre. Le seul décor est le bloc `no-print` du haut, qui disparaît au
 * moment de l'impression.
 *
 * ⚠️ LA GARDE D'HABILITATION EST ICI, ET PAS SEULEMENT DANS LA LISTE. L'URL
 * d'un document est courte et devinable : masquer une feuille dans le rendu de
 * « MES DOCUMENTS » ne protège strictement rien. C'est `possede.has(sku)` qui
 * protège, et il doit être vérifié à chaque affichage.
 */
export default async function DocumentPage({
  params,
}: {
  params: Promise<{ jeton: string; cle: string }>;
}) {
  const { jeton, cle } = await params;

  // La forme du jeton se vérifie sans ouvrir la base : une URL tronquée par un
  // client mail est le scénario nominal, pas l'exception.
  if (!estJetonValide(jeton)) return <LienInvalide />;

  const etat = await chargerEspace(jeton);
  if (!etat) return <LienInvalide />;

  const doc = documentParCle(cle);

  /**
   * ⚠️ UN ACCÈS FERMÉ N'EST PAS UNE PORTE ENTIÈREMENT CLOSE : les CGV (art. 6)
   * promettent que le client rembourse conserve le simulateur. `chargerEspace`
   * réduit alors `documents` à cette seule feuille — c'est elle, et rien
   * d'autre, qui reste servie ici.
   */
  if (etat.acces.revoque) {
    if (!doc || !etat.documents.some((d) => d.cle === doc.cle)) return <LienInvalide revoque />;
  } else if (!doc || !etat.possede.has(doc.sku)) {
    // ⚠️ Un slug inconnu et un document non possédé se traitent de la même
    // façon : retour silencieux au hub. Ni 404, ni « accès refusé » — sur
    // quelqu'un qui a payé, une page d'erreur se lit comme une arnaque, et une
    // page d'accès refusé lui apprend surtout que l'URL devinée était bonne.
    // `redirect()` lève par conception : il est appelé hors de tout try/catch.
    redirect(`/espace/${jeton}`);
  }

  if (!doc) redirect(`/espace/${jeton}`);

  /**
   * LES QUATRE RÉPONSES DU BON DE COMMANDE, S'IL Y EN A.
   *
   * ⚠️ LUES SUR LA BASE, JAMAIS SUR L'URL. Une feuille dont la case pré-cochée
   * dépendrait d'un paramètre d'adresse serait pré-cochable par n'importe qui,
   * et surtout : ces réponses sont des données personnelles, elles ne
   * transitent par aucune URL. `profilParEmail` rend la ligne la plus récente,
   * ou `null` — et `null` est le cas normal, celui du classeur d'aujourd'hui.
   *
   * Le résultat est passé à TOUTES les feuilles, y compris celles qui ne s'en
   * servent pas : une prop optionnelle qu'on ignore ne coûte rien, alors qu'une
   * liste de feuilles « qui reçoivent le profil » se périmerait au premier
   * document ajouté.
   */
  const profil = await profilParEmail(etat.acces.email);

  const Corps = doc.corps;
  const intro = EDITORIAL_FICHES[cle];

  return (
    <main className="flex-1">
      <div className="no-print wrap py-6">
        <p className="mb-4">
          <Link href={`/espace/${jeton}?vue=dossier`}>← Revenir à Mon dossier</Link>
        </p>
        {intro && <section className="mb-6 border-l-4 border-orange bg-grey-bg p-5"><h1 className="mb-3 text-[1.5rem]">{doc.titre}</h1><p className="mb-3 text-lg">{intro[0]}</p><p><strong>Ce que vous allez comprendre : </strong>{intro[1]}</p></section>}
      </div>

      <DocumentEditable jeton={jeton} cle={cle}><div className="wrap-wide pb-10 print:pb-0">
        <Corps profil={profil ?? undefined} />
      </div></DocumentEditable>
      {!etat.acces.revoque && <div className="no-print wrap"><p className="my-6 border-l-4 border-green bg-green-bg p-4">Votre fiche est prête à être utilisée lorsque les informations connues et les questions restantes sont notées. Enregistrez-la avant de quitter cette page : vous pourrez la retrouver dans Mon dossier.</p><SuiteProduit moment={cle} possede={etat.possede} profil={profil} hub={"/espace/"+jeton} /></div>}
    </main>
  );
}
