import { Footer, Header } from "@/components/Chrome";
import { ButtonLink, Panel } from "@/components/ui";
import { CONTACT_EMAIL, PRODUCTS } from "@/lib/config";
import { FormulaireLienPerdu } from "./FormulaireLienPerdu";

/**
 * L'ÉCRAN DE SECOURS DE L'ESPACE — rendu par TOUTES les routes de l'espace
 * quand le jeton est inconnu, malformé ou révoqué.
 *
 * ⚠️ JAMAIS UNE 404. JAMAIS LE MOT « ERREUR ». JAMAIS UN CODE TECHNIQUE.
 *
 * La règle n'est pas cosmétique. La personne qui arrive ici a payé, elle a 74
 * ans, et elle doute déjà d'avoir bien fait. « Erreur 404 — page introuvable »
 * ne se lit pas comme un incident technique : ça se lit comme la confirmation
 * qu'elle s'est fait avoir, et ça part directement en demande de
 * remboursement. Ici, la seule chose qu'on lui montre est le chemin du retour.
 *
 * ⚠️ Ce n'est pas un cas rare. Le lien voyage par email transféré, par capture
 * d'écran, par recopie à la main au téléphone — sur un alphabet volontairement
 * sans i, l, o, 0 ni 1, mais recopié quand même de travers. Un jeton tronqué
 * par un client mail est le scénario nominal, pas l'exception.
 */
export function LienInvalide({
  revoque = false,
  depuis,
  simulateur,
}: {
  revoque?: boolean;
  depuis?: string;
  /**
   * Le lien vers La Facture Invisible, que le client rembourse
   * conserve (CGV art. 6). Seul le hub le passe : les autres écrans de
   * l'espace n'ont pas à rouvrir un chemin de lecture.
   */
  simulateur?: string;
}) {
  return (
    <>
      <Header minimal />
      <main className="flex-1">
        <div className="wrap py-10">
          {revoque ? <AccesFerme depuis={depuis} simulateur={simulateur} /> : <LienInconnu />}
        </div>
      </main>
      <Footer />
    </>
  );
}

function LienInconnu() {
  return (
    <>
      <h1 className="mb-4 text-[1.6rem]">Ce lien ne fonctionne plus.</h1>
      <p className="mb-6 text-[1.15rem]">
        Ce n&apos;est pas grave, et il n&apos;y a rien à retenir : indiquez votre adresse email
        ci-dessous, votre lien repart tout de suite.
      </p>

      <div className="mb-6">
        <FormulaireLienPerdu />
      </div>

      <Panel title="Pourquoi cela arrive">
        <ul className="space-y-2">
          <li>
            Le lien a été recopié à la main et il manque un caractère. Le plus simple est de
            demander qu&apos;on vous le renvoie ci-dessus.
          </li>
          <li>
            Le lien a été coupé par votre messagerie. Certains logiciels de courrier coupent les
            adresses longues en deux : seule la première moitié est arrivée.
          </li>
          <li>
            Vous avez cliqué depuis un très ancien email, envoyé avant que votre lien ne soit
            renouvelé.
          </li>
        </ul>
      </Panel>

      <p className="mt-6">
        <strong>Il n&apos;y a aucun mot de passe</strong>, et il n&apos;y en aura jamais. Votre lien
        personnel est votre seule clé, et il ne s&apos;arrête jamais de fonctionner. Le meilleur
        réflexe, une fois qu&apos;il est revenu : mettre la page dans vos favoris.
      </p>
      <p className="mt-4 text-text-soft">
        Rien ne se passe ? Écrivez-nous à <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>,
        nous rouvrons votre accès à la main.
      </p>
    </>
  );
}

function AccesFerme({ depuis, simulateur }: { depuis?: string; simulateur?: string }) {
  const date = formaterDate(depuis);

  return (
    <>
      <h1 className="mb-4 text-[1.6rem]">Votre accès a été clôturé</h1>
      {/* ⚠️ « Votre achat », jamais « votre commande » au singulier : quelqu'un
          qui a acheté plusieurs fois sait très bien qu'il n'a fait rembourser
          qu'une ligne, et une phrase qui affirme le contraire fait basculer un
          remboursement en litige. */}
      <p className="mb-4 text-[1.15rem]">
        {PRODUCTS.front.name} vous a été remboursée{date ? ` le ${date}` : ""}, et votre accès a été
        fermé à cette occasion. Vous ne devez rien, et il n&apos;y a aucune démarche à faire.
      </p>
      <p className="mb-6">
        Les documents que vous aviez déjà imprimés restent les vôtres : ils ne sont pas concernés.
      </p>

      {/* Ce que le contrat promet, tenu à l'écran. CGV art. 6 : « le client
          conserve l'accès au simulateur ». */}
      {simulateur && (
        <div className="mb-6">
          <Panel title="Ce que vous gardez">
            <p className="mb-4 text-[1.05rem]">
              Comme annoncé, La Facture Invisible reste la vôtre. Vous pouvez la consulter et
              l&apos;imprimer autant de fois que vous le souhaitez.
            </p>
            <ButtonLink href={simulateur} variant="blue">
              Ouvrir La Facture Invisible
            </ButtonLink>
          </Panel>
        </div>
      )}

      <Panel title="Si c'est une erreur">
        <p>
          Cela arrive — un remboursement demandé pour un autre achat, une commande passée deux fois
          avec deux adresses différentes. Écrivez-nous à{" "}
          <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a> en indiquant l&apos;adresse email
          de votre commande. Nous rouvrons votre accès nous-mêmes, sans que vous ayez à repayer quoi
          que ce soit.
        </p>
      </Panel>

      <p className="mt-6 text-text-soft">
        Et si vous souhaitez reprendre plus tard, Le guide Héritage Intact reste accessible : il
        suffira de repasser commande, votre progression est conservée.
      </p>
    </>
  );
}

/**
 * La date du remboursement, en toutes lettres.
 *
 * ⚠️ Le format court (« 12/09/2026 ») est écarté : il se lit à l'américaine
 * par la moitié des lecteurs, et sur une page qui annonce une mauvaise
 * nouvelle, une date ambiguë suffit à faire douter du reste. Une entrée
 * illisible rend `null` plutôt que « Invalid Date » — la phrase se lit très
 * bien sans date.
 */
function formaterDate(valeur?: string): string | null {
  if (!valeur) return null;
  const d = new Date(valeur);
  if (Number.isNaN(d.getTime())) return null;
  return new Intl.DateTimeFormat("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(d);
}
