# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

Package manager: dependencies are locked with `pnpm-lock.yaml` — use `pnpm install` for install; `package.json` scripts can be run with `pnpm` or `npm run`.

```bash
pnpm install              # install dependencies (respects pnpm-lock.yaml)
pnpm dev                  # next dev — http://localhost:3000
pnpm build                # next build (production)
pnpm start                # next start (serve built app)
pnpm lint                 # next lint (eslint-config-next)
```

Auth/ops helpers (run with `node`, not via pnpm scripts):

```bash
node scripts/generate-password-hash.js YOUR_PASSWORD   # bcrypt hash for PORTFOLIO_PASSWORD_HASH
node -e "console.log(require('crypto').randomBytes(48).toString('hex'))"  # PORTFOLIO_AUTH_SECRET
```

There is no test suite configured. `test-hash.js` at the repo root is an ad-hoc script (run with `node test-hash.js`), not a test runner.

Deploy target is Vercel (`@vercel/analytics` is wired in `_app.js`). The `deploy`/`predeploy` scripts use `gh-pages` and are leftovers from an older GitHub Pages setup — they are not the real deploy path.

## Architecture

Next.js **Pages Router** app (not App Router). Mostly JavaScript with TypeScript enabled (`allowJs`, `strict`) — only `components/ui/shader-animation.tsx` and `pages/shader-demo.tsx` are TS. Path alias `@/*` maps to the repo root (see `tsconfig.json`).

Styling is Tailwind (v3) plus heavy custom CSS in `styles/globals.css` defining a design system via CSS variables (`--color-bg`, `--color-accent`, `--font-serif`, etc.) and utility-class helpers (`display-xl`, `container-editorial`, `grid-editorial`, `nav-link`, `accent-line`, …). New UI should prefer these tokens/classes over inventing ad-hoc Tailwind colors. Fonts come from the `geist` package (Sans, Mono, PixelSquare) and are injected as CSS variables in `pages/_app.js`.

### Top-level flow

- `pages/_app.js` wraps every page in `LanguageProvider` (from `contexts/LanguageContext.js`), injects Geist fonts, and conditionally loads Cloudflare Web Analytics (`NEXT_PUBLIC_CLOUDFLARE_ANALYTICS_TOKEN`) and the Voiceflow chat widget. `@vercel/analytics` also mounts here.
- `pages/index.js` is the public single-page site: hero, services, about, projects, contact. Uses `AnimatedHero`, `RevealOnScroll`, `CardAnimation`, `SplitTextAnimation`, and `ShaderAnimation`. The contact form posts to `/api/contact` (plain Web3Forms proxy, no captcha).
- `pages/portfolio.js` is a password-protected page. It runs `getServerSideProps` which reads the `portfolio_auth` cookie, verifies the JWT with `PORTFOLIO_AUTH_SECRET`, and only then returns `portfolioProjects`. Unauthenticated requests render `components/portfolio/LoginForm.js` instead.

### i18n

`contexts/LanguageContext.js` holds the full ES/EN translation tree inline (`translations.es`, `translations.en`) and exposes `{ language, toggleLanguage, t }`. All user-facing copy should be read from `t.*` rather than hard-coded. Despite `next-translate` being in `package.json`, it is not wired up — the Context API above is the source of truth.

### Animations

GSAP 3 (+ ScrollTrigger) drives all motion. The reusable wrappers in `components/` (`AnimatedHero`, `RevealOnScroll`, `CardAnimation`, `SplitTextAnimation`, `HoverMagnetic`, `TextStaggerAnimation`, `MorphingShapes`, `NumberCounter`, `ParallaxSection`, `StaggeredList`) each key off specific CSS class names (e.g. `.hero-title`, `.hero-description`, `.reveal-item`, `.char`). When adding new sections, reuse those class hooks so the animation components find their targets. See `GSAP_ANIMATIONS.md` for the full contract of each wrapper. `components/ui/shader-animation.tsx` is a Three.js/WebGL background used for decorative effects.

### Auth (portfolio area)

Minimal password gate. Deliberately *not* paranoid — this protects portfolio screenshots, not secrets. Flow:

1. `LoginForm` posts `{ password }` to `/api/portfolio-auth`.
2. Route does `bcrypt.compare(password, PORTFOLIO_PASSWORD_HASH)`.
3. On success, signs a 1h JWT with `PORTFOLIO_AUTH_SECRET` and sets it as an `HttpOnly; SameSite=Lax` cookie named `portfolio_auth` (adds `Secure` when `NODE_ENV=production`).
4. `/api/portfolio-logout` clears the cookie.
5. `getServerSideProps` in `pages/portfolio.js` re-verifies the JWT on every request; only then returns `portfolioProjects`.

No rate limiting, no captcha, no access logging, no timing-attack delay — all that was removed. If you need to re-add any of that, do it intentionally, not as default. To rotate the password: `node scripts/generate-password-hash.js NEW_PASSWORD` and paste into `.env.local` + Vercel.

Security headers (`X-Frame-Options`, `X-Content-Type-Options`, `X-XSS-Protection`, `Referrer-Policy`) are set for `/api/:path*` in `next.config.js`.

### Environment variables

See `.env.example`. Required for the portfolio auth flow: `PORTFOLIO_PASSWORD_HASH` and `PORTFOLIO_AUTH_SECRET`. Optional integrations: `NEXT_PUBLIC_CLOUDFLARE_ANALYTICS_TOKEN` (Web Analytics), `WEB3FORMS_ACCESS_KEY` (contact form — must stay server-side, never `NEXT_PUBLIC_`). When editing `.env*` examples, keep the `$` characters in bcrypt hashes escaped as `\$` so shell interpolation doesn't mangle them.

## Conventions worth knowing

- Follow the existing file's indentation. Source under `pages/` and `components/` uses tabs; repo-level configs (`next.config.js`, `tailwind.config.js`, `tsconfig.json`) use spaces.
- `next.config.js` whitelists `images.unsplash.com` for `next/image`; add new remote hosts there rather than using `<img>`.
- `backup-design-*/` directories are archived snapshots (gitignored) — don't edit them or import from them.
- `pages/index.html` and `pages/index.js.backup` are legacy artifacts; the live home page is `pages/index.js`.
- `resumen.md` describes an earlier version of this project (Next.js 12, yellow hero) and is stale — prefer `README.md` and `docs/SECURITY.md` for current context.
