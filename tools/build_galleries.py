#!/usr/bin/env python3
"""Copy project photos from the Singbuild archive into web-ready galleries.

Usage:
    python tools/build_galleries.py

For each project it takes the photos from the archive's "Completion Photos" /
"Photos" folder, resizes them for the web (max 1600 px on the long side,
JPEG quality 82) and writes them into images/projects/<slug>/ as
01.jpg, 02.jpg, ... so the site's scrollable card galleries can use them.

Special cases (kept as close to "all photos in the folder" as practical):
  - Norodom Business Center: the photo archive holds ~38,000 photos (6.5 GB),
    far too many for a website. An even sample from the most recent month
    (2026/09) is used instead.
  - Fengfu: has no "Completion Photos"/"Photos" folder (SITE PHOTO folders
    are empty), so the project's 16 3D renders are used.
"""
import os
import re
import sys

from PIL import Image

ARCHIVE = r"D:\SingBuild's Document"
OUT_ROOT = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "images", "projects")

MAX_SIDE = 1600
QUALITY = 82
NBC_SAMPLE = 16

# slug -> (source folders, sample count or None for all,
#          explicit include list or None for every image found)
PROJECTS = {
    "norodom-business-center": ([r"1. Norodom Business Center\NBC Pan Pacific Hotel - Project Photo Archive - 25 Aug 2025 to 12 September 2026\2026\09 - September"], NBC_SAMPLE, None),
    "uvp2-retiling": ([r"2. UVP2 - Retilling Work\Completion Photos"], None, None),
    "uvp2-common-areas": ([r"3. UVP2 - Common Areas\Completion Photos"], None, None),
    "uvp2-swimming-pool": ([r"4. UVP2 - Swimming Pool\Completion Report\Photos"], None, None),
    # Curated set: excludes photos with people/clutter (08, 09, 11, 12, 16-19)
    # and burst duplicates (14, 15 are near-identical to 13).
    "singapore-airlines": ([r"6. Singapore Airlines Office\Completion Photos"], None, [
        "photo_1_2026-09-23_13-07-26.jpg",  # corridor to meeting rooms
        "photo_2_2026-09-23_13-07-26.jpg",  # corner meeting room, frosted glass
        "photo_3_2026-09-23_13-07-26.jpg",  # open office with meeting rooms
        "photo_4_2026-09-23_13-07-26.jpg",  # workstation rows
        "photo_5_2026-09-23_13-07-26.jpg",  # hallway, marble floor
        "photo_6_2026-09-23_13-07-26.jpg",  # reception counter, green wall
        "photo_7_2026-09-23_13-07-26.jpg",  # reception, SIA branding
        "photo_10_2026-09-23_13-07-26.jpg",  # locker wall
        "photo_13_2026-09-23_13-07-26.jpg",  # wide open office
        "photo_20_2026-09-23_13-07-26.jpg",  # pantry, blue joinery
    ]),
    "fengfu": ([r"8. Fengfu\Drawing List\Shop Drawing\Shop Drawing\DWG\As of 4.28.25\RENDER\08.11.24",
                r"8. Fengfu\Drawing List\Shop Drawing\Shop Drawing\DWG\As of 4.28.25\RENDER\18mar25"], None, None),
    "kfk-kmall2": ([r"10. KFK - KMALL 2\Completion Photos"], None, None),
    "uvp2-penthouse-p5": ([r"11. UVP2 - Penthouse P5\Completion Photos"], None, None),
}

IMG_RE = re.compile(r"\.(jpe?g|png)$", re.IGNORECASE)


def collect_images(folder):
    files = []
    for name in sorted(os.listdir(folder)):
        if IMG_RE.search(name):
            files.append(os.path.join(folder, name))
    return files


def save_web_image(src, dst):
    with Image.open(src) as im:
        im = im.convert("RGB")
        w, h = im.size
        long_side = max(w, h)
        if long_side > MAX_SIDE:
            scale = MAX_SIDE / long_side
            im = im.resize((max(1, round(w * scale)), max(1, round(h * scale))), Image.LANCZOS)
        im.save(dst, "JPEG", quality=QUALITY, optimize=True)


def main():
    only = set(sys.argv[1:])
    total_files = 0
    total_bytes = 0
    for slug, (rel_folders, sample, include) in PROJECTS.items():
        if only and slug not in only:
            continue
        out_dir = os.path.join(OUT_ROOT, slug)
        os.makedirs(out_dir, exist_ok=True)

        sources = []
        for rel in rel_folders:
            folder = os.path.join(ARCHIVE, rel)
            if not os.path.isdir(folder):
                print(f"  !! missing source folder: {folder}")
                continue
            sources.extend(collect_images(folder))

        if include:
            wanted = {name.lower() for name in include}
            by_name = {os.path.basename(p).lower(): p for p in sources}
            missing = wanted - set(by_name)
            if missing:
                print(f"  !! include list not found for {slug}: {sorted(missing)}")
            sources = [by_name[name.lower()] for name in include if name.lower() in by_name]

        if not sources:
            print(f"  !! no images found for {slug}")
            continue

        if sample and len(sources) > sample:
            step = len(sources) / sample
            sources = [sources[min(len(sources) - 1, int(i * step))] for i in range(sample)]

        for old in os.listdir(out_dir):
            if IMG_RE.search(old):
                os.remove(os.path.join(out_dir, old))

        for idx, src in enumerate(sources, 1):
            dst = os.path.join(out_dir, f"{idx:02d}.jpg")
            save_web_image(src, dst)
            total_files += 1
            total_bytes += os.path.getsize(dst)

        print(f"{slug}: {len(sources)} photos -> {out_dir}")

    print(f"\nDone. {total_files} photos, {total_bytes / (1024 * 1024):.1f} MB total.")


if __name__ == "__main__":
    sys.exit(main())
