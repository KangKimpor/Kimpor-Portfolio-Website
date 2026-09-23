# Kimpor Kang | Construction Portfolio Website

A clean, single-page portfolio site built with plain HTML, CSS and vanilla
JavaScript. No build tools, no frameworks, no dependencies to install.

## Live site

**https://kimpor-portfolio-website.vercel.app**

Hosted on Vercel and deployed straight from this repository's `main` branch —
every push to `main` triggers a new production deployment automatically.

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
│   ├── gallery-manifest.js      ← generated gallery filenames (tools/build_galleries.py)
│   └── script.js                ← menu panel, scroll reveal, status filter
├── images/
│   ├── projects/              ← 8 project photo galleries (one folder per project)
│   ├── hero.jpg               ← hero background photo
│   ├── KimporKANG_Portrait.png ← original headshot (white studio background)
│   └── portrait-cutout.png     ← generated transparent-background cutout
├── tools/
│   ├── cutout.py              ← cuts the white background off the portrait
│   └── build_galleries.py     ← copies + resizes project photos into galleries
└── README.md                  ← this file
```

## Project photos

Each project card holds a scrollable photo gallery. Photos live in
`images/projects/<project-slug>/` as `01.jpg`, `02.jpg`, ... The card's
`data-total` attribute in `index.html` controls how many photos load, and
the first photo (`01.jpg`) is the card cover.

To rebuild all galleries from the source archive at
`D:\SingBuild's Document`:

```
python tools/build_galleries.py
```

The tool copies every photo from each project's "Completion Photos" /
"Photos" folder and resizes them for the web (max 1600 px, JPEG q82).
Norodom Business Center's archive holds ~38,000 photos (6.5 GB), so an
even sample from its most recent month is used. Fengfu has no photo
folder (SITE PHOTO folders are empty), so its 16 3D renders are used.

## Where to fill in your contact details

In `index.html`, find the **Contact** section (search for `id="contact"`)
and replace the three placeholders:

- `[Add your email]`: also update the `href="mailto:..."` next to it
- `[Add your phone]`: also update the `href="tel:..."`
- `[Add your LinkedIn URL]`: replace both the link text and the `href`

## Design system & re-theming

The site uses a corporate architectural theme modelled on tpmoralgroup.com —
deep navy bars (#00283b), white menu cells divided by hairlines, Yantramanav
headings over Poppins body copy, a navy side menu that slides in from the
right, and solid-color text in the hero headline and the stat counters (no
outline fills). The full token table lives in `kimpor-portfolio.skill` (section 4).

All colours sit at the top of `css/style.css`:

```css
--navy: #00283b;   /* bars, menus, counters                */
--navy-2: #0a4159; /* hovers + text links                 */
--navy-deep: #001d2b; /* headings, logo text, card titles   */
--soft: #f4f6f8;   /* alt sections, portrait frame         */
--line: #e8e8e9;   /* hairline borders                     */
--text: #383a40;   /* body copy                            */
--dim: #565969;    /* secondary copy                       */
--menu: #9aa2ab;   /* inactive menu cells                  */
```

Change those variables and the whole site re-themes. Status dots are the only
other colours (green = completed, amber = ongoing, blue = ahead of schedule).

## Portrait photo (About section)

The original headshot lives at `images/KimporKANG_Portrait.png` (white studio
background). If you ever replace it, regenerate the cutout from this folder:

```
python tools/cutout.py images/KimporKANG_Portrait.png images/portrait-cutout.png images/_portrait-preview.png
```

It writes `images/portrait-cutout.png` (transparent background) plus
`images/_portrait-preview.png`, where you can check the result on navy. The
tool flood-fills the open white background, then clears white pockets sealed
between hair strands (the hair area is scanned so no white patches remain),
while protecting the white shirt and collar.

1. The About frame shows the cutout automatically.
2. If the cutout is missing it falls back to the original
   `images/KimporKANG_Portrait.png`.
3. If that is missing too, a faded "KK" tile shows instead.

## Projects and photo sources

The site lists 8 projects, written from the real archive at
`D:\SingBuild's Document`. Gallery folders and their photo sources:

| Card | Gallery folder | Photo source |
|---|---|---|
| Norodom Business Center | `norodom-business-center/` | `1. Norodom Business Center\NBC Pan Pacific Hotel - Project Photo Archive - 25 Aug 2025 to 12 September 2026\2026\09 - September` (16-photo sample) |
| UVP2 - Retilling Work | `uvp2-retiling/` | `2. UVP2 - Retilling Work\Completion Photos` (6 photos) |
| UVP2 - Common Areas | `uvp2-common-areas/` | `3. UVP2 - Common Areas\Completion Photos` (34 photos) |
| UVP2 - Swimming Pool | `uvp2-swimming-pool/` | `4. UVP2 - Swimming Pool\Completion Report\Photos` (26 photos) |
| Singapore Airlines Office | `singapore-airlines/` | `6. Singapore Airlines Office\Completion Photos` (14 photos) |
| Fengfu | `fengfu/` | `8. Fengfu\...\RENDER\08.11.24` + `RENDER\18mar25` (16 renders; no site-photo folder exists) |
| KFK - KMALL 2 | `kfk-kmall2/` | `10. KFK - KMALL 2\Completion Photos` (12 photos) |
| UVP2 - Penthouse P5 | `uvp2-penthouse-p5/` | `11. UVP2 - Penthouse P5\Completion Photos` (21 photos) |

Nothing in the archive was moved or modified; files were only read and copied.

### Tips

- **Keep it appropriate:** prefer shots without recognizable faces of
  workers or client-sensitive pricing on drawings.
- HR and personal folders (`Work & HR Records`, payroll, reviews) were
  excluded from the scan and the site.


