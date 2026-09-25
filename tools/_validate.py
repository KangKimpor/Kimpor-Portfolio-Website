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
    files = [f for f in os.listdir(folder) if f.lower().endswith((".jpg", ".png", ".webp"))]
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
for src in re.findall(r'src="(images/[^"?]+)(?:\?[^"]*)?"', html):
    if not os.path.isfile(os.path.join(ROOT, src)):
        ok = False
        print("MISSING FILE:", src)

# tag balance for key elements
for tag in ["section", "article", "div", "ul", "li", "dl"]:
    o = len(re.findall(rf"<{tag}[\s>]", html))
    c = len(re.findall(rf"</{tag}>", html))
    print(f"<{tag}>: open={o} close={c} {'OK' if o == c else 'UNBALANCED'}")
    if o != c:
        ok = False

# ---- structural checks for the redesigned single page ----
ids = set(re.findall(r'\sid="([^"]+)"', html))

for href in sorted(set(re.findall(r'href="#([^"]+)"', html))):
    if href not in ids:
        ok = False
        print("MISSING ANCHOR TARGET:", href)

symbols = set(re.findall(r'<symbol id="([^"]+)"', html))
for ref in sorted(set(re.findall(r'<use href="#([^"]+)"', html))):
    if ref not in symbols:
        ok = False
        print("MISSING SVG SYMBOL:", ref)

for asset in sorted(set(re.findall(r'(?:src|href)="((?:css|js|images)/[^"?]+)(?:\?[^"]*)?"', html))):
    if not os.path.isfile(os.path.join(ROOT, asset)):
        ok = False
        print("MISSING ASSET:", asset)

h1_count = len(re.findall(r"<h1[\s>]", html))
if h1_count != 1:
    ok = False
    print("H1 COUNT:", h1_count)

label_targets = set(re.findall(r'<label for="([^"]+)"', html))
for target in sorted(label_targets):
    if target not in ids:
        ok = False
        print("LABEL WITHOUT FIELD:", target)

for control in re.findall(r"<(?:input|select|textarea)\b[^>]*>", html):
    if ' id="' not in control:
        ok = False
        print("FORM CONTROL WITHOUT ID:", control[:70])
    if ' name="' not in control:
        ok = False
        print("FORM CONTROL WITHOUT NAME:", control[:70])

css = open(os.path.join(ROOT, "css", "style.css"), encoding="utf-8").read()
for hook in ["gallery-track", "gal-btn", "gal-prev", "gal-next", "gal-count", "is-open",
             "is-hidden", "is-active", "is-empty", "menu-open", "lb-open", "card-media",
             "project-card"]:
    if "." + hook not in css:
        ok = False
        print("CSS MISSING HOOK:", hook)

js = open(os.path.join(ROOT, "js", "script.js"), encoding="utf-8").read()
for el_id in sorted(set(re.findall(r"getElementById\('([^']+)'\)", js))):
    if el_id not in ids:
        ok = False
        print("JS ID NOT IN HTML:", el_id)
for selector in ["#projectsGrid", ".filter-btn", ".card-media", ".portrait-frame", ".timeline-col", "[data-nav]"]:
    if selector.startswith("#"):
        if selector[1:] not in ids:
            ok = False
            print("JS SELECTOR ID NOT IN HTML:", selector)
    else:
        needle = selector.strip(".[]")
        if needle not in html:
            ok = False
            print("JS SELECTOR NOT IN HTML:", selector)

css_text = re.sub(r"/\*.*?\*/", "", css, flags=re.S)
if css_text.count("{") != css_text.count("}"):
    ok = False
    print("CSS BRACES UNBALANCED:", css_text.count("{"), css_text.count("}"))

root_block = re.search(r":root\s*\{(.*?)\n\}", css_text, re.S)
defined = set(re.findall(r"(--[\w-]+)\s*:", root_block.group(1) if root_block else ""))
for name in sorted(set(re.findall(r"var\(\s*(--[\w-]+)", css_text)) - defined):
    ok = False
    print("UNDEFINED CSS TOKEN:", name)

print("RESULT:", "ALL OK" if ok else "PROBLEMS FOUND")
