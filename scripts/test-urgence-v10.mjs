import fs from "node:fs";
import vm from "node:vm";
import assert from "node:assert/strict";
import { createRequire } from "node:module";
const require = createRequire(import.meta.url), ts = require("typescript"), { renderToStaticMarkup } = require("react-dom/server");
let n = 0;
const ok = x => { assert.ok(x); n++; };
const eq = (a, b) => { assert.equal(a, b); n++; };
function load(file, now, server = false) {
  const exports = {};
  class Clock extends Date { static now() { return now; } }
  const js = ts.transpileModule(fs.readFileSync(file, "utf8"), { compilerOptions: { module: ts.ModuleKind.CommonJS, jsx: ts.JsxEmit.ReactJSX } }).outputText;
  vm.runInNewContext(js, { exports, Date: Clock, setInterval, clearInterval, require: p => p === "react" ? { useSyncExternalStore: (_subscribe, snapshot, initial) => server ? initial() : snapshot() } : p.startsWith("@/") ? load("src/" + p.slice(2) + ".ts", now, server) : require(p) });
  return exports;
}
const fin = Date.parse("2026-12-31T23:59:59+01:00"), f = load("src/lib/urgence-fiscale.ts", fin);
eq(f.FIN_EXONERATION_LOGEMENT, "2026-12-31T23:59:59+01:00");
for (const [offset, expected] of [[-86400000,86400],[-1000,1],[-1,1],[0,0],[1,0],[86400000,0]]) eq(f.secondesExonerationRestantes(fin + offset), expected);
const now = Date.parse("2026-09-09T12:00:00+02:00");
const markup = renderToStaticMarkup(load("src/components/Urgency.tsx", now).UrgencyBar());
ok(markup.includes('role="timer"')); ok(markup.includes('aria-live="off"')); ok(markup.includes("31 décembre 2026")); ok(!markup.includes("Logement neuf ou rénovation énergétique")); ok(!markup.includes("Voir les conditions")); ok(!markup.includes("NaN"));
eq(markup, renderToStaticMarkup(load("src/components/Urgency.tsx", now).UrgencyBar()));
const initial = renderToStaticMarkup(load("src/components/Urgency.tsx", now, true).UrgencyBar());
ok(initial.includes("—")); ok(!initial.includes("NaN"));
for (const date of [fin, fin + 86400000]) {
  const u = load("src/components/Urgency.tsx", date);
  for (const name of ["UrgencyBar", "UrgencyCountdown"]) {
    const html = renderToStaticMarkup(u[name]());
    ok(!html.includes('role="timer"')); ok(html.includes("terminée") || html.includes("règles actuelles"));
  }
}
const urgence = fs.readFileSync("src/components/Urgency.tsx", "utf8");
ok(!/localStorage|sessionStorage|commencerPromotion/.test(urgence)); ok(urgence.includes("67 ans")); ok(urgence.includes("82 ans")); ok(urgence.includes("84 ans")); ok(urgence.includes("Acheter le guide ne lance pas ce délai"));
for (const file of ["src/app/page.tsx", "src/app/methode/page.tsx"]) {
  const page = fs.readFileSync(file, "utf8");
  ok(page.includes("<UrgencyBar />")); ok(page.includes(file.includes("/methode/")?"<EcheanceHistorique":"<UrgencyCountdown")); ok(page.includes(file.includes("/methode/")?"<EcheanceHistorique":"<ConditionsExoneration")); ok(page.includes("votre mort")); ok(!page.includes("Pas une économie promise."));
  ok(page.includes(file.includes("/methode/")?"<CalculHistorique":"page suivante")); ok(page.indexOf("<UrgencyBar") < page.indexOf("<Header"));
}
const exemple = fs.readFileSync("src/components/ExempleHeadline.tsx", "utf8");
ok(exemple.includes("EXEMPLE FICTIF")); ok(exemple.includes("Voir les hypothèses"));
console.log(n + " contrôles V10 réussis : échéance fiscale fixe, expiration, rendu, headline, conditions et absence de réinitialisation.");
