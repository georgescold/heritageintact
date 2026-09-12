import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { AchatValide } from "@/components/AchatValide";
import { Header, Footer } from "@/components/Chrome";
import { MesurerAchat } from "@/components/MetaPixel";
import { ButtonLink, Panel } from "@/components/ui";
import { accesParEmail, commandesPayeesParEmail, getOrder, orderTotal } from "@/lib/db";
import { CONTACT_EMAIL, PRESENTATION, PRODUCTS, SITE_URL, euros, urlEspace } from "@/lib/config";
import { etapeParNumero } from "@/lib/methode";

export const metadata: Metadata = { title: "Bienvenue" };

/** Page de remerciement : elle vend aussi (Le Simulateur personnalisé, produit backend n°1). */
export default async function ThankYouPage({
  searchParams,
}: {
  /**
   * ⚠️ `err` N'ÉTAIT PAS LU, ET /merci EST LE DERNIER MAILLON DE LA CHAÎNE.
   *
   * `acceptUpsell` redirige un upsell REFUSÉ vers `${next}&err=1`, et pour
   * l'upsell 2 ce `next` est /merci. Le refus de 97 € arrivait donc sur une
   * page qui affichait « Votre commande est confirmée » sans un mot : le
   * lecteur croyait avoir acheté, attendait le document, et écrivait pour
   * réclamer un produit qu'il n'avait jamais payé.
   */
  searchParams: Promise<{ o?: string; err?: string }>;
}) {
  const { o, err } = await searchParams;
  const order = o ? await getOrder(o) : null;
  if (!order || order.status !== "paid") redirect("/commande");
  const total = orderTotal(order);

  /**
   * L'accès a été créé par `livrer()` au moment du paiement, donc AVANT que
   * Resend soit sollicité : il existe ici même si aucun email n'est parti.
   * C'est toute la raison d'être de l'encadré ci-dessous.
   */
  const acces = await accesParEmail(order.email);

  /**
   * LE COMPLÉMENT PROPOSÉ : le moins cher que cet acheteur ne possède pas.
   *
   * L'ordre est celui du prix croissant, et c'est délibéré — juste après un
   * paiement, la seule offre qui passe est celle qui ne fait pas rouvrir la
   * discussion budgétaire. On regarde TOUS ses achats payés, pas seulement
   * cette commande : quelqu'un qui revient acheter un second guide ne doit pas
   * se voir proposer ce qu'il a déjà.
   */
  const possede = new Set(
    (await commandesPayeesParEmail(order.email).catch(() => []))
      .flatMap((c) => c.items)
      .filter((i) => !i.rembourse)
      .map((i) => i.sku),
  );
  const complement =
    (["bump", "backend4", "upsell2"] as const).find(
      (sku) => PRODUCTS[sku].disponible && !possede.has(sku),
    ) ?? null;

  return (
    <>
      <MesurerAchat id={order.id} />
      <Header minimal />
      <main className="flex-1">
        <div className="wrap py-8 sm:py-12">
          {/* Le refus de l'offre précédente, dit calmement et AVANT la
              confirmation : sans lui, le lecteur croit avoir acheté ce qu'il
              n'a pas payé. Aucun mot « erreur », aucun code. */}
          {err === "1" && (
            <p
              role="alert"
              className="mb-5 border-2 border-orange bg-yellow-bg px-4 py-3 text-[1.05rem]"
            >
              L&apos;offre précédente n&apos;a pas pu être ajoutée : votre banque n&apos;a pas
              accepté ce second paiement. <strong>Rien n&apos;a été débité pour celle-ci</strong>,
              et votre commande initiale reste bien enregistrée.
              {PRODUCTS.upsell2.disponible && acces ? (
                <>
                  {" "}
                  Vous la retrouverez dans votre espace, si vous la voulez encore&nbsp;:{" "}
                  <a href={`/espace/${acces.jeton}/ajouter/upsell2`}>{PRODUCTS.upsell2.name}</a>.
                </>
              ) : null}
            </p>
          )}

          {/* ⚠️ LE MONTANT N'EST PLUS DANS LA CONFIRMATION — décision de Loys,
              12/09/2026, et elle renverse celle qui tenait ici jusque-là.

              L'argument d'origine reste vrai : le tunnel peut enchaîner
              plusieurs débits en deux minutes, et le total évitait au client
              d'ouvrir son application bancaire. L'argument qui l'emporte est
              commercial : rappeler la somme dépensée juste avant de proposer un
              complément supprime ce complément.

              Le montant n'a pas disparu du site pour autant. Le récapitulatif
              détaillé reste EN BAS de cette page — après l'offre, donc — et
              Stripe envoie son reçu par email. C'est ce qui permet de retirer le
              rappel sans laisser l'acheteur sans trace de ce qu'il a payé. */}
          <div className="mb-6">
            <AchatValide titre="Votre commande est confirmée">
              Tout est déjà ouvert dans votre espace, et il n&apos;y a ni mot de passe ni compte à
              créer.
            </AchatValide>
          </div>
          <h1 className="mb-5 text-[1.6rem] sm:text-[2rem]">
            Bienvenue dans Héritage Intact, {order.firstName}. Voici vos 3 prochaines étapes.
          </h1>

          <ol className="space-y-4 text-[1.05rem]">
            <Step n={1}>
              Votre adresse d&apos;accès est <strong>{order.email}</strong>.
              Pour retrouver nos emails, vérifiez les indésirables et ajoutez {CONTACT_EMAIL} à vos contacts. Vous pouvez
              aussi ouvrir votre espace tout de suite, ci-dessous.
            </Step>
            {/* ⚠️ La durée se DÉRIVE du catalogue de contenu, elle ne s'écrit
                pas. Cette ligne annonçait 30 minutes pendant que l'email
                d'accès, le hub, la liste des étapes et la page de l'étape
                annonçaient 12 : trois écrans vus dans le même quart d'heure,
                deux chiffres pour la même chose. */}
            <Step n={2}>
              Commencez par <strong>votre fiche de situation.</strong> Prévoyez environ{" "}
              {etapeParNumero(0)?.minutes ?? 12} minutes, vos relevés, et un café.
            </Step>
            <Step n={3}>
              Notez une information à retrouver et une question à faire vérifier.
              Vous pouvez ensuite reprendre le parcours à votre rythme.
            </Step>
          </ol>

          {/*
            ⚠️ L'ENCADRÉ LE PLUS IMPORTANT DU SITE. NE JAMAIS LE RETIRER.

            /merci est le seul instant du parcours où l'on est CERTAIN que
            l'acheteur est devant son écran. Sans `RESEND_API_KEY`, `envoyer()`
            renvoie { ok: true } sans rien expédier et sans qu'aucun log ne
            s'en plaigne : ce jour-là, ce lien écrit en toutes lettres est le
            seul chemin qui reste entre un client débité et ce qu'il a acheté.

            Écrit en dur ici, volontairement : le hub a son propre encadré, et
            deux pages qui doivent survivre séparément ne partagent pas un
            composant qu'un seul lot maintient.
          */}
          {/* ⚠️ LE COMPLÉMENT PASSE AVANT LE LIEN D'ACCÈS, PAS APRÈS.
              Une fois le lien ouvert, l'acheteur est dans son espace et ne
              revient pas sur cette page. C'est donc ici, et nulle part ailleurs,
              que l'offre a une chance d'être lue.

              ⚠️ Il n'y a AUCUN débit sur cette page : le bouton mène à
              /espace/<jeton>/ajouter/<sku>, l'écran d'ajout existant, qui
              affiche le prix et demande une confirmation. On ne débite jamais
              une carte depuis une page de remerciement. */}
          {complement && acces && (
            <section className="mt-7 border-2 border-orange bg-yellow-bg p-4 sm:p-5">
              <p className="mb-2 text-[1.1rem] font-bold text-orange-dark">
                Nous vous le conseillons très fortement :
              </p>
              <h2 className="mb-2 text-[1.3rem] leading-snug">{PRODUCTS[complement].name}</h2>
              <p className="mb-4 text-[1.02rem]">{PRESENTATION[complement]?.promesse}</p>
              <ButtonLink href={`/espace/${acces.jeton}/ajouter/${complement}`}>
                L’ajouter à mon espace — {euros(PRODUCTS[complement].price)}
              </ButtonLink>
              <p className="mt-2 text-[0.9rem] text-text-soft">
                Rien n’est débité sur cette page : vous verrez le détail avant de confirmer.
              </p>
            </section>
          )}

          {acces ? (
            <div className="mt-7 border-2 border-grey-line bg-grey-bg p-4 sm:p-5">
              <p className="mb-2 text-[1.1rem] font-bold text-blue">Votre lien personnel</p>
              <p className="mb-3 break-all text-[1.25rem] leading-snug font-bold sm:text-[1.45rem]">
                {urlEspace(acces.jeton)}
              </p>
              <p className="mb-4 text-[1.05rem]">
                Notez-le, ou mettez cette page dans vos favoris.{" "}
                <strong>Il n&apos;y a pas de mot de passe.</strong> Ce lien est votre clé personnelle :
                ne le partagez pas.
              </p>
              <ButtonLink href={urlEspace(acces.jeton)} variant="blue">
                Ouvrir mon espace
              </ButtonLink>
            </div>
          ) : (
            /*
              Cas anormal (l'accès n'a pas pu être créé). On n'affiche ni erreur
              ni 404 : on montre le chemin de récupération, qui refabrique
              l'accès depuis la commande payée.
            */
            <div className="mt-7 border-2 border-grey-line bg-grey-bg p-4 sm:p-5">
              <p className="mb-2 text-[1.1rem] font-bold text-blue">Votre espace</p>
              <p className="mb-4 text-[1.05rem]">
                Rendez-vous sur <strong>{SITE_URL.replace(/^https?:\/\//, "")}/espace</strong> et
                indiquez l&apos;adresse <strong>{order.email}</strong> : votre lien personnel vous
                sera envoyé aussitôt. Il n&apos;y a pas de mot de passe.
              </p>
              <ButtonLink href="/espace" variant="blue">
                Ouvrir mon espace
              </ButtonLink>
            </div>
          )}

          <div className="mt-6">
            <Panel title="Récapitulatif de votre commande">
              <ul>
                {order.items.map((it) => (
                  <li
                    key={it.sku}
                    className="flex justify-between gap-3 border-b border-grey-line-soft py-2"
                  >
                    <span>{PRODUCTS[it.sku].name}</span>
                    <span className="whitespace-nowrap">{euros(it.price)}</span>
                  </li>
                ))}
              </ul>
              <p className="mt-2 flex justify-between border-t-2 border-blue pt-2 font-bold">
                <span>Total</span>
                <span>{euros(total)}</span>
              </p>
              <p className="mt-2 text-[0.9rem] text-text-soft">
                Conservez ce récapitulatif. Pour toute question sur votre commande,
                contactez-nous à {CONTACT_EMAIL}.
              </p>
            </Panel>
          </div>

          {/*
            ⚠️ /merci EST LE QUATRIÈME ENDROIT QUE `disponible` DOIT PROTÉGER,
            APRÈS LA BOUTIQUE, LA SERVER ACTION D'ACHAT ET LES CGV.
            Ce bloc faisait la promotion du Simulateur Automatique — qui porte
            `disponible: false` — puis annonçait « et dans un email dans
            quelques jours ». Les deux moitiés étaient fausses : la boutique de
            l'espace filtre sur `disponible`, donc il n'y apparaîtra jamais, et
            `SEQUENCE_CLIENT` ne contient aucune offre. La phrase sur l'email a
            disparu pour de bon : elle engage une séquence qui n'est pas écrite.
          */}
          {PRODUCTS.backend1.disponible && (
            <>
              <hr className="my-10 border-grey-line" />

              <h2 className="mb-3 text-[1.4rem]">Et quand vous aurez votre chiffre...</h2>
              <p className="mb-3">
                ...la question suivante sera :{" "}
                <em>« et si je donne la maison ? et si j&apos;attends 71 ans ? »</em>{" "}
                {PRODUCTS.backend1.name} répond en direct, et imprime votre dossier prêt pour le
                notaire. Vos chiffres ne quittent pas votre ordinateur.
              </p>
              <p className="text-text-soft">
                Vous le retrouverez dans votre espace, sur la même page que le reste.
              </p>
            </>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}

function Step({ n, children }: { n: number; children: React.ReactNode }) {
  return (
    <li className="flex gap-3">
      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-blue text-[1.1rem] font-bold text-white">
        {n}
      </span>
      <span className="pt-1">{children}</span>
    </li>
  );
}
