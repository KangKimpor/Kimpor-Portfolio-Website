#!/usr/bin/env python3
"""Cut the studio-white background out of the portrait photo.

Usage:
    python tools/cutout.py [src] [dst] [preview]

Defaults:
    src     = images/portrait.jpg          (or .png / .jpeg)
    dst     = images/portrait-cutout.png
    preview = images/_portrait-preview.png (cutout composited on navy)

Method: the white background is removed by flood-filling inward from the
image border across near-white, low-chroma pixels. Because only the
border-connected region is cleared, white clothing inside the subject
(white shirt, collar) is preserved. The mask is then grown 2 px to remove
the light halo, feathered 0.6 px for a soft edge, and the result is
auto-cropped to the subject with a small margin.
"""
import os
import sys
from collections import deque

import numpy as np
from PIL import Image, ImageFilter

WHITE_MIN = 243    # every channel must be at least this bright
CHROMA_MAX = 20    # max channel spread allowed for "white"


def border_connected_white(a):
    """Boolean mask of near-white pixels reachable from the image border."""
    h, w = a.shape[0], a.shape[1]
    mask = (a.min(axis=2) >= WHITE_MIN) & ((a.max(axis=2) - a.min(axis=2)) <= CHROMA_MAX)
    seen = np.zeros((h, w), dtype=bool)
    queue = deque()

    for x in range(w):
        for y in (0, h - 1):
            if mask[y, x] and not seen[y, x]:
                seen[y, x] = True
                queue.append((y, x))
    for y in range(h):
        for x in (0, w - 1):
            if mask[y, x] and not seen[y, x]:
                seen[y, x] = True
                queue.append((y, x))

    while queue:
        y, x = queue.popleft()
        if y > 0 and mask[y - 1, x] and not seen[y - 1, x]:
            seen[y - 1, x] = True; queue.append((y - 1, x))
        if y < h - 1 and mask[y + 1, x] and not seen[y + 1, x]:
            seen[y + 1, x] = True; queue.append((y + 1, x))
        if x > 0 and mask[y, x - 1] and not seen[y, x - 1]:
            seen[y, x - 1] = True; queue.append((y, x - 1))
        if x < w - 1 and mask[y, x + 1] and not seen[y, x + 1]:
            seen[y, x + 1] = True; queue.append((y, x + 1))

    return seen


def main():
    src = sys.argv[1] if len(sys.argv) > 1 else os.path.join('images', 'portrait.jpg')
    dst = sys.argv[2] if len(sys.argv) > 2 else os.path.join('images', 'portrait-cutout.png')
    prev = sys.argv[3] if len(sys.argv) > 3 else os.path.join('images', '_portrait-preview.png')

    if not os.path.exists(src):
        print('ERROR: source photo not found:', src)
        raise SystemExit(1)

    im = Image.open(src).convert('RGB')
    a = np.asarray(im).astype(np.int16)
    bg = border_connected_white(a)

    bg_img = Image.fromarray((bg * 255).astype(np.uint8), 'L')
    bg_img = bg_img.filter(ImageFilter.MaxFilter(5))       # grow 2 px -> eats halo
    alpha = bg_img.point(lambda v: 255 - v)                # invert -> subject
    alpha = alpha.filter(ImageFilter.GaussianBlur(0.6))    # feathered edge

    out = im.convert('RGBA')
    out.putalpha(alpha)

    box = alpha.getbbox()
    if box:
        pad = 8
        box = (max(box[0] - pad, 0), max(box[1] - pad, 0),
               min(box[2] + pad, out.width), min(box[3] + pad, out.height))
        out = out.crop(box)
    out.save(dst)

    canvas = Image.new('RGB', out.size, (13, 40, 65))
    canvas.paste(out, mask=out.split()[3])
    canvas.save(prev)

    total = out.width * out.height
    clear = int((np.asarray(out.split()[3]) == 0).sum())
    print('saved      :', dst)
    print('preview    :', prev)
    print('source     :', im.size, '-> cutout:', out.size)
    print('transparent: %.1f%% of pixels' % (100.0 * clear / total))


if __name__ == '__main__':
    main()
