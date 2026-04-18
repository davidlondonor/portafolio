const bcrypt = require('bcryptjs');

const rawPassword = process.argv[2] || 'DL2026';
const password = rawPassword.trim().toLowerCase();
const saltRounds = 10;

console.log(`\n🔐 Generating bcrypt hash for normalized input "${password}" (lowercase + trimmed)...\n`);

bcrypt.hash(password, saltRounds, (err, hash) => {
  if (err) {
    console.error('❌ Error generating hash:', err);
    process.exit(1);
  }

  // Escapar $ para evitar interpolación de variables en .env
  const escapedHash = hash.replace(/\$/g, '\\$');

  console.log('=== BCRYPT HASH GENERADO ===');
  console.log(hash);
  console.log('\n📋 Copia esta línea a tu .env.local ($ ya escapados):');
  console.log(`PORTFOLIO_PASSWORD_HASH=${escapedHash}`);
  console.log('\n⚠️  Los caracteres $ deben escaparse con \\ en archivos .env\n');
});
