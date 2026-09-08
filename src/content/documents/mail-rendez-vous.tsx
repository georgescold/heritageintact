import { Champ, Encadre, Feuille, Titre } from "@/components/documents/Feuille";

/**
 * LE MAIL-TYPE DE PRISE DE RENDEZ-VOUS.
 *
 * ⚠️ Ce qui fait la différence n'est pas la politesse, c'est la liste des
 * pièces annoncées : une étude qui lit « j'apporte l'inventaire, la fiche
 * famille et les clauses bénéficiaires » comprend en une ligne qu'elle n'aura
 * pas à faire ce travail, et le rendez-vous change de nature.
 *
 * Fourni en deux versions parce que la moitié de l'avatar n'écrit pas de mail.
 */
export function MailRendezVous() {
  return (
    <Feuille
      titre="Le message de prise de rendez-vous"
      sousTitre="Version email et version téléphone. Recopiez, complétez les blancs, envoyez."
    >
      <Titre>Par email</Titre>
      <Encadre>
        <div className="space-y-3 text-[0.97rem]">
          <p>
            <strong>Objet :</strong> Demande de rendez-vous — préparation de transmission
          </p>
          <p>Madame, Monsieur,</p>
          <p>
            Je souhaite prendre rendez-vous pour organiser la transmission de mon patrimoine de mon
            vivant.
          </p>
          <p>
            Pour que le rendez-vous soit utile dès la première fois, j&apos;apporterai un dossier
            déjà constitué : l&apos;inventaire de mes biens avec leur mode de détention, ma
            situation familiale complète, la liste des donations déjà faites avec leurs dates, les
            relevés et les clauses bénéficiaires de mes contrats d&apos;assurance-vie, et une
            estimation des droits qui seraient dus aujourd&apos;hui.
          </p>
          <p>
            Les sujets que je voudrais aborder sont :{" "}
            <span className="border-b border-black px-16">&nbsp;</span>.
          </p>
          <p>
            Je suis disponible <span className="border-b border-black px-16">&nbsp;</span>. Merci de
            m&apos;indiquer un créneau qui vous convient, ainsi que les pièces complémentaires que
            vous souhaiteriez recevoir avant.
          </p>
          <p>
            Avec mes salutations respectueuses,
            <br />
            <span className="border-b border-black px-16">&nbsp;</span>
            <br />
            <span className="border-b border-black px-16">&nbsp;</span> (téléphone)
          </p>
        </div>
      </Encadre>

      <Titre>Par téléphone, si vous préférez appeler</Titre>
      <Encadre>
        <p className="text-[0.97rem]">
          « Bonjour, je voudrais un rendez-vous pour préparer la transmission de mon patrimoine de
          mon vivant. J&apos;ai déjà préparé l&apos;inventaire de mes biens, ma situation familiale
          et mes contrats d&apos;assurance-vie : j&apos;apporterai tout au rendez-vous. Quel serait
          le premier créneau possible ? »
        </p>
      </Encadre>

      <Titre>Deux précisions utiles</Titre>
      <ul className="list-disc space-y-1 pl-5">
        <li>
          Vous êtes libre de choisir votre notaire, et de changer d&apos;étude. Il n&apos;y a aucune
          obligation d&apos;aller chez celui qui a rédigé un acte précédent.
        </li>
        <li>
          Demandez dès le premier échange ce que coûteront les actes envisagés et sur quelle valeur
          ils sont calculés : c&apos;est une question normale, et elle se pose au début.
        </li>
      </ul>

      <Champ label="Message envoyé le" />
      <Champ label="Réponse reçue le" />
      <Champ label="Rendez-vous fixé au" />
    </Feuille>
  );
}
