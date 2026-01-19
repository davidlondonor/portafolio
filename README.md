# David Londoño | Creative Developer

Portafolio personal con animaciones avanzadas, shaders WebGL y diseño editorial moderno.

**[Ver Demo](https://davidlondono.vercel.app)** | **[GitHub](https://github.com/davidlondonor)**

---

## Tech Stack

| Frontend | Animaciones | Seguridad |
|----------|-------------|-----------|
| Next.js 16 | GSAP 3 | JWT Auth |
| React 19 | Three.js | Bcrypt |
| Tailwind CSS | WebGL Shaders | Rate Limiting |
| TypeScript | Scroll Reveal | HttpOnly Cookies |

---

## Características

- **Animaciones GSAP** - Hero animado, reveal on scroll, staggered text, cards interactivas
- **Shader Background** - Fondo animado con WebGL/Three.js
- **Multilingüe** - Soporte Español/Inglés con context API
- **Diseño Responsive** - Mobile-first con menú hamburguesa animado
- **Portfolio Protegido** - Sección privada con autenticación segura
- **Formulario de Contacto** - Integración con Web3Forms
- **Vercel Analytics** - Métricas de rendimiento

---

## Inicio Rápido

```bash
# Clonar repositorio
git clone https://github.com/davidlondonor/portafolio.git
cd portafolio

# Instalar dependencias
npm install

# Configurar variables de entorno
cp .env.example .env.local

# Iniciar desarrollo
npm run dev
```

Abrir [http://localhost:3000](http://localhost:3000)

---

## Scripts

| Comando | Descripción |
|---------|-------------|
| `npm run dev` | Servidor de desarrollo |
| `npm run build` | Build de producción |
| `npm run start` | Servidor de producción |
| `npm run lint` | Ejecutar ESLint |

---

## Estructura del Proyecto

```
portafolio/
├── components/
│   ├── ui/                  # Componentes UI (shaders)
│   ├── portfolio/           # Componentes del portfolio
│   ├── AnimatedHero.js      # Hero con GSAP
│   ├── RevealOnScroll.js    # Animación scroll
│   ├── CardAnimation.js     # Cards animadas
│   └── SplitTextAnimation.js
├── contexts/
│   └── LanguageContext.js   # i18n ES/EN
├── lib/
│   ├── security.js          # Utilidades auth
│   ├── rate-limiter.js      # Rate limiting
│   └── access-logger.js     # Logging accesos
├── pages/
│   ├── index.js             # Home
│   ├── portfolio.js         # Portfolio protegido
│   └── api/                 # API routes
├── scripts/
│   ├── generate-password-hash.js
│   └── view-logs.js
└── styles/
    └── globals.css
```

---

## Autenticación

El portfolio incluye una sección protegida con seguridad de nivel empresarial.

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

### Ver Logs de Acceso

```bash
node scripts/view-logs.js           # Todos los intentos
node scripts/view-logs.js --failed  # Solo fallidos
node scripts/view-logs.js --limit=50
```

### Características de Seguridad

- Bcrypt password hashing (salt rounds: 10)
- Rate limiting (5 intentos / 15 min por IP)
- Logging de accesos con sanitización IP
- JWT con cookies HttpOnly
- Protección contra timing attacks
- Headers de seguridad HTTP

Ver documentación completa en [/docs/SECURITY.md](./docs/SECURITY.md)

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
npm run build
npm run start
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
