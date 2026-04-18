# Pendientes

Checkpoint antes de reiniciar el computador. El estado actual en la rama `optimizacion` ya tiene: auth simplificado (bcrypt + JWT, case-insensitive + trim), favicons regenerados, y filtros por categoría en `/portfolio`.

---

## 🔴 Alta prioridad — para que davidlondono.co funcione

### 1. Mergear PR #20 (`optimizacion` → `main`)

- Abrir el PR en GitHub → botón "Merge pull request".
- **Antes de mergear**: verificar el preview de Vercel (URL en el comentario de `vercel[bot]` en el PR). Probar `dl2026` en `/portfolio` del preview.

### 2. Variables de entorno en Vercel (production)

Settings → Environment Variables. Edit:

- `PORTFOLIO_PASSWORD_HASH` =
  `$2b$10$6JIfgYuuPsW4k52uRqwGhOpo3HNfDocFRPzMmtnY2Jn3C16d2fi.q`
  (sin backslashes en Vercel — ese hash corresponde al input normalizado `dl2026`)

- `PORTFOLIO_AUTH_SECRET` = confirmar que NO sea el placeholder `a1b2c3d4e5f6g7h8i9j0randomstring_musk_be_long`. Si todavía lo es, generar nuevo y pegar:
  ```bash
  node -e "console.log(require('crypto').randomBytes(48).toString('hex'))"
  ```

- Borrar si existen (ya no se usan): `NEXT_PUBLIC_TURNSTILE_SITE_KEY`, `TURNSTILE_SECRET_KEY`, `PORTFOLIO_PASSWORD`.

### 3. Redeploy

Vercel → Deployments → último → ⋯ → Redeploy (sin cache). Env vars solo aplican a builds nuevos. Después probar `DL2026` / `dl2026` / `  dl2026  ` en `davidlondono.co/portfolio`.

---

## 🟡 Feature en curso — proyecto 06 "Specialized Fitness Nutrition"

Falta:

- **Imagen**: guardar en `/public/images/proyecto7.png`.
- **Descripción corta** (1–2 líneas).
- **Nombre completo de la empresa** — ¿"Specialized Fitness Nutrition" o algo más corto?

Datos ya confirmados:

```js
{
  num: "06",
  title: "Specialized Fitness Nutrition",
  client: "<pendiente>",
  year: "2025",
  category: "web",
  tech: ["UI", "UX", "Web"],
  description: "<pendiente>",
  image: "/images/proyecto7.png",
}
```

Se añade al array en `pages/portfolio.js` dentro de `getServerSideProps`. URL del sitio: https://specializedfitnessnutrition.com/

---

## 🟢 Mejoras identificadas (backlog, sin ejecutar)

Del review inicial del proyecto, ordenadas por impacto:

### Arquitectura / mantenibilidad

- [ ] `pages/index.js` tiene 578 líneas. Dividir en `sections/Hero.js`, `Services.js`, `About.js`, `Projects.js`, `Contact.js`.
- [ ] Nav duplicado entre `pages/index.js` y `pages/portfolio.js`. Extraer `<Layout>` + `<NavLink>` + `<MobileMenu>`.
- [ ] Traducciones inline en `contexts/LanguageContext.js` (~220 líneas de copy). Mover a `locales/es.json` y `locales/en.json`.
- [ ] Proyectos del portfolio hardcodeados en `pages/portfolio.js:298`. Sacar a `data/portfolio-projects.js` o MDX.
- [ ] `pages/index.js` tiene dos sistemas de scroll reveal: `IntersectionObserver` manual (líneas 33-53) + `<RevealOnScroll>` GSAP. Quedarse con uno.

### Bugs / UX

- [ ] **Flash de idioma en carga**: `LanguageContext.js` inicia en `"es"` en SSR y cambia tras mount. Genera hydration mismatch visible. Arreglo: cookie con preferencia leída en `getServerSideProps`.

### Performance

- [ ] Voiceflow se carga en todas las rutas para todos los visitantes (`pages/_app.js:54`). Son cientos de KB de JS de terceros. Cambiar a `strategy="lazyOnload"` o disparar al primer scroll/click.

### SEO

- [ ] `pages/index.js:116` solo tiene `<title>` + `description`. Falta Open Graph / Twitter cards (`og:image`, `og:url`), `canonical`, `robots.txt` bien configurado, `sitemap.xml`.

### Limpieza del repo

- [ ] Archivos muertos: `pages/index.html`, `pages/index.js.backup`, `test-hash.js`, `resumen.md`, `ver.md`, `backup-design-20260118/`.
- [ ] `package.json`: `next-translate` instalado sin usarse. Scripts `deploy`/`predeploy` con `gh-pages` no son el deploy real (Vercel). Quitar.
- [ ] Limpiar línea obsoleta `PORTFOLIO_PASSWORD=DL2026` en `.env.local` (ya no se lee desde el código, pero estorba).

### Seguridad (menor)

- [ ] Headers de seguridad en `next.config.js` solo cubren `/api/:path*`. Añadirlos también para `source: '/:path*'` con CSP que contemple Voiceflow + Cloudflare Insights.

---

## Notas útiles para retomar

- Dev server: `pnpm dev`. Build: `pnpm build`.
- Login local con `DL2026` o `dl2026` (case-insensitive + trim).
- Archivos `.env.local` local → nuevo hash ya pegado. Solo falta pegar el mismo en Vercel.
- Rama activa: `optimizacion`. Commits ya pusheados al remoto.
