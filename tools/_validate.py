import os
import re

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
html = open(os.path.join(ROOT, "index.html"), encoding="utf-8").read()

print("em-dashes in html:", html.count("\u2014"))

ok = True
for slug, total in re.findall(r'data-gallery="([^"]+)" data-total="(\d+)"', html):
    folder = os.path.join(ROOT, "images", "projects", slug)
    files = [f for f in os.listdir(folder) if f.lower().endswith(".jpg")]
    status = "OK" if int(total) == len(files) else "MISMATCH"
    if status != "OK":
        ok = False
    print(f"{slug}: data-total={total}, files={len(files)} {status}")

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
