import postgres from "postgres";

/**
 * La connexion Postgres, et la création du schéma.
 *
 * ═══ Pourquoi Postgres et pas l'API Supabase ═══
 *
 * On écrit du SQL standard, pas des appels propres à un hébergeur. Résultat :
 * la même couche fonctionne avec le Postgres de Vercel (Neon), avec Supabase,
 * avec Railway ou avec une base auto-hébergée. La seule chose à fournir est une
 * chaîne de connexion. Un jour où il faudra changer de fournisseur, il n'y aura
 * rien à réécrire.
 *
 * ═══ Comment ça s'active ═══
 *
 * Dès que `POSTGRES_URL` (ou `DATABASE_URL`) est renseignée, `db.ts` bascule
 * dessus. Sans elle, il continue d'écrire dans `./data/db.json` : le
 * développement local ne demande donc rien à installer.
 *
 * Sur Vercel, créer une base depuis Storage injecte `POSTGRES_URL`
 * automatiquement dans le projet — il n'y a rien à copier à la main.
 *
 * ═══ Le pool, en serverless ═══
 *
 * `max: 1` et `idle_timeout: 20` : chaque instance ouvre au plus une connexion
 * et la relâche vite. Sans ça, une montée en charge épuise le nombre de
 * connexions de la base bien avant d'épuiser quoi que ce soit d'autre.
 */

const URL_BASE = process.env.POSTGRES_URL ?? process.env.DATABASE_URL ?? "";

/** Vrai quand une base est configurée. C'est ce qui décide du mode de `db.ts`. */
export const sqlActif = Boolean(URL_BASE);

let _sql: postgres.Sql | null = null;

export function sql(): postgres.Sql {
  if (!_sql) {
    if (!URL_BASE) throw new Error("POSTGRES_URL absente : sql() ne doit pas être appelé.");
    _sql = postgres(URL_BASE, {
      max: 1,
      idle_timeout: 20,
      connect_timeout: 10,
      // Les bases managées (Neon, Supabase) exigent TLS mais présentent des
      // certificats que Node ne connaît pas : on chiffre sans vérifier la chaîne.
      ssl: "require",
      // Les connexions passent par un pooler qui ne garde pas les prepared
      // statements d'une requête à l'autre.
      prepare: false,
    });
  }
  return _sql;
}

/**
 * Crée les tables si elles n'existent pas.
 *
 * Appelée à la première écriture, une fois par instance. C'est volontairement
 * idempotent et sans outil de migration : cinq tables et cinq index ne
 * justifient pas une dépendance de plus, et un `create table if not exists` ne
 * peut pas détruire de données.
 *
 * ⚠️ Le jour où le schéma évolue vraiment (une colonne renommée, un type
 * changé), il faudra une vraie migration. Ce raccourci tient tant que les
 * changements sont additifs.
 *
 * ⚠️ ET « ADDITIF » VEUT DIRE : UNE TABLE NOUVELLE, JAMAIS UNE COLONNE. Sur
 * une base déjà en place, `create table if not exists` ne fait RIEN — il ne
 * relit même pas le littéral. Ajouter une colonne ici passerait donc les tests
 * en local (base vide, table créée d'un coup) et manquerait en production, sans
 * la moindre erreur. C'est la raison pour laquelle l'espace membre est arrivé
 * en deux tables neuves, et pour laquelle ses traces d'envoi tiennent dans un
 * `jsonb` plutôt que dans des colonnes.
 */
let schemaPret: Promise<void> | null = null;

