"use client";

import { useRef, useState } from "react";

const dureeAffichee = (secondes: number) => {
  if (!Number.isFinite(secondes)) return "0:00";
  const minutes = Math.floor(secondes / 60);
  return `${minutes}:${String(Math.floor(secondes % 60)).padStart(2, "0")}`;
};

/**
 * Courbe de type VSL : la barre avance vite au début puis ralentit
 * progressivement. La vidéo reste toujours lue à vitesse réelle.
 */
const progressionVisuelle = (temps: number, duree: number) => {
  if (!Number.isFinite(duree) || duree <= 0) return 0;
  const reel = Math.min(1, Math.max(0, temps / duree));
  return (1 - Math.pow(1 - reel, 2)) * 100;
};

/** VSL auto-hébergée avec contrôles non navigables et progression visuelle accélérée. */
export function VslPresentation() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const cadreRef = useRef<HTMLDivElement>(null);
  const dernierTempsLu = useRef(0);
  const repositionnementAutorise = useRef(false);
  const [lecture, setLecture] = useState(false);
  const [demarree, setDemarree] = useState(false);
  const [muet, setMuet] = useState(false);
  const [temps, setTemps] = useState(0);
  const [duree, setDuree] = useState(313.578);

  const basculerLecture = async () => {
    const video = videoRef.current;
    if (!video) return;
    if (video.ended) {
      repositionnementAutorise.current = true;
      dernierTempsLu.current = 0;
      video.currentTime = 0;
    }
    if (video.paused) {
      try {
        await video.play();
      } catch {
        setLecture(false);
      }
    } else {
      video.pause();
    }
  };

  const basculerSon = () => {
    const video = videoRef.current;
    if (!video) return;
    video.muted = !video.muted;
    setMuet(video.muted);
  };

  const afficherPleinEcran = async () => {
    const cadre = cadreRef.current;
    const video = videoRef.current as
      | (HTMLVideoElement & { webkitEnterFullscreen?: () => void })
      | null;
    if (document.fullscreenElement) {
      await document.exitFullscreen();
    } else if (cadre?.requestFullscreen) {
      await cadre.requestFullscreen();
    } else {
      video?.webkitEnterFullscreen?.();
    }
  };

  const empecherLeSaut = () => {
    const video = videoRef.current;
    if (!video || repositionnementAutorise.current) return;
    if (Math.abs(video.currentTime - dernierTempsLu.current) > 0.35) {
      repositionnementAutorise.current = true;
      video.currentTime = dernierTempsLu.current;
    }
  };

  const progressionReelle =
    duree > 0 ? Math.min(100, Math.max(0, (temps / duree) * 100)) : 0;
  const progression = progressionVisuelle(temps, duree);

  return (
    <section id="presentation-video" aria-label="Présentation vidéo" className="my-6">
      <div
        ref={cadreRef}
        className="relative aspect-video w-full overflow-hidden border-2 border-blue bg-black shadow-lg"
      >
        <video
          ref={videoRef}
          className="h-full w-full"
          playsInline
          preload="metadata"
          poster="/img/vsl-heritage-intact-thumbnail-v3.jpg"
          aria-label="Les 7 erreurs qui offrent votre héritage à l’État"
          controlsList="nodownload noplaybackrate noremoteplayback"
          disablePictureInPicture
          disableRemotePlayback
          tabIndex={-1}
          onContextMenu={(event) => event.preventDefault()}
          onLoadedMetadata={(event) => setDuree(event.currentTarget.duration)}
          onPlay={() => {
            setLecture(true);
            setDemarree(true);
          }}
          onPause={() => setLecture(false)}
          onEnded={() => {
            setLecture(false);
            setTemps(duree);
            dernierTempsLu.current = duree;
          }}
          onTimeUpdate={(event) => {
            const nouveauTemps = event.currentTarget.currentTime;
            if (!event.currentTarget.seeking) {
              dernierTempsLu.current = Math.max(dernierTempsLu.current, nouveauTemps);
              setTemps(nouveauTemps);
            }
          }}
          onSeeking={empecherLeSaut}
          onSeeked={() => {
            repositionnementAutorise.current = false;
            const video = videoRef.current;
            if (video) setTemps(video.currentTime);
          }}
          onRateChange={(event) => {
            if (event.currentTarget.playbackRate !== 1) {
              event.currentTarget.playbackRate = 1;
            }
          }}
        >
          <source src="/videos/vsl-heritage-intact.mp4" type="video/mp4" />
          Votre navigateur ne permet pas de lire cette vidéo.
        </video>

        <button
          type="button"
          onClick={() => void basculerLecture()}
          aria-label={lecture ? "Mettre la vidéo en pause" : "Lire la vidéo"}
          className="absolute inset-0 z-10 flex cursor-pointer items-center justify-center focus-visible:outline-4 focus-visible:outline-offset-[-4px] focus-visible:outline-orange"
        >
          {demarree && !lecture && (
            <span
              aria-hidden
              className="mx-auto flex h-16 w-16 items-center justify-center rounded-full border-2 border-white bg-orange/95 pl-1 text-2xl text-white shadow-lg"
            >
              ▶
            </span>
          )}
        </button>

        <div className="pointer-events-none absolute inset-x-0 bottom-0 z-20 bg-gradient-to-t from-black/90 via-black/55 to-transparent px-3 pb-2 pt-8">
          <div
            role="progressbar"
            aria-label="Progression réelle de la vidéo"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={Math.round(progressionReelle)}
            aria-valuetext={`${dureeAffichee(temps)} sur ${dureeAffichee(duree)}`}
            data-progression-visuelle="acceleree-puis-ralentie"
            className="h-1.5 overflow-hidden rounded-full bg-white/30"
          >
            <div
              className="h-full rounded-full bg-orange transition-[width] duration-300 ease-linear"
              style={{ width: `${progression}%` }}
            />
          </div>
          <div className="pointer-events-auto mt-2 flex items-center gap-2 text-white">
            <button
              type="button"
              onClick={() => void basculerLecture()}
              aria-label={lecture ? "Pause" : "Lecture"}
              className="flex min-h-11 min-w-11 items-center justify-center rounded-sm bg-white/10 font-bold hover:bg-white/20 focus-visible:outline-2 focus-visible:outline-white"
            >
              <span aria-hidden>{lecture ? "❚❚" : "▶"}</span>
            </button>
            <button
              type="button"
              onClick={basculerSon}
              aria-label={muet ? "Activer le son" : "Couper le son"}
              className="flex min-h-11 min-w-11 items-center justify-center rounded-sm bg-white/10 hover:bg-white/20 focus-visible:outline-2 focus-visible:outline-white"
            >
              <span aria-hidden>{muet ? "🔇" : "🔊"}</span>
            </button>
            <span className="text-xs tabular-nums text-white/90">
              {dureeAffichee(temps)}
            </span>
            <button
              type="button"
              onClick={() => void afficherPleinEcran()}
              aria-label="Afficher en plein écran"
              className="ml-auto flex min-h-11 min-w-11 items-center justify-center rounded-sm bg-white/10 text-lg hover:bg-white/20 focus-visible:outline-2 focus-visible:outline-white"
            >
              <span aria-hidden>⛶</span>
            </button>
          </div>
        </div>
      </div>
      <p className="mt-2 text-center text-sm text-text-soft">
        Présentation complète · 5 min 14 · Activez le son
      </p>
    </section>
  );
}
