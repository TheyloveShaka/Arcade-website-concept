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

## Add the promo video

Drop a file at **`assets/promo.mp4`** — the hero placeholder swaps itself for the
playing video automatically (see `MEDIA` in `js/data.js` to change the path).

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
