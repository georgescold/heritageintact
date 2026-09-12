import { Cadre } from "@/components/admin/Cadre";
import { RechercheClient } from "@/components/admin/RechercheClient";
import { periodeValide } from "@/lib/admin/agregats";
import { exigerAdmin } from "@/lib/admin/garde";

/**
 * L'ÉCRAN DU SUPPORT.
 *
 * Quelqu'un écrit « je n'ai rien reçu » : la réponse tient dans une ligne de
 * temps — inscrit tel jour, payé tel jour, accès ouvert, emails partis, étapes
 * ouvertes.
 *
 * ⚠️ LA RECHERCHE PASSE PAR UNE ACTION SERVEUR, EN POST, et non par un
 * paramètre d'URL. Une adresse email dans la barre d'adresse finit dans
 * l'historique du navigateur, dans l'en-tête `Referer` et dans les journaux.
 * La page ne lit donc aucun `searchParams` autre que la période.
 */
export default async function FicheClient({
  searchParams,
}: {
  searchParams: Promise<{ p?: string }>;
}) {
  await exigerAdmin();
  const periode = periodeValide((await searchParams).p);
  return (
    <Cadre titre="Fiche client" chemin="/admin/client" periode={periode} avecPeriode={false}>
      <p className="mt-2 max-w-[70ch] text-[0.9rem] text-text-soft">
        Tout ce que le site sait d’une adresse : inscription, commandes, accès, emails réservés et
        étapes ouvertes. Le jeton d’accès n’est jamais affiché.
      </p>
      <RechercheClient />
    </Cadre>
  );
}
