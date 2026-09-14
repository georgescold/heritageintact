const fs = require('node:fs');
const vm = require('node:vm');
const assert = require('node:assert/strict');
const ts = require('typescript');

const source = fs.readFileSync('src/app/actions.ts', 'utf8');
const code = ts.transpileModule(source, {
  compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
}).outputText;

async function scenario(action, livraisonEnErreur = false) {
  const callbacks = [], appels = [], cookies = [];
  const lead = { id: 'test', email: 'test@example.invalid', firstName: 'Test' };
  const exports = {};
  const deps = {
    'next/server': { after: callback => callbacks.push(callback) },
    'next/navigation': { redirect: path => { throw { redirect: path }; } },
    'next/headers': { cookies: async () => ({ get: () => undefined, set: (...args) => cookies.push(args) }) },
    '@/lib/utm': { lireUtm: () => ({}), utmPresent: () => false },
    '@/lib/db': {
      addLead: async () => { appels.push('lead'); return lead; },
      marquerEnvoye: async (_, cle) => appels.push(cle),
    },
    '@/lib/email': {
      envoyerLivraison: async () => {
        appels.push('livraison');
        if (livraisonEnErreur) throw Error('service indisponible');
        return { ok: true };
      },
      envoyerGrilleDroits: async () => { appels.push('grille'); return { ok: true }; },
      envoyerEtape: async () => { appels.push('sequence'); return { ok: true }; },
    },
    '@/lib/sequence': { SEQUENCE: [{ cle: 'j1' }], momentPremiereEtape: () => new Date(0) },
  };
  vm.runInNewContext(code, { exports, require: id => deps[id] || {}, console: { error() {} } });
  const form = new FormData();
  form.set('firstName', 'Test'); form.set('email', lead.email); form.set('cgv', 'on');
  let destination;
  try { await exports[action](undefined, form); } catch (e) {
    if (!e.redirect) throw e;
    destination = e.redirect;
  }
  assert.equal(destination, action === 'optin' ? '/methode?inscrit=1' : '/document/le-chiffre?envoye=1');
  assert.deepEqual(appels, ['lead'], 'Aucun email ne doit bloquer la redirection');
  assert.equal(cookies[0][0], 'hi_lead');
  assert.equal(callbacks.length, 1);
  await callbacks[0]();
  assert.ok(appels.includes('sequence'), 'La séquence reste déclenchée après la réponse');
  assert.ok(appels.includes('j1'));
  if (action === 'optin') assert.equal(appels.includes('j0'), !livraisonEnErreur);
  else assert.ok(appels.includes('grille'));
  const invalide = new FormData();
  const result = await exports[action](undefined, invalide);
  assert.ok(result.error);
  assert.equal(callbacks.length, 1, 'Une saisie invalide ne programme aucun email');
}

(async () => {
  await scenario('optin');
  await scenario('optin', true);
  await scenario('demanderDocument');
  console.log('OK : redirections non bloquées, cookies conservés, emails et séquences exécutés après réponse, échec email isolé, validation inchangée.');
})().catch(e => { console.error(e); process.exitCode = 1; });