export function assurerSchema(): Promise<void> {
  if (!schemaPret) {
    schemaPret = (async () => {
      const s = sql();
      await s`
        create table if not exists leads (
          id          text primary key,
          email       text not null unique,
          first_name  text not null,
          created_at  timestamptz not null default now(),
          source      text,
          desabonne   boolean not null default false,
          envoyes     jsonb not null default '[]'::jsonb
        )
      `;
      await s`
        create table if not exists orders (
          id                        text primary key,
          email                     text not null,
          first_name                text not null,
          items                     jsonb not null default '[]'::jsonb,
          mode                      text not null,
          consent_immediate_access  boolean not null default false,
          created_at                timestamptz not null default now(),
          status                    text not null default 'pending',
          stripe_customer_id        text,
          stripe_payment_method_id  text
        )
      `;
      /* ─── L'ACCÈS MEMBRE ─────────────────────────────────────────────
         Un accès = une adresse email, JAMAIS une commande. Quelqu'un qui
         achète La Méthode à 27 €, puis un produit backend trois mois plus
         tard, doit retrouver UN SEUL espace : c'est `email unique` qui le
         garantit, exploité par le même `on conflict … do update` no-op
         qu'addLead. */
      await s`
        create table if not exists acces (
          -- Le jeton est la CLÉ PRIMAIRE, pas une colonne indexée à côté :
          -- chaque page de l'espace se résout en un seul accès index.
          -- ⚠️ IL N'EXPIRE JAMAIS. Un lien expiré chez quelqu'un qui relève sa
          -- boîte le mardi et le samedi, c'est un client perdu.
          jeton       text primary key,

          email       text not null unique,
          first_name  text not null,
          created_at  timestamptz not null default now(),

          -- Remboursement du produit d'appel : l'accès se ferme, la ligne
          -- reste (on ne détruit pas une trace comptable).
          revoque     boolean not null default false,

          -- Dernière visite. Pour le support et la relance, jamais affiché.
          vu_le       timestamptz,

          -- Anti-abus du formulaire « j'ai perdu mon lien » : un renvoi
          -- toutes les 2 minutes maximum.
          renvoye_le  timestamptz,

          -- ⚠️ LES TRACES D'ENVOI VONT ICI, PAS DANS DES COLONNES EN DUR.
          -- Modèle exact de leads.envoyes. Clés : "acces" (le lien personnel),
          -- "c1" "c2" "c3" (la séquence de rassurance), "recu:<sku>" (un achat
          -- fait depuis l'espace). La future séquence de vente des backends
          -- s'y ajoutera sans AUCUNE migration — ce qui serait impossible avec
          -- des colonnes, puisqu'un create table if not exists ne les créerait
          -- jamais sur une base déjà en place.
          envoyes     jsonb not null default '[]'::jsonb
        )
      `;

      /* ─── LA PROGRESSION ─────────────────────────────────────────────
         ⚠️ CLÉ SUR L'EMAIL, PAS SUR LE JETON. Régénérer un jeton (lien
         diffusé, ordinateur familial, capture d'écran partagée) doit être un
         UPDATE d'une seule ligne dans `acces` et ne doit JAMAIS effacer la
         progression du membre. */
      await s`
        create table if not exists progression (
          email       text not null,

          -- "e0" … "e7". Ces clés sont ÉCRITES EN BASE : elles ne changent
          -- plus jamais, exactement comme Etape.cle dans sequence.ts:22.
          etape       text not null,

          -- Posé au PREMIER affichage de l'étape. C'est cette colonne, et
          -- elle seule, qui autorise l'affichage de la boutique : on ne
          -- propose jamais un upsell à qui n'a pas ouvert l'étape 0.
          ouverte_le  timestamptz not null default now(),

          -- Posé quand le membre coche « j'ai terminé cette étape ».
          -- null = ouverte mais pas finie. Décocher = repasser à null.
          faite_le    timestamptz,

          -- La clé composite rend l'ouverture idempotente en UNE requête :
          --   insert … on conflict (email, etape) do nothing
          -- Aucun lire-puis-écrire, donc aucune course, dans les deux modes.
          primary key (email, etape)
        )
      `;

      /* ─── LES RÉPONSES DU BON DE COMMANDE ────────────────────────────
         Quatre questions facultatives posées entre « Vos coordonnées » et
         « Paiement sécurisé ». Elles ne servent qu'à choisir QUELS écrans
         d'offre sont montrés après le paiement, et dans quel ordre.

         ⚠️ UNE TABLE NEUVE, ET C'EST OBLIGATOIRE. Ajouter quatre colonnes à
         `orders` aurait paru plus simple et serait passé en local (base vide,
         table créée d'un coup) tout en manquant en production sans la moindre
         erreur — cf. l'avertissement en tête de fichier. C'est exactement le
         chemin par lequel `acces` et `progression` sont arrivées.

         ⚠️ CLÉ SUR L'IDENTIFIANT DE COMMANDE, PAS SUR L'EMAIL. Les réponses
         décrivent un ACHAT : elles sont écrites juste après `prepareCheckout`,
         au moment exact où cet identifiant existe et avant la confirmation
         Stripe. Un même acheteur qui recommande six mois plus tard répond à
         nouveau, et sa nouvelle réponse ne doit pas écraser la trace de la
         commande précédente. La clé primaire rend au passage la server action
         idempotente : appelée deux fois, elle laisse UNE ligne.

         ⚠️ CE QUI N'ENTRE JAMAIS ICI : aucune date de naissance (une tranche,
         et rien d'autre), aucun montant, aucun texte libre, et surtout aucune
         donnée de santé. La question sur l'enfant vulnérable ou handicapé ne se
         pose pas en ligne — donnée de santé relative à un tiers qui n'a
         consenti à rien (RGPD art. 9). Elle reste sur la feuille papier, qui ne
         quitte pas le salon. */
      await s`
        create table if not exists profils (
          order_id    text primary key,

          -- L'email de la commande. Sert à la PURGE : une réponse sur la
          -- situation familiale ne survit pas à une désinscription.
          email       text not null,

          -- Un code d'UN caractère, et rien d'autre. Les listes blanches sont
          -- dans la server action ; la base ne contraint pas, elle stocke.
          --   vie     : M P U V S X   (couple)
          --   enfants : 1 2 R 0 X
          --   av      : O N ? X       (assurance-vie)
          --   age     : a b c d X     (tranche, jamais une date)
          -- ⚠️ AUCUN ACCENT GRAVE DANS CE BLOC : il est à l'intérieur d'un
          -- gabarit balisé, et un accent grave le refermerait net.
          -- X = « je préfère ne pas répondre », traité PARTOUT comme une
          -- absence de réponse. Un code absent et un X sont équivalents.
          vie         text,
          enfants     text,
          av          text,
          age         text,

          -- Le nom court de la destination calculée au moment de la commande :
          -- "plan-seul", "pack", "av-dabord", "defaut". UNIQUEMENT pour la
          -- mesure — la répartition réelle entre les quatre pistes est l'un des
          -- trois chiffres qui décident si le dispositif gagne, et il n'existe
          -- nulle part aujourd'hui. Figé à l'écriture : recalculer la piste plus
          -- tard donnerait la table du jour, pas celle qu'a vue l'acheteur.
          piste       text,

          created_at  timestamptz not null default now()
        )
      `;

      // Le compteur « membres fondateurs » filtre là-dessus à chaque affichage.
      await s`alter table profils add column if not exists objectif text`;
      await s`alter table leads add column if not exists marketing_consent boolean not null default false`;
      await s`alter table leads add column if not exists marketing_consent_at timestamptz`;
      await s`create index if not exists orders_status_idx on orders (status)`;
      // L'espace retrouve les commandes d'un membre PAR SON EMAIL à chaque
      // affichage (calcul des possessions), et le cron y fait une jointure pour
      // le rattrapage de livraison. Sans cet index, chaque visite fait un
      // balayage complet de la table.
      //
      // ⚠️ C'est la SEULE modification admise sur une table déjà créée :
      // `create index if not exists` s'applique bien à une table existante,
      // là où ajouter une colonne au littéral `create table if not exists`
      // n'aurait aucun effet sur la base en place (cf. l'avertissement plus
      // haut) — un changement de colonne exigerait un ALTER TABLE à la main.
      await s`create index if not exists orders_email_idx on orders (email)`;
      // Le cron balaie les accès du plus ancien au plus récent, une fois par
      // jour, pour la séquence de rassurance.
      await s`create index if not exists acces_created_idx on acces (created_at)`;
      // Le cron balaie les inscrits encore abonnés une fois par jour.
      await s`create index if not exists leads_desabonne_idx on leads (desabonne)`;
      // La purge à la désinscription supprime PAR EMAIL, et la lecture de repli
      // (« le profil le plus récent de cet acheteur ») cherche par email elle
      // aussi. Sans cet index, les deux balaient toute la table.
      await s`create index if not exists profils_email_idx on profils (email)`;
    })().catch((e) => {
      // Un échec ne doit pas rester en cache : la prochaine écriture réessaiera.
      schemaPret = null;
      throw e;
    });
  }
  return schemaPret;
}
