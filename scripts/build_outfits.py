"""Assemble the 15 complete outfit SVGs (5 temperature bands x 3 variants) from nonemo's pack.

Run from the project root:  python scripts/build_outfits.py
Writes assets/outfits/<band>-<variant>.svg. Layer order and piece positions follow
assets/instruction.png; positions are in the pack's native units (head is 145 x 143).
"""
import re
from pathlib import Path

PACK = Path("assets/SVG")
OUT = Path("assets/outfits")

SKIN = "tint_2"
FACE = "cute"
# Cold swaps the face (instead of adding gear): scrunched closed eyes + clenched teeth = shivering.
COLD_FACE_PARTS = ("faces/parts/eyes/closed.svg", "faces/parts/mouth/teeth.svg")
HAIR_FRONT, HAIR_BACK = "regular.black", "short.black"

# (shirt style, shirt color, sleeve, pants) per band and variant. sleeve = None means sleeveless.
# Coverage ladder: Hot sleeveless/short bottoms -> Cold long sleeves/long pants in dark colors,
# plus a shivering face for Cold (see COLD_FACE_PARTS).
OUTFITS = {
    "hot": [
        ("trousers", "orange", None, "shorts"),
        ("dress", "red", None, "naked"),
        ("trousers", "white", None, "shorts"),
    ],
    "warm": [
        ("trousers", "blue", "short", "shorts"),
        ("dress", "green", "short", "shorts"),
        ("trousers", "violet", "short", "shorts"),
    ],
    "mild": [
        ("trousers", "green", "short", "pants"),
        ("dress", "orange", "short", "pants"),
        ("trousers", "red", "short", "pants"),
    ],
    "cool": [
        ("trousers", "blue", "long", "pants"),
        ("dress", "red", "long", "pants"),
        ("trousers", "green", "long", "pants"),
    ],
    "cold": [
        ("trousers", "black", "long", "pants"),
        ("dress", "black", "long", "pants"),
        ("dress", "violet", "long", "pants"),
    ],
}

# The pack names the violet shirts "violet" but the matching sleeves "purple".
SLEEVE_COLOR = {"violet": "purple"}

VIEW_W, VIEW_H = 145, 166


def inner(path):
    """Contents of a piece SVG without its <svg> wrapper."""
    text = path.read_text(encoding="utf-8")
    assert "id=" not in text, f"{path} has ids that could collide when combined"
    return re.sub(r"^<svg[^>]*>|</svg>\s*$", "", text.strip(), flags=re.S).strip()


def piece(rel, x=0, y=0, rotate=None):
    transform = f"translate({x} {y})"
    if rotate:
        angle, cx, cy = rotate
        transform += f" rotate({angle} {cx} {cy})"
    return f'<g transform="{transform}">{inner(PACK / rel)}</g>'


def build(band, variant, shirt_style, color, sleeve, pants):
    shirt_w = 41 if shirt_style == "dress" else 35
    body_x, body_y = (145 - shirt_w) / 2, 115
    # Arms swing outward about their top-center (local x=6, y=0), like the pack's sample image.
    left_arm = (47, 116, (15, 6, 0))
    right_arm = (86, 116, (-15, 6, 0))

    layers = [
        piece(f"hairs/back/{HAIR_BACK}.svg"),
        piece(f"skin/{SKIN}/leg.svg", 57.5, 136),
        piece(f"skin/{SKIN}/leg.svg", 74.5, 136),
        piece(f"pants/{pants}.svg", 57.5, 136),
        piece(f"pants/{pants}.svg", 74.5, 136),
        piece(f"skin/{SKIN}/body.svg", 55, body_y),
        piece(f"shirts/{shirt_style}.{color}.svg", body_x, body_y),
    ]
    for x, y, rot in (left_arm, right_arm):
        layers.append(piece(f"skin/{SKIN}/arm.svg", x, y, rot))
        if sleeve:
            sleeve_color = SLEEVE_COLOR.get(color, color)
            layers.append(piece(f"sleeves/{sleeve_color}.{sleeve}.svg", x, y, rot))
    layers += [
        piece(f"skin/{SKIN}/head.svg"),
    ]
    if band == "cold":
        layers += [piece(part) for part in COLD_FACE_PARTS]
    else:
        layers.append(piece(f"faces/{FACE}.svg"))
    layers.append(piece(f"hairs/front/{HAIR_FRONT}.svg"))
    title = f"{band.title()} outfit {variant}: {color} {shirt_style}, {sleeve or 'no'} sleeves, {pants}"
    return (
        f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {VIEW_W} {VIEW_H}" '
        f'width="{VIEW_W}" height="{VIEW_H}" role="img" aria-label="{title}">\n'
        + "\n".join(layers)
        + "\n</svg>\n"
    )


def main():
    OUT.mkdir(parents=True, exist_ok=True)
    for band, variants in OUTFITS.items():
        for n, spec in enumerate(variants, start=1):
            (OUT / f"{band}-{n}.svg").write_text(build(band, n, *spec), encoding="utf-8")
    print(f"Wrote {sum(len(v) for v in OUTFITS.values())} outfits to {OUT}")


if __name__ == "__main__":
    main()
