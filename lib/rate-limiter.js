/**
 * Rate Limiter en memoria para Next.js API Routes
 * Configuración: 5 intentos por IP cada 15 minutos
 *
 * NOTA: En Vercel, esto funciona por serverless function instance.
 * Para producción con alto tráfico, considerar Upstash Redis.
 */

const WINDOW_SIZE_MS = 15 * 60 * 1000; // 15 minutos
const MAX_ATTEMPTS = 5;

// Almacenamiento en memoria: { ip: { attempts: number, resetAt: timestamp } }
const rateLimitStore = new Map();

/**
 * Limpia entradas expiradas del store (cada 1000 requests)
 */
let cleanupCounter = 0;
function cleanupExpiredEntries() {
  cleanupCounter++;
  if (cleanupCounter < 1000) return;

  cleanupCounter = 0;
  const now = Date.now();

  for (const [ip, data] of rateLimitStore.entries()) {
    if (data.resetAt < now) {
      rateLimitStore.delete(ip);
    }
  }
}

/**
 * Verifica si una IP ha excedido el rate limit
 * @param {string} ip - IP del cliente
 * @returns {{ allowed: boolean, remaining: number, retryAfter?: number }}
 */
function checkRateLimit(ip) {
  cleanupExpiredEntries();

  const now = Date.now();
  const entry = rateLimitStore.get(ip);

  // Primera vez o ventana expirada
  if (!entry || entry.resetAt < now) {
    rateLimitStore.set(ip, {
      attempts: 1,
      resetAt: now + WINDOW_SIZE_MS
    });

    return {
      allowed: true,
      remaining: MAX_ATTEMPTS - 1
    };
  }

  // Incrementar intentos
  entry.attempts++;

  // Excedió el límite
  if (entry.attempts > MAX_ATTEMPTS) {
    const retryAfter = Math.ceil((entry.resetAt - now) / 1000); // segundos

    return {
      allowed: false,
      remaining: 0,
      retryAfter
    };
  }

  // Dentro del límite
  return {
    allowed: true,
    remaining: MAX_ATTEMPTS - entry.attempts
  };
}

/**
 * Resetea el rate limit de una IP (útil para testing o soporte)
 * @param {string} ip
 */
function resetRateLimit(ip) {
  rateLimitStore.delete(ip);
}

/**
 * Obtiene estadísticas del rate limiter
 */
function getStats() {
  return {
    totalIPs: rateLimitStore.size,
    entries: Array.from(rateLimitStore.entries()).map(([ip, data]) => ({
      ip: ip.slice(0, 10) + '...', // Ofuscar IP para privacidad
      attempts: data.attempts,
      resetIn: Math.ceil((data.resetAt - Date.now()) / 1000) + 's'
    }))
  };
}

module.exports = {
  checkRateLimit,
  resetRateLimit,
  getStats,
  MAX_ATTEMPTS,
  WINDOW_SIZE_MS
};
