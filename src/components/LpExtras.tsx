/**
 * Les leviers d'amélioration d'une landing page, à placer SOUS le bouton
 * (cf. 03-marketing-copy/landing-pages.md).
 *
 * Règle du projet : aucune preuve inventée. Tant qu'il n'y a pas de témoignage réel,
 * la preuve utilisée est l'autorité de la source (le Code général des impôts).
 */
/**
 * LE TEASER LÉGAL — avant l'opt-in.
 *
 * ═══ Ce qu'il remplace, et pourquoi ═══
 *
 * Il s'appelait « D'où viennent ces chiffres ? » et citait cinq articles du
 * Code pour justifier un calcul que la page d'opt-in ne montre nulle part. Il
 * répondait à une question que le lecteur ne s'était pas posée — et lui
 * apprenait au passage qu'il lui manquait quelque chose.
 *
 * Retourné, il fait deux choses à la fois, et les deux servent le clic :
 *
 *   — il OUVRE des boucles de curiosité. Chaque ligne nomme un fait dont le
 *     lecteur ignore la réponse, et la réponse est dans la vidéo ;
 *   — il ANCRE la confiance sur la loi. Chaque ligne porte son article, en
 *     petit, à droite. C'est la seule preuve dont on dispose aujourd'hui, et
 *     c'est la seule qui ne puisse pas se retourner contre nous.
 *
 * ⚠️ Les lignes TEASENT, elles n'expliquent pas. « La date de vos versements
 * compte plus que leur montant » ouvre une question ; « versez avant 70 ans
 * pour 152 500 € par bénéficiaire » y répondrait, et il n'y aurait plus de
 * raison de regarder la vidéo. C'est la règle posée le 6 septembre : on tease
 * les trois dates, on ne les donne jamais sur la page.
 */
export function ProofUnderButton() {
  const lignes: [string, string][] = [
    ["Pourquoi la date de vos versements compte plus que leur montant", "art. 990 I et 757 B"],
    [
      "Comment la loi valorise un bien selon votre âge — et pourquoi un seul anniversaire peut coûter dix points",
      "art. 669",
    ],
    [
      "Ce qui fait repartir un abattement à zéro, et la condition que presque personne ne remplit",
      "art. 779 et 784",
    ],
    ["La fenêtre qui se referme le 31 décembre 2026", "art. 790 A bis"],
  ];

  return (
    <div className="border border-grey-line bg-grey-bg p-4">
      <p className="mb-3 text-[1.05rem] font-bold text-blue">
        Ce que vous vous apprêtez à découvrir, et que la plupart des gens ignorent&nbsp;:
      </p>
      <ul className="space-y-2.5">
        {lignes.map(([texte, article]) => (
          <li key={article} className="flex gap-2 text-[0.98rem]">
            <span aria-hidden className="mt-0.5 shrink-0 font-bold text-green">
              ✔
            </span>
            <span>
              {texte}{" "}
              <span className="whitespace-nowrap text-[0.86rem] text-text-soft">— {article}</span>
            </span>
          </li>
        ))}
      </ul>
      <p className="mt-3 border-t border-grey-line pt-3 text-[0.92rem] text-text-soft">
        Ce ne sont pas des opinions : ce sont des articles du Code général des impôts, vérifiables
        en cinq minutes sur impots.gouv.fr.{" "}
        <strong className="text-text">
          Simplement, personne n&apos;est payé pour vous les dire.
        </strong>
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
