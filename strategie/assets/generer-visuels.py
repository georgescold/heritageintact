#!/usr/bin/env python3
"""
Génère les images déclencheurs du projet via fal.ai (FLUX.2 Pro).

Règle de la charte (15-identite-visuelle.md) : aucun visage, aucune personne
identifiable, aucun texte dans l'image. Le texte est toujours posé par-dessus,
en HTML sur le site ou dans Affinity sur les créatives.

Usage :  python generer-visuels.py [nom-du-visuel ...]
         sans argument, génère tout ce qui manque.

⚠️ Chaque appel coûte. Le script ne régénère jamais un visuel déjà présent
   dans site/public/img — il faut le nommer explicitement pour l'écraser.

La clé est lue dans site/.env.local (jamais en dur, jamais commitée).

─── Sur le modèle ───────────────────────────────────────────────────────
`fal-ai/flux-2-pro` remplace `fal-ai/flux-pro/v1.1-ultra` : à prompt égal il
rend des intérieurs nettement plus crédibles (matière des tissus, désordre
plausible d'une table, lumière de fenêtre) et, surtout, il tient beaucoup
mieux une contrainte de cadrage — ce qui est vital ici, où la moitié des
prompts exige qu'aucun visage ne soit visible.

Il ne prend pas `aspect_ratio` mais `image_size: {width, height}` (jusqu'à
14142 px de côté). D'où la table TAILLES : on garde les ratios comme
vocabulaire, on les traduit en pixels. 1536 px de grand côté suffisent — la
plus grande image de la page est affichée sur 46 rem, soit 736 px CSS.

─── Sur les visages ─────────────────────────────────────────────────────
Demander « pas de visage » ne marche pas : le modèle entend « visage ». Ce
qui marche, c'est d'imposer la POSITION DE LA CAMÉRA — « shot from directly
behind her chair » — puis d'énumérer ce qui ne doit pas apparaître. Les
prompts ci-dessous sont écrits comme ça, et il faut le garder.
"""

import json
import re
import sys
import urllib.request
from pathlib import Path

# Le script vit dans site/strategie/assets/ ; la racine du site est trois
# niveaux au-dessus. C'est de la que viennent la cle et le dossier public.
SITE = Path(__file__).resolve().parent.parent.parent
ENV = SITE / ".env.local"
SORTIE = Path(__file__).resolve().parent
WEB = SITE / "public" / "img"

MODELE = "fal-ai/flux-2-pro"

# Le grand côté à 1536 px : au-delà on paie du pixel que personne ne voit.
TAILLES = {
    "1:1": (1280, 1280),
    "4:3": (1536, 1152),
    "16:9": (1536, 864),
    "21:9": (1536, 656),
}

# La queue de mots qui garantit l'absence de texte illisible.
PROPRE = (
    "Documentary editorial photography, natural available light, muted desaturated colours, "
    "realistic film grain, no text, no letters, no numbers, no logos, no watermark, "
    "no signage text."
)

# Idem, pour les plans où quelqu'un est présent mais ne doit jamais être reconnaissable.
SANS_VISAGE = (
    "ABSOLUTELY NO PART OF THE FACE IS VISIBLE: strict rear view, no profile, no cheek, "
    "no eye, no nose, no mouth, no chin, no reflection. "
)

