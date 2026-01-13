const fs = require('fs').promises;
const path = require('path');

const LOGS_DIR = path.join(process.cwd(), 'logs');
const MAX_LOG_LINES = 10000;

/**
 * Registra un intento de acceso al portfolio
 * @param {Object} data
 * @param {string} data.ip - IP del cliente
 * @param {string} data.userAgent - User agent
 * @param {boolean} data.success - Si el login fue exitoso
 * @param {string} [data.reason] - Razón de fallo
 * @param {number} [data.attemptsRemaining] - Intentos restantes
 * @param {string} [data.tokenExpiry] - Expiración del token (solo éxito)
 */
async function logAccess(data) {
  try {
    // Crear directorio si no existe
    await fs.mkdir(LOGS_DIR, { recursive: true });

    // Nombre de archivo con mes actual
    const now = new Date();
    const month = now.toISOString().slice(0, 7); // YYYY-MM
    const logFile = path.join(LOGS_DIR, `access-${month}.json`);

    // Preparar entrada de log
    const logEntry = {
      timestamp: now.toISOString(),
      ip: sanitizeIP(data.ip),
      userAgent: data.userAgent?.slice(0, 200) || 'unknown', // Limitar longitud
      success: data.success,
      reason: data.reason || null,
      attemptsRemaining: data.attemptsRemaining ?? null,
      tokenExpiry: data.tokenExpiry || null
    };

    // Escribir al archivo (append)
    const logLine = JSON.stringify(logEntry) + '\n';
    await fs.appendFile(logFile, logLine, 'utf8');

    // Opcional: Rotar si el archivo es muy grande
    await rotateIfNeeded(logFile);

  } catch (error) {
    // No fallar la request si el logging falla
    console.error('Error writing access log:', error);
  }
}

/**
 * Sanitiza IP para privacidad (ofusca últimos octetos)
 * Ejemplo: 192.168.1.100 -> 192.168.xxx.xxx
 */
function sanitizeIP(ip) {
  if (!ip || ip === 'unknown') return 'unknown';

  // IPv4
  if (ip.includes('.')) {
    const parts = ip.split('.');
    return `${parts[0]}.${parts[1]}.xxx.xxx`;
  }

  // IPv6
  if (ip.includes(':')) {
    const parts = ip.split(':');
    return parts.slice(0, 3).join(':') + ':xxxx:xxxx:xxxx:xxxx';
  }

  return 'unknown';
}

/**
 * Rota el log si excede MAX_LOG_LINES
 */
async function rotateIfNeeded(logFile) {
  try {
    const content = await fs.readFile(logFile, 'utf8');
    const lines = content.split('\n').filter(Boolean);

    if (lines.length > MAX_LOG_LINES) {
      // Mover a archivo de backup
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      const backupFile = logFile.replace('.json', `-backup-${timestamp}.json`);

      await fs.rename(logFile, backupFile);
      console.log(`Log rotated: ${backupFile}`);
    }
  } catch (error) {
    console.error('Error rotating log:', error);
  }
}

/**
 * Lee los últimos N logs
 * @param {number} limit - Número de entradas a leer
 * @returns {Promise<Array>}
 */
async function readRecentLogs(limit = 50) {
  try {
    const now = new Date();
    const month = now.toISOString().slice(0, 7);
    const logFile = path.join(LOGS_DIR, `access-${month}.json`);

    const content = await fs.readFile(logFile, 'utf8');
    const lines = content.split('\n').filter(Boolean);

    // Últimas N líneas
    const recentLines = lines.slice(-limit);

    return recentLines.map(line => JSON.parse(line));
  } catch (error) {
    if (error.code === 'ENOENT') {
      return []; // No hay logs todavía
    }
    throw error;
  }
}

/**
 * Obtiene estadísticas de acceso
 */
async function getAccessStats() {
  try {
    const logs = await readRecentLogs(1000);

    const stats = {
      total: logs.length,
      successful: logs.filter(l => l.success).length,
      failed: logs.filter(l => !l.success).length,
      rateLimited: logs.filter(l => l.reason === 'rate_limit_exceeded').length,
      uniqueIPs: new Set(logs.map(l => l.ip)).size,
      lastAccess: logs[logs.length - 1]?.timestamp || null
    };

    return stats;
  } catch (error) {
    console.error('Error getting access stats:', error);
    return null;
  }
}

module.exports = {
  logAccess,
  readRecentLogs,
  getAccessStats
};
