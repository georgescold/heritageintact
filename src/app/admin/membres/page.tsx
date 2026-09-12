import { Cadre } from "@/components/admin/Cadre";
import { Barres, Carte, Grille, Section, Tableau, dateHeure, pourcent } from "@/components/admin/Ui";
import { parEtape, parProfil, periodeValide } from "@/lib/admin/agregats";
import { chargerAdmin } from "@/lib/admin/donnees";
import { exigerAdmin } from "@/lib/admin/garde";

const LIBELLES_CHAMPS: Record<string, string> = {
  objectif: "Priorité déclarée",
  vie: "Situation de couple",
  enfants: "Enfants",
  age: "Tranche d’âge",
  av: "Assurance-vie",
  blocage: "Ce qui bloque",
};

export default async function Membres({ searchParams }: { searchParams: Promise<{ p?: string }> }) {
  await exigerAdmin();
  const periode = periodeValide((await searchParams).p);
  const d = await chargerAdmin(periode);

  // La progression se lit sur tout l'historique : un membre entré il y a deux
  // mois qui termine une étape aujourd'hui doit compter dans l'entonnoir.
  const etapes = parEtape(d.tous.progression);
  const profils = parProfil(d.tous.profils);
  const acces = d.periode.acces;
  const actifs = acces.filter((a) => !a.revoque);

  const revenus = d.tous.acces.filter(
    (a) => a.vuLe && Date.now() - Date.parse(a.vuLe) < 7 * 86400000,
  ).length;

  const derniers = [...acces]
    .sort((a, b) => Date.parse(b.createdAt) - Date.parse(a.createdAt))
    .slice(0, 50);

  return (
    <Cadre
      titre="Membres"
      chemin="/admin/membres"
      periode={periode}
      tronque={d.tronque}
      indisponible={d.indisponible}
    >
      <Section titre="Accès">
        <Grille>
          <Carte titre="Créés sur la période" valeur={String(acces.length)} />
          <Carte titre="Actifs" valeur={String(actifs.length)} accent="vert" />
          <Carte titre="Révoqués" valeur={String(acces.length - actifs.length)} accent={acces.length - actifs.length ? "rouge" : undefined} />
          <Carte
            titre="Vus depuis 7 jours"
            valeur={String(revenus)}
            precision="Sur l’ensemble des membres, pas seulement la période"
          />
        </Grille>
      </Section>

      <Section
        titre="Entonnoir de la méthode"
        aide="« Ouverte » = le membre a affiché l’étape ; « terminée » = il a coché la case. Les deux ne mesurent pas la même chose : l’ouverture mesure l’engagement, la coche mesure l’avancement. Confondre les deux fait conclure à un abandon là où il n’y a qu’une case non cochée."
      >
        <Barres
          points={etapes.map((e) => ({
            label: e.etape,
            valeur: e.ouvertes,
            note: `${e.ouvertes} ouvertes · ${e.faites} finies`,
          }))}
        />
        <div className="mt-3">
          <Tableau
            colonnes={["Étape", "Ouvertes", "Terminées", "Achèvement"]}
            lignes={etapes.map((e) => [e.etape, e.ouvertes, e.faites, pourcent(e.tauxAchevement)])}
          />
        </div>
      </Section>

      <Section
        titre="Qui sont-ils"
        aide="Réponses de qualification, sur tout l’historique. Aucune donnée de patrimoine, de santé ni de date de naissance n’est collectée : ces répartitions sont tout ce que le site sait de ses clients."
      >
        <div className="grid gap-5 sm:grid-cols-2">
          {Object.entries(profils).map(([champ, valeurs]) => (
            <div key={champ}>
              <h3 className="mb-2 text-[1rem] font-bold">{LIBELLES_CHAMPS[champ] ?? champ}</h3>
              <Barres points={valeurs.map((v) => ({ label: v.valeur, valeur: v.nombre }))} />
            </div>
          ))}
        </div>
      </Section>

      <Section titre="Les 50 derniers accès ouverts">
        <Tableau
          colonnes={["Ouvert le", "Prénom", "Email", "Dernière visite", "État"]}
          lignes={derniers.map((a) => [
            dateHeure(a.createdAt),
            a.firstName,
            a.email,
            a.vuLe ? dateHeure(a.vuLe) : "jamais",
            a.revoque ? <span className="text-red">révoqué</span> : "actif",
          ])}
        />
      </Section>
    </Cadre>
  );
}