VISUELS = {
    # ══ NATURES MORTES ════════════════════════════════════════════════
    # ── L'ouverture : la lettre qui tombe ──────────────────────────────
    "lettre-notaire": (
        "16:9",
        "Photorealistic close-up still life on a dark polished walnut table: an opened official "
        "letter on cream paper next to a torn brown envelope, a pair of reading glasses folded on "
        "top, and a black fountain pen. Soft directional window light from the left, deep shadows "
        "on the right side of the frame leaving empty dark space. Shallow depth of field. "
        "Sober, heavy, slightly ominous mood. The paper is blank and unreadable, blurred. "
        "No people, no faces. " + PROPRE,
    ),
    # ── La peur centrale : vendre la maison ────────────────────────────
    "maison-a-vendre": (
        "16:9",
        "Photorealistic documentary photograph of a modest French suburban house in red brick with "
        "white shutters closed, a small trimmed front garden and a low iron gate, seen from the "
        "pavement on a grey overcast afternoon. A blank white estate agent sign board on a wooden "
        "post stands in the left foreground, completely empty, no writing at all. Wet road, bare "
        "trees, melancholic and quiet. No people, no faces. " + PROPRE,
    ),
    # ── L'absence ──────────────────────────────────────────────────────
    "chaise-vide": (
        "16:9",
        "Photorealistic documentary photograph of a simple French family dining room: a long wooden "
        "table with a worn tablecloth, several chairs pushed in, and one empty wooden chair pulled "
        "slightly out at the head of the table. Warm late afternoon light falling through a lace "
        "curtain window. Dust in the air. Nostalgic, still, quiet. No people, no faces. " + PROPRE,
    ),
    # ── Le compte à rebours : les 3 dates ──────────────────────────────
    "calendrier": (
        "4:3",
        "Photorealistic close-up of an old paper wall calendar hanging on a plain painted wall in a "
        "French kitchen, one single date heavily circled in red ballpoint pen. The printed text and "
        "numbers are out of focus and completely illegible. Soft natural side light, shallow depth "
        "of field, muted colours, slight paper curl. No people, no faces. " + PROPRE,
    ),
    # ── L'ennemi : le courrier qui n'avertit jamais ────────────────────
    "boite-aux-lettres": (
        "16:9",
        "Photorealistic close-up documentary photograph of an old grey metal letterbox mounted on a "
        "low garden wall in front of a French house, crammed full of supermarket leaflets and junk "
        "mail, one folded flyer half falling out of the slot. All printed matter is blurred and "
        "completely illegible. Overcast grey morning, damp wall, a few dead leaves. Ordinary, "
        "mundane, slightly sad. No people, no faces. " + PROPRE,
    ),
    # ── L'AVANT : le chantier ──────────────────────────────────────────
    "avant-desordre": (
        "4:3",
        "Photorealistic overhead documentary photograph of a French kitchen table completely covered "
        "in a chaotic mess of unopened envelopes, bank statements, old cardboard folders with elastic "
        "bands, loose receipts, a cold cup of coffee and a cheap ballpoint pen. Overwhelming, "
        "disorganised, stressful. All paper is blurred and unreadable. Flat overcast daylight. "
        "No people, no faces. " + PROPRE,
    ),
    # ── L'APRÈS : le plan ──────────────────────────────────────────────
    "apres-classeur": (
        "4:3",
        "Photorealistic overhead documentary photograph of the same French kitchen table, now clear "
        "and tidy: one single navy blue ring binder closed in the centre, a small neat stack of "
        "sorted papers squared off beside it, a fountain pen laid parallel. Calm, controlled, "
        "resolved. All paper is blank and unreadable. Warm even daylight. "
        "No people, no faces. " + PROPRE,
    ),
    # ══ LES PERSONNAGES ═══════════════════════════════════════════════
    # Tous de dos, tous non identifiables. Voir la note « Sur les visages ».
    #
    # ── Jean-Pierre : l'échec, le matin où la lettre arrive ────────────
    "jean-pierre": (
        "4:3",
        "Photorealistic documentary photograph taken from behind: an elderly man in a grey wool "
        "cardigan sitting alone at a kitchen table in a modest French home, shoulders slightly "
        "slumped, an opened letter and a torn envelope on the table in front of him, a cold cup of "
        "coffee beside it. The camera stands directly behind his chair, slightly to the side. The "
        "back of his head and his grey hair are visible. Soft grey morning light through a window. "
        "Quiet, heavy, resigned. " + SANS_VISAGE + PROPRE,
    ),
    # ── Martine : le coût de l'attente, digne et non théâtral ──────────
    #
    # ⚠️ Trois versions ont été jetées avant celle-ci. Ce qui a fini par
    #    marcher : la table est COUVERTE des pièces d'une succession (le
    #    lecteur doit reconnaître la scène en une seconde), la pièce est
    #    habitée et non vide, et la lumière est abondante — la version
    #    sombre lisait comme du mélodrame, pas comme du solennel.
    "martine": (
        "4:3",
        "Medium close-up documentary photograph shot from behind and slightly above, over the "
        "shoulder of an elderly woman with short grey hair wearing a soft lilac knitted cardigan. "
        "She sits upright and very still at a dining table in a modest, lived-in French apartment. "
        "The table in front of her is covered with the paperwork of an estate: an open beige "
        "cardboard folder tied with elastic, a formal letter on cream paper, several sorted stacks "
        "of documents, a fountain pen and a pair of reading glasses set down. One of her hands "
        "rests flat and calmly on the letter. Her head is slightly bowed in thought. The room is "
        "warm and inhabited: an old dark wooden sideboard, a framed family photograph, lace "
        "curtains, a worn patterned tablecloth pushed aside. Soft abundant daylight from a window "
        "to the left, gentle shadows, nothing gloomy. Solemn, dignified, composed, grave without "
        "being theatrical. Shallow depth of field. " + SANS_VISAGE + PROPRE,
    ),
    # ── L'enfant qui gère, la nuit : le point de vue qu'on n'imagine jamais ──
    "enfant-qui-gere": (
        "4:3",
        "Photorealistic documentary photograph taken from behind: a person in their forties, seen "
        "only from the back, sitting at a kitchen table late at night under a single warm lamp, a "
        "mobile phone held to their ear with one hand, the other hand resting on a tall pile of "
        "documents and cardboard folders. The rest of the room is dark. The camera stands directly "
        "behind the chair. Tired, patient, alone. " + SANS_VISAGE + PROPRE,
    ),
    # ── Le rêve : la transmission ──────────────────────────────────────
    "mains-cles": (
        "16:9",
        "Photorealistic close-up documentary photograph: the weathered wrinkled hands of an elderly "
        "person passing an old brass set of house keys into the younger hands of an adult, above a "
        "dark wooden table. Only forearms and hands are visible, tightly cropped well below the "
        "shoulders, absolutely no face and no head in frame. Warm soft window light from the side, "
        "shallow depth of field, tender and quiet mood. " + PROPRE,
    ),
    # ── Le rêve, en ouverture de page : la chaîne de transmission ──────
    #
    # ⚠️ La première version disait « an elderly man … holding the hand of a
    #    small child » et le modèle a produit DEUX vieux messieurs. Il faut
    #    nommer le couple explicitement (« an elderly man and his wife »),
    #    sinon rien ne l'empêche de dupliquer la seule personne décrite.
    #
    #    C'est aussi le seul visuel de la page qui porte du titre par-dessus :
    #    il est recadré en 16/7 sur grand écran et le texte occupe la moitié
    #    GAUCHE. Les trois silhouettes doivent donc être à droite du centre et
    #    la gauche rester dégagée, sinon la phrase se pose sur un visage.
    "grand-pere-petits-enfants": (
        "16:9",
        "Candid documentary photograph taken from directly behind, at adult chest height: an "
        "elderly married couple in their seventies — a man in a pale short-sleeved shirt on the "
        "left and his wife in a light summer blouse and skirt on the right — walking slowly away "
        "from the camera down a gravel garden path. Between them, a small child of about four "
        "walks holding one hand of each, one little arm reaching up to the grandfather and the "
        "other up to the grandmother, so the three of them form an unbroken line. The child's feet "
        "are caught mid-step. At the end of the path, a modest old French country house with pale "
        "shutters, warm light on its facade. Late summer afternoon, low golden backlight coming "
        "through the trees behind the house, long soft shadows stretching towards the camera, dust "
        "and pollen in the air. The three figures are placed to the right of centre; the left "
        "third of the frame is open garden and shadow. Shot on an 85mm lens at f/2, natural light "
        "only, gentle lens flare, realistic skin and fabric texture, fine film grain, slight "
        "motion blur in the child's feet. Tender, hopeful, unposed, nothing sentimental. "
        + SANS_VISAGE
        + PROPRE,
    ),
}


