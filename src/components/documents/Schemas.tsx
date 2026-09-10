/**
 * LES SCHÉMAS DES DOCUMENTS IMPRIMABLES.
 *
 * ═══ Pourquoi du trait et pas de la photo ═══
 *
 * Ces feuilles sont imprimées chez le client, sur une imprimante à jet d'encre
 * dont la cartouche coûte 30 € — plus cher que Le guide. Une photo, même en
 * noir et blanc, c'est un aplat qui vide une cartouche en quatorze pages, et
 * c'est le premier email de réclamation.
 *
 * Mais ce n'est pas seulement une question d'encre. Sur un mécanisme juridique,
 * un schéma au trait fait un travail qu'aucune photo ne fait : il MONTRE la
 * structure. Le démembrement expliqué en trois phrases reste abstrait ; la même
 * maison coupée en deux sur un dessin se comprend en une seconde, et se retient.
 *
 * ═══ Les règles, et elles sont strictes ═══
 *
 * · Traits noirs de 1 à 2 px, aucun aplat, aucun gris de remplissage.
 * · `currentColor` partout : le schéma suit la couleur du texte, donc il reste
 *   lisible photocopié, faxé, ou imprimé en mode brouillon.
 * · Le texte des schémas est du VRAI texte SVG, jamais une image : il reste net
 *   à l'impression quelle que soit la résolution, et il se sélectionne.
 * · `role="img"` et un `<title>` sur chacun : la feuille doit rester
 *   compréhensible par quelqu'un qui la lit avec une liseuse d'écran, et par
 *   l'enfant qui la retrouvera sans avoir jamais vu le site.
 */

function Cadre({
  titre,
  legende,
  children,
  hauteur = 200,
  largeur = 520,
}: {
  titre: string;
  legende?: string;
  children: React.ReactNode;
  hauteur?: number;
  largeur?: number;
}) {
  return (
    <figure className="my-5">
      <svg
        viewBox={`0 0 ${largeur} ${hauteur}`}
        className="w-full max-w-[520px] text-black"
        role="img"
        aria-label={titre}
      >
        <title>{titre}</title>
        {children}
      </svg>
      {legende && <figcaption className="mt-1 text-[0.85rem] leading-snug">{legende}</figcaption>}
    </figure>
  );
}

const T = {
  fill: "currentColor",
  fontFamily: "Arial, Helvetica, sans-serif",
} as const;

const L = { stroke: "currentColor", fill: "none" } as const;

/**
 * LE DÉMEMBREMENT — le schéma le plus important de tout le produit.
 *
 * C'est le concept que personne ne comprend en mots : « vous donnez les murs et
 * vous gardez l'usage » sonne comme une astuce. Dessiné, c'est évident — une
 * maison, deux parts, qui garde quoi.
 */
export function SchemaDemembrement() {
  return (
    <Cadre
      titre="La maison coupée en deux : l'usage d'un côté, le titre de l'autre"
      hauteur={230}
      legende="Article 669 du Code général des impôts. Avant 71 ans, la part transmise est comptée pour 60 % de la valeur du bien ; à partir de 71 ans, pour 70 %."
    >
      {/* La maison */}
      <path d="M40 120 L110 62 L180 120" {...L} strokeWidth="2" />
      <rect x="55" y="120" width="110" height="80" {...L} strokeWidth="2" />
      <rect x="95" y="155" width="30" height="45" {...L} strokeWidth="1.5" />
      <text x="110" y="222" {...T} fontSize="13" textAnchor="middle">
        Votre maison
      </text>

      {/* La coupure */}
      <line x1="230" y1="40" x2="230" y2="205" {...L} strokeWidth="1" strokeDasharray="5 4" />

      {/* Usufruit */}
      <rect x="255" y="45" width="240" height="65" {...L} strokeWidth="2" />
      <text x="268" y="68" {...T} fontSize="14" fontWeight="bold">
        L&apos;usufruit — vous
      </text>
      <text x="268" y="88" {...T} fontSize="12">
        Vous y habitez. Vous la louez si
      </text>
      <text x="268" y="103" {...T} fontSize="12">
        vous voulez. Vous en gardez les loyers.
      </text>

      {/* Nue-propriété */}
      <rect x="255" y="130" width="240" height="65" {...L} strokeWidth="2" />
      <text x="268" y="153" {...T} fontSize="14" fontWeight="bold">
        La nue-propriété — vos enfants
      </text>
      <text x="268" y="173" {...T} fontSize="12">
        Ils ont le titre. Ils ne peuvent rien
      </text>
      <text x="268" y="188" {...T} fontSize="12">
        en faire de votre vivant.
      </text>

      <line x1="182" y1="100" x2="252" y2="78" {...L} strokeWidth="1.5" />
      <line x1="182" y1="140" x2="252" y2="162" {...L} strokeWidth="1.5" />
    </Cadre>
  );
}

