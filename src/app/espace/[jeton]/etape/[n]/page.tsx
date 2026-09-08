import type { Metadata } from "next";
import Link from "next/link";
import { Footer, Header } from "@/components/Chrome";
import { CaseEtape } from "@/components/espace/CaseEtape";
import { LienInvalide } from "@/components/espace/LienInvalide";
import { Panel } from "@/components/ui";
import { VideoEmbed } from "@/components/VideoEmbed";
import { VIDEO } from "@/lib/config";
import { ouvrirEtape } from "@/lib/db";
import { chargerEspace } from "@/lib/espace";
import { estJetonValide } from "@/lib/jeton";
import {
  documentParCle,
  etapeParNumero,
  type DocumentImprimable,
  type EtapeMethode,
} from "@/lib/methode";

export const metadata: Metadata = { title: "Mon étape" };

/**
 * UNE ÉTAPE DE LA MÉTHODE.
 *
 * Une colonne, dans l'ordre où on s'en sert : ce qu'on va apprendre, la vidéo,
 * l'action de ce soir, les feuilles à imprimer, la case à cocher, l'étape
 * suivante. Rien d'autre, et surtout aucune vente : on ne vend pas à quelqu'un
 * qui est en train de travailler.
 *
 * ⚠️ ON DIT « ÉTAPE » DANS L'ESPACE. Le mot n'est pas décoratif : un
 * lecteur de 74 ans qui a peur de mal faire veut un protocole. « Module » est
 * du vocabulaire de formation en ligne, et il ne lui dit rien.
 */
export default async function EtapePage({
  params,
}: {
  params: Promise<{ jeton: string; n: string }>;
}) {
  const { jeton, n } = await params;

  if (!estJetonValide(jeton)) return <LienInvalide />;

  // Le numéro arrive de l'URL. `Number("")` vaut 0 et `Number("2abc")` vaut
  // NaN : les deux mènent au même endroit qu'un /etape/12, c'est-à-dire à
  // l'écran de secours, jamais à une 404.
  const numero = Number(n);
  const etape = Number.isInteger(numero) ? etapeParNumero(numero) : null;
  if (!etape) return <LienInvalide />;

  const etat = await chargerEspace(jeton);
  if (!etat) return <LienInvalide />;
  if (etat.acces.revoque) return <LienInvalide revoque />;

  /**
   * ⚠️ L'ÉCRITURE QUI DÉVERROUILLE LA BOUTIQUE, ET ELLE EST FAITE AU RENDU.
   *
   * C'est un écart assumé — on écrit pendant le rendu d'un composant serveur —
   * et il est justifié : l'alternative sans JavaScript n'existe pas, ce public
   * bloque parfois les scripts, et l'insert porte `on conflict do nothing`,
   * donc un rechargement ou un double rendu est un no-op exact.
   *
   * NE JAMAIS LE TRANSFORMER en effet client dans un `useEffect` : la boutique
   * ne s'ouvrirait plus pour une partie des membres, sans que rien ne le
   * signale nulle part.
   */
  await ouvrirEtape(etat.acces.email, etape.cle);

  const hub = `/espace/${jeton}`;
  const faite = etat.etapes.find((e) => e.etape.cle === etape.cle)?.faite ?? false;
  const suivante = etapeParNumero(etape.numero + 1);

  // Les feuilles de cette étape, réduites à ce que le membre possède vraiment.
  // La liste est écrite dans `methode.ts` ; l'habilitation, elle, se vérifie à
  // chaque affichage — et de nouveau sur la page du document, dont l'URL est
  // devinable.
  const feuilles = etape.documents
    .map(documentParCle)
    .filter((d): d is DocumentImprimable => d !== null)
    .filter((d) => etat.possede.has(d.sku));

  // ⚠️ Peut être absent : aucune vidéo n'est tournée à ce jour, et `VIDEO.etapes`
  // est plus court que 8 tant qu'elles ne le sont pas. `VideoEmbed` affiche
  // alors son cadre d'attente — c'est normal, ce n'est pas une panne.
  const videoId = VIDEO.etapes[etape.videoIndex] || undefined;

  return (
    <>
      <Header minimal />
      <main className="flex-1">
        <div className="wrap py-8">
          <p className="mb-5 text-[1.05rem]">
            <Link href={hub}>← Revenir à mon espace</Link>
          </p>

          {/* « Étape 3 sur 8 » serait faux : les étapes sont numérotées de 0 à
              7. On annonce donc le numéro et la durée, et le compte total reste
              au hub, là où il mesure une progression. */}
          <p className="mb-1 text-[1.05rem] font-bold text-orange">
            Étape {etape.numero} · {etape.minutes} minutes
          </p>
          <h1 className="mb-3 text-[1.5rem] leading-snug sm:text-[1.8rem]">{etape.titre}</h1>
          <p className="mb-6 text-[1.15rem]">{etape.resume}</p>

          <div className="mb-8">
            <VideoEmbed
              id={videoId}
              title={`Étape ${etape.numero} — ${etape.titre}`}
              minutes={etape.minutes}
            />
          </div>

          {/* L'action de ce soir : UNE seule, jamais deux. C'est ce qui
              transforme une vidéo regardée en étape réellement faite. */}
          <div className="mb-8">
            <Panel tone="yellow" title="Ce soir, faites ceci">
              <p className="text-[1.15rem]">{etape.ceSoir}</p>
            </Panel>
          </div>

          {feuilles.length > 0 && (
            <section className="mb-8">
              <h2 className="mb-3 text-[1.35rem]">LES DOCUMENTS DE CETTE ÉTAPE</h2>
              <ul className="space-y-2">
                {feuilles.map((doc) => (
                  <li key={doc.cle}>
                    <Link
                      href={`${hub}/document/${doc.cle}`}
                      className="flex min-h-[56px] items-center border border-grey-line bg-white px-4 py-3 text-[1.1rem] font-bold no-underline hover:bg-grey-bg"
                    >
                      {doc.titre}
                    </Link>
                  </li>
                ))}
              </ul>
              <p className="mt-3 text-[0.95rem] text-text-soft">
                Chaque feuille s&apos;imprime seule, et vous les retrouverez toutes ensemble dans
                votre espace.
              </p>
            </section>
          )}

          <div className="mb-8">
            <CaseEtape jeton={jeton} numero={etape.numero} faite={faite} />
          </div>

          <SuivanteOuFin jeton={jeton} suivante={suivante} />
        </div>
      </main>
      <Footer />
    </>
  );
}

/**
 * LE PAS D'APRÈS.
 *
 * Un lien discret, et non un second gros bouton : le geste principal de cette
 * page est la case à cocher juste au-dessus. Deux boutons de même poids l'un
 * sous l'autre, et il coche l'un pour l'autre.
 */
function SuivanteOuFin({ jeton, suivante }: { jeton: string; suivante: EtapeMethode | null }) {
  if (!suivante) {
    return (
      <p className="text-[1.1rem]">
        C&apos;est la dernière étape.{" "}
        <Link href={`/espace/${jeton}`}>Revenir à mon espace pour imprimer mes documents</Link>.
      </p>
    );
  }

  return (
    <p className="text-[1.1rem]">
      <Link href={`/espace/${jeton}/etape/${suivante.numero}`}>
        Étape suivante : {suivante.titre} ({suivante.minutes} minutes) →
      </Link>
    </p>
  );
}
