import type { Metadata } from "next";
import { BRAND, CONTACT_EMAIL, LEGAL, SITE_URL } from "@/lib/config";
import { metadataPublique } from "@/lib/seo";

export const metadata: Metadata = metadataPublique(
  "/mentions-legales",
  "Mentions légales",
  "Éditeur du site Héritage Intact, hébergement, nature des contenus et propriété intellectuelle.",
);

export default function MentionsLegales() {
  return (
    <>
      <h1>Mentions légales</h1>
      <p>Dernière mise à jour : {LEGAL.updatedAt}</p>

      <h2>Éditeur du site</h2>
      <p>
        Le site {SITE_URL.replace(/^https?:\/\//, "")} est édité par {LEGAL.operatorName},{" "}
        {LEGAL.legalForm}, exerçant sous le nom commercial « {BRAND} ».
      </p>
      <ul>
        <li>SIRET : {LEGAL.siret}</li>
        <li>SIREN : {LEGAL.siren}</li>
        <li>{LEGAL.registration}</li>
        <li>Siège : {LEGAL.address}</li>
        <li>Directeur de la publication : {LEGAL.operatorName}</li>
        <li>Contact : {CONTACT_EMAIL}</li>
        <li>{LEGAL.vatNotice}</li>
      </ul>

      <h2>Hébergement</h2>
      <p>Vercel Inc., 440 N Barranca Ave #4133, Covina, CA 91723, États-Unis. Site : vercel.com</p>

      <h2>Nature du contenu</h2>
      <p>
        {BRAND} propose des contenus pédagogiques d&apos;information générale sur la transmission de
        patrimoine en France. Ces contenus ne constituent ni une consultation juridique au sens de
        la loi n°71-1130 du 31 décembre 1971, ni un conseil fiscal, financier ou en investissement
        personnalisé, ni une activité d&apos;intermédiation en assurance. Ils ne se substituent pas
        à l&apos;intervention d&apos;un notaire, d&apos;un avocat ou d&apos;un conseiller habilité.
      </p>

      <h2>Propriété intellectuelle</h2>
      <p>
        L&apos;ensemble des contenus (textes, vidéos, documents, outils) est protégé par le droit
        d&apos;auteur. Toute reproduction ou diffusion sans autorisation est interdite.
      </p>

      <h2>Médiation de la consommation</h2>
      <p>
        Conformément aux articles L611-1 et R612-1 du code de la consommation, en cas de litige non
        résolu après une réclamation préalable auprès de notre service client, le consommateur peut
        recourir gratuitement au service de médiation suivant :
      </p>
      <ul>
        <li>{LEGAL.mediator.name}</li>
        <li>Adresse : {LEGAL.mediator.address}</li>
        <li>Téléphone : {LEGAL.mediator.phone}</li>
        <li>
          Email : <a href={`mailto:${LEGAL.mediator.email}`}>{LEGAL.mediator.email}</a>
        </li>
        <li>
          Déclarer un litige :{" "}
          <a href={LEGAL.mediator.url} target="_blank" rel="noopener noreferrer">
            {LEGAL.mediator.url}
          </a>
        </li>
      </ul>

      <h2>Indépendance vis-à-vis des plateformes</h2>
      <p>
        Ce site n&apos;est pas affilié à Facebook, Instagram ou Meta Platforms Inc., et n&apos;est
        en aucune façon approuvé, administré ou sponsorisé par eux.
      </p>
    </>
  );
}
