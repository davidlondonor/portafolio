const bcrypt = require('bcryptjs');

const password = 'DL2026';
const hash = '$2b$10$UbjQhVyoXwqEa53uz0sWt.pBpU4TUrzVeHG40o/ND5O.mxFPZkQqm';

console.log('Testing password:', password);
console.log('Against hash:', hash);

bcrypt.compare(password, hash, (err, result) => {
  if (err) {
    console.error('Error:', err);
  } else {
    console.log('Match result:', result);
  }

  // También probar generando un nuevo hash
  bcrypt.hash(password, 10, (err, newHash) => {
    console.log('\nNew hash generated:', newHash);
    bcrypt.compare(password, newHash, (err, newResult) => {
      console.log('New hash matches:', newResult);
    });
  });
});