def cle() -> str:
    txt = ENV.read_text(encoding="utf-8")
    m = re.search(r"^FAL_KEY=(.+)$", txt, re.M)
    if not m:
        sys.exit(f"FAL_KEY absente de {ENV}")
    return m.group(1).strip()


def generer(nom: str, ratio: str, prompt: str, key: str) -> None:
    largeur, hauteur = TAILLES[ratio]
    corps = json.dumps(
        {
            "prompt": prompt,
            "image_size": {"width": largeur, "height": hauteur},
            "num_images": 1,
            "output_format": "jpeg",
            "safety_tolerance": "5",
            "enable_safety_checker": False,
        }
    ).encode()
    req = urllib.request.Request(
        f"https://fal.run/{MODELE}",
        data=corps,
        headers={"Authorization": f"Key {key}", "Content-Type": "application/json"},
    )
    with urllib.request.urlopen(req, timeout=240) as r:
        data = json.load(r)
    url = data["images"][0]["url"]

    SORTIE.mkdir(parents=True, exist_ok=True)
    WEB.mkdir(parents=True, exist_ok=True)
    dest = SORTIE / f"trigger-{nom}.jpg"
    with urllib.request.urlopen(url, timeout=240) as r, open(dest, "wb") as f:
        f.write(r.read())

    # Le fichier servi au navigateur est recompressé : le JPEG sorti du
    # modèle pèse deux à trois fois trop lourd pour une connexion de campagne.
    try:
        from PIL import Image

        im = Image.open(dest).convert("RGB")
        im.save(WEB / f"{nom}.jpg", "JPEG", quality=86, optimize=True, progressive=True)
    except ImportError:
        (WEB / f"{nom}.jpg").write_bytes(dest.read_bytes())

    poids = (WEB / f"{nom}.jpg").stat().st_size // 1024
    print(f"  ok {nom}  {largeur}x{hauteur}  {poids} Ko")


def main() -> None:
    key = cle()
    demandes = sys.argv[1:]
    if not demandes:
        # Sans argument : seulement ce qui manque. Régénérer un visuel validé
        # se demande par son nom, sinon un lancement distrait coûte douze images
        # et en change une que le client avait approuvée.
        demandes = [n for n in VISUELS if not (WEB / f"{n}.jpg").exists()]
        if not demandes:
            print("Rien à faire : les douze visuels sont déjà là.")
            print("Pour en refaire un : python generer-visuels.py martine")
            return
    for nom in demandes:
        if nom not in VISUELS:
            print(f"  ! visuel inconnu : {nom}")
            continue
        ratio, prompt = VISUELS[nom]
        print(f"-> {nom} ({ratio})")
        try:
            generer(nom, ratio, prompt, key)
        except Exception as e:  # noqa: BLE001
            print(f"  X {nom} : {e}")


if __name__ == "__main__":
    main()
