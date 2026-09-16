import posthog from "posthog-js";
import { COOKIE_AB } from "@/lib/ab";

/**
 * POSTHOG — configuration standard, celle que génère l'assistant officiel
 * (`npx @posthog/wizard`), remise à la demande de Loys le 16/09/2026 à la place
 * de la version filtrée du 14/09.
 *
 * ⚠️ CE QUI A ÉTÉ RETIRÉ, ET CE QUE ÇA IMPLIQUE. Il n'y a plus aucune exclusion
 * de chemin : PostHog reçoit désormais l'adresse COMPLÈTE de chaque page et
 * enregistre les sessions partout, y compris là où l'adresse EST une clé —
 * l'espace client (`/espace/<jeton>`), le `?o=` du tunnel qui autorise un débit
 * sur la carte enregistrée, le lien de reprise et celui de désinscription, ainsi
 * que le panel /admin où figurent des adresses email de clients. Ces valeurs
 * partent donc chez PostHog (projet européen) et apparaissent dans les
 * enregistrements de session. C'est un choix assumé de Loys ; pour revenir en
 * arrière, la version filtrée est dans l'historique git (commit 5df0b1b).
 *
 * Les champs de saisie restent masqués dans les enregistrements : c'est le
 * réglage par défaut de posthog-js, pas une option ajoutée ici. Le numéro de
 * carte, lui, vit dans un cadre Stripe, jamais dans notre page.
 */
posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY!, {
  api_host: "/ingest",
  ui_host: "https://eu.posthog.com",
  defaults: "2025-05-24",
});

// Seul ajout conservé : la version du test A/B (proxy.ts) sur chaque événement,
// sans laquelle le test « vidéo + commande » contre « commande seule » ne se lit
// pas dans PostHog. Deux lignes, à retirer si tu veux la configuration nue.
const ab = document.cookie.split("; ").find((c) => c.startsWith(COOKIE_AB + "="))?.slice(COOKIE_AB.length + 1);
if (ab === "A" || ab === "B") posthog.register({ variante_lp: ab });
