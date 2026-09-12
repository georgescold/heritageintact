/**
 * Texte de compliance Facebook / Meta.
 * ⚠️ Son absence est une cause fréquente de bannissement de compte publicitaire.
 *
 * Les autres blocs de cette page (teaser légal sous le bouton, bandeau
 * d'urgence, ligne anti-spam) ont été repris par `components/marketing/` et
 * par `Urgency` : seul ce texte reste, affiché dans le pied de page.
 */
export function MetaDisclaimer() {
  return (
    <p className="text-[0.72rem] leading-snug text-text-soft">
      Ce site n&apos;est ni affilié, ni approuvé, ni administré ou sponsorisé par Facebook,
      Instagram ou Meta Platforms Inc.
    </p>
  );
}
