# Bulungi Town — Arcade Site (v1 demo)

Single-page launch site for **Bulungi Town** (Café • Arcade • Soft Play) at
Lugogo Mall, Kampala — with a playable 8-bit arcade built in: three mini-games
in one cabinet, plus a local leaderboard.

Brand colours are sampled from the official logo (`assets/logo.jpg`):
royal blue `#1C60C8` · sky cyan `#33B8E1` · sun yellow `#FECC45`.

## Run it

No build step. Either open `index.html` through any static server, e.g.:

```bash
npx http-server -p 8123 -c-1 .
```

then visit http://localhost:8123. (Opening the file directly also works in most
browsers, but a server is more reliable for fonts/video.)

## Edit content — one file

Everything editable lives in **`js/data.js`**:

| What | Where |
|---|---|
| WhatsApp number (bookings) | `whatsappNumber` — currently a `256700000000` **placeholder** |
| Hero badge ("Now open…") | `heroBadge` |
| Prices (UGX, **demo values**) | `pricing` |
| Party packages | `parties` |
| Weekly deals | `deals` |
| Testimonials (**demo quotes**) | `testimonials` |
| Hours, location, socials | `hours`, `location`, `socials` — social handles are **unconfirmed guesses** |
| Game reward offer + threshold | `gameReward` |

## Drop-in photos & videos

Every media slot fills itself automatically: drop a file with the right name
into `assets/` and reload — no code changes. Each slot tries `.mp4` first
(shown as a muted loop), then `.jpg`, `.png`, `.webp`, `.jpeg`. Until a file
exists the site keeps its pixel-art look.

| File name (in `assets/`) | Where it appears | Best shape |
|---|---|---|
| `promo.mp4` | Hero frame (wins over hero.jpg) | portrait ~9:12, 10–30s loop |
| `hero` | Hero frame poster until video exists | portrait, 1080×1440+ |
| `fun-arcade` | Unleash the Fun → Arcade Games | landscape 16:10, ~1200px wide |
| `fun-softplay` | Unleash the Fun → Soft Play Land | landscape 16:10 |
| `fun-cafe` | Unleash the Fun → The Café | landscape 16:10 |
| `fun-parties` | Unleash the Fun → Parties & Events | landscape 16:10 |
| `party-birthday` | Epic Parties → Birthday Blast | landscape 16:10 |
| `party-school` | Epic Parties → School Day Out | landscape 16:10 |
| `party-corporate` | Epic Parties → Corporate & Teams | landscape 16:10 |

Keep videos H.264 MP4 under ~20 MB (they autoplay muted). Slot names/paths
live in `js/data.js` (`attractions[].media`, `parties[].media`, `MEDIA`).

### What's filled so far (demo stock)

Placed and web-optimized (sources in `_source-media/`, not committed):

| Slot | Image |
|---|---|
| `hero` | promo.webm — arcade B-roll (demo placeholder, see note) |
| `fun-arcade` | colourful duck redemption machine |
| `fun-softplay` | friends in a ball pit |
| `fun-cafe` | friends with food in a neon arcade (AI-generated) |
| `fun-parties` | family laughing at racing simulators |
| `party-birthday` | kids around a birthday cake in soft play (AI-generated) |
| `party-corporate` | two friends laughing at skeeball |

The hero video is a **demo placeholder only**: it carries a Shutterstock
watermark and shows a competitor ("Timezone") storefront — replace it with
real Bulungi Town footage (`assets/promo.mp4`, ~5:4 fills the blob best)
before launch. The hero frame is a large irregular organic blob: an SVG
`clip-path` (`#heroBlob`) masks the media and a matching stroked SVG draws
the cyan outline — edit both paths together in `index.html` to reshape it.

Still needed (this card shows a pixel icon until filled): `party-school`.

Two spare usable shots sit in `_source-media/` if wanted later: a dance
(DDR) arcade machine and a bowling lane. Two supplied files were **not
used** — an iStock and a Shutterstock preview, both watermarked (and the
video showed a competitor "Timezone" storefront).

Source photos are optimized before use (cropped/downscaled, ~45–260 KB
each) — drop full-res originals in `_source-media/` and re-run the same
System.Drawing resize if you swap any.

## The games

`js/game.js` — a mini arcade engine driving one shared cabinet canvas with
three games (all sprites are in-code pixel maps, all sounds synthesized —
zero asset files):

- **Bulungi Blast** — token catcher. Pick KATO or NALA on the title screen
  (choice is remembered). Arrows/A–D or drag to move.
- **Pixel Bowling** — 5 racks, 2 rolls each; oscillating aim, tap/space to
  roll; strike +50, spare +25.
- **Mini Golf** — 3 holes; drag back and release to putt (or arrows + space);
  fewer putts = more points; hole 3 has a moving wall.

`window.ArcadeCabinet.load('blast'|'bowl'|'golf')` swaps the cabinet game
(the Play buttons on the game cards call this). On game over the canvas fires
`arcade:gameover`; `js/main.js` shows the reward CTA (per-game
`rewardThreshold` in `data.js`), a WhatsApp brag link, and the name-entry
form for the leaderboard.

### Leaderboard

Local (per-device) leaderboard in `localStorage` — per game, top 50 kept,
top 5 shown with a Show All toggle. Names max 12 chars, uppercased, last
name remembered. To make it site-wide later it needs a tiny backend (or
Firebase) — the UI is already wired to swap in.

## Branding

The real logo lives at `assets/logo.jpg` (favicon, nav, hero frame, footer).
All colours are CSS variables at the top of `css/styles.css` (`:root`),
sampled from the logo. Decorative pixel sprites are pixel maps in
`js/main.js` (`DECOR`); in-game sprites are in `js/game.js` (`SPRITES`).
The dark starfield background is a data-URI SVG layered in `body`'s CSS.

## Still to confirm with the client

- Real WhatsApp number, social handles, opening hours
- Real pricing (cards + parties) — all UGX values are demo
- Real testimonials
- Promo video footage
- The real-world reward offer for beating game thresholds
