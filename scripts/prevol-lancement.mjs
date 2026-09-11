import fs from "node:fs";
// Lecture locale uniquement. Jamais de valeur de clé, de token ou de chaîne de connexion en sortie.
const env = { ...process.env };
if (fs.existsSync(".env.local")) {
  for (const line of fs.readFileSync(".env.local", "utf8").split(/\r?\n/)) {
    const match = line.match(/^([A-Z_][A-Z0-9_]*)\s*=\s*(.*)$/);
    if (match && env[match[1]] === undefined)
      env[match[1]] = match[2].trim().replace(/^["']|["']$/g, "");
  }
}
const present = (name) => Boolean(env[name]?.trim());
const checks = {
  basePostgres: present("POSTGRES_URL") || present("DATABASE_URL"),
  stripeSecret: present("STRIPE_SECRET_KEY"),
  stripePublic: present("NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY"),
  stripeWebhook: present("STRIPE_WEBHOOK_SECRET"),
  stripeMode: env.STRIPE_SECRET_KEY?.startsWith("sk_test_")
    ? "test"
    : env.STRIPE_SECRET_KEY?.startsWith("sk_live_")
      ? "live"
      : "absent ou inconnu",
  resendCle: present("RESEND_API_KEY"),
  resendWebhook: present("RESEND_WEBHOOK_SECRET"),
  cronProtege: (env.CRON_SECRET?.length ?? 0) >= 32,
  pilotageProtege: (env.PILOTAGE_SECRET?.length ?? 0) >= 32,
  vslLocaleIntegree:
    fs.existsSync("public/videos/vsl-heritage-intact-v2.mp4") &&
    fs.existsSync("public/img/vsl-heritage-intact-thumbnail-v4.webp"),
  marketingDeclareActif: env.EMAIL_MARKETING_ACTIVE === "true",
  ltvDeclareActive: env.EMAIL_LTV_ACTIVE === "true",
  interfaceConsentementDeclareeActive: env.NEXT_PUBLIC_META_SERVER_MEASUREMENT === "true",
  metaDeclareValide: env.META_CAPI_VALIDEE === "true",
  metaConfigurationPresente: ["META_CAPI_TOKEN", "META_PIXEL_ID", "META_GRAPH_VERSION"].every(
    present,
  ),
};
console.log(
  JSON.stringify(
    {
      source: "Environnement local uniquement",
      checks,
      limite:
        "Présence déclarative : ne prouve ni connexion, ni droits, ni déploiement, ni recette. Aucun service externe appelé. Les validations humaines restent dans la checklist.",
    },
    null,
    2,
  ),
);
