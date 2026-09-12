import { Cadre } from "@/components/admin/Cadre";
import { Barres, Carte, Grille, Section, Tableau, dateHeure, eur, pourcent } from "@/components/admin/Ui";
import { parSource, periodeValide } from "@/lib/admin/agregats";
import { chargerAdmin } from "@/lib/admin/donnees";
import { exigerAdmin } from "@/lib/admin/garde";

export default async function Acquisition({
  searchParams,
}: {
  searchParams: Promise<{ p?: string }>;
}) {
  await exigerAdmin();
  const periode = periodeValide((await searchParams).p);
  const d = await chargerAdmin(periode);

  // L'attribution rapproche les inscrits de la période avec TOUTES leurs
  // commandes, y compris postérieures à la fenêtre : autrement une page qui
  // convertit à retardement paraîtrait ne rien rapporter.
  const sources = parSource(d.periode.leads, d.tous.commandes);
  const derniers = [...d.periode.leads]
    .sort((a, b) => Date.parse(b.createdAt) - Date.parse(a.createdAt))
    .slice(0, 50);

  const total = sources.reduce((n, s) => n + s.leads, 0);
  const meilleure = sources[0];

  return (
    <Cadre
      titre="Acquisition"
      chemin="/admin/acquisition"
      periode={periode}
      tronque={d.tronque}
      indisponible={d.indisponible}
    >
      <Section titre="Ce que rapporte chaque porte d’entrée">
        <Grille>
          <Carte titre="Inscrits" valeur={String(total)} />
          <Carte titre="Sources distinctes" valeur={String(sources.length)} />
          <Carte
            titre="Meilleure source"
            valeur={meilleure?.source ?? "—"}
            accent="vert"
            precision={meilleure ? `${eur(meilleure.epl)} par inscrit` : undefined}
          />
          <Carte
            titre="Désinscrits"
            valeur={String(d.periode.leads.filter((l) => l.desabonne).length)}
            accent="orange"
          />
        </Grille>
      </Section>

      <Section
        titre="Par source"
        aide="La source est le chemin de la page d’arrivée, posé côté serveur à l’inscription. Le rapprochement inscrit → achat se fait par email : quelqu’un qui s’inscrit avec une adresse et paie avec une autre n’est pas rattaché. L’EPL — recettes nettes divisées par le nombre d’inscrits — est la seule mesure qui compare deux pages honnêtement."
      >
        <Barres
          points={sources.map((s) => ({ label: s.source, valeur: s.leads, note: `${s.leads} inscrits` }))}
        />
        <div className="mt-3">
          <Tableau
            colonnes={["Source", "Inscrits", "Acheteurs", "Taux", "Recettes nettes", "EPL"]}
            lignes={sources.map((s) => [
              s.source,
              s.leads,
              s.acheteurs,
              pourcent(s.taux),
              eur(s.net),
              eur(s.epl),
            ])}
          />
        </div>
      </Section>

      <Section titre="Les 50 dernières inscriptions">
        <Tableau
          colonnes={["Date", "Prénom", "Email", "Source", "État"]}
          lignes={derniers.map((l) => [
            dateHeure(l.createdAt),
            l.firstName,
            l.email,
            l.source ?? "—",
            l.desabonne ? <span className="text-red">désinscrit</span> : "actif",
          ])}
        />
      </Section>
    </Cadre>
  );
}
