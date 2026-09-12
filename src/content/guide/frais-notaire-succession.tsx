/**
 * Grappe coûts — « frais de notaire succession tarif » (56,6) et « succession
 * quel frais de notaire ». Grappe globalement institutionnelle (51 %), mais ces
 * deux requêtes précises laissent de la place.
 *
 * ANGLE : la confusion de départ est massive — « frais de notaire » désigne dans
 * la tête des gens l'impôt, qui n'a rien à voir. Et le point vraiment contre-
 * intuitif, quasi absent du web grand public : les émoluments se calculent sur
 * l'actif BRUT, alors que l'impôt se calcule sur l'actif NET. Les dettes
 * réduisent donc l'impôt sans réduire les honoraires.
 *
 * ⚠️ Distinct de `frais-notaire-donation.tsx` : autre acte, autres requêtes,
 * autre levier. Les deux se maillent plutôt qu'elles ne se recouvrent.
 * Aucun document vendu ne traite les frais d'une succession.
 */
import Link from "next/link";
import { CaptureDocument } from "@/components/CaptureDocument";

export const VERIFIE_LE = "12 septembre 2026";

function Bloc({ titre, children }: { titre: string; children: React.ReactNode }) {
  return (
    <section className="mt-9">
      <h2 className="mb-3 text-[1.35rem] font-bold leading-snug">{titre}</h2>
      {children}
    </section>
  );
}

export function FraisNotaireSuccession() {
  return (
    <article className="mx-auto max-w-3xl px-4 py-8 text-[1rem] leading-relaxed">
      <h1 className="mb-3 text-[1.9rem] font-bold leading-tight">
        Frais de notaire d’une succession : ce n’est pas l’impôt, et ça ne se calcule pas pareil
      </h1>
      <p className="mb-2 text-text-soft">
        Deux factures arrivent ensemble et se confondent dans les esprits. Elles n’ont ni le même
        destinataire, ni la même assiette — et c’est la seconde différence qui surprend. Vérifié le{" "}
        {VERIFIE_LE}.
      </p>

      <Bloc titre="La confusion de départ">
        <p className="mb-3">
          Quand une famille dit « les frais de notaire ont coûté une fortune », elle parle neuf fois
          sur dix des <strong>droits de succession</strong> — c’est-à-dire de l’impôt, qui va
          intégralement à l’État. La rémunération du notaire, appelée émoluments, en représente
          généralement une fraction.
        </p>
        <p>
          Cette confusion a une conséquence pratique : on cherche à négocier le mauvais poste. Les
          émoluments sont fixés par un <strong>tarif national réglementé</strong>. Ils sont
          identiques dans toutes les études de France, il n’y a rien à comparer ni à discuter. Ce
          qui peut varier, ce sont les honoraires libres sur certaines prestations de conseil, qui
          doivent alors faire l’objet d’une convention écrite.
        </p>
      </Bloc>

      <Bloc titre="Ce que le notaire facture, et pourquoi il est obligatoire">
        <p className="mb-3">
          Une succession sans bien immobilier peut parfois se régler sans notaire. Dès qu’il y a un
          immeuble, il devient indispensable : lui seul peut établir l’attestation de propriété
          immobilière qui fait passer le bien au nom des héritiers et la publie au service de la
          publicité foncière.
        </p>
        <p>
          Les actes facturés sont essentiellement l’acte de notoriété, qui établit qui sont les
          héritiers, l’attestation de propriété immobilière, la déclaration de succession adressée à
          l’administration, et le cas échéant l’acte de partage. Chacun a son émolument
          proportionnel, calculé par tranches dégressives.
        </p>
      </Bloc>

      <Bloc titre="La différence d’assiette, et elle surprend tout le monde">
        <p className="mb-3">
          Les <strong>droits de succession</strong> se calculent sur l’actif <strong>net</strong> :
          on retire d’abord les dettes du défunt — un prêt en cours, des frais funéraires, un
          découvert. Moins il reste, moins on paie.
        </p>
        <p className="mb-3">
          Les <strong>émoluments</strong> proportionnels, eux, se calculent sur l’actif{" "}
          <strong>brut</strong>, dettes non déduites.
        </p>
        <p>
          Conséquence concrète : une succession composée d’une maison de {(400_000).toLocaleString("fr-FR")} € grevée
          d’un prêt de {(150_000).toLocaleString("fr-FR")} € voit son impôt calculé sur{" "}
          {(250_000).toLocaleString("fr-FR")} €, mais ses émoluments sur {(400_000).toLocaleString("fr-FR")} €. Le
          patrimoine réellement transmis est bien plus faible que celui qui sert de base aux
          honoraires. Ce n’est pas une anomalie, c’est la règle du tarif — mais elle explique
          beaucoup d’incompréhensions au moment de la note.
        </p>
      </Bloc>

      <CaptureDocument
        titre="L’autre moitié de la facture"
        accroche="Les émoluments sont réglementés et prévisibles ; l'impôt, lui, dépend entièrement de votre situation. Recevez la grille de ce que vos enfants paieraient aujourd'hui, par patrimoine et par nombre d'enfants, chaque montant avec son article."
        cta="Recevoir la grille"
      />

      <Bloc titre="Trois choses qui allègent réellement la note">
        <p className="mb-3">
          <strong>Les dettes justifiées.</strong> Elles réduisent l’impôt, à condition d’exister au
          jour du décès et d’être prouvées. C’est le poste le plus souvent sous-déclaré, faute de
          pièces retrouvées.
        </p>
        <p className="mb-3">
          <strong>Les frais funéraires</strong>, déductibles de l’actif dans une limite fixée par
          l’administration, sans justificatif à produire jusqu’à ce plafond.
        </p>
        <p>
          <strong>L’abattement de 20 % sur la résidence principale</strong>, quand ses conditions
          sont remplies — et elles le sont moins souvent qu’on ne croit :{" "}
          <Link href="/guide/abattement-residence-principale">
            à qui profite vraiment l’abattement de 20 %
          </Link>
          .
        </p>
      </Bloc>

      <Bloc titre="Ce que cette page ne vous dit pas">
        <p className="mb-3">
          Elle ne chiffre pas votre dossier. Les tranches du tarif, les débours avancés par l’étude
          et les actes réellement nécessaires dépendent de la composition de la succession. Un
          notaire établit un devis, et il le fait avant d’engager les actes.
        </p>
        <p>
          Pour le coût d’une donation, qui obéit à d’autres règles et comporte un levier propre, voir{" "}
          <Link href="/guide/frais-de-notaire-donation">
            ce que coûte vraiment une donation chez le notaire
          </Link>
          .
        </p>
      </Bloc>

      <Bloc titre="Sources et limites">
        <p className="mb-3 text-[0.9rem]">
          Code général des impôts : articles 768 et suivants (passif déductible), 775 (frais
          funéraires), 764 bis (abattement sur la résidence principale), 777 et 779 I (barème et
          abattements). Tarif réglementé des notaires : articles A444-53 et suivants du Code de
          commerce. État du droit vérifié le {VERIFIE_LE} sur Legifrance.
        </p>
        <p className="text-[0.9rem] text-text-soft">
          Information générale. Ne constitue ni une consultation juridique au sens de la loi
          n°71-1130, ni un conseil fiscal personnalisé, et ne remplace pas l’intervention d’un
          notaire. Voir les <Link href="/mentions-legales">mentions légales</Link>.
        </p>
      </Bloc>
    </article>
  );
}
