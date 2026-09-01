# David Londoño | Creative Developer

Portafolio personal con animaciones avanzadas, shaders WebGL y diseño editorial moderno.

**[Ver Demo](https://davidlondono.co)** | **[GitHub](https://github.com/davidlondonor)**

---

## Tech Stack

| Frontend | Animaciones | Auth |
|----------|-------------|------|
| Next.js 16 | GSAP 3 | JWT |
| React 19 | Three.js | Bcrypt |
| Tailwind CSS | WebGL Shaders | HttpOnly Cookies |
| TypeScript | Scroll Reveal | SameSite=Lax |

---

## Características

- **Animaciones GSAP** — Hero animado, reveal on scroll, staggered text, cards interactivas
- **Shader Background** — Fondo animado con WebGL/Three.js
- **Multilingüe ES/EN sin flash** — Idioma leído server-side desde cookie (`Accept-Language` de fallback) en `MyApp.getInitialProps`, sin hydration mismatch
- **Diseño Responsive** — Mobile-first con menú hamburguesa animado
- **Portfolio Protegido** — Sección privada con password bcrypt + JWT en cookie HttpOnly
- **Grid + Archive + Multi-imagen** — Cards filtrables por categoría, segunda sección "Archive" con piezas secundarias, modales con navegación por flechas/teclado/swipe
- **Formulario de Contacto** — Integración con Web3Forms
- **Vercel Analytics** — Métricas de rendimiento

---

## Inicio Rápido

```bash
# Clonar repositorio
git clone https://github.com/davidlondonor/portafolio.git
cd portafolio

# Instalar dependencias (lockfile con pnpm)
pnpm install

# Configurar variables de entorno
cp .env.example .env.local

# Iniciar desarrollo
pnpm dev
```

Abrir [http://localhost:3000](http://localhost:3000)

---

## Scripts

| Comando | Descripción |
|---------|-------------|
| `pnpm dev` | Servidor de desarrollo |
| `pnpm build` | Build de producción |
| `pnpm start` | Servidor de producción |
| `pnpm lint` | Ejecutar ESLint |

---

## Estructura del Proyecto

```
portafolio/
├── components/
│   ├── ui/                   # Componentes UI (shaders)
│   ├── portfolio/
│   │   ├── LoginForm.js      # Gate de password
│   │   ├── ProjectCard.js    # Card + modal multi-imagen
│   │   └── ArchiveGrid.js    # Archive secundario con modal y flechas
│   ├── AnimatedHero.js       # Hero con GSAP
│   ├── RevealOnScroll.js     # Animación scroll
│   ├── CardAnimation.js      # Cards animadas
│   └── SplitTextAnimation.js
├── contexts/
│   └── LanguageContext.js    # i18n ES/EN (cookie + SSR initial)
├── pages/
│   ├── _app.js               # getInitialProps lee cookie de idioma
│   ├── index.js              # Home
│   ├── portfolio.js          # Portfolio protegido
│   └── api/                  # API routes (portfolio-auth, contact, …)
├── public/images/
│   ├── (proyectos principales) # epm.png, xm.png, visual8pro.png, …
│   └── brand/                # Archive secundario
├── scripts/
│   └── generate-password-hash.js
└── styles/
    └── globals.css
```

---

## Autenticación

El portfolio incluye una sección protegida con un password gate simple. Protege screenshots y piezas de clientes — no secretos. No hay rate limiting ni captcha (removidos intencionalmente); ver `CLAUDE.md` para el razonamiento.

### Configurar Contraseña

```bash
# Generar hash
node scripts/generate-password-hash.js TU_PASSWORD

# Agregar a .env.local
PORTFOLIO_PASSWORD_HASH=$2b$10$...hash_generado...
PORTFOLIO_AUTH_SECRET=...secreto_aleatorio...
```

### Generar Secret

```bash
node -e "console.log(require('crypto').randomBytes(48).toString('hex'))"
```

### Características

- Bcrypt password hashing (salt rounds: 10), comparación case-insensitive + trim
- JWT firmado con `PORTFOLIO_AUTH_SECRET`, cookie `HttpOnly; SameSite=Lax` (1h de duración)
- Re-verificación en `getServerSideProps` de `/portfolio` en cada request
- Headers de seguridad HTTP para `/api/*` (X-Frame-Options, X-Content-Type-Options, Referrer-Policy)

---

## Variables de Entorno

```env
# Autenticación Portfolio
PORTFOLIO_PASSWORD_HASH=     # Hash bcrypt de la contraseña
PORTFOLIO_AUTH_SECRET=       # Secret para JWT (min 32 chars)
```

---

## Deploy

### Vercel (Recomendado)

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/davidlondonor/portafolio)

1. Conectar repositorio
2. Configurar variables de entorno
3. Deploy automático

### Manual

```bash
pnpm build
pnpm start
```

---

## Componentes de Animación

### AnimatedHero
Hero section con timeline GSAP, animaciones de entrada staggered.

### RevealOnScroll
Wrapper que anima children al entrar en viewport con IntersectionObserver.

### CardAnimation
Cards con efecto hover y animación de entrada.

### SplitTextAnimation
Divide texto en caracteres/palabras con animación staggered.

### ShaderAnimation
Fondo WebGL con Three.js, efectos visuales procedurales.

---

## Licencia

MIT

---

**Hecho con Next.js, GSAP y Three.js**
