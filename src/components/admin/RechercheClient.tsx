"use client";

import { useActionState } from "react";
import { chercherClient, type ResultatFiche } from "@/app/admin/recherche";
import { Carte, Grille, Section, Tableau, dateHeure, eur } from "./Ui";

export function RechercheClient() {
  const [r, action, attente] = useActionState<ResultatFiche, FormData>(chercherClient, {});

  return (
    <>
      {/* Sans `action` d'URL : la soumission passe par l'action serveur, en POST.
          L'adresse email ne doit jamais apparaître dans la barre d'adresse. */}
      <form action={action} className="mt-4 flex flex-wrap gap-2">
        <input
          name="email"
          type="email"
          required
          autoComplete="off"
          placeholder="adresse email du client"
          className="min-h-[44px] w-full max-w-[380px] border border-grey-line bg-white px-3"
        />
        <button
          disabled={attente}
          className="min-h-[44px] bg-blue px-5 font-bold text-white disabled:opacity-60"
        >
          {attente ? "Recherche…" : "Chercher"}
        </button>
      </form>

      {r.erreur && (
        <p role="alert" className="mt-4 border-2 border-red bg-red-bg p-3 font-bold text-red">
          {r.erreur}
        </p>
      )}

      {!r.erreur && r.trouve === false && (
        <p className="mt-6 border-2 border-orange bg-white p-4 text-[0.95rem]">
          Aucune trace de <strong>{r.email}</strong> : ni inscription, ni commande, ni accès.
        </p>
      )}

      {r.trouve && (
        <>
          <Section titre={`Résumé — ${r.email}`}>
            <Grille>
              <Carte
                titre="Inscrit"
                valeur={r.inscritLe ? dateHeure(r.inscritLe) : "non"}
                precision={r.source ? `depuis ${r.source}` : undefined}
              />
              <Carte
                titre="Commandes payées"
                valeur={String(r.commandesPayees ?? 0)}
                precision={`${r.commandesTotal ?? 0} au total`}
              />
              <Carte
                titre="Recettes nettes"
                valeur={eur(r.net ?? 0)}
                accent="vert"
                precision={r.rembourse ? `${eur(r.rembourse)} remboursé` : undefined}
              />
              <Carte
                titre="Accès"
                valeur={r.acces ?? "aucun"}
                accent={r.acces === "actif" ? "vert" : r.acces === "révoqué" ? "rouge" : undefined}
                precision={r.vuLe ? `vu ${dateHeure(r.vuLe)}` : undefined}
              />
            </Grille>
            {r.desabonne && (
              <p className="mt-3 border-2 border-red bg-red-bg p-3 font-bold text-red">
                Désinscrit : plus aucun email ne partira vers cette adresse.
              </p>
            )}
          </Section>

          {r.profil && (
            <Section titre="Réponses de qualification">
              <Tableau colonnes={["Champ", "Réponse"]} lignes={r.profil.map((l) => [l[0], l[1]])} />
            </Section>
          )}

          <Section titre="Emails réservés">
            <p className="text-[0.95rem]">{r.envoyes?.join(" · ") || "aucun"}</p>
          </Section>

          <Section
            titre="Ligne de temps"
            aide="Du plus récent au plus ancien. Le jeton d’accès n’y figure jamais : pour renvoyer son lien à un client, la page /connexion le fait déjà, vers sa propre adresse."
          >
            <Tableau
              colonnes={["Date", "Événement", "Détail"]}
              lignes={(r.evenements ?? []).map((e) => [dateHeure(e.date), e.type, e.detail])}
              vide="Aucun événement daté."
            />
          </Section>
        </>
      )}
    </>
  );
}
