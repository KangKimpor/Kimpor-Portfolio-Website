# Kimpor Kang | Construction Portfolio Website

A clean, single-page portfolio site built with plain HTML, CSS and vanilla
JavaScript. No build tools, no frameworks, no dependencies to install.

## How to open / run

**Option A: just open it**
Double-click `index.html`. It runs in any modern browser as-is.
(The Google Fonts load from a CDN; offline, the site falls back to
system fonts and still looks fine.)

**Option B: local server (nicer for testing)**
From this folder:

```
python -m http.server 8000
```

then open <http://localhost:8000>.

## Folder structure

```
Kimpor-Portfolio-Website/
├── index.html                 ← the whole site (single page)
├── css/
│   └── style.css              ← all styling (colors, layout, responsive)
├── js/
│   └── script.js              ← mobile nav, scroll reveal, status filter
├── images/
│   └── projects/              ← 15 project photos (already filled)
└── README.md                  ← this file
```

## Project photos

All 15 cards already show a real photo copied from the project archive.
To swap any card photo, replace the matching JPG inside
`images/projects/` keeping the **exact same filename**. Landscape
orientation (~16:10) works best. If a file is missing, a blueprint-style
placeholder shows instead.

The photo sources used are listed in the mapping table below, so you can
pick different shots from the same folders at any time.
## Where to fill in your contact details

In `index.html`, find the **Contact** section (search for `id="contact"`)
and replace the three placeholders:

- `[Add your email]`: also update the `href="mailto:..."` next to it
- `[Add your phone]`: also update the `href="tel:..."`
- `[Add your LinkedIn URL]`: replace both the link text and the `href`

## Changing the accent color

In `css/style.css`, edit the three variables at the top:

```css
--accent: #d97706;        /* amber (current) */
--accent-strong: #b45309; /* darker hover shade */
--accent-soft: #fdf1de;   /* pale tint */
```

Steel blue alternative: `#2f6f8f` / `#255a75` / `#e3eef4`.
Safety-orange alternative: `#e8552d` / `#c7431f` / `#fde9e2`.

## Project cards: source folders and photo map

Every card on the site was written from the real archive at
`D:\SingBuild's Document`. The third column shows where the current card
photo came from. Nothing in the archive was moved or modified; files were
only read and copied.

| Card | Image filename | Current photo source |
|---|---|---|
| Norodom Business Center - Pan Pacific Hotel | `nbc-pan-pacific.jpg` | `1. Norodom Business Center\NBC Pan Pacific Hotel - Project Photo Archive...\2026\07 - July` |
| UVP2 - Penthouse P5 | `uvp2-penthouse-p5.jpg` | `11. UVP2 - Penthouse P5\Progress Report\Weekly Report\Weekly Progress Report No.18\Photos` |
| Fengfu Office | `fengfu-office.jpg` | `8. Fengfu\Drawing List\Shop Drawing\Shop Drawing\Scene 1.png` (3D render) |
| NoreaCove - SuperVilla 03 | `noreacove-supervilla03.jpg` | Extracted from `12. NoreaCove\Weekly Report (SuperVilla 03)\Weekly Progress Report No.05` (.pptx) |
| Kungfu Kitchen - K-Mall 2 | `kungfu-kitchen-kmall2.jpg` | `10. KFK - KMALL 2\Progress Report (DR, WR, MR)\2. WEEKLY REPORT\Weekly Progress Report No.02\Photos` |
| UVP2 - Common Areas | `uvp2-common-areas.jpg` | `3. UVP2 - Common Areas\Completion Photos\Picture10.png` |
| UVP2 - Swimming Pool | `uvp2-swimming-pool.jpg` | `4. UVP2 - Swimming Pool\Completion Report\Photos\IMG_0747.JPG` |
| UVP2 - Re-tiling Works | `uvp2-retiling.jpg` | `2. UVP2 - Retilling Work\Document Submission\MOS\MOS-001...\Photos` |
| Singapore Airlines Office | `singapore-airlines-office.jpg` | `6. Singapore Airlines Office\Completion Photos\Picture10.jpg` |
| Airport Headhouse Toilet | `airport-headhouse-toilet.jpg` | Extracted from `7. Airport Toilet\TOC Document\1. Punchlist\MOCKUP TOILET DEFECT LIST... (Signed).pdf` |
| RichTime Watchshop | `richtime-watchshop.jpg` | `9. RichTime Watchshop\3D Render\RICHTIME WATCH RETAIL SHOP REV6 02.09.25.pdf` (page 5 render) |
| TK Restaurant | `tk-restaurant.jpg` | `5. TK Restaurant\Procurement\Finishes\Quotation from supplier\Toilet partition Board China` |
| Rosewood Hotel - Ceiling Works | `rosewood-ceiling.jpg` | `13. Rosewood Ceiling Work\Existing Ceiling Measurement Photos\TC_00290.JPG` |
| Otteri Wash & Dry - Toul Svay Prey | `otteri-toul-svay-prey.jpg` | Extracted from `14. Otteri Toul Svay Prey\Defect List\... (Completed) - 21Jan.2026.xlsx` |
| SOMA | `soma.jpg` | `17. SOMA\Layout Drawing\GF.pdf` (ground floor layout, page 1) |

### Tips

- **PDFs to images:** open the PDF, screenshot the page (Win+Shift+S),
  save as JPG with the card's filename.
- **Keep it appropriate:** prefer shots without recognizable faces of
  workers or client-sensitive pricing on drawings.
- **Folders not shown on the site** (per your instruction):
  `15. Akram (Show House)` and `16. KFK - Domrey Park`.
- HR and personal folders (`Work & HR Records`, payroll, reviews) were
  excluded from the scan and the site.


