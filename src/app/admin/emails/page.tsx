import { Cadre } from "@/components/admin/Cadre";
import { Barres, Carte, Grille, Section, Tableau } from "@/components/admin/Ui";
import { parEnvoi, periodeValide } from "@/lib/admin/agregats";
import { chargerAdmin } from "@/lib/admin/donnees";
import { exigerAdmin } from "@/lib/admin/garde";

/**
 * CE QUI EST PARTI, PAS CE QUI A ÉTÉ LU.
 *
 * Les clés de `Acces.envoyes` et `Lead.envoyes` sont posées au moment de la
 * RÉSERVATION d'un envoi — c'est leur fonction première : empêcher un doublon
 * si le cron rejoue. Elles prouvent donc qu'un email a été demandé, pas qu'il a
 * été délivré, ouvert ou lu. L'écran l'écrit, parce que c'est exactement le
 * genre de chiffre qu'on prend pour un taux d'ouverture.
 */
const LIBELLES: Record<string, string> = {
  acces: "Lien d’accès à l’espace",
  j0: "Séquence prospect J0",
  j1: "Séquence prospect J1",
  j2: "Séquence prospect J2",
  j3: "Séquence prospect J3",
  j4: "Séquence prospect J4",
  j5: "Séquence prospect J5",
  j6: "Séquence prospect J6",
  j7: "Séquence prospect J7",
  c1: "Client — étape 1",
  c2: "Client — étape 2",
  c3: "Client — étape 3",
  "ltv-v3-1": "Relance LTV 1",
  "ltv-v3-2": "Relance LTV 2",
  "ltv-pause": "LTV mise en pause",
  "ltv-v3-date": "Marqueur de date LTV",
  recu: "Reçu d’achat",
};

export default async function Emails({ searchParams }: { searchParams: Promise<{ p?: string }> }) {
  await exigerAdmin();
  const periode = periodeValide((await searchParams).p);
  const d = await chargerAdmin(periode);

  // Les envois se comptent sur tout l'historique : une clé posée il y a deux
  // mois reste un email parti, et la filtrer par date d'inscription ne dirait
  // rien d'utile.
  const envois = parEnvoi(d.tous.acces, d.tous.leads);
  const desabonnes = d.tous.leads.filter((l) => l.desabonne).length;
  const jamaisTouches = d.tous.leads.filter((l) => !(l.envoyes ?? []).length).length;
  const total = envois.reduce((n, e) => n + e.nombre, 0);

  return (
    <Cadre
      titre="Emails"
      chemin="/admin/emails"
      periode={periode}
      tronque={d.tronque}
      indisponible={d.indisponible}
      avecPeriode={false}
    >
      <Section titre="Volume">
        <Grille>
          <Carte titre="Envois réservés" valeur={String(total)} precision="Toutes clés confondues" />
          <Carte titre="Inscrits" valeur={String(d.tous.leads.length)} />
          <Carte
            titre="Jamais contactés"
            valeur={String(jamaisTouches)}
            accent={jamaisTouches ? "orange" : undefined}
            precision="Inscrits sans aucune clé d’envoi"
          />
          <Carte titre="Désinscrits" valeur={String(desabonnes)} accent={desabonnes ? "rouge" : undefined} />
        </Grille>
      </Section>

      <Section
        titre="Par email"
        aide="Ces nombres comptent des envois RÉSERVÉS, pas des ouvertures. La clé est posée au moment où l’envoi est décidé — c’est ce qui empêche un doublon si le cron rejoue. Un email réservé puis refusé par le destinataire compte ici comme parti."
      >
        <Barres
          points={envois.map((e) => ({
            label: LIBELLES[e.cle] ?? e.cle,
            valeur: e.nombre,
          }))}
        />
        <div className="mt-3">
          <Tableau
            colonnes={["Clé", "Email", "Envois"]}
            lignes={envois.map((e) => [e.cle, LIBELLES[e.cle] ?? "—", e.nombre])}
          />
        </div>
      </Section>
    </Cadre>
  );
}
