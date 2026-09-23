import json
import os
import re

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
html = open(os.path.join(ROOT, "index.html"), encoding="utf-8").read()

print("em-dashes in html:", html.count("\u2014"))

ok = True
totals = dict(re.findall(r'data-gallery="([^"]+)" data-total="(\d+)"', html))
for slug, total in totals.items():
    folder = os.path.join(ROOT, "images", "projects", slug)
    files = [f for f in os.listdir(folder) if f.lower().endswith((".jpg", ".png"))]
    status = "OK" if int(total) == len(files) else "MISMATCH"
    if status != "OK":
        ok = False
    print(f"{slug}: data-total={total}, files={len(files)} {status}")

# manifest counts must match data-total too
manifest_path = os.path.join(ROOT, "js", "gallery-manifest.js")
if not os.path.isfile(manifest_path):
    ok = False
    print("MISSING FILE: js/gallery-manifest.js")
else:
    m = re.search(r"window\.GALLERY_FILES\s*=\s*(\{.*\});", open(manifest_path, encoding="utf-8").read(), re.S)
    manifest = json.loads(m.group(1)) if m else {}
    for slug, total in totals.items():
        n = len(manifest.get(slug, []))
        status = "OK" if int(total) == n else "MISMATCH"
        if status != "OK":
            ok = False
        print(f"manifest {slug}: data-total={total}, listed={n} {status}")

# every referenced cover image exists
for src in re.findall(r'src="(images/[^"]+)"', html):
    if not os.path.isfile(os.path.join(ROOT, src)):
        ok = False
        print("MISSING FILE:", src)

# skills sanity
print("skill groups:", html.count('class="skill-group reveal"'))
print("skill categories:", re.findall(r'skill-index">[ABC]</span>([^<]+)<', html))

# tag balance for key elements
for tag in ["section", "article", "div", "ul", "li", "dl"]:
    o = len(re.findall(rf"<{tag}[\s>]", html))
    c = len(re.findall(rf"</{tag}>", html))
    print(f"<{tag}>: open={o} close={c} {'OK' if o == c else 'UNBALANCED'}")
    if o != c:
        ok = False

print("RESULT:", "ALL OK" if ok else "PROBLEMS FOUND")
