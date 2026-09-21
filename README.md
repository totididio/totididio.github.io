# salvatoredidio.com

Personal site of Salvatore Di Dio. Static, English only, built under a hard carbon budget.

**Home page as built: 79 KB, 3 HTTP requests, 0.010 gCO₂e per visit.** The median web
page in July 2025 was 2,862 KB. That ratio is the argument; keep it true.

---

## Start here

```bash
npm install
npm run serve     # http://localhost:8080, reloads on save
```

| Command | What it does |
|---|---|
| `npm run build` | Builds to `_site/`, then writes each page's real weight into its footer. **Placeholders visible.** |
| `npm run build:prod` | Same, but strips the yellow `TO COMPLETE` markers. This is what gets deployed. |
| `npm run budget` | Fails with exit 1 if a page breaks the budget. Run it after every change. |
| `npm run check` | `build` + `budget` in one go. |

A budget that does not fail the build is a wish. If `npm run budget` exits non-zero,
the change is not done — go back, don't raise the limit.

---

## What lives where

```
src/
  _data/          site.json · now.json · projects.json · talks.json
                  Content that changes often lives here, not in templates.
  _includes/      layouts/base.njk · partials/header.njk footer.njk
  assets/css/     main.css — the only stylesheet, no framework
  assets/img/     AVIF + WebP, already compressed and EXIF-stripped
  root/           carbon.txt · robots.txt (copied to the site root)
  index.njk       the Home
scripts/
  inject-page-weight.js   measures each built page, writes the figure into the footer
  carbon-budget.js        fails the build when a page is too heavy
CLAUDE.md         the rules. Read it before changing anything.
```

The strategy and the source texts are **one level up**: `../DOCUMENTO-DI-PROGETTO.md`
and `../CONTENT-EN.md`. They are the canonical reference; this repo implements them.

## Two skills carry the reasoning

- **`low-carbon-web`** — the energy model, the budget, the greenwashing traps, the five
  WCAG 2.2 criteria that 2.1 tooling misses
- **`salvatore-didio`** — verified chronology, voice, and the errata that override its
  own reference files

Load both when working here. `CLAUDE.md` holds the short form of what they say.

---

## The design system is closed

Eight components, and the ninth needs an explicit decision. Seven are written:
header+nav, claim, Now block, project card, research line, data table, video facade,
footer. The eighth — **publication entry**, for `/research/` — is the only one left.

The nine remaining pages are replication, not design. **The CSS should not grow much.**
If a page seems to need a new component, that is a signal to re-read the page, not to
add CSS.

Current: **2.9 KB Brotli, on a budget of 8.**

---

## Deploying

No remote, no CI. Two ways, both manual.

**Wrangler**, from the repo root:

```bash
npm run build:prod
npx wrangler pages deploy _site --project-name salvatoredidio
```

**Or drag `_site/` onto the Cloudflare Pages dashboard.**

Either way, run `npm run budget` first. Without a CI gate it is the only thing standing
between a heavy page and production.

The domain `salvatoredidio.com` is registered at OVH and still has to be pointed at
Cloudflare.

---

## Still missing

| What | Where | Blocks |
|---|---|---|
| Google Scholar profile ID | `src/_data/site.json` | The Research links list |
| Poster for the TEDx facade, AVIF ≤ 60 KB | `src/assets/img/` | Nothing — the facade already works as a link. Check the TEDx licence before using a video still |
| Show name and date for the two podcast episodes | `src/_data/talks.json` | The weakest rows on the page: no source, no date |
| Start date and link for Interferenze | `src/_data/projects.json` | The only one of the three project cards that cannot be verified |
| Four publication venues to show | `src/index.njk` | The Research line |
| Personal commentary on each publication | — | `/research/`. Half a day of writing with Salvatore. The single highest-value thing left, and the only one nobody else can write |

Every one of these is a visible yellow marker in `npm run build`. They vanish in
`build:prod`, so nothing half-finished can ship by accident.

---

## Before launch

1. **Native-speaker pass on all English.** The site is English only, so the English has
   to be right. Start with the claim, the sub-claim and the bios. An idiomatic error in
   an `<h1>` costs more than ten well-written pages.
2. **Lawyer or DPO on the privacy notice.** Required even with no analytics: the server
   logs IP addresses.
3. **Re-verify green hosting.** From October 2026 the Green Web Foundation tightens its
   criteria — a public commitment to 100% hourly fossil-free energy by 2030.
4. **Measure from outside**: websitecarbon.com and ecograder.com, so the figure in the
   footer is one a third party can confirm.

---

Text and images © Salvatore Di Dio, [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/).
