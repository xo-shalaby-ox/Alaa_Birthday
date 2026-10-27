# 🎀 Alaa's Birthday

A birthday website in vanilla JavaScript + CSS, with no UI framework.
[Vite](https://vite.dev) is used only as a dev server and bundler: it minifies everything into one JS
and one CSS file with cache-friendly hashed names.

## Quick start

```bash
npm install       # Vite + Prettier (dev tools only, never deployed)
npm run dev       # live preview with instant reload → http://localhost:5173
```

| Script                 | What it does                                          |
| ---------------------- | ----------------------------------------------------- |
| `npm run dev`          | Local preview, reloads on every save                  |
| `npm run build`        | Production build → `dist/`                            |
| `npm run preview`      | Serve the built `dist/` to double-check before deploy |
| `npm run format`       | Format all code with Prettier                         |
| `npm run format:check` | Verify formatting                                     |
| `npm run deploy`       | Build + upload to Cloudflare Pages (via Wrangler)     |

## Edit the content

Everything she reads is in **`src/content.js`**: names, dates, captions, reasons, the letter, the song.

- **Photos** → `public/photos/`: `hero.jpg` (portrait 4:5), `1.jpg` … `6.jpg`, `finale.jpg`.
  Missing photos show illustrated placeholders. Keep each one ≤1600px wide and under ~300 KB
  (e.g. `ffmpeg -i big.jpg -vf "scale='min(1600,iw)':-2" -q:v 4 1.jpg`).
- **Song** → `public/music/song.mp3`. Until it exists, _Midnight Piano_ plays: a calm piece
  generated live in the browser (`src/lib/piano.js`, 0 KB, no copyright).
- **Colors & fonts** → `src/styles/tokens.css`.

## Project structure

```
├── index.html                 page markup, sections in order
├── public/                    static files, copied to the site root as-is
│   ├── photos/  music/        your media
│   ├── og.jpg                 link-preview image (WhatsApp, iMessage…)
│   └── _headers               Cloudflare caching + security headers
└── src/
    ├── main.js                entry: loads styles, renders every component
    ├── content.js             ✏️ all texts, dates, photo & song paths
    ├── styles/                global CSS
    │   ├── tokens.css         colors, fonts, easing
    │   ├── base.css           reset, backdrop, film grain
    │   ├── ui.css             typography, buttons, reveal, layout, footer
    │   ├── animations.css     keyframes shared by several components
    │   └── reduced-motion.css loaded last so it always wins
    ├── components/            one folder per UI piece: <name>.js + <name>.css
    │   ├── gate/              1 gift screen + countdown
    │   ├── hero/              2 hero, chips, cursor glow
    │   ├── memories/          3 polaroid wall
    │   ├── reasons/           4 flip cards
    │   ├── wish/              5 cake & candles (tap or blow)
    │   ├── letter/            6 envelope → letter (night mood)
    │   ├── finale/            7 closing
    │   ├── lightbox/          full-screen photo viewer
    │   └── music-player/      floating player (song or piano)
    ├── lib/                   engines with no UI of their own
    │   ├── fx.js              confetti / hearts / sparkles canvas
    │   ├── ambient.js         floating background hearts & petals
    │   ├── piano.js           generative romantic piano (Web Audio)
    │   ├── images.js          photo loading + illustrated placeholders
    │   ├── reveal.js          scroll-in animations
    │   └── blow-detector.js   microphone "blow out the candles"
    └── utils/                 tiny shared helpers: dom, date, math, env, canvas
```

**Adding a section:** add its markup to `index.html`, create `src/components/<name>/<name>.js`
(exporting `init<Name>(content)` and starting with `import './<name>.css'`), then call it from `main.js`.

## Deploy to Cloudflare Pages

`node_modules` is never uploaded; only the built `dist/` folder is served.

**Option A: Git (recommended, auto-deploys on every push)**

1. Push this folder to a GitHub/GitLab repo.
2. Cloudflare dashboard → Workers & Pages → Create → Pages → _Connect to Git_.
3. Framework preset: **Vite** (or set **Build command** `npm run build`, **Output directory** `dist`).
   Cloudflare installs the dependencies itself; `.node-version` pins Node 22.

**Option B: direct upload**: `npm run deploy` (builds, then uploads `dist/` with Wrangler),
or run `npm run build` and drag `dist/` into _Pages → Upload assets_.

After the first deploy, set the full URL in `index.html` → `og:image`
(e.g. `https://alaa-birthday.pages.dev/og.jpg`) so WhatsApp shows the preview card.

## Good to know

- Before Oct 28 the gift screen shows a live countdown; the gift still opens anytime.
  The countdown uses _her_ phone's clock, and if she's on the gift screen at midnight, confetti goes off.
- "Blow into the mic" needs https (any Cloudflare URL works); it falls back to tapping the candles.
- Reduced-motion settings are respected, and animations and music pause while the tab is hidden.
