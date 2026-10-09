# Kimpor Kang | Construction Portfolio Website

A clean, single-page portfolio site built with plain HTML, CSS and vanilla
JavaScript. No build tools, no frameworks, no dependencies to install.

The design is a photo-led construction portfolio: warm neutral surfaces,
terracotta accents, generous spacing, and concise project summaries. Telegram
uses its existing blue. All seven construction projects and both site tools
are retained.

## Live site

**https://kimporkang.com**

The apex domain is the primary address; `www.kimporkang.com` 308-redirects to
it, and the original `https://kimpor-portfolio-website.vercel.app` URL keeps
working. DNS lives at the registrar (Northwest / Business Identity) under
Domain Settings then DNS Settings: the `@` and `www` `A` records point at
`216.198.79.1`, or `www` can use a `CNAME` to
`1b0102ec9671a8d9.vercel-dns-017.com` instead. Vercel's legacy values,
`76.76.21.21` and `cname.vercel-dns.com`, keep working too. The `mail` `A`
record and the domain's `MX` and `TXT` (SPF, DMARC) records stay untouched so
email keeps working.

Hosted on Vercel and deployed straight from this repository's `main` branch —
every push to `main` triggers a new production deployment automatically.

## How to open / run

**Option A: just open it**
Double-click `index.html`. It runs in any modern browser as-is.
(The Google Fonts load from a CDN; offline, the site falls back to system fonts
and still looks right.)

**Option B: local server (nicer for testing)**

```
python -m http.server 8000
```

then open <http://localhost:8000>.

## Folder structure

```
Kimpor-Portfolio-Website/
├── index.html                 ← the whole site (single page)
├── css/
│   └── style.css              ← all styling (tokens, components, responsive)
├── js/
│   ├── gallery-manifest.js    ← generated gallery filenames (tools/build_galleries.py)
│   └── script.js              ← drawer, scroll-spy, filter, galleries, lightbox
├── images/
│   ├── projects/              ← 7 project photo galleries (one folder per project)
│   ├── side/sb-grab.jpg       ← screenshot of the internal ride-code tool
│   ├── hero.webp              ← edge-to-edge featured band (UVP2 Penthouse P5)
│   ├── og-hero.jpg            ← 1200x630 social card for Open Graph / Twitter
│   ├── KimporKANG_Portrait.png ← original headshot (white studio background)
│   └── portrait-cutout.webp    ← generated transparent cutout (used on the page)
├── tools/
│   ├── cutout.py              ← cuts the white background off the portrait
│   ├── build_galleries.py     ← copies + resizes project photos into galleries
│   ├── optimize_images.py     ← compresses gallery photos and hero to WebP
│   └── _validate.py           ← structural checker (run it before pushing)
└── README.md                  ← this file
```

## Page structure

The single page puts construction projects immediately after the introduction:

| Section | Anchor | Contents |
|---|---|---|
| Introduction | `#overview` | Short positioning, project CTA, labelled penthouse rendering |
| Construction projects | `#projects-and-milestones` | Seven covers, status filters, expandable details, full galleries |
| Experience & Education | `#experience-and-education` | Portrait, employment, detailed responsibilities, education |
| Site Tools | `#workflow-utilities` | Grab Code Tracker and Manpower Reporting Automation |
| Contact | `#contact` | Email, Telegram, phone and LinkedIn |
| Footer | — | Copyright and back-to-top link |

The sticky header shows navigation and a Get in touch button linking to Contact
on desktop. Below 700px the name and menu occupy the first row, with Get in touch
on a second row. Email Me and Telegram remain in the Contact section.
The header height is measured for section scroll offsets. The mobile menu and
photo viewer trap keyboard focus, close with Escape, and restore focus.

## Design system & re-theming

Every colour, radius and shadow sits at the top of `css/style.css` under `:root`.
Change those tokens and the whole site re-themes.

| Token | Value | Used for |
|---|---|---|
| `--surface-canvas` | `#fbfbfa` | page background |
| `--surface-card` | `#ffffff` | cards and panels |
| `--surface-subtle` | `#f0efea` | badges, key/value rows |
| `--surface-container-low` | `#f4f4f2` | alternating sections and the footer |
| `--surface-container-high` | `#e8e8e6` | the contact section |
| `--primary-container` | `#1e232a` | primary buttons, drawer, terminal blocks |
| `--accent` | `#c85028` | section indices, kickers, hovers, accent buttons |
| `--accent-deep` | `#a83912` | accent hover state |
| `--text-primary` | `#111418` | headings and primary copy |
| `--text-secondary` | `#575d66` | body copy |
| `--text-tertiary` | `#8a8f98` | labels and captions |
| `--border-subtle` | `#e6e6e3` | the hairline rules that structure the page |
| `--border-strong` | `#cfceca` | hover borders and dotted separators |
| `--status-ongoing` | `#d97706` | Ongoing pills and the live beacon |
| `--status-done` | `#166534` | Handed Over pills |
| `--status-ahead` | `#0284c7` | Ahead of Schedule pills |

