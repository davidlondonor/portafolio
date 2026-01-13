const bcrypt = require('bcryptjs');

/**
 * Compara contraseña en texto plano con hash bcrypt
 * @param {string} plainPassword - Contraseña ingresada
 * @param {string} hashedPassword - Hash almacenado en .env
 * @returns {Promise<boolean>}
 */
async function verifyPassword(plainPassword, hashedPassword) {
  try {
    return await bcrypt.compare(plainPassword, hashedPassword);
  } catch (error) {
    console.error('Error verifying password:', error);
    return false;
  }
}

/**
 * Genera hash de una contraseña (útil para crear nuevas)
 * @param {string} plainPassword
 * @returns {Promise<string>}
 */
async function hashPassword(plainPassword) {
  const saltRounds = 10;
  return await bcrypt.hash(plainPassword, saltRounds);
}

/**
 * Genera un delay aleatorio para prevenir timing attacks
 * @param {number} min - Milisegundos mínimos
 * @param {number} max - Milisegundos máximos
 */
function randomDelay(min = 100, max = 300) {
  const delay = Math.floor(Math.random() * (max - min + 1)) + min;
  return new Promise(resolve => setTimeout(resolve, delay));
}

module.exports = {
  verifyPassword,
  hashPassword,
  randomDelay
};