/**
 * LES 3 DATES SUR UNE SEULE LIGNE D'ÂGE.
 *
 * Les trois échéances sont dispersées dans le produit ; posées sur un même axe,
 * elles cessent d'être trois règles et deviennent un calendrier. Et le lecteur
 * y place son âge au stylo — c'est ce geste qui les rend siennes.
 */
export function SchemaTroisDates() {
  return (
    <Cadre
      titre="Vos trois dates, sur une seule ligne"
      hauteur={175}
      legende="Portez votre âge sur la ligne. Ce qui est à votre droite est encore ouvert ; ce qui est à votre gauche est passé."
    >
      <line x1="40" y1="95" x2="490" y2="95" {...L} strokeWidth="2" />
      <path d="M482 88 L492 95 L482 102" {...L} strokeWidth="2" />

      {[
        { x: 140, an: "à tout âge", t1: "Le compteur", t2: "des 15 ans", art: "art. 779 et 784" },
        { x: 300, an: "70 ans", t1: "L'assurance-vie", t2: "", art: "art. 990 I / 757 B" },
        { x: 420, an: "71 ans", t1: "La nue-propriété", t2: "", art: "art. 669" },
      ].map((d) => (
        <g key={d.x}>
          <line x1={d.x} y1="85" x2={d.x} y2="105" {...L} strokeWidth="2" />
          <circle cx={d.x} cy="95" r="5" fill="currentColor" />
          <text x={d.x} y="45" {...T} fontSize="13" fontWeight="bold" textAnchor="middle">
            {d.t1}
          </text>
          <text x={d.x} y="61" {...T} fontSize="13" fontWeight="bold" textAnchor="middle">
            {d.t2}
          </text>
          <text x={d.x} y="76" {...T} fontSize="11" textAnchor="middle">
            {d.an}
          </text>
          <text x={d.x} y="122" {...T} fontSize="10" textAnchor="middle">
            {d.art}
          </text>
        </g>
      ))}

      <text x="40" y="150" {...T} fontSize="12">
        Mon âge aujourd&apos;hui :
      </text>
      <line x1="165" y1="152" x2="245" y2="152" {...L} strokeWidth="1" />
      <text x="255" y="150" {...T} fontSize="12">
        ans. Celle qui arrive en premier :
      </text>
      <line x1="425" y1="152" x2="490" y2="152" {...L} strokeWidth="1" />
    </Cadre>
  );
}

/**
 * LE BARÈME PAR TRANCHES.
 *
 * L'erreur que tout le monde fait : croire que 20 % s'appliquent à TOUT. Le
 * dessin en escalier montre que chaque tranche a son taux, et que la première
 * partie est presque gratuite.
 */
export function SchemaBareme() {
  const tranches = [
    { h: 18, taux: "5 %", de: "0" },
    { h: 26, taux: "10 %", de: "8 072 €" },
    { h: 34, taux: "15 %", de: "12 109 €" },
    { h: 52, taux: "20 %", de: "15 932 €" },
  ];
  let x = 60;
  return (
    <Cadre
      titre="Le barème monte par tranches, jamais d'un bloc"
      hauteur={185}
      legende="Article 777 du Code général des impôts. Chaque tranche a son taux : les premiers 15 932 € ne sont pas taxés à 20 %, mais à 5, 10 puis 15 %. Au-delà, et jusqu'à 552 324 €, c'est 20 %."
    >
      {tranches.map((t) => {
        const el = (
          <g key={t.de}>
            <rect x={x} y={130 - t.h} width="95" height={t.h} {...L} strokeWidth="2" />
            <text
              x={x + 47}
              y={125 - t.h}
              {...T}
              fontSize="14"
              fontWeight="bold"
              textAnchor="middle"
            >
              {t.taux}
            </text>
            <text x={x} y="148" {...T} fontSize="10">
              {t.de}
            </text>
          </g>
        );
        x += 100;
        return el;
      })}
      <line x1="55" y1="130" x2="470" y2="130" {...L} strokeWidth="2" />
      <text x="60" y="172" {...T} fontSize="12">
        La part taxable, une fois l&apos;abattement de 100 000 € déduit.
      </text>
    </Cadre>
  );
}