**Type**: `Plus Jakarta Sans` for headings, body and buttons; `Space Mono` for
limited dates and metadata. **Shape**: 4px corners, thin borders and flat
surfaces. Projects use a two-column grid from 700px and a single column below.
Telegram retains `#0088cc` with `#0077b5` on hover; its dark label improves contrast.

**Icons** are an inline SVG sprite at the top of `<body>`. To add one, define a
`<symbol id="ico-something">` there and reference it with
`<svg class="ico" viewBox="0 0 24 24"><use href="#ico-something"></use></svg>`.

**Motion**: short hover transitions and an off-canvas menu. Reduced-motion
preferences disable transitions and smooth scrolling. The content appears
immediately without scroll-dependent entrance effects.

## Project photos

Each project card uses a static cover and a keyboard-accessible View photos
button. Photos live in `images/projects/<project-slug>/` and the manifest
controls their filenames. The `data-total` count must match the gallery.
The full-screen viewer shows the project name and count, with arrow keys,
previous/next buttons, swipe navigation and Escape to close. Only the current
photo and the next photo load when a gallery opens. Failed images show a
fallback and the controls remain available.

| Card | Slug | Status | Photos |
|---|---|---|---|
| Norodom Business Center | `norodom-business-center/` | Ongoing | 16 |
| UVP2 - Penthouse P5 | `uvp2-penthouse-p5/` | Ongoing | 21 |
| UVP2 - Retilling Work | `uvp2-retiling/` | Handed over | 6 |
| UVP2 - Common Areas | `uvp2-common-areas/` | Handed over | 34 |
| UVP2 - Swimming Pool | `uvp2-swimming-pool/` | Handed over | 26 |
| Singapore Airlines Office | `singapore-airlines/` | Handed over | 12 |
| KFK - KMALL 2 | `kfk-kmall2/` | Handed over | 12 |

The table follows the order of `#projectsGrid`: ongoing cards first, completed
work after. The filter chips read `All 7`, `Ongoing 2`, `Handed over 5`. If a
project changes state, update the pill text, `data-status`, those counts and this
table together.

To rebuild all galleries from the source archive at `D:\SingBuild's Document`:

```
python tools/build_galleries.py
```

The tool copies every photo from each project's "Completion Photos" / "Photos"
folder and resizes them for the web (max 1600 px, WebP q76). Norodom Business
Center's archive holds ~38,000 photos (6.5 GB), so an even sample from its most
recent month is used. Nothing in the archive was moved or modified.

**Replacing photos:** keep the `01.webp`, `02.webp` … filenames, then bump the `?v=`
query string on the cover images in `index.html` and the `BUILD` constant in
`js/script.js`, so browsers pick up the new files. `vercel.json` caches
`/images/*` for 7 days.

### Tips

- **Keep it appropriate:** prefer shots without recognizable faces of workers or
  client-sensitive pricing on drawings.
- HR and personal folders (`Work & HR Records`, payroll, reviews) are excluded from
  the site.

## Portrait photo

The original headshot lives at `images/KimporKANG_Portrait.png` (white studio
background). The page loads the generated `images/portrait-cutout.webp`. If you
replace the headshot, regenerate the cutout from this folder:

```
python tools/cutout.py images/KimporKANG_Portrait.png images/portrait-cutout.png images/_portrait-preview.png
```

It writes `images/portrait-cutout.png` (transparent background) plus
`images/_portrait-preview.png`, where you can check the result on navy. The tool
flood-fills the open white background, then clears white pockets sealed between
hair strands, while protecting the white shirt and collar.

1. The Experience & Education portrait shows the cutout automatically.
2. If the cutout is missing, a faded "KK" tile shows instead (the script adds
   `.is-empty` when the image fails).

## Contact details

Email, phone, Telegram, LinkedIn and location are set in the `#contact` section of
`index.html` - update the visible text and the `mailto:` / `tel:` / LinkedIn `href`
together, plus the drawer footer.

## Validate before you push

```
python tools/_validate.py
node --check js/script.js
```

The validator (Python 3, standard library only) checks the things that quietly
break this site: gallery `data-total` values against the actual folders and the
manifest, missing image/asset files, HTML tag balance, anchor targets, icon sprite
references, exactly one `<h1>`, form label wiring, undefined CSS tokens, CSS brace
balance, and the CSS hooks and element ids the JavaScript depends on. It finishes
with `RESULT: ALL OK` when everything lines up, and prints zero em dashes (the copy
style avoids them).

## Deploying

The site is static and zero-config on Vercel. Pushing to `main` deploys production.
For a manual deploy:

```
vercel link --yes --project kimpor-portfolio-website --scope kimporkang01-3264s-projects
vercel --prod
```

Check state with `vercel ls`, or open
<https://vercel.com/kimporkang01-3264s-projects/kimpor-portfolio-website>.
