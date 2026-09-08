import { Feuille, Source, Titre } from "@/components/documents/Feuille";

/**
 * LE LEXIQUE EN UNE PAGE (bonus B1).
 *
 * ⚠️ C'est le document le plus sous-estimé du produit. L'avatar n'ose pas
 * demander au notaire ce que veut dire « quotité disponible » : il hoche la
 * tête, il ressort, et il ne fait rien. Dix-huit mots définis en une ligne
 * suffisent à rendre le rendez-vous possible.
 *
 * Chaque définition tient sur une ligne, en mots courants. Aucune définition
 * n'introduit un mot qui ne figure pas dans la liste.
 */

const MOTS: { mot: string; sens: string }[] = [
  {
    mot: "Succession",
    sens: "Tout ce que vous laissez, et la façon dont la loi le partage entre vos héritiers.",
  },
  {
    mot: "Actif / passif",
    sens: "L'actif est ce que vous possédez, le passif ce que vous devez. La différence est ce qui se partage.",
  },
  {
    mot: "Héritier réservataire",
    sens: "Un enfant. La loi lui garantit une part minimale dont vous ne pouvez pas le priver.",
  },
  {
    mot: "Réserve héréditaire",
    sens: "Cette part minimale, précisément : la fraction qui revient obligatoirement aux enfants.",
  },
  {
    mot: "Quotité disponible",
    sens: "Le reste, celui dont vous disposez librement par testament ou par donation.",
  },
  {
    mot: "Abattement",
    sens: "Une somme retirée de la part d'un héritier avant tout calcul d'impôt. 100 000 € par parent et par enfant.",
  },
  {
    mot: "Droits de succession",
    sens: "L'impôt payé par chaque héritier sur sa part, après son abattement, selon un barème par tranches.",
  },
  {
    mot: "Donation",
    sens: "Transmettre de son vivant. Elle est définitive : ce qui est donné ne revient pas.",
  },
  {
    mot: "Donation-partage",
    sens: "Une donation qui répartit entre tous les enfants et fige les valeurs au jour où elle est faite.",
  },
  {
    mot: "Don manuel",
    sens: "Un don d'argent ou d'objet remis de la main à la main. Il se déclare, même quand il n'est pas taxé.",
  },
  {
    mot: "Rappel fiscal",
    sens: "La règle qui fait recompter les donations de moins de 15 ans dans le calcul suivant.",
  },
  {
    mot: "Usufruit",
    sens: "Le droit d'habiter un bien ou d'en percevoir les loyers, sans en être propriétaire.",
  },
  {
    mot: "Nue-propriété",
    sens: "La propriété du bien sans son usage. Au décès de l'usufruitier, elle devient pleine propriété.",
  },
  {
    mot: "Démembrement",
    sens: "Le fait de séparer l'usufruit de la nue-propriété entre deux personnes différentes.",
  },
  {
    mot: "Clause bénéficiaire",
    sens: "La phrase de votre contrat d'assurance-vie qui désigne qui touchera le capital. Elle se modifie.",
  },
  {
    mot: "Régime matrimonial",
    sens: "Les règles qui décident, dans un couple marié, ce qui appartient aux deux et ce qui appartient à chacun.",
  },
  {
    // ⚠️ Sans ce mot, le lecteur ne peut pas cocher la case qui décide si son
    // plan double ou non l'abattement : les plans-types lui demandent si sa
    // maison est un bien commun, et la feuille voyage seule dans le classeur.
    mot: "Bien commun",
    sens: "Un bien qui appartient aux deux époux à la fois — le plus souvent tout ce qui a été acheté pendant le mariage. Chacun en détient la moitié.",
  },
  {
    mot: "Donation au dernier vivant",
    sens: "Un acte entre époux qui élargit les droits du survivant sur la succession du premier parti.",
  },
];

export function Lexique() {
  return (
    <Feuille
      titre="Le lexique en une page"
      sousTitre="Les dix-huit mots que votre notaire emploiera. Emportez cette feuille au rendez-vous."
    >
      <p>
        Vous n&apos;avez pas à les retenir. Vous avez à pouvoir les relire pendant qu&apos;on vous
        parle.
      </p>
      <dl className="divide-y divide-black border-y border-black">
        {MOTS.map((m) => (
          <div key={m.mot} className="py-2">
            <dt className="font-bold">{m.mot}</dt>
            <dd className="text-[0.95rem]">{m.sens}</dd>
          </div>
        ))}
      </dl>
      <Titre>Deux mots à ne pas confondre</Titre>
      <p>
        <strong>Héritage</strong> et <strong>succession</strong> désignent la même chose vue de deux
        côtés : l&apos;héritage est ce que l&apos;on reçoit, la succession est l&apos;opération qui
        l&apos;organise. <strong>Usufruit</strong> et <strong>nue-propriété</strong> sont les deux
        moitiés d&apos;un même bien : réunies, elles font la pleine propriété.
      </p>
      <Source>
        Définitions rédigées en langage courant à partir du Code civil et du Code général des
        impôts. Elles n&apos;ont pas la précision d&apos;un texte de loi et ne s&apos;y substituent
        pas.
      </Source>
    </Feuille>
  );
}
