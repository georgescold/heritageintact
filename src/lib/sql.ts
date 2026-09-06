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
 * idempotent et sans outil de migration : deux tables et trois index ne
 * justifient pas une dépendance de plus, et un `create table if not exists` ne
 * peut pas détruire de données.
 *
 * ⚠️ Le jour où le schéma évolue vraiment (une colonne renommée, un type
 * changé), il faudra une vraie migration. Ce raccourci tient tant que les
 * changements sont additifs.
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
      // Le compteur « membres fondateurs » filtre là-dessus à chaque affichage.
      await s`create index if not exists orders_status_idx on orders (status)`;
      // Le cron balaie les inscrits encore abonnés une fois par jour.
      await s`create index if not exists leads_desabonne_idx on leads (desabonne)`;
    })().catch((e) => {
      // Un échec ne doit pas rester en cache : la prochaine écriture réessaiera.
      schemaPret = null;
      throw e;
    });
  }
  return schemaPret;
}
