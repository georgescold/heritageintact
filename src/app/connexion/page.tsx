import type { Metadata } from "next";
import { Footer, Header } from "@/components/Chrome";
import { FormulaireLienPerdu } from "@/components/espace/FormulaireLienPerdu";
import { Panel } from "@/components/ui";
import { CONTACT_EMAIL, PRODUCTS } from "@/lib/config";

export const metadata: Metadata = { title: "Retrouver mon espace" };

/**
 * LA SEULE ADRESSE QUE LE MEMBRE AIT À RETENIR.
 *
 * heritageintact.fr/connexion se dicte au téléphone, s'écrit à la main sur un
 * post-it, se colle sur l'écran, s'imprime. Le lien personnel, lui, ne se
 * retient pas — vingt caractères ne se recopient pas de mémoire. C'est donc
 * cette page-ci qui est le vrai filet de sécurité du dispositif : tant qu'elle
 * existe, il n'y a AUCUN chemin par lequel un acheteur reste dehors.
 *
 * ⚠️ Elle est publique, et elle doit le rester : elle est faite pour être
 * atteinte par quelqu'un qui n'a plus rien — ni email, ni favori, ni
 * ordinateur d'origine.
 *
 * ⚠️ Elle ne dit jamais si une adresse correspond à un achat. La réponse est
 * la même dans les deux cas, et la règle vit dans la server action.
 */
export default function RetrouverMonEspace() {
  return (
    <>
      <Header minimal />
      <main className="flex-1">
        <div className="wrap py-10">
          <h1 className="mb-4 text-[1.6rem] sm:text-[1.9rem]">Retrouver votre espace</h1>

          <p className="mb-6 text-[1.15rem]">
            Indiquez l&apos;adresse email de votre commande. Votre lien personnel vous est renvoyé
            immédiatement, et vous n&apos;avez rien d&apos;autre à faire.
          </p>

          <div className="mb-8">
            <FormulaireLienPerdu />
          </div>

          {/* L'adresse à retenir, écrite en gros et isolée : c'est la seule
              chose de tout le dispositif qu'on demande au lecteur de noter. */}
          <div className="mb-8 border-2 border-blue bg-grey-bg p-5">
            <p className="mb-2 text-[1.05rem] font-bold text-blue">Notez cette adresse</p>
            <p className="mb-3 select-all break-words text-[1.4rem] font-bold sm:text-[1.6rem]">
              heritageintact.fr/connexion
            </p>
            <p className="text-[1.05rem]">
              C&apos;est la seule à retenir, et <strong>il n&apos;y a aucun mot de passe</strong>.
              Depuis cette page, vous pouvez toujours redemander votre lien, aujourd&apos;hui comme
              dans cinq ans.
            </p>
          </div>

          <Panel title="Comment cela fonctionne">
            <ul className="space-y-3 text-[1.05rem]">
              <li>
                Votre espace s&apos;ouvre par un <strong>lien personnel</strong>, envoyé par email
                le jour de votre commande. Ce lien est votre clé&nbsp;: il ne s&apos;arrête jamais
                de fonctionner.
              </li>
              <li>
                Il n&apos;y a <strong>ni compte à créer, ni mot de passe à choisir</strong>, ni
                identifiant à retenir. Rien de tout cela n&apos;existe sur ce site.
              </li>
              <li>
                Le meilleur réflexe, une fois votre espace ouvert&nbsp;: mettre la page dans vos
                favoris, et garder l&apos;email.
              </li>
            </ul>
          </Panel>

          <p className="mt-6 text-[1.05rem] text-text-soft">
            Vous n&apos;avez pas encore {PRODUCTS.front.name} ? Cette page ne concerne que les
            personnes qui l&apos;ont déjà. Pour toute autre question, écrivez-nous à{" "}
            <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>, nous répondons nous-mêmes.
          </p>
        </div>
      </main>
      <Footer />
    </>
  );
}
