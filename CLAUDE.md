# Project rules — personal site, Salvatore Di Dio

Read `../DOCUMENTO-DI-PROGETTO.md` before any change — it lives one level up, with
`../CONTENT-EN.md` (the source texts) beside it. Where this file and that document
disagree, the document wins — and this file gets corrected in the same commit.

Two skills carry the reasoning behind these rules and should be loaded when working
here: **`low-carbon-web`** (the energy model, the budget, what counts as greenwashing)
and **`salvatore-didio`** (the verified chronology, the voice, the errata).

---

## Non-negotiable constraints

- **ZERO JavaScript**, except two inline scripts: the video facade and the slider
  loader. Total ≤ 1.5 KB (hard limit 2 KB).
- **ZERO external fonts.** Only the system stack defined in §7.1.
- **ZERO third-party domains contacted on load.** No exceptions — there is no analytics
  on this site, by decision. Do not reintroduce one without asking.
- **ZERO CSS frameworks.** One `main.css`, ≤ 8 KB Brotli-compressed (hard limit 12 KB).
- The site must work completely with JavaScript disabled.
- Per page: **≤ 200 KB** first visit, **≤ 8 HTTP requests**, **max 4 images loaded on
  first visit**. Slider photos that load only on the first gesture do not count towards
  the four, but each one still obeys the 60 KB cap. Home: ≤ 150 KB.
- Every image: AVIF + WebP fallback (JPEG when no WebP encoder is at hand), the
  fallback **with the same file name** so the weight script counts one image; ≤ 60 KB, `width`/`height` declared,
  `loading="lazy"`. Only exception: the portrait in `/about/`, up to 100 KB.
- **Strip EXIF from every published image, and verify it.** Phone photos carry GPS
  coordinates, camera serial and timestamps. Re-encoding usually drops them, but that
  is a default, not a guarantee — check the output, never assume. A personal site is
  exactly where a home address leaks.
- Every photograph carries a caption with **credit**. Where a caption does not fit
  (the portrait in the home's Contact), the credit goes in the footer through the page's
  `credit` front matter. The site publishes under
  CC BY-SA 4.0: an image whose provenance is unclear does not go online.
- **WCAG 2.2 AA** on every page. Contrast ≥ 4.5:1. Focus always visible.
- The site is **English only**: `<html lang="en">`, and `<span lang="it">` on Italian
  fragments. No `/it/`, no hreflang, no language switcher.
- The primary reader is an **ERC SH7 panel member**. No sales language, on any page.

## The rule behind the rules

**54% of the energy a page costs is spent on the reader's device** (SWDM v4). Cutting
bytes helps; cutting CPU work helps more. That is why this site is HTML and CSS — an
arithmetic argument, not an ideological one. Keep it that way in any copy that explains
the site.

Forbidden because they burn CPU on someone else's phone: gradients, multiple shadows,
`filter: blur()`, `backdrop-filter`, scroll-linked animation, parallax.

## Motion

Only what serves a purpose. Almost nothing here is seen more than once by the same
person, so almost nothing animates.

- Allowed: colour transitions on links (≤ 150 ms), focus states, `scale(0.97)` on
  `:active` for pressable elements (160 ms). The nav underline fades in through
  `text-decoration-color`, never a gradient. On hover a linked card lifts **2px**
  (`translateY(-2px)`) and an arrow moves 2px. Nothing else moves.
- Easing: use the custom curves in `main.css`. **Never `ease-in`** on UI — it delays the
  first movement, exactly when the eye is watching. **Never `transition: all`.**
- Animate only `transform`, `opacity` and colours.
- Never animate from `scale(0)`. Start at `0.95` with `opacity: 0`.
- Gate every hover effect behind `@media (hover: hover) and (pointer: fine)`.
- Honour `prefers-reduced-motion`: drop movement, keep colour and opacity.
- **No stagger on lists.** The publication list is the one a reviewer scans for a fact;
  delaying its appearance works against the reader.

## Before calling a change done

1. `npm run build`
2. `npm run budget` — if it fails, it is not done
3. The page still works with JavaScript disabled
4. Keyboard navigation: tab order matches visual order, focus always visible
5. Italian fragments carry `lang="it"`
6. Contrast checked in **both** themes — dark mode is where it usually fails

## Content rules

- Every claim carries proof: a number, an institution's name, a date or a link.
- Never an adjective where a figure belongs.
- "Citizens", not "users", in urban contexts.
- Never open a text with a definition. Open with a datum, a question or a tension.
- Never "solutions", "offering", "services for companies", "request a quote".
- MUV, PUSH and Piranesi are presented as **research infrastructure**, never as a client
  portfolio. An ERC panel seeing three companies asks "when does this person do
  research?" — the answer has to be in the page, not left to be inferred.
- Role titles: LinkedIn is canonical. **Never** write ASN as Full Professor (not held),
  "Head of Design" for MUV, or "Compasso d'Oro 2022" (does not exist — the nomination is
  2025, *Urban Journey of Palermo*, and it is not a MUV project).
- English is the only language, so it has to be right. A *gap* is **closed**, **bridged**
  or **narrowed** — never *filled*. All copy needs a native-speaker pass before launch.

## Never do without asking

- Add an npm dependency that ends up in the output
- Add an eleventh component to the design system
- Add a third-party domain, including analytics
- Raise a budget limit to make something fit
