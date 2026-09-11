export function ApercuProduit({ plan = false, av = false }: { plan?: boolean; av?: boolean }) {
  return <figure className="my-7 overflow-hidden border border-grey-line bg-[#f5f2eb]">
    <div className="flex flex-wrap items-center justify-between gap-2 bg-blue px-5 py-3 text-sm text-white">
      <span className="font-bold tracking-wide">HÉRITAGE INTACT</span><span>{av ? "Guide assurance-vie" : plan ? "Mon plan adapté à ma situation" : "Votre première fiche"}</span>
    </div>
    <div className="grid gap-5 p-5 sm:grid-cols-[1fr_1.15fr] sm:p-7">
      <div>
        <p className="mb-3 text-sm font-bold text-orange-dark">DU CONCRET, SOUS VOS YEUX</p>
        <h3 className="mb-4 text-[1.4rem]">{av ? "Vos informations connues. Vos points à vérifier." : plan ? "Votre situation devient un ordre de préparation." : "Une inquiétude devient une question claire."}</h3>
        <p className="text-[1rem]">{av ? "Repérez les documents manquants et préparez votre demande à l’assureur, sans modifier un contrat à l’aveugle." : "Vous n’avez pas besoin de tout savoir. Vous avez besoin de distinguer ce que vous savez de ce qu’il faut faire confirmer."}</p>
        <p className="mt-4 text-sm">Supports numériques à lire et à imprimer chez vous. Aucun classeur physique expédié.</p>
      </div>
      <div className="border border-grey-line bg-white p-5">
        <p className="mb-1 text-xs font-bold uppercase tracking-widest text-text-soft">Cas guidé · Claire et Marc</p>
        <h3 className="mb-4 border-b-2 border-blue pb-3 text-[1.15rem]">{av ? "Préparer notre demande à l’assureur" : "Notre dossier, en une page"}</h3>
        <dl className="space-y-4 text-sm">
          <div><dt className="font-bold text-blue">Notre priorité</dt><dd>{av ? "Retrouver les clauses bénéficiaires en vigueur." : "Comprendre comment chacun pourrait rester dans le logement."}</dd></div>
          <div><dt className="font-bold text-blue">À retrouver</dt><dd>{av ? "La copie du contrat et la confirmation écrite de l’assureur." : "Le régime matrimonial et les dispositions entre époux."}</dd></div>
          <div className="border-l-4 border-orange bg-grey-bg p-3"><dt className="font-bold text-blue">La prochaine question</dt><dd>{av ? "Pouvez-vous nous transmettre la clause actuellement enregistrée ?" : "Quels seraient les droits de chacun au premier décès ?"}</dd></div>
        </dl>
      </div>
    </div>
    <figcaption className="border-t border-grey-line px-5 py-4 text-sm">
      Cas illustratif avec hypothèses visibles.{" "}
      Les supports complets et leur mode d’emploi sont réservés à votre achat.
    </figcaption>
  </figure>;
}
