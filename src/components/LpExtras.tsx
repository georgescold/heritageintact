/**
 * Les leviers d'amélioration d'une landing page, à placer SOUS le bouton
 * (cf. 03-marketing-copy/landing-pages.md).
 *
 * Règle du projet : aucune preuve inventée. Tant qu'il n'y a pas de témoignage réel,
 * la preuve utilisée est l'autorité de la source (le Code général des impôts).
 */
export function ProofUnderButton() {
  return (
    <div className="border border-grey-line bg-grey-bg p-3 text-[0.9rem]">
      <p className="mb-2 font-bold text-blue">D&apos;où viennent ces chiffres ?</p>
      <ul className="space-y-1">
        <li>
          <span aria-hidden className="mr-1 text-green">
            ✔
          </span>
          Barème et abattements : articles 777 et 779 du Code général des impôts
        </li>
        <li>
          <span aria-hidden className="mr-1 text-green">
            ✔
          </span>
          Assurance-vie avant et après 70 ans : articles 990 I et 757 B
        </li>
        <li>
          <span aria-hidden className="mr-1 text-green">
            ✔
          </span>
          La valeur d&apos;un bien transmis selon l&apos;âge : article 669
        </li>
      </ul>
      <p className="mt-2 text-text-soft">
        Tout est vérifiable en cinq minutes sur impots.gouv.fr. Ce ne sont pas des opinions.
      </p>
    </div>
  );
}

/**
 * Règle 1 d'une landing page : toujours de l'urgence.
 * Ici l'urgence est structurelle et vraie (les 3 dates se ferment réellement),
 * pas un faux compte à rebours.
 */
export function UrgencyBand() {
  return (
    <div className="border-2 border-yellow-line bg-yellow-bg p-3">
      <p className="mb-1 font-bold text-blue">Pourquoi ce n&apos;est pas un sujet pour plus tard</p>
      <p className="text-[0.95rem]">
        Trois portes se ferment avec le temps sur une succession : le compteur des 15 ans, votre
        soixante-dixième anniversaire, votre soixante et onzième.{" "}
        <strong>Aucune ne se rouvre.</strong> L&apos;une d&apos;elles se ferme plus vite que les
        autres, et la vidéo vous dit laquelle.
      </p>
    </div>
  );
}

/** Mention anti-spam, sous le formulaire. */
export function NoSpamLine() {
  return (
    <p className="text-center text-[0.85rem] text-text-soft">
      <span aria-hidden>🔒</span> Votre email est protégé et ne sera jamais transmis à un tiers.
      Aucun démarchage téléphonique. Désinscription en un clic.
    </p>
  );
}

/**
 * Texte de compliance Facebook / Meta.
 * ⚠️ Son absence est une cause fréquente de bannissement de compte publicitaire.
 */
export function MetaDisclaimer() {
  return (
    <p className="text-[0.8rem] leading-relaxed text-text-soft">
      Ce site n&apos;est pas affilié à Facebook, Instagram ou Meta Platforms Inc., et n&apos;est en
      aucune façon approuvé, administré ou sponsorisé par eux. Une fois que vous quittez Facebook,
      la responsabilité n&apos;incombe plus à leur site.
    </p>
  );
}
