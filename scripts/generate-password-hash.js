const bcrypt = require('bcryptjs');

const password = process.argv[2] || 'DL2026';
const saltRounds = 10;

console.log('\n🔐 Generating bcrypt hash...\n');

bcrypt.hash(password, saltRounds, (err, hash) => {
  if (err) {
    console.error('❌ Error generating hash:', err);
    process.exit(1);
  }

  console.log('=== BCRYPT HASH GENERADO ===');
  console.log(hash);
  console.log('\n📋 Copia este hash y actualiza tu .env.local:');
  console.log(`PORTFOLIO_PASSWORD_HASH=${hash}`);
  console.log('\n💡 Tip: Mantén PORTFOLIO_PASSWORD temporalmente para transición');
  console.log('Una vez verificado que funciona, puedes remover PORTFOLIO_PASSWORD\n');
});
