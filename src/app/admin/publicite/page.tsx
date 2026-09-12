import { Cadre } from "@/components/admin/Cadre";
import { Colonnes, Courbes } from "@/components/admin/Graphiques";
import { Carte, Grille, Section, Tableau, eur } from "@/components/admin/Ui";
import { periodeValide } from "@/lib/admin/agregats";
import { chargerAdmin } from "@/lib/admin/donnees";
import { cockpit, parAnnonce, sante, semainesLocales } from "@/lib/admin/publicite";
import { exigerAdmin } from "@/lib/admin/garde";
import { depensesHebdomadaires, depensesParAnnonce } from "@/lib/meta-ads";

const SEMAINES = 12;

/**
 * « 6-12 nov » : la forme du tableur, plus lisible qu'une date ISO sur un axe.
 *
 * Une semaine à cheval sur deux mois porte les DEUX mois — « 26 juil-1 août ».
 * Avec le seul mois de fin, elle se lit « 26-1 août », soit une semaine qui
 * commencerait le 26 août pour finir le 1er : cinq jours dans le futur.
 */
const libelle = (debut: string, fin: string) => {
  const d = new Date(debut + "T12:00:00Z");
  const f = new Date(fin + "T12:00:00Z");
  const mois = (x: Date) =>
    x.toLocaleDateString("fr-FR", { month: "short", timeZone: "UTC" }).replace(".", "");
  return d.getUTCMonth() === f.getUTCMonth()
    ? `${d.getUTCDate()}-${f.getUTCDate()} ${mois(f)}`
    : `${d.getUTCDate()} ${mois(d)}-${f.getUTCDate()} ${mois(f)}`;
};

const ou = (v: number | null, rendu: (n: number) => string) => (v === null ? "—" : rendu(v));

