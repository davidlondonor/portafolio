# Security Documentation - Portfolio Authentication

## Overview

Sistema de autenticación híbrido con seguridad empresarial:

- **Bcrypt password hashing** (salt rounds: 10)
- **Rate limiting** (5 intentos / 15 minutos por IP)
- **Access logging** con sanitización de IPs
- **JWT authentication** con cookies HttpOnly
- **Timing attack protection**
- **Security HTTP headers**

---

## Setup

### 1. Generar hash de contraseña

```bash
npm install
node scripts/generate-password-hash.js TU_CONTRASEÑA_AQUI
```

Copiar el hash generado a `.env.local`:

```bash
PORTFOLIO_PASSWORD_HASH=$2b$10$...hash_generado...
```

### 2. Configurar variables de entorno

**Desarrollo (`.env.local`):**

```bash
# Hash bcrypt de la contraseña (RECOMENDADO)
PORTFOLIO_PASSWORD_HASH=$2b$10$...tu_hash_aqui...

# Secret para firmar tokens JWT
PORTFOLIO_AUTH_SECRET=...secreto_largo_aleatorio...

# Opcional: contraseña en texto plano (TEMPORAL - solo para migración)
# PORTFOLIO_PASSWORD=DL2026
```

**Producción (Vercel Dashboard):**

1. Ir a **Settings > Environment Variables**
2. Añadir:
   - `PORTFOLIO_PASSWORD_HASH` = ...hash...
   - `PORTFOLIO_AUTH_SECRET` = ...secret...
3. Redeploy

### 3. Verificar seguridad

```bash
# Iniciar servidor de desarrollo
npm run dev

# Test login exitoso
curl -X POST http://localhost:3000/api/portfolio-auth \
  -H "Content-Type: application/json" \
  -d '{"password":"TU_CONTRASEÑA"}'

# Ver logs
node scripts/view-logs.js
```

---

## Cambiar contraseña

```bash
# 1. Generar nuevo hash
node scripts/generate-password-hash.js NUEVA_CONTRASEÑA

# 2. Actualizar .env.local
PORTFOLIO_PASSWORD_HASH=nuevo_hash_aqui

# 3. Reiniciar servidor de desarrollo
npm run dev

# 4. En producción: actualizar en Vercel Dashboard
# Settings > Environment Variables > PORTFOLIO_PASSWORD_HASH
```

---

## Rate Limiting

### Configuración actual

- **5 intentos** por IP cada **15 minutos**
- Almacenamiento en memoria (se resetea en cold starts)
- Responde con HTTP 429 cuando se excede el límite

### Personalizar

Editar `/lib/rate-limiter.js`:

```javascript
const MAX_ATTEMPTS = 3;              // Reducir a 3 intentos
const WINDOW_SIZE_MS = 30 * 60 * 1000;  // Aumentar a 30 minutos
```

### Resetear rate limit manualmente

```javascript
// En Node.js console o API route temporal
const { resetRateLimit } = require('./lib/rate-limiter');
resetRateLimit('192.168.xxx.xxx');
```

### Respuesta cuando se excede el límite

```json
{
  "error": "Too many attempts. Please try again later.",
  "retryAfter": 543
}
```

`retryAfter` indica los segundos que debe esperar antes de reintentar.

---

## Logs de acceso

### Ubicación

`/logs/access-YYYY-MM.json` (rotación mensual automática)

### Ver logs

```bash
# Últimos 20 logs
node scripts/view-logs.js

# Últimos 50
node scripts/view-logs.js --limit=50

# Solo fallidos
node scripts/view-logs.js --failed

# Solo rate limited
node scripts/view-logs.js --rate-limited

# Solo exitosos
node scripts/view-logs.js --success
```

### Estructura del log

```json
{
  "timestamp": "2026-01-12T20:30:00.000Z",
  "ip": "192.168.xxx.xxx",
  "userAgent": "Mozilla/5.0...",
  "success": false,
  "reason": "invalid_password",
  "attemptsRemaining": 4,
  "tokenExpiry": null
}
```

### Campos

- **timestamp**: ISO 8601 timestamp
- **ip**: IP sanitizada (últimos octetos ofuscados)
- **userAgent**: User agent limitado a 200 caracteres
- **success**: `true` si login exitoso, `false` si falló
- **reason**: Razón de fallo (`invalid_password`, `rate_limit_exceeded`, `logout`, etc.)
- **attemptsRemaining**: Intentos restantes antes de rate limit
- **tokenExpiry**: Duración del token generado (solo para logins exitosos)

### Privacidad