/**
 * AVANT / APRÈS 70 ANS — le facteur cinq, montré.
 *
 * Deux colonnes de hauteurs très différentes disent en un regard ce que deux
 * nombres ne disent pas : 152 500 € par bénéficiaire d'un côté, 30 500 € pour
 * tout le monde de l'autre.
 */
export function SchemaAvantApres70() {
  return (
    <Cadre
      titre="Ce que change votre 70e anniversaire sur l'assurance-vie"
      hauteur={215}
      legende="Ce sont les PRIMES VERSÉES qui comptent, jamais la date d'ouverture du contrat. Articles 990 I et 757 B du Code général des impôts."
    >
      <rect x="55" y="40" width="180" height="120" {...L} strokeWidth="2" />
      <text x="145" y="66" {...T} fontSize="14" fontWeight="bold" textAnchor="middle">
        Versé AVANT 70 ans
      </text>
      <text x="145" y="100" {...T} fontSize="22" fontWeight="bold" textAnchor="middle">
        152 500 €
      </text>
      <text x="145" y="122" {...T} fontSize="12" textAnchor="middle">
        par bénéficiaire
      </text>
      <text x="145" y="142" {...T} fontSize="11" textAnchor="middle">
        art. 990 I
      </text>

      <text x="262" y="105" {...T} fontSize="26" textAnchor="middle">
        →
      </text>

      <rect x="290" y="40" width="180" height="120" {...L} strokeWidth="2" />
      <text x="380" y="66" {...T} fontSize="14" fontWeight="bold" textAnchor="middle">
        Versé APRÈS 70 ans
      </text>
      <text x="380" y="100" {...T} fontSize="22" fontWeight="bold" textAnchor="middle">
        30 500 €
      </text>
      <text x="380" y="122" {...T} fontSize="12" textAnchor="middle">
        au total, tous contrats
      </text>
      <text x="380" y="142" {...T} fontSize="11" textAnchor="middle">
        art. 757 B
      </text>

      <text x="262" y="192" {...T} fontSize="13" fontWeight="bold" textAnchor="middle">
        Cinq fois moins, du jour au lendemain.
      </text>
    </Cadre>
  );
}

/**
 * LE COMPTEUR DES 15 ANS.
 *
 * Le point que personne ne comprend : le compteur ne démarre PAS à la naissance
 * ni à un âge, il démarre au premier don déclaré. Sans ce dessin, le lecteur
 * croit qu'il a « raté » quelque chose.
 */
export function SchemaCompteur15Ans() {
  return (
    <Cadre
      titre="Le compteur des 15 ans démarre au premier don déclaré"
      hauteur={165}
      legende="Articles 779 et 784 du Code général des impôts. Tant qu'aucun don n'a été déclaré, l'abattement est entier et le compteur ne court pas : c'est une bonne nouvelle, pas un retard."
    >
      <line x1="50" y1="80" x2="480" y2="80" {...L} strokeWidth="2" />
      <path d="M472 73 L482 80 L472 87" {...L} strokeWidth="2" />

      <line x1="120" y1="68" x2="120" y2="92" {...L} strokeWidth="2" />
      <circle cx="120" cy="80" r="5" fill="currentColor" />
      <text x="120" y="55" {...T} fontSize="13" fontWeight="bold" textAnchor="middle">
        1er don déclaré
      </text>
      <text x="120" y="110" {...T} fontSize="12" textAnchor="middle">
        100 000 € par parent
      </text>

      <line x1="380" y1="68" x2="380" y2="92" {...L} strokeWidth="2" />
      <circle cx="380" cy="80" r="5" fill="currentColor" />
      <text x="380" y="55" {...T} fontSize="13" fontWeight="bold" textAnchor="middle">
        15 ans plus tard
      </text>
      <text x="380" y="110" {...T} fontSize="12" textAnchor="middle">
        100 000 € de nouveau
      </text>

      <line x1="120" y1="132" x2="380" y2="132" {...L} strokeWidth="1" strokeDasharray="4 3" />
      <text x="250" y="150" {...T} fontSize="12" textAnchor="middle">
        15 ans
      </text>
    </Cadre>
  );
}
