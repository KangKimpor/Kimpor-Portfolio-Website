#!/usr/bin/env python3
"""Copy project photos from the Singbuild archive into web galleries.

Usage:
    python tools/build_galleries.py [slug ...]

For each project it takes the photos from the archive's "Completion Photos" /
"Photos" folder and writes them into images/projects/<slug>/ as 01.webp,
02.webp, ... Each photo is resized to fit 1600 px on the long edge and encoded
as WebP (tools/optimize_images.py does the encoding) so the page never ships
the multi-megabyte camera originals.

It also (re)writes js/gallery-manifest.js, which lists the exact gallery
filenames per project so script.js never has to guess file extensions.

Special cases (kept as close to "all photos in the folder" as practical):
  - Norodom Business Center: the photo archive holds ~38,000 photos (6.5 GB),
    far too many for a website. An even sample from the most recent month
    (2026/09) is used instead.
"""
import os
import re
import sys

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from optimize_images import GALLERY_MAX, GALLERY_QUALITY, encode, write_manifest  # noqa: E402

ARCHIVE = r"D:\SingBuild's Document"
REPO_ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT_ROOT = os.path.join(REPO_ROOT, "images", "projects")

NBC_SAMPLE = 16

# slug -> (source folders, sample count or None for all)
PROJECTS = {
    "norodom-business-center": ([r"1. Norodom Business Center\NBC Pan Pacific Hotel - Project Photo Archive - 25 Aug 2025 to 12 September 2026\2026\09 - September"], NBC_SAMPLE),
    "uvp2-retiling": ([r"2. UVP2 - Retilling Work\Completion Photos"], None),
    "uvp2-common-areas": ([r"3. UVP2 - Common Areas\Completion Photos"], None),
    "uvp2-swimming-pool": ([r"4. UVP2 - Swimming Pool\Completion Report\Photos"], None),
    "singapore-airlines": ([r"6. Singapore Airlines Office\Completion Photos"], None),
    "kfk-kmall2": ([r"10. KFK - KMALL 2\Completion Photos"], None),
    "uvp2-penthouse-p5": ([r"11. UVP2 - Penthouse P5\Completion Photos"], None),
}

IMG_RE = re.compile(r"\.(jpe?g|png|webp)$", re.IGNORECASE)


def natural_key(name):
    """Sort so embedded numbers compare numerically (photo_2 before photo_10)."""
    return [int(t) if t.isdigit() else t.lower() for t in re.split(r"(\d+)", name)]


def collect_images(folder):
    files = []
    for name in sorted(os.listdir(folder), key=natural_key):
        if IMG_RE.search(name):
            files.append(os.path.join(folder, name))
    return files


def main():
    only = set(sys.argv[1:])
    total_files = 0
    total_bytes = 0
    for slug, (rel_folders, sample) in PROJECTS.items():
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
            dst = os.path.join(out_dir, f"{idx:02d}.webp")
            _, before, after = encode(src, dst, quality=GALLERY_QUALITY, max_edge=GALLERY_MAX)
            total_files += 1
            total_bytes += after

        print(f"{slug}: {len(sources)} photos -> {out_dir}")

    write_manifest()
    print(f"\nDone. {total_files} photos, {total_bytes / (1024 * 1024):.1f} MB total.")


if __name__ == "__main__":
    sys.exit(main())
