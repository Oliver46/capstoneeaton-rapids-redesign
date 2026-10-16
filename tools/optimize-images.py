#!/usr/bin/env python3
"""
Capstone Family Practice: image builder.

Rebuilds every image the site uses from the full-quality sources in
assets/images/originals/, as AVIF + WebP (+ a JPEG/PNG fallback) at the sizes
the page requests, plus the app icons. Run it from the project root after
replacing a photo (keep the same file name):

    python3 tools/optimize-images.py

Requires Pillow 11+ with WebP and AVIF support:  pip install pillow numpy

Sources (assets/images/originals/)        Used for
    family.jpg                            Hero photo
    services-field.jpg                    Services background (light duotone)
    pam-becker.jpg                        Provider portrait
    waiting-room.webp                     New Patients photo
    contact-care.jpg                      FAQ background (light duotone)
    logo-capstone.png                     Logo
    icon-512.png                          Favicon and app icons

og-image.jpg (the link-preview image) is designed separately and not built here.
"""
from pathlib import Path

import numpy as np
from PIL import Image, ImageFilter, ImageOps

ROOT = Path(__file__).resolve().parent.parent
SRC = ROOT / "assets" / "images" / "originals"
OUT = ROOT / "assets" / "images"
ICONS = ROOT / "assets" / "icons"

AVIF_Q, WEBP_Q, JPEG_Q = 52, 74, 76      # tuned by eye: no visible artifacts at display size
CREAM_DUOTONE = dict(dark=(200, 170, 158), light=(251, 246, 239), gamma=0.9)

report = []


def source(name):
    return Image.open(SRC / name).convert("RGB")


def resize(img, width):
    """Scale down to `width` (never up)."""
    if img.width <= width:
        return img.copy()
    return img.resize((width, round(img.height * width / img.width)), Image.LANCZOS)


def save(img, name, fmt, folder=OUT):
    path = folder / name
    if fmt == "avif":
        img.save(path, "AVIF", quality=AVIF_Q, speed=4)
    elif fmt == "webp":
        img.save(path, "WEBP", quality=WEBP_Q, method=6)
    elif fmt == "jpg":
        img.convert("RGB").save(path, "JPEG", quality=JPEG_Q, optimize=True, progressive=True)
    elif fmt == "png":
        img.save(path, "PNG", optimize=True)
    report.append((path.relative_to(ROOT / "assets").as_posix(), path.stat().st_size))


def photo_set(img, stem, widths, fallbacks=()):
    """AVIF + WebP at every width; JPEG fallbacks given as (width, file name)."""
    for w in widths:
        small = resize(img, w)
        save(small, f"{stem}-{w}.avif", "avif")
        save(small, f"{stem}-{w}.webp", "webp")
    for w, name in fallbacks:
        save(resize(img, w), name, "jpg")


def duotone(img, dark, light, gamma=1.0, blur=0.8, size=(1600, 1067)):
    """Grayscale photo mapped between two colors (dark -> light), cropped to `size`."""
    g = ImageOps.fit(ImageOps.grayscale(img), size, Image.LANCZOS, centering=(0.5, 0.6))
    g = ImageOps.autocontrast(g.filter(ImageFilter.GaussianBlur(blur)), cutoff=1)
    a = (np.asarray(g).astype(float) / 255) ** gamma
    out = np.array(dark) * (1 - a[..., None]) + np.array(light) * a[..., None]
    return Image.fromarray(out.clip(0, 255).astype("uint8"))


def background_set(img, stem):
    """Full-width background: 1600 px (AVIF/WebP/JPEG) + 800 px (AVIF/WebP)."""
    for fmt in ("avif", "webp", "jpg"):
        save(img, f"{stem}.{fmt}", fmt)
    small = resize(img, 800)
    save(small, f"{stem}-800.avif", "avif")
    save(small, f"{stem}-800.webp", "webp")


def main():
    # Hero: the practice's family photo (only a 640 px source exists)
    photo_set(source("family.jpg"), "family", [480, 640], [(480, "family-480.jpg"), (640, "family-640.jpg")])

    # Services background: light cream duotone of a family walking in a field
    background_set(duotone(source("services-field.jpg"), **CREAM_DUOTONE), "services-bg")

    # Provider portrait (298 px source: never upscaled)
    pam = source("pam-becker.jpg")
    for fmt in ("avif", "webp", "jpg"):
        save(pam, f"pam-becker.{fmt}", fmt)

    # New Patients: waiting room
    photo_set(source("waiting-room.webp"), "waiting-room", [800, 1264], [(1264, "waiting-room.jpeg")])

    # FAQ background: stronger duotone of two people holding hands, so the photo reads
    background_set(duotone(source("contact-care.jpg"), dark=(118, 74, 62), light=(248, 239, 229), gamma=1.25, blur=0.4), "faq-bg")

    # Logo (transparent): 240 and 480 px
    logo = Image.open(SRC / "logo-capstone.png").convert("RGBA")
    for width, suffix in [(240, "-240"), (480, "")]:
        img = resize(logo, width)
        for fmt in ("avif", "webp", "png"):
            save(img, f"logo-capstone{suffix}.{fmt}", fmt)

    # Favicon and app icons: 256-color PNGs look identical and are much smaller
    icon = Image.open(SRC / "icon-512.png").convert("RGB")
    for size, name in [(512, "icon-512.png"), (192, "icon-192.png"), (180, "apple-touch-icon.png"), (32, "favicon-32.png")]:
        small = icon.resize((size, size), Image.LANCZOS).quantize(colors=256, method=Image.MEDIANCUT, dither=Image.Dither.NONE)
        small.save(ICONS / name, "PNG", optimize=True)
        report.append(("icons/" + name, (ICONS / name).stat().st_size))
    icon.save(ICONS / "favicon.ico", sizes=[(16, 16), (32, 32), (48, 48)])
    report.append(("icons/favicon.ico", (ICONS / "favicon.ico").stat().st_size))

    total = 0
    for name, size in report:
        total += size
        print(f"{size / 1024:8.1f} KB  {name}")
    print(f"{total / 1024:8.1f} KB  total written")


if __name__ == "__main__":
    main()