export default async function Publicite({
  searchParams,
}: {
  searchParams: Promise<{ p?: string }>;
}) {
  await exigerAdmin();
  const periode = periodeValide((await searchParams).p);

  const [d, ads, pub] = await Promise.all([
    chargerAdmin("tout"),
    depensesHebdomadaires(SEMAINES * 7),
    depensesParAnnonce(SEMAINES * 7),
  ]);

  // Quand Meta répond, ce sont SES bornes de semaine qui font foi : les montants
  // doivent correspondre exactement à ceux du gestionnaire de publicités.
  const depenseConnue = ads.etat === "ok";
  const semaines =
    ads.etat === "ok" && ads.semaines.length ? ads.semaines : semainesLocales(SEMAINES);

  const lignes = cockpit(semaines, d.tous.leads, d.tous.commandes, depenseConnue);
  const verdict = sante(lignes);
  const annonces = parAnnonce(
    pub.etat === "ok" ? pub.annonces : null,
    d.tous.leads,
    d.tous.commandes,
  );
  const etiquettes = lignes.map((l) => libelle(l.debut, l.fin));

  const cumul = lignes.reduce(
    (a, l) => ({
      depense: l.depense === null ? a.depense : (a.depense ?? 0) + l.depense,
      ca: a.ca + l.ca,
      leads: a.leads + l.leads,
      conversions: a.conversions + l.conversions,
    }),
    { depense: null as number | null, ca: 0, leads: 0, conversions: 0 },
  );

  return (
    <Cadre
      titre="Publicité et rentabilité"
      chemin="/admin/publicite"
      periode={periode}
      tronque={d.tronque}
      indisponible={d.indisponible}
      avecPeriode={false}
    >
      {ads.etat !== "ok" && (
        <div className="my-4 border-2 border-orange bg-white p-4">
          <p className="font-bold text-orange-dark">
            {ads.etat === "absent"
              ? "Business Manager non connecté : la dépense publicitaire est inconnue."
              : `Lecture Meta impossible — ${ads.message}`}
          </p>
          <p className="mt-2 text-[0.92rem]">
            Les colonnes qui dépendent de la dépense (CPC, CPL, CPA, ROAS, bénéfice) restent vides
            plutôt que d’afficher zéro : une dépense inconnue comptée comme nulle donnerait un ROAS
            infini et un bénéfice égal au chiffre d’affaires.
            {ads.etat === "absent" && (
              <>
                {" "}
                Pour la connecter, renseigner <code>META_ADS_TOKEN</code> (permission{" "}
                <code>ads_read</code>), <code>META_AD_ACCOUNT_ID</code> et{" "}
                <code>META_GRAPH_VERSION</code>.
              </>
            )}
          </p>
        </div>
      )}

      <Section titre={`Sur les ${SEMAINES} dernières semaines`}>
        <Grille>
          <Carte
            titre="Dépense publicitaire"
            valeur={ou(cumul.depense, eur)}
            accent={cumul.depense === null ? "orange" : undefined}
            precision={cumul.depense === null ? "inconnue, pas nulle" : "source : Meta"}
          />
          <Carte titre="Chiffre d’affaires net" valeur={eur(cumul.ca)} accent="vert" precision="source : notre base" />
          <Carte
            titre="Bénéfice"
            valeur={cumul.depense === null ? "—" : eur(cumul.ca - cumul.depense)}
            accent={cumul.depense === null ? undefined : cumul.ca - cumul.depense >= 0 ? "vert" : "rouge"}
          />
          <Carte
            titre="ROAS"
            valeur={cumul.depense ? (cumul.ca / cumul.depense).toFixed(2) : "—"}
            precision="CA ÷ dépense"
          />
        </Grille>
        <div className="mt-3">
          <Grille>
            <Carte titre="Inscrits" valeur={String(cumul.leads)} />
            <Carte titre="Achats" valeur={String(cumul.conversions)} />
            <Carte
              titre="Coût par inscrit"
              valeur={cumul.depense !== null && cumul.leads ? eur(cumul.depense / cumul.leads) : "—"}
              precision="CPL"
            />
            <Carte
              titre="Coût par achat"
              valeur={
                cumul.depense !== null && cumul.conversions
                  ? eur(cumul.depense / cumul.conversions)
                  : "—"
              }
              precision="CPA, autrement dit le CAC"
            />
          </Grille>
        </div>
      </Section>

      <Section titre="Santé du funnel">
        <p
          className={`border-2 p-4 text-[1.02rem] font-bold ${
            verdict.scalable === true
              ? "border-green bg-green-bg text-green"
              : verdict.scalable === false
                ? "border-red bg-red-bg text-red"
                : "border-grey-line bg-grey-bg"
          }`}
        >
          {verdict.message}
        </p>
        <p className="mt-2 max-w-[80ch] text-[0.88rem] text-text-soft">
          La règle du dossier est unique : LTV ↑, CPA ↓. Sa traduction quotidienne est la
          comparaison du revenu par inscrit au coût par inscrit. Elle se juge sur plusieurs semaines
          cumulées, jamais sur une seule — une semaine porte trop peu d’achats pour qu’un écart y
          soit autre chose que du hasard.
        </p>
      </Section>

      <Section
        titre="Semaine par semaine"
        aide="La jointure se fait sur la semaine, pas sur la personne : aucun cookie, rien à casser quand un navigateur bloque le suivi. En contrepartie elle ne prouve aucune causalité — un achat de cette semaine peut venir d’une publicité vue il y a un mois, du référencement ou d’un email — et le chiffre d’affaires est celui du site entier, publicité ou non."
      >
        <Tableau
          colonnes={[
            "Semaine",
            "Dépense",
            "CA",
            "Bénéfice",
            "ROAS",
            "Inscrits",
            "Clics",
            "CPC",
            "CPL",
            "Achats",
            "CPA",
            "EPL",
          ]}
          lignes={[...lignes].reverse().map((l) => [
            libelle(l.debut, l.fin),
            ou(l.depense, eur),
            eur(l.ca),
            l.benefice === null ? (
              "—"
            ) : (
              <span className={l.benefice >= 0 ? "font-bold text-green" : "font-bold text-red"}>
                {eur(l.benefice)}
              </span>
            ),
            ou(l.roas, (n) => n.toFixed(2)),
            l.leads,
            ou(l.clics, String),
            ou(l.cpc, eur),
            ou(l.cpl, eur),
            l.conversions,
            ou(l.cpa, eur),
            eur(l.epl),
          ])}
        />
      </Section>

      <Section
        titre="Par annonce"
        aide="Rattachement sur l’identifiant de l’annonce porté par utm_id, jamais sur son nom : un nom se renomme, et l’historique d’une annonce renommée se couperait en deux lignes. La ligne « origine inconnue » rassemble les inscrits venus sans paramètre — référencement, bouche à oreille, et celui qui a cliqué sur son téléphone avant d’acheter depuis son ordinateur. Elle reste affichée : la masquer gonflerait mécaniquement le ROAS de toutes les autres."
      >
        {pub.etat === "absent" && !annonces.some((a) => a.leads > 0) ? (
          <p className="border border-grey-line bg-grey-bg p-4 text-[0.95rem]">
            Aucune origine publicitaire enregistrée pour l’instant. Ajouter les paramètres d’URL à
            la campagne Meta — <code>utm_source=facebook&amp;utm_medium=cpc&amp;utm_campaign=&#123;&#123;campaign.name&#125;&#125;&amp;utm_content=&#123;&#123;ad.name&#125;&#125;&amp;utm_id=&#123;&#123;ad.id&#125;&#125;</code> — puis la dépense
            par annonce apparaîtra ici dès la connexion du Business Manager.
          </p>
        ) : (
          <Tableau
            colonnes={["Annonce", "Campagne", "Dépense", "Inscrits", "CPL", "Acheteurs", "CPA", "CA", "Bénéfice", "ROAS"]}
            lignes={annonces.map((a) => [
              a.nom,
              a.campagne || "—",
              ou(a.depense, eur),
              a.leads,
              ou(a.cpl, eur),
              a.acheteurs,
              ou(a.cpa, eur),
              eur(a.ca),
              a.benefice === null ? (
                "—"
              ) : (
                <span className={a.benefice >= 0 ? "font-bold text-green" : "font-bold text-red"}>
                  {eur(a.benefice)}
                </span>
              ),
              ou(a.roas, (n) => n.toFixed(2)),
            ])}
            vide="Aucune annonce ni origine enregistrée."
          />
        )}
      </Section>

      <Section titre="Courbes">
        <div className="grid gap-4 lg:grid-cols-2">
          <Courbes
            etiquettes={etiquettes}
            format={(n) => n.toLocaleString("fr-FR")}
            series={[
              { nom: "Bénéfice", couleur: "#1a7f4b", valeurs: lignes.map((l) => l.benefice) },
              { nom: "Dépense", couleur: "#c0392b", valeurs: lignes.map((l) => l.depense) },
            ]}
          />
          <Courbes
            etiquettes={etiquettes}
            format={(n) => n.toLocaleString("fr-FR")}
            series={[
              { nom: "Chiffre d’affaires", couleur: "#1d3f73", valeurs: lignes.map((l) => l.ca) },
              { nom: "Dépense", couleur: "#c0392b", valeurs: lignes.map((l) => l.depense) },
            ]}
          />
          <Colonnes
            titre="ROAS"
            etiquettes={etiquettes}
            valeurs={lignes.map((l) => l.roas)}
            format={(n) => n.toFixed(1)}
          />
          <Colonnes
            titre="Inscrits"
            etiquettes={etiquettes}
            valeurs={lignes.map((l) => l.leads)}
            couleur="#2c6fbb"
          />
        </div>
      </Section>
    </Cadre>
  );
}
