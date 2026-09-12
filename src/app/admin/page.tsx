import { Cadre } from "@/components/admin/Cadre";
import { Barres, Carte, Grille, Section, Tableau, eur, jourCourt, pourcent } from "@/components/admin/Ui";
import { kpi, parJour, parProduit, periodeValide } from "@/lib/admin/agregats";
import { chargerAdmin } from "@/lib/admin/donnees";
import { exigerAdmin } from "@/lib/admin/garde";
import { syntheseCohortes } from "@/lib/pilotage";

export default async function VueDEnsemble({
  searchParams,
}: {
  searchParams: Promise<{ p?: string }>;
}) {
  await exigerAdmin();
  const periode = periodeValide((await searchParams).p);
  const d = await chargerAdmin(periode);
  const k = kpi(d.periode);
  const serie = parJour(d.periode.leads, d.periode.commandes, null);
  const produits = parProduit(d.periode.commandes);

  // Les cohortes se calculent toujours sur TOUT l'historique payé : une cohorte
  // à 90 jours n'a pas de sens si on lui retire d'avance les commandes de plus
  // de 30 jours. C'est pourquoi elles ignorent le filtre de période.
  const cohortes = [30, 60, 90].map((j) => syntheseCohortes(d.tous.commandes, j));

  return (
    <Cadre
      titre="Vue d’ensemble"
      chemin="/admin"
      periode={periode}
      tronque={d.tronque}
      indisponible={d.indisponible}
    >
      <Section titre="Sur la période">
        <Grille>
          <Carte titre="Inscrits" valeur={String(k.leads)} precision={`${k.desabonnes} désinscrit(s)`} />
          <Carte titre="Acheteurs" valeur={String(k.acheteurs)} accent="vert" precision={`${k.commandesPayees} commande(s) payée(s)`} />
          <Carte titre="Recettes nettes" valeur={eur(k.recettes.net)} accent="vert" precision={`${eur(k.recettes.brut)} brut · ${eur(k.recettes.rembourse)} remboursé`} />
          <Carte titre="Panier moyen" valeur={eur(k.panierMoyen)} precision="Net par acheteur" />
        </Grille>
        <div className="mt-3">
          <Grille>
            <Carte titre="Inscrit → acheteur" valeur={pourcent(k.tauxConversion)} precision="Rapport brut sur la période, pas une cohorte" />
            <Carte titre="Commandes non payées" valeur={String(k.commandesEnAttente)} accent={k.commandesEnAttente ? "orange" : undefined} precision="Bons de commande ouverts, jamais réglés" />
            <Carte titre="Accès actifs" valeur={String(k.accesActifs)} precision={`${k.accesRevoques} révoqué(s)`} />
            <Carte titre="Articles vendus" valeur={String(k.recettes.lignes)} precision="Lignes de commande, remboursées comprises" />
          </Grille>
        </div>
      </Section>

      <Section
        titre="Jour par jour"
        aide="Les journées sans activité sont affichées à zéro : une courbe qui saute les jours vides fait paraître réguliers des à-coups qui ne le sont pas."
      >
        <Tableau
          colonnes={["Jour", "Inscrits", "Commandes", "Net"]}
          lignes={serie
            .slice(-31)
            .reverse()
            .map((p) => [jourCourt(p.jour), p.leads, p.commandes, eur(p.net)])}
        />
      </Section>

      <Section titre="Produits" aide="Le net retire les lignes remboursées. Un remboursement se lit dans l’article, jamais dans le statut de la commande.">
        <Barres
          points={produits.map((p) => ({ label: p.sku, valeur: p.net, note: eur(p.net) }))}
        />
        <div className="mt-3">
          <Tableau
            colonnes={["Produit", "Ventes", "Remboursées", "Brut", "Net"]}
            lignes={produits.map((p) => [p.sku, p.ventes, p.remboursees, eur(p.brut), eur(p.net)])}
          />
        </div>
      </Section>

      <Section
        titre="Cohortes d’acquisition"
        aide="Sur tout l’historique payé, indépendamment du filtre ci-dessus : une cohorte à 90 jours perdrait son sens si on lui retirait d’avance les commandes anciennes. Reprend le calcul déjà utilisé par /api/pilotage, qui ne retient QUE les clients entrés par le produit d’appel — ces montants sont donc normalement inférieurs aux recettes affichées plus haut, où figure aussi celui qui a acheté un pack directement."
      >
        <Tableau
          colonnes={["Fenêtre", "Acheteurs", "Commandes", "Avec complément", "Recettes nettes", "Net / acheteur"]}
          lignes={cohortes.map((c) => [
            `${c.joursAcquisition} jours`,
            c.acheteurs,
            c.commandesPayees,
            c.clientsAvecComplement,
            eur(c.recettesApresRemboursementsEnregistres),
            eur(c.recettesMoyennesParAcheteur),
          ])}
        />
      </Section>
    </Cadre>
  );
}
