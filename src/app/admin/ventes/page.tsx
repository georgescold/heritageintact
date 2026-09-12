import { Cadre } from "@/components/admin/Cadre";
import { Carte, Grille, Section, Tableau, dateHeure, eur, pourcent } from "@/components/admin/Ui";
import { commandeReelle, parProduit, periodeValide, recettes } from "@/lib/admin/agregats";
import { chargerAdmin } from "@/lib/admin/donnees";
import { exigerAdmin } from "@/lib/admin/garde";

export default async function Ventes({ searchParams }: { searchParams: Promise<{ p?: string }> }) {
  await exigerAdmin();
  const periode = periodeValide((await searchParams).p);
  const d = await chargerAdmin(periode);

  const commandes = d.periode.commandes;
  const r = recettes(commandes);
  const produits = parProduit(commandes);
  const payees = commandes.filter(commandeReelle);
  const attente = commandes.filter((c) => c.status === "pending");
  const simulees = commandes.filter((c) => c.status === "paid" && c.mode === "test");

  const avecFront = payees.filter((c) => c.items.some((i) => i.sku === "front")).length;
  const avecBump = payees.filter((c) => c.items.some((i) => i.sku === "bump")).length;
  const tauxBump = avecFront ? avecBump / avecFront : 0;

  const dernieres = [...commandes]
    .sort((a, b) => Date.parse(b.createdAt) - Date.parse(a.createdAt))
    .slice(0, 50);

  return (
    <Cadre
      titre="Ventes"
      chemin="/admin/ventes"
      periode={periode}
      tronque={d.tronque}
      indisponible={d.indisponible}
    >
      <Section titre="Recettes">
        <Grille>
          <Carte titre="Net" valeur={eur(r.net)} accent="vert" precision="Brut moins les lignes remboursées" />
          <Carte titre="Brut" valeur={eur(r.brut)} />
          <Carte titre="Remboursé" valeur={eur(r.rembourse)} accent={r.rembourse ? "rouge" : undefined} />
          <Carte titre="Commandes payées" valeur={String(payees.length)} precision={`${r.lignes} article(s)`} />
        </Grille>
        <div className="mt-3">
          <Grille>
            <Carte
              titre="Prise du bump"
              valeur={pourcent(tauxBump)}
              precision={`${avecBump} sur ${avecFront} commandes avec le produit d’appel`}
            />
            <Carte titre="Bons non réglés" valeur={String(attente.length)} accent={attente.length ? "orange" : undefined} />
            <Carte
              titre="Paiements simulés"
              valeur={String(simulees.length)}
              accent={simulees.length ? "orange" : undefined}
              precision="Exclus de toutes les recettes ci-dessus"
            />
            <Carte titre="Produits distincts" valeur={String(produits.length)} />
          </Grille>
        </div>
      </Section>

      <Section
        titre="Par produit"
        aide="Une commande n’entre dans les recettes que payée ET en mode « live ». Les paiements simulés sont comptés à part : les inclure ferait apparaître un chiffre d’affaires qui n’a jamais existé sur un compte bancaire."
      >
        <Tableau
          colonnes={["Produit", "Ventes", "Remboursées", "Brut", "Net"]}
          lignes={produits.map((p) => [p.sku, p.ventes, p.remboursees, eur(p.brut), eur(p.net)])}
        />
      </Section>

      <Section titre="Les 50 dernières commandes">
        <Tableau
          colonnes={["Date", "Email", "Articles", "Mode", "Statut"]}
          lignes={dernieres.map((c) => [
            dateHeure(c.createdAt),
            c.email,
            c.items.map((i) => `${i.sku} ${eur(i.price)}${i.rembourse ? " ↩" : ""}`).join(" · ") || "—",
            c.mode,
            c.status === "paid" ? (
              <span className="font-bold text-green">payée</span>
            ) : (
              <span className="text-orange">en attente</span>
            ),
          ])}
        />
      </Section>
    </Cadre>
  );
}