- **IPs sanitizadas**: `192.168.1.100` → `192.168.xxx.xxx`
- **User agents limitados**: Máximo 200 caracteres
- **Logs NO se suben a git**: Incluidos en `.gitignore`

### Rotación automática

- Los logs rotan automáticamente a **10,000 líneas** (~2MB)
- Los archivos antiguos se renombran a `access-YYYY-MM-backup-TIMESTAMP.json`

---

## Seguridad de cookies

### Características

- **HttpOnly**: Previene acceso desde JavaScript (protección XSS)
- **Secure**: Solo HTTPS en producción
- **SameSite=Lax**: Protección contra CSRF
- **Max-Age**: 1 hora (3600 segundos)
- **Path=/**: Válida para todo el sitio

### Configuración

```javascript
// En producción (isProd = true)
portfolio_auth=TOKEN; HttpOnly; Path=/; Max-Age=3600; SameSite=Lax; Secure

// En desarrollo (isProd = false)
portfolio_auth=TOKEN; HttpOnly; Path=/; Max-Age=3600; SameSite=Lax
```

---

## Security Headers HTTP

Configurados en `next.config.js`:

```javascript
{
  'X-Content-Type-Options': 'nosniff',        // Previene MIME sniffing
  'X-Frame-Options': 'DENY',                  // Previene clickjacking
  'X-XSS-Protection': '1; mode=block',        // Activa filtro XSS del navegador
  'Referrer-Policy': 'strict-origin-when-cross-origin'  // Control de referrer
}
```

---

## Protección contra ataques

### 1. Ataques de fuerza bruta

**Protección**: Rate limiting

- Máximo 5 intentos por IP cada 15 minutos
- Responde con HTTP 429 después del límite
- Logs de todos los intentos

### 2. Timing attacks

**Protección**: Delay aleatorio

- Delay de 100-300ms en cada login (éxito o fallo)
- Mismo tiempo de respuesta para todos los casos
- Imposible determinar si la contraseña es válida basándose en el tiempo

### 3. XSS (Cross-Site Scripting)

**Protección**: Cookies HttpOnly

- El token JWT no es accesible desde JavaScript
- Header `X-XSS-Protection` activado
- Content-Type correcto con `X-Content-Type-Options: nosniff`

### 4. CSRF (Cross-Site Request Forgery)

**Protección**: SameSite cookies

- Cookie con `SameSite=Lax`
- Previene requests desde otros dominios
- Solo POST requests para autenticación

### 5. Clickjacking

**Protección**: X-Frame-Options

- Header `X-Frame-Options: DENY`
- Previene embedding en iframes

### 6. Revelación de información

**Protección**: Mensajes genéricos

- No revela si la contraseña es correcta o no
- Mensaje genérico: "Invalid credentials"
- No revela información del sistema en errores

---

## Migración a producción (Vercel)

### 1. Variables de entorno

Configurar en **Vercel Dashboard > Settings > Environment Variables**:

```bash
PORTFOLIO_PASSWORD_HASH=$2b$10$...
PORTFOLIO_AUTH_SECRET=...secret...
```

### 2. Build y deployment

```bash
# Verificar build local
npm run build

# Deploy a Vercel
vercel --prod
```

### 3. Testing en producción

```bash
curl https://tu-dominio.vercel.app/api/portfolio-auth \
  -X POST \
  -H "Content-Type: application/json" \
  -d '{"password":"TU_CONTRASEÑA"}'

# Verificar:
# ✅ Status 200, cookie establecida
# ✅ Cookie tiene flag Secure
# ✅ Cookie tiene flag HttpOnly
```

### 4. Consideraciones de Vercel

#### Rate Limiting

- Funciona por serverless instance
- Se resetea en cold starts (~5 min sin uso)
- Suficiente para protección básica

**Para alta escala**: Migrar a Upstash Redis

```bash
npm install @upstash/ratelimit @upstash/redis
```

#### Logs

- Se escriben en `/tmp` (máx 500MB)
- **NO persisten** entre deployments
- Rotación automática cada 10,000 líneas

**Para producción**: Migrar a logging service

- Vercel Log Drains (gratis, 1GB/mes)
- Datadog
- Logtail
- Papertrail

---

## Escalabilidad futura

### Opción 1: NextAuth.js (múltiples usuarios)

Migración fácil porque ya tenemos:

- JWT implementado
- Cookies HttpOnly
- Estructura de `/pages/api/*`

```bash
npm install next-auth
```

Crear `/pages/api/auth/[...nextauth].js`:

```javascript
import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { verifyPassword } from '../../../lib/security';

export default NextAuth({
  providers: [
    CredentialsProvider({
      async authorize(credentials) {
        const hash = process.env.PORTFOLIO_PASSWORD_HASH;
        const isValid = await verifyPassword(credentials.password, hash);
        if (isValid) return { id: 1, name: 'Portfolio User' };
        return null;
      }
    })
  ]
});
```

### Opción 2: Upstash Redis (rate limiting distribuido)

Reemplazar `/lib/rate-limiter.js` manteniendo misma interfaz:

```javascript
const { Ratelimit } = require('@upstash/ratelimit');
const { Redis } = require('@upstash/redis');

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_URL,
  token: process.env.UPSTASH_REDIS_TOKEN
});

const ratelimit = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(5, '15 m'),
  analytics: true
});

async function checkRateLimit(ip) {
  const { success, remaining, reset } = await ratelimit.limit(ip);

  return {
    allowed: success,
    remaining,
    retryAfter: reset ? Math.ceil((reset - Date.now()) / 1000) : 0
  };
}
```

### Opción 3: Logging Service (logs persistentes)

**Vercel Log Drains** (recomendado):

1. Ir a **Vercel Dashboard > Settings > Log Drains**
2. Añadir endpoint (Datadog, Logtail, etc.)
3. Los logs se envían automáticamente

**Alternativa**: Webhook personalizado

Modificar `/lib/access-logger.js`:

```javascript
async function logAccess(data) {
  // También enviar a webhook
  await fetch(process.env.LOG_WEBHOOK_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
}
```

---

## Troubleshooting

### "Server not configured"

**Causa**: Falta `PORTFOLIO_AUTH_SECRET` en `.env.local`

**Solución**:

```bash
# Generar secret aleatorio
openssl rand -hex 64

# Añadir a .env.local
PORTFOLIO_AUTH_SECRET=...generated_secret...
```

### "Too many attempts"

**Causa**: Rate limit activado (más de 5 intentos)

**Solución**:

- Esperar 15 minutos
- O resetear manualmente (ver sección Rate Limiting)

### Logs no se generan

**Causa**: Permisos de escritura en `/logs`

**Solución**:

```bash
mkdir -p logs
chmod 755 logs
```

En Vercel: los logs van a `/tmp`, no persisten.

### Login funciona local pero no en Vercel

**Causa**: Variables de entorno no configuradas

**Solución**:

1. Verificar en **Vercel Dashboard > Settings > Environment Variables**
2. Verificar que el hash sea correcto
3. Redeploy después de cambiar variables

### Warning: "Using plaintext password"

**Causa**: Falta `PORTFOLIO_PASSWORD_HASH` en `.env.local`

**Solución**:

```bash
node scripts/generate-password-hash.js TU_CONTRASEÑA
# Copiar hash a .env.local
PORTFOLIO_PASSWORD_HASH=$2b$10$...
```

---

## Checklist de seguridad

### Desarrollo

- [ ] `bcryptjs` instalado
- [ ] `.env.local` tiene `PORTFOLIO_PASSWORD_HASH`
- [ ] `.env.local` tiene `PORTFOLIO_AUTH_SECRET`
- [ ] `.env.local` está en `.gitignore`
- [ ] `/logs/*.json` está en `.gitignore`
- [ ] Rate limiting funciona (test: 6 intentos fallidos)
- [ ] Logs se generan correctamente
- [ ] Login exitoso funciona
- [ ] Login fallido funciona

### Producción

- [ ] Variables configuradas en Vercel Dashboard
- [ ] Build exitoso: `npm run build`
- [ ] Deploy exitoso
- [ ] Login funciona en producción
- [ ] Cookie tiene flag `Secure`
- [ ] Cookie tiene flag `HttpOnly`
- [ ] Rate limiting funciona
- [ ] Remover `PORTFOLIO_PASSWORD` (texto plano)
- [ ] Security headers activos (verificar DevTools > Network)

---

## Recursos

### Documentación

- [bcryptjs](https://github.com/dcodeIO/bcrypt.js)
- [jsonwebtoken](https://github.com/auth0/node-jsonwebtoken)
- [Next.js Security Headers](https://nextjs.org/docs/advanced-features/security-headers)
- [OWASP Authentication Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Authentication_Cheat_Sheet.html)

### Herramientas

- **Generar secret**: `openssl rand -hex 64`
- **Test endpoints**: `curl` o Postman
- **Verificar headers**: DevTools > Network > Headers

### Contacto

Para reportar vulnerabilidades de seguridad, contactar directamente al desarrollador (no crear issues públicos).
